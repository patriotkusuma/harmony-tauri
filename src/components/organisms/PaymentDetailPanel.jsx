import React from 'react';
import { CardBody, Button, Row, Col, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import CustomerAvatar from 'components/atoms/CustomerAvatar';
import PayableOrderItem from 'components/Card/PayableOrderItem';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');
import { toast } from 'react-toastify';

const PaymentDetailPanel = ({ 
    customer, 
    onOpenPayment, 
    onSendQris, 
    onStatusUpdate,
    calculateCustomerBill
}) => {
    if (!customer) {
        return (
            <div className="h-100 rounded-xl d-flex flex-column align-items-center justify-content-center p-5 text-center bg-white border shadow-sm payment-empty-panel" style={{ minHeight: '520px' }}>
                <div className="avatar avatar-xl rounded-circle bg-primary-soft text-primary mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                    <i className="fas fa-hand-holding-usd fa-2x" />
                </div>
                <h4 className="text-dark font-weight-bold mb-2 empty-title">Pilih Pelanggan</h4>
                <p className="text-muted small mb-4 empty-desc" style={{ maxWidth: '280px' }}>
                    Pilih pelanggan dari daftar di sebelah kiri untuk melihat rincian nota dan memproses pembayaran tagihan.
                </p>
                <div className="p-3 rounded-lg bg-light border text-start w-100 shortcut-box" style={{ maxWidth: '300px' }}>
                    <div className="small font-weight-bold text-dark mb-1 shortcut-title">
                        <i className="fas fa-keyboard me-2 text-primary" /> Shortcut Kasir:
                    </div>
                    <ul className="mb-0 ps-3 text-muted small shortcut-list">
                        <li><code>/</code> : Fokus pencarian pelanggan</li>
                        <li><code>F8</code> : Buka modal bayar saat pelanggan dipilih</li>
                        <li><code>Esc</code> : Batal pilih / tutup modal</li>
                    </ul>
                </div>
                <style>{`
                    .bg-primary-soft { background: rgba(94, 114, 228, 0.12); }
                    .rounded-xl { border-radius: 14px; }
                    .rounded-lg { border-radius: 10px; }

                    /* Dark Mode */
                    body.dark-mode .payment-empty-panel {
                        background: #1e293b !important;
                        border-color: rgba(255, 255, 255, 0.08) !important;
                    }
                    body.dark-mode .empty-title {
                        color: #f8fafc !important;
                    }
                    body.dark-mode .empty-desc {
                        color: #94a3b8 !important;
                    }
                    body.dark-mode .shortcut-box {
                        background: #0f172a !important;
                        border-color: rgba(255, 255, 255, 0.1) !important;
                    }
                    body.dark-mode .shortcut-title {
                        color: #f8fafc !important;
                    }
                    body.dark-mode .shortcut-list {
                        color: #94a3b8 !important;
                    }
                    body.dark-mode .shortcut-list code {
                        background: #1e293b;
                        color: #818cf8;
                    }
                `}</style>
            </div>
        );
    }

    const bill = calculateCustomerBill ? calculateCustomerBill(customer) : (customer.total_sisa || 0);
    const unpaidAmount = Math.abs(bill);
    const totalPaid = customer.telah_bayar !== undefined 
        ? customer.telah_bayar 
        : (customer.pesanans || []).reduce((s, p) => s + Number(p.paid || 0), 0);
    const totalHarga = customer.total_bayar !== undefined 
        ? customer.total_bayar 
        : (customer.pesanans || []).reduce((s, p) => s + Number(p.total_harga || 0), 0);

    const handleCopyWa = () => {
        if (!customer) return;

        const sortedPesanans = [...(customer.pesanans || [])].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
            return dateB - dateA;
        });

        if (sortedPesanans.length === 0) {
            toast.warning("Tidak ada tagihan untuk disalin.");
            return;
        }

        const lines = [];
        lines.push(`🧺 *Tagihan Laundry _${customer.nama}_* 🧺`);
        lines.push(`--------------------------------------`);
        lines.push(``);
        lines.push(`Halo ${customer.nama}, berikut rincian tagihan laundry Anda:`);
        lines.push(``);

        sortedPesanans.forEach((p) => {
            const dateFormatted = p.created_at 
                ? dayjs(p.created_at).locale('id').format('HH:mm – dddd, D MMMM YYYY')
                : '-';
            const sisa = p.total_harga - p.paid;
            const formattedSisa = new Intl.NumberFormat('id-ID').format(sisa);

            lines.push(`📌 *${p.kode_pesan}*`);
            lines.push(`• Tanggal : ${dateFormatted}`);
            lines.push(`• Sisa Tagihan : *Rp ${formattedSisa}*`);
            lines.push(`--------------------------------------`);
        });

        lines.push(``);
        const formattedTotal = new Intl.NumberFormat('id-ID').format(unpaidAmount);
        lines.push(`💰 *Total Tagihan Keseluruhan:* *Rp ${formattedTotal}*`);
        lines.push(``);
        lines.push(`Terima kasih telah menggunakan layanan kami 🙏`);
        lines.push(`*Harmony Laundry*`);

        const message = lines.join('\n');

        navigator.clipboard.writeText(message)
            .then(() => {
                toast.success("Rincian tagihan berhasil disalin ke clipboard!");
            })
            .catch((err) => {
                console.error("Gagal menyalin text: ", err);
                toast.error("Gagal menyalin tagihan.");
            });
    };

    return (
        <div className="payment-ticket-panel bg-white rounded-xl shadow-sm border h-100 d-flex flex-column overflow-hidden">
            {/* Header: Customer Info */}
            <div className="p-3 border-bottom bg-gradient-primary text-white position-relative payment-panel-head">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                        <div 
                            className="avatar avatar-md rounded-circle border border-2 border-white bg-white text-primary font-weight-bold me-3 d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '48px', height: '48px', flexShrink: 0, overflow: 'hidden' }}
                        >
                            <CustomerAvatar customer={customer} />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-white font-weight-bold mb-0 text-truncate">{customer.nama}</h4>
                            <div className="text-white opacity-8 small font-weight-bold text-truncate">
                                <i className="fab fa-whatsapp me-1 text-success-light" />
                                {customer.telpon || '-'}
                                {customer.keterangan && (
                                    <span className="ms-2 badge bg-white-20 text-white">• {customer.keterangan}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Badge color="light" pill className="text-dark font-weight-bold px-2 py-1 shadow-none" style={{ fontSize: '0.7rem' }}>
                        {unpaidAmount > 0 ? "Tertagih" : "Lunas"}
                    </Badge>
                </div>
            </div>

            <CardBody className="p-3 d-flex flex-column flex-grow-1 overflow-hidden payment-panel-body">
                {/* Financial Debt Summary Card */}
                <div className="p-3 rounded-xl mb-3 shadow-none border debt-summary-box" style={{ background: '#fff5f5', borderColor: '#febcbe' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted font-weight-bold debt-box-sub" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                            TOTAL SISA TAGIHAN
                        </span>
                        <span className="h3 font-weight-900 text-danger mb-0 debt-box-amount" style={{ color: '#f5365c' }}>
                            <RupiahFormater value={unpaidAmount} />
                        </span>
                    </div>

                    <div className="d-flex justify-content-between pt-2 border-top text-muted small debt-box-footer" style={{ borderColor: '#fee2e2' }}>
                        <div>Total Biaya: <strong className="text-dark total-val"><RupiahFormater value={totalHarga} /></strong></div>
                        <div>Sudah Bayar: <strong className="text-success paid-val"><RupiahFormater value={totalPaid} /></strong></div>
                    </div>

                    {unpaidAmount > 0 && (
                        <div className="d-flex flex-column mt-3 gap-2" style={{ gap: '8px' }}>
                            {/* Big Primary Action: Bayar Sekarang */}
                            <Button
                                color="primary"
                                block
                                className="py-2 font-weight-900 shadow-md text-white border-0 rounded-pill btn-pay-now"
                                onClick={onOpenPayment}
                                style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}
                            >
                                <i className="fas fa-cash-register me-2" /> BAYAR SEKARANG (F8)
                            </Button>

                            {/* WhatsApp Fast Actions */}
                            <div className="d-flex gap-2" style={{ gap: '8px' }}>
                                <Button 
                                    color="success" 
                                    outline 
                                    block 
                                    size="sm" 
                                    className="rounded-pill py-1 font-weight-bold bg-white text-xs border-2 shadow-none btn-outline-custom" 
                                    onClick={onSendQris}
                                >
                                    <i className="fab fa-whatsapp me-1" /> QRIS WA
                                </Button>
                                <Button 
                                    color="info" 
                                    outline 
                                    block 
                                    size="sm" 
                                    className="rounded-pill py-1 font-weight-bold bg-white text-xs border-2 shadow-none btn-outline-custom" 
                                    onClick={handleCopyWa}
                                >
                                    <i className="far fa-copy me-1" /> Salin WA
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Items List Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-uppercase text-muted font-weight-bold orders-head-title" style={{ fontSize: '0.7rem' }}>
                        Daftar Nota Pesanan ({customer.pesanans?.length || 0})
                    </span>
                    {customer.keterangan && (
                        <Badge color="light" className="text-dark border font-weight-normal px-2 customer-info-pill">
                            {customer.keterangan}
                        </Badge>
                    )}
                </div>

                {/* Scrollable Order Items */}
                <div className="flex-grow-1 overflow-auto pe-1 orders-scroll-area" style={{ maxHeight: '280px' }}>
                    {Array.isArray(customer.pesanans) && customer.pesanans.length > 0 ? (
                        customer.pesanans.map((pesanan) => (
                            <PayableOrderItem key={pesanan.id || pesanan.kode_pesan} pesanan={pesanan} />
                        ))
                    ) : (
                        <div className="text-center py-4 border rounded dashed-border bg-light text-muted small orders-empty">
                            Tidak ada rincian nota pesanan.
                        </div>
                    )}
                </div>

                {/* Status Updates / Pickup Actions */}
                <div className="mt-auto pt-3 border-top actions-footer">
                    {unpaidAmount <= 0 && customer.pesanan_takable && customer.pesanan_takable.length > 0 && (
                        <Button 
                            color="success" 
                            block 
                            className="rounded-pill py-2 shadow-md font-weight-bold mb-2 text-white" 
                            onClick={() => onStatusUpdate(customer, 'diambil')}
                        >
                            <i className="fas fa-hand-holding-heart me-2" /> Konfirmasi Pengambilan Barang
                        </Button>
                    )}

                    <div className="d-flex gap-2" style={{ gap: '8px' }}>
                        <Button 
                            color="secondary" 
                            outline 
                            block 
                            size="sm" 
                            className="rounded-pill font-weight-bold bg-white text-dark text-xs border py-1 shadow-none btn-outline-custom" 
                            onClick={() => onStatusUpdate(customer, 'selesai')}
                        >
                            Tandai Selesai
                        </Button>
                        <Button 
                            color="secondary" 
                            outline 
                            block 
                            size="sm" 
                            className="rounded-pill font-weight-bold bg-white text-dark text-xs border py-1 shadow-none btn-outline-custom" 
                            onClick={() => onStatusUpdate(customer, 'diambil')}
                        >
                            Tandai Dikirim
                        </Button>
                    </div>
                </div>
            </CardBody>

            <style>{`
                .rounded-xl { border-radius: 14px; }
                .text-success-light { color: #2dce89; }
                .bg-white-20 { background: rgba(255, 255, 255, 0.2); }
                .dashed-border { border: 1px dashed #dee2e6 !important; }

                /* ── Dark Mode ─────────────────────────────────────────── */
                body.dark-mode .payment-ticket-panel {
                    background: #1e293b !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .payment-panel-body {
                    background: #1e293b !important;
                }
                body.dark-mode .debt-summary-box {
                    background: rgba(244, 63, 94, 0.1) !important;
                    border-color: rgba(244, 63, 94, 0.25) !important;
                }
                body.dark-mode .debt-box-sub {
                    color: #cbd5e1 !important;
                }
                body.dark-mode .debt-box-amount {
                    color: #fb7185 !important;
                }
                body.dark-mode .debt-box-footer {
                    border-top-color: rgba(244, 63, 94, 0.2) !important;
                    color: #94a3b8 !important;
                }
                body.dark-mode .total-val {
                    color: #f8fafc !important;
                }
                body.dark-mode .paid-val {
                    color: #4ade80 !important;
                }
                body.dark-mode .btn-outline-custom {
                    background: #0f172a !important;
                    border-color: rgba(255, 255, 255, 0.15) !important;
                    color: #cbd5e1 !important;
                }
                body.dark-mode .btn-outline-custom:hover {
                    background: #1e293b !important;
                    color: #ffffff !important;
                }
                body.dark-mode .orders-head-title {
                    color: #94a3b8 !important;
                }
                body.dark-mode .customer-info-pill {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: #e2e8f0 !important;
                }
                body.dark-mode .orders-empty {
                    background: #0f172a !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    color: #94a3b8 !important;
                }
                body.dark-mode .actions-footer {
                    border-top-color: rgba(255, 255, 255, 0.08) !important;
                }
            `}</style>
        </div>
    );
};

export default PaymentDetailPanel;

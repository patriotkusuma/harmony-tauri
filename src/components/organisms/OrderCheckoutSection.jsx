import React from 'react';
import { Card, CardBody, CardHeader, Row, Col, Button, Input, Badge } from 'reactstrap';
import moment from 'moment';
import RupiahFormater from 'utils/RupiahFormater';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const OrderCheckoutSection = ({
    kodePesan,
    nama,
    telpon,
    estimasi,
    subTotal,
    isLunas,
    setIsLunas,
    antar,
    setAntar,
    onEditCustomer,
    onSubmitOrder,
    isOrderDisabled,
    gabungBill,
    setGabungBill,
    onSendConfirmation
}) => {
    const handleSendConfirmation = async () => {
        if (!telpon) {
            toast.warning("Nomor WhatsApp pelanggan belum diisi!");
            return;
        }
        
        const { value: weight } = await Swal.fire({
            title: 'Kirim Konfirmasi Tagihan',
            input: 'number',
            inputLabel: 'Berat Timbangan (Kg)',
            inputPlaceholder: 'Misal: 2.5',
            inputAttributes: { step: '0.1', min: '0' },
            showCancelButton: true,
            confirmButtonText: 'Kirim WA',
            cancelButtonText: 'Batal',
            html: '<p class="small text-muted">Akan mengirim WA berisi estimasi harga Express vs Reguler ke pelanggan berdasarkan berat timbangan (hanya berlaku jika ada tagihan belum lunas!).</p>'
        });

        if (weight) {
            try {
                // Konversi dari Kg ke Gram untuk Backend
                const weightInGrams = parseFloat(weight) * 1000;
                await onSendConfirmation(weightInGrams);
                toast.success("Pesan konfirmasi WA berhasil dikirim!");
            } catch (error) {
                toast.error("Gagal mengirim pesan WA");
            }
        }
    };

    return (
        <Card className="shadow-premium border-0 overflow-hidden mb-4 bg-white">
            <CardHeader className="bg-gradient-secondary py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-dark font-weight-900 ls-1 text-uppercase">Rincian & Checkout</h4>
                    <Button color="primary" size="sm" className="rounded-pill px-3 py-1 font-weight-bold shadow-sm" onClick={onEditCustomer}>
                        <i className="fas fa-user-edit me-2" /> F2: Ubah
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="py-4 px-4">
                {/* Customer Identity */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-1">
                        <i className="fas fa-fingerprint text-muted me-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">Kode Pesanan:</span>
                        <span className="ms-auto font-weight-900 text-dark text-end">{kodePesan}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <i className="fas fa-user text-muted me-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">Nama:</span>
                        <span className="ms-auto font-weight-900 text-dark text-end">{nama || '-'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="fab fa-whatsapp text-muted me-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">WhatsApp:</span>
                        <span className="ms-auto font-weight-900 text-dark text-end">
                            {telpon || '-'}
                            {telpon && (
                                <Button color="success" size="sm" className="ms-3 rounded-pill py-1 px-2" onClick={handleSendConfirmation}>
                                    <i className="fas fa-paper-plane me-1" /> Konfirmasi
                                </Button>
                            )}
                        </span>
                    </div>
                </div>

                <hr className="my-3 opacity-1 border-light" />

                {/* Timeline */}
                <div className="bg-lighter p-3 rounded-lg mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small font-weight-bold">Waktu Masuk</span>
                        <span className="text-dark small font-weight-900">{moment().format('HH:mm, DD MMM YY')}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="text-muted small font-weight-bold">Estimasi Selesai</span>
                        <span className="text-primary small font-weight-900">{moment(estimasi).format('HH:mm, DD MMM YY')}</span>
                    </div>
                </div>

                {/* Delivery Toggle - Argon Native Custom Toggle */}
                <div 
                    className="d-flex align-items-center justify-content-between mb-4 p-3 border rounded px-4 bg-secondary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setAntar(antar === 1 ? 0 : 1)}
                >
                    <div className="d-flex align-items-center">
                        <div className={`icon icon-shape icon-sm rounded-circle me-3 text-white ${antar === 1 ? 'bg-success' : 'bg-muted'}`} style={{ width: '30px', height: '30px' }}>
                            <i className="fas fa-truck" />
                        </div>
                        <span className="font-weight-bold text-dark text-sm" style={{ userSelect: 'none' }}>Layanan Antar / Jemput?</span>
                    </div>
                    <div style={{ pointerEvents: 'none' }}>
                        <label className="custom-toggle custom-toggle-success mb-0">
                            <input 
                                type="checkbox" 
                                checked={antar === 1}
                                readOnly
                            />
                            <span 
                                className="custom-toggle-slider rounded-circle" 
                                data-label-off="Tidak" 
                                data-label-on="Iya" 
                            />
                        </label>
                    </div>
                </div>

                {/* Gabung Bill Toggle */}
                <div 
                    className="d-flex align-items-center justify-content-between mb-4 p-3 border rounded px-4 bg-secondary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setGabungBill(gabungBill === false ? true : false)}
                >
                    <div className="d-flex align-items-center">
                        <div className={`icon icon-shape icon-sm rounded-circle me-3 text-white ${gabungBill ? 'bg-info' : 'bg-muted'}`} style={{ width: '30px', height: '30px' }}>
                            <i className="fas fa-object-group" />
                        </div>
                        <div className="d-flex flex-column" style={{ userSelect: 'none' }}>
                            <span className="font-weight-bold text-dark text-sm">Gabung ke Tagihan Aktif</span>
                            <span className="text-muted" style={{fontSize: '0.65rem'}}>Jika pelanggan sudah punya hutang</span>
                        </div>
                    </div>
                    <div style={{ pointerEvents: 'none' }}>
                        <label className="custom-toggle custom-toggle-info mb-0">
                            <input 
                                type="checkbox" 
                                checked={gabungBill}
                                readOnly
                            />
                            <span 
                                className="custom-toggle-slider rounded-circle" 
                                data-label-off="Tidak" 
                                data-label-on="Iya" 
                            />
                        </label>
                    </div>
                </div>

                {/* Status Pembayaran */}
                <div className="btn-group w-100 mb-4 rounded-pill overflow-hidden border p-1 bg-light shadow-inner">
                    <Button 
                        color={!isLunas ? "danger" : "link"} 
                        size="sm" 
                        className={`w-50 rounded-pill font-weight-bold border-0 ${!isLunas ? 'shadow-sm' : 'text-muted'}`}
                        onClick={() => setIsLunas(false)}
                    >
                        BELUM LUNAS
                    </Button>
                    <Button 
                        color={isLunas ? "success" : "link"} 
                        size="sm" 
                        className={`w-50 rounded-pill font-weight-bold border-0 ${isLunas ? 'shadow-sm' : 'text-muted'}`}
                        onClick={() => setIsLunas(true)}
                    >
                        LUNAS
                    </Button>
                </div>

                {/* Submit Action */}
                <Button
                    disabled={isOrderDisabled}
                    color="primary"
                    block
                    className="py-3 shadow-premium rounded-xl transform-active-scale-98"
                    onClick={onSubmitOrder}
                >
                    <div className="d-flex justify-content-between align-items-center px-2">
                        <div className="text-start">
                            <span className="h4 text-white d-block mb-0 font-weight-bold">PROSES PESANAN</span>
                            <small className="text-white-50 uppercase ls-1 font-weight-bold">Klik untuk bayar</small>
                        </div>
                        <div className="text-end d-flex flex-column align-items-end">
                            <span className="h2 text-white font-weight-900 mb-0"><RupiahFormater value={subTotal} /></span>
                            <i className="fas fa-chevron-circle-right mt-1" />
                        </div>
                    </div>
                </Button>
            </CardBody>
            <style>{`
                .rounded-xl { border-radius: 1rem !important; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
                .transform-active-scale-98:active { transform: scale(0.98); }
            `}</style>
        </Card>
    );
};

export default OrderCheckoutSection;

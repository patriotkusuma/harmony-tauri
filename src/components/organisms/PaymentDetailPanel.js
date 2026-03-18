import React from 'react';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import CustomerAvatar from 'components/atoms/CustomerAvatar';
import PayableOrderItem from 'components/Card/PayableOrderItem';

const PaymentDetailPanel = ({ 
    customer, 
    onOpenPayment, 
    onSendQris, 
    onStatusUpdate,
    calculateCustomerBill
}) => {
    if (!customer) {
        return (
            <div className="h-100 rounded-xl d-flex flex-column align-items-center justify-content-center p-5 text-center shadow-lg border-2 dashed-border glass-effect" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="icon icon-lg icon-shape bg-white shadow rounded-circle text-primary mb-4 border d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-user-check fa-2x" />
                </div>
                <h3 className="text-white font-weight-bold mb-2">Pilih Pelanggan</h3>
                <p className="text-white opacity-8 text-sm px-4">Silakan klik salah satu pelanggan di sebelah kiri untuk melihat rincian tagihan dan proses pembayaran.</p>
                <style>{`
                    .dashed-border { border: 2px dashed rgba(255,255,255,0.3) !important; }
                    .glass-effect { backdrop-filter: blur(5px); }
                `}</style>
            </div>
        );
    }

    const bill = calculateCustomerBill(customer);
    const unpaidAmount = Math.abs(bill);
    const totalPaid = (customer.pesanans || []).reduce((s, p) => s + Number(p.paid || 0), 0);
    const totalHarga = (customer.pesanans || []).reduce((s, p) => s + Number(p.total_harga || 0), 0);

    return (
        <div className="payment-right-panel sticky-top rounded-xl overflow-hidden glass-card shadow-premium border-0 h-100" style={{ top: '20px', background: 'rgba(255, 255, 255, 0.98)' }}>
            <div className="bg-gradient-primary py-3 text-center position-relative">
                <div className="position-absolute" style={{ top: '8px', right: '12px' }}>
                    <Badge color="neutral" pill className="px-2 py-1 shadow-sm font-weight-bold border" style={{ fontSize: '0.6rem' }}>{unpaidAmount > 0 ? "Tertagih" : "Lunas"}</Badge>
                </div>
                <div className="d-flex align-items-center px-4">
                    <div className="avatar avatar-md rounded-circle shadow-lg border border-2 border-white bg-white overflow-hidden d-flex align-items-center justify-content-center text-primary font-weight-bold mr-3" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                        <CustomerAvatar customer={customer} />
                    </div>
                    <div className="text-left overflow-hidden">
                        <h4 className="text-white font-weight-bold mb-0 text-capitalize ls-1 text-truncate">{customer.nama}</h4>
                        <p className="text-white opacity-8 mb-0 font-weight-bold text-xs"><i className="fab fa-whatsapp mr-1 text-success-light" />{customer.telpon || '-'}</p>
                    </div>
                </div>
            </div>

            <CardBody className="px-3 py-3 d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                {/* Financial Summary */}
                <div className="p-3 rounded-lg shadow-inner bg-light border mb-3">
                    <Row className="mb-1 align-items-center">
                        <Col className="text-muted font-weight-bold text-xs uppercase ls-1">SISA TAGIHAN</Col>
                        <Col className="text-right h4 font-weight-900 text-danger mb-0" style={{ color: '#f5365c' }}>
                            <RupiahFormater value={unpaidAmount} />
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-2 pt-2 border-top" style={{ fontSize: '0.7rem' }}>
                        <div className="text-muted">Total: <span className="font-weight-bold text-dark"><RupiahFormater value={totalHarga} /></span></div>
                        <div className="text-muted">Bayar: <span className="font-weight-bold text-success"><RupiahFormater value={totalPaid} /></span></div>
                    </div>
                    
                    {unpaidAmount > 0 && (
                        <div className="d-flex mt-3" style={{ gap: '8px' }}>
                            <Button color="success" outline block size="sm" className="rounded-pill py-1 font-weight-bold bg-white shadow-sm border-2 text-xs" onClick={onSendQris}>
                                <i className="fab fa-whatsapp mr-1" /> QRIS WA
                            </Button>
                            <Button
                                color="default"
                                size="sm"
                                block
                                className="rounded-pill shadow-premium py-1 m-0 border-0"
                                onClick={onOpenPayment}
                            >
                                <span className="font-weight-bold text-white text-xs">BAYAR SEKARANG</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Items List */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-uppercase text-muted ls-1 mb-0 font-weight-bold" style={{ fontSize: '0.65rem' }}>Pesanan Aktif</h6>
                    {customer.keterangan && <Badge color="info" className="text-80 shadow-none px-2">{customer.keterangan}</Badge>}
                </div>
                <div className="pr-2 hide-scrollbar flex-grow-1" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    {Array.isArray(customer.pesanans) && customer.pesanans.length > 0 ? (
                        customer.pesanans.map((pesanan) => (
                            <PayableOrderItem key={pesanan.id || pesanan.kode_pesan} pesanan={pesanan} />
                        ))
                    ) : (
                        <div className="text-center py-4 border rounded dashed-border bg-white italic text-muted small">Tidak ada rincian item.</div>
                    )}
                    {customer.pesanan_takable && customer.pesanan_takable.length > 0 && unpaidAmount <= 0 && (
                        <div className="alert bg-success-soft text-success text-center mt-3 py-2 small font-weight-bold">
                            <i className="fas fa-check-circle mr-2" /> Barang siap diambil.
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-3">
                    {unpaidAmount <= 0 && customer.pesanan_takable && customer.pesanan_takable.length > 0 && (
                        <Button color="success" block className="rounded-pill py-3 shadow-premium font-weight-900 mb-3 animate-pulse" onClick={() => onStatusUpdate(customer, 'diambil')}>
                            <i className="fas fa-hand-holding-heart mr-2" /> KONFIRMASI PENGAMBILAN
                        </Button>
                    )}

                    <div className="d-flex" style={{ gap: '8px' }}>
                        <Button color="warning" outline block size="sm" className="rounded-pill font-weight-bold bg-white text-xs border-2 shadow-none py-2" onClick={() => onStatusUpdate(customer, 'selesai')}>
                            SELESAI
                        </Button>
                        <Button color="info" outline block size="sm" className="rounded-pill font-weight-bold bg-white text-xs border-2 shadow-none py-2" onClick={() => onStatusUpdate(customer, 'diambil')}>
                            DIKIRIM
                        </Button>
                    </div>
                </div>
            </CardBody>
            <style>{`
                .text-80 { font-size: 80%; }
                .text-success-light { color: #2dce89; }
                .bg-success-soft { background: rgba(45, 206, 137, 0.1); }
                .animate-fade-in { animation: fadeIn 0.5s ease; }
                .animate-pulse { animation: pulse-green 2s infinite; }
                @keyframes pulse-green {
                    0% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(45, 206, 137, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0); }
                }
                .dashed-border { border: 1px dashed #dee2e6 !important; }
            `}</style>
        </div>
    );
};

export default PaymentDetailPanel;

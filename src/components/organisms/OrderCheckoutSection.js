import React from 'react';
import { Card, CardBody, CardHeader, Row, Col, Button, Input, Badge } from 'reactstrap';
import moment from 'moment';
import RupiahFormater from 'utils/RupiahFormater';

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
    isOrderDisabled
}) => {
    return (
        <Card className="shadow-premium border-0 overflow-hidden mb-4 bg-white">
            <CardHeader className="bg-gradient-secondary py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-dark font-weight-900 ls-1 text-uppercase">Rincian & Checkout</h4>
                    <Button color="primary" size="sm" className="rounded-pill px-3 py-1 font-weight-bold shadow-sm" onClick={onEditCustomer}>
                        <i className="fas fa-user-edit mr-2" /> F2: Ubah
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="py-4 px-4">
                {/* Customer Identity */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-1">
                        <i className="fas fa-fingerprint text-muted mr-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">Kode Pesanan:</span>
                        <span className="ml-auto font-weight-900 text-dark text-right">{kodePesan}</span>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                        <i className="fas fa-user text-muted mr-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">Nama:</span>
                        <span className="ml-auto font-weight-900 text-dark text-right">{nama || '-'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="fab fa-whatsapp text-muted mr-2" />
                        <span className="small text-muted font-weight-bold uppercase ls-1">WhatsApp:</span>
                        <span className="ml-auto font-weight-900 text-dark text-right">{telpon || '-'}</span>
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

                {/* Delivery Toggle */}
                <div className="d-flex align-items-center justify-content-between mb-4 p-2 border rounded-pill px-4">
                    <div className="d-flex align-items-center">
                        <i className={`fas fa-truck mr-2 ${antar === 1 ? 'text-success' : 'text-muted'}`} />
                        <span className="font-weight-bold text-dark small">Antar Jemput ?</span>
                    </div>
                    <div className="custom-control custom-switch h-auto p-0 m-0">
                        <Input
                            type="checkbox"
                            id="antarJemputSwitch"
                            className="custom-control-input"
                            checked={antar === 1}
                            onChange={() => setAntar(antar === 1 ? 0 : 1)}
                        />
                        <label className="custom-control-label" htmlFor="antarJemputSwitch" style={{ cursor: 'pointer' }}></label>
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
                        <div className="text-left">
                            <span className="h4 text-white d-block mb-0 font-weight-bold">PROSES PESANAN</span>
                            <small className="text-white-50 uppercase ls-1 font-weight-bold">Klik untuk bayar</small>
                        </div>
                        <div className="text-right d-flex flex-column align-items-end">
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

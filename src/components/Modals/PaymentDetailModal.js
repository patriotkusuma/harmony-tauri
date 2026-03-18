import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Row, Col, Badge, Table, Button } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import moment from 'moment';
import CustomerAvatar from 'components/atoms/CustomerAvatar';
import axios from 'services/axios-instance';

const PaymentDetailModal = ({ isOpen, toggle, paymentId }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (isOpen && paymentId) {
            fetchDetail();
        } else if (!isOpen) {
            setDetail(null);
            setError(null);
        }
    }, [isOpen, paymentId]);

    const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`api/pembayaran/detail/${paymentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDetail(res.data);
        } catch (err) {
            console.error("Error fetching payment detail:", err);
            setError("Gagal memuat detail pembayaran.");
        } finally {
            setLoading(false);
        }
    };

    const getTipeBadge = (tipe) => {
        switch (tipe) {
            case "qris": return <Badge color="success" pill>QRIS</Badge>;
            case "cash": return <Badge color="warning" pill text="white">CASH</Badge>;
            case "tf": return <Badge color="primary" pill>TRANSFER</Badge>;
            default: return <Badge color="secondary" pill>{tipe}</Badge>;
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg" contentClassName="border-0 shadow-lg rounded-xl overflow-hidden">
            <ModalHeader toggle={toggle} className="bg-gradient-info text-white border-0 py-4">
                <h4 className="modal-title font-weight-bold ml-2">Detail Transaksi Pembayaran</h4>
            </ModalHeader>
            <ModalBody className="p-0">
                {loading ? (
                    <div className="text-center py-7">
                        <i className="fas fa-circle-notch fa-spin fa-3x text-primary mb-3" />
                        <h4 className="text-dark font-weight-bold">Memuat Detail...</h4>
                    </div>
                ) : error ? (
                    <div className="text-center py-7 text-danger">
                        <i className="fas fa-exclamation-triangle fa-3x mb-3" />
                        <h4 className="font-weight-bold">{error}</h4>
                        <Button color="link" onClick={fetchDetail}>Coba Lagi</Button>
                    </div>
                ) : detail && (
                    <div className="p-4">
                        <Row className="mb-4 align-items-center">
                            <Col md="6">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar avatar-md rounded-circle shadow border-2 border-white bg-white overflow-hidden d-flex align-items-center justify-content-center text-primary font-weight-bold mr-3" style={{ width: '60px', height: '60px' }}>
                                        <CustomerAvatar customer={detail.customer} />
                                    </div>
                                    <div>
                                        <h4 className="mb-0 font-weight-bold text-dark">{detail.customer?.nama}</h4>
                                        <p className="text-muted mb-0 small"><i className="fab fa-whatsapp mr-1 text-success" />{detail.customer?.telpon}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" className="text-md-right">
                                <div className="mb-2">
                                    {getTipeBadge(detail.tipe)}
                                </div>
                                <h6 className="text-muted mb-0 font-weight-bold">
                                    <i className="far fa-calendar-alt mr-2" />
                                    {moment(detail.created_at).format('DD MMMM YYYY, HH:mm')}
                                </h6>
                            </Col>
                        </Row>

                        <div className="bg-light p-4 rounded-lg shadow-inner mb-4">
                            <Row>
                                <Col sm="4" className="text-center border-right">
                                    <small className="text-muted d-block uppercase ls-1 font-weight-bold mb-1">Total Tagihan</small>
                                    <h3 className="mb-0 font-weight-900 text-dark"><RupiahFormater value={detail.total_pembayaran} /></h3>
                                </Col>
                                <Col sm="4" className="text-center border-right">
                                    <small className="text-muted d-block uppercase ls-1 font-weight-bold mb-1">Dibayar</small>
                                    <h3 className="mb-0 font-weight-900 text-success"><RupiahFormater value={detail.nominal_bayar} /></h3>
                                </Col>
                                <Col sm="4" className="text-center">
                                    <small className="text-muted d-block uppercase ls-1 font-weight-bold mb-1">Kembalian</small>
                                    <h3 className={`mb-0 font-weight-900 ${detail.kembalian > 0 ? 'text-warning' : 'text-muted'}`}>
                                        <RupiahFormater value={detail.kembalian} />
                                    </h3>
                                </Col>
                            </Row>
                        </div>

                        <h6 className="text-uppercase text-muted ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.75rem' }}>Pesanan yang Dibayar</h6>
                        <div className="table-responsive rounded-lg border">
                            <Table className="align-items-center table-flush mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="py-3 border-0">ID Pesanan</th>
                                        <th className="py-3 border-0 text-right">Alokasi Bayar</th>
                                        <th className="py-3 border-0 text-right">Sisa Kurang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.detail_payments?.map((dp, i) => (
                                        <tr key={i}>
                                            <td className="font-weight-bold text-dark py-3">
                                                <i className="ni ni-paper-diploma text-info mr-2" />
                                                {dp.pesanan?.kode_pesan || `#${dp.id_pesanan}`}
                                            </td>
                                            <td className="text-right py-3 text-success font-weight-bold">
                                                <RupiahFormater value={dp.total_bayar} />
                                            </td>
                                            <td className="text-right py-3 text-muted font-weight-bold">
                                                <RupiahFormater value={dp.kekurangan} />
                                            </td>
                                        </tr>
                                    ))}
                                    {(!detail.detail_payments || detail.detail_payments.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 italic text-muted">Tidak ada rincian pesanan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {detail.keterangan && (
                            <div className="mt-4 p-3 border rounded bg-white shadow-sm">
                                <small className="text-muted d-block font-weight-bold mb-2 uppercase" style={{ fontSize: '0.65rem' }}>Keterangan / Catatan</small>
                                <p className="mb-0 text-dark italic" style={{ fontSize: '0.9rem' }}>"{detail.keterangan}"</p>
                            </div>
                        )}
                        
                        {detail.bukti && (
                            <div className="mt-4">
                                <small className="text-muted d-block font-weight-bold mb-2 uppercase" style={{ fontSize: '0.65rem' }}>Bukti Pembayaran</small>
                                <div className="rounded-lg overflow-hidden border shadow-sm text-center bg-light p-2">
                                    <img 
                                        src={`https://s6.harmonylaundry.my.id/${detail.bukti}`} 
                                        alt="Bukti Bayar" 
                                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Bukti+Gagal+Dimuat'; }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ModalBody>
            <style>{`
                .rounded-xl { border-radius: 1.25rem !important; }
                .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
                .modal-title { font-size: 1.1rem; }
            `}</style>
        </Modal>
    );
};

export default PaymentDetailModal;

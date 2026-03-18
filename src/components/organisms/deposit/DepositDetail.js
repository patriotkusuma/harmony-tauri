import React from 'react';
import { Table, Button, Row, Col, Card, CardBody, Badge, Spinner } from 'reactstrap';
import RupiahFormater from '../../../utils/RupiahFormater';
import moment from 'moment';

const DepositDetail = ({ customer, loading, onBack, onTopUp }) => {
    if (loading && !customer) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="mt-3 text-muted">Memuat riwayat deposit...</p>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="deposit-detail-container animate__animated animate__fadeIn px-4">
            <div className="py-4 d-flex align-items-center">
                <Button color="link" className="text-muted p-0 mr-3" onClick={onBack}>
                    <i className="fas fa-arrow-left fa-lg" />
                </Button>
                <h3 className="mb-0 font-weight-bold">Detail Saldo & Riwayat</h3>
            </div>

            <Row className="mb-4">
                <Col lg="8">
                    <Card className="shadow-premium border-0 overflow-hidden bg-gradient-primary text-white" style={{ borderRadius: '15px' }}>
                        <CardBody className="p-4">
                            <Row className="align-items-center">
                                <Col>
                                    <h4 className="text-uppercase text-white-50 ls-1 mb-1">Customer Info</h4>
                                    <h2 className="mb-0 text-white font-weight-bold">{customer.customer_name}</h2>
                                    <p className="mb-0 opacity-8">{customer.customer_phone}</p>
                                </Col>
                                <Col className="text-right">
                                    <h4 className="text-uppercase text-white-50 ls-1 mb-1">Current Balance</h4>
                                    <h1 className="display-3 mb-0 text-white font-weight-bold">
                                        <RupiahFormater value={customer.saldo} />
                                    </h1>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card className="shadow-premium border-0 h-100 d-flex align-items-center justify-content-center bg-white" style={{ borderRadius: '15px' }}>
                        <CardBody className="text-center p-4">
                            <div className="icon icon-shape bg-info text-white rounded-circle shadow mb-3">
                                <i className="fas fa-coins" />
                            </div>
                            <h5>Butuh Saldo Tambahan?</h5>
                            <Button color="info" className="w-100 mt-2 rounded-pill shadow-sm" onClick={() => onTopUp(customer)}>
                                <i className="fas fa-plus mr-1" /> Top-up Sekarang
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3 font-weight-bold text-dark">
                <i className="fas fa-history mr-2 text-primary" />
                Riwayat Transaksi
            </h4>

            <div className="table-responsive bg-white rounded-lg shadow-sm border overflow-hidden mb-5">
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th className="px-4">Tanggal</th>
                            <th>Saldo Sebelumnya</th>
                            <th>Nominal Top-up</th>
                            <th>Saldo Akhir</th>
                            <th className="px-4">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer.histories?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted"> Belum ada riwayat transaksi </td>
                            </tr>
                        ) : customer.histories?.map((history) => {
                            const finalSaldo = history.last_deposit_amount + history.deposit_amount;
                            return (
                                <tr key={history.id}>
                                    <td className="px-4 text-muted font-weight-500">
                                        {moment(history.tanggal_deposit).format('DD MMM YYYY, HH:mm')}
                                    </td>
                                    <td className="text-muted">
                                        <RupiahFormater value={history.last_deposit_amount} />
                                    </td>
                                    <td>
                                        <Badge color="success" pill className="px-3 py-2">
                                            + <RupiahFormater value={history.deposit_amount} />
                                        </Badge>
                                    </td>
                                    <td className="font-weight-bold text-dark">
                                        <RupiahFormater value={finalSaldo} />
                                    </td>
                                    <td className="px-4 text-muted small">
                                        {history.keterangan || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default DepositDetail;

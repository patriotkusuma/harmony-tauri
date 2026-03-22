import React from 'react';
import { Row, Col, Input, Button, Card, CardHeader } from 'reactstrap';

const OrderHeader = ({ onSearch, onPrintNama, onPrintLastOrder, onRFIDAttach }) => {
    return (
        <Card className="shadow-premium border-0 mb-4 bg-gradient-white">
            <CardHeader className="bg-transparent py-4">
                <Row className="align-items-center">
                    <Col md="6">
                        <h2 className="text-dark font-weight-900 mb-0 ls-1 uppercase">Daftar Paket Laundry</h2>
                        <p className="text-muted mb-0 small font-weight-bold">Pilih layanan dan paket cuci pelanggan di bawah ini.</p>
                    </Col>
                    <Col md="6" className="mt-3 mt-md-0">
                        <div className="d-flex align-items-center">
                            <div className="input-group input-group-alternative input-group-merge shadow-sm flex-grow-1 me-3 rounded-pill overflow-hidden border">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-white border-0"><i className="fas fa-search text-primary" /></span>
                                </div>
                                <Input
                                    placeholder="Cari Paket Cuci (e.g. Kaos, Kiloan...)"
                                    type="text"
                                    className="border-0 font-weight-bold"
                                    onChange={(e) => onSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="d-none d-lg-flex">
                                <Button color="info" size="sm" className="btn-icon shadow-sm rounded-circle p-2 me-2" onClick={onPrintLastOrder} title="F3: Cetak Struk Terakhir">
                                    <i className="fas fa-print" />
                                </Button>
                                <Button color="warning" size="sm" className="btn-icon shadow-sm rounded-circle p-2 me-2" onClick={onRFIDAttach} title="F4: Sangkut RFID Terakhir">
                                    <i className="fas fa-link" />
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardHeader>
            <style>{`
                .bg-gradient-white { background: linear-gradient(135deg, #ffffff 0%, #f1f3f9 100%); }
            `}</style>
        </Card>
    );
};

export default OrderHeader;

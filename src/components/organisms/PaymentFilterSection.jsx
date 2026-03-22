import React from 'react';
import { Row, Col, Input, InputGroup, Form, Button } from 'reactstrap';

const PaymentFilterSection = ({ 
    rowPerPage, 
    onRowPerPageChange, 
    tipe, 
    onTipeChange, 
    dateFrom, 
    setDateFrom, 
    dateTo, 
    setDateTo, 
    searchData, 
    onSearchChange 
}) => {
    return (
        <div className="px-4 pb-4 border-bottom-white-05">
            <Row className="gy-3 align-items-center">
                <Col lg="1" md="2" xs="6">
                    <small className="text-muted d-block font-weight-bold uppercase mb-1" style={{ fontSize: '0.65rem' }}>Show</small>
                    <Input 
                        type="select" 
                        value={rowPerPage}
                        onChange={(e) => onRowPerPageChange(e.target.value)}
                        className="form-control-alternative shadow-none border rounded-pill text-dark font-weight-bold"
                        style={{ height: '40px' }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </Input>
                </Col>
                <Col lg="2" md="3" xs="6">
                    <small className="text-muted d-block font-weight-bold uppercase mb-1" style={{ fontSize: '0.65rem' }}>Metode</small>
                    <Input 
                        type="select" 
                        value={tipe}
                        onChange={(e) => onTipeChange(e.target.value)}
                        className="form-control-alternative shadow-none border rounded-pill text-dark font-weight-bold"
                        style={{ height: '40px' }}
                    >
                        <option value="">Semua Metode</option>
                        <option value="cash">💵 Cash</option>
                        <option value="tf">🔄 Transfer</option>
                        <option value="qris">📱 QRIS</option>
                    </Input>
                </Col>
                <Col lg="3" md="7">
                    <small className="text-muted d-block font-weight-bold uppercase mb-1" style={{ fontSize: '0.65rem' }}>Rentang Waktu</small>
                    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="form-control-alternative shadow-none border rounded-pill text-dark text-xs"
                            style={{ height: '40px' }}
                        />
                        <span className="text-muted">—</span>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="form-control-alternative shadow-none border rounded-pill text-dark text-xs"
                            style={{ height: '40px' }}
                        />
                    </div>
                </Col>
                <Col lg="6" md="12">
                     <small className="text-muted d-block font-weight-bold uppercase mb-1" style={{ fontSize: '0.65rem' }}>Pencarian</small>
                     <InputGroup className="input-group-merge shadow-sm border rounded-pill overflow-hidden bg-white">
                        <Input
                            placeholder="Cari nama pelanggan atau nominal..."
                            className="border-0 px-4 text-dark font-weight-bold"
                            style={{ height: '40px' }}
                            value={searchData}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <div className="input-group-append">
                            <Button color="primary" className="px-4 border-0">
                                <i className="fas fa-search" />
                            </Button>
                        </div>
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default PaymentFilterSection;

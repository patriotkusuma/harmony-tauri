import React from 'react';
import { CardHeader, Row, Col, Input, Button, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const MachineLogHeader = ({ date, setDate, searchTerm, setSearchTerm, onRefresh, loading }) => {
    return (
        <CardHeader className="bg-white border-0 py-4 shadow-sm" style={{ borderRadius: '15px 15px 0 0' }}>
            <Row className="align-items-center">
                <Col lg="4" md="6" className="mb-3 mb-md-0">
                    <div className="d-flex align-items-center">
                        <div className="icon icon-shape bg-soft-primary text-primary rounded-circle mr-3">
                            <i className="fas fa-microchip" />
                        </div>
                        <div>
                            <h3 className="mb-0 text-dark font-weight-bold">Aktivitas Mesin</h3>
                            <p className="text-muted text-xs mb-0 font-weight-bold uppercase ls-1">
                                Real-time System Monitoring
                            </p>
                        </div>
                    </div>
                </Col>
                
                <Col lg="5" md="12" className="mb-3 mb-lg-0">
                    <InputGroup className="input-group-alternative input-group-merge shadow-none border rounded-pill overflow-hidden bg-light">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText className="bg-transparent border-0 pr-0">
                                <i className="fas fa-search text-muted px-3" />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Cari Mesin, Customer, atau Kode Order..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 bg-transparent font-weight-600 text-dark"
                            style={{ height: '42px' }}
                        />
                    </InputGroup>
                </Col>

                <Col lg="3" md="6" className="text-right">
                    <div className="d-flex align-items-center justify-content-md-end" style={{ gap: '12px' }}>
                        <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white" style={{ maxWidth: '160px' }}>
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-transparent border-0 pr-0 pl-2">
                                    <i className="far fa-calendar-alt text-primary" style={{ fontSize: '0.8rem' }} />
                                </span>
                            </div>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-0 bg-transparent font-weight-bold text-dark px-1 text-xs"
                                style={{ height: '35px' }}
                            />
                        </div>
                        <Button
                            color="primary"
                            size="sm"
                            className="rounded-pill px-3 shadow-premium d-flex align-items-center"
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`} />
                            <span className="d-none d-xl-inline">Refresh</span>
                        </Button>
                    </div>
                </Col>
            </Row>
            <style>{`
                .bg-soft-primary { background: rgba(94, 114, 228, 0.1); }
                .ls-1 { letter-spacing: 0.5px; }
            `}</style>
        </CardHeader>
    );
};

export default MachineLogHeader;

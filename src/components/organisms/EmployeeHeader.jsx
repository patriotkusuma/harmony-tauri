import React from 'react';
import { Row, Col, Button, CardHeader, FormGroup, Input } from 'reactstrap';

const EmployeeHeader = ({ onAdd, search, setSearch, onSearch }) => {
    return (
        <CardHeader className="border-0 bg-white py-4 shadow-sm" style={{ borderRadius: '15px 15px 0 0' }}>
            <Row className="align-items-center">
                <Col md="6">
                    <h3 className="mb-0 text-dark font-weight-bold">
                        <i className="fas fa-users me-2 text-primary" />
                        Manajemen Pegawai
                    </h3>
                    <p className="text-muted text-xs mb-0 mt-1 font-weight-bold uppercase">
                        Kelola data staf, akses outlet, dan login sistem
                    </p>
                </Col>
                <Col md="6" className="text-end mt-3 mt-md-0 d-flex justify-content-md-end align-items-center" style={{ gap: '12px' }}>
                    <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-light" style={{ width: '250px' }}>
                        <Input
                            placeholder="Cari nama atau email..."
                            className="border-0 bg-transparent font-weight-bold text-dark px-3"
                            style={{ height: '38px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearch()}
                        />
                        <div className="input-group-append">
                            <Button color="primary" size="sm" className="px-3" onClick={onSearch}>
                                <i className="fas fa-search" />
                            </Button>
                        </div>
                    </div>
                    <Button color="primary" size="sm" className="rounded-pill px-4 shadow-premium" onClick={onAdd}>
                        <i className="fas fa-plus me-2" />
                        Pegawai Baru
                    </Button>
                </Col>
            </Row>
        </CardHeader>
    );
};

export default EmployeeHeader;

import React from 'react';
import { Row, Col, Input, Button, InputGroup, InputGroupText } from 'reactstrap';

const PurchaseHeader = ({ onSearch, onTypeFilter, onAdd, filters }) => {
    return (
        <div className="mb-4">
            <Row className="align-items-center">
                <Col md="4">
                    <h3 className="mb-0 font-weight-bold text-dark ls-1 text-uppercase">Log Pembelian</h3>
                    <p className="text-muted small mb-0 font-weight-bold">Manajemen Inventaris & Operasional</p>
                </Col>
                <Col md="8">
                    <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                        <div style={{ width: '250px' }}>
                            <InputGroup className="input-group-alternative border shadow-none rounded-pill">
                                <>
                                    <InputGroupText className="bg-white border-right-0 rounded-left-pill">
                                        <i className="fas fa-search text-muted" />
                                    </InputGroupText>
                                </>
                                <Input 
                                    placeholder="Cari item..." 
                                    className="border-left-0 rounded-right-pill font-weight-bold"
                                    value={filters.search}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        <div style={{ width: '180px' }}>
                            <Input 
                                type="select" 
                                className="form-control-alternative border shadow-none rounded-pill font-weight-bold"
                                value={filters.type}
                                onChange={(e) => onTypeFilter(e.target.value)}
                            >
                                <option value="">Semua Tipe</option>
                                <option value="Operasional">Operasional</option>
                                <option value="Investasi">Investasi</option>
                                <option value="Persediaan">Persediaan</option>
                                <option value="Lainnya">Lainnya</option>
                            </Input>
                        </div>
                        <Button 
                            color="primary" 
                            className="rounded-pill px-4 shadow-premium font-weight-bold"
                            onClick={onAdd}
                        >
                            <i className="fas fa-plus-circle me-2" /> Tambah 
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PurchaseHeader;

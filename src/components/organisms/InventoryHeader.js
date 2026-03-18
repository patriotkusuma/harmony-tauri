import React from 'react';
import { Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const InventoryHeader = ({ onSearch, filters, onAdd }) => {
    return (
        <div className="mb-4">
            <Row className="align-items-center">
                <Col md="5">
                    <h3 className="mb-0 font-weight-bold text-dark ls-1 text-uppercase">Manajemen Tabel Inventaris</h3>
                    <p className="text-muted small mb-0 font-weight-bold">Kontrol Stok & Pergerakan Barang</p>
                </Col>
                <Col md="7">
                    <div className="d-flex justify-content-end align-items-center" style={{ gap: '15px' }}>
                        <div style={{ width: '300px' }}>
                            <InputGroup className="input-group-alternative border shadow-none rounded-pill">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText className="bg-white border-right-0 rounded-left-pill">
                                        <i className="fas fa-search text-muted" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    placeholder="Cari stok barang..." 
                                    className="border-left-0 rounded-right-pill font-weight-bold"
                                    value={filters.search}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        <button 
                            className="btn btn-primary rounded-pill px-4 shadow-sm font-weight-bold"
                            onClick={onAdd}
                        >
                            <i className="fas fa-plus-circle mr-2" />
                            Tambah Manual
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InventoryHeader;

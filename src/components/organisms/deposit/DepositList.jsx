import React from 'react';
import { Table, Button, Input, Row, Col, CardHeader, Spinner, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import RupiahFormater from '../../../utils/RupiahFormater';

const DepositList = ({ items, loading, search, onSearch, onSelect, onTopUp, totalItems, page, setPage, limit }) => {
    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div className="deposit-list-container">
            <CardHeader className="bg-transparent border-0 py-4">
                <Row className="align-items-center">
                    <Col md="6">
                        <h3 className="mb-0 text-dark font-weight-bold">
                            <i className="fas fa-wallet me-2 text-primary" />
                            Daftar Saldo Pelanggan
                        </h3>
                    </Col>
                    <Col md="6" className="d-flex align-items-center justify-content-md-end gap-3 mt-3 mt-md-0">
                        <div className="search-box flex-grow-1" style={{ maxWidth: 300 }}>
                            <Input
                                placeholder="Cari saldo..."
                                value={search}
                                onChange={(e) => onSearch(e.target.value)}
                                className="rounded-pill shadow-sm border-0"
                                style={{ backgroundColor: '#f1f3f9' }}
                            />
                        </div>
                        <Button 
                            color="primary" 
                            className="rounded-pill px-4 shadow-premium"
                            onClick={() => onTopUp(null)}
                        >
                            <i className="fas fa-plus me-2" />
                            Top-up Baru
                        </Button>
                    </Col>
                </Row>
            </CardHeader>

            <div className="table-responsive px-4">
                <Table className="align-middle table-flush table-hover" responsive>
                    <thead className="table-light">
                        <tr>
                            <th className="border-0">Nama Pelanggan</th>
                            <th className="border-0 text-end">Saldo Terakhir</th>
                            <th className="border-0 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-5">
                                    <Spinner color="primary" />
                                    <p className="mt-3 text-muted">Memuat data...</p>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted"> Belum ada data pelanggan </td>
                            </tr>
                        ) : items.map((item) => (
                            <tr key={item.id_customer} className="cursor-pointer">
                                <td onClick={() => onSelect(item.id_customer)}>
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-sm rounded-circle me-3 bg-gradient-primary text-white">
                                            {item.customer_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="h5 font-weight-bold mb-0 d-block">{item.customer_name}</span>
                                            <small className="text-muted">{item.customer_phone}</small>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-end font-weight-bold text-success" onClick={() => onSelect(item.id_customer)}>
                                    <RupiahFormater value={item.saldo} />
                                </td>
                                <td className="text-center">
                                    <Button 
                                        color="info" 
                                        size="sm" 
                                        className="rounded-pill px-3 shadow-sm border-0"
                                        onClick={() => onTopUp(item)}
                                    >
                                        <i className="fas fa-plus-circle me-1" /> Top up
                                    </Button>
                                    <Button 
                                        color="secondary" 
                                        size="sm" 
                                        className="rounded-pill px-3 shadow-sm border-0 ms-2"
                                        onClick={() => onSelect(item.id_customer)}
                                    >
                                        <i className="fas fa-history me-1" /> Riwayat
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="py-4 px-4 d-flex justify-content-end">
                    <Pagination className="pagination-premium">
                        <PaginationItem disabled={page <= 1}>
                            <PaginationLink previous onClick={() => setPage(page - 1)} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem active={i + 1 === page} key={i}>
                                <PaginationLink onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={page >= totalPages}>
                            <PaginationLink next onClick={() => setPage(page + 1)} />
                        </PaginationItem>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default DepositList;

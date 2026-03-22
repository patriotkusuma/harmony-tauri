import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Table, Badge, Button, Input, Row, Col } from 'reactstrap';

const TYPE_META = {
  basket: { color: "primary", icon: "fas fa-shopping-basket", label: "Basket" },
  machine: { color: "warning", icon: "fas fa-cog", label: "Mesin" },
  operator: { color: "info", icon: "fas fa-user-cog", label: "Operator" },
};

const STATUS_META = {
  ASSIGNED: { color: "success", label: "Assigned" },
  AVAILABLE: { color: "secondary", label: "Available" },
};

const RFIDCardList = ({ 
    rfids, 
    total, 
    page, 
    limit, 
    loading, 
    search, 
    setSearch, 
    filterType, 
    handleFilterType, 
    filterStatus, 
    handleFilterStatus,
    handleSearch, 
    handlePageChange, 
    onViewDetail,
    totalPages,
    refresh
}) => {
    return (
        <Card className="shadow-premium border-0 glass-card">
            <CardHeader className="bg-transparent border-0 py-4">
                <Row className="align-items-center">
                    <Col>
                        <h3 className="mb-0 text-dark font-weight-bold">
                            <i className="fas fa-list-ul me-2 text-primary" />
                            Daftar Kartu RFID
                        </h3>
                    </Col>
                    <Col className="text-end d-flex justify-content-end" style={{ gap: '8px' }}>
                        <Button color="light" size="sm" className="rounded-circle btn-icon-only shadow-sm" onClick={refresh}>
                            <i className="fas fa-sync-alt" />
                        </Button>
                    </Col>
                </Row>
            </CardHeader>

            {/* Filter Section */}
            <div className="px-4 pb-4 border-bottom-white-05">
                <Row className="gy-3">
                    <Col md="5">
                        <div className="input-group input-group-merge shadow-sm border rounded-lg overflow-hidden bg-white">
                            <Input
                                placeholder="Cari kode RFID atau user ID..."
                                className="border-0 px-3 py-4"
                                style={{ height: '45px' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <div className="input-group-append">
                                <Button color="primary" className="px-3" onClick={handleSearch}>
                                    <i className="fas fa-search" />
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col md="7">
                        <div className="d-flex flex-wrap align-items-center justify-content-md-end" style={{ gap: '8px' }}>
                            <span className="text-xs font-weight-bold text-muted me-1">TIPE:</span>
                            {["", "basket", "machine", "operator"].map((t) => (
                                <Button
                                    key={t || "all"}
                                    size="sm"
                                    color={filterType === t ? "primary" : "secondary"}
                                    outline={filterType !== t}
                                    onClick={() => handleFilterType(t)}
                                    className="rounded-pill px-3 font-weight-bold shadow-none"
                                >
                                    {t === "" ? "Semua" : TYPE_META[t].label}
                                </Button>
                            ))}
                            <div className="mx-2 border-left h-25" />
                            <span className="text-xs font-weight-bold text-muted me-1">STATUS:</span>
                            {["", "AVAILABLE", "ASSIGNED"].map((s) => (
                                <Button
                                    key={s || "all_s"}
                                    size="sm"
                                    color={filterStatus === s ? "success" : "secondary"}
                                    outline={filterStatus !== s}
                                    onClick={() => handleFilterStatus(s)}
                                    className="rounded-pill px-3 font-weight-bold shadow-none"
                                >
                                    {s === "" ? "Semua" : STATUS_META[s].label}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>

            <CardBody className="p-0">
                {loading ? (
                    <div className="text-center py-5 opacity-5">
                        <i className="fas fa-circle-notch fa-spin fa-3x text-primary mb-3" />
                        <p className="h5 text-dark font-weight-bold">Sinkronisasi data...</p>
                    </div>
                ) : rfids.length === 0 ? (
                    <div className="text-center py-5 opacity-4">
                        <i className="fas fa-id-card fa-4x text-muted mb-3" />
                        <h3 className="text-dark font-weight-bold">Tidak ada data RFID</h3>
                        <p className="text-sm text-dark font-italic">Coba ubah filter atau daftar kartu baru.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table className="align-middle table-flush border-0" hover>
                            <thead className="table-light">
                                <tr className="bg-secondary-soft">
                                    <th className="font-weight-bold text-dark border-0 py-4" style={{ width: '80px' }}>No.</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Kartu RFID</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Kategori</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Status Penggunaan</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">User ID</th>
                                    <th className="font-weight-bold text-dark border-0 py-4 text-end">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfids.map((card, idx) => {
                                    const type = TYPE_META[card.type] || { color: "secondary", icon: "fas fa-tag", label: card.type || "-" };
                                    const status = STATUS_META[card.status] || { color: "secondary", label: card.status };
                                    return (
                                        <tr key={card.id} className="transition-all">
                                            <td className="py-4 border-0 font-weight-bold text-dark">
                                                {(page - 1) * limit + idx + 1}
                                            </td>
                                            <td className="py-4 border-0">
                                                <div className="d-flex align-items-center">
                                                    <div className={`me-3 rounded-lg shadow-sm d-flex align-items-center justify-content-center bg-white border border-${type.color}`} style={{ width: '40px', height: '40px' }}>
                                                        <i className={`${type.icon} text-${type.color}`} />
                                                    </div>
                                                    <span className="font-weight-bold h5 mb-0 text-dark font-monospace">{card.code}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 border-0">
                                                <Badge color={type.color} pill className="px-3 py-1 font-weight-bold">
                                                    {type.label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 border-0">
                                                <Badge color={status.color} className="shadow-none rounded-pill px-3 py-1 font-weight-bold">
                                                    {card.status === "ASSIGNED" && <i className="fas fa-lock me-2" />}
                                                    {status.label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 border-0">
                                                {card.user_id ? (
                                                    <span className="text-dark font-weight-bold">
                                                        <i className="fas fa-user-circle me-2 opacity-5" />
                                                        {card.user_id}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted italic opacity-5">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 border-0 text-end">
                                                <Button color="primary" outline size="sm" className="rounded-pill font-weight-bold px-3 shadow-none" onClick={() => onViewDetail(card)}>
                                                    Detail <i className="fas fa-chevron-right ms-1" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </CardBody>
            <CardFooter className="py-4 border-0 bg-transparent">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="text-dark font-weight-bold text-sm mb-3 mb-md-0">
                        Menampilkan <span className="text-primary">{(page - 1) * limit + 1}</span> sampai <span className="text-primary">{Math.min(page * limit, total)}</span> dari total <span className="text-primary">{total}</span> kartu
                    </p>
                    {totalPages > 1 && (
                        <div className="d-flex" style={{ gap: '5px' }}>
                            <Button size="sm" color="secondary" outline disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="rounded-circle btn-icon-only"><i className="fas fa-chevron-left" /></Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i-1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) => (
                                    p === "..." ? (
                                        <span key={`el-${i}`} className="mx-2 align-self-center text-muted">...</span>
                                    ) : (
                                        <Button key={p} size="sm" color={p === page ? "primary" : "secondary"} outline={p !== page} onClick={() => handlePageChange(p)} className="rounded-circle btn-icon-only font-weight-bold">
                                            {p}
                                        </Button>
                                    )
                                ))
                            }
                            <Button size="sm" color="secondary" outline disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)} className="rounded-circle btn-icon-only"><i className="fas fa-chevron-right" /></Button>
                        </div>
                    )}
                </div>
            </CardFooter>
            <style>{`
                .font-monospace { font-family: 'Courier New', Courier, monospace; letter-spacing: 1px; }
                .bg-secondary-soft { background: rgba(0,0,0,0.02); }
                .border-bottom-white-05 { border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
            `}</style>
        </Card>
    );
};

export default RFIDCardList;

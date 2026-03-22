import React from 'react';
import { Table, Badge, Button, CardBody, CardFooter } from 'reactstrap';
import moment from 'moment';

const ROLE_META = {
    admin: { color: "primary", label: "Admin" },
    owner: { color: "danger", label: "Owner" },
    pegawai: { color: "info", label: "Pegawai" },
};

const STATUS_META = {
    active: { color: "success", label: "Aktif" },
    inactive: { color: "secondary", label: "Nonaktif" },
};

const EmployeeListTable = ({ 
    employees, 
    loading, 
    onEdit, 
    onDelete, 
    onRfid, 
    page, 
    totalPages, 
    setPage,
    limit,
    total
}) => {
    return (
        <CardBody className="p-0">
            {loading ? (
                <div className="text-center py-7">
                    <i className="fas fa-circle-notch fa-spin fa-3x text-primary mb-3" />
                    <h4 className="text-dark font-weight-bold">Sinkronisasi Data Pegawai...</h4>
                </div>
            ) : employees.length === 0 ? (
                <div className="text-center py-7 opacity-7">
                    <i className="fas fa-user-slash fa-4x text-muted mb-3" />
                    <h3 className="text-dark font-weight-bold">Belum Ada Pegawai</h3>
                    <p className="text-muted">Daftarkan pegawai pertama Anda untuk mulai mengelola outlet.</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <Table className="align-middle table-flush border-0" hover>
                            <thead className="table-light">
                                <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                                    <th className="font-weight-bold text-dark border-0 py-4">Nama & Informasi Dasar</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Akses & Peran</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Outlet Terhubung</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Kontak Aktif</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Gaji Bulanan</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Status & RFID</th>
                                    <th className="font-weight-bold text-dark border-0 py-4 text-end">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="transition-all">
                                        <td className="py-4 border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar rounded-circle me-3 bg-primary text-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-user" />
                                                </div>
                                                <div>
                                                    <span className="mb-0 text-sm font-weight-900 d-block text-dark" style={{ color: '#000' }}>
                                                        {emp.nama}
                                                    </span>
                                                    <small className="text-muted font-weight-bold">Bergabung: {moment(emp.tanggal_masuk).format("DD MMM YYYY")}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 border-0">
                                            {emp.user ? (
                                                <>
                                                    <span className="text-sm d-block font-weight-bold text-dark mb-1">{emp.user.email}</span>
                                                    <Badge color={ROLE_META[emp.user.role]?.color || "secondary"} pill className="px-3 font-weight-bold">
                                                        {ROLE_META[emp.user.role]?.label || emp.user.role}
                                                    </Badge>
                                                </>
                                            ) : (
                                                <Badge color="warning" outline className="font-weight-bold">
                                                    <i className="fas fa-exclamation-triangle me-1" />
                                                    Akun Belum Siap
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-4 border-0">
                                            <div style={{ maxWidth: "180px" }} className="d-flex flex-wrap" style={{ gap: '4px' }}>
                                                {emp.outlets && emp.outlets.length > 0 ? (
                                                    emp.outlets.map((o) => (
                                                        <Badge key={o.id} color="neutral" className="border text-primary shadow-none font-weight-bold px-2 py-1">
                                                            {o.nama_outlet}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted text-xs italic opacity-5">Belum ada akses</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 border-0">
                                            <div className="text-sm">
                                                <div className="mb-1 text-dark font-weight-bold">
                                                    <i className="fas fa-phone me-2 text-primary opacity-5" /> {emp.telpon || "-"}
                                                </div>
                                                <div className="text-success font-weight-bold">
                                                    <i className="fab fa-whatsapp me-2 opacity-7" /> {emp.no_wa || "-"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className="text-dark font-weight-900 h5" style={{ color: '#000' }}>
                                                Rp {new Intl.NumberFormat("id-ID").format(emp.gaji)}
                                            </span>
                                        </td>
                                        <td className="py-4 border-0">
                                            <Badge color={STATUS_META[emp.status]?.color || "secondary"} className="px-3 py-1 font-weight-bold">
                                                {STATUS_META[emp.status]?.label || emp.status}
                                            </Badge>
                                            {emp.rfid_code && (
                                                <div className="mt-2">
                                                    <Badge color="default" outline className="border shadow-none font-weight-900 text-dark px-2">
                                                        <i className="fas fa-id-card me-1 text-primary" /> {emp.rfid_code}
                                                    </Badge>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 border-0 text-end">
                                            <div className="d-flex justify-content-end" style={{ gap: '6px' }}>
                                                <Button 
                                                    color="success" 
                                                    size="sm" 
                                                    className="rounded-circle btn-icon-only shadow-sm"
                                                    onClick={() => onRfid(emp)}
                                                    title="Tautkan RFID"
                                                    outline={!emp.rfid_code}
                                                >
                                                    <i className="fas fa-id-card" />
                                                </Button>
                                                <Button 
                                                    color="info" 
                                                    size="sm" 
                                                    className="rounded-circle btn-icon-only shadow-sm"
                                                    onClick={() => onEdit(emp)}
                                                    title="Edit Data"
                                                >
                                                    <i className="fas fa-edit" />
                                                </Button>
                                                <Button 
                                                    color="danger" 
                                                    size="sm" 
                                                    className="rounded-circle btn-icon-only shadow-sm"
                                                    onClick={() => onDelete(emp.id)}
                                                    title="Hapus Pegawai"
                                                >
                                                    <i className="fas fa-trash" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </>
            )}
            {totalPages > 1 && !loading && (
                <CardFooter className="py-4 border-0 bg-transparent">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <p className="text-dark font-weight-bold text-sm mb-3 mb-md-0">
                            Menampilkan <span className="text-primary">{(page - 1) * limit + 1}</span> sampai <span className="text-primary">{Math.min(page * limit, total)}</span> dari total <span className="text-primary">{total}</span> pegawai
                        </p>
                        <nav>
                            <ul className="pagination justify-content-end mb-0">
                                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                                    <Button size="sm" color="secondary" outline onClick={() => setPage(page - 1)} className="rounded-circle btn-icon-only mx-1">
                                        <i className="fas fa-angle-left" />
                                    </Button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                                        <Button 
                                            size="sm" 
                                            color={page === i + 1 ? "primary" : "secondary"} 
                                            outline={page !== i + 1}
                                            onClick={() => setPage(i + 1)}
                                            className="rounded-circle btn-icon-only mx-1 font-weight-bold"
                                        >
                                            {i + 1}
                                        </Button>
                                    </li>
                                ))}
                                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                                    <Button size="sm" color="secondary" outline onClick={() => setPage(page + 1)} className="rounded-circle btn-icon-only mx-1">
                                        <i className="fas fa-angle-right" />
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </CardFooter>
            )}
        </CardBody>
    );
};

export default EmployeeListTable;

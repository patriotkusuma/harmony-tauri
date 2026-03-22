import React from "react";
import { Table, Spinner } from "reactstrap";
import RupiahFormater from "utils/RupiahFormater";

const EmployeePerformanceTable = ({ data, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-info mb-3 shadow-sm" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-3 text-muted font-weight-bold">Memuat Kinerja Karyawan...</h4>
        </div>
    );

    return (
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
            <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                    <tr className="table-header-row">
                        <td className="table-header-cell">Nama Karyawan</td>
                        <td className="table-header-cell text-center">Total Order</td>
                        <td className="table-header-cell text-center">Selesai</td>
                        <td className="table-header-cell">Valuenya (Omset)</td>
                    </tr>
                </thead>
                <tbody>
                    {(!data || data.length === 0) ? (
                        <tr>
                            <td colSpan="4" className="text-center py-5">
                                <i className="fas fa-users-slash fa-3x text-light mb-3 empty-icon"></i>
                                <h4 className="text-muted font-weight-bold mb-0">Belum Ada Data Karyawan</h4>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => (
                            <tr key={idx} className="op-row">
                                <td className="px-4 py-3 border-bottom-custom">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-sm rounded-circle d-flex align-items-center justify-content-center me-3 icon-avatar text-primary font-weight-bold">
                                            {item.nama_pegawai === 'System' ? <i className="fas fa-robot"></i> : (item.nama_pegawai?.charAt(0) || '?')}
                                        </div>
                                        <div>
                                            <span className="font-weight-900 item-title d-block">{item.nama_pegawai}</span>
                                            {item.nama_pegawai === 'System' && (
                                                <div className="d-inline-flex align-items-center rounded-pill font-weight-bold px-2 py-1 badge-soft-secondary mt-1" style={{ fontSize: '0.65rem' }}>
                                                    <i className="fas fa-cogs me-1"></i> Automated
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 text-center border-bottom-custom">
                                    <div className="d-inline-flex bg-input-box border-input rounded px-3 py-1 align-items-center">
                                        <span className="font-weight-900 item-title me-1">{item.total_orders}</span> 
                                        <small className="text-muted font-weight-bold">Pesanan</small>
                                    </div>
                                </td>
                                <td className="px-4 text-center border-bottom-custom">
                                    <div className="d-inline-flex bg-input-box border-input rounded px-3 py-1 align-items-center">
                                        <span className="font-weight-900 item-title me-1">{item.orders_completed}</span> 
                                        <small className="text-muted font-weight-bold">Pesanan</small>
                                    </div>
                                </td>
                                <td className="px-4 border-bottom-custom">
                                    <div className="rounded border-success-soft bg-success-soft px-3 py-2 d-inline-block">
                                        <span className="font-weight-900 text-success ls-1">
                                            <RupiahFormater value={item.total_omset} />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            <style>{`
                /* Wrapper & Layout Core */
                .custom-wrapper { background-color: #ffffff; border: 1px solid #f1f3f9 !important; }
                body.dark-mode .custom-wrapper { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.05) !important; }
                
                .custom-op-table { border-collapse: separate; border-spacing: 0; }
                .op-row { transition: all 0.2s ease-in-out; }
                .op-row:hover {
                    background-color: #fcfdfe !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }
                body.dark-mode .op-row:hover { background-color: rgba(255,255,255,0.02) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
                
                .border-bottom-custom { border-bottom: 1px solid #f1f3f9; vertical-align: middle; }
                body.dark-mode .border-bottom-custom { border-bottom: 1px solid rgba(255,255,255,0.05); }

                /* Header Customizations */
                .table-header-row { background: #f8f9fe; }
                body.dark-mode .table-header-row { background: #0f172a; }
                .table-header-cell {
                    padding: 1rem 1.5rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 1px; color: #8898aa; background-color: #f8f9fe; border-bottom: 2px solid #e9ecef; border-top: none;
                }
                body.dark-mode .table-header-cell { background-color: #0f172a; border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; }

                /* Colors & Typography */
                .item-title { color: #32325d; }
                body.dark-mode .item-title { color: #e2e8f0; }

                /* Avatar */
                .icon-avatar { width: 38px; height: 38px; background-color: rgba(94, 114, 228, 0.1); }
                body.dark-mode .icon-avatar { background-color: rgba(129, 140, 248, 0.15); }
                body.dark-mode .icon-avatar { color: #818cf8 !important; }

                /* Boxes & Containers */
                .bg-input-box { background-color: #fcfdfe; }
                body.dark-mode .bg-input-box { background-color: #0f172a; }
                
                .border-input { border: 1px solid #e9ecef; }
                body.dark-mode .border-input { border: 1px solid rgba(255,255,255,0.1); }

                /* Success Box */
                .bg-success-soft { background-color: rgba(45, 206, 137, 0.1); }
                body.dark-mode .bg-success-soft { background-color: rgba(74, 222, 128, 0.15); }
                
                .border-success-soft { border: 1px solid rgba(45, 206, 137, 0.2); }
                body.dark-mode .border-success-soft { border: 1px solid rgba(74, 222, 128, 0.2); }
                
                body.dark-mode .text-success { color: #4ade80 !important; }

                /* Badges */
                .badge-soft-secondary { background-color: #f4f5f7; color: #525f7f; border: 1px solid rgba(0,0,0,0.05); }
                body.dark-mode .badge-soft-secondary { background-color: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default EmployeePerformanceTable;

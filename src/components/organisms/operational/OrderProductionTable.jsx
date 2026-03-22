import React from "react";
import { Table, Spinner } from "reactstrap";
import moment from "moment";

const OrderProductionTable = ({ data, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3 shadow-sm" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-3 text-muted font-weight-bold">Memuat Data Produksi...</h4>
        </div>
    );

    return (
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper">
            <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                    <tr className="table-header-row">
                        <td className="table-header-cell">Produksi / Invoice</td>
                        <td className="table-header-cell">Customer</td>
                        <td className="table-header-cell text-center">Layanan</td>
                        <td className="table-header-cell">Update Target</td>
                        <td className="table-header-cell text-center">Status</td>
                    </tr>
                </thead>
                <tbody>
                    {(!data || data.length === 0) ? (
                        <tr>
                            <td colSpan="5" className="text-center py-5">
                                <i className="fas fa-inbox fa-3x text-light mb-3 empty-icon"></i>
                                <h4 className="text-muted font-weight-bold mb-0">Belum Ada Pesanan Produksi</h4>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => (
                            <tr key={idx} className="op-row">
                                <td className="px-4 py-3 border-bottom-custom">
                                    <span className="font-weight-900 item-title d-block" style={{ fontSize: '0.95rem' }}>{item.kode_pesan}</span>
                                    <small className="d-block text-muted ls-1" style={{ fontSize: '0.7rem' }}>MASUK: {moment(item.tanggal_pesan).format("DD MMM, HH:mm")}</small>
                                </td>
                                
                                <td className="px-4 border-bottom-custom">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-sm rounded-circle d-flex align-items-center justify-content-center me-3 icon-avatar">
                                            <span className="font-weight-bold text-primary">{item.nama_pelanggan?.charAt(0) || '?'}</span>
                                        </div>
                                        <span className="font-weight-800 item-title">{item.nama_pelanggan}</span>
                                    </div>
                                </td>
                                
                                <td className="px-4 text-center border-bottom-custom">
                                    <div className="d-inline-flex align-items-center stat-box rounded p-2">
                                        <span className="font-weight-bold stat-text" style={{ fontSize: '0.8rem' }}>{item.status}</span>
                                    </div>
                                </td>
                                
                                <td className="px-4 border-bottom-custom">
                                    <div className="d-flex align-items-center">
                                        <span className="font-weight-600 stat-text me-2">{moment(item.tanggal_selesai).format("DD MMM YYYY, HH:mm")}</span>
                                        {item.is_overdue && (
                                            <div className="d-inline-flex align-items-center rounded-pill font-weight-bold px-2 py-1 badge-soft-danger" style={{ fontSize: '0.65rem' }}>
                                                <i className="fas fa-exclamation-triangle me-1"></i> Overdue
                                            </div>
                                        )}
                                    </div>
                                </td>
                                
                                <td className="text-center border-bottom-custom">
                                    <div className={`d-inline-flex align-items-center rounded-pill font-weight-bold px-3 py-1 ${item.status === 'Baru' ? 'badge-soft-info' : 'badge-soft-warning'}`} style={{ fontSize: '0.75rem' }}>
                                        <div className="dot-indicator rounded-circle me-2"></div>
                                        {item.status}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            <style>{`
                /* Wrapper & Table Core */
                .custom-wrapper { background-color: #ffffff; }
                body.dark-mode .custom-wrapper { background-color: #1e293b; }
                
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

                /* Headers */
                .table-header-row { background: #f8f9fe; }
                body.dark-mode .table-header-row { background: #1e293b; }
                .table-header-cell {
                    padding: 1rem 1.5rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 1px; color: #8898aa; background-color: #f8f9fe; border-bottom: 2px solid #e9ecef; border-top: none;
                }
                body.dark-mode .table-header-cell { background-color: #1e293b; border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; }

                /* Text Elements */
                .item-title { color: #172b4d; }
                body.dark-mode .item-title { color: #f8fafc; }
                
                .stat-text { color: #525f7f; }
                body.dark-mode .stat-text { color: #cbd5e1; }

                /* Stat Box */
                .stat-box { background-color: #f8f9fe; min-width: 80px; }
                body.dark-mode .stat-box { background-color: rgba(255,255,255,0.05); }

                /* Avatar */
                .icon-avatar { width: 36px; height: 36px; background-color: rgba(94, 114, 228, 0.1); }
                body.dark-mode .icon-avatar { background-color: rgba(129, 140, 248, 0.15); }
                body.dark-mode .icon-avatar span { color: #818cf8 !important; }

                /* Soft Badges */
                .dot-indicator { width: 6px; height: 6px; }
                
                .badge-soft-info { background-color: rgba(17, 205, 239, 0.1); color: #11cdef; box-shadow: 0 0 0 1px rgba(17, 205, 239, 0.1) inset; }
                .badge-soft-info .dot-indicator { background-color: #11cdef; }
                
                .badge-soft-warning { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; box-shadow: 0 0 0 1px rgba(251, 99, 64, 0.1) inset; }
                .badge-soft-warning .dot-indicator { background-color: #fb6340; }
                
                .badge-soft-danger { background-color: rgba(245, 54, 92, 0.1); color: #f5365c; }
            `}</style>
        </div>
    );
};

export default OrderProductionTable;

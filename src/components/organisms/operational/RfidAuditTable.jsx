import React from "react";
import { Table, Spinner } from "reactstrap";
import moment from "moment";

const RfidAuditTable = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-info mb-3 shadow-sm" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="mt-3 text-muted font-weight-bold">Memuat Audit RFID...</h4>
            </div>
        );
    }

    return (
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
            <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                    <tr className="table-header-row">
                        <td className="table-header-cell">UID Tag ID</td>
                        <td className="table-header-cell text-center">Status</td>
                        <td className="table-header-cell">Relasi Pesanan</td>
                        <td className="table-header-cell">Terakhir Di-scan</td>
                    </tr>
                </thead>
                <tbody>
                    {(!data || data.length === 0) ? (
                        <tr>
                            <td colSpan="4" className="text-center py-5">
                                <i className="fas fa-satellite-dish fa-3x text-light mb-3 empty-icon"></i>
                                <h4 className="text-muted font-weight-bold mb-0">Belum Ada Sinyal Audit RFID</h4>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => (
                            <tr key={idx} className="op-row">
                                <td className="px-4 py-3 border-bottom-custom">
                                    <div className="d-inline-flex bg-input-box border-input rounded px-3 py-1 align-items-center">
                                        <i className="fas fa-tag text-primary me-2"></i>
                                        <span className="font-weight-900 text-primary ls-1">
                                            {item.uid}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-center border-bottom-custom">
                                    <div className={`d-inline-flex align-items-center rounded-pill font-weight-bold px-3 py-1 ${item.status === 'Attached' ? 'badge-soft-primary' : 'badge-soft-secondary'}`} style={{ fontSize: '0.75rem' }}>
                                        <div className="dot-indicator rounded-circle me-2"></div>
                                        {item.status}
                                    </div>
                                </td>
                                <td className="px-4 border-bottom-custom">
                                    {item.kode_pesan ? (
                                        <span className="font-weight-800 item-title">{item.kode_pesan}</span>
                                    ) : (
                                        <span className="font-weight-bold text-muted opacity-5"><i className="fas fa-minus me-1"></i> Idle (Kosong)</span>
                                    )}
                                </td>
                                <td className="px-4 border-bottom-custom text-muted font-weight-bold">
                                    <i className="far fa-clock me-2 opacity-5" />
                                    {item.last_scanned ? moment(item.last_scanned).format("DD MMM YYYY, HH:mm") : 'Belum Pernah Digunakan'}
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

                /* Boxes & Containers */
                .bg-input-box { background-color: #fcfdfe; }
                body.dark-mode .bg-input-box { background-color: #0f172a; }
                
                .border-input { border: 1px solid #e9ecef; }
                body.dark-mode .border-input { border: 1px solid rgba(255,255,255,0.1); }

                /* Badges */
                .dot-indicator { width: 6px; height: 6px; }
                
                .badge-soft-primary { background-color: rgba(94, 114, 228, 0.1); color: #5e72e4; box-shadow: 0 0 0 1px rgba(94, 114, 228, 0.1) inset; }
                .badge-soft-primary .dot-indicator { background-color: #5e72e4; }
                body.dark-mode .badge-soft-primary { background-color: rgba(129, 140, 248, 0.15); color: #818cf8; box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.15) inset; }
                body.dark-mode .badge-soft-primary .dot-indicator { background-color: #818cf8; }

                .badge-soft-secondary { background-color: #f4f5f7; color: #525f7f; border: 1px solid rgba(0,0,0,0.05); }
                .badge-soft-secondary .dot-indicator { background-color: #8898aa; }
                body.dark-mode .badge-soft-secondary { background-color: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); }
                body.dark-mode .badge-soft-secondary .dot-indicator { background-color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default RfidAuditTable;

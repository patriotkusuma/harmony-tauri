import React from "react";
import { Table, Row, Col } from "reactstrap";
import moment from "moment";

const InventoryUsageTable = ({ data, lowStockAlerts, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-info mb-3 shadow-sm" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mt-3 text-muted font-weight-bold">Memuat Data Inventaris...</h4>
        </div>
    );

    return (
        <div className="inventory-report-content">
            {lowStockAlerts && lowStockAlerts.length > 0 && (
                <div className="mb-4 animate__animated animate__fadeIn">
                    <h5 className="title-text uppercase ls-1 mb-3 font-weight-900 border-bottom-custom pb-2">
                        <i className="fas fa-exclamation-triangle text-warning me-2" />
                        Peringatan Stok Kurang
                    </h5>
                    <Row>
                        {lowStockAlerts.map((alert, idx) => (
                            <Col md="4" key={idx} className="mb-3">
                                <div className="p-3 rounded-lg border-0 shadow-sm custom-alert-danger d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong className="d-block font-weight-900 mb-1" style={{ fontSize: '0.9rem' }}>{alert.item_name}</strong>
                                        <small className="font-weight-600 opacity-8">Sisa Tersedia: {alert.current_qty} {alert.unit}</small>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1 shadow-sm border text-danger font-weight-bold" style={{ fontSize: '0.75rem' }}>
                                        Min: {alert.minimum_qty}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
                <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr className="table-header-row">
                            <td className="table-header-cell">Waktu Transaksi</td>
                            <td className="table-header-cell">Nama Barang</td>
                            <td className="table-header-cell">Jumlah</td>
                            <td className="table-header-cell text-center">Aktivitas</td>
                            <td className="table-header-cell">Ref Tujuan / Asal</td>
                        </tr>
                    </thead>
                    <tbody>
                        {(!data || data.length === 0) ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <i className="fas fa-box-open fa-3x text-light mb-3 empty-icon"></i>
                                    <h4 className="text-muted font-weight-bold mb-0">Belum Ada Riwayat Pemakaian Stok</h4>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, idx) => (
                                <tr key={idx} className="op-row">
                                    <td className="px-4 py-3 border-bottom-custom">
                                        <span className="font-weight-800 item-title d-block">{moment(item.date).format("DD MMM YYYY")}</span>
                                        <small className="d-block text-muted ls-1 font-weight-600">{moment(item.date).format("HH:mm")}</small>
                                    </td>
                                    <td className="px-4 border-bottom-custom font-weight-900 item-title">
                                        {item.item_name}
                                    </td>
                                    <td className="px-4 border-bottom-custom">
                                        <div className="d-inline-flex bg-input-box border-input rounded px-3 py-1 align-items-center">
                                            <span className="font-weight-900 item-title me-1">{item.quantity}</span> 
                                            <small className="text-muted font-weight-bold">{item.unit}</small>
                                        </div>
                                    </td>
                                    <td className="text-center border-bottom-custom">
                                        <div className={`d-inline-flex align-items-center rounded-pill font-weight-bold px-3 py-1 ${item.type === 'out' ? 'badge-soft-danger' : 'badge-soft-success'}`} style={{ fontSize: '0.75rem' }}>
                                            <div className="dot-indicator rounded-circle me-2"></div>
                                            {item.type === 'out' ? 'Stok Keluar' : 'Stok Masuk'}
                                        </div>
                                    </td>
                                    <td className="px-4 border-bottom-custom">
                                        <div className="rounded border-input bg-input-box px-2 py-1 d-inline-block">
                                            <small className="item-title uppercase font-weight-800 ls-1">{item.reference_type}</small>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

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
                .title-text { color: #172b4d; }
                body.dark-mode .title-text { color: #f8fafc; }
                
                .item-title { color: #32325d; }
                body.dark-mode .item-title { color: #e2e8f0; }

                /* Boxes & Containers */
                .bg-input-box { background-color: #fcfdfe; }
                body.dark-mode .bg-input-box { background-color: #0f172a; }
                
                .border-input { border: 1px solid #e9ecef; }
                body.dark-mode .border-input { border: 1px solid rgba(255,255,255,0.1); }

                /* Critical Alerts */
                .custom-alert-danger { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; border-left: 4px solid #fb6340 !important; }
                body.dark-mode .custom-alert-danger { background-color: rgba(249, 115, 22, 0.15); color: #fdba74; border-left: 4px solid #fdba74 !important; }
                
                body.dark-mode .custom-alert-danger .bg-white { background-color: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; color: #f8fafc !important; }

                /* Badges */
                .dot-indicator { width: 6px; height: 6px; }
                
                .badge-soft-success { background-color: rgba(45, 206, 137, 0.1); color: #2dce89; box-shadow: 0 0 0 1px rgba(45, 206, 137, 0.1) inset; }
                .badge-soft-success .dot-indicator { background-color: #2dce89; }
                
                .badge-soft-danger { background-color: rgba(245, 54, 92, 0.1); color: #f5365c; box-shadow: 0 0 0 1px rgba(245, 54, 92, 0.1) inset; }
                .badge-soft-danger .dot-indicator { background-color: #f5365c; }
            `}</style>
        </div>
    );
};

export default InventoryUsageTable;

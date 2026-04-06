import React from 'react';
import { Table, Button } from 'reactstrap';

const InventoryListTable = ({ data, onDetail, onAdjust, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-muted font-weight-bold">Memuat data inventaris...</h4>
            </div>
        );
    }

    const items = data?.data || [];

    const getStockConfig = (current, initial) => {
        if (current <= 0) return { color: 'danger', label: 'Habis Habisan', badgeClass: 'badge-soft-danger', iconClass: 'text-danger' };
        if (current < initial * 0.3) return { color: 'warning', label: 'Stok Menipis', badgeClass: 'badge-soft-warning', iconClass: 'text-warning' };
        return { color: 'success', label: 'Stok Aman', badgeClass: 'badge-soft-success', iconClass: 'text-success' };
    };

    return (
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper">
            <Table className="align-middle mb-0 custom-inventory-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                    <tr className="table-header-row">
                        {['Nama Barang', 'Stok Saat Ini', 'Stok Awal', 'Status', 'Aksi'].map((th, index) => (
                            <td
                                key={index}
                                className={`table-header-cell ${index > 0 ? 'text-center' : ''}`}
                            >
                                {th}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-5">
                                <div className="py-4">
                                    <i className="fas fa-box-open fa-3x text-light mb-3 empty-icon"></i>
                                    <h4 className="text-muted font-weight-bold mb-0">Belum Ada Inventaris</h4>
                                    <p className="text-muted text-sm mb-0">Stok akan muncul otomatis setelah pembelian bertipe "Persediaan" dicatat.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const config = getStockConfig(item.current_stock, item.initial_stock);
                            return (
                                <tr key={item.uuid} className="inventory-row">
                                    <td className="px-4 py-3 border-bottom-custom">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-avatar rounded-circle d-flex align-items-center justify-content-center me-3">
                                                <i className="fas fa-box"></i>
                                            </div>
                                            <span className="font-weight-900 item-title">{item.nama}</span>
                                        </div>
                                    </td>
                                    
                                    <td className="text-center border-bottom-custom">
                                        <div className="d-inline-flex flex-column justify-content-center">
                                            <span className={`h4 mb-0 font-weight-900 ${config.iconClass}`} style={{ lineHeight: '1' }}>
                                                {item.current_stock}
                                            </span>
                                            <small className="text-muted font-weight-bold text-uppercase" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                                                {item.unit_name || 'unit'}
                                            </small>
                                        </div>
                                    </td>
                                    
                                    <td className="text-center border-bottom-custom">
                                        <div className="d-inline-flex align-items-center justify-content-center stat-box rounded p-2">
                                            <span className="font-weight-bold text-muted" style={{ fontSize: '0.85rem' }}>
                                                {item.initial_stock}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td className="text-center border-bottom-custom">
                                        <div className={`d-inline-flex align-items-center rounded-pill font-weight-bold badge-pill-custom ${config.badgeClass}`}>
                                            <div className="dot-indicator rounded-circle me-2"></div>
                                            {config.label}
                                        </div>
                                    </td>
                                    
                                    <td className="text-center border-bottom-custom">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button 
                                                size="sm" 
                                                className="btn-action btn-history rounded-pill d-flex align-items-center justify-content-center border-0 px-3 font-weight-bold"
                                                onClick={() => onDetail(item)}
                                            >
                                                <i className="fas fa-history me-2" /> Riwayat
                                            </Button>
                                            
                                            <Button 
                                                size="sm" 
                                                className="btn-action btn-adjust rounded-pill d-flex align-items-center justify-content-center border-0 px-3 font-weight-bold"
                                                onClick={() => onAdjust(item)}
                                            >
                                                <i className="fas fa-sliders-h me-2" /> Penyesuaian
                                            </Button>

                                            <Button 
                                                size="sm" 
                                                className="btn-action btn-edit rounded-pill d-flex align-items-center justify-content-center border-0 px-2 font-weight-bold"
                                                onClick={() => onEdit(item)}
                                                title="Edit Metadata"
                                            >
                                                <i className="fas fa-edit" />
                                            </Button>

                                            <Button 
                                                size="sm" 
                                                className="btn-action btn-delete rounded-pill d-flex align-items-center justify-content-center border-0 px-2 font-weight-bold"
                                                onClick={() => onDelete(item)}
                                                title="Hapus Item"
                                            >
                                                <i className="fas fa-trash text-danger" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>

            <style>{`
                /* Wrapper & Table Core */
                .custom-wrapper { background-color: #ffffff; }
                body.dark-mode .custom-wrapper { background-color: #1e293b; }
                
                .custom-inventory-table { border-collapse: separate; border-spacing: 0; }
                .inventory-row { transition: all 0.2s ease-in-out; }
                .inventory-row:hover {
                    background-color: #fcfdfe !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }
                body.dark-mode .inventory-row:hover { background-color: rgba(255,255,255,0.02) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
                
                .border-bottom-custom { border-bottom: 1px solid #f1f3f9; vertical-align: middle; }
                body.dark-mode .border-bottom-custom { border-bottom: 1px solid rgba(255,255,255,0.05); }

                /* Headers */
                .table-header-row { background: #f8f9fe; }
                body.dark-mode .table-header-row { background: #1e293b; }
                .table-header-cell {
                    padding: 1rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 1px; color: #8898aa; background-color: #f8f9fe; border-bottom: 2px solid #e9ecef; white-space: nowrap;
                }
                body.dark-mode .table-header-cell { background-color: #1e293b; border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; }

                /* Icon Avatar */
                .icon-avatar { width: 45px; height: 45px; background-color: rgba(94, 114, 228, 0.08); transition: all 0.2s ease; }
                body.dark-mode .icon-avatar { background-color: rgba(129, 140, 248, 0.15); }
                .icon-avatar i { font-size: 1.2rem; color: #5e72e4; transition: transform 0.3s ease; }
                body.dark-mode .icon-avatar i { color: #818cf8; }
                .inventory-row:hover .icon-avatar i { transform: scale(1.15); }
                .inventory-row:hover .icon-avatar { background-color: rgba(94, 114, 228, 0.12); }

                /* Text Elements */
                .item-title { font-size: 0.95rem; color: #172b4d; letter-spacing: 0.2px; }
                body.dark-mode .item-title { color: #f8fafc; }

                /* Stat Box for Initial Stock */
                .stat-box { background-color: #f8f9fe; min-width: 60px; }
                body.dark-mode .stat-box { background-color: rgba(255,255,255,0.05); }

                /* Badges */
                .badge-pill-custom { padding: 0.35rem 0.85rem; font-size: 0.75rem; display: inline-flex; align-items: center; }
                .dot-indicator { width: 6px; height: 6px; }
                
                .badge-soft-success { background-color: rgba(45, 206, 137, 0.1); color: #2dce89; box-shadow: 0 0 0 1px rgba(45, 206, 137, 0.1) inset; }
                .badge-soft-success .dot-indicator { background-color: #2dce89; }
                
                .badge-soft-warning { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; box-shadow: 0 0 0 1px rgba(251, 99, 64, 0.1) inset; }
                .badge-soft-warning .dot-indicator { background-color: #fb6340; }
                
                .badge-soft-danger { background-color: rgba(245, 54, 92, 0.1); color: #f5365c; box-shadow: 0 0 0 1px rgba(245, 54, 92, 0.1) inset; }
                .badge-soft-danger .dot-indicator { background-color: #f5365c; }

                /* Buttons */
                .btn-action { transition: all 0.2s ease; padding: 0.4rem 1rem !important; }
                .btn-action i { font-size: 0.8rem; }
                .btn-action:hover { transform: translateY(-1px); box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08) !important; }
                
                .btn-history { color: #5e72e4 !important; background-color: #f6f9fc !important; }
                body.dark-mode .btn-history { background-color: rgba(129, 140, 248, 0.15) !important; color: #818cf8 !important; }
                .btn-history:hover { background-color: #5e72e4 !important; color: #fff !important; }

                .btn-adjust { color: #11cdef !important; background-color: rgba(17, 205, 239, 0.1) !important; }
                body.dark-mode .btn-adjust { background-color: rgba(56, 189, 248, 0.15) !important; color: #38bdf8 !important; }
                .btn-adjust:hover { background-color: #11cdef !important; color: #fff !important; }

                .btn-edit { color: #f5365c !important; background-color: rgba(245, 54, 92, 0.05) !important; color: #8898aa !important; }
                .btn-edit:hover { background-color: #f8f9fe !important; color: #5e72e4 !important; }
                
                .btn-delete { background-color: rgba(245, 54, 92, 0.05) !important; }
                .btn-delete:hover { background-color: #f5365c !important; }
                .btn-delete:hover i { color: #fff !important; }
            `}</style>
        </div>
    );
};

export default InventoryListTable;

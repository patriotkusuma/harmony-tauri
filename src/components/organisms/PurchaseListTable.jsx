import React from 'react';
import { Table, Button, UncontrolledTooltip } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import moment from 'moment';

const PurchaseListTable = ({ data, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-muted font-weight-bold">Memuat data pembelian...</h4>
            </div>
        );
    }

    const items = data?.data || [];

    const getIconForType = (type) => {
        if (type === 'Persediaan') return 'fa-box-open';
        if (type === 'Investasi') return 'fa-chart-pie';
        return 'fa-clipboard-check';
    };

    const getBadgeClass = (type) => {
        if (type === 'Persediaan') return 'badge-soft-success';
        if (type === 'Investasi') return 'badge-soft-warning';
        return 'badge-soft-info';
    };

    return (
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper">
            <Table className="align-middle mb-0 custom-purchase-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                    <tr className="table-header-row">
                        {['Tanggal', 'Deskripsi Item', 'Supplier', 'Kategori', 'Total Nominal', 'Aksi'].map((th, index) => (
                            <td
                                key={index}
                                className={`table-header-cell ${th === 'Total Nominal' ? 'text-end' : th === 'Aksi' ? 'text-center' : ''}`}
                                style={{
                                    width: th === 'Tanggal' ? '100px' : th === 'Kategori' ? '120px' : th === 'Total Nominal' ? '160px' : th === 'Aksi' ? '100px' : 'auto'
                                }}
                            >
                                {th}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-5">
                                <div className="py-4">
                                    <i className="fas fa-inbox fa-3x text-light mb-3 empty-icon"></i>
                                    <h4 className="text-muted font-weight-bold mb-0">Belum Ada Rekaman Pembelian</h4>
                                    <p className="text-muted text-sm mb-0">Klik tombol Tambah untuk membuat rekaman baru.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            return (
                                <tr key={item.id} className="purchase-row">
                                    <td className="px-3 py-3 border-bottom-custom">
                                        <div className="date-block text-center rounded overflow-hidden">
                                            <div className="date-month font-weight-bold">
                                                {moment(item.purchase_date).format('MMM')}
                                            </div>
                                            <div className="date-day font-weight-900">
                                                {moment(item.purchase_date).format('DD')}
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="border-bottom-custom">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-avatar rounded-circle d-flex align-items-center justify-content-center me-3">
                                                <i className={`fas ${getIconForType(item.type)}`}></i>
                                            </div>
                                            <div>
                                                <h5 className="mb-0 font-weight-900 item-title">{item.item_name}</h5>
                                                <span className="text-muted d-block desc-text">
                                                    {item.quantity} {item.unit_name} {item.description && <span className="opacity-7">• {item.description}</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="border-bottom-custom">
                                        <div className="d-flex align-items-center">
                                            <div className="supplier-icon-box rounded p-2 me-2 text-center">
                                                <i className="fas fa-store"></i>
                                            </div>
                                            <span className="font-weight-600 supplier-text">
                                                {item.supplier_name || <span className="opacity-5 italic">Tidak ada supplier</span>}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="border-bottom-custom">
                                        <div 
                                            className={`d-inline-flex align-items-center rounded-pill font-weight-bold badge-pill-custom ${getBadgeClass(item.type)}`}
                                        >
                                            {item.type}
                                        </div>
                                    </td>

                                    <td className="text-end border-bottom-custom">
                                        <h4 className="mb-0 font-weight-900 item-price">
                                            <RupiahFormater value={item.total_amount} />
                                        </h4>
                                    </td>

                                    <td className="text-center border-bottom-custom">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button 
                                                id={`edit-${item.id}`}
                                                size="sm" 
                                                className="btn-action btn-edit rounded-circle d-flex align-items-center justify-content-center border-0"
                                                onClick={() => onEdit(item)}
                                            >
                                                <i className="fas fa-pen" />
                                            </Button>
                                            <UncontrolledTooltip target={`edit-${item.id}`} delay={0}>Sunting Item</UncontrolledTooltip>
                                            
                                            <Button 
                                                id={`del-${item.id}`}
                                                size="sm" 
                                                className="btn-action btn-delete rounded-circle d-flex align-items-center justify-content-center border-0"
                                                onClick={() => {
                                                    if (window.confirm("Yakin ingin menghapus rekaman pembelian ini?")) {
                                                        onDelete(item.id);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </Button>
                                            <UncontrolledTooltip target={`del-${item.id}`} delay={0}>Hapus Item</UncontrolledTooltip>
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
                
                .custom-purchase-table { border-collapse: separate; border-spacing: 0; }
                .purchase-row { transition: all 0.2s ease-in-out; }
                .purchase-row:hover {
                    background-color: #fcfdfe !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }
                body.dark-mode .purchase-row:hover { background-color: rgba(255,255,255,0.02) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
                
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

                /* Date Block */
                .date-block { width: 55px; background-color: #ffffff; border: 1px solid #e9ecef; transition: transform 0.2s; }
                body.dark-mode .date-block { background-color: #0f172a; border-color: rgba(255,255,255,0.1); }
                .purchase-row:hover .date-block { transform: scale(1.05); }
                .date-month { font-size: 0.65rem; padding: 4px 0; text-transform: uppercase; color: #8898aa; background-color: #f8f9fe; }
                body.dark-mode .date-month { background-color: rgba(255,255,255,0.05); color: #cbd5e1; }
                .date-day { font-size: 1.2rem; line-height: 1.2; padding: 4px 0; color: #172b4d; }
                body.dark-mode .date-day { color: #f8fafc; }

                /* Icon Avatar */
                .icon-avatar { width: 45px; height: 45px; background-color: rgba(94, 114, 228, 0.08); }
                body.dark-mode .icon-avatar { background-color: rgba(129, 140, 248, 0.15); }
                .icon-avatar i { font-size: 1.2rem; color: #5e72e4; transition: transform 0.3s ease; }
                body.dark-mode .icon-avatar i { color: #818cf8; }
                .purchase-row:hover .icon-avatar i { transform: scale(1.15); }

                /* Text Elements */
                .item-title { font-size: 0.95rem; color: #172b4d; }
                body.dark-mode .item-title { color: #f8fafc; }
                .desc-text { font-size: 0.8rem; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* Supplier */
                .supplier-icon-box { width: 32px; background-color: #f8f9fe; }
                body.dark-mode .supplier-icon-box { background-color: rgba(255,255,255,0.05); }
                .supplier-icon-box i { color: #adb5bd; }
                .supplier-text { font-size: 0.875rem; color: #525f7f; }
                body.dark-mode .supplier-text { color: #cbd5e1; }

                /* Item Price */
                .item-price { color: #172b4d; }
                body.dark-mode .item-price { color: #f8fafc; }

                /* Badges */
                .badge-pill-custom { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
                .badge-soft-success { background-color: rgba(45, 206, 137, 0.1); color: #2dce89; }
                .badge-soft-warning { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; }
                .badge-soft-info { background-color: rgba(17, 205, 239, 0.1); color: #11cdef; }

                /* Buttons */
                .btn-action { width: 36px; height: 36px; padding: 0; transition: all 0.2s ease; }
                .btn-action i { font-size: 0.8rem; }
                .btn-action:hover { transform: scale(1.1); box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08) !important; }
                
                .btn-edit { color: #5e72e4 !important; background-color: #f6f9fc !important; }
                body.dark-mode .btn-edit { background-color: rgba(129, 140, 248, 0.15) !important; color: #818cf8 !important; }
                .btn-edit:hover { background-color: #5e72e4 !important; color: #fff !important; }

                .btn-delete { color: #f5365c !important; background-color: #fff5f8 !important; }
                body.dark-mode .btn-delete { background-color: rgba(244, 63, 94, 0.15) !important; color: #fb7185 !important; }
                .btn-delete:hover { background-color: #f5365c !important; color: #fff !important; }
            `}</style>
        </div>
    );
};

export default PurchaseListTable;

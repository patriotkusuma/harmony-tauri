import React from 'react';
import { Table, Badge, Button, UncontrolledTooltip } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import moment from 'moment';

const PurchaseListTable = ({ data, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-spinner fa-spin fa-3x text-primary mb-3" />
                <p className="text-muted font-weight-bold">Memuat data pembelian...</p>
            </div>
        );
    }

    const items = data?.data || [];

    return (
        <div className="table-responsive bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table className="align-items-center table-flush border-0" hover>
                <thead className="thead-light">
                    <tr>
                        <th className="border-0 text-uppercase font-weight-bold text-xs" style={{ width: '120px' }}>Tanggal</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs">Item / Deskripsi</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs">Supplier</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs" style={{ width: '120px' }}>Tipe</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-right" style={{ width: '150px' }}>Total Amount</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-center" style={{ width: '100px' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-5 text-muted italic font-weight-bold">
                                Tidak ada rekaman pembelian yang ditemukan.
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.id} className="animate-fade-in">
                                <td className="font-weight-bold text-dark">
                                    {moment(item.purchase_date).format('DD MMM YYYY')}
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <span className="font-weight-900 text-primary ls-05">{item.item_name}</span>
                                        <small className="text-muted text-truncate" style={{ maxWidth: '200px' }}>
                                            {item.quantity} {item.unit_name} {item.description && `- ${item.description}`}
                                        </small>
                                    </div>
                                </td>
                                <td>
                                    <Badge color="secondary" className="text-dark font-weight-bold border">
                                        <i className="fas fa-truck-loading mr-1 opacity-5" />
                                        {item.supplier_name || '-'}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge 
                                        color={
                                            item.type === 'Persediaan' ? 'success' : 
                                            item.type === 'Investasi' ? 'warning' : 'info'
                                        } 
                                        pill
                                        className="font-weight-bold px-2"
                                    >
                                        {item.type}
                                    </Badge>
                                </td>
                                <td className="text-right">
                                    <span className="h5 font-weight-900 mb-0 text-dark">
                                        <RupiahFormater value={item.total_amount} />
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center" style={{ gap: '5px' }}>
                                        <Button 
                                            id={`edit-${item.id}`}
                                            color="info" 
                                            size="sm" 
                                            outline 
                                            className="rounded-circle btn-icon p-1 border-0 shadow-none"
                                            onClick={() => onEdit(item)}
                                        >
                                            <i className="fas fa-edit" />
                                        </Button>
                                        <UncontrolledTooltip target={`edit-${item.id}`}>Sunting</UncontrolledTooltip>
                                        
                                        <Button 
                                            id={`del-${item.id}`}
                                            color="danger" 
                                            size="sm" 
                                            outline 
                                            className="rounded-circle btn-icon p-1 border-0 shadow-none"
                                            onClick={() => {
                                                if (window.confirm("Yakin ingin menghapus rekaman pembelian ini? Jurnal akuntansi dan penyesuaian inventory akan otomatis di-revert.")) {
                                                    onDelete(item.id);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-trash-alt" />
                                        </Button>
                                        <UncontrolledTooltip target={`del-${item.id}`}>Hapus</UncontrolledTooltip>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            <style>{`
                .ls-05 { letter-spacing: 0.5px; }
                .animate-fade-in { animation: fadeIn 0.3s ease; }
            `}</style>
        </div>
    );
};

export default PurchaseListTable;

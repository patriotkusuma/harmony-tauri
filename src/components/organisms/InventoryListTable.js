import React from 'react';
import { Table, Badge, Button, UncontrolledTooltip } from 'reactstrap';

const InventoryListTable = ({ data, onDetail, onAdjust, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-spinner fa-spin fa-3x text-primary mb-3" />
                <p className="text-muted font-weight-bold">Memuat data inventaris...</p>
            </div>
        );
    }

    const items = data?.data || [];

    const getStockBadge = (current, initial) => {
        if (current <= 0) return { color: 'danger', label: 'Habis' };
        if (current < initial * 0.3) return { color: 'warning', label: 'Menipis' };
        return { color: 'success', label: 'Aman' };
    };

    return (
        <div className="table-responsive bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table className="align-items-center table-flush border-0" hover>
                <thead className="thead-light">
                    <tr>
                        <th className="border-0 text-uppercase font-weight-bold text-xs">Nama Barang</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-center">Stok Saat Ini</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-center">Stok Awal</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-center">Status</th>
                        <th className="border-0 text-uppercase font-weight-bold text-xs text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-5 text-muted font-weight-bold">
                                <div className="mb-2"><i className="fas fa-box-open fa-3x opacity-2" /></div>
                                Belum ada inventaris. Stok akan muncul otomatis <br/>setelah pembelian bertipe "Persediaan" dicatat.
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const badge = getStockBadge(item.current_stock, item.initial_stock);
                            return (
                                <tr key={item.uuid} className="animate-fade-in">
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="icon icon-xs icon-shape bg-light text-primary rounded-circle mr-3">
                                                <i className="fas fa-box" />
                                            </div>
                                            <span className="font-weight-900 text-dark">{item.nama}</span>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className={`h4 mb-0 font-weight-900 ${badge.color === 'danger' ? 'text-danger' : 'text-dark'}`}>
                                            {item.current_stock}
                                        </span>
                                        <small className="text-muted ml-1 font-weight-bold text-uppercase">{item.unit_name || 'unit'}</small>
                                    </td>
                                    <td className="text-center text-muted font-weight-bold">
                                        {item.initial_stock}
                                    </td>
                                    <td className="text-center">
                                        <Badge color={badge.color} pill className="font-weight-bold px-3">
                                            {badge.label}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center" style={{ gap: '8px' }}>
                                            <Button 
                                                id={`detail-${item.uuid}`}
                                                color="primary" 
                                                size="sm" 
                                                outline 
                                                className="rounded-pill px-3 border-0 shadow-none font-weight-bold"
                                                onClick={() => onDetail(item)}
                                            >
                                                <i className="fas fa-history mr-1" /> Riwayat
                                            </Button>
                                            
                                            <Button 
                                                id={`adjust-${item.uuid}`}
                                                color="info" 
                                                size="sm" 
                                                className="rounded-pill px-3 shadow-none font-weight-bold"
                                                onClick={() => onAdjust(item)}
                                            >
                                                <i className="fas fa-sliders-h mr-1" /> Sesuaikan
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default InventoryListTable;

import React from 'react';
import { Table, Button, Badge } from 'reactstrap';
import dayjs from 'dayjs';

const StockOpnameTab = ({ audits, isLoading, onStartOpname }) => {
    if (isLoading) return <div className="text-center py-5">Memuat riwayat audit...</div>;

    const data = audits || [];

    return (
        <div className="stock-opname-tab">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0 font-weight-bold text-muted text-uppercase ls-1">Riwayat Audit Stok Fisik</h4>
                    <p className="text-sm text-muted mb-0">Membandingkan stok sistem vs perhitungan fisik (Stock Opname)</p>
                </div>
                <Button color="primary" className="rounded-pill px-4 shadow-sm" onClick={onStartOpname}>
                    <i className="fas fa-clipboard-check me-2" /> Mulai Audit Baru
                </Button>
            </div>

            <div className="table-responsive rounded-xl shadow-sm border overflow-hidden">
                <Table className="align-middle mb-0 bg-white" hover>
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">Tanggal Audit</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">Nama Barang</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0 text-center">Stok Sistem</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0 text-center">Stok Fisik</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0 text-center">Selisih</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!data || data.length === 0) ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted italic">Belum ada riwayat audit stok.</td>
                            </tr>
                        ) : (
                            data.map((audit) => {
                                if (!audit) return null;
                                return (
                                    <tr key={audit.id}>
                                        <td className="px-4 py-3 font-weight-bold border-0">
                                            {dayjs(audit.audit_date).format('DD MMM YYYY')}
                                        </td>
                                        <td className="px-4 py-3 border-0">
                                            <span className="font-weight-900 text-dark">{audit.inventory_name || 'N/A'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center border-0 text-muted font-weight-bold">
                                            {audit.system_stock}
                                        </td>
                                        <td className="px-4 py-3 text-center border-0 font-weight-bold">
                                            {audit.physical_stock}
                                        </td>
                                        <td className="px-4 py-3 text-center border-0">
                                            <Badge 
                                                color={audit.difference === 0 ? 'success' : audit.difference < 0 ? 'danger' : 'warning'} 
                                                className="rounded-pill px-3 py-2"
                                                pill
                                            >
                                                {audit.difference > 0 ? `+${audit.difference}` : audit.difference}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 border-0 text-muted small">
                                            {audit.notes || '-'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </div>
            
            <style>{`
                .rounded-xl { border-radius: 1.25rem !important; }
                .font-weight-900 { font-weight: 900 !important; }
                .ls-1 { letter-spacing: 1px !important; }
            `}</style>
        </div>
    );
};

export default StockOpnameTab;

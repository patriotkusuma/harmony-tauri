import React from "react";
import { Table, Badge, Spinner } from "reactstrap";
import moment from "moment";

const OrderProductionTable = ({ data, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <Spinner color="primary" />
            <h4 className="mt-3 text-muted">Memuat Data Produksi...</h4>
        </div>
    );

    return (
        <div className="table-responsive">
            <Table className="align-items-center table-flush border-0">
                <thead className="thead-light">
                    <tr>
                        <th className="border-0 px-4 py-3">Produksi / Invoice</th>
                        <th className="border-0 px-4 py-3">Customer</th>
                        <th className="border-0 px-4 py-3">Layanan</th>
                        <th className="border-0 px-4 py-3">Update Target</th>
                        <th className="border-0 px-4 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, idx) => (
                        <tr key={idx} className="hover-light transition-all">
                            <td className="px-4">
                                <span className="text-dark font-weight-bold h5">{item.kode_pesan}</span>
                                <small className="d-block text-muted">Masuk: {moment(item.tanggal_pesan).format("DD MMM, HH:mm")}</small>
                            </td>
                            <td className="px-4">
                                <div className="d-flex align-items-center">
                                    <div className="avatar avatar-sm rounded-circle bg-soft-primary mr-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        {item.nama_pelanggan?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-dark font-weight-700">{item.nama_pelanggan}</span>
                                </div>
                            </td>
                            <td className="px-4 text-dark font-weight-600">
                                <Badge color="secondary" className="text-xs">{item.status}</Badge>
                            </td>
                            <td className="px-4">
                                <span className="text-dark">{moment(item.tanggal_selesai).format("DD MMM YYYY, HH:mm")}</span>
                                {item.is_overdue && <Badge color="danger-soft" className="ml-2 text-danger">Terlambat (Overdue)</Badge>}
                            </td>
                            <td className="text-center">
                                <Badge color={item.status === 'Baru' ? 'info' : 'warning'} pill className="px-3">
                                    {item.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <style>{`
                .hover-light:hover { background: rgba(0,0,0,0.02); }
                .danger-soft { background: rgba(245, 54, 92, 0.1); }
            `}</style>
        </div>
    );
};

export default OrderProductionTable;

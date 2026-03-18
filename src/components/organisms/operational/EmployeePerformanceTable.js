import React from "react";
import { Table, Spinner, Badge } from "reactstrap";
import RupiahFormater from "utils/RupiahFormater";

const EmployeePerformanceTable = ({ data, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <Spinner color="primary" />
            <h4 className="mt-3 text-muted">Memuat Kinerja Karyawan...</h4>
        </div>
    );

    return (
        <div className="table-responsive">
            <Table className="align-items-center table-flush">
                <thead className="thead-light">
                    <tr>
                        <th>NAMA KARYAWAN</th>
                        <th>TOTAL ORDER</th>
                        <th>SELESAI</th>
                        <th>VALUENYA</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, idx) => (
                        <tr key={idx}>
                            <td className="text-dark font-weight-bold">
                                {item.nama_pegawai} 
                                {item.nama_pegawai === 'System' && <Badge color="secondary" className="ml-2 text-xs">Automated</Badge>}
                            </td>
                            <td>{item.total_orders} Pesanan</td>
                            <td>{item.orders_completed} Pesanan</td>
                            <td className="text-dark font-weight-bold text-success">
                                <RupiahFormater value={item.total_omset} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default EmployeePerformanceTable;

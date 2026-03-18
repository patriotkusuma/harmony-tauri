import React from "react";
import { Table, Badge, Spinner } from "reactstrap";
import moment from "moment";

const RfidAuditTable = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <h4 className="mt-3 text-muted">Memuat Audit RFID...</h4>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <Table className="align-items-center table-flush">
                <thead className="thead-light">
                    <tr>
                        <th className="border-0 px-4 py-3">UID TAG</th>
                        <th className="border-0 px-4 py-3">STATUS</th>
                        <th className="border-0 px-4 py-3">PESANAN</th>
                        <th className="border-0 px-4 py-3">WAKTU PINDAI</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, idx) => (
                        <tr key={idx}>
                            <td className="text-primary font-weight-bold">{item.uid}</td>
                            <td>
                                <Badge color={item.status === 'Attached' ? 'primary' : 'secondary'} pill>
                                    {item.status}
                                </Badge>
                            </td>
                            <td className="font-weight-bold text-dark">
                                {item.kode_pesan || <span className="text-muted opacity-5">-</span>}
                            </td>
                            <td>
                                <i className="far fa-clock mr-2 opacity-5" />
                                {item.last_scanned ? moment(item.last_scanned).format("DD MMM YYYY, HH:mm") : 'Never'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default RfidAuditTable;

import React from "react";
import { Table, Badge, Spinner, Row, Col, Alert } from "reactstrap";
import moment from "moment";

const InventoryUsageTable = ({ data, lowStockAlerts, loading }) => {
    if (loading) return (
        <div className="text-center py-5">
            <Spinner color="primary" />
            <h4 className="mt-3 text-muted">Memuat Data Inventaris...</h4>
        </div>
    );

    return (
        <div className="inventory-report-content">
            {lowStockAlerts && lowStockAlerts.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-danger uppercase ls-1 mb-3">
                        <i className="fas fa-exclamation-triangle mr-2" />
                        Peringatan Stok Menipis
                    </h5>
                    <Row>
                        {lowStockAlerts.map((alert, idx) => (
                            <Col md="4" key={idx} className="mb-3">
                                <Alert color="danger" className="border-0 shadow-sm rounded-xl mb-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong className="d-block">{alert.item_name}</strong>
                                            <small>Sisa: {alert.current_qty} {alert.unit}</small>
                                        </div>
                                        <Badge color="white" className="text-danger">Min: {alert.minimum_qty}</Badge>
                                    </div>
                                </Alert>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            <div className="table-responsive">
                <Table className="align-items-center table-flush">
                    <thead className="thead-light">
                        <tr>
                            <th>Waktu Ambil</th>
                            <th>Item Barang</th>
                            <th>Jumlah</th>
                            <th>Tipe</th>
                            <th>Referensi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{moment(item.date).format("DD MMM YYYY, HH:mm")}</td>
                                    <td className="text-dark font-weight-bold">{item.item_name}</td>
                                    <td>
                                        <span className="font-weight-bold">{item.quantity}</span> {item.unit}
                                    </td>
                                    <td>
                                        <Badge color={item.type === 'out' ? 'danger' : 'success'} pill className="text-xs">
                                            {item.type === 'out' ? 'Keluar' : 'Masuk'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <small className="text-muted uppercase font-weight-bold">{item.reference_type}</small>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">Tidak ada data pemakaian stok</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <style>{`
                .rounded-xl { border-radius: 12px; }
                .ls-1 { letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
};

export default InventoryUsageTable;

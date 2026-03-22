import React from "react";
import { Col, Table, Badge, Spinner, Input, Button } from "reactstrap";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const AffiliateFeeTable = ({ data, loading, filterType, setFilterType, getServiceName, onEditFee, onDeleteFee }) => {
  return (
    <Col xl="8">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="font-weight-900 title-adaptive mb-0">
              <i className="fas fa-list text-info me-2"></i>Daftar Aturan Aktif
            </h5>
            <Input type="select" className="w-auto custom-input py-1 text-sm bg-input-box title-adaptive cursor-pointer" style={{minWidth: '180px'}} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="manager">Skema: Pengurus Kos</option>
                <option value="customer">Skema: Pelanggan Umum</option>
            </Input>
        </div>
        
        <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0 bg-white">
            <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
                <tr className="table-header-row">
                    <td className="table-header-cell">Layanan</td>
                    <td className="table-header-cell">Metode</td>
                    <td className="table-header-cell text-end">Nilai Komisi</td>
                    <td className="table-header-cell text-center">Batas Min</td>
                    <td className="table-header-cell text-center">Aksi</td>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan="5" className="text-center py-4"><Spinner color="primary" size="sm"/></td></tr>
                ) : (!data || data.length === 0) ? (
                    <tr>
                        <td colSpan="5" className="text-center py-5">
                        <i className="fas fa-tasks fa-2x text-light mb-3 empty-icon"></i>
                        <h5 className="text-muted font-weight-bold mb-0">Aturan skema belum diset untuk list ini.</h5>
                        </td>
                    </tr>
                ) : (
                data.map((item, idx) => (
                    <tr key={idx} className="op-row">
                        <td className="px-4 py-3 border-bottom-custom title-adaptive font-weight-700">
                            {getServiceName(item.IdJenisCuci)}
                        </td>
                        <td className="px-4 border-bottom-custom">
                            <Badge color="light" className="text-dark bg-input-box border-input rounded-pill px-3 py-1 font-weight-800 ls-1" style={{border: '1px solid #e9ecef'}}>
                                {item.FeeType.toUpperCase()}
                            </Badge>
                        </td>
                        <td className="px-4 border-bottom-custom text-end font-weight-900 text-success">
                            {item.FeeType === 'percentage' ? `${item.Amount}%` : formatRupiah(item.Amount)}
                            {item.FeeType === 'flat' && <small className="text-muted d-block font-weight-500">per kg/pcs</small>}
                        </td>
                        <td className="px-4 text-center border-bottom-custom text-muted font-weight-bold opacity-8">
                            {item.MinQty > 0 ? `${item.MinQty} (Kg/Pcs)` : <span className="opacity-5">-</span>}
                        </td>
                        <td className="px-4 text-center border-bottom-custom">
                            <div className="d-flex justify-content-center">
                                <Button color="link" className="text-primary btn-sm p-0 me-3" onClick={() => onEditFee(item)}>
                                   <i className="fas fa-edit"></i>
                                </Button>
                                <Button color="link" className="text-danger btn-sm p-0" onClick={() => onDeleteFee(item.ID)}>
                                   <i className="fas fa-trash"></i>
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))
                )}
            </tbody>
            </Table>
        </div>
    </Col>
  );
};

export default AffiliateFeeTable;

import React from "react";
import { Table, Button, Spinner } from "reactstrap";

const supplierTypeBadgeStyle = (type) => {
  const map = {
    "Online Marketplace": { background: "rgba(99,102,241,0.12)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.3)" },
    "Toko Fisik Retail":  { background: "rgba(20,184,166,0.12)", color: "#0f766e", border: "1px solid rgba(20,184,166,0.3)" },
    "Distributor":        { background: "rgba(245,158,11,0.12)", color: "#b45309", border: "1px solid rgba(245,158,11,0.3)" },
    "Lainnya":            { background: "rgba(100,116,139,0.12)", color: "#475569", border: "1px solid rgba(100,116,139,0.3)" },
  };
  const base = map[type] || map["Lainnya"];
  return {
    ...base,
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.4px",
    display: "inline-block",
    whiteSpace: "nowrap",
  };
};

const SupplierTable = ({ data, loading, onEdit, onDelete }) => {
  return (
    <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
      <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr className="table-header-row">
            <td className="table-header-cell">Supplier / Vendor</td>
            <td className="table-header-cell">Kontak Person</td>
            <td className="table-header-cell">Kategori / Tipe</td>
            <td className="table-header-cell">No. Telp</td>
            <td className="table-header-cell text-center">Aksi</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <Spinner color="primary" />
              </td>
            </tr>
          ) : (!data || data.length === 0) ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <i className="fas fa-truck-loading fa-3x text-light mb-3 empty-icon"></i>
                <h4 className="text-muted font-weight-bold mb-0">Belum Ada Data Supplier</h4>
                <small className="text-muted">Klik Tambah Supplier untuk mendaftarkan vendor baru.</small>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="op-row">
                <td className="px-4 py-3 border-bottom-custom">
                  <div className="d-flex align-items-center">
                    <div
                      className="avatar avatar-sm rounded-circle d-flex align-items-center justify-content-center me-3 font-weight-bold text-white"
                      style={{ width: 40, height: 40, background: "linear-gradient(135deg,#5e72e4,#825ee4)", flexShrink: 0 }}
                    >
                      {item.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <span className="font-weight-900 item-title d-block text-dark title-adaptive">{item.name}</span>
                      <small className="text-muted d-block" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {item.address || "Alamat belum diatur"}
                      </small>
                    </div>
                  </div>
                </td>
                <td className="px-4 border-bottom-custom title-adaptive font-weight-700 opacity-9">
                  {item.contact_person || <span className="opacity-4">-</span>}
                </td>
                <td className="px-4 border-bottom-custom">
                  <span style={supplierTypeBadgeStyle(item.supplier_type)}>
                    {item.supplier_type || "-"}
                  </span>
                </td>
                <td className="px-4 border-bottom-custom">
                  <span className="font-weight-600 text-success"><i className="fab fa-whatsapp me-2"></i>{item.telpone || '-'}</span>
                  {item.email && <small className="d-block text-muted">{item.email}</small>}
                </td>
                <td className="text-center border-bottom-custom px-4">
                  <Button color="link" className="text-primary btn-sm p-0 me-3" onClick={() => onEdit(item)}>
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button color="link" className="text-danger btn-sm p-0" onClick={() => onDelete(item.id)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SupplierTable;

import React from "react";
import { Table, Badge, Button, Spinner } from "reactstrap";
import { useKostStore, STATUS_CONFIG } from "../../../store/kostStore";

const KostTable = ({ filtered, onOpenStatusModal, onOpenChat }) => {
  const { loading, dataLoaded } = useKostStore();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Memuat data...</p>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="text-center py-5" style={{ color: "#94a3b8" }}>
        <i className="fas fa-building mb-3" style={{ fontSize: "3rem", opacity: 0.3 }} />
        <p className="font-weight-bold">Belum ada data dimuat</p>
        <p className="small">
          Klik <strong>Muat Data</strong> atau <strong>Import CSV</strong> untuk memulai.
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-5" style={{ color: "#94a3b8" }}>
        <i className="fas fa-search mb-3" style={{ fontSize: "3rem", opacity: 0.3 }} />
        <p>Tidak ada data yang cocok dengan filter.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ borderRadius: "0 0 16px 16px" }}>
      <Table hover className="align-items-center table-flush mb-0" style={{ tableLayout: "fixed", width: "100%", minWidth: "1000px" }}>
        <thead className="thead-light">
          <tr>
            <th className="kost-th" style={{ width: "50px" }}>#</th>
            <th className="kost-th" style={{ width: "200px" }}>Nama Kost</th>
            <th className="kost-th" style={{ width: "250px" }}>Alamat</th>
            <th className="kost-th" style={{ width: "150px" }}>Kontak</th>
            <th className="kost-th text-center" style={{ width: "90px" }}>Jarak</th>
            <th className="kost-th text-center" style={{ width: "110px" }}>Rating</th>
            <th className="kost-th text-center" style={{ width: "130px" }}>Status</th>
            <th className="kost-th text-center" style={{ width: "180px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((kost, idx) => {
            const cfg = STATUS_CONFIG[kost.status] ?? STATUS_CONFIG["pending"];
            return (
              <tr key={kost.id} style={{ transition: "background 0.15s" }}>
                <td className="px-4 py-3 text-muted">{idx + 1}</td>
                <td className="px-3 py-3" onClick={() => onOpenChat(kost)} style={{ cursor: "pointer" }}>
                  <div className="text-truncate font-weight-bold text-dark" style={{ maxWidth: "180px" }}>
                    {kost.name}
                  </div>
                  <div className="text-muted small text-truncate" style={{ maxWidth: "180px" }}>{kost.category}</div>
                </td>
                <td className="px-3 py-3">
                  <div
                    className="text-truncate"
                    style={{
                      maxWidth: "230px",
                      color: "#64748b",
                    }}
                    title={kost.address}
                  >
                    {kost.address || "-"}
                  </div>
                  {kost.maps_link && (
                    <a
                      href={kost.maps_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-info small"
                    >
                      <i className="fas fa-map-marker-alt mr-1" />
                      Lihat Maps
                    </a>
                  )}
                </td>
                <td className="px-3 py-3">
                  {kost.phone ? (
                    <a
                      href={`https://wa.me/${kost.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-success font-weight-bold"
                    >
                      <i className="fab fa-whatsapp mr-1" />
                      {kost.phone}
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {kost.distance ? (
                    <div className="font-weight-bold" style={{ color: "#2563eb" }}>
                      <i className="fas fa-route mr-1" style={{ opacity: 0.6 }} />
                      {kost.distance.toFixed(1)} km
                    </div>
                  ) : (
                    <span className="text-muted small">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <div style={{ color: "#f59e0b", fontSize: "0.9rem" }}>
                    {"★".repeat(Math.round(kost.rating || 0))}
                  </div>
                  <div className="text-muted small">
                    {kost.rating?.toFixed(1) ?? "0.0"} ({kost.review_count ?? 0})
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <Badge
                    color={cfg.color}
                    pill
                    style={{ padding: "5px 14px", fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    <i className={`${cfg.icon} mr-1`} />
                    {cfg.label}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="d-flex justify-content-center">
                    <Button
                      color="light"
                      size="sm"
                      onClick={() => onOpenStatusModal(kost)}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.78rem",
                        padding: "5px 12px",
                      }}
                    >
                      <i className="fas fa-edit mr-1" />
                      Status
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      outline
                      onClick={() => onOpenChat(kost)}
                      className="ml-2"
                      style={{
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        padding: "5px 12px",
                      }}
                    >
                      <i className="fab fa-whatsapp mr-1" />
                      WA
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default KostTable;

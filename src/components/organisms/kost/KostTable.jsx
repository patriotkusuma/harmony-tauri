import React from "react";
import { Table, Badge, Button, Spinner } from "reactstrap";
import { useKostStore, STATUS_CONFIG } from "../../../store/kostStore";

const KostTable = ({ filtered, onOpenStatusModal }) => {
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
    <div style={{ overflowX: "auto" }}>
      <Table hover responsive className="mb-0" style={{ fontSize: "0.875rem" }}>
        <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
          <tr>
            <th className="kost-th" style={{ width: "40px" }}>#</th>
            <th className="kost-th">Nama Kost</th>
            <th className="kost-th">Alamat</th>
            <th className="kost-th">Kontak</th>
            <th className="kost-th text-center">Rating</th>
            <th className="kost-th text-center">Status</th>
            <th className="kost-th text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((kost, idx) => {
            const cfg = STATUS_CONFIG[kost.status] ?? STATUS_CONFIG["pending"];
            return (
              <tr key={kost.id} style={{ transition: "background 0.15s" }}>
                <td className="px-4 py-3 text-muted">{idx + 1}</td>
                <td className="px-3 py-3">
                  <div className="font-weight-bold text-dark" style={{ maxWidth: "220px" }}>
                    {kost.name}
                  </div>
                  <div className="text-muted small">{kost.category}</div>
                </td>
                <td className="px-3 py-3">
                  <div
                    style={{
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#64748b",
                    }}
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

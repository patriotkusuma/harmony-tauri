import React, { useState } from "react";
import { Card, CardHeader, CardBody, Badge, Button, Spinner } from "reactstrap";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import dayjs from "dayjs";
import { formatImageUrl } from "utils/formatImageUrl";

/**
 * BuktiFotoSection menampilkan galeri satu jenis bukti (pembayaran / pakaian /
 * pengiriman). Komponen ini tidak dirender bila tidak ada foto sama sekali,
 * sehingga detail pesanan tetap ringkas untuk pesanan tanpa bukti.
 */
const BuktiFotoSection = ({
  title,
  icon,
  accent = "primary",
  items = [],
  emptyHint,
  canUpload = false,
  onUpload,
  onDelete,
  uploading = false,
}) => {
  const [brokenIds, setBrokenIds] = useState({});

  const hasItems = Array.isArray(items) && items.length > 0;
  if (!hasItems && !canUpload) return null;

  const handleBroken = (id) => setBrokenIds((prev) => ({ ...prev, [id]: true }));

  return (
    <Card className="shadow-lg border-0 mb-4 rounded-lg">
      <CardHeader className="bg-transparent border-0 d-flex align-items-center justify-content-between pt-4 pb-2">
        <h5
          className="text-uppercase text-muted mb-0 d-flex align-items-center font-weight-bold"
          style={{ letterSpacing: "1px", fontSize: "0.8rem" }}
        >
          <i className={`${icon} me-2 text-${accent}`} />
          {title}
          {hasItems && (
            <Badge color={accent} pill className="ms-2">
              {items.length}
            </Badge>
          )}
        </h5>

        {canUpload && onUpload && (
          <Button
            color={accent}
            size="sm"
            className="shadow-sm"
            disabled={uploading}
            onClick={onUpload}
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="me-1" /> Mengunggah…
              </>
            ) : (
              <>
                <i className="fas fa-plus me-1" /> Tambah Foto
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardBody className="pt-0">
        {!hasItems ? (
          <div className="text-center py-4">
            <i className={`${icon} fa-2x text-muted opacity-5 mb-2`} />
            <div className="text-muted small">{emptyHint || "Belum ada foto bukti."}</div>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item) => {
              const available = item.tersedia !== false && !brokenIds[item.id];
              return (
                <div className="col-6 col-lg-4" key={item.id}>
                  <div className="position-relative rounded overflow-hidden shadow-sm bg-light h-100 d-flex flex-column">
                    {available ? (
                      <Zoom>
                        <img
                          alt={`bukti-${item.jenis}`}
                          className="rounded-top"
                          src={formatImageUrl(item.foto)}
                          onError={() => handleBroken(item.id)}
                          style={{
                            aspectRatio: "4 / 3",
                            objectFit: "cover",
                            width: "100%",
                            display: "block",
                            cursor: "zoom-in",
                          }}
                        />
                      </Zoom>
                    ) : (
                      // Catatan bukti ada di database tetapi berkasnya hilang.
                      <div
                        className="d-flex flex-column align-items-center justify-content-center bg-secondary text-muted rounded-top"
                        style={{ aspectRatio: "4 / 3", width: "100%" }}
                      >
                        <i className="fas fa-image-slash fa-2x mb-2 opacity-5" />
                        <small className="font-weight-bold">Bukti hilang</small>
                        <small className="px-2 text-center" style={{ fontSize: "0.65rem" }}>
                          Berkas tidak ditemukan di server
                        </small>
                      </div>
                    )}

                    <div className="px-2 py-2 bg-white flex-grow-1 d-flex flex-column">
                      {item.keterangan ? (
                        <small className="text-dark text-truncate" title={item.keterangan}>
                          {item.keterangan}
                        </small>
                      ) : (
                        <small className="text-muted fst-italic">Tanpa keterangan</small>
                      )}
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                          {item.created_at ? dayjs(item.created_at).format("DD MMM YYYY HH:mm") : "-"}
                        </small>
                        {onDelete && (
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 text-danger"
                            title="Hapus foto"
                            onClick={() => onDelete(item)}
                          >
                            <i className="fas fa-trash fa-xs" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BuktiFotoSection;

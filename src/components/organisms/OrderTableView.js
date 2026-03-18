import React from "react";
import { Button, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { CustomTable } from "components/Table/CustomTable";
import CustomerAvatar from "components/atoms/CustomerAvatar";
import RupiahFormater from "utils/RupiahFormater";
import { useOrder } from "hooks/useOrder";
import "assets/css/order-status.css";

const headRow = [
  "No",
  "Pesanan",
  "Customer",
  "Total",
  "Status",
  "Action"
];

const OrderTableView = () => {
  const { 
    pesanan, 
    isLoading, 
    toggleDetailModal, 
    updateStatus, 
    printName, 
    printInvoice,
    sendInvoice,
    sendNotification 
  } = useOrder();
  
  const navigate = useNavigate();

  const checkStatus = (param) => {
    const dates = (
      <div className="mb-2" style={{ color: "inherit" }}>
        <div className="d-flex align-items-center text-xs opacity-8 mb-1">
          <i className="far fa-calendar-alt mr-2"></i>
          <span>In: {moment(param.tanggal_pesan).format("DD MMM, HH:mm")}</span>
        </div>
        <div className="d-flex align-items-center text-xs font-weight-bold">
          <i className="far fa-check-circle mr-2"></i>
          <span>Out: {moment(param.tanggal_selesai).format("DD MMM, HH:mm")}</span>
        </div>
      </div>
    );

    switch (param.status) {
      case "diambil":
        return (
          <div className="text-center">
            {dates}
            <h4 className="text-white px-2 py-1 bg-default rounded-pill mb-0 mt-2 text-sm">
              <span className="mr-1">{param.status}</span>
              <i className="fas fa-check-circle text-xs"></i>
            </h4>
          </div>
        );
      case "batal":
        return (
          <div className="text-center">
            {dates}
            <h4 className="text-white px-2 py-1 bg-danger rounded-pill mb-0 mt-2 text-sm">
              <span className="mr-1">{param.status}</span>
              <i className="fas fa-times-circle text-xs"></i>
            </h4>
          </div>
        );
      default:
        return (
          <div className="text-center">
            {dates}
            <h4 className="text-white px-2 py-1 bg-success rounded-pill mb-2 mt-2 text-sm">
              <span className="mr-2">{param.status}</span>
            </h4>
            <div className="d-flex justify-content-center" style={{ gap: "8px" }}>
              {param.status === "cuci" && (
                <a
                  type="button"
                  className="text-danger font-weight-bold cursor-pointer text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(param.kode_pesan, "selesai");
                  }}
                >
                  Selesai
                </a>
              )}
              {param.status !== "diambil" && (
                <a
                  type="button"
                  className="text-primary font-weight-bold cursor-pointer text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(param.kode_pesan, "diambil");
                  }}
                >
                  Diambil
                </a>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <CustomTable headData={headRow} currentUrl="/order">
      {isLoading && (
        <tr>
          <td colSpan={7} className="text-center">
            Loading ...
          </td>
        </tr>
      )}

      {Array.isArray(pesanan?.data) &&
        pesanan.data.map((pesan, index) => {
          const getStatusClass = (status) => {
            if (status === "batal") return "order-row-batal";
            if (status === "diambil") return "order-row-diambil";
            if (status === "cuci") return "order-row-cuci";
            if (status === "setrika") return "order-row-setrika";
            if (status === "selesai") return "order-row-selesai";
            return "";
          };

          const getStatusIcon = (status) => {
            if (status === "cuci") return "fas fa-soap";
            if (status === "setrika") return "fas fa-tshirt";
            if (status === "selesai") return "fas fa-check-double";
            return null;
          };

          const statusIcon = getStatusIcon(pesan.status);

          return (
            <tr
              key={index}
              className={`align-middle shadow-sm-hover cursor-pointer ${getStatusClass(pesan.status)}`}
              style={{ transition: "all 0.2s ease" }}
              onClick={() => toggleDetailModal(pesan)}
            >
              <th scope="row" className="text-center font-weight-bold position-relative">
                {statusIcon && <i className={`${statusIcon} row-status-icon`} />}
                {(pesanan.current_page - 1) * pesanan.per_page + index + 1}
              </th>

            <td className="position-relative" style={{ minWidth: "180px" }}>
              {pesan.status === "batal" && <div className="status-stamp status-stamp-batal">BATAL</div>}
              {pesan.status === "diambil" && <div className="status-stamp status-stamp-diambil">DIAMBIL</div>}
              
              <div className="d-flex flex-column h-100">
                <span
                  role="button"
                  title="Klik untuk copy kode pesanan"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(pesan.kode_pesan);
                    toast.success("Kode pesanan berhasil disalin", { autoClose: 1500 });
                  }}
                  className="cursor-pointer font-weight-bold text-primary mb-1"
                >
                  {pesan.kode_pesan}
                  <i className="fas fa-copy ml-2 text-muted" />
                </span>

                {Array.isArray(pesan?.detail_pesanans) &&
                  pesan.detail_pesanans.map((detail, idx) => (
                    <div key={idx} className="text-sm">
                      <strong>{detail.jenis_cuci.nama}</strong>
                    </div>
                  ))}

                <div className="mt-2 d-flex flex-wrap" style={{ gap: "6px" }}>
                  {pesan.notify_pesan === 0 &&
                    !["diambil", "batal"].includes(pesan.status) && (
                      <Button
                        color="warning"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendInvoice(pesan.kode_pesan);
                        }}
                        className="text-xs py-1 px-2"
                        style={{ flex: "1" }}
                      >
                        <i className="fas fa-paper-plane mr-1" />
                        Invoice
                      </Button>
                    )}

                  {pesan.notify_selesai === 0 &&
                    !["diambil", "batal"].includes(pesan.status) && (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendNotification(pesan.kode_pesan);
                        }}
                        className="text-xs py-1 px-2"
                        style={{ flex: "1" }}
                      >
                        <i className="fas fa-bell mr-1" />
                        Notif
                      </Button>
                    )}
                </div>
              </div>
            </td>

            <td className="d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center mb-2">
                <div
                  className="mr-2 rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold"
                  style={{ width: "35px", height: "35px", flexShrink: 0, fontSize: "0.9rem" }}
                >
                  <CustomerAvatar customer={pesan.customer} fallbackType="initials" />
                </div>
                <div>
                  <strong className="mb-0 text-sm d-block text-dark">
                    {pesan.customer.nama}
                  </strong>
                  {pesan.customer.keterangan && (
                    <span className="text-muted text-xs">({pesan.customer.keterangan})</span>
                  )}
                </div>
              </div>

              <div className="d-flex flex-wrap mt-1" style={{ gap: "6px" }}>
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/admin/messages', { state: { phone: pesan.customer.telpon } });
                  }}
                  className="badge badge-success badge-pill shadow-sm cursor-pointer"
                >
                  <i className="fab fa-whatsapp mr-1"></i>
                  {pesan.customer.telpon}
                </span>

                <span
                  className={`badge badge-${pesan.notify_pesan_error === 1 && pesan.notify_pesan === 0 ? "warning" : "info"} badge-pill shadow-sm`}
                >
                  <i className="fas fa-paper-plane mr-1"></i> Inv{" "}
                  {pesan.notify_pesan_error === 1 && pesan.notify_pesan === 0 ? "Gagal" : "OK"}
                </span>

                {pesan.status === "selesai" && (
                  <span
                    className={`badge badge-${pesan.notify_selesai === 0 ? "danger" : "default"} badge-pill shadow-sm`}
                  >
                    <i className="fas fa-bell mr-1"></i> Notif{" "}
                    {pesan.notify_selesai === 0 ? "Gagal" : "OK"}
                  </span>
                )}
              </div>

              {pesan.status !== "batal" && (
                <div className="mt-2">
                  <Button
                    color="secondary"
                    size="sm"
                    className="px-2 py-1 text-xs shadow-none border"
                    onClick={(e) => {
                      e.stopPropagation();
                      printName(pesan);
                    }}
                  >
                    <i className="fa-solid fa-print mr-1 text-primary"></i>
                    Print Nama
                  </Button>
                </div>
              )}
            </td>


            <td className="align-middle text-center">
              <div
                className={`badge badge-${pesan.status_pembayaran === "Lunas" ? "success" : "danger"} badge-pill px-3 py-2 mb-2 shadow-sm`}
                style={{ fontSize: "0.8rem" }}
              >
                <i
                  className={`fas fa-${pesan.status_pembayaran === "Lunas" ? "check" : "exclamation-triangle"} mr-1`}
                />
                {pesan.status_pembayaran}
              </div>
              <h4 className="mb-0 text-dark font-weight-bold">
                <RupiahFormater value={pesan.total_harga} />
              </h4>
            </td>
            <td>{checkStatus(pesan)}</td>

            <td style={{ width: "10%" }}>
              <Row style={{ "gap-y": "12px" }}>
                <Col xs="12">
                  <Button
                    color="warning"
                    size="sm"
                    block
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDetailModal(pesan);
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                    <span>Detail</span>
                  </Button>
                </Col>
                <Col xs="12">
                  <Button
                    color="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      printInvoice(pesan);
                    }}
                    block
                  >
                    <i className="fa-solid fa-print"></i>
                    <span>Print</span>
                  </Button>
                </Col>
              </Row>
            </td>
            </tr>
          );
        })}
    </CustomTable>
  );
};

export default OrderTableView;

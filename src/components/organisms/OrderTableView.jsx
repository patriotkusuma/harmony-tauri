import React, { memo, useCallback } from "react";
import { 
  UncontrolledDropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem 
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
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

// ── Helper Status Baris & Ikon ──
const getStatusClass = (status) => {
  if (status === "batal") return "order-row-batal";
  if (status === "diambil") return "order-row-diambil";
  if (status === "cuci") return "order-row-cuci";
  if (status === "setrika") return "order-row-setrika";
  if (status === "selesai") return "order-row-selesai";
  return "";
};

const checkStatus = (param, updateStatus) => {
  const dates = (
    <div className="mb-2" style={{ color: "inherit" }}>
      <div className="d-flex align-items-center text-xs opacity-8 mb-1">
        <i className="far fa-calendar-alt me-1 text-muted"></i>
        <span>In: {dayjs(param.tanggal_pesan).format("DD MMM, HH:mm")}</span>
      </div>
      <div className="d-flex align-items-center text-xs font-weight-bold">
        <i className="far fa-check-circle me-1 text-primary"></i>
        <span>Out: {dayjs(param.tanggal_selesai).format("DD MMM, HH:mm")}</span>
      </div>
    </div>
  );

  switch (param.status) {
    case "diambil":
      return (
        <div className="text-center">
          {dates}
          <span className="hl-badge hl-badge-neutral">
            <span>Diambil</span>
            <i className="fas fa-check-circle"></i>
          </span>
        </div>
      );
    case "batal":
      return (
        <div className="text-center">
          {dates}
          <span className="hl-badge hl-badge-danger">
            <span>Batal</span>
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      );
    case "selesai":
      return (
        <div className="text-center">
          {dates}
          <span className="hl-badge hl-badge-success mb-2">
            <span>Selesai</span>
            <i className="fas fa-check-double"></i>
          </span>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-link text-primary p-0 text-xs font-weight-bold"
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(param.kode_pesan, "diambil");
              }}
            >
              Set Diambil →
            </button>
          </div>
        </div>
      );
    default:
      return (
        <div className="text-center">
          {dates}
          <span className="hl-badge hl-badge-info mb-2">
            <span>{param.status}</span>
          </span>
          <div className="d-flex justify-content-center gap-2">
            {param.status === "cuci" && (
              <button
                type="button"
                className="btn btn-sm btn-link text-success p-0 text-xs font-weight-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(param.kode_pesan, "selesai");
                }}
              >
                Selesai
              </button>
            )}
            {param.status !== "diambil" && (
              <button
                type="button"
                className="btn btn-sm btn-link text-primary p-0 text-xs font-weight-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(param.kode_pesan, "diambil");
                }}
              >
                Diambil
              </button>
            )}
          </div>
        </div>
      );
  }
};

const buildInvoiceMessage = (p) => {
  const hour = new Date().getHours();
  let greeting = "Malam";
  if (hour < 11) greeting = "Pagi";
  else if (hour < 15) greeting = "Siang";
  else if (hour < 18) greeting = "Sore";

  const customerName = p.customer?.nama || "";
  const paymentStatus = p.status_pembayaran === "Lunas" ? "Lunas" : "Belum Lunas";
  const total = new Intl.NumberFormat('id-ID').format(p.total_harga || 0);
  
  let items = "";
  if (Array.isArray(p.detail_pesanans)) {
      items = p.detail_pesanans.map((d, i) => {
          const nama = d.jenis_cuci?.nama || "Layanan";
          const qty = d.qty || 0;
          const estimasi = dayjs(p.tanggal_selesai).locale("id").format("HH:mm, dddd DD MMMM YYYY");
          return `${i+1}. *${nama}*\n   • Qty: ${qty}\n   • Estimasi: *${estimasi}*`;
      }).join("\n");
  }

  return `Selamat ${greeting} kak *${customerName}* 👋\n\nPesanan laundry Anda telah kami terima. Berikut detailnya:\n\n📄 *Kode Pesanan:* ${p.kode_pesan}\n💳 *Pembayaran:* ${paymentStatus}\n💲 *Total:* Rp *${total}*\n\n🧺 *Detail Cucian:*\n${items}\n\n-------------------------\n🔗 Informasi Selengkapnya:\nhttps://harmonylaundrys.com/${p.kode_pesan}\n\n🙏 Terima kasih telah menggunakan layanan kami 🙏\n*Harmony Laundry*`;
};

const buildSelesaiMessage = (p) => {
  const hour = new Date().getHours();
  let greeting = "Malam";
  if (hour < 11) greeting = "Pagi";
  else if (hour < 15) greeting = "Siang";
  else if (hour < 18) greeting = "Sore";

  const customerName = p.customer?.nama || "";
  const paymentStatus = p.status_pembayaran === "Lunas" ? "Lunas" : "Belum Lunas";
  const total = new Intl.NumberFormat('id-ID').format(p.total_harga || 0);

  return `Halo selamat ${greeting} kak *${customerName}* 👋\n\nPesanan laundry Anda *${p.kode_pesan}* sudah *SELESAI* dan siap ${p.antar === 1 ? 'diantar' : 'diambil'}!\n\nStatus Pembayaran: *${paymentStatus}*\nTotal: *Rp ${total}*\n\nTerima kasih telah mempercayakan pakaian Anda di *Harmony Laundry*!`;
};

const OrderRow = memo(({
  pesan,
  index,
  currentPage,
  perPage,
  toggleDetailModal,
  updateStatus,
  printName,
  printStrukFinal,
  printStrukCustomer,
  sendInvoice,
  sendNotification,
  toggleInvoicePreviewModal,
  onCopyInvoice,
  onCopySelesai,
  onOpenChat,
}) => {
  const rowNumber = (currentPage - 1) * perPage + index + 1;

  return (
    <tr
      key={pesan.id}
      className={`align-middle cursor-pointer ${getStatusClass(pesan.status)}`}
      onClick={() => toggleDetailModal(pesan)}
    >
      <td className="text-center font-weight-bold text-muted" style={{ width: "40px" }}>
        {rowNumber}
      </td>

      <td className="position-relative" style={{ minWidth: "170px" }}>
        {pesan.status === "batal" && <div className="status-stamp status-stamp-batal">BATAL</div>}
        {pesan.status === "diambil" && <div className="status-stamp status-stamp-diambil">DIAMBIL</div>}
        
        <div className="d-flex flex-column h-100">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              role="button"
              title="Klik untuk salin kode pesanan"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(pesan.kode_pesan);
                toast.success("Kode disalin: " + pesan.kode_pesan, { autoClose: 1500 });
              }}
              className="font-weight-bold text-primary font-monospace"
              style={{ fontSize: "0.85rem" }}
            >
              {pesan.kode_pesan}
              <i className="fas fa-copy ms-1 opacity-6" style={{ fontSize: "0.75rem" }} />
            </span>
          </div>

          {Array.isArray(pesan?.detail_pesanans) &&
            pesan.detail_pesanans.map((detail, idx) => (
              <div key={idx} className="text-xs text-muted font-weight-500">
                • {detail.jenis_cuci.nama}
              </div>
            ))}

          {/* Quick WA Action Buttons */}
          <div className="d-flex flex-wrap gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
            {pesan.notify_pesan === 0 && !["diambil", "batal"].includes(pesan.status) && (
              <button
                type="button"
                onClick={() => sendInvoice(pesan.kode_pesan)}
                className="btn btn-sm btn-outline-warning py-0 px-2 text-xs rounded-pill"
                title="Kirim Invoice WA otomatis"
              >
                <i className="fas fa-paper-plane me-1" />
                Inv
              </button>
            )}

            {pesan.notify_selesai === 0 && !["diambil", "batal"].includes(pesan.status) && (
              <button
                type="button"
                onClick={() => sendNotification(pesan.kode_pesan)}
                className="btn btn-sm btn-outline-primary py-0 px-2 text-xs rounded-pill"
                title="Kirim Notif Selesai WA"
              >
                <i className="fas fa-bell me-1" />
                Notif
              </button>
            )}

            <button
              type="button"
              onClick={() => onCopyInvoice(pesan)}
              className="btn btn-sm btn-light py-0 px-2 text-xs rounded-pill border"
              title="Salin Teks Invoice"
            >
              <i className="fas fa-file-alt me-1 text-muted" />
              Copy
            </button>
          </div>
        </div>
      </td>

      <td style={{ minWidth: "180px" }}>
        <div className="d-flex align-items-center mb-1">
          <div
            className="me-2 rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold"
            style={{ width: "32px", height: "32px", flexShrink: 0, fontSize: "0.8rem" }}
          >
            <CustomerAvatar customer={pesan.customer} fallbackType="initials" />
          </div>
          <div>
            <strong className="text-sm d-block text-dark mb-0">
              {pesan.customer.nama}
            </strong>
            {pesan.customer.keterangan && (
              <span className="text-muted text-xs">({pesan.customer.keterangan})</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
          <span
            role="button"
            onClick={() => onOpenChat(pesan.customer.telpon)}
            className="hl-badge hl-badge-success cursor-pointer"
            title="Buka Chat WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
            {pesan.customer.telpon}
          </span>

          <span
            className={`hl-badge ${pesan.notify_pesan_error === 1 && pesan.notify_pesan === 0 ? "hl-badge-warning" : "hl-badge-info"}`}
            title="Status pengiriman pesan invoice"
          >
            Inv {pesan.notify_pesan_error === 1 && pesan.notify_pesan === 0 ? "Gagal" : "OK"}
          </span>
        </div>
      </td>

      <td className="text-center" style={{ minWidth: "120px" }}>
        <div className="mb-1">
          <span className={`hl-badge ${pesan.status_pembayaran === "Lunas" ? "hl-badge-success" : "hl-badge-danger"}`}>
            <i className={`fas fa-${pesan.status_pembayaran === "Lunas" ? "check" : "exclamation-triangle"}`} />
            {pesan.status_pembayaran}
          </span>
        </div>
        <div className="font-weight-bold text-dark" style={{ fontSize: "0.95rem" }}>
          <RupiahFormater value={pesan.total_harga} />
        </div>
      </td>

      <td>{checkStatus(pesan, updateStatus)}</td>

      {/* Action Column: Sleek Nota + Dropdown 3 Print + Detail */}
      <td style={{ width: "170px" }}>
        <div 
          className="hl-action-cell"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Primary Action: Nota (Preview & Cetak) */}
          <button
            type="button"
            className="hl-btn-action hl-btn-nota"
            onClick={() => toggleInvoicePreviewModal(pesan)}
            title="Buka Pratinjau Nota Customer"
            aria-label={`Preview nota pesanan ${pesan.kode_pesan}`}
          >
            <i className="fa-solid fa-file-invoice" aria-hidden="true"></i>
            <span>Nota</span>
          </button>

          {/* 2. Print Menu Dropdown (3 Tipe Cetak Sesuai Permintaan) */}
          {pesan.status !== "batal" && (
            <UncontrolledDropdown>
              <DropdownToggle 
                tag="button"
                className="hl-btn-action hl-btn-print-dropdown"
                title="Pilihan Cetak Lainnya"
                aria-label="Menu Cetak"
              >
                <i className="fa-solid fa-print"></i>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.6rem" }}></i>
              </DropdownToggle>

              <DropdownMenu end className="hl-print-menu">
                {/* 1. Label Nama (Proses Pencucian - Tanpa Pembulatan) */}
                <DropdownItem
                  className="hl-print-item"
                  onClick={() => printName(pesan)}
                >
                  <i className="fa-solid fa-user-tag text-primary"></i>
                  <div>
                    <div>Print Nama</div>
                    <small className="text-muted d-block" style={{ fontSize: "0.68rem" }}>
                      Label cuci (tanpa pembulatan)
                    </small>
                  </div>
                </DropdownItem>

                {/* 2. Struk Final / Packing */}
                <DropdownItem
                  className="hl-print-item"
                  onClick={() => printStrukFinal(pesan)}
                >
                  <i className="fa-solid fa-box-archive text-success"></i>
                  <div>
                    <div>Struk Packing</div>
                    <small className="text-muted d-block" style={{ fontSize: "0.68rem" }}>
                      Tempel di packing laundry
                    </small>
                  </div>
                </DropdownItem>

                {/* 3. Struk Customer (Sama Hal. Pesan + QR) */}
                <DropdownItem
                  className="hl-print-item"
                  onClick={() => printStrukCustomer(pesan)}
                >
                  <i className="fa-solid fa-receipt text-info"></i>
                  <div>
                    <div>Struk Customer</div>
                    <small className="text-muted d-block" style={{ fontSize: "0.68rem" }}>
                      Format lengkap + QR Code
                    </small>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}

          {/* 3. Detail Action */}
          <button
            type="button"
            className="hl-btn-action hl-btn-detail"
            onClick={() => toggleDetailModal(pesan)}
            title="Lihat Detail Pesanan"
            aria-label={`Buka detail pesanan ${pesan.kode_pesan}`}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>
      </td>
    </tr>
  );
});

const OrderTableView = () => {
  const { 
    pesanan, 
    isLoading, 
    toggleDetailModal, 
    updateStatus, 
    printName, 
    printStrukFinal,
    printStrukCustomer,
    sendInvoice,
    sendNotification,
    toggleInvoicePreviewModal
  } = useOrder();
  
  const navigate = useNavigate();

  const onOpenChat = useCallback((telpon) => {
    navigate("/admin/messages", { state: { phone: telpon } });
  }, [navigate]);

  const copyInvoiceMessage = useCallback((p) => {
    navigator.clipboard.writeText(buildInvoiceMessage(p))
      .then(() => toast.success("Pesan invoice berhasil disalin!"))
      .catch(() => toast.error("Gagal menyalin pesan invoice."));
  }, []);

  const copySelesaiMessage = useCallback((p) => {
    navigator.clipboard.writeText(buildSelesaiMessage(p))
      .then(() => toast.success("Pesan notifikasi selesai berhasil disalin!"))
      .catch(() => toast.error("Gagal menyalin pesan notifikasi selesai."));
  }, []);

  return (
    <CustomTable headData={headRow} currentUrl="/order">
      {isLoading && (
        <tr>
          <td colSpan={6} className="text-center py-4 text-muted">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Memuat data pesanan...
          </td>
        </tr>
      )}

      {Array.isArray(pesanan?.data) &&
        pesanan.data.map((pesan, index) => (
          <OrderRow
            key={pesan.kode_pesan || index}
            pesan={pesan}
            index={index}
            currentPage={pesanan.current_page}
            perPage={pesanan.per_page}
            toggleDetailModal={toggleDetailModal}
            updateStatus={updateStatus}
            printName={printName}
            printStrukFinal={printStrukFinal}
            printStrukCustomer={printStrukCustomer}
            sendInvoice={sendInvoice}
            sendNotification={sendNotification}
            toggleInvoicePreviewModal={toggleInvoicePreviewModal}
            onCopyInvoice={copyInvoiceMessage}
            onCopySelesai={copySelesaiMessage}
            onOpenChat={onOpenChat}
          />
        ))}
    </CustomTable>
  );
};

export default OrderTableView;

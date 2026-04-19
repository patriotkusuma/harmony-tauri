import React, { useRef } from "react";
import { Modal, ModalBody, ModalFooter, Button, Row, Col } from "reactstrap";
import moment from "moment";
import RupiahFormater from "utils/RupiahFormater";
import { useOrder } from "hooks/useOrder";
import QRCode from "react-qr-code";

const OrderInvoicePreviewModal = () => {
  const { 
    isInvoicePreviewOpen, 
    toggleInvoicePreviewModal, 
    selectedOrder, 
    printInvoice 
  } = useOrder();
  
  const componentRef = useRef();

  if (!selectedOrder) return null;

  const publicLink = `https://harmonylaundry.my.id/display/order/${selectedOrder.kode_pesan}`;

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={isInvoicePreviewOpen}
      toggle={() => toggleInvoicePreviewModal(null)}
      size="md"
    >
      <div className="modal-header border-0 pb-0">
        <h5 className="modal-title font-weight-bold">Preview Nota</h5>
        <button
          aria-label="Close"
          className="btn-close"
          onClick={() => toggleInvoicePreviewModal(null)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <ModalBody>
        <div 
          className="receipt-preview shadow-sm mx-auto bg-white p-4" 
          ref={componentRef}
          style={{ maxWidth: "400px", color: "#333", fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="mb-0 fw-bold">HARMONY LAUNDRY</h3>
            <p className="small mb-0">{selectedOrder.outlet?.nama || "Outlet Utama"}</p>
            <p className="text-xs mb-0">{selectedOrder.outlet?.alamat || "Kebumen, Jawa Tengah"}</p>
            <div className="my-2 border-top border-bottom py-1" style={{ borderStyle: "dashed" }}>
              <span className="font-weight-bold">NOTA: {selectedOrder.kode_pesan}</span>
            </div>
          </div>

          {/* Info */}
          <div className="mb-3 text-xs">
            <Row className="mb-1">
              <Col xs="4">Customer</Col>
              <Col xs="8">: <span className="fw-bold">{selectedOrder.customer.nama}</span></Col>
            </Row>
            <Row className="mb-1">
              <Col xs="4">Telepon</Col>
              <Col xs="8">: {selectedOrder.customer.telpon}</Col>
            </Row>
            <Row className="mb-1">
              <Col xs="4">Tanggal</Col>
              <Col xs="8">: {moment(selectedOrder.tanggal_pesan).format("DD/MM/YY HH:mm")}</Col>
            </Row>
            <Row>
              <Col xs="4">Status</Col>
              <Col xs="8">: <span className="fw-bold">{selectedOrder.status_pembayaran}</span></Col>
            </Row>
          </div>

          <div className="border-top mb-2" style={{ borderStyle: "dashed" }}></div>

          {/* Items */}
          <div className="receipt-items mb-3 text-sm">
            {selectedOrder.detail_pesanans.map((d, i) => (
              <div key={i} className="mb-2">
                <div className="d-flex justify-content-between font-weight-bold">
                  <span>{d.jenis_cuci.nama}</span>
                  <span><RupiahFormater value={d.total_harga} /></span>
                </div>
                <div className="text-xs opacity-7 ms-2">
                  {d.qty} x <RupiahFormater value={d.harga} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-top mb-2" style={{ borderStyle: "dashed" }}></div>

          {/* Total */}
          <div className="d-flex justify-content-between h5 font-weight-bold mb-3">
            <span>TOTAL</span>
            <span><RupiahFormater value={selectedOrder.total_harga} /></span>
          </div>

          {/* Footer / QR */}
          <div className="text-center mt-4">
            <div className="mb-2 d-flex justify-content-center">
              <div style={{ background: 'white', padding: '8px', border: '1px solid #eee' }}>
                <QRCode value={publicLink} size={80} />
              </div>
            </div>
            <p className="text-xs mb-1">Pindai untuk cek status pesanan</p>
            <p className="text-xs fw-bold mb-0">Terima Kasih</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="justify-content-between">
        <Button 
          color="primary" 
          outline 
          size="sm"
          onClick={() => window.open(publicLink, '_blank')}
        >
          <i className="fas fa-external-link-alt me-1" />
          Link Publik
        </Button>
        <div className="d-flex gap-2">
          <Button color="success" size="sm" onClick={() => printInvoice(selectedOrder)}>
            <i className="fas fa-print me-1" />
            Cetak
          </Button>
          <Button color="secondary" size="sm" onClick={() => toggleInvoicePreviewModal(null)}>
            Tutup
          </Button>
        </div>
      </ModalFooter>

      <style>{`
        .receipt-preview {
          background-color: #fdfdfd;
          border-radius: 2px;
        }
        .border-bottom-white-05 {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.85rem; }
        .fw-bold { font-weight: 700; }
        .font-weight-bold { font-weight: 700; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
      `}</style>
    </Modal>
  );
};

export default OrderInvoicePreviewModal;

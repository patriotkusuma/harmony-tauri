import React from "react";
import { Modal, ModalBody, ModalFooter, Row, Col, Badge, Button } from "reactstrap";
import moment from "moment";
import CustomerAvatar from "components/atoms/CustomerAvatar";
import RupiahFormater from "utils/RupiahFormater";
import { useOrder } from "hooks/useOrder";
import { useNavigate } from "react-router-dom";

const OrderDetailsModal = () => {
  const { 
    isDetailModalOpen, 
    toggleDetailModal, 
    selectedOrder, 
    printName, 
    printInvoice 
  } = useOrder();
  
  const navigate = useNavigate();

  if (!selectedOrder) return null;

  return (
    <Modal
      className={`modal-dialog-centered modal-lg ${
        selectedOrder.status === "batal" ? "modal-theme-batal" : 
        selectedOrder.status === "diambil" ? "modal-theme-diambil" : ""
      }`}
      contentClassName="glass-modal-content"
      isOpen={isDetailModalOpen}
      toggle={() => toggleDetailModal(null)}
    >
      <div className="modal-header border-0 pb-0">
        <h5 className="modal-title font-weight-bold">
          Rincian Pesanan {selectedOrder.kode_pesan}
        </h5>
        <button
          aria-label="Close"
          className="btn-close"
          onClick={() => toggleDetailModal(null)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <ModalBody className="py-4">
        <Row>
          <Col md="6">
            <div className="d-flex align-items-center mb-4">
              <div
                className="me-3 rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-white"
                style={{ width: "60px", height: "60px" }}
              >
                <CustomerAvatar customer={selectedOrder.customer} fallbackType="initials" />
              </div>
              <div>
                <h4 className="mb-0 font-weight-bold">
                  {selectedOrder.customer.nama}
                </h4>
                <p className="mb-0 opacity-7 text-sm">
                  {selectedOrder.customer.telpon}
                </p>
              </div>
            </div>
            <div className="bg-white-10 rounded-lg p-3 mb-3 shadow-inner">
              <h6 className="text-uppercase opacity-6 mb-2 font-weight-bold text-xs">
                Pengerjaan
              </h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Masuk</span>
                <span className="font-weight-bold">
                  {moment(selectedOrder.tanggal_pesan).format("DD/MM/YYYY, HH:mm")}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Estimasi</span>
                <span className="font-weight-bold text-success-light">
                  {moment(selectedOrder.tanggal_selesai).format("DD/MM/YYYY, HH:mm")}
                </span>
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className="bg-white-10 rounded-lg p-3 h-100 shadow-inner">
              <h6 className="text-uppercase opacity-6 mb-2 font-weight-bold text-xs">
                Layanan & Item
              </h6>
              {Array.isArray(selectedOrder.detail_pesanans) && selectedOrder.detail_pesanans.map((d, i) => (
                <div
                  key={i}
                  className="mb-2 pb-2 border-bottom-white-05 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="font-weight-bold text-sm">
                      {d.jenis_cuci.nama}
                    </div>
                    <div className="text-xs text-white-50">
                      {d.qty} x <RupiahFormater value={d.harga} />
                    </div>
                  </div>
                  <div className="font-weight-bold">
                    <RupiahFormater value={d.total_harga} />
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-2 d-flex justify-content-between align-items-center h4 font-weight-bold">
                <span>Total Tagihan</span>
                <span className="text-warning-light">
                  <RupiahFormater value={selectedOrder.total_harga} />
                </span>
              </div>
              <div className="mt-2">
                <Badge
                  color={selectedOrder.status_pembayaran === "Lunas" ? "success" : "danger"}
                  pill
                  className="px-3"
                >
                  {selectedOrder.status_pembayaran}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="border-0 bg-transparent justify-content-between">
        <div className="d-flex" style={{ gap: "8px" }}>
          <Button color="success" size="sm" onClick={() => printName(selectedOrder)}>
            <i className="fas fa-print me-1" /> Nama
          </Button>
          <Button color="default" size="sm" onClick={() => printInvoice(selectedOrder)}>
            <i className="fas fa-file-invoice me-1" /> Invoice
          </Button>
        </div>
        <div>
          <Button
            color="warning"
            size="sm"
            onClick={() => navigate(`/admin/riwayat/${selectedOrder.kode_pesan}`)}
          >
            <i className="fas fa-edit me-1" /> Edit Detail
          </Button>
          <Button color="secondary" size="sm" onClick={() => toggleDetailModal(null)}>
            Tutup
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default OrderDetailsModal;

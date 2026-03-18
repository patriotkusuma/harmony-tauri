import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const OrderCancelModal = ({ isOpen, toggle, onConfirm, kodePesan }) => {
  return (
    <Modal
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger border-0"
      isOpen={isOpen}
      toggle={toggle}
    >
      <div className="modal-header border-0 pb-0">
        <h5 className="modal-title text-white" id="modal-title-notification">
          <i className="fas fa-bell mr-2" />
          Konfirmasi Pembatalan
        </h5>
        <button
          aria-label="Close"
          className="close text-white"
          type="button"
          onClick={toggle}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <ModalBody>
        <div className="py-4 text-center">
          <i className="fas fa-exclamation-triangle fa-4x text-white mb-4" />
          <h4 className="heading text-white mb-2 h2">Yakin Ingin Membatalkan?</h4>
          <p className="text-white opacity-8">
            Tindakan ini akan membatalkan seluruh progres pesanan <strong>{kodePesan}</strong>.<br/>
            Data tidak dapat dipulihkan setelah dibatalkan.
          </p>
        </div>
      </ModalBody>
      <ModalFooter className="border-0 pt-0">
        <Button className="btn-white text-danger font-weight-bold shadow-sm" type="button" onClick={onConfirm}>
          <i className="fas fa-trash-alt mr-2"></i> YA, BATALKAN PESANAN
        </Button>
        <Button
          className="text-white ml-auto"
          color="link"
          type="button"
          onClick={toggle}
        >
          Kembali
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderCancelModal;

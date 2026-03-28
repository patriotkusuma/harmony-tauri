/* ================================================================
   Customer Management — Organism: CustomerModal
   Modal create / edit / detail (satu modal, tiga mode).
   ================================================================ */
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useCustomerStore } from 'store/customerStore';
import CustomerForm from 'components/molecules/customer/CustomerForm';
import CustomerDetailView from 'components/organisms/customer/CustomerDetailView';

const TITLES = {
  create: 'Tambah Customer Baru',
  edit:   'Edit Data Customer',
  detail: 'Detail Customer',
};

const CustomerModal = () => {
  const { modalOpen, modalMode, closeModal } = useCustomerStore();
  if (!modalMode) return null;

  const title = TITLES[modalMode] ?? '';
  const isDetail = modalMode === 'detail';

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeModal}
      centered
      size={isDetail ? 'lg' : 'md'}
      contentClassName="cust-modal-content"
    >
      <ModalHeader toggle={closeModal} className="cust-modal-header">
        <span className="cust-modal-title">
          <i className={`fas ${
            modalMode === 'create' ? 'fa-user-plus' :
            modalMode === 'edit'   ? 'fa-user-edit' :
                                     'fa-user'
          } me-2`} />
          {title}
        </span>
      </ModalHeader>
      <ModalBody className="cust-modal-body">
        {isDetail ? <CustomerDetailView /> : <CustomerForm />}
      </ModalBody>
    </Modal>
  );
};

export default CustomerModal;

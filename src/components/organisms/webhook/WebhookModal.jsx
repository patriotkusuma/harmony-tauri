import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import moment from 'moment';
import WebhookStatusBadge from '../../atoms/webhook/WebhookStatusBadge';

const prettyJson = (str) => {
  try {
      return JSON.stringify(JSON.parse(str), null, 2);
  } catch (e) {
      return str;
  }
};

const WebhookModal = ({ isOpen, toggle, log }) => {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="modal-dialog-centered dark-modal-ready">
      <ModalHeader toggle={toggle} className="border-bottom-custom">
        <span className="font-weight-900 text-dark title-adaptive">
          <i className="fas fa-file-code me-2 text-primary" />
          Detail Webhook Log #{log.id}
        </span>
      </ModalHeader>
      <ModalBody className="bg-white custom-wrapper">
         <Row className="mb-4">
             <Col xs="6" md="3" className="mb-2">
                 <small className="text-muted font-weight-bold d-block text-uppercase">Status</small>
                 <WebhookStatusBadge status={log.status} />
             </Col>
             <Col xs="6" md="3" className="mb-2">
                 <small className="text-muted font-weight-bold d-block text-uppercase">Event</small>
                 <span className="font-weight-bold">{log.event}</span>
             </Col>
             <Col xs="6" md="3" className="mb-2">
                 <small className="text-muted font-weight-bold d-block text-uppercase">Waktu</small>
                 <span className="font-weight-bold">{moment(log.created_at).format("DD/MM/YYYY HH:mm")}</span>
             </Col>
             <Col xs="6" md="3" className="mb-2">
                 <small className="text-muted font-weight-bold d-block text-uppercase">Target Device</small>
                 <span className="font-weight-bold">{log.device_id || '-'}</span>
             </Col>
         </Row>
         
         {log.status === 'failed' && log.error_message && (
             <div className="alert alert-danger mb-4 shadow-sm border-0 rounded-lg">
                 <h6 className="alert-heading font-weight-bold mb-1"><i className="fas fa-bug border-0 me-1"/> Background Error:</h6>
                 <p className="small mb-0 font-monospace">
                     {log.error_message}
                 </p>
             </div>
         )}

         <div className="mb-2">
             <h6 className="font-weight-bold title-adaptive">Raw JSON Payload</h6>
             <div className="bg-dark text-light p-3 rounded-lg" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                 <pre className="text-sm font-monospace text-success mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                     {prettyJson(log.payload)}
                 </pre>
             </div>
         </div>
      </ModalBody>
      <ModalFooter className="border-top-0 custom-wrapper pt-0 bg-white">
        <Button color="secondary" onClick={toggle} className="rounded-pill font-weight-bold px-4">Tutup</Button>
      </ModalFooter>
    </Modal>
  );
};

export default WebhookModal;

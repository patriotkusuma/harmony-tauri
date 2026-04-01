import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";

const IoTMappingModal = ({ isOpen, toggle, machineId, setMachineId, rfidCode, setRfidCode, lastScan, onFillRfid, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="border-0">
        <h4 className="mb-0 font-weight-bold">Mapping Mesin ke RFID</h4>
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-muted mb-4">Hubungkan ID mesin fisik dengan kode kartu RFID Machine Tag.</p>
        <FormGroup>
          <Label className="text-xs uppercase font-weight-bold text-muted text-sm">ID Mesin (Backend)</Label>
          <Input 
            type="number"
            className="premium-input-iot" 
            placeholder="Masukkan ID Mesin"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "50px" }}
          />
        </FormGroup>
        <FormGroup className="mb-0">
          <Label className="text-xs uppercase font-weight-bold text-muted text-sm">RFID Code</Label>
          <div className="d-flex gap-2">
            <Input 
              className="premium-input-iot font-code" 
              placeholder="Scan kartu atau masukkan kode"
              value={rfidCode}
              onChange={(e) => setRfidCode(e.target.value)}
              style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "50px", fontFamily: "monospace", letterSpacing: "1px" }}
            />
            <Button color="info" onClick={onFillRfid} title="Gunakan scan terakhir">
              <i className="fas fa-id-card" />
            </Button>
          </div>
          {lastScan && (
            <small className="text-success mt-1 d-block font-weight-bold">
              <i className="fas fa-check me-1" /> Terdeteksi: {lastScan.uid}
            </small>
          )}
        </FormGroup>
      </ModalBody>
      <ModalFooter className="border-0">
        <Button color="secondary" onClick={toggle}>Tutup</Button>
        <Button color="primary" onClick={onSubmit} className="font-weight-bold">Link Mesin</Button>
      </ModalFooter>
    </Modal>
  );
};

export default IoTMappingModal;

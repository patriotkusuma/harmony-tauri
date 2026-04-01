import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";

const IoTFormModal = ({ isOpen, toggle, selectedDevice, formData, setFormData, onSubmit }) => {
  const [outlets, setOutlets] = React.useState([]);

  React.useEffect(() => {
    if (isOpen) {
      try {
        const storedOutlets = JSON.parse(localStorage.getItem('outlet')) || [];
        setOutlets(storedOutlets);
      } catch (e) {
        setOutlets([]);
      }
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="border-0">
        <h4 className="mb-0 font-weight-bold">{selectedDevice ? 'Edit Perangkat' : 'Registrasi Perangkat Baru'}</h4>
      </ModalHeader>
      <ModalBody className="py-2">
        <FormGroup>
          <Label className="text-xs uppercase font-weight-bold text-muted text-sm">Nama Perangkat</Label>
          <Input 
            className="premium-input-iot" 
            placeholder="Contoh: Gateway RFID Lantai 1"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "50px" }}
          />
        </FormGroup>
        <FormGroup>
          <Label className="text-xs uppercase font-weight-bold text-muted text-sm">Device Code / Serial</Label>
          <Input 
            className="premium-input-iot font-code" 
            placeholder="IOT-MAIN-XXX"
            value={formData.device_code}
            onChange={(e) => setFormData({...formData, device_code: e.target.value})}
            disabled={!!selectedDevice}
            style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "50px", fontFamily: "monospace", letterSpacing: "1px" }}
          />
        </FormGroup>
        <FormGroup>
          <Label className="text-xs uppercase font-weight-bold text-muted text-sm">Lokasi Outlet (Cabang)</Label>
          <Input 
            type="select"
            className="premium-input-iot" 
            value={formData.outlet_id}
            onChange={(e) => setFormData({...formData, outlet_id: e.target.value})}
            style={{ border: "1px solid #e2e8f0", borderRadius: "12px", height: "50px" }}
          >
            <option value="">-- Pilih Outlet --</option>
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.nama}
              </option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter className="border-0">
        <Button color="secondary" onClick={toggle}>Batal</Button>
        <Button color="primary" onClick={onSubmit} className="font-weight-bold">Simpan Perangkat</Button>
      </ModalFooter>
    </Modal>
  );
};

export default IoTFormModal;

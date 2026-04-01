import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useIoTStore } from "store/iotStore";
import { useMQTTRFID } from "hooks/useMQTTRFID";

// Components (Atomic Design)
import IoTDeviceTable from "components/organisms/iot/IoTDeviceTable";
import IoTFormModal from "components/organisms/iot/IoTFormModal";
import IoTMappingModal from "components/organisms/iot/IoTMappingModal";

const IoTDeviceManagement = () => {
  const { 
    devices, loading, fetchDevices, createDevice, 
    updateDevice, deleteDevice, mapMachineRFID 
  } = useIoTStore();

  const { devices: mqttDeviceStatus, lastScan } = useMQTTRFID();

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    device_code: "",
    name: "",
    outlet_id: "",
    is_active: true
  });
  
  const [machineId, setMachineId] = useState("");
  const [rfidCode, setRfidCode] = useState("");

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setFormData({ device_code: "", name: "", outlet_id: "", is_active: true });
      setSelectedDevice(null);
    }
  };

  const toggleMappingModal = () => setMappingModalOpen(!mappingModalOpen);

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setFormData({
      device_code: device.device_code,
      name: device.name,
      outlet_id: device.outlet_id || "",
      is_active: device.is_active
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    let success = false;
    if (selectedDevice) {
      success = await updateDevice(selectedDevice.id, formData);
    } else {
      success = await createDevice(formData);
    }
    if (success) setModalOpen(false);
  };

  const handleMappingSubmit = async () => {
    const success = await mapMachineRFID(machineId, rfidCode);
    if (success) setMappingModalOpen(false);
  };

  const fillRfidFromLastScan = () => {
    if (lastScan?.uid) setRfidCode(lastScan.uid);
  };

  return (
    <>
      {/* ── Premium Header ──────────────────────────────────────── */}
      <div className="header bg-gradient-iot pb-8 pt-5 pt-md-8 px-4">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center">
              <Col lg="6">
                <h1 className="text-white display-2 font-weight-bold mb-0">IoT Management</h1>
                <p className="text-white opacity-8 lead">Kelola perangkat sentral, gateway RFID, dan mapping mesin laundry.</p>
              </Col>
              <Col lg="6" className="text-end">
                <Button color="secondary" className="shadow-sm font-weight-bold" onClick={toggleMappingModal}>
                  <i className="fas fa-link me-2" /> Link RFID ke Mesin
                </Button>
                <Button color="neutral" className="shadow-sm font-weight-bold" onClick={toggleModal}>
                  <i className="fas fa-plus-circle me-2" /> Registrasi Device
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* ── Main Tablet Content (Organism) ───────────────────────── */}
      <Container className="mt--7" fluid>
        <IoTDeviceTable 
          devices={devices}
          loading={loading}
          mqttDeviceStatus={mqttDeviceStatus}
          onEdit={handleEdit}
          onDelete={deleteDevice}
          onStatusChange={updateDevice}
        />
      </Container>

      {/* ── Modals (Organisms) ─────────────────────────────────── */}
      <IoTFormModal 
        isOpen={modalOpen}
        toggle={toggleModal}
        selectedDevice={selectedDevice}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <IoTMappingModal 
        isOpen={mappingModalOpen}
        toggle={toggleMappingModal}
        machineId={machineId}
        setMachineId={setMachineId}
        rfidCode={rfidCode}
        setRfidCode={setRfidCode}
        lastScan={lastScan}
        onFillRfid={fillRfidFromLastScan}
        onSubmit={handleMappingSubmit}
      />

      <style>{`
        .bg-gradient-iot {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
          border-bottom: 5px solid #3b82f6;
        }
        .display-2 { font-size: 2.8rem; }
        @media (max-width: 768px) {
            .display-2 { font-size: 2rem; }
        }
      `}</style>
    </>
  );
};

export default IoTDeviceManagement;

import React from "react";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// Hooks
import { useRFIDManage } from "hooks/useRFIDManage";

// Organisms
import OrderListSection from "components/organisms/OrderListSection";
import RFIDControlPanel from "components/organisms/RFIDControlPanel";

/* ================= PAGE COMPONENT ================= */
const RFIDManage = () => {
  const {
    activeMode, setActiveMode,
    searchQuery, setSearchQuery,
    orders, linkedOrders,
    selectedOrder, setSelectedOrder,
    autoAttach, setAutoAttach,
    loading,
    errorModal, closeErrorModal,
    scannedRFID, lastScan, mqttConnected, mqttConnecting,
    clearUID,
    handleAttach, handleDetach,
    fetchUnlinkedOrders
  } = useRFIDManage();

  return (
    <>
      {/* HEADER BACKGROUND */}
      <div className="header bg-gradient-info pb-6 pt-4 pt-md-6 shadow-lg">
        <Container fluid>
            <div className="header-body">
                <Row className="align-items-center py-2 px-3">
                    <Col lg="6" xs="12">
                        <h1 className="display-2 text-white font-weight-bold">RFID Operasional</h1>
                        <p className="text-white opacity-8 h4 mt-2">Hubungkan keranjang laundry dengan sistem kartu RFID pintar.</p>
                    </Col>
                    <Col lg="6" xs="12" className="text-right d-none d-lg-block">
                        <div className="d-flex justify-content-end align-items-center text-white">
                            <i className="fas fa-microchip fa-4x opacity-3" />
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
      </div>

      <Container className="mt--6" fluid>
        <Row className="px-md-2">
            {/* LEFT SIDE: SEARCH & LIST */}
            <Col lg="8" className="mb-4">
                <OrderListSection 
                    activeMode={activeMode}
                    setActiveMode={setActiveMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    orders={orders}
                    linkedOrders={linkedOrders}
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    loading={loading}
                    fetchUnlinkedOrders={fetchUnlinkedOrders}
                    handleDetach={handleDetach}
                    scannedRFID={scannedRFID}
                    clearUID={clearUID}
                />
            </Col>

            {/* RIGHT SIDE: CONTROL PANEL */}
            <Col lg="4">
                <RFIDControlPanel 
                    activeMode={activeMode}
                    scannedRFID={scannedRFID}
                    lastScan={lastScan}
                    mqttConnected={mqttConnected}
                    mqttConnecting={mqttConnecting}
                    selectedOrder={selectedOrder}
                    autoAttach={autoAttach}
                    setAutoAttach={setAutoAttach}
                    handleAttach={handleAttach}
                    handleDetach={handleDetach}
                    linkedOrders={linkedOrders}
                    clearUID={clearUID}
                    showError={closeErrorModal} // Reusing the pattern, can be improved with custom throw if needed
                />
            </Col>
        </Row>
      </Container>

      {/* ERROR MODAL */}
      <Modal isOpen={errorModal.show} toggle={closeErrorModal} centered contentClassName="border-0 shadow-lg">
        <ModalHeader toggle={closeErrorModal} className="bg-warning text-white py-3 border-0">
          <i className="fas fa-exclamation-circle mr-2" />
          {errorModal.title || "Notifikasi Sistem"}
        </ModalHeader>
        <ModalBody className="py-4 text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3" />
            <p className="h5 text-dark font-weight-bold mb-0">{errorModal.message}</p>
        </ModalBody>
        <ModalFooter className="border-0 bg-secondary">
          <Button color="primary" onClick={closeErrorModal} className="px-4 font-weight-bold">Dimengerti</Button>
        </ModalFooter>
      </Modal>

      <style>{`
        .display-2 { font-size: 2.8rem; }
        .bg-gradient-info { 
           background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
        }
        @media (max-width: 768px) {
            .display-2 { font-size: 2rem; }
        }
      `}</style>
    </>
  );
};

export default RFIDManage;

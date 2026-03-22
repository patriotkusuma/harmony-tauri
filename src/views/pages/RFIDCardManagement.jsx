import React from "react";
import { Container, Row, Col } from "reactstrap";

// Hooks
import { useRFIDCardManagement } from "hooks/useRFIDCardManagement";

// Organisms
import RFIDCardStats from "components/organisms/RFIDCardStats";
import RFIDScanPanel from "components/organisms/RFIDScanPanel";
import RFIDCardList from "components/organisms/RFIDCardList";
import RFIDCardDetailModal from "components/organisms/RFIDCardDetailModal";
import RFIDRegisterModal from "components/organisms/RFIDRegisterModal";

const RFIDCardManagement = () => {
  const {
    rfids, total, page, loading, SEARCH_LIMIT,
    search, setSearch, filterType, filterStatus,
    scannedUID, scanActive, setScanActive, lastScanTime,
    registerModal, setRegisterModal, registerForm, setRegisterForm, registerLoading,
    detailModal, setDetailModal, selectedCard, setSelectedCard,
    totalPages,
    handleSearch, handleFilterType, handleFilterStatus, handlePageChange, handleRegister, fetchRFIDs
  } = useRFIDCardManagement();

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8 shadow-lg">
        <Container fluid>
            <div className="header-body">
                <Row className="align-items-center py-4 px-3">
                    <Col lg="6" xs="12">
                        <h1 className="display-2 text-white font-weight-bold">Inventaris RFID</h1>
                        <p className="text-white opacity-8 h4 mt-2">Daftarkan & kelola seluruh kartu RFID untuk keranjang, mesin, dan operator.</p>
                    </Col>
                    <Col lg="6" xs="12" className="text-end d-none d-lg-block">
                        <div className="d-flex justify-content-end align-items-center text-white">
                            <i className="fas fa-id-card-alt fa-4x opacity-3" />
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
      </div>

      <Container className="mt--6 pb-5" fluid>
        {/* Stats Section */}
        <RFIDCardStats 
            total={total} 
            assignedCount={rfids.filter(r => r.status === 'ASSIGNED').length} 
            availableCount={rfids.filter(r => r.status === 'AVAILABLE').length} 
        />

        <Row className="mt-4">
            {/* Left: Scan Panel */}
            <Col lg="4" className="mb-4">
                <RFIDScanPanel 
                    scanActive={scanActive}
                    setScanActive={setScanActive}
                    scannedUID={scannedUID}
                    lastScanTime={lastScanTime}
                    onRegisterManual={() => setRegisterModal(true)}
                />
            </Col>

            {/* Right: Table List */}
            <Col lg="8">
                <RFIDCardList 
                    rfids={rfids}
                    total={total}
                    page={page}
                    limit={SEARCH_LIMIT}
                    loading={loading}
                    search={search}
                    setSearch={setSearch}
                    filterType={filterType}
                    handleFilterType={handleFilterType}
                    filterStatus={filterStatus}
                    handleFilterStatus={handleFilterStatus}
                    handleSearch={handleSearch}
                    handlePageChange={handlePageChange}
                    onViewDetail={(card) => { setSelectedCard(card); setDetailModal(true); }}
                    totalPages={totalPages}
                    refresh={() => fetchRFIDs(page, search, filterType, filterStatus)}
                />
            </Col>
        </Row>
      </Container>

      {/* Modals */}
      <RFIDRegisterModal 
        isOpen={registerModal}
        toggle={() => setRegisterModal(!registerModal)}
        form={registerForm}
        setForm={setRegisterForm}
        loading={registerLoading}
        onRegister={handleRegister}
        scannedUID={scannedUID}
      />

      <RFIDCardDetailModal 
        isOpen={detailModal}
        toggle={() => setDetailModal(!detailModal)}
        card={selectedCard}
      />

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

export default RFIDCardManagement;

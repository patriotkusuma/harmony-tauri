import React from "react";
import { Container, Row, Col } from "reactstrap";

// Hooks
import { useOrderDetail } from "hooks/useOrderDetail";

// Organisms
import DetailPesananHeader from "components/DetailPesanan/DetailPesananHeader";
import OrderDetailSummary from "components/organisms/OrderDetailSummary";
import CustomerOrderSection from "components/organisms/CustomerOrderSection";
import DeliveryLogSection from "components/organisms/DeliveryLogSection";
import OrderCancelModal from "components/organisms/OrderCancelModal";
import CreateModal from "components/Modals/DetailPesanan/Create";

/* ================= PAGE COMPONENT ================= */
const DetailPesanan = () => {
  const {
    kodePesan,
    pesanan,
    logs,
    loadingPesanan,
    namaPelanggan, setNamaPelanggan,
    telpon, setTelpon,
    keterangan, setKeterangan,
    tanggalPesan, setTanggalPesan,
    tanggalSelesai, setTanggalSelesai,
    isCancelModalOpen, setIsCancelModalOpen,
    isModalOpen, setIsModalOpen,
    updateCustomer,
    updateAntarJemput,
    updateTanggal,
    cancelOrder,
    refreshDetail
  } = useOrderDetail();

  return (
    <>
      {/* 1. HEADER SECTION */}
      <div className="header bg-gradient-info pb-6 pt-5 pt-md-7 shadow-sm">
        <DetailPesananHeader 
            kodePesan={kodePesan} 
            pesanan={pesanan} 
            onCancel={() => setIsCancelModalOpen(true)} 
        />
      </div>

      <Container className="mt--6" fluid>
        {/* 2. QUICK SUMMARY BAR */}
        <OrderDetailSummary pesanan={pesanan} />

        {/* 3. MAIN CONTENT */}
        {loadingPesanan ? (
          <div className="text-center py-5 bg-white rounded shadow-lg border-0 my-5">
            <i className="fas fa-spinner fa-spin fa-3x text-info mb-3" />
            <h4 className="text-muted">Memuat rincian pesanan...</h4>
          </div>
        ) : (
          <Row>
            {/* LEFT COLUMN: Customer & Order Info */}
            <Col lg="7">
              <CustomerOrderSection 
                pesan={pesanan} // Existing component prop name was pesanan
                pesanan={pesanan}
                kodePesan={kodePesan}
                namaPelanggan={namaPelanggan}
                setNamaPelanggan={setNamaPelanggan}
                telpon={telpon}
                setTelpon={setTelpon}
                keterangan={keterangan}
                setKeterangan={setKeterangan}
                updateCustomer={updateCustomer}
                tanggalPesan={tanggalPesan}
                setTanggalPesan={setTanggalPesan}
                tanggalSelesai={tanggalSelesai}
                setTanggalSelesai={setTanggalSelesai}
                updateTanggal={updateTanggal}
              />
            </Col>

            {/* RIGHT COLUMN: Service & History */}
            <Col lg="5">
              <DeliveryLogSection 
                antarActive={pesanan?.antar}
                updateAntarJemput={updateAntarJemput}
                logs={logs}
              />
            </Col>
          </Row>
        )}

        {/* 4. MODALS */}
        <CreateModal
          isOpen={isModalOpen}
          toggleModal={() => setIsModalOpen(!isModalOpen)}
          kodePesan={kodePesan}
          onSubmitSuccess={refreshDetail}
        />

        <OrderCancelModal 
          isOpen={isCancelModalOpen}
          toggle={() => setIsCancelModalOpen(false)}
          onConfirm={cancelOrder}
          kodePesan={kodePesan}
        />

      </Container>
      
      <style>{`
        .rounded-lg { border-radius: 1rem !important; }
        .card-stats { transition: all 0.3s ease; }
        .card-stats:hover { transform: translateY(-5px); }
      `}</style>
    </>
  );
};

export default DetailPesanan;

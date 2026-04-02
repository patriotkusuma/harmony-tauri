import React, { useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import MetricTile from "components/atoms/srm/MetricTile";
import CategoryManagementPanel from "components/organisms/srm/CategoryManagementPanel";
import ServiceManagementPanel from "components/organisms/srm/ServiceManagementPanel";
import { useServiceRevenueStore } from "store/serviceRevenueStore";

import ServiceDetailPanel from "components/organisms/srm/ServiceDetailPanel";
import ViewModeToggle from "components/molecules/srm/ViewModeToggle";

const ServiceRevenueManagement = () => {
  const {
    categories,
    services,
    revenueAccounts,
    selectedCategoryId,
    selectedServiceUuid,
    viewMode,
    isDetailView,
    errorMessage,
    isLoading,
    setSelectedCategoryId,
    setSelectedServiceUuid,
    setViewMode,
    setDetailView,
    fetchCategories,
    fetchServices,
    addCategory,
    updateCategory,
    deleteCategory,
    addService,
    updateService,
    deleteService,
    resolveRevenueAccount,
    clearErrorMessage,
    getSelectedService,
    uploadServiceImage,
    priceHistory,
    fetchPriceHistory,
  } = useServiceRevenueStore();


  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const openDetail = (uuid) => {
    setSelectedServiceUuid(uuid);
    setDetailView(true);
  };

  const closeDetail = () => {
    setDetailView(false);
  };

  const mappedCount = services.filter((svc) => svc.id_revenue_account).length;
  const activeService = getSelectedService();

  return (
    <div className="srm-page">
      <div className="header srm-hero pb-8 pt-5 pt-md-7 position-relative overflow-hidden">
        <div className="hero-bubble bubble-1"></div>
        <div className="hero-bubble bubble-2"></div>
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center mb-4">
              <Col lg="6">
                <h1 className="display-3 text-white font-weight-bold mb-1">
                  Katalog Layanan
                </h1>
                <p className="text-white-50 lead mb-3">
                  Kelola kategori paket, tarif cuci, dan mapping keuangan dalam satu dashboard.
                </p>
                {!isDetailView && (
                  <ViewModeToggle mode={viewMode} onToggle={setViewMode} />
                )}
              </Col>
              <Col lg="6" className="text-end d-none d-lg-block">
                 <div className="d-flex justify-content-end" style={{ gap: '15px' }}>
                    <MetricTile
                      icon="fas fa-layer-group"
                      label="Kategori"
                      value={categories.length}
                      tone="primary"
                    />
                    <MetricTile
                      icon="fas fa-soap"
                      label="Layanan"
                      value={services.length}
                      tone="info"
                    />
                    <MetricTile
                      icon="fas fa-check-double"
                      label="Mapped"
                      value={`${mappedCount}/${services.length}`}
                      tone="success"
                    />
                 </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7 mb-5" fluid>
        {isLoading && categories.length === 0 ? (
          <div className="text-center py-5">
            <Spinner color="white" />
            <p className="text-white mt-2">Menyiapkan dashboard...</p>
          </div>
        ) : isDetailView ? (
          <Row justify="center">
            <Col lg="10" className="mx-auto">
              <ServiceDetailPanel 
                service={activeService}
                categories={categories}
                revenueAccounts={revenueAccounts}
                onSave={updateService}
                onUpload={uploadServiceImage}
                onBack={closeDetail}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onClearError={clearErrorMessage}
                priceHistory={priceHistory}
                onFetchHistory={fetchPriceHistory}
              />

            </Col>
          </Row>
        ) : (
          <Row>
            {viewMode === "category" && (
              <Col lg="3" className="mb-4 pe-lg-2 animate__animated animate__fadeInLeft">
                <CategoryManagementPanel
                  categories={categories}
                  services={services}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onAddCategory={addCategory}
                  onUpdateCategory={updateCategory}
                  onDeleteCategory={deleteCategory}
                />
              </Col>
            )}
            <Col lg={viewMode === "category" ? "9" : "12"} className="mb-4 ps-lg-2 animate__animated animate__fadeIn">
              <ServiceManagementPanel
                categories={categories}
                services={services}
                revenueAccounts={revenueAccounts}
                selectedCategoryId={viewMode === "category" ? selectedCategoryId : null}
                selectedServiceUuid={selectedServiceUuid}
                resolveRevenueAccount={resolveRevenueAccount}
                onSelectService={setSelectedServiceUuid}
                onAddService={addService}
                onDeleteService={deleteService}
                onOpenDetail={openDetail}
                errorMessage={errorMessage}
                onClearError={clearErrorMessage}
              />
            </Col>
          </Row>
        )}
      </Container>

      <style>{`
        .srm-page {
          background: #f8fafc;
          min-height: 100vh;
        }
        .srm-hero {
          background: #0f172a;
          border-bottom: 4px solid #3b82f6;
          position: relative;
        }
        .hero-bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.05);
          z-index: 0;
        }
        .bubble-1 { width: 350px; height: 350px; top: -100px; right: -50px; border: 1px solid rgba(255,255,255,0.05); }
        .bubble-2 { width: 250px; height: 250px; bottom: -80px; left: 5%; border: 1px solid rgba(255,255,255,0.05); }
        .text-white-50 { color: #94a3b8 !important; font-size: 1.1rem; }
        .display-3 { letter-spacing: -0.03em; color: #ffffff !important; }
        
        .animate__fadeInLeft { animation-duration: 0.5s; }
        .animate__fadeIn { animation-duration: 0.5s; }

        /* Modern Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .mt--7 { margin-top: -5rem !important; }
      `}</style>

    </div>
  );
};


export default ServiceRevenueManagement;



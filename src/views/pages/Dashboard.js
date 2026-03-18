import React from 'react';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import moment from 'moment';

// Hooks
import { useDashboard } from 'hooks/useDashboard';

// Organisms
import DashboardStats from 'components/organisms/DashboardStats';
import TodayWorkBoard from 'components/organisms/TodayWorkBoard';
import DeliveryOverview from 'components/organisms/DeliveryOverview';

const Dashboard = () => {
  const { 
    urutanKerja, 
    ambilPesanan, 
    isLoading, 
    refreshDashboard 
  } = useDashboard();

  return (
    <>
      {/* 1. Header with Stats Dashboard Section */}
      <div className="header pb-8 pt-5 pt-md-8 px-4 bg-gradient-info shadow-lg">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6" xs="7">
                <h6 className="h2 text-white d-inline-block mb-0 font-weight-bold">
                  Dashboard Operasional
                </h6>
                <nav aria-label="breadcrumb" className="d-none d-md-inline-block ml-md-4">
                   <div className="text-white opacity-8 h1 mb-0 border-left pl-4" style={{ fontWeight: 300 }}>
                      {moment().format("HH:mm")}
                   </div>
                </nav>
              </Col>
              <Col lg="6" xs="5" className="text-right">
                <Button 
                  color="neutral" 
                  size="sm" 
                  onClick={refreshDashboard}
                  className="shadow-premium px-4 font-weight-bold transition-all text-primary"
                >
                  <i className={`fas fa-sync-alt mr-2 ${isLoading ? 'fa-spin' : ''}`} />
                  Refresh Data
                </Button>
              </Col>
            </Row>
            
            {/* STATS ORGANISM */}
            <DashboardStats 
                urutanKerja={urutanKerja} 
                ambilPesanan={ambilPesanan} 
            />
          </div>
        </Container>
      </div>

      {/* 2. Main Operasional Boards Section */}
      <Container className="mt--7 px-4" fluid>
        {isLoading && !urutanKerja && !ambilPesanan ? (
          <Row>
             <Col xs="12" className="text-center py-5 glass-card mb-4 border-0">
                <i className="fas fa-spinner fa-spin fa-3x text-info mb-3" />
                <h4 className="text-muted italic">Mempersiapkan statistik operasional...</h4>
             </Col>
          </Row>
        ) : (
          <Row>
            {/* LEFT COLUMN: Queue / Work Orders */}
            <Col xl="6" lg="12" className="mb-4">
              <TodayWorkBoard urutanKerja={urutanKerja} />
            </Col>

            {/* RIGHT COLUMN: Deadlines / Deliveries */}
            <Col xl="6" lg="12" className="mb-4">
              <DeliveryOverview ambilPesanan={ambilPesanan} />
            </Col>
          </Row>
        )}
        
        {/* Footer info/legend if needed */}
        <div className="text-right pb-4 px-2">
            <small className="text-muted italic opacity-5 font-weight-bold">
               Refreshed at {moment().format("HH:mm:ss")}
            </small>
        </div>
      </Container>

      <style>{`
        .bg-gradient-info { 
           background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
        }
        .header-body {
           animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Dashboard;
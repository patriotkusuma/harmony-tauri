import React from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col } from 'reactstrap';
import OrderLogTimeline from '../DetailPesanan/OrderLogTimeline';

const DeliveryLogSection = ({ antarActive, updateAntarJemput, logs }) => {
  return (
    <>
      <Card className="shadow-lg border-0 mb-4 rounded-lg bg-gradient-secondary">
        <CardHeader className="bg-transparent border-0 pb-0 pt-4">
          <h5 className="text-uppercase text-muted mb-4 d-flex align-items-center font-weight-bold" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
            <i className="fas fa-truck-loading me-2 text-info" />
            Layanan Antar / Jemput
          </h5>
        </CardHeader>
        <CardBody className="pt-2 pb-4">
          <Card className="bg-secondary shadow-sm border-0 mb-2">
            <CardHeader className="bg-white border-0 py-3">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0 font-weight-light">Apakah Antar Jemput?</h4>
                </Col>
                <Col xs="auto">
                  <div className="btn-group shadow-sm">
                    <Button
                      color={antarActive === 1 ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => updateAntarJemput(1)}
                      className="px-4"
                    >
                      Ya
                    </Button>
                    <Button
                      color={antarActive === 0 ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => updateAntarJemput(0)}
                      className="px-4"
                    >
                      Tidak
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </CardBody>
      </Card>

      <Card className="shadow-lg border-0 rounded-lg overflow-hidden mb-4">
        <CardHeader className="bg-dark text-white border-0 py-3 d-flex align-items-center">
          <h5 className="text-uppercase mb-0 text-white font-weight-bold" style={{ fontSize: '0.85rem' }}>
            <i className="fas fa-stream me-2 text-info" />
            Riwayat Proses (Log)
          </h5>
        </CardHeader>
        <CardBody className="bg-secondary-custom p-0">
          <div className="p-4" style={{ backgroundColor: '#f8f9fe' }}>
            <OrderLogTimeline logs={logs || []} />
          </div>
        </CardBody>
      </Card>
      
      <style>{`
        .bg-secondary-custom { background-color: #f8f9fe; }
        .dark-mode .bg-secondary-custom { background-color: #1a1a2e; }
        .bg-gradient-secondary { background: linear-gradient(87deg, #f8f9fe 0, #f1f3f9 100%) !important; }
        .dark-mode .bg-gradient-secondary { background: linear-gradient(87deg, #1a1a2e 0, #161625 100%) !important; }
      `}</style>
    </>
  );
};

export default DeliveryLogSection;

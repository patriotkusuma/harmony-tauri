import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const DashboardStats = ({ ambilPesanan, urutanKerja }) => {
  const stats = [
    {
      title: "Deadline Hari Ini",
      value: ambilPesanan?.length || 0,
      icon: "fas fa-clock",
      color: "icon-gradient-info",
      desc: "Menunggu penyelesaian",
    },
    {
      title: "Antar Aktif",
      value: ambilPesanan?.filter(p => p.antar === 1).length || 0,
      icon: "fas fa-truck",
      color: "icon-gradient-success",
      desc: "Layanan delivery",
    },
    {
      title: "Antrian Kerja",
      value: urutanKerja?.length || 0,
      icon: "fas fa-layer-group",
      color: "icon-gradient-danger",
      desc: "Belum dikerjakan",
    }
  ];

  return (
    <Row className="mb-4">
      {stats.map((stat, i) => (
        <Col key={i} xl="4" md="6" className="mb-4">
          <Card className="glass-card shadow-premium border-0 transition-all hover-translate-up">
            <CardBody className="py-4">
              <Row className="align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-muted ls-1 mb-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                    {stat.title}
                  </h6>
                  <span className="h1 font-weight-900 mb-0 d-block">
                    {stat.value}
                  </span>
                  <small className="text-dark d-block mt-2 font-weight-bold">
                    <i className={`${stat.icon} mr-1`} />
                    {stat.desc}
                  </small>
                </div>
                <Col className="col-auto">
                  <div className={`icon icon-shape ${stat.color} text-white rounded-circle shadow-lg`} style={{ width: '56px', height: '56px' }}>
                    <i className={`${stat.icon} fa-lg`} />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;

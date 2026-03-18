import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const RFIDCardStats = ({ total, assignedCount, availableCount }) => {
  const stats = [
    {
      title: "Total Kartu",
      value: total,
      icon: "fas fa-layer-group",
      color: "rgba(94,114,228,0.12)",
      textColor: "text-primary",
      lineColor: "#5e72e4"
    },
    {
      title: "Assigned",
      value: assignedCount,
      icon: "fas fa-link",
      color: "rgba(45,206,137,0.12)",
      textColor: "text-success",
      lineColor: "#2dce89"
    },
    {
      title: "Available",
      value: availableCount,
      icon: "fas fa-unlink",
      color: "rgba(251,99,64,0.12)",
      textColor: "text-danger",
      lineColor: "#fb6340"
    }
  ];

  return (
    <Row>
      {stats.map((stat, i) => (
        <Col md="4" key={i} className="mb-3">
          <Card className="shadow-premium border-0 glass-card transition-all hover-translate-up" style={{ borderLeft: `6px solid ${stat.lineColor}` }}>
            <CardBody className="py-4">
              <Row className="align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-muted ls-1 mb-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                    {stat.title}
                  </h6>
                  <span className="h1 font-weight-900 mb-0 d-block text-dark">
                    {stat.value}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape rounded-circle shadow-sm" style={{ width: '48px', height: '48px', background: stat.color }}>
                    <i className={`${stat.icon} ${stat.textColor} fa-lg`} />
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

export default RFIDCardStats;

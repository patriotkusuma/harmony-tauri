import React from 'react';
import { Row, Col, Card, CardBody, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const OrderDetailSummary = ({ pesanan }) => {
  if (!pesanan) return null;

  return (
    <Row className="mb-4">
      <Col lg="4" md="6">
        <Card className="card-stats mb-4 mb-xl-0 shadow-lg border-0 rounded-lg">
          <CardBody>
            <Row>
              <div className="col">
                <h5 className="card-title text-uppercase text-muted mb-0 font-weight-bold">Status Pesanan</h5>
                <span className="h2 font-weight-bold mb-0 text-capitalize">{pesanan.status}</span>
              </div>
              <Col className="col-auto">
                <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                  <i className="fas fa-tasks" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4" md="6">
        <Card className="card-stats mb-4 mb-xl-0 shadow-lg border-0 rounded-lg">
          <CardBody>
            <Row>
              <div className="col">
                <h5 className="card-title text-uppercase text-muted mb-0 font-weight-bold">Pembayaran</h5>
                <Badge color={pesanan.status_pembayaran === 'Lunas' ? 'success' : 'danger'} pill className="h2 mb-0 px-3 py-2">
                  {pesanan.status_pembayaran}
                </Badge>
              </div>
              <Col className="col-auto">
                <div className={`icon icon-shape ${pesanan.status_pembayaran === 'Lunas' ? 'bg-success' : 'bg-danger'} text-white rounded-circle shadow`}>
                  <i className="fas fa-money-bill-wave" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4" md="6">
        <Card className="card-stats mb-4 mb-xl-0 shadow-lg border-0 rounded-lg">
          <CardBody>
            <Row>
              <div className="col">
                <h5 className="card-title text-uppercase text-muted mb-0 font-weight-bold">Total Tagihan</h5>
                <span className="h2 font-weight-bold mb-0 text-primary">
                  <RupiahFormater value={pesanan.total_harga} />
                </span>
              </div>
              <Col className="col-auto">
                <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                  <i className="fas fa-receipt" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderDetailSummary;

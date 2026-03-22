import React from 'react';
import { Link } from 'react-router-dom'; // Keep Link for the Button
import { Badge, Button, Col, Container, Row } from 'reactstrap'; // Remove Card, CardBody

const DetailPesananHeader = ({ kodePesan, pesanan, onCancel }) => {
  const showCancelButton = pesanan && pesanan.status !== "batal" && pesanan.status !== "diambil";

  return (
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="12" className="mb-3 mb-lg-0">
              <h2 className="text-white fw-bold mb-1" style={{ fontSize: '1.75rem' }}>
                <i className="fas fa-receipt me-3 opacity-8"></i>
                Detail Pesanan
              </h2>
              <p className="text-white mt-0 mb-0 h4 fw-normal opacity-9">
                Kode Pesanan:{" "}
                <Badge pill className={pesanan?.status === 'batal' ? "bg-danger text-white px-3 py-1 ms-1" : "bg-success text-white px-3 py-1 ms-1"}>
                  {kodePesan}
                </Badge>
              </p>
            </Col>
            <Col lg="6" xs="12" className="text-lg-end">
              {showCancelButton && (
                <Button
                  color="danger"
                  size="md"
                  className="me-2 shadow-sm rounded-pill px-4"
                  onClick={onCancel}
                >
                  <i className="fas fa-times-circle me-2"></i>
                  Batalkan Pesanan
                </Button>
              )}
              <Button
                color="secondary"
                to="/admin/riwayat"
                tag={Link}
                size="md"
                className="shadow-sm rounded-pill px-4"
                title="Kembali ke Riwayat"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Kembali
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
  );
};

export default DetailPesananHeader;
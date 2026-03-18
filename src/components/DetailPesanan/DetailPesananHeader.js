import React from 'react';
import { Link } from 'react-router-dom'; // Keep Link for the Button
import { Badge, Button, Col, Container, Row } from 'reactstrap'; // Remove Card, CardBody

const DetailPesananHeader = ({ kodePesan, pesanan, onCancel }) => {
  const showCancelButton = pesanan && pesanan.status !== "batal" && pesanan.status !== "diambil";

  return (
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="7">
              <h1 className="display-2 text-white">
                <i className="fas fa-receipt mr-3"></i>
                Detail Pesanan
              </h1>
              <p className="text-white mt-0 mb-0 h1">
                Kode Pesanan:{" "}
                <Badge pill className={pesanan?.status === 'batal' ? "bg-danger text-white px-3 py-1" : "bg-success text-white px-3 py-1"}>
                  {kodePesan}
                </Badge>
              </p>
            </Col>
            <Col lg="6" xs="5" className="text-right">
              {showCancelButton && (
                <Button
                  color="danger"
                  size="md"
                  className="mr-2 shadow-sm"
                  onClick={onCancel}
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  Batal Pesanan
                </Button>
              )}
              <Button
                color="default"
                to="/admin/riwayat"
                tag={Link}
                size="md"
                className="btn-icon-only rounded-circle shadow"
                title="Kembali ke Riwayat"
              >
                <span className="btn-inner--icon">
                  <i className="fas fa-arrow-left"></i>
                </span>
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
  );
};

export default DetailPesananHeader;
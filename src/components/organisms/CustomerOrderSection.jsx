import React from 'react';
import { Card, CardBody, CardHeader, CardImg, Col, FormGroup, Label, Row, Badge, Button, Input } from 'reactstrap';
import moment from 'moment';
import RupiahFormater from 'utils/RupiahFormater';
import StatusBadge from "components/atoms/StatusBadge";
import { formatImageUrl } from 'utils/formatImageUrl';

const CustomerOrderSection = ({ 
  pesanan, 
  kodePesan, 
  namaPelanggan, setNamaPelanggan,
  telpon, setTelpon,
  keterangan, setKeterangan,
  tanggalPesan, setTanggalPesan,
  tanggalSelesai, setTanggalSelesai,
  updateCustomer,
  updateTanggal 
}) => {
  if (!pesanan) return null;

  return (
    <Card className="shadow-lg border-0 mb-4 rounded-lg">
      <CardHeader className="bg-transparent border-0 pb-0 pt-4">
        <h5 className="text-uppercase text-muted mb-4 d-flex align-items-center font-weight-bold" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
          <i className="fas fa-user-circle me-2 text-primary" />
          Detail Pelanggan & Pesanan
        </h5>
      </CardHeader>
      <CardBody className="pt-2">
        <Card className="bg-secondary shadow-sm border-0 mb-4">
          <CardHeader className="bg-white border-0">
            <Row className="align-items-center">
              <Col xs="8">
                <h3 className="mb-0 font-weight-light">
                  Pesanan <strong className="font-weight-bold">{kodePesan}</strong>
                </h3>
                <StatusBadge status={pesanan.status} className="mt-2 py-1" />
              </Col>
              <Col xs="4" className="text-end">
                <h3 className="mb-0 font-weight-bold text-danger">
                  <RupiahFormater value={pesanan.total_harga} />
                </h3>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <h6 className="heading-small text-muted d-flex justify-content-between align-items-center mb-3">
              <span>
                <i className="fas fa-calendar-alt me-2 text-info"></i>
                Penyesuaian Waktu
              </span>
              <Button color="info" size="sm" onClick={updateTanggal} className="shadow-sm">
                <i className="fas fa-check-circle me-1"></i> Simpan Waktu
              </Button>
            </h6>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label className="form-control-label text-xs text-uppercase text-muted">Masuk</Label>
                  <Input
                    type="datetime-local"
                    className="form-control-alternative font-weight-bold text-primary"
                    value={tanggalPesan ? moment(tanggalPesan).format("YYYY-MM-DDTHH:mm") : ""}
                    onChange={(e) => setTanggalPesan(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="form-control-label text-xs text-uppercase text-muted">Selesai</Label>
                  <Input
                    type="datetime-local"
                    className="form-control-alternative font-weight-bold text-success"
                    value={tanggalSelesai ? moment(tanggalSelesai).format("YYYY-MM-DDTHH:mm") : ""}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr className="my-4" />

            <h6 className="heading-small text-muted d-flex justify-content-between align-items-center mb-3">
              Informasi Pelanggan
              <Button color="primary" size="sm" onClick={updateCustomer}>
                <i className="fas fa-save me-1"></i> Simpan Profil
              </Button>
            </h6>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label className="form-control-label">Nama</Label>
                  <Input
                    className="form-control-alternative"
                    value={namaPelanggan || ''}
                    onChange={(e) => setNamaPelanggan(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="form-control-label">No. WhatsApp</Label>
                  <Input
                    className="form-control-alternative"
                    value={telpon || ''}
                    onChange={(e) => setTelpon(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label className="form-control-label">Keterangan</Label>
                  <Input
                    type="textarea"
                    className="form-control-alternative"
                    rows="2"
                    value={keterangan || ''}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr className="my-4" />
            <h6 className="heading-small text-muted mb-3">Item Pesanan</h6>
            {Array.isArray(pesanan.detail_pesanans) && pesanan.detail_pesanans.map((item, idx) => (
              <Row key={idx} className="mb-3 align-items-center">
                <Col xs="auto">
                  <CardImg
                    className="rounded-lg shadow-sm"
                    style={{ width: "60px", height: "60px", objectFit: 'cover' }}
                    src={formatImageUrl(item.jenis_cuci.gambar) || "https://harmonylaundrys.com/img/logo-harmony.png"}
                  />
                </Col>
                <Col>
                  <div className="d-flex flex-column">
                    <span className="text-muted text-xs">{item.jenis_cuci.category_paket?.nama}</span>
                    <strong className="text-dark">{item.jenis_cuci.nama}</strong>
                    <span className="text-muted text-sm">{item.qty} x <RupiahFormater value={item.harga} /></span>
                  </div>
                </Col>
                <Col xs="auto" className="text-end">
                  <h5 className="mb-0 font-weight-bold"><RupiahFormater value={item.total_harga} /></h5>
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};

export default CustomerOrderSection;

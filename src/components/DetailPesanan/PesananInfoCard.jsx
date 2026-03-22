import React from 'react';
import { Card, CardBody, CardHeader, CardImg, Col, FormGroup, Label, Row, Badge, Button, Input } from 'reactstrap'; // Import Button and Input
import moment from 'moment';
import ReactDatetime from "react-datetime";
import RupiahFormater from 'utils/RupiahFormater';
import { formatImageUrl } from 'utils/formatImageUrl';

const PesananInfoCard = ({ pesanan, kodePesan, updateNama , setKeterangan, setNamaPelanggan, setTelpon,
  namaPelanggan, telpon, keterangan,
  tanggalPesan, setTanggalPesan, tanggalSelesai, setTanggalSelesai, updateTanggal }) => {
  return (
    <Card className="bg-secondary shadow">
      <CardHeader>
        <Row className="align-items-center">
          <Col xs="8">
            <h3 className="mb-0 font-weight-light">
              Pesanan
              <strong className="ms-2 font-weight-bold">
                {kodePesan}
              </strong>
            </h3>
            <Badge color={pesanan.status === 'cuci' ? 'warning' : (pesanan.status === 'selesai' ? 'success' : 'default')} className="mt-2">
              Status: {pesanan.status.charAt(0).toUpperCase() + pesanan.status.slice(1)}
            </Badge>
          </Col>
          <Col xs="4" className="text-end">
            <strong className="font-weight-bold p-2 bg-danger text-white rounded-lg" style={{ fontSize: '1.1rem' }}>
              <RupiahFormater value={pesanan.total_harga} />
            </strong>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        {/* Pengerjaan Section -> Penyesuaian Waktu */}
        <h6 className="heading-small text-muted d-flex justify-content-between align-items-center">
          <span>
            <i className="fas fa-calendar-alt me-2 text-info"></i>
            Penyesuaian Waktu
          </span>
          <Button color="info" size="sm" onClick={updateTanggal} className="shadow-sm">
            <i className="fas fa-check-circle me-1"></i> Simpan Waktu
          </Button>
        </h6>
        <Row className="ps-md-3 mt-3">
          <Col md="6">
            <FormGroup>
              <Label className="form-control-label text-xs text-uppercase text-muted">
                Tanggal & Jam Masuk
              </Label>
              <Input
                type="datetime-local"
                className="form-control-alternative font-weight-bold text-primary"
                style={{ 
                  fontSize: '1.2rem', 
                  height: '55px', 
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 1px 3px rgba(50,50,93,.15)'
                }}
                value={tanggalPesan ? moment(tanggalPesan).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setTanggalPesan(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="form-control-label text-xs text-uppercase text-muted">
                Tanggal & Jam Selesai
              </Label>
              <Input
                type="datetime-local"
                className="form-control-alternative font-weight-bold text-success"
                style={{ 
                  fontSize: '1.2rem', 
                  height: '55px', 
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 1px 3px rgba(50,50,93,.15)'
                }}
                value={tanggalSelesai ? moment(tanggalSelesai).format("YYYY-MM-DDTHH:mm") : ""}
                onChange={(e) => setTanggalSelesai(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>



        <hr className="my-4" />

        {/* Pelanggan Section - Moved back here */}
        <h6 className="heading-small text-muted d-flex justify-content-between align-items-center">
          Informasi Pelanggan
          {/* Assuming updateNama is passed down or handled in parent */}
          <Button color="primary" size="sm" onClick={() => updateNama(pesanan)}>
            <i className="fas fa-save me-1"></i> Simpan
          </Button>
        </h6>
        {/* Input fields for customer details - Assuming state and update functions are in parent */}
        {pesanan && pesanan.customer && (
          <Row className="ps-md-3">
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-nama-pelanggan">Nama</Label>
                <Input
                  className="form-control-alternative"
                  id="input-nama-pelanggan"
                  value={namaPelanggan || ''}
                  onChange={(e) => setNamaPelanggan(e.target.value)}
                  placeholder="Nama Pelanggan"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-telpon-pelanggan">No. WhatsApp</Label>
                <Input
                  className="form-control-alternative"
                  id="input-telpon-pelanggan"
                  value={telpon || ''}
                  onChange={(e) => setTelpon(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label className="form-control-label" htmlFor="input-keterangan-pelanggan">Keterangan Tambahan</Label>
                <Input
                  className="form-control-alternative"
                  id="input-keterangan-pelanggan"
                  type="textarea" rows="2"
                  value={keterangan || ''}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Misal: Pelanggan VIP, Alamat Antar, dll."
                />
              </FormGroup>
            </Col>
          </Row>
        )}

        <hr className="my-4" />
        

        {/* Pesanan Items Section */}
        <h6 className="heading-small text-muted">Item Pesanan</h6>

        {Array.isArray(pesanan.detail_pesanans) &&
          pesanan.detail_pesanans.map(
            (detailPesanan, detailIndex) => {
              return (
                <Row key={detailIndex} className="mb-3"> {/* Added key and margin-bottom */}
                  <Col md="7">
                    <div className="d-flex align-items-center">
                      <CardImg
                        className="rounded-lg"
                        style={{
                          width: "80px",
                          height: "80px", // Added height for consistency
                          objectFit: 'cover' // Added object-fit
                        }}
                        src={formatImageUrl(detailPesanan.jenis_cuci.gambar) || "https://harmonylaundrys.com/img/logo-harmony.png"} // Added placeholder
                        alt={detailPesanan.jenis_cuci.nama}
                      />
                      <h4 className="d-flex flex-column w-full text-dark ms-2 mb-0"> {/* Adjusted margin-bottom */}
                        <span className="text-default text-sm"> {/* Reduced font size */}
                          {
                            detailPesanan.jenis_cuci.category_paket
                              .nama
                          }
                        </span>
                        <span className="font-weight-bold">{detailPesanan.jenis_cuci.nama}</span> {/* Made name bold */}
                        <span className="text-muted text-sm"> {/* Reduced font size and made muted */}
                          {detailPesanan.qty}
                          <span className="mx-1">x</span> {/* Reduced margin */}
                          <RupiahFormater
                            value={detailPesanan.harga}
                          />
                        </span>
                      </h4>
                    </div>
                  </Col>

                  <Col
                    md="5"
                    className="d-flex align-items-center justify-content-end" // Adjusted alignment
                  >
                    <h4 className="mb-0"> {/* Adjusted margin-bottom */}
                      <RupiahFormater
                        value={detailPesanan.total_harga}
                      />
                    </h4>
                  </Col>
                </Row>
              );
            }
          )}
      </CardBody>
    </Card>
  );
};

export default PesananInfoCard;
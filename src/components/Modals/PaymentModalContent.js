import React from 'react';
import {
  Button, Col, FormGroup, Input, Label, Row, CardImg, ListGroup, ListGroupItem, Badge,
  ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar

// Definisikan atau import helper ini
const addCommasLocal = (numStr) => {
  if (!numStr) return '';
  // Hapus semua kecuali digit
  const numericValue = numStr.toString().replace(/[^0-9]/g, "");
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('id-ID');
};

const removeNonNumericLocal = (numStr) => {
  if (!numStr) return '';
  return numStr.toString().replace(/[^0-9]/g, "");
};


const PaymentModalContent = ({
  isOpen,
  toggleModal,
  filteredCustomer,
  valueBayar, // Ini adalah string angka mentah
  setValueBayar,
  tipeBayar,
  setTipeBayar,
  bukti, // File object
  setBukti,
  preview, // Object URL untuk preview
  onSubmit,
}) => {
  if (!filteredCustomer) return null;

  const totalToBePaid = filteredCustomer.total_bayar - filteredCustomer.telah_bayar;
  const numericValueBayar = parseFloat(removeNonNumericLocal(valueBayar.toString() || "0"));
  const change = numericValueBayar - totalToBePaid;

  const paymentMethodIcons = {
    cash: "fas fa-money-bill-wave",
    tf: "fas fa-university", // atau fas fa-exchange-alt
    qris: "fas fa-qrcode"
  };

  const handlePaymentAmountChange = (e) => {
    setValueBayar(removeNonNumericLocal(e.target.value));
  };

  return (
    <>
      <ModalHeader toggle={toggleModal} className="bg-white text-dark border-bottom shadow-sm">
        <i className="fas fa-cash-register mr-2 text-primary"></i>
        Pembayaran: <span className="font-weight-bold">{filteredCustomer.nama}</span>
      </ModalHeader>
      <ModalBody className="p-4 bg-secondary">
        <FormGroup className="mb-4">
          <Label className="form-label font-weight-bold text-dark" htmlFor="uang_diterima">
            <i className="fas fa-coins mr-2 text-warning"></i>
            Jumlah Uang Diterima
          </Label>
          <Input
            style={{ fontSize: '2.8rem', color: '#2dce89', fontWeight: 'bold', textAlign: 'right', letterSpacing: '1px' }}
            className="form-control-lg shadow-sm border-0 text-success"
            name="uang_diterima"
            id="uang_diterima"
            placeholder="0"
            type="text"
            autoFocus={isOpen}
            value={addCommasLocal(valueBayar)} // Tampilkan dengan format
            onChange={handlePaymentAmountChange} // Simpan sebagai string angka mentah
            bsSize="lg"
            autoComplete="off"
          />
        </FormGroup>

        <ListGroup flush className="mb-4 shadow-sm rounded">
          <ListGroupItem className="d-flex justify-content-between align-items-center py-2 px-3 bg-white">
            <span className="font-weight-bold text-muted">Total Tagihan</span>
            <Badge color="danger" pill style={{ fontSize: '1rem' }}>
              <RupiahFormater value={totalToBePaid} />
            </Badge>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center py-2 px-3 bg-white">
            <span className="font-weight-bold text-muted">Jumlah Dibayar</span>
            <Badge color="info" pill style={{ fontSize: '1rem' }}>
              <RupiahFormater value={numericValueBayar} />
            </Badge>
          </ListGroupItem>
          <ListGroupItem className={`d-flex justify-content-between align-items-center py-2 px-3 ${change < 0 ? 'bg-danger' : 'bg-white'}`}>
            <span className="font-weight-bold text-muted">{change <0 ? "Tagihan" : "Kembalian"}</span>
            <Badge color={change < 0 ? "warning" : "danger"} pill style={{ fontSize: '1.2rem' }}>
              <RupiahFormater value={change > 0 ? change : Math.abs(change)} />
            </Badge>
          </ListGroupItem>
        </ListGroup>

        <hr className="my-3 border-light"/>
        <Label className="form-label font-weight-bold text-dark mb-2">
          <i className="fas fa-credit-card mr-2 text-primary"></i>
          Metode Pembayaran
        </Label>
        <Row className="mb-3 text-center" style={{gap: '0.5rem 0'}}>
          {['cash', 'tf', 'qris'].map(method => (
            <Col key={method} xs="4" className="px-1">
              <Button
                block
                className={`py-3 d-flex flex-column align-items-center justify-content-center 
                            ${tipeBayar === method 
                              ? ' btn-outline-primary shadow-sm inactive-payment-btn' 
                              : 'btn-primary shadow active-payment-btn'}`}
                onClick={() => setTipeBayar(method)}
                style={{transition: 'all 0.2s ease-in-out', transform: tipeBayar === method ? 'scale(1.03)' : 'scale(1)'}}
              >
                <i className={`${paymentMethodIcons[method]} fa-2x mb-1`}></i>
                <span className="font-weight-bold" style={{fontSize: '0.8rem'}}>{method.toUpperCase()}</span>
              </Button>
            </Col>
          ))}
        </Row>

        {(tipeBayar === "tf" || tipeBayar === "qris") && (
          <>
            <hr className="my-3 border-light"/>
            <FormGroup className="mt-3">
              <Label htmlFor="bukti-upload-input" className="w-100" style={{ cursor: 'pointer' }}>
                {preview ? (
                  <div className="text-center position-relative">
                    <CardImg
                      src={preview}
                      alt="Preview Bukti Bayar"
                      className="shadow-sm"
                      style={{ // Style untuk preview gambar
                        maxHeight: '200px',
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        border: '3px solid #2dce89',
                        borderRadius: '8px',
                        padding: '5px',
                        backgroundColor: '#fff'
                      }}
                    />
                    <Button 
                      color="danger" 
                      size="sm" 
                      className="position-absolute rounded-circle shadow" 
                      style={{top: '-12px', right: '-12px', width: '32px', height: '32px', lineHeight: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBukti(null); const fileInput = document.getElementById('bukti-upload-input'); if (fileInput) fileInput.value = null; }} 
                      title="Hapus file"
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                ) : (
                  <div
                    className="p-4 text-center"
                    style={{
                      minHeight: '160px', // Sedikit lebih tinggi
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px dashed ${tipeBayar === 'tf' ? '#11cdef' : '#fb6340'}`, // Warna border beda untuk TF dan QRIS
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                  >
                    <i className={`fas fa-cloud-upload-alt fa-3x mb-2 ${tipeBayar === 'tf' ? 'text-info' : 'text-warning'}`}></i>
                    <span className={`font-weight-bold ${tipeBayar === 'tf' ? 'text-info' : 'text-warning'}`}>
                      Unggah Bukti {tipeBayar.toUpperCase()}
                    </span>
                    <small className="text-muted mt-1">Klik di sini untuk memilih file gambar</small>
                  </div>
                )}
              </Label>
              <Input
                type="file"
                name="bukti"
                id="bukti-upload-input"
                accept="image/*"
                onChange={(e) => setBukti(e.target.files[0])}
                style={{ display: 'none' }}
              />
              {bukti && !preview && ( // Tampilkan nama file jika belum ada preview (misal saat baru dipilih)
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">File: </small>
                    <span className="text-truncate" style={{maxWidth: '200px', display: 'inline-block'}} title={bukti.name}>{bukti.name}</span>
                  </div>
                </div>
              )}
            </FormGroup>
          </>
        )}
      </ModalBody>
      <ModalFooter className="bg-light d-flex justify-content-between p-3">
        <Button color="secondary" outline onClick={toggleModal} className="px-4 py-2">
          <i className="fas fa-times mr-2"></i>Batal
        </Button>
        <Button
          color="default" // Tombol sukses untuk aksi utama
          className="px-5 py-2 shadow-lg"
          onClick={onSubmit}
          disabled={
            (numericValueBayar <= 0) // Hanya disable jika cash dan kurang bayar
          }
          size="lg"
        >
          <i className="fas fa-check-circle mr-2"></i>Proses Pembayaran
        </Button>
      </ModalFooter>
    </>
  );
};

export default PaymentModalContent;

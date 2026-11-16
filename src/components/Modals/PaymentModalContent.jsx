import React from 'react';
import {
  Button, Col, FormGroup, Input, Label, Row, CardImg, ListGroup, ListGroupItem, Badge,
  ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const addCommasLocal = (numStr) => {
  if (!numStr) return '';
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
  valueBayar,
  setValueBayar,
  tipeBayar,
  setTipeBayar,
  bukti,
  setBukti,
  preview,
  onSubmit,
}) => {
  if (!filteredCustomer) return null;

  const totalToBePaid = (filteredCustomer.total_sisa !== undefined && filteredCustomer.total_sisa !== null)
    ? Math.abs(filteredCustomer.total_sisa)
    : (filteredCustomer.total_bayar - filteredCustomer.telah_bayar);

  const numericValueBayar = parseFloat(removeNonNumericLocal(valueBayar.toString() || "0"));
  const change = numericValueBayar - totalToBePaid;

  const paymentMethods = [
    { id: 'cash', label: 'CASH / TUNAI', icon: 'fas fa-money-bill-wave' },
    { id: 'tf', label: 'TRANSFER BANK', icon: 'fas fa-university' },
    { id: 'qris', label: 'QRIS', icon: 'fas fa-qrcode' },
  ];

  const handlePaymentAmountChange = (e) => {
    setValueBayar(removeNonNumericLocal(e.target.value));
  };

  const handleSetExact = () => {
    setValueBayar(String(totalToBePaid));
  };

  const handlePresetAmount = (val) => {
    setValueBayar(String(val));
  };

  const handleAddAmount = (addVal) => {
    const cur = parseFloat(removeNonNumericLocal(valueBayar.toString() || "0"));
    setValueBayar(String(cur + addVal));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (numericValueBayar > 0) {
        onSubmit();
      }
    }
  };

  return (
    <>
      <ModalHeader toggle={toggleModal} className="bg-white text-dark border-bottom py-3 px-4 payment-modal-header">
        <div className="d-flex align-items-center">
          <div className="avatar avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2">
            <i className="fas fa-cash-register text-sm"></i>
          </div>
          <div>
            <h5 className="mb-0 font-weight-bold text-dark modal-title-text">Pembayaran Tagihan</h5>
            <small className="text-muted modal-sub-text">Pelanggan: <strong className="text-primary">{filteredCustomer.nama}</strong></small>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-4 payment-modal-body" style={{ background: '#f8f9fe' }}>
        {/* Nominal Input with Quick Buttons */}
        <FormGroup className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Label className="form-label font-weight-bold text-dark mb-0 input-amount-label" htmlFor="uang_diterima">
              <i className="fas fa-coins me-1 text-warning"></i> Jumlah Uang Diterima
            </Label>
            <Button
              color="primary"
              size="sm"
              outline
              className="py-0 px-2 rounded-pill font-weight-bold"
              style={{ fontSize: '0.75rem' }}
              onClick={handleSetExact}
            >
              Uang Pas
            </Button>
          </div>
          <div className="position-relative">
            <Input
              style={{
                fontSize: '2.4rem',
                color: '#2dce89',
                fontWeight: '900',
                textAlign: 'right',
                letterSpacing: '1px',
                height: '70px',
                background: '#ffffff',
                border: '2px solid #5e72e4'
              }}
              className="form-control-lg shadow-sm text-success modal-amount-input"
              name="uang_diterima"
              id="uang_diterima"
              placeholder="0"
              type="text"
              autoFocus={isOpen}
              value={addCommasLocal(valueBayar)}
              onChange={handlePaymentAmountChange}
              onKeyDown={handleKeyDown}
              bsSize="lg"
              autoComplete="off"
            />
          </div>

          {/* Preset Buttons for Cashier Speed */}
          <div className="d-flex flex-wrap gap-2 mt-2" style={{ gap: '6px' }}>
            <Button
              size="sm"
              color="secondary"
              className="bg-white border text-dark font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={handleSetExact}
            >
              Pas: <RupiahFormater value={totalToBePaid} />
            </Button>
            <Button
              size="sm"
              color="secondary"
              className="bg-white border text-dark font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={() => handlePresetAmount(20000)}
            >
              20.000
            </Button>
            <Button
              size="sm"
              color="secondary"
              className="bg-white border text-dark font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={() => handlePresetAmount(50000)}
            >
              50.000
            </Button>
            <Button
              size="sm"
              color="secondary"
              className="bg-white border text-dark font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={() => handlePresetAmount(100000)}
            >
              100.000
            </Button>
            <Button
              size="sm"
              color="info"
              outline
              className="bg-white font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={() => handleAddAmount(10000)}
            >
              +10.000
            </Button>
            <Button
              size="sm"
              color="info"
              outline
              className="bg-white font-weight-bold px-2 py-1 rounded shadow-none preset-btn"
              onClick={() => handleAddAmount(50000)}
            >
              +50.000
            </Button>
          </div>
        </FormGroup>

        {/* Ringkasan Perhitungan */}
        <ListGroup flush className="mb-3 shadow-sm rounded-3 overflow-hidden border modal-calc-list">
          <ListGroupItem className="d-flex justify-content-between align-items-center py-2 px-3 bg-white border-bottom calc-item">
            <span className="font-weight-bold text-muted small calc-item-label">Total Tagihan</span>
            <span className="font-weight-900 text-danger h5 mb-0">
              <RupiahFormater value={totalToBePaid} />
            </span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center py-2 px-3 bg-white border-bottom calc-item">
            <span className="font-weight-bold text-muted small calc-item-label">Nominal Bayar</span>
            <span className="font-weight-bold text-primary h5 mb-0">
              <RupiahFormater value={numericValueBayar} />
            </span>
          </ListGroupItem>
          <ListGroupItem
            className={`d-flex justify-content-between align-items-center py-2 px-3 calc-item ${
              change >= 0 ? 'bg-success-soft' : 'bg-warning-soft'
            }`}
          >
            <span className="font-weight-bold small text-dark calc-change-label">
              {change >= 0 ? 'Kembalian' : 'Kurang Bayar'}
            </span>
            <Badge
              color={change >= 0 ? 'success' : 'danger'}
              pill
              className="px-3 py-1 font-weight-900"
              style={{ fontSize: '1.05rem' }}
            >
              <RupiahFormater value={change >= 0 ? change : Math.abs(change)} />
            </Badge>
          </ListGroupItem>
        </ListGroup>

        {/* Pilihan Metode Bayar */}
        <div className="mb-3">
          <Label className="form-label font-weight-bold text-dark small mb-2 pay-method-title">
            <i className="fas fa-credit-card me-1 text-primary"></i> METODE PEMBAYARAN
          </Label>
          <Row className="gx-2">
            {paymentMethods.map((method) => {
              const isActive = tipeBayar === method.id;
              return (
                <Col key={method.id} xs="4">
                  <Button
                    block
                    className={`py-2 px-1 d-flex flex-column align-items-center justify-content-center transition-all pay-method-btn ${
                      isActive
                        ? 'btn-primary shadow text-white font-weight-bold border-2 border-primary is-active'
                        : 'btn-outline-secondary bg-white text-dark font-weight-bold'
                    }`}
                    onClick={() => setTipeBayar(method.id)}
                    style={{
                      borderRadius: '10px',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      minHeight: '68px'
                    }}
                  >
                    <i className={`${method.icon} fa-lg mb-1 ${isActive ? 'text-white' : 'text-primary'}`}></i>
                    <span style={{ fontSize: '0.75rem' }}>{method.label}</span>
                  </Button>
                </Col>
              );
            })}
          </Row>
        </div>

        {/* Upload Bukti Pembayaran untuk TF / QRIS */}
        {(tipeBayar === "tf" || tipeBayar === "qris") && (
          <div className="mt-3 p-3 bg-white rounded border upload-proof-box">
            <Label htmlFor="bukti-upload-input" className="w-100 mb-0" style={{ cursor: 'pointer' }}>
              {preview ? (
                <div className="text-center position-relative">
                  <CardImg
                    src={preview}
                    alt="Preview Bukti Bayar"
                    className="shadow-sm"
                    style={{
                      maxHeight: '180px',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      border: '2px solid #2dce89',
                      borderRadius: '8px',
                      padding: '4px',
                      backgroundColor: '#fff'
                    }}
                  />
                  <Button
                    color="danger"
                    size="sm"
                    className="position-absolute rounded-circle shadow"
                    style={{
                      top: '-10px',
                      right: '-10px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBukti(null);
                      const fileInput = document.getElementById('bukti-upload-input');
                      if (fileInput) fileInput.value = null;
                    }}
                    title="Hapus file"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </Button>
                </div>
              ) : (
                <div
                  className="p-3 text-center rounded upload-dropzone"
                  style={{
                    border: '2px dashed #5e72e4',
                    backgroundColor: '#f8f9fe',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <i className="fas fa-cloud-upload-alt fa-2x mb-2 text-primary"></i>
                  <div className="font-weight-bold text-dark small upload-title">
                    Unggah Bukti {tipeBayar.toUpperCase()}
                  </div>
                  <small className="text-muted upload-sub">Klik untuk memilih gambar atau foto bukti transfer</small>
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
          </div>
        )}
      </ModalBody>

      <ModalFooter className="bg-white d-flex justify-content-between p-3 border-top payment-modal-footer">
        <Button color="secondary" outline onClick={toggleModal} className="px-3 py-2 font-weight-bold modal-btn-cancel">
          <i className="fas fa-times me-1"></i> Batal (Esc)
        </Button>
        <Button
          color="primary"
          className="px-4 py-2 shadow-lg font-weight-900"
          onClick={onSubmit}
          disabled={numericValueBayar <= 0}
          size="md"
        >
          <i className="fas fa-check-circle me-2"></i> Proses Pembayaran
        </Button>
      </ModalFooter>
      <style>{`
        .bg-success-soft { background: rgba(45, 206, 137, 0.12) !important; }
        .bg-warning-soft { background: rgba(251, 99, 64, 0.12) !important; }

        /* ── Dark Mode ─────────────────────────────────────────── */
        body.dark-mode .payment-modal-header {
          background: #1e293b !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .modal-title-text {
          color: #f8fafc !important;
        }
        body.dark-mode .modal-sub-text {
          color: #94a3b8 !important;
        }
        body.dark-mode .payment-modal-body {
          background: #0f172a !important;
        }
        body.dark-mode .input-amount-label {
          color: #f8fafc !important;
        }
        body.dark-mode .modal-amount-input {
          background: #1e293b !important;
          color: #4ade80 !important;
          border-color: #818cf8 !important;
        }
        body.dark-mode .preset-btn {
          background: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        body.dark-mode .modal-calc-list {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .calc-item {
          background: #1e293b !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .calc-item-label {
          color: #94a3b8 !important;
        }
        body.dark-mode .calc-change-label {
          color: #f8fafc !important;
        }
        body.dark-mode .pay-method-title {
          color: #f8fafc !important;
        }
        body.dark-mode .pay-method-btn:not(.is-active) {
          background: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #cbd5e1 !important;
        }
        body.dark-mode .upload-proof-box {
          background: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .upload-dropzone {
          background: #0f172a !important;
          border-color: #818cf8 !important;
        }
        body.dark-mode .upload-title {
          color: #f8fafc !important;
        }
        body.dark-mode .upload-sub {
          color: #94a3b8 !important;
        }
        body.dark-mode .payment-modal-footer {
          background: #1e293b !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .modal-btn-cancel {
          background: #0f172a !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #cbd5e1 !important;
        }
      `}</style>
    </>
  );
};

export default PaymentModalContent;

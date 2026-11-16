import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar

const PayableOrderItem = ({ pesanan }) => {
  const kekurangan = pesanan.total_harga - pesanan.paid;
  return (
    <div className="payment-order-card mb-3 rounded-lg overflow-hidden shadow border-0" style={{ background: '#f8f9fe' }}>
      <div className="payment-order-header px-3 py-2 bg-white d-flex justify-content-between align-items-center border-bottom shadow-sm z-index-1 position-relative">
        <span className="font-weight-bolder text-dark text-sm">
          <i className="fas fa-receipt text-primary me-2"></i>{pesanan.kode_pesan}
        </span>
        {kekurangan <= 0 && <span className="badge badge-success rounded-pill px-2 py-1"><i className="fas fa-check me-1"></i>Lunas</span>}
      </div>
      
      <div className="py-2">
        {pesanan.detail_pesanans.map((detailPesan, idx) => {
          const serviceName = typeof detailPesan.jenis_cuci === 'object'
            ? detailPesan.jenis_cuci?.nama
            : (detailPesan.jenis_cuci || 'Layanan');
          const satuan = typeof detailPesan.jenis_cuci === 'object'
            ? detailPesan.jenis_cuci?.satuan
            : (detailPesan.satuan || '');
          const qtyDisplay = satuan === 'Kg'
            ? `${(Number(detailPesan.qty) / 1000).toFixed(2)} Kg`
            : `${detailPesan.qty} ${satuan || 'item'}`;

          return (
            <div key={detailPesan.id || idx} className="px-3 py-2">
              <Row className="align-items-center">
                <Col xs="7" sm="8">
                  <div className="d-flex flex-column">
                    <span className="font-weight-bold text-dark text-sm">{serviceName}</span>
                    <small className="text-muted font-weight-bold text-xs">
                      {qtyDisplay}
                      {' x '}
                      <RupiahFormater value={detailPesan.harga} />
                    </small>
                  </div>
                </Col>
                <Col xs="5" sm="4" className="text-end">
                  <span className="font-weight-bolder text-dark text-sm"><RupiahFormater value={detailPesan.total_harga} /></span>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
      
      <div className="px-3 py-3" style={{ background: 'linear-gradient(87deg, #11cdef 0, #1171ef 100%)' }}>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-white text-xs opacity-8">Subtotal</span>
          <strong className="text-white text-sm"><RupiahFormater value={pesanan.total_harga} /></strong>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-white text-xs opacity-8">Telah Dibayar</span>
          <strong className="text-white text-sm"><RupiahFormater value={pesanan.paid} /></strong>
        </div>
        {kekurangan > 0 ? (
          <>
            <hr className="my-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <div className="d-flex justify-content-between text-white mt-1 align-items-center">
              <strong className="text-sm">Sisa Tagihan</strong>
              <strong style={{ fontSize: '1.1rem' }} className="font-weight-bolder text-white"><RupiahFormater value={kekurangan} /></strong>
            </div>
          </>
        ) : (
          <div className="text-end mt-2">
            <span className="badge badge-success shadow-sm" style={{fontSize: '0.8rem'}}>Pembayaran Lunas</span>
          </div>
        )}
      </div>
      <style>{`
        /* ── Dark Mode ─────────────────────────────────────────── */
        body.dark-mode .payment-order-card {
          background: #0f172a !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .payment-order-header {
          background: #1e293b !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        body.dark-mode .payment-order-header span {
          color: #f8fafc !important;
        }
        body.dark-mode .payment-order-card span.text-dark {
          color: #f8fafc !important;
        }
        body.dark-mode .payment-order-card small.text-muted {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
};



export default PayableOrderItem;

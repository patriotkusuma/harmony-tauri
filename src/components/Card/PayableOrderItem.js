import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar

const PayableOrderItem = ({ pesanan }) => {
  const kekurangan = pesanan.total_harga - pesanan.paid;
  return (
    <div className="payment-order-card mb-3 rounded-lg overflow-hidden shadow border-0" style={{ background: '#f8f9fe' }}>
      <div className="payment-order-header px-3 py-2 bg-white d-flex justify-content-between align-items-center border-bottom shadow-sm z-index-1 position-relative">
        <span className="font-weight-bolder text-dark text-sm">
          <i className="fas fa-receipt text-primary mr-2"></i>{pesanan.kode_pesan}
        </span>
        {kekurangan <= 0 && <span className="badge badge-success badge-pill px-2 py-1"><i className="fas fa-check mr-1"></i>Lunas</span>}
      </div>
      
      <div className="py-2">
        {pesanan.detail_pesanans.map((detailPesan) => (
          <div key={detailPesan.id || detailPesan.jenis_cuci.id} className="px-3 py-2">
            <Row className="align-items-center">
              <Col xs="7" sm="8">
                <div className="d-flex flex-column">
                  <span className="font-weight-bold text-dark text-sm">{detailPesan.jenis_cuci.nama}</span>
                  <small className="text-muted font-weight-bold text-xs">
                    {detailPesan.qty}
                    {detailPesan.jenis_cuci.satuan === 'Kg' ? ' Kg' : (detailPesan.jenis_cuci.satuan === 'Pcs' ? ' Pcs' : ` ${detailPesan.jenis_cuci.satuan}`)}
                    {' x '}
                    <RupiahFormater value={detailPesan.jenis_cuci.harga} />
                  </small>
                </div>
              </Col>
              <Col xs="5" sm="4" className="text-right">
                <span className="font-weight-bolder text-dark text-sm"><RupiahFormater value={detailPesan.total_harga} /></span>
              </Col>
            </Row>
          </div>
        ))}
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
          <div className="text-right mt-2">
            <span className="badge badge-success shadow-sm" style={{fontSize: '0.8rem'}}>Pembayaran Lunas</span>
          </div>
        )}
      </div>
    </div>
  );
};



export default PayableOrderItem;

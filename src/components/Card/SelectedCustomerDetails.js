import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater'; // Pastikan path ini benar
import PayableOrderItem from './PayableOrderItem'; // Pastikan path ini benar

const SelectedCustomerDetails = ({ customer, onOpenPaymentModal, onMarkAsTaken, onSendQris }) => {
  if (!customer) return <Card className="sticky-top shadow-sm" style={{top: '20px'}}><CardBody className="text-center text-muted">Pilih customer untuk melihat detail.</CardBody></Card>;

  const totalUnpaidAmount = customer.total_bayar - customer.telah_bayar;

  return (
    <div className="sticky-top py-3" style={{top: '10px', maxHeight: 'calc(100vh - 20px)', display: 'flex', flexDirection: 'column', paddingRight: '10px' }}>
      <Card className="mb-3 shadow-sm">
        <CardHeader className="py-2 bg-secondary border-bottom">
          <h5 className="mb-0 font-weight-bold text-dark">Identitas Pelanggan</h5>
        </CardHeader>
        <CardBody className="py-2">
          <Row>
            <Col xs="5"><strong>Nama</strong></Col>
            <Col xs="7" className="text-right text-dark text-truncate" title={customer.nama}>{customer.nama}</Col>
          </Row>
          <Row>
            <Col xs="5"><strong>No. WA</strong></Col>
            <Col xs="7" className="text-right text-dark text-truncate" title={customer.telpon}>{customer.telpon}</Col>
          </Row>
          {customer.totalBayar > 0 && (
            <Row className="mt-1 pt-1 border-top">
              <Col xs="5"><strong>Total Tagihan</strong></Col>
              <Col xs="7" className="text-right text-dark font-weight-bold"><RupiahFormater value={customer.totalBayar} /></Col>
            </Row>
          )}
        </CardBody>
      </Card>
      {/* Buttons Area - Moved here, outside the scrollable content */}
      {totalUnpaidAmount > 0 ? (
        <>
          <Button
            color="success"
            block
            className="w-100 my-2"
            onClick={onSendQris}
          >
            Kirim QRIS Dinamis
          </Button>
        <Button
          className="w-100 mb-3" // Added mb-3 for spacing before scrollable content
          color="default"
          size="lg"
          onClick={onOpenPaymentModal}
          >
            
            
            <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0 font-weight-bold text-white">Bayar Tagihan</span>
            <strong className="h5 mb-0 font-weight-bold text-white"><RupiahFormater value={totalUnpaidAmount} /></strong>
          </div>
        </Button>
        </>
      ) : (
        customer.pesanan_takable && customer.pesanan_takable.length > 0 && (
          <Button
            className="w-100 mb-3 py-3 shadow" // Added mb-3
            color="success"
            size="lg"
            onClick={() => onMarkAsTaken(customer, 'diambil')}
          >
            <div className="d-flex justify-content-center align-items-center ">
              <span className="h5 mb-0 font-weight-bold">Tandai Semua Telah Diambil</span>
              <i className="fas fa-check-double ml-2"></i>
            </div>
          </Button>
        )
      )}
      {/* Scrollable Content Area */}
      <h5 className="mt-0 mb-2 font-weight-bold text-dark">Daftar Tagihan:</h5> {/* Adjusted mt-0, color to text-dark */}
      {/* Added styles to hide scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* For Chrome, Safari, and Opera */
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* For Internet Explorer and Edge */
          scrollbar-width: none;  /* For Firefox */
        }
      `}</style>
      <div style={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}> {/* minHeight: 0 is important for flex item to shrink properly */}
        {Array.isArray(customer.pesanans) && customer.pesanans.length > 0 ? (
          customer.pesanans.map((pesanan) => (
            <PayableOrderItem key={pesanan.id || pesanan.kode_pesan} pesanan={pesanan} />
          ))
        ) : (
          <p className="text-muted text-center">Tidak ada tagihan yang perlu dibayar.</p>
        )}
        
        {customer.pesanan_takable && customer.pesanan_takable.length > 0 && totalUnpaidAmount <= 0 && (
           <p className="text-muted text-center mt-2">Semua tagihan lunas, barang siap diambil.</p>
        )}
      </div>
    </div>
  );
};

export default SelectedCustomerDetails;

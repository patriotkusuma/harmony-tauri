import React from 'react';
import { Card, CardHeader, CardBody, Badge, Row, Col, Table } from 'reactstrap';
import moment from 'moment';

const DeliveryOverview = ({ ambilPesanan }) => {
  return (
    <Card className="glass-card shadow-premium border-0 mb-4 overflow-hidden">
      <CardHeader className="bg-white border-0 py-4">
        <Row className="align-items-center">
          <Col>
             <h5 className="text-uppercase text-muted ls-1 mb-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
               Ambil & Kirim
             </h5>
             <h3 className="mb-0 text-dark font-weight-bold" style={{ color: '#000' }}>
               {moment().format("DD MMMM YYYY")}
             </h3>
          </Col>
          <Col xs="auto">
             <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow-sm" style={{ width: '45px', height: '45px' }}>
                <i className="fas fa-truck fa-sm" />
             </div>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className="p-0">
         <Table className="align-middle table-flush border-0" responsive>
            <thead className="table-light">
               <tr style={{ background: 'rgba(0,0,0,0.05)' }}>
                  <th className="font-weight-bold text-dark py-3 border-0">Customer</th>
                  <th className="font-weight-bold text-dark py-3 border-0 text-center">Jam</th>
                  <th className="font-weight-bold text-dark py-3 border-0 text-end">Status</th>
               </tr>
            </thead>
            <tbody>
               {(!ambilPesanan || ambilPesanan.length === 0) ? (
                 <tr>
                    <td colSpan="3" className="text-center py-5 text-muted opacity-5 px-4 font-italic">
                       Belum ada jadwal pengambilan hari ini
                    </td>
                 </tr>
               ) : (
                 ambilPesanan.map((ambil, index) => {
                    const isDiambil = ambil.status === "diambil";
                    return (
                       <tr key={index} className="transition-all hover-translate-up cursor-pointer" style={{ transition: 'all 0.2s' }}>
                          <td className="py-3 border-0">
                             <div className="d-flex align-items-center">
                                <span className={`me-2 rounded-circle ${isDiambil ? 'bg-success' : 'bg-warning'}`} style={{ width: '8px', height: '8px', flexShrink: 0 }} />
                                <strong className="text-dark" style={{ color: '#000' }}>{ambil.customer.nama}</strong>
                             </div>
                             {ambil.antar === 1 && (
                                <small className="text-info d-block ms-3">
                                   <i className="fas fa-truck-pickup me-1 mt-1" /> Delivery service
                                </small>
                             )}
                          </td>
                          <td className="py-3 border-0 text-center font-weight-bold h5 mb-0 text-primary">
                             {moment(ambil.tanggal_selesai).format("HH:mm")}
                          </td>
                          <td className="py-3 border-0 text-end">
                             <Badge color={isDiambil ? "success" : "warning"} pill className="px-3 py-1 shadow-sm font-weight-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                {ambil.status}
                             </Badge>
                          </td>
                       </tr>
                    );
                 })
               )}
            </tbody>
         </Table>
      </CardBody>
    </Card>
  );
};

export default DeliveryOverview;

import React from 'react';
import { Card, CardHeader, CardBody, Badge, Row, Col } from 'reactstrap';
import moment from 'moment';

const TodayWorkBoard = ({ urutanKerja }) => {
  return (
    <Card className="glass-card shadow-premium border-0 mb-4 overflow-hidden">
      <CardHeader className="bg-gradient-default py-4 border-0">
        <Row className="align-items-center">
          <Col>
            <h5 className="text-uppercase text-white mb-0 ls-1 font-weight-bold">
              <i className="fas fa-layer-group me-2" />
              Prioritas Kerja
            </h5>
          </Col>
          <Col xs="auto">
            <Badge color="light" pill className="px-3 py-2 text-default font-weight-bold shadow-sm">
              {urutanKerja?.length || 0} Antrian
            </Badge>
          </Col>
        </Row>
      </CardHeader>
      
      <CardBody className="p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {(!urutanKerja || urutanKerja.length === 0) ? (
          <div className="text-center py-5 text-muted opacity-5 italic">
            <i className="fas fa-ghost fa-3x mb-3 d-block opacity-2" />
            Antrian sedang kosong
          </div>
        ) : (
          urutanKerja.map((urutan, index) => {
            const isTop = index === 0;
            return (
              <div 
                key={index}
                className={`d-flex align-items-center px-4 py-3 border-bottom-white-05 transition-all ${isTop ? 'bg-primary-soft-10' : ''}`}
                style={{ 
                  borderLeft: isTop ? '6px solid #5e72e4' : '6px solid transparent',
                  background: isTop ? 'rgba(94, 114, 228, 0.04)' : 'transparent'
                }}
              >
                <div className="me-3 text-center" style={{ width: '40px' }}>
                  <span className={`badge rounded-pill ${isTop ? 'badge-danger pulse-animation' : 'badge-dark'}`} style={{ fontSize: '0.8rem' }}>
                    #{index + 1}
                  </span>
                  {isTop && (
                    <div className="text-uppercase font-weight-900 text-danger mt-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                      NOW
                    </div>
                  )}
                </div>

                <div className="flex-grow-1 min-w-0 pe-2">
                   <h5 className={`mb-0 text-truncate font-weight-bold ${isTop ? 'text-primary' : 'text-dark'}`} style={{ color: isTop ? '#5e72e4' : '#000' }}>
                    {urutan.customer.nama}
                  </h5>
                  <div className="mt-1 d-flex flex-wrap" style={{ gap: '4px' }}>
                    {urutan.detail_pesanans.map((d, i) => (
                       <Badge key={i} color="secondary" className="px-2 py-1 text-xs text-dark font-weight-bold border">
                        {d.jenis_cuci.nama}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-end">
                   <div className={`font-weight-bold h5 mb-0 ${isTop ? 'text-primary' : 'text-dark'}`}>
                     {moment(urutan.tanggal_selesai).format("HH:mm")}
                   </div>
                    <div className="text-dark font-weight-bold text-xs text-uppercase">
                     {moment(urutan.tanggal_selesai).isSame(moment(), 'day') ? 'Hari Ini' : moment(urutan.tanggal_selesai).format("DD MMM")}
                   </div>
                </div>
              </div>
            );
          })
        )}
      </CardBody>

      <style>{`
        .bg-primary-soft-10 { background: rgba(94, 114, 228, 0.08); }
        .pulse-animation {
            animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 54, 92, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(245, 54, 92, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 54, 92, 0); }
        }
      `}</style>
    </Card>
  );
};

export default TodayWorkBoard;

import React from 'react';
import { Card, CardHeader, CardBody, Badge, Button, CustomInput } from 'reactstrap';
import moment from 'moment';

const RFIDScanPanel = ({ scanActive, setScanActive, scannedUID, lastScanTime, onRegisterManual }) => {
  return (
    <Card className="shadow-premium border-0 glass-card h-100" style={{ border: "2px solid #5e72e4" }}>
      <CardHeader className="bg-gradient-primary text-white border-0 py-4 text-center rounded-top">
        <div className="d-flex align-items-center justify-content-center">
            <i className="fas fa-satellite-dish fa-2x mr-3 text-white-50" />
            <h4 className="text-white text-uppercase ls-1 mb-0 font-weight-bold">Scan Pendaftaran</h4>
        </div>
      </CardHeader>
      <CardBody className="text-center py-5 px-4">
        {/* Scanned Card Visual */}
        <div 
          className={`mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle shadow-lg transition-all ${scanActive ? 'pulse-primary' : 'bg-secondary'}`}
          style={{ 
            width: '130px', 
            height: '130px',
            background: scanActive ? 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)' : 'rgba(0,0,0,0.05)',
            border: '8px solid white'
          }}
        >
          <i className={`fas fa-id-card fa-3x ${scanActive ? 'text-white' : 'text-muted opacity-3'}`} />
        </div>

        {scannedUID ? (
          <div className="mb-4 fade-in">
            <Badge color="neutral" pill className="h3 font-weight-900 border px-4 py-2 text-primary shadow-sm" style={{ letterSpacing: '2px' }}>
              {scannedUID}
            </Badge>
            {lastScanTime && (
                <div className="text-muted text-xs mt-2 italic font-weight-bold">
                    <i className="far fa-clock mr-1" /> Terdeteksi: {moment(lastScanTime).format("HH:mm:ss")}
                </div>
            )}
          </div>
        ) : (
          <div className="text-muted opacity-8 mb-4">
            <p className="mb-0 italic h5">{scanActive ? "Silakan tap kartu baru..." : "Scanner Dinonaktifkan"}</p>
          </div>
        )}

        <hr className="my-4 opacity-1" />

        <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-lg shadow-sm border">
            <span className="font-weight-bold text-dark text-sm">Mode Scanning</span>
            <CustomInput
                type="switch"
                id="scanActiveSwitch"
                name="scanActiveSwitch"
                label=""
                checked={scanActive}
                onChange={(e) => setScanActive(e.target.checked)}
                className="custom-control-alternative"
            />
        </div>

        <Button 
          color="primary" 
          block 
          onClick={onRegisterManual}
          className="shadow-premium py-3 font-weight-bold rounded-lg mt-2"
        >
          <i className="fas fa-plus-circle mr-2" /> Daftar Kartu Baru
        </Button>
      </CardBody>
      <style>{`
        .pulse-primary { animation: pulse-blue 2s infinite; }
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(94, 114, 228, 0); }
          100% { box-shadow: 0 0 0 0 rgba(94, 114, 228, 0); }
        }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Card>
  );
};

export default RFIDScanPanel;

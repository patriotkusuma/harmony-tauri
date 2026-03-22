import React from 'react';

const RFIDLoginBanner = ({ isConnected }) => {
  return (
    <div
      className="mb-4 text-center p-3 animate-fade-in"
      style={{
        background: isConnected ? "rgba(45,206,137,0.1)" : "rgba(0,0,0,0.03)",
        border: `1px dashed ${isConnected ? "#2dce89" : "#ccc"}`,
        borderRadius: 12,
        transition: 'all 0.3s ease'
      }}
    >
      <i
        className={`fas ${isConnected ? "fa-id-badge" : "fa-exclamation-triangle"} mb-2 d-block`}
        style={{ fontSize: 28, color: isConnected ? "#2dce89" : "#adb5bd" }}
      />
      <span style={{ fontSize: 13, color: isConnected ? "#1a9e6a" : "#6c757d", fontWeight: 600 }}>
        {isConnected ? "SIAP LOGIN: Tempelkan kartu RFID Anda" : "RFID: Driver tidak terdeteksi"}
      </span>
      {isConnected && (
        <div className="mt-1">
          <small className="text-success" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Akses Cepat Aktif
          </small>
        </div>
      )}
    </div>
  );
};

export default RFIDLoginBanner;

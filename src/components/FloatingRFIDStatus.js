import React, { useState } from 'react';
import { useMQTTRFID } from '../hooks/useMQTTRFID';

const FloatingRFIDStatus = () => {
  const { connected, connecting, error, mode, devices } = useMQTTRFID({ enabled: false });
  const [expanded, setExpanded] = useState(false);

  // If there's an error and not connected
  const isError = error && !connected;
  
  // Decide the main button color
  let bgColor = "#f5365c"; // red
  let icon = "fa-times-circle";
  let pulse = false;
  
  if (connected) {
    bgColor = "#2dce89"; // green
    icon = "fa-check-circle";
  } else if (connecting) {
    bgColor = "#fb6340"; // orange
    icon = "fa-sync fa-spin";
  }

  // Determine global device counts
  const deviceEntries = Object.entries(devices || {});
  const onlineCount = deviceEntries.filter(([, status]) => status === 'online').length;
  const totalCount = deviceEntries.length;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12
      }}
    >
      {/* Expanded Menu */}
      {expanded && (
        <div
          className="shadow-lg floating-rfid-card"
          style={{
            borderRadius: 12,
            padding: 16,
            minWidth: 260,
            animation: 'fadeInUp 0.2s ease-out forwards',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 font-weight-bold floating-rfid-title">
              MQTT RFID Status
            </h5>
            <button
              onClick={() => setExpanded(false)}
              className="floating-rfid-close"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Broker Status */}
          <div className="mb-3">
            <div className="text-muted floating-rfid-label">
              Broker Connection
            </div>
            <div className="d-flex align-items-center" style={{ gap: 8 }}>
              <i className={`fas ${icon}`} style={{ color: bgColor, fontSize: 18 }} />
              <div>
                <div className="floating-rfid-status-text">
                  {connected ? "Terhubung" : connecting ? "Menyambungkan..." : "Terputus"}
                </div>
                <div style={{ fontSize: 11 }} className="floating-rfid-muted-text">
                  Mode: <span className="font-weight-bold text-primary">{mode || "N/A"}</span>
                </div>
              </div>
            </div>
            {isError && (
              <div className="mt-2 p-2 rounded floating-rfid-error">
                {error.toString()}
              </div>
            )}
          </div>

          <hr className="floating-rfid-divider" />

          {/* Device Status */}
          <div>
            <div className="text-muted d-flex justify-content-between align-items-center floating-rfid-label">
              <span>Perangkat (Board)</span>
              {totalCount > 0 && <span className="badge badge-light text-muted">{onlineCount}/{totalCount} Online</span>}
            </div>
            
            {totalCount === 0 ? (
              <div className="text-center p-3 rounded floating-rfid-empty">
                Belum ada perangkat
              </div>
            ) : (
              <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                {deviceEntries.map(([dev, st]) => (
                  <div key={dev} className="d-flex justify-content-between align-items-center p-2 rounded mb-1 floating-rfid-device-item">
                    <code className="floating-rfid-device-name">{dev}</code>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        background: st === 'online' ? 'rgba(45,206,137,0.1)' : 'rgba(245,54,92,0.1)',
                        color: st === 'online' ? '#2dce89' : '#f5365c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: st === 'online' ? '#2dce89' : '#f5365c' }} />
                      {st === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Main Floating Bubble */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="floating-rfid-bubble"
        style={{
          background: bgColor,
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className="fas fa-wifi" />
        
        {/* Badge counter online devices */}
        {connected && totalCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: onlineCount > 0 ? '#11cdef' : '#ffc107',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              width: 18,
              height: 18,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              border: '2px solid #fff'
            }}
          >
            {onlineCount}
          </span>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Base Styles (Light) ── */
        .floating-rfid-card {
          background: #fff;
          border: 1px solid #f0f0f5;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .floating-rfid-title { color: #32325d; }
        .floating-rfid-close { background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 16px; }
        .floating-rfid-close:hover { color: #333; }
        
        .floating-rfid-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .floating-rfid-status-text { font-size: 14px; font-weight: 600; color: #333; }
        .floating-rfid-muted-text { color: #888; }
        
        .floating-rfid-error { background: #fdf3f5; color: #f5365c; font-size: 11px; }
        .floating-rfid-divider { margin: 12px 0; border-color: #eee; }
        
        .floating-rfid-empty { background: #f8f9fe; border: 1px dashed #ddd; font-size: 12px; color: #888; }
        .floating-rfid-device-item { background: #fcfcfc; border: 1px solid #f4f4f4; }
        .floating-rfid-device-name { font-size: 11px; color: #5e72e4; }
        
        .floating-rfid-bubble {
          width: 50px; height: 50px; border-radius: 25px; color: #fff;
          display: flex; justify-content: center; align-items: center;
          font-size: 20px; box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          cursor: pointer; transition: all 0.2s; border: 2px solid #fff;
          position: relative;
        }

        /* ── Dark Mode ── */
        .dark-mode .floating-rfid-card {
          background: #1e1e2f;
          border: 1px solid #2e2e45;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .dark-mode .floating-rfid-title { color: #e0e0f0; }
        .dark-mode .floating-rfid-close { color: #6060a0; }
        .dark-mode .floating-rfid-close:hover { color: #fff; }

        .dark-mode .floating-rfid-status-text { color: #e0e0f0; }
        .dark-mode .floating-rfid-muted-text { color: #8888b5; }

        .dark-mode .floating-rfid-error { background: rgba(245,54,92,0.15); color: #fc6384; }
        .dark-mode .floating-rfid-divider { border-color: #2e2e45; }

        .dark-mode .floating-rfid-empty { background: #1a1a2e; border: 1px dashed #3e3e55; color: #6060a0; }
        .dark-mode .floating-rfid-device-item { background: #1a1a2e; border: 1px solid #2e2e45; }
        .dark-mode .floating-rfid-device-name { color: #8fa4ff; }

        .dark-mode .floating-rfid-bubble { border-color: #1e1e2f; box-shadow: 0 4px 14px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
};

export default FloatingRFIDStatus;

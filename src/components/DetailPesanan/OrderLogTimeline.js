import React from "react";
import moment from "moment";
import { Badge } from "reactstrap";

const PROCESS_META = {
    cuci: { color: "info", icon: "fas fa-water", label: "Cuci", gradient: "linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)" },
    drying: { color: "primary", icon: "fas fa-wind", label: "Pengeringan", gradient: "linear-gradient(135deg, #1171ef 0%, #11cdef 100%)" },
    setrika: { color: "warning", icon: "fas fa-tshirt", label: "Setrika", gradient: "linear-gradient(135deg, #ffad46 0%, #ff8967 100%)" },
    selesai: { color: "success", icon: "fas fa-check-circle", label: "Selesai", gradient: "linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)" },
};

const formatDuration = (start, end) => {
    if (!start || !end) return null;
    const duration = moment.duration(moment(end).diff(moment(start)));
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    let result = "";
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s`;
    return result;
};

const OrderLogTimeline = ({ logs = [] }) => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return (
      <div className="text-center py-5 opacity-5">
        <div className="mb-3">
          <i className="fas fa-history fa-2x text-muted" />
        </div>
        <div className="font-weight-bold text-dark">Belum ada riwayat proses</div>
        <small className="text-muted">Proses mesin akan muncul di sini.</small>
      </div>
    );
  }

  return (
    <div className="order-log-timeline px-2">
      {logs.map((log, index) => {
        const meta = PROCESS_META[log.proses] || {
            color: "secondary",
            icon: "fas fa-cog",
            label: log.proses,
            gradient: "linear-gradient(135deg, #8898aa 0%, #adb5bd 100%)"
        };
        const isRunning = !log.finished_at;
        const duration = formatDuration(log.started_at, log.finished_at);

        return (
          <div key={index} className="order-log-item d-flex position-relative">
            {/* LEFT AXIS */}
            <div className="order-log-left mr-3 d-flex flex-column align-items-center">
              <div
                className={`order-log-dot shadow-sm d-flex align-items-center justify-content-center text-white rounded-circle`}
                style={{ 
                    width: '32px', 
                    height: '32px', 
                    zIndex: 2, 
                    background: meta.gradient,
                    fontSize: '0.8rem'
                }}
              >
                <i className={`${meta.icon} ${isRunning ? 'fa-spin' : ''}`} />
              </div>
              {index !== logs.length - 1 && (
                <div className="order-log-line bg-light" style={{ width: '2px', flexGrow: 1, zIndex: 1 }} />
              )}
            </div>

            {/* CONTENT */}
            <div className="order-log-content pb-4 flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <div>
                    <h6 className="mb-0 font-weight-bold text-dark uppercase ls-1" style={{ fontSize: '0.85rem' }}>
                        {meta.label}
                    </h6>
                    <small className="text-muted font-weight-bold">
                        <i className="far fa-clock mr-1" />
                        {moment(log.started_at).format("HH:mm")}
                        {log.finished_at && <span className="mx-1">→ {moment(log.finished_at).format("HH:mm")}</span>}
                    </small>
                </div>
                <div className="text-right">
                    {duration && (
                        <Badge color="soft-info" className="text-info border-0 px-2 py-1 rounded-pill">
                            {duration}
                        </Badge>
                    )}
                    {isRunning && (
                        <Badge color="primary" pill className="animate-pulse-lite px-2 py-1">Running</Badge>
                    )}
                </div>
              </div>

              <div className="bg-light-soft p-2 rounded-lg border-0 mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-dark font-weight-700">
                        <i className="fas fa-microchip mr-1 opacity-5" />
                        Mesin {log.machine_id}
                    </small>
                    {log.operator_id && (
                        <small className="text-muted">
                            <i className="far fa-user mr-1 opacity-5" />
                            {log.operator_id}
                        </small>
                    )}
                </div>
                
                {log.keterangan && (
                    <div className="text-xs mt-1 text-dark font-italic border-top pt-1 opacity-8">
                        {log.keterangan}
                    </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .bg-light-soft { background-color: rgba(244, 245, 247, 0.6); }
        .ls-1 { letter-spacing: 0.5px; }
        .uppercase { text-transform: uppercase; }
        .font-weight-700 { font-weight: 700; }
        
        .animate-pulse-lite {
            animation: pulse-lite 2s infinite;
        }
        @keyframes pulse-lite {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        
        .order-log-item:last-child .order-log-content {
            pb-0;
        }
      `}</style>
    </div>
  );
};

export default OrderLogTimeline;

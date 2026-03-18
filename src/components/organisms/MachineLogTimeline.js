import React from 'react';
import { CardBody, Row, Col, Badge } from 'reactstrap';
import moment from 'moment';

const PROCESS_META = {
    cuci: { color: "info", icon: "fas fa-water", label: "Cuci", gradient: "linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)" },
    drying: { color: "primary", icon: "fas fa-wind", label: "Pengeringan", gradient: "linear-gradient(135deg, #1171ef 0%, #11cdef 100%)" },
    setrika: { color: "warning", icon: "fas fa-tshirt", label: "Setrika", gradient: "linear-gradient(135deg, #ffad46 0%, #ff8967 100%)" },
    selesai: { color: "success", icon: "fas fa-check-circle", label: "Selesai", gradient: "linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)" },
};

const formatDuration = (start, end) => {
    if (!start || !end) return null;
    const duration = moment.duration(moment(end).diff(moment(start)));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    let result = "";
    if (hours > 0) result += `${hours}j `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}d`;
    return result;
};

const MachineLogTimeline = ({ logs, loading }) => {
    if (loading) {
        return (
            <CardBody className="py-9 text-center">
                <div className="spinner-container position-relative mb-4">
                    <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status" />
                    <i className="fas fa-microchip position-absolute text-primary" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>
                <h4 className="text-dark font-weight-bold">Sinkronisasi Data Produksi...</h4>
                <p className="text-muted">Mengambil log aktivitas terbaru dari mesin...</p>
            </CardBody>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <CardBody className="py-9 text-center opacity-8">
                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-soft-secondary shadow-inner" style={{ width: '120px', height: '120px' }}>
                    <i className="fas fa-satellite-dish fa-3x text-muted" />
                </div>
                <h3 className="text-dark font-weight-bold">Hening di Sini</h3>
                <p className="text-muted max-w-400 mx-auto">Belum ada sinyal aktivitas mesin yang tertangkap pada periode ini. Silakan pilih tanggal lain atau periksa koneksi mesin.</p>
            </CardBody>
        );
    }

    return (
        <CardBody className="px-3 px-md-5 py-5 bg-soft-light transition-all">
            <div className="timeline-wrapper pl-lg-4">
                {logs.map((log, index) => {
                    const meta = PROCESS_META[log.proses] || {
                        color: "secondary",
                        icon: "fas fa-cog",
                        label: log.proses,
                        gradient: "linear-gradient(135deg, #8898aa 0%, #adb5bd 100%)"
                    };

                    const isRunning = !log.finished_at;
                    const durationText = formatDuration(log.started_at, log.finished_at);

                    return (
                        <div key={index} className="timeline-entry d-flex position-relative mb-5">
                            {/* VERTICAL AXIS */}
                            <div className="timeline-axis mr-3 mr-md-4 d-flex flex-column align-items-center">
                                <div 
                                    className={`timeline-icon shadow-premium d-flex align-items-center justify-content-center text-white rounded-circle position-relative`}
                                    style={{ 
                                        width: '52px', 
                                        height: '52px', 
                                        zIndex: 3,
                                        background: meta.gradient
                                    }}
                                >
                                    <i className={`${meta.icon} ${isRunning ? 'pulse-icon' : ''}`} style={{ fontSize: '1.2rem' }} />
                                    {isRunning && (
                                        <span className="position-absolute" style={{ top: -2, right: -2 }}>
                                            <span className="pulse-dot" />
                                        </span>
                                    )}
                                </div>
                                {index !== logs.length - 1 && (
                                    <div className="timeline-trail position-absolute" style={{ width: '2px', top: '52px', bottom: '-3rem', left: '25px', zIndex: 1, backgroundColor: '#e9ecef' }} />
                                )}
                            </div>

                            {/* CONTENT BLOCK */}
                            <div className="timeline-body w-100 flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <Badge 
                                            style={{ backgroundColor: isRunning ? 'transparent' : `${meta.gradient}` }} 
                                            className={`${isRunning ? 'border-primary border text-primary' : 'text-white border-0'} px-3 py-2 rounded-pill font-weight-bold uppercase ls-1 shadow-sm`}
                                        >
                                            {isRunning && <i className="fas fa-play-circle mr-2 animate-flicker" />}
                                            {meta.label}
                                        </Badge>
                                        <span className="text-muted font-weight-600 ml-2">
                                            <i className="fas fa-server mr-1 opacity-5" />
                                            {log.machine_id}
                                        </span>
                                    </div>
                                    <div className="log-timing text-right">
                                        <div className="text-dark font-weight-bold h5 mb-0">
                                            {moment(log.started_at).format("HH:mm")}
                                            {log.finished_at && (
                                                <span className="text-muted font-weight-normal mx-2">→ {moment(log.finished_at).format("HH:mm")}</span>
                                            )}
                                        </div>
                                        {durationText && (
                                            <small className="text-info font-weight-bold">
                                                <i className="far fa-hourglass mr-1" />
                                                {durationText}
                                            </small>
                                        )}
                                        {isRunning && (
                                            <Badge color="primary" pill className="animate-pulse px-2 py-1">
                                                Sedang Berjalan
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="log-card p-4 rounded-xl shadow-premium border-0 bg-white glass-effect hover-lift transition-all">
                                    <Row className="align-items-center">
                                        <Col md="7">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="avatar-placeholder rounded-circle bg-soft-info mr-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-user text-info" />
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block font-weight-bold ls-1 uppercase" style={{ fontSize: '0.6rem' }}>Customer</small>
                                                    <h5 className="mb-0 text-dark font-weight-900">{log.customer_name}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="badge badge-soft-dark py-1 px-3 rounded-pill border">
                                                    <i className="fas fa-hashtag mr-2 opacity-5" />
                                                    {log.kode_pesan}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="5" className="mt-3 mt-md-0 text-md-right border-md-left">
                                            <div className="mb-2">
                                                <small className="text-muted d-block font-weight-bold ls-1 uppercase" style={{ fontSize: '0.6rem' }}>Status Akun</small>
                                                <Badge color={log.status === 'success' || log.status === 'active' ? 'success' : 'neutral'} pill className="px-3">
                                                    {log.status}
                                                </Badge>
                                            </div>
                                            {log.operator_id && (
                                                <div>
                                                    <small className="text-muted d-block font-weight-bold ls-1 uppercase" style={{ fontSize: '0.6rem' }}>Operator In-Charge</small>
                                                    <span className="text-sm font-weight-700 text-dark">
                                                        <i className="far fa-id-badge mr-2 opacity-4" />
                                                        {log.operator_id}
                                                    </span>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>

                                    {log.keterangan && (
                                        <div className="mt-4 pt-3 border-top position-relative">
                                            <i className="fas fa-quote-left position-absolute text-soft-primary" style={{ top: 10, left: 0, opacity: 0.1, fontSize: '1.5rem' }} />
                                            <p className="text-sm text-dark font-italic mb-0 pl-4">{log.keterangan}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .bg-soft-light { background-color: #f8f9fe; }
                .bg-soft-info { background-color: rgba(17, 205, 239, 0.1); }
                .bg-soft-secondary { background-color: #f4f5f7; }
                .bg-soft-dark { background-color: rgba(50, 50, 93, 0.05); }
                .text-soft-primary { color: #5e72e4; }
                
                .rounded-xl { border-radius: 16px; }
                .uppercase { text-transform: uppercase; }
                .ls-1 { letter-spacing: 0.5px; }
                .font-weight-900 { font-weight: 900; }
                .font-weight-700 { font-weight: 700; }
                .font-weight-600 { font-weight: 600; }
                
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.8) !important;
                }
                
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
                }
                
                .pulse-icon {
                    animation: pulse-animation 2s infinite;
                }

                @keyframes pulse-animation {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .pulse-dot {
                    width: 12px;
                    height: 12px;
                    background-color: #2dce89;
                    border-radius: 50%;
                    display: inline-block;
                    border: 2px solid white;
                    animation: dot-pulse 1.5s infinite linear;
                    box-shadow: 0 0 0 0 rgba(45, 206, 137, 0.7);
                }

                @keyframes dot-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(45, 206, 137, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0); }
                }

                .animate-flicker {
                    animation: flicker 1s infinite alternate;
                }
                
                @keyframes flicker {
                    from { opacity: 1; }
                    to { opacity: 0.5; }
                }

                .shadow-inner {
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                
                .max-w-400 { max-width: 400px; }
                .gap-2 { gap: 0.5rem; }
            `}</style>
        </CardBody>
    );
};

export default MachineLogTimeline;

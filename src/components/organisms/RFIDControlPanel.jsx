import React from 'react';
import { Card, CardHeader, CardBody, Badge, Button, Input, FormGroup } from 'reactstrap';
import moment from 'moment';

const RFIDControlPanel = ({ 
    activeMode, 
    scannedRFID, 
    lastScan, 
    mqttConnected, 
    mqttConnecting, 
    selectedOrder, 
    autoAttach, 
    setAutoAttach, 
    handleAttach, 
    handleDetach, 
    linkedOrders, 
    clearUID,
    showError 
}) => {
    return (
        <Card className="shadow-premium border-0 glass-card sticky-top" style={{ top: '20px' }}>
            <CardHeader className="bg-gradient-primary text-white border-0 py-4 text-center rounded-top">
                <i className="fas fa-rss fa-3x mb-3 text-white-50" />
                <h4 className="text-white text-uppercase ls-1 mb-0 font-weight-bold">Status RFID Reader</h4>
                <Badge color={mqttConnected ? "success" : "danger"} pill className="mt-2 text-uppercase px-3 py-1 shadow-sm">
                    {mqttConnected ? "Connected" : (mqttConnecting ? "Connecting..." : "Disconnected")}
                </Badge>
            </CardHeader>
            <CardBody className="text-center py-5">
                {/* Scanned Card Visual */}
                <div 
                    className={`mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle shadow-lg transition-all ${scannedRFID ? 'pulse-success' : 'bg-secondary'}`}
                    style={{ 
                        width: '140px', 
                        height: '140px',
                        background: scannedRFID ? 'linear-gradient(135deg, #2dce89 0%, #2dcecc 100%)' : 'rgba(0,0,0,0.05)',
                        border: '8px solid white'
                    }}
                >
                    <i className={`fas fa-id-card fa-3x ${scannedRFID ? 'text-white' : 'text-muted opacity-3'}`} />
                </div>

                {scannedRFID ? (
                    <div className="mb-4">
                        <Badge color="neutral" pill className="h3 font-weight-900 border px-4 py-2 text-primary shadow-sm" style={{ letterSpacing: '2px' }}>
                            {scannedRFID}
                        </Badge>
                        <div className="text-muted text-xs mt-2 italic">
                            <i className="far fa-clock me-1" /> Scan terakhir: {moment(lastScan?.receivedAt).format("HH:mm:ss")}
                        </div>
                        <Button color="link" size="sm" className="text-danger mt-1" onClick={clearUID}>
                            <i className="fas fa-undo me-1" /> Reset Scan
                        </Button>
                    </div>
                ) : (
                    <div className="text-muted opacity-6 mb-4">
                        <p className="mb-0 italic h5">Tunggu tap kartu...</p>
                    </div>
                )}

                <hr className="my-4 opacity-1" />

                {activeMode === "attach" ? (
                    <div className="text-start px-2">
                        <h6 className="text-uppercase text-muted ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.7rem' }}>Konfigurasi Pemasangan</h6>
                        
                        <div className="p-3 bg-secondary-soft rounded-lg mb-4 border d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className="text-xs text-muted d-block">Target Order:</span>
                                <strong className={selectedOrder ? "text-primary h5" : "text-muted italic"}>
                                    {selectedOrder ? selectedOrder.kode_pesan : "Pilih order di kiri"}
                                </strong>
                            </div>
                            {selectedOrder && <i className="fas fa-check-circle text-success" />}
                        </div>

                        <FormGroup className="mb-4 bg-white p-3 rounded-lg shadow-sm border">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="font-weight-bold text-dark text-sm">Otomatis Pasang (Auto-Attach)</span>
                                <Input
                                    type="switch"
                                    id="autoAttachSwitch"
                                    name="autoAttachSwitch"
                                    label=""
                                    checked={autoAttach}
                                    onChange={(e) => setAutoAttach(e.target.checked)}
                                    className="form-check-alternative"
                                />
                            </div>
                            <p className="text-xs text-muted mb-0 italic" style={{ lineHeight: '1.4' }}>
                                Aktifkan untuk langsung menghubungkan RFID segera setelah kartu di-tap pada reader.
                            </p>
                        </FormGroup>

                        <Button 
                            color="primary" 
                            block 
                            disabled={!selectedOrder || !scannedRFID}
                            onClick={() => handleAttach()}
                            className="shadow-premium py-2 font-weight-bold"
                        >
                            <i className="fas fa-link me-2" /> Hubungkan RFID
                        </Button>
                    </div>
                ) : (
                    <div className="mt-2 px-2 text-center">
                        <p className="text-sm text-muted mb-4 opacity-8 italic">
                            Gunakan reader atau cari manual dari daftar di sebelah kiri untuk melepaskan kartu.
                        </p>
                        <Button
                            color="danger"
                            block
                            disabled={!scannedRFID}
                            onClick={() => {
                                const found = linkedOrders.find((o) => o.rfid_code === scannedRFID);
                                if (found) handleDetach(found);
                                else showError("Tidak Ditemukan", `RFID "${scannedRFID}" tidak terhubung.`);
                            }}
                            className="shadow-premium py-2 font-weight-bold"
                        >
                            <i className="fas fa-unlink me-2" /> Putuskan Koneksi
                        </Button>
                    </div>
                )}
            </CardBody>
            <style>{`
                .pulse-success { animation: pulse-green 2s infinite; }
                @keyframes pulse-green {
                    0% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(45, 206, 137, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(45, 206, 137, 0); }
                }
            `}</style>
        </Card>
    );
};

export default RFIDControlPanel;

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge, FormGroup, Label, Input } from 'reactstrap';

const EmployeeRfidModal = ({ 
    isOpen, 
    toggle, 
    employee, 
    scannedRFID, 
    manualRfid, 
    setManualRfid, 
    mqttConnected, 
    loading, 
    onAttach 
}) => {
    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-satellite-dish fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Tautkan Kartu RFID</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Otentikasi Perangkat Keras</small>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="py-5 text-center px-4">
                {employee && (
                    <div className="mb-4">
                        <div className="avatar avatar-lg rounded-circle bg-primary text-white mb-3 shadow-premium mx-auto" style={{ width: '70px', height: '70px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                            <i className="fas fa-user" />
                        </div>
                        <h3 className="mb-1 text-dark font-weight-900" style={{ color: '#000' }}>{employee.nama}</h3>
                        <Badge color="neutral" pill className="border text-primary px-3 shadow-none font-weight-bold">
                            {employee.user?.email || "No Email"}
                        </Badge>
                    </div>
                )}

                <div 
                    className={`mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle transition-all ${scannedRFID ? 'bg-success-soft border-success' : 'bg-secondary'}`}
                    style={{ 
                        width: '140px', 
                        height: '140px', 
                        border: '4px dashed #ddd',
                        background: scannedRFID ? 'rgba(45, 206, 137, 0.1)' : '#f8f9fe',
                        borderColor: scannedRFID ? '#2dce89' : '#dee2e6'
                    }}
                >
                    <i className={`fas fa-id-card-alt fa-4x ${scannedRFID ? 'text-success' : 'text-muted opacity-3'}`} />
                </div>

                <div className="mb-4">
                    {scannedRFID ? (
                        <div className="animate-bounce">
                            <Badge color="success" className="h2 font-weight-900 px-4 py-2 shadow-premium font-monospace" style={{ letterSpacing: '2px', borderRadius: '10px' }}>
                                {scannedRFID}
                            </Badge>
                            <p className="text-success text-sm mt-2 font-weight-bold">
                                <i className="fas fa-check-circle mr-1" /> Kartu Terdeteksi!
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h4 className="font-weight-bold text-dark m-0">
                                {mqttConnected ? "Silakan Tap Kartu" : "Mencari Reader..."}
                            </h4>
                            <small className="text-muted font-weight-bold d-block mt-1">
                                Tempelkan kartu pada reader RFID (MQTT / USB)
                            </small>
                        </div>
                    )}
                </div>

                <hr className="my-4 opacity-1" />

                <FormGroup className="text-left">
                    <Label className="text-xs font-weight-bold text-muted ml-1 uppercase">Input Manual / USB Reader</Label>
                    <Input
                        placeholder="Tempel kartu ke USB reader atau ketik di sini..."
                        className="form-control-alternative border shadow-none font-weight-bold font-monospace"
                        value={manualRfid}
                        onChange={(e) => setManualRfid(e.target.value)}
                        disabled={loading}
                        style={{ fontSize: '1.1rem' }}
                    />
                </FormGroup>

                {!mqttConnected && (
                    <div className="alert bg-warning-soft border-warning text-dark py-2 small font-weight-bold mb-0">
                        <i className="fas fa-plug mr-2" />
                        MQTT Belum Terhubung (Gunakan Input Manual)
                    </div>
                )}
            </ModalBody>
            <ModalFooter className="bg-light border-0 p-4">
                <Button color="secondary" outline onClick={toggle} disabled={loading} className="px-4 border-0 font-weight-bold shadow-none">
                    Batal
                </Button>
                <Button 
                    color="primary" 
                    onClick={onAttach} 
                    disabled={loading || (!scannedRFID && !manualRfid.trim())} 
                    className="px-5 shadow-premium font-weight-bold rounded-lg py-2"
                >
                    {loading ? (
                        <><i className="fas fa-spinner fa-spin mr-2" />Menyimpan...</>
                    ) : (
                        <><i className="fas fa-link mr-2" />Tautkan RFID Sekarang</>
                    )}
                </Button>
            </ModalFooter>
            <style>{`
                .bg-success-soft { background: rgba(45, 206, 137, 0.08); }
                .bg-warning-soft { background: rgba(251, 99, 64, 0.08); }
                .font-monospace { font-family: 'Courier New', Courier, monospace; }
                .animate-bounce { animation: bounce 1s infinite; }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            `}</style>
        </Modal>
    );
};

export default EmployeeRfidModal;

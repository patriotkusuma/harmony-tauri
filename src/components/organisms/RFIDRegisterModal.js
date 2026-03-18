import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Badge } from 'reactstrap';

const TYPE_META = {
  basket: { color: "primary", icon: "fas fa-shopping-basket", label: "Basket" },
  machine: { color: "warning", icon: "fas fa-cog", label: "Mesin" },
  operator: { color: "info", icon: "fas fa-user-cog", label: "Operator" },
};

const RFIDRegisterModal = ({ isOpen, toggle, form, setForm, loading, onRegister, scannedUID }) => {
    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-plus-circle fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Registrasi Kartu Baru</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Inventarisasi Perangkat Keras</small>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="py-4">
                <p className="text-dark opacity-8 mb-4">
                    Pastikan kode RFID sudah sesuai dengan kartu fisik yang akan didaftarkan.
                </p>

                {scannedUID && (
                    <div className="bg-primary-soft-10 p-3 rounded-lg border border-primary mb-4 d-flex align-items-center">
                        <i className="fas fa-satellite-dish text-primary mr-3 fa-lg" />
                        <div>
                             <small className="text-primary font-weight-bold d-block text-uppercase" style={{ fontSize: '0.65rem' }}>Ditemukan via Reader:</small>
                             <strong className="text-primary h5 m-0 font-monospace">{scannedUID}</strong>
                        </div>
                    </div>
                )}

                <FormGroup className="mb-4">
                    <Label className="text-xs font-weight-bold text-muted ml-1 uppercase">KODE RFID KARTU</Label>
                    <Input
                        type="text"
                        placeholder="Scan kartu atau ketik kode manual..."
                        value={form.rfid_code}
                        onChange={(e) => setForm(p => ({ ...p, rfid_code: e.target.value }))}
                        className="form-control-alternative border-0 shadow-sm py-4 h3 font-weight-bold font-monospace"
                        style={{ borderRadius: '12px', fontSize: '1.2rem' }}
                        disabled={loading}
                    />
                </FormGroup>

                <div className="mb-4">
                    <Label className="text-xs font-weight-bold text-muted ml-1 uppercase">TIPE PENGGUNAAN</Label>
                    <div className="d-flex" style={{ gap: '10px' }}>
                        {['basket', 'machine', 'operator'].map((t) => (
                            <div 
                                key={t}
                                onClick={() => !loading && setForm(p => ({ ...p, type: t }))}
                                className={`flex-fill p-3 text-center cursor-pointer transition-all border rounded-lg ${form.type === t ? `border-${TYPE_META[t].color} bg-${TYPE_META[t].color}-soft shadow-sm` : 'bg-secondary'}`}
                                style={{ 
                                    borderWidth: '2px',
                                    background: form.type === t ? 'rgba(94,114,228,0.05)' : '#fafafa'
                                }}
                            >
                                <i className={`${TYPE_META[t].icon} fa-xl mb-2 d-block ${form.type === t ? `text-${TYPE_META[t].color}` : 'text-muted'}`} />
                                <span className={`font-weight-bold text-xs ${form.type === t ? `text-${TYPE_META[t].color}` : 'text-muted'}`}>
                                    {TYPE_META[t].label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-light p-3 rounded-lg border">
                    <small className="text-muted italic d-block">
                        <strong>Keterangan:</strong><br/>
                        • Basket: Untuk melacak keranjang pakaian pelanggan.<br/>
                        • Mesin: Untuk aktivasi proses pencucian.<br/>
                        • Operator: Untuk kartu absen/login staf.
                    </small>
                </div>
            </ModalBody>
            <ModalFooter className="border-0 bg-light p-3">
                <Button color="secondary" outline onClick={toggle} disabled={loading} className="px-4 font-weight-bold border-0 shadow-none">
                    Batal
                </Button>
                <Button color="primary" onClick={onRegister} disabled={loading || !form.rfid_code.trim()} className="px-5 shadow-premium font-weight-bold rounded-lg py-3">
                    {loading ? (
                        <><i className="fas fa-spinner fa-spin mr-2" />Menyimpan...</>
                    ) : (
                        <><i className="fas fa-save mr-2" />Simpan Kartu</>
                    )}
                </Button>
            </ModalFooter>
            <style>{`
                .bg-primary-soft-10 { background: rgba(94, 114, 228, 0.08); }
                .font-monospace { font-family: 'Courier New', Courier, monospace; letter-spacing: 1px; }
            `}</style>
        </Modal>
    );
};

export default RFIDRegisterModal;

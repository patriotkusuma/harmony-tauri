import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalBody, ModalFooter, 
    Button, Row, Col, FormGroup, Label, Input,
    Alert
} from 'reactstrap';
import moment from 'moment';

const InventoryAdjustModal = ({ 
    isOpen, 
    toggle, 
    item, 
    onSubmit, 
    loading 
}) => {
    const [form, setForm] = useState({
        movement_type: 'out',
        quantity: 1,
        movement_date: moment().format('YYYY-MM-DD'),
        reference_type: 'penggunaan',
        description: '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                movement_type: 'out',
                quantity: 1,
                movement_date: moment().format('YYYY-MM-DD'),
                reference_type: 'penggunaan',
                description: '',
            });
        }
    }, [isOpen]);

    const getHelperText = () => {
        switch(form.movement_type) {
            case 'in': return "Stok akan BERTAMBAH sebesar jumlah yang diinput.";
            case 'out': return "Stok akan BERKURANG. Gagal jika stok tidak cukup.";
            case 'adjustment': return "Stok DISET MANUAL (koreksi opname fisik).";
            default: return "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, id: item?.id });
    };

    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} centered contentClassName="border-0 shadow-premium modal-custom" style={{ borderRadius: '20px' }}>
            <div className="modal-header-custom d-flex align-items-center justify-content-between p-4 border-bottom-custom">
                <div className="d-flex align-items-center">
                    <div className="icon-box-info rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm">
                        <i className="fas fa-sliders-h text-info fa-lg" />
                    </div>
                    <div>
                        <h3 className="mb-0 font-weight-900 title-text">Sesuaikan Stok</h3>
                        <p className="text-muted mb-0 font-weight-bold" style={{ fontSize: '0.85rem' }}>{item?.nama}</p>
                    </div>
                </div>
                {!loading && (
                    <button type="button" className="close-btn-custom" onClick={toggle}>
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <ModalBody className="p-4 bg-modal-body">
                    <FormGroup>
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Jenis Pergerakan</Label>
                        <div className="d-flex p-2 bg-input-box rounded-lg border-input" style={{ gap: '15px' }}>
                            <div className="form-check custom-radio">
                                <input type="radio" id="typeIn" className="form-check-input" checked={form.movement_type === 'in'} onChange={() => setForm({...form, movement_type: 'in'})} />
                                <label className="form-check-label font-weight-bold title-text" htmlFor="typeIn">Masuk</label>
                            </div>
                            <div className="form-check custom-radio">
                                <input type="radio" id="typeOut" className="form-check-input" checked={form.movement_type === 'out'} onChange={() => setForm({...form, movement_type: 'out', reference_type: 'penggunaan'})} />
                                <label className="form-check-label font-weight-bold title-text" htmlFor="typeOut">Keluar</label>
                            </div>
                            <div className="form-check custom-radio">
                                <input type="radio" id="typeAdj" className="form-check-input" checked={form.movement_type === 'adjustment'} onChange={() => setForm({...form, movement_type: 'adjustment', reference_type: 'opname'})} />
                                <label className="form-check-label font-weight-bold title-text" htmlFor="typeAdj">Koreksi</label>
                            </div>
                        </div>
                    </FormGroup>

                    <Alert className="alert-soft-info py-2 px-3 border-0 small font-weight-bold mb-4">
                        <i className="fas fa-info-circle me-2" /> {getHelperText()}
                    </Alert>

                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Jumlah</Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
                                    className="custom-input font-weight-bold title-text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Tanggal</Label>
                                <Input
                                    required
                                    type="date"
                                    value={form.movement_date}
                                    onChange={(e) => setForm({ ...form, movement_date: e.target.value })}
                                    className="custom-input font-weight-bold title-text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Sumber / Alasan</Label>
                        <Input
                            required
                            type="select"
                            value={form.reference_type}
                            onChange={(e) => setForm({ ...form, reference_type: e.target.value })}
                            className="custom-input font-weight-bold title-text"
                        >
                            <option value="manual">Manual Input</option>
                            <option value="penggunaan">Penggunaan Harian</option>
                            <option value="opname">Opname Fisik</option>
                            <option value="rusak">Barang Rusak/Expired</option>
                        </Input>
                    </FormGroup>

                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Keterangan</Label>
                        <Input
                            required
                            type="textarea"
                            rows="2"
                            placeholder="Contoh: Stok beras untuk catering hari raya..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="custom-input font-weight-bold title-text"
                        />
                    </FormGroup>
                </ModalBody>
                
                <ModalFooter className="modal-footer-custom p-4 border-top-0">
                    <Button color="light" onClick={toggle} disabled={loading} className="px-4 font-weight-bold rounded-pill text-muted btn-light-custom shadow-none border-0">
                        Batal
                    </Button>
                    <Button color="info" type="submit" disabled={loading} className="px-5 shadow-sm font-weight-bold rounded-pill shadow-hover">
                        {loading ? <><i className="fas fa-spinner fa-spin me-2" />Menyimpan...</> : "Konfirmasi"}
                    </Button>
                </ModalFooter>
            </form>

            <style>{`
                /* Modal Core Styling */
                .modal-custom .modal-content { border-radius: 20px; overflow: hidden; background-color: #ffffff; border: none !important; }
                body.dark-mode .modal-custom .modal-content { background-color: #1e293b; color: #f8fafc; }
                
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.2), 0 5px 15px rgba(0,0,0,.17) !important; }
                
                /* Headers & Footers */
                .modal-header-custom { background-color: #ffffff; border-bottom: 1px solid #f1f3f9; }
                body.dark-mode .modal-header-custom { background-color: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.05); }
                
                .bg-modal-body { background-color: #ffffff; }
                body.dark-mode .bg-modal-body { background-color: #1e293b; }
                
                .modal-footer-custom { background-color: #f8f9fe; }
                body.dark-mode .modal-footer-custom { background-color: #0f172a; }

                /* Text & Icons */
                .title-text { color: #172b4d; }
                body.dark-mode .title-text { color: #f8fafc; }

                .icon-box-info { width: 48px; height: 48px; background-color: rgba(17, 205, 239, 0.1); }
                body.dark-mode .icon-box-info { background-color: rgba(56, 189, 248, 0.15); }
                body.dark-mode .icon-box-info i { color: #38bdf8 !important; }

                /* Close Button */
                .close-btn-custom { background: none; border: none; font-size: 1.25rem; color: #adb5bd; transition: color 0.2s; opacity: 0.7; }
                .close-btn-custom:hover { color: #f5365c; opacity: 1; }
                body.dark-mode .close-btn-custom { color: #94a3b8; }
                body.dark-mode .close-btn-custom:hover { color: #fb7185; }

                /* Form Inputs */
                .custom-input { 
                    background-color: #fcfdfe; 
                    border: 1px solid #e9ecef; 
                    border-radius: 12px; 
                    padding: 0.75rem 1rem;
                    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
                }
                .custom-input:focus { border-color: #11cdef; background-color: #fff; box-shadow: 0 0 0 3px rgba(17, 205, 239, 0.1); outline: none; }
                
                body.dark-mode .custom-input { 
                    background-color: #0f172a; 
                    border-color: rgba(255,255,255,0.1); 
                    color: #f8fafc;
                }
                body.dark-mode .custom-input:focus { 
                    border-color: #38bdf8; 
                    background-color: #1e293b; 
                    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); 
                }

                /* Container Boxes */
                .bg-input-box { background-color: #fcfdfe; }
                body.dark-mode .bg-input-box { background-color: #0f172a; }
                
                .border-input { border: 1px solid #e9ecef; }
                body.dark-mode .border-input { border: 1px solid rgba(255,255,255,0.1); }

                /* Custom Alerts */
                .alert-soft-info { background-color: rgba(17, 205, 239, 0.1); color: #11cdef; border-radius: 12px; }
                body.dark-mode .alert-soft-info { background-color: rgba(56, 189, 248, 0.15); color: #7dd3fc; }

                /* Buttons */
                .btn-light-custom { background-color: #f4f5f7 !important; color: #525f7f !important; border: 1px solid rgba(0,0,0,0.05) !important; }
                .btn-light-custom:hover { background-color: #e2e8f0 !important; color: #32325d !important; }
                
                body.dark-mode .btn-light-custom { background-color: rgba(255,255,255,0.05) !important; color: #cbd5e1 !important; border: 1px solid rgba(255,255,255,0.1) !important; }
                body.dark-mode .btn-light-custom:hover { background-color: rgba(255,255,255,0.1) !important; color: #f8fafc !important; }
                
                .shadow-hover { transition: transform 0.2s, box-shadow 0.2s; }
                .shadow-hover:hover { transform: translateY(-2px); box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08) !important; }

                /* Radios Customization */
                body.dark-mode .form-check-input { background-color: #1e293b; border-color: rgba(255,255,255,0.2); }
                body.dark-mode .form-check-input:checked { background-color: #38bdf8; border-color: #38bdf8; }
            `}</style>
        </Modal>
    );
};

export default InventoryAdjustModal;

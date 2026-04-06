import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalBody, ModalFooter, 
    Button, Row, Col, FormGroup, Label, Input,
    Alert
} from 'reactstrap';
import moment from 'moment';

const InventoryCreateModal = ({ 
    isOpen, 
    toggle, 
    references,
    item,
    onSubmit, 
    loading 
}) => {
    const isEdit = !!item?.uuid;
    const [form, setForm] = useState({
        nama: '',
        id_unit: '',
        qty: 0,
        cost_per_unit: 0,
        purchase_date: moment().format('YYYY-MM-DD'),
        description: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setForm({
                    nama: item.nama || '',
                    id_unit: item.id_unit || '',
                    qty: item.current_stock || 0,
                    cost_per_unit: item.cost_per_unit || 0,
                    purchase_date: item.purchase_date || moment().format('YYYY-MM-DD'),
                    description: item.description || '',
                });
            } else {
                setForm({
                    nama: '',
                    id_unit: '',
                    qty: 0,
                    cost_per_unit: 0,
                    purchase_date: moment().format('YYYY-MM-DD'),
                    description: '',
                });
            }
        }
    }, [isOpen, item]);

    const formatRupiah = (num) => {
        if (!num && num !== 0) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseNumeric = (str) => {
        return parseFloat(str.replace(/[^0-9]/g, '')) || 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} size="lg" centered contentClassName="border-0 shadow-premium modal-custom" style={{ borderRadius: '20px' }}>
            <div className="modal-header-custom d-flex align-items-center justify-content-between p-4 border-bottom-custom">
                <div className="d-flex align-items-center">
                    <div className="icon-box-primary rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm">
                        <i className="fas fa-box-open text-primary fa-lg" />
                    </div>
                    <div>
                        <h3 className="mb-0 font-weight-900 title-text">
                            {isEdit ? 'Ubah Metadata Inventory' : 'Tambah Barang Inventory'}
                        </h3>
                        <p className="text-muted mb-0 font-weight-bold" style={{ fontSize: '0.85rem' }}>
                            {isEdit ? `UUID: ${item.uuid}` : 'Pendaftaran Stok Manual'}
                        </p>
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
                    {!isEdit && (
                        <Alert className="alert-soft-warning py-2 px-3 border-0 small font-weight-bold mb-4">
                            <i className="fas fa-exclamation-triangle me-2" /> 
                            Gunakan fitur ini hanya untuk stok awal atau barang yang tidak melalui alur Pembelian.
                        </Alert>
                    )}

                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Nama Barang</Label>
                                <Input
                                    required
                                    placeholder="Masukkan nama barang..."
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="custom-input font-weight-bold title-text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Satuan</Label>
                                <Input
                                    required
                                    type="select"
                                    value={form.id_unit}
                                    onChange={(e) => setForm({ ...form, id_unit: e.target.value })}
                                    className="custom-input font-weight-bold title-text"
                                >
                                    <option value="">Pilih...</option>
                                    {references.units.map(u => (
                                        <option key={u.id} value={u.id}>{u.nama}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">
                                    {isEdit ? 'Stok Terakhir' : 'Stok Awal (Qty)'}
                                </Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    disabled={isEdit}
                                    value={form.qty}
                                    onChange={(e) => setForm({ ...form, qty: parseFloat(e.target.value) })}
                                    className="custom-input font-weight-bold title-text"
                                />
                                {isEdit && <small className="text-muted">Gunakan menu Penyesuaian untuk mengubah stok.</small>}
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Harga per Unit (Rp)</Label>
                                <Input
                                    required
                                    type="text"
                                    value={formatRupiah(form.cost_per_unit)}
                                    onChange={(e) => setForm({ ...form, cost_per_unit: parseNumeric(e.target.value) })}
                                    className="custom-input font-weight-bold title-text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Tanggal Perolehan</Label>
                                <Input
                                    required
                                    type="date"
                                    value={form.purchase_date}
                                    onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                                    className="custom-input font-weight-bold title-text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Keterangan / Catatan</Label>
                        <Input
                            type="textarea"
                            rows="2"
                            placeholder="Opsional..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="custom-input font-weight-bold title-text"
                        />
                    </FormGroup>
                </ModalBody>
                
                <ModalFooter className="modal-footer-custom p-4 border-top-0">
                    <Button color="light" outline onClick={toggle} disabled={loading} className="px-4 font-weight-bold rounded-pill text-muted btn-light-custom shadow-none border-0">
                        Batal
                    </Button>
                    <Button color="primary" type="submit" disabled={loading} className="px-5 shadow-sm font-weight-bold rounded-pill shadow-hover">
                        {loading ? <><i className="fas fa-spinner fa-spin me-2" />Menyimpan...</> : (isEdit ? "Update Metadata" : "Simpan Barang")}
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

                .icon-box-primary { width: 48px; height: 48px; background-color: rgba(94, 114, 228, 0.1); }
                body.dark-mode .icon-box-primary { background-color: rgba(129, 140, 248, 0.15); }

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
                .custom-input:focus { border-color: #5e72e4; background-color: #fff; box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.1); outline: none; }
                
                body.dark-mode .custom-input { 
                    background-color: #0f172a; 
                    border-color: rgba(255,255,255,0.1); 
                    color: #f8fafc;
                }
                body.dark-mode .custom-input:focus { 
                    border-color: #818cf8; 
                    background-color: #1e293b; 
                    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15); 
                }

                /* Custom Alerts */
                .alert-soft-warning { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; border-radius: 12px; }
                body.dark-mode .alert-soft-warning { background-color: rgba(249, 115, 22, 0.15); color: #fdba74; }

                /* Buttons */
                .btn-light-custom { background-color: #f4f5f7 !important; color: #525f7f !important; border: 1px solid rgba(0,0,0,0.05) !important; }
                .btn-light-custom:hover { background-color: #e2e8f0 !important; color: #32325d !important; }
                
                body.dark-mode .btn-light-custom { background-color: rgba(255,255,255,0.05) !important; color: #cbd5e1 !important; border: 1px solid rgba(255,255,255,0.1) !important; }
                body.dark-mode .btn-light-custom:hover { background-color: rgba(255,255,255,0.1) !important; color: #f8fafc !important; }
                
                .shadow-hover { transition: transform 0.2s, box-shadow 0.2s; }
                .shadow-hover:hover { transform: translateY(-2px); box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08) !important; }
            `}</style>
        </Modal>
    );
};

export default InventoryCreateModal;

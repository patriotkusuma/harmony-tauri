import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Button, Row, Col, FormGroup, Label, Input,
    Alert
} from 'reactstrap';
import moment from 'moment';

const InventoryCreateModal = ({ 
    isOpen, 
    toggle, 
    references,
    onSubmit, 
    loading 
}) => {
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
            setForm({
                nama: '',
                id_unit: '',
                qty: 0,
                cost_per_unit: 0,
                purchase_date: moment().format('YYYY-MM-DD'),
                description: '',
            });
        }
    }, [isOpen]);

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
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} size="lg" centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-box-open fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Tambah Barang Inventory</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Pendaftaran Stok Manual</small>
                    </div>
                </div>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className="py-4">
                    <Alert color="warning" className="py-2 px-3 border-0 small font-weight-bold opacity-8 mb-4">
                        <i className="fas fa-exclamation-triangle mr-2" /> 
                        Gunakan fitur ini hanya untuk stok awal atau barang yang tidak melalui alur Pembelian.
                    </Alert>

                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Nama Barang</Label>
                                <Input
                                    required
                                    placeholder="Masukkan nama barang..."
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Satuan</Label>
                                <Input
                                    required
                                    type="select"
                                    value={form.id_unit}
                                    onChange={(e) => setForm({ ...form, id_unit: e.target.value })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
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
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Stok Awal (Qty)</Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={form.qty}
                                    onChange={(e) => setForm({ ...form, qty: parseFloat(e.target.value) })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Harga per Unit (Rp)</Label>
                                <Input
                                    required
                                    type="text"
                                    value={formatRupiah(form.cost_per_unit)}
                                    onChange={(e) => setForm({ ...form, cost_per_unit: parseNumeric(e.target.value) })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Tanggal Perolehan</Label>
                                <Input
                                    required
                                    type="date"
                                    value={form.purchase_date}
                                    onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Keterangan / Catatan</Label>
                        <Input
                            type="textarea"
                            rows="2"
                            placeholder="..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="bg-white border-0 p-4">
                    <Button color="secondary" outline onClick={toggle} disabled={loading} className="px-4 border-0 font-weight-bold rounded-pill">
                        Batal
                    </Button>
                    <Button color="primary" type="submit" disabled={loading} className="px-5 shadow-premium font-weight-bold rounded-pill py-2">
                        {loading ? <><i className="fas fa-spinner fa-spin mr-2" />Menyimpan...</> : "Simpan Barang"}
                    </Button>
                </ModalFooter>
            </form>
            <style>{`
                 .shadow-premium { box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08); }
            `}</style>
        </Modal>
    );
};

export default InventoryCreateModal;

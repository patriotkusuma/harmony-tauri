import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalHeader, ModalBody, ModalFooter, 
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
            case 'adjustment': return "Stok akan DISET ke nilai yang diinput (untuk koreksi opname fisik).";
            default: return "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-info text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-sliders-h fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Sesuaikan Stok</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>{item?.nama}</small>
                    </div>
                </div>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className="py-4">
                    <FormGroup>
                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Jenis Pergerakan</Label>
                        <div className="d-flex p-2 bg-light rounded" style={{ gap: '15px' }}>
                            <div className="custom-control custom-radio">
                                <input type="radio" id="typeIn" className="custom-control-input" checked={form.movement_type === 'in'} onChange={() => setForm({...form, movement_type: 'in'})} />
                                <label className="custom-control-label font-weight-bold" htmlFor="typeIn">Masuk</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" id="typeOut" className="custom-control-input" checked={form.movement_type === 'out'} onChange={() => setForm({...form, movement_type: 'out', reference_type: 'penggunaan'})} />
                                <label className="custom-control-label font-weight-bold" htmlFor="typeOut">Keluar</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input type="radio" id="typeAdj" className="custom-control-input" checked={form.movement_type === 'adjustment'} onChange={() => setForm({...form, movement_type: 'adjustment', reference_type: 'opname'})} />
                                <label className="custom-control-label font-weight-bold" htmlFor="typeAdj">Koreksi</label>
                            </div>
                        </div>
                    </FormGroup>

                    <Alert color="info" className="py-2 px-3 border-0 small font-weight-bold opacity-8 mb-3">
                        <i className="fas fa-info-circle mr-2" /> {getHelperText()}
                    </Alert>

                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Jumlah</Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Tanggal</Label>
                                <Input
                                    required
                                    type="date"
                                    value={form.movement_date}
                                    onChange={(e) => setForm({ ...form, movement_date: e.target.value })}
                                    className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Sumber / Alasan</Label>
                        <Input
                            required
                            type="select"
                            value={form.reference_type}
                            onChange={(e) => setForm({ ...form, reference_type: e.target.value })}
                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                        >
                            <option value="manual">Manual Input</option>
                            <option value="penggunaan">Penggunaan Harian</option>
                            <option value="opname">Opname Fisik</option>
                            <option value="rusak">Barang Rusak/Expired</option>
                        </Input>
                    </FormGroup>

                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Keterangan</Label>
                        <Input
                            required
                            type="textarea"
                            rows="2"
                            placeholder="Contoh: Stok masuk untuk laundry sepatu, atau opname akhir bulan..."
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
                    <Button color="info" type="submit" disabled={loading} className="px-5 shadow-premium font-weight-bold rounded-pill py-2">
                        {loading ? <><i className="fas fa-spinner fa-spin mr-2" />Simpan...</> : "Konfirmasi Stok"}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default InventoryAdjustModal;

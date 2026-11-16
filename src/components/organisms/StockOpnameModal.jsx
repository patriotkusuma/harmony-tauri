import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col, Alert, InputGroup, InputGroupText } from 'reactstrap';
import Select from 'react-select';
import dayjs from 'dayjs';

const StockOpnameModal = ({ isOpen, toggle, onSubmit, inventories, loading }) => {
    const [form, setForm] = useState({
        id_inventory: '',
        physical_stock: '',
        audit_date: dayjs(), 
        notes: ''
    });

    const [selectedOption, setSelectedOption] = useState(null);

    const options = useMemo(() => {
        const data = inventories?.data || [];
        return data.map(item => ({
            value: item.uuid,
            label: `${item.nama} (Stok: ${item.current_stock})`,
            current_stock: item.current_stock,
            nama: item.nama
        }));
    }, [inventories]);

    useEffect(() => {
        if (!isOpen) {
            setForm({
                id_inventory: '',
                physical_stock: '',
                audit_date: dayjs(),
                notes: ''
            });
            setSelectedOption(null);
        }
    }, [isOpen]);

    const handleSelectChange = (opt) => {
        setSelectedOption(opt);
        setForm(prev => ({ ...prev, id_inventory: opt?.value || '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.id_inventory) return;
        
        const formattedDate = dayjs(form.audit_date).format('YYYY-MM-DD');
        
        onSubmit({
            ...form,
            physical_stock: parseFloat(form.physical_stock) || 0,
            audit_date: formattedDate
        });
        toggle();
    };

    const diff = selectedOption ? (parseFloat(form.physical_stock) || 0) - selectedOption.current_stock : 0;

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered contentClassName="border-0 shadow-lg rounded-xl">
            <ModalHeader toggle={toggle} className="border-bottom-0 pb-0">
                <span className="font-weight-900 h4">Mulai Stock Opname Baru</span>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className="py-4">
                    <FormGroup style={{ position: 'relative', zIndex: 1050 }}>
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Barang Yang Diaudit</Label>
                        <Select 
                            options={options}
                            value={selectedOption}
                            onChange={handleSelectChange}
                            placeholder="Cari & pilih item..."
                            isClearable
                            classNamePrefix="react-select"
                            className="rounded-lg"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: '10px',
                                    borderColor: '#eee',
                                    padding: '2px',
                                    boxShadow: 'none',
                                    '&:hover': { borderColor: '#5e72e4' }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 1100,
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                })
                            }}
                        />
                    </FormGroup>

                    {selectedOption && (
                        <div className="bg-light p-3 rounded-lg mb-4 text-center border-0 shadow-sm-inset">
                            <span className="text-muted text-xs font-weight-bold d-block text-uppercase ls-1 mb-1">Stok Tercatat (Sistem)</span>
                            <span className="h3 font-weight-900 text-primary mb-0">{selectedOption.current_stock}</span>
                        </div>
                    )}

                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Hitungan Fisik</Label>
                                <Input 
                                    required
                                    type="number"
                                    step="0.01"
                                    value={form.physical_stock}
                                    onChange={(e) => setForm({ ...form, physical_stock: e.target.value })}
                                    placeholder="Qty..."
                                    className="rounded-lg border-light py-2 font-weight-bold"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Tanggal Audit</Label>
                                <Input
                                    type="date"
                                    value={dayjs(form.audit_date).format('YYYY-MM-DD')}
                                    onChange={(e) => setForm(prev => ({ ...prev, audit_date: e.target.value ? dayjs(e.target.value) : dayjs() }))}
                                    className="rounded-lg border-light py-2 font-weight-bold"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup className="mb-0">
                        <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Catatan Audit</Label>
                        <Input 
                            type="textarea"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Contoh: Stok sesuai, atau Selisih rusak"
                            className="rounded-lg border-light"
                            rows="2"
                        />
                    </FormGroup>

                    {selectedOption && form.physical_stock !== '' && (
                        <Alert 
                            color={diff === 0 ? 'success' : 'warning'} 
                            className="rounded-lg border-0 shadow-sm mt-3 py-2 px-4 d-flex align-items-center"
                        >
                            <i className={`fas ${diff === 0 ? 'fa-check-circle text-success' : 'fa-exclamation-triangle'} me-3`} />
                            <div>
                                <span className="font-weight-bold">Estimasi Selisih: </span>
                                <span className="font-weight-900 ms-1">{diff > 0 ? `+${diff}` : diff}</span>
                                {diff < 0 && <span className="ms-2 small">(Ada Barang Hilang)</span>}
                                {diff > 0 && <span className="ms-2 small">(Ada Stok Tak Tercatat)</span>}
                                {diff === 0 && <span className="ms-2 small text-success">(Sinkron!)</span>}
                            </div>
                        </Alert>
                    )}
                </ModalBody>
                <ModalFooter className="border-top-0 pt-0">
                    <Button color="light" type="button" className="rounded-pill px-4 text-muted border-0 bg-transparent" onClick={toggle}>Batal</Button>
                    <Button color="primary" type="submit" className="rounded-pill px-5 shadow-sm font-weight-bold" disabled={loading || !form.id_inventory}>
                        {loading ? 'Ditunggu...' : 'Konfirmasi Audit'}
                    </Button>
                </ModalFooter>
            </form>
            <style>{`
                .rounded-xl { border-radius: 1.25rem !important; }
                .font-weight-900 { font-weight: 900 !important; }
                .ls-1 { letter-spacing: 1px !important; }
                .ls-05 { letter-spacing: 0.5px !important; }
                .shadow-sm-inset { box-shadow: inset 0 2px 4px rgba(0,0,0,0.03); }
                body.dark-mode input[type="date"] { color-scheme: dark; }
            `}</style>
        </Modal>
    );
};

export default StockOpnameModal;

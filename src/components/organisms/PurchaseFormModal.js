import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Button, Row, Col, FormGroup, Label, Input,
    Alert
} from 'reactstrap';
import moment from 'moment';

const PurchaseFormModal = ({ 
    isOpen, 
    toggle, 
    editMode, 
    initialData, 
    references, 
    onSubmit, 
    loading 
}) => {
    const [form, setForm] = useState({
        id_supplier: '',
        purchase_date: moment().format('YYYY-MM-DD'),
        item_name: '',
        quantity: 1,
        id_unit: '',
        total_amount: 0,
        type: 'Operasional',
        id_account_expense: '',
        id_account_cash: '',
        description: '',
        inventory_id: '', // NEW: Track selected existing inventory (renamed from id_inventory)
    });

    useEffect(() => {
        if (editMode && initialData) {
            setForm({
                id_supplier: initialData.id_supplier || '',
                purchase_date: initialData.purchase_date || moment().format('YYYY-MM-DD'),
                item_name: initialData.item_name || '',
                quantity: initialData.quantity || 1,
                id_unit: initialData.id_unit || '',
                total_amount: initialData.total_amount || 0,
                type: initialData.type || 'Operasional',
                id_account_expense: initialData.id_account_expense || '',
                id_account_cash: initialData.id_account_cash || '',
                description: initialData.description || '',
                inventory_id: initialData.inventory_id || initialData.id_inventory || '',
            });
        } else {
            setForm({
                id_supplier: '',
                purchase_date: moment().format('YYYY-MM-DD'),
                item_name: '',
                quantity: 1,
                id_unit: '',
                total_amount: 0,
                type: 'Operasional',
                id_account_expense: '',
                id_account_cash: '',
                description: '',
                inventory_id: '',
            });
        }
    }, [editMode, initialData, isOpen]);

    const formatRupiah = (num) => {
        if (!num && num !== 0) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseNumeric = (str) => {
        return parseFloat(str.replace(/[^0-9]/g, '')) || 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert "new" back to empty string for backend
        const submissionData = {
            ...form,
            inventory_id: form.inventory_id === 'new' ? '' : form.inventory_id
        };
        onSubmit(submissionData);
    };

    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} size="lg" centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-info text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className={`fas ${editMode ? 'fa-edit' : 'fa-shopping-cart'} fa-2x mr-3 text-white-50`} />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">
                            {editMode ? "Pembaruan Rekaman Pembelian" : "Catat Pembelian Baru"}
                        </h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Purchasing & Logistics Module</small>
                    </div>
                </div>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className="py-4 bg-secondary-soft">
                    <Row>
                        {/* Detail Barang */}
                        <Col md="12">
                            <h5 className="text-info text-uppercase ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.75rem' }}>Detail Item & Transaksi</h5>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Supplier / Vendor</Label>
                                        <Input
                                            required
                                            type="select"
                                            value={form.id_supplier}
                                            onChange={(e) => setForm({ ...form, id_supplier: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                        >
                                            <option value="">Pilih Supplier...</option>
                                            {references.suppliers.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Tanggal Pembelian</Label>
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

                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Nama Barang / Jasa</Label>
                                {form.type === 'Persediaan' ? (
                                    <Input
                                        required
                                        type="select"
                                        value={form.inventory_id}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            if (selectedId === "new") {
                                                setForm({ ...form, inventory_id: 'new', item_name: '' });
                                            } else if (selectedId === "") {
                                                setForm({ ...form, inventory_id: '', item_name: '' });
                                            } else {
                                                const item = references.inventory.find(i => String(i.uuid) === String(selectedId));
                                                setForm({ 
                                                    ...form, 
                                                    inventory_id: selectedId, 
                                                    item_name: item?.nama || '',
                                                    id_unit: item?.id_unit || form.id_unit
                                                });
                                            }
                                        }}
                                        className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark text-uppercase"
                                    >
                                        <option value="">-- Pilih Barang Stok Exist --</option>
                                        {references.inventory.map(i => (
                                            <option key={i.uuid} value={i.uuid}>{i.nama} (Stok: {i.current_stock})</option>
                                        ))}
                                        <option value="new">+ Tambah Barang Baru</option>
                                    </Input>
                                ) : (
                                    <Input
                                        required
                                        placeholder="Contoh: Deterjen 20L, Sewa Ruko, Service AC"
                                        value={form.item_name}
                                        onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                                        className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                    />
                                )}
                                {form.type === 'Persediaan' && (form.inventory_id === 'new' || !form.inventory_id) && (
                                    <div className="mt-2">
                                        <Input
                                            required
                                            placeholder="Masukkan nama barang inventory baru..."
                                            value={form.item_name}
                                            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark italic"
                                        />
                                    </div>
                                )}
                            </FormGroup>

                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Qty (Jumlah)</Label>
                                        <Input
                                            required
                                            type="number"
                                            value={form.quantity}
                                            onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
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
                                            <option value="">Pilih Satuan...</option>
                                            {references.units.map(u => (
                                                <option key={u.id} value={u.id}>{u.nama}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Total Amount (Rp)</Label>
                                        <Input
                                            required
                                            type="text"
                                            value={formatRupiah(form.total_amount)}
                                            onChange={(e) => setForm({ ...form, total_amount: parseNumeric(e.target.value) })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                            placeholder="0"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        {/* Akuntansi & Tipe */}
                        <Col md="12" className="mt-3">
                            <h5 className="text-info text-uppercase ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.75rem' }}>Klasifikasi & Akuntansi</h5>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Tipe Pembelian</Label>
                                        <Input
                                            required
                                            type="select"
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                        >
                                            <option value="Operasional">Operasional</option>
                                            <option value="Investasi">Investasi</option>
                                            <option value="Persediaan">Persediaan</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </Input>
                                        {form.type === 'Persediaan' && (
                                            <Alert color="info" className="py-1 px-2 mt-2 border-0 small font-weight-bold opacity-8">
                                                <i className="fas fa-info-circle mr-1" /> Item ini akan menambah stok Inventory secara otomatis.
                                            </Alert>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Catatan Tambahan</Label>
                                        <Input
                                            type="textarea"
                                            rows="2"
                                            placeholder="..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Sumber Dana (Kredit)</Label>
                                        <Input
                                            required
                                            type="select"
                                            value={form.id_account_cash}
                                            onChange={(e) => setForm({ ...form, id_account_cash: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                        >
                                            <option value="">Pilih Akun Kas/Bank...</option>
                                            {references.assetAccounts.map(a => (
                                                <option key={a.id} value={a.id}>{a.account_name}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1 text-uppercase">Pos Pengeluaran (Debit)</Label>
                                        <Input
                                            required
                                            type="select"
                                            value={form.id_account_expense}
                                            onChange={(e) => setForm({ ...form, id_account_expense: e.target.value })}
                                            className="form-control-alternative border-0 shadow-sm font-weight-bold text-dark"
                                        >
                                            <option value="">Pilih Akun Beban/Persediaan...</option>
                                            {references.expenseAccounts.map(a => (
                                                <option key={a.id} value={a.id}>{a.account_name}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="bg-white border-0 p-4">
                    <Button color="secondary" outline onClick={toggle} disabled={loading} className="px-4 border-0 font-weight-bold shadow-none rounded-pill">
                        Batal
                    </Button>
                    <Button color="info" type="submit" disabled={loading} className="px-5 shadow-premium font-weight-bold rounded-pill py-2">
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin mr-2" />Memproses...</>
                        ) : (
                            <><i className={`fas ${editMode ? 'fa-save' : 'fa-check-circle'} mr-2`} />{editMode ? "Simpan Perubahan" : "Konfirmasi Pembelian"}</>
                        )}
                    </Button>
                </ModalFooter>
            </form>
            <style>{`
                .bg-secondary-soft { background-color: #f7f9fe; }
                .shadow-premium { box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08); }
            `}</style>
        </Modal>
    );
};

export default PurchaseFormModal;

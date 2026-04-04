import React, { useState } from "react";
import { Table, Spinner, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import moment from "moment";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const WithdrawalTab = ({ data, loading, accounts, onCreateWithdrawal, onDeleteWithdrawal }) => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        amount: "",
        date: moment().format("YYYY-MM-DD"),
        description: "",
        id_account: "", 
    });
    const [submitting, setSubmitting] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
        if (!showModal) {
            setForm({ amount: "", date: moment().format("YYYY-MM-DD"), description: "", id_account: "" });
        }
    };

    const handleSubmit = async () => {
        if (!form.amount || parseFloat(form.amount) <= 0 || !form.id_account) {
            alert("Harap isi jumlah dan pilih sumber dana.");
            return;
        }
        setSubmitting(true);
        await onCreateWithdrawal({
            amount: parseFloat(form.amount),
            date: form.date,
            description: form.description || "Penarikan modal pemilik (Prive)",
            id_account: form.id_account,
        });
        setSubmitting(false);
        toggleModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus prive ini? Saldo akan dikembalikan.")) {
            await onDeleteWithdrawal(id);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat riwayat prive...</p>
            </div>
        );
    }

    return (
        <div className="withdrawal-tab">
            {/* Summary Card */}
            <div className="withdrawal-summary-card p-4 rounded-xl mb-5 d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="text-uppercase font-weight-bold mb-1 text-white" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.8 }}>
                        Total Prive Periode Ini
                    </h6>
                    <h2 className="mb-0 font-weight-900 text-white" style={{ fontSize: '2rem' }}>
                        {formatCurrency(data.total_withdrawn || 0)}
                    </h2>
                    <small className="text-white" style={{ opacity: 0.7 }}>
                        {data.count || 0} transaksi prive tercatat
                    </small>
                </div>
                <Button
                    color="light"
                    className="rounded-pill px-4 font-weight-bold d-flex align-items-center shadow-sm"
                    onClick={toggleModal}
                    style={{ fontSize: '0.85rem', gap: '8px' }}
                >
                    <i className="fas fa-plus-circle" />
                    Catat Prive Baru
                </Button>
            </div>

            {/* Data Table */}
            <div className="table-responsive">
                <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                    <thead className="thead-light-soft">
                        <tr>
                            <th className="ps-4" style={{ width: '15%' }}>Tanggal</th>
                            <th style={{ width: '25%' }}>Keterangan</th>
                            <th style={{ width: '15%' }}>Sumber Dana</th>
                            <th className="text-end" style={{ width: '25%' }}>Jumlah</th>
                            <th className="text-center pe-4" style={{ width: '20%' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.items || []).length > 0 ? (data.items || []).map((item) => (
                            <tr key={item.id} className="acct-row">
                                <td className="ps-4">
                                    <div className="d-flex align-items-center">
                                        <div className="date-badge me-3">
                                            <span className="date-day">{moment(item.transaction_date).format("DD")}</span>
                                            <span className="date-month">{moment(item.transaction_date).format("MMM")}</span>
                                        </div>
                                        <small className="text-muted">{moment(item.transaction_date).format("YYYY")}</small>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="withdrawal-icon me-3">
                                            <i className="fas fa-hand-holding-usd" />
                                        </div>
                                        <div>
                                            <span className="font-weight-bold text-dark d-block">
                                                {item.description || "Penarikan modal pemilik"}
                                            </span>
                                            <small className="text-muted">ID: {item.id?.slice(0, 8)}...</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <Badge color="success" outline className="rounded-pill px-2">
                                        {item.account_name || "Kas Tunai"}
                                    </Badge>
                                </td>
                                <td className="text-end">
                                    <span className="font-weight-900 text-danger" style={{ fontSize: '1rem' }}>
                                        - {formatCurrency(item.amount)}
                                    </span>
                                </td>
                                <td className="text-center pe-4">
                                    <Button
                                        color="danger"
                                        size="sm"
                                        outline
                                        className="rounded-pill px-3 font-weight-bold"
                                        onClick={() => handleDelete(item.id)}
                                        title="Hapus & kembalikan saldo"
                                    >
                                        <i className="fas fa-undo me-1" /> Revert
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-5">
                                    <i className="fas fa-hand-holding-usd fs-1 d-block mb-3" style={{ opacity: 0.2 }} />
                                    <p className="mb-1 font-weight-bold">Belum ada prive tercatat</p>
                                    <small>Klik "Catat Prive Baru" untuk mencatat penarikan modal.</small>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {(data.items || []).length > 0 && (
                        <tfoot>
                            <tr className="total-row">
                                <td colSpan="2" className="ps-4 font-weight-900 text-dark text-uppercase" style={{ fontSize: '0.85rem' }}>
                                    Total Prive ({data.count} transaksi)
                                </td>
                                <td className="text-end">
                                    <span className="font-weight-900 fs-5 text-danger">{formatCurrency(data.total_withdrawn)}</span>
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    )}
                </Table>
            </div>

            {/* Create Withdrawal Modal */}
            <Modal isOpen={showModal} toggle={toggleModal} centered className="withdrawal-modal">
                <ModalHeader toggle={toggleModal} className="border-0 pb-0">
                    <div className="d-flex align-items-center">
                        <div className="modal-icon me-3">
                            <i className="fas fa-hand-holding-usd" />
                        </div>
                        <div>
                            <h5 className="mb-0 font-weight-bold">Catat Prive</h5>
                            <small className="text-muted">Penarikan modal pemilik</small>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="pt-2">
                    <div className="info-alert p-3 rounded-lg mb-4">
                        <i className="fas fa-info-circle text-info me-2" />
                        <small className="text-muted">
                            Pencatatan prive otomatis membuat jurnal: <strong>Debit Prive</strong> dan <strong>Kredit akun pilihan Anda</strong>.
                        </small>
                    </div>
                    <FormGroup>
                        <Label className="font-weight-bold text-dark small">Sumber Dana (Akun) *</Label>
                        <Input
                            type="select"
                            value={form.id_account}
                            onChange={(e) => setForm({ ...form, id_account: e.target.value })}
                            className="rounded-lg shadow-sm"
                        >
                            <option value="">-- Pilih Akun (Kas/Bank) --</option>
                            {(accounts || [])
                                .filter(acc => acc.account_type === "Assets")
                                .map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.account_name} ({formatCurrency(acc.balance)})
                                    </option>
                                ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-weight-bold text-dark small">Tanggal</Label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-weight-bold text-dark small">Jumlah Penarikan *</Label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 font-weight-bold">Rp</span>
                            <Input
                                type="number"
                                placeholder="0"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                className="border-start-0 font-weight-bold"
                                style={{ fontSize: '1.2rem' }}
                                min="1"
                                autoFocus
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-weight-bold text-dark small">Keterangan</Label>
                        <Input
                            type="textarea"
                            placeholder="Contoh: Biaya keperluan pribadi pemilik"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={2}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="border-0 pt-0">
                    <Button color="secondary" outline className="rounded-pill px-4" onClick={toggleModal}>
                        Batal
                    </Button>
                    <Button
                        color="danger"
                        className="rounded-pill px-4 font-weight-bold"
                        onClick={handleSubmit}
                        disabled={submitting || !form.amount || parseFloat(form.amount) <= 0}
                    >
                        {submitting ? <><Spinner size="sm" className="me-2" /> Menyimpan...</> : <><i className="fas fa-check me-2" /> Simpan Prive</>}
                    </Button>
                </ModalFooter>
            </Modal>

            <style>{`
                .withdrawal-summary-card {
                    background: linear-gradient(135deg, #b91c1c, #ef4444);
                    position: relative;
                    overflow: hidden;
                }
                .withdrawal-summary-card::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 50%;
                }
                .date-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 4px 10px;
                    min-width: 44px;
                }
                .date-day { font-weight: 900; font-size: 1rem; color: #1e293b; line-height: 1.1; }
                .date-month { font-size: 0.65rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
                .withdrawal-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    flex-shrink: 0;
                    font-size: 0.85rem;
                }
                .modal-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #ef4444, #b91c1c);
                    color: white;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                }
                .info-alert {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                }
                .thead-light-soft th {
                    background: #f8fafc; color: #8898aa; font-size: 0.7rem;
                    text-transform: uppercase; letter-spacing: 0.5px; border-top: none;
                    font-weight: 700; padding: 12px 16px;
                }
                .acct-row td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .acct-row:hover { background: #f8fafc; }
                .total-row td { padding: 16px; border-top: 2px solid #e2e8f0; background: #f8fafc; }
                .rounded-xl { border-radius: 12px; }
                .rounded-lg { border-radius: 10px; }
                .font-weight-900 { font-weight: 900; }
            `}</style>
        </div>
    );
};

export default WithdrawalTab;

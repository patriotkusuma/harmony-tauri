import React, { useState } from "react";
import {
    Row, Col, Card, CardHeader, CardBody,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input,
    Table, Badge, Spinner
} from "reactstrap";
import moment from "moment";

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

const TransferTab = ({ data, loading, onCreateTransfer, accounts }) => {
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({
        id_source_account: "",
        id_target_account: "",
        amount: "",
        date: moment().format("YYYY-MM-DD"),
        description: ""
    });

    const toggle = () => setModal(!modal);

    const handleSubmit = () => {
        if (!form.id_source_account || !form.id_target_account || !form.amount) return;
        onCreateTransfer({ ...form, amount: parseFloat(form.amount) });
        toggle();
        setForm({
            id_source_account: "",
            id_target_account: "",
            amount: "",
            date: moment().format("YYYY-MM-DD"),
            description: ""
        });
    };

    const bankAccounts = (accounts || []).filter(acc => acc.account_type === "Assets");
    const items = data?.items || [];
    const totalMoved = data?.total_moved || 0;
    const count = data?.count || 0;

    return (
        <div className="transfer-tab">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h3 className="mb-1">Pemindahan Dana Antar Akun</h3>
                    <p className="text-muted small mb-0">
                        Rekam pemindahan saldo antar rekening kas atau bank.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button color="success" onClick={toggle} className="rounded-pill shadow-sm px-4">
                        <i className="fas fa-exchange-alt me-2" /> Transfer Baru
                    </Button>
                </Col>
            </Row>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col md="4">
                    <Card className="border-0 shadow-sm rounded-xl" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                        <CardBody className="text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-white-50 small text-uppercase ls-1">Total Dipindahkan</div>
                                    <div className="h4 mb-0 font-weight-bold">{fmt(totalMoved)}</div>
                                </div>
                                <i className="fas fa-exchange-alt fa-2x text-white-50" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="border-0 shadow-sm rounded-xl">
                        <CardBody className="py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small text-uppercase ls-1">Jumlah Transaksi</div>
                                    <div className="h4 mb-0 font-weight-bold text-dark">{count}</div>
                                </div>
                                <i className="fas fa-list-ul fa-2x text-muted" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="border-0 shadow-sm rounded-xl">
                        <CardBody className="py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small text-uppercase ls-1">Rata-rata per TX</div>
                                    <div className="h4 mb-0 font-weight-bold text-dark">
                                        {fmt(count > 0 ? totalMoved / count : 0)}
                                    </div>
                                </div>
                                <i className="fas fa-calculator fa-2x text-muted" />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Transfer History Table */}
            <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardHeader className="bg-transparent border-0 py-3 px-4">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-history text-success me-2" />
                        <h5 className="mb-0 font-weight-bold">Riwayat Pemindahan</h5>
                        {count > 0 && (
                            <Badge color="success" pill className="ms-2">{count}</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner color="success" />
                            <p className="text-muted mt-2 small">Memuat data...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="fas fa-exchange-alt fa-3x mb-3 d-block" style={{ color: "#d1fae5" }} />
                            <p className="mb-1 font-weight-bold">Belum ada transfer</p>
                            <p className="small">Klik "Transfer Baru" untuk mencatat pemindahan dana.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table className="mb-0 table-hover align-middle" size="sm">
                                <thead style={{ background: "#f8fffe" }}>
                                    <tr>
                                        <th className="px-4 py-3 text-uppercase small text-muted border-0">Tanggal</th>
                                        <th className="py-3 text-uppercase small text-muted border-0">Dari Akun</th>
                                        <th className="py-3 text-uppercase small text-muted border-0">Ke Akun</th>
                                        <th className="py-3 text-uppercase small text-muted border-0">Keterangan</th>
                                        <th className="py-3 text-uppercase small text-muted border-0 text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => (
                                        <tr key={item.id || i}>
                                            <td className="px-4 py-3">
                                                <span className="font-weight-bold text-dark small">
                                                    {moment(item.transaction_date).format("DD MMM YYYY")}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="icon-sm bg-danger-soft text-danger rounded-circle me-2">
                                                        <i className="fas fa-arrow-up" style={{ fontSize: "10px" }} />
                                                    </div>
                                                    <span className="small font-weight-bold">
                                                        {item.source_account_name || item.source_account_id || "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="icon-sm bg-success-soft text-success rounded-circle me-2">
                                                        <i className="fas fa-arrow-down" style={{ fontSize: "10px" }} />
                                                    </div>
                                                    <span className="small font-weight-bold">
                                                        {item.target_account_name || item.target_account_id || "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className="text-muted small">{item.description || "-"}</span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <span className="font-weight-bold text-success">
                                                    {fmt(item.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Create Transfer Modal */}
            <Modal isOpen={modal} toggle={toggle} centered size="md">
                <ModalHeader toggle={toggle} className="border-0 pb-0">
                    <i className="fas fa-exchange-alt text-success me-2" />
                    Pemindahan Dana Baru
                </ModalHeader>
                <ModalBody className="py-4">
                    <Form>
                        <FormGroup>
                            <Label className="small font-weight-bold text-uppercase">Akun Sumber (Dikeluarkan dari)</Label>
                            <Input
                                type="select"
                                value={form.id_source_account}
                                onChange={e => setForm({ ...form, id_source_account: e.target.value })}
                                className="rounded-lg"
                            >
                                <option value="">Pilih Akun Sumber...</option>
                                {bankAccounts.map(acc => (
                                    <option key={acc.id_account} value={acc.id_account}>
                                        {acc.account_name} ({fmt(acc.balance)})
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label className="small font-weight-bold text-uppercase">Akun Tujuan (Masuk ke)</Label>
                            <Input
                                type="select"
                                value={form.id_target_account}
                                onChange={e => setForm({ ...form, id_target_account: e.target.value })}
                                className="rounded-lg"
                            >
                                <option value="">Pilih Akun Tujuan...</option>
                                {bankAccounts
                                    .filter(acc => acc.id_account !== form.id_source_account)
                                    .map(acc => (
                                        <option key={acc.id_account} value={acc.id_account}>
                                            {acc.account_name} ({fmt(acc.balance)})
                                        </option>
                                    ))}
                            </Input>
                        </FormGroup>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="small font-weight-bold text-uppercase">Nominal</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="small font-weight-bold text-uppercase">Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label className="small font-weight-bold text-uppercase">Keterangan</Label>
                            <Input
                                type="textarea"
                                rows="2"
                                placeholder="Contoh: Tarik Dana dari Dana Business ke Kas Operasional"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="rounded-lg"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="border-0 pt-0">
                    <Button color="link" onClick={toggle} className="text-muted">Batal</Button>
                    <Button
                        color="success"
                        onClick={handleSubmit}
                        disabled={!form.id_source_account || !form.id_target_account || !form.amount}
                        className="px-4 rounded-pill shadow-sm"
                    >
                        <i className="fas fa-exchange-alt me-2" />
                        Proses Transfer
                    </Button>
                </ModalFooter>
            </Modal>

            <style>{`
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .bg-danger-soft  { background: rgba(239, 68, 68, 0.1); }
                .icon-sm {
                    width: 24px; height: 24px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .rounded-xl { border-radius: 12px; }
                .rounded-lg  { border-radius: 10px; }
                .ls-1 { letter-spacing: 0.5px; }
                .text-white-50 { color: rgba(255,255,255,0.6) !important; }
                .table-hover tbody tr:hover { background: rgba(16, 185, 129, 0.04); }
            `}</style>
        </div>
    );
};

export default TransferTab;

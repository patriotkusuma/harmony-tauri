import React, { useState } from "react";
import {
    Row, Col, Card, CardHeader, CardBody, 
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input,
    Table, Badge
} from "reactstrap";
import moment from "moment";

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
        onCreateTransfer({
            ...form,
            amount: parseFloat(form.amount)
        });
        toggle();
        setForm({
            id_source_account: "",
            id_target_account: "",
            amount: "",
            date: moment().format("YYYY-MM-DD"),
            description: ""
        });
    };

    // Filter only asset accounts for source and target
    const bankAccounts = accounts.filter(acc => acc.account_type === "Assets");

    return (
        <div className="transfer-tab">
            <Row className="mb-4">
                <Col md="8">
                    <h3 className="mb-0">Pemindahan Dana Antar Akun</h3>
                    <p className="text-muted small">Lakukan pemindahan (transfer) saldo antara dua akun kas atau bank.</p>
                </Col>
                <Col md="4" className="text-end">
                    <Button color="success" onClick={toggle} className="rounded-pill shadow-sm px-4">
                        <i className="fas fa-exchange-alt me-2" /> Baru
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                <CardBody className="p-0">
                    {/* Simplified for now, we only show instructions or recent? 
                        In this architecture, usually we show instructions or a mini summary.
                        Since we refresh summary after transfer, the user sees updated balances in 'Summary' tab.
                    */}
                    <div className="p-5 text-center bg-light">
                        <div className="icon-circle bg-success-soft text-success mb-3 mx-auto">
                            <i className="fas fa-university fa-2x" />
                        </div>
                        <h4>Siap untuk Rekonsiliasi</h4>
                        <p className="text-muted mb-0">Klik tombol "Baru" untuk mencatat pemindahan dana riil.</p>
                    </div>
                </CardBody>
            </Card>

            <Modal isOpen={modal} toggle={toggle} centered size="md" className="glass-modal">
                <ModalHeader toggle={toggle} className="border-0 pb-0">Pemindahan Dana Baru</ModalHeader>
                <ModalBody className="py-4">
                    <Form>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label className="small font-weight-bold text-uppercase">Akun Sumber (Dikeluarkan dari)</Label>
                                    <Input 
                                        type="select" 
                                        value={form.id_source_account}
                                        onChange={e => setForm({...form, id_source_account: e.target.value})}
                                        className="rounded-lg"
                                    >
                                        <option value="">Pilih Akun Sumber...</option>
                                        {bankAccounts.map(acc => (
                                            <option key={acc.id_account} value={acc.id_account}>
                                                {acc.account_name} (Rp {acc.current_balance?.toLocaleString()})
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label className="small font-weight-bold text-uppercase">Akun Tujuan (Masuk ke)</Label>
                                    <Input 
                                        type="select" 
                                        value={form.id_target_account}
                                        onChange={e => setForm({...form, id_target_account: e.target.value})}
                                        className="rounded-lg"
                                    >
                                        <option value="">Pilih Akun Tujuan...</option>
                                        {bankAccounts.map(acc => (
                                            <option key={acc.id_account} value={acc.id_account}>
                                                {acc.account_name} (Rp {acc.current_balance?.toLocaleString()})
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="small font-weight-bold text-uppercase">Nominal</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0"
                                        value={form.amount}
                                        onChange={e => setForm({...form, amount: e.target.value})}
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
                                        onChange={e => setForm({...form, date: e.target.value})}
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
                                placeholder="Contoh: Pemindahan dari Dana QRIS ke Kas Tunai"
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="rounded-lg"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="border-0 pt-0">
                    <Button color="link" onClick={toggle} className="text-muted">Batal</Button>
                    <Button color="success" onClick={handleSubmit} className="px-4 rounded-pill shadow-sm">
                        Proses Transfer
                    </Button>
                </ModalFooter>
            </Modal>

            <style>{`
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .icon-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .rounded-lg { border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default TransferTab;

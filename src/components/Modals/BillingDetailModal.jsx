import React, { useState, useEffect, useCallback } from "react";
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Row, Col, Badge, Button, Spinner, Input, InputGroup, InputGroupText,
    Table, Alert
} from "reactstrap";
import axios from "services/axios-instance";
import { toast } from "react-toastify";
import RupiahFormater from "utils/RupiahFormater";
import moment from "moment";

const STATUS_MAP = {
    PAID:    { color: "success", label: "LUNAS" },
    PARTIAL: { color: "warning", label: "DP / CICIL" },
    UNPAID:  { color: "danger",  label: "HUTANG" },
    MERGED:  { color: "info",    label: "DIGABUNG" },
};

const ORDER_STATUS_MAP = {
    "Lunas":       { color: "success", label: "Lunas" },
    "Belum Lunas": { color: "danger",  label: "Belum Lunas" },
};

const formatRupiah = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

const BillingDetailModal = ({ billId, isOpen, toggle, onPaymentSuccess }) => {
    const [detail, setDetail]       = useState(null);
    const [loading, setLoading]     = useState(false);
    const [paying, setPaying]       = useState(false);

    // Pay form state
    const [nominal, setNominal]     = useState("");
    const [method, setMethod]       = useState("cash");

    // ── Fetch detail bill ──────────────────────────────────────────────────────
    const fetchDetail = useCallback(async () => {
        if (!billId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/v2/bills/${billId}`);
            setDetail(res.data);
        } catch (err) {
            toast.error("Gagal mengambil detail bill: " + (err.response?.data?.error || err.message));
            toggle();
        } finally {
            setLoading(false);
        }
    }, [billId, toggle]);

    useEffect(() => {
        if (isOpen && billId) {
            setNominal("");
            setMethod("cash");
            fetchDetail();
        }
    }, [isOpen, billId, fetchDetail]);

    // ── Process payment ────────────────────────────────────────────────────────
    const handlePay = async () => {
        const nominalNum = parseFloat(nominal);
        if (!nominalNum || nominalNum <= 0) {
            toast.error("Nominal pembayaran harus lebih dari 0");
            return;
        }
        setPaying(true);
        try {
            await axios.post(`/api/v2/bills/${billId}/pay`, {
                nominal: nominalNum,
                method,
            });
            toast.success("Pembayaran berhasil diproses!");
            await fetchDetail();          // refresh detail
            setNominal("");
            if (onPaymentSuccess) onPaymentSuccess();
        } catch (err) {
            toast.error("Gagal bayar: " + (err.response?.data?.error || err.message));
        } finally {
            setPaying(false);;
        }
    };

    // ── Derived values ─────────────────────────────────────────────────────────
    const totalHarga = detail?.orders?.reduce((s, o) => s + (o.total_harga || 0), 0) ?? 0;
    const totalPaid  = detail?.orders?.reduce((s, o) => s + (o.paid  || 0), 0) ?? 0;
    const sisaBayar  = Math.max(totalHarga - totalPaid, 0);
    const statusInfo = STATUS_MAP[detail?.status] || { color: "secondary", label: detail?.status };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" centered
            contentClassName="border-0 shadow-lg rounded-xl overflow-hidden">
            {/* ── HEADER ────────────────────────────────────────────────────────── */}
            <ModalHeader toggle={toggle}
                className="bg-gradient-info text-white border-0 px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="bill-modal-icon">
                        <i className="fas fa-file-invoice-dollar fa-lg text-white" />
                    </div>
                    <div>
                        <h5 className="mb-0 text-white font-weight-bold">
                            Detail Tagihan &nbsp;
                            <span className="opacity-8">#{detail?.id}</span>
                        </h5>
                        <small className="opacity-7">{detail?.customer?.nama}</small>
                    </div>
                    <Badge color={statusInfo.color} pill className="ms-2 px-3 py-2">
                        {statusInfo.label}
                    </Badge>
                </div>
            </ModalHeader>

            <ModalBody className="p-0">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="mt-3 text-muted">Memuat detail tagihan...</p>
                    </div>
                ) : detail ? (
                    <>
                        {/* ── INFO PELANGGAN ────────────────────────────────────── */}
                        <div className="px-4 pt-4 pb-3 border-bottom bg-light">
                            <Row className="g-3 align-items-center">
                                <Col xs="auto">
                                    <div className="customer-avatar bg-gradient-info text-white">
                                        {(detail.customer?.nama || "?").charAt(0).toUpperCase()}
                                    </div>
                                </Col>
                                <Col>
                                    <h5 className="mb-0 font-weight-bold">{detail.customer?.nama}</h5>
                                    <small className="text-muted">
                                        <i className="fab fa-whatsapp text-success me-1" />
                                        {detail.customer?.telpon || "Tidak ada nomor"}
                                    </small>
                                </Col>
                                <Col xs="auto" className="text-end">
                                    <small className="text-muted d-block">Dibuat</small>
                                    <strong>{moment(detail.created_at).format("DD MMM YYYY, HH:mm")}</strong>
                                </Col>
                            </Row>
                        </div>

                        {/* ── SUMMARY KEUANGAN ──────────────────────────────────── */}
                        <div className="px-4 py-3 border-bottom">
                            <Row className="text-center g-2">
                                <Col>
                                    <div className="summary-card">
                                        <small className="text-muted text-uppercase fw-bold">Total Tagihan</small>
                                        <div className="h5 font-weight-bold text-dark mb-0">{formatRupiah(totalHarga)}</div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="summary-card">
                                        <small className="text-muted text-uppercase fw-bold">Sudah Dibayar</small>
                                        <div className="h5 font-weight-bold text-success mb-0">{formatRupiah(totalPaid)}</div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className={`summary-card ${sisaBayar > 0 ? 'summary-card--danger' : 'summary-card--success'}`}>
                                        <small className="text-muted text-uppercase fw-bold">Sisa Tagihan</small>
                                        <div className={`h5 font-weight-bold mb-0 ${sisaBayar > 0 ? 'text-danger' : 'text-success'}`}>
                                            {formatRupiah(sisaBayar)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* ── DAFTAR ORDER ─────────────────────────────────────── */}
                        <div className="px-4 pt-3">
                            <h6 className="text-uppercase text-muted font-weight-bold mb-2" style={{fontSize:'0.7rem', letterSpacing:'1px'}}>
                                <i className="fas fa-list-ul me-2" />
                                Daftar Pesanan dalam Tagihan ini
                            </h6>
                            <div className="table-responsive rounded border">
                                <Table size="sm" className="mb-0 align-middle">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Kode Pesan</th>
                                            <th className="text-end">Total</th>
                                            <th className="text-end">Dibayar</th>
                                            <th className="text-end">Sisa</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(detail.orders || []).length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted py-3">
                                                    Tidak ada order dalam tagihan ini
                                                </td>
                                            </tr>
                                        ) : (detail.orders || []).map((o) => {
                                            const sisa = Math.max((o.total_harga || 0) - (o.paid || 0), 0);
                                            const sp   = ORDER_STATUS_MAP[o.status] || { color: "secondary", label: o.status || "-" };
                                            return (
                                                <tr key={o.order_id}>
                                                    <td>
                                                        <code className="text-primary small">{o.kode_pesan}</code>
                                                    </td>
                                                    <td className="text-end font-weight-bold">{formatRupiah(o.total_harga)}</td>
                                                    <td className="text-end text-success">{formatRupiah(o.paid)}</td>
                                                    <td className="text-end text-danger">{formatRupiah(sisa)}</td>
                                                    <td className="text-center">
                                                        <Badge color={sp.color} pill className="px-2">{sp.label}</Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        {/* ── FORM BAYAR ───────────────────────────────────────── */}
                        {detail.status !== "PAID" && (
                            <div className="px-4 pt-4 pb-3 mt-2">
                                <h6 className="text-uppercase text-muted font-weight-bold mb-3" style={{fontSize:'0.7rem', letterSpacing:'1px'}}>
                                    <i className="fas fa-credit-card me-2 text-primary" />
                                    Proses Pembayaran
                                </h6>
                                <Row className="g-3 align-items-end">
                                    <Col md="5">
                                        <label className="form-label small text-muted font-weight-bold">Nominal Bayar</label>
                                        <InputGroup className="shadow-sm border rounded">
                                            <InputGroupText className="bg-transparent border-0 font-weight-bold text-muted">Rp</InputGroupText>
                                            <Input
                                                type="number"
                                                className="border-0 font-weight-bold fs-5"
                                                placeholder="0"
                                                value={nominal}
                                                min={0}
                                                max={sisaBayar}
                                                onChange={(e) => setNominal(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handlePay()}
                                            />
                                        </InputGroup>
                                        {/* Quick fill buttons */}
                                        <div className="d-flex gap-2 mt-2">
                                            <Button size="sm" color="light" className="rounded-pill px-3 border" onClick={() => setNominal(sisaBayar)}>
                                                Bayar Lunas ({formatRupiah(sisaBayar)})
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <label className="form-label small text-muted font-weight-bold">Metode Pembayaran</label>
                                        <Input type="select" className="shadow-sm border rounded font-weight-bold"
                                            value={method} onChange={(e) => setMethod(e.target.value)}>
                                            <option value="cash">💵 Tunai (Cash)</option>
                                            <option value="qris">📱 QRIS</option>
                                            <option value="tf">🏦 Transfer Bank</option>
                                        </Input>
                                    </Col>
                                    <Col md="3">
                                        <Button
                                            color="primary"
                                            block
                                            className="rounded font-weight-bold shadow"
                                            disabled={paying || !nominal || parseFloat(nominal) <= 0}
                                            onClick={handlePay}
                                        >
                                            {paying ? (
                                                <><Spinner size="sm" className="me-2" />Memproses...</>
                                            ) : (
                                                <><i className="fas fa-check me-2" />Bayar</>
                                            )}
                                        </Button>
                                    </Col>
                                </Row>

                                {sisaBayar > 0 && nominal && parseFloat(nominal) >= sisaBayar && (
                                    <Alert color="success" className="mt-3 mb-0 py-2 rounded">
                                        <i className="fas fa-check-circle me-2" />
                                        Pembayaran ini akan <strong>melunasi</strong> seluruh tagihan.
                                        {parseFloat(nominal) > sisaBayar && (
                                            <span className="ms-2">Kembalian: <strong>{formatRupiah(parseFloat(nominal) - sisaBayar)}</strong></span>
                                        )}
                                    </Alert>
                                )}
                            </div>
                        )}

                        {detail.status === "PAID" && (
                            <div className="px-4 pb-4 pt-2">
                                <Alert color="success" className="round mb-0 d-flex align-items-center">
                                    <i className="fas fa-check-circle fa-lg me-3 text-success" />
                                    <div>
                                        <strong>Tagihan Lunas</strong>
                                        <p className="mb-0 small text-muted">Seluruh pesanan dalam tagihan ini sudah dibayar.</p>
                                    </div>
                                </Alert>
                            </div>
                        )}
                    </>
                ) : null}
            </ModalBody>

            <ModalFooter className="border-0 bg-light py-3">
                <Button color="secondary" outline className="rounded-pill px-4" onClick={toggle}>
                    Tutup
                </Button>
            </ModalFooter>

            <style>{`
                .rounded-xl { border-radius: 1rem !important; }
                .bill-modal-icon {
                    width: 40px; height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                }
                .customer-avatar {
                    width: 48px; height: 48px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.3rem; font-weight: bold;
                }
                .summary-card {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 12px 8px;
                    border: 1px solid #eee;
                }
                .summary-card--danger { border-color: rgba(245,54,92,0.3); background: rgba(245,54,92,0.04); }
                .summary-card--success { border-color: rgba(45,206,137,0.3); background: rgba(45,206,137,0.04); }
                .gap-2 { gap: 0.5rem !important; }
                .gap-3 { gap: 0.75rem !important; }
                .ms-2 { margin-left: 0.5rem !important; }
                .me-1 { margin-right: 0.25rem !important; }
                .me-2 { margin-right: 0.5rem !important; }
                .me-3 { margin-right: 0.75rem !important; }
                .fw-bold { font-weight: 700 !important; }
                .fs-5 { font-size: 1rem !important; }
                .bg-gradient-info { background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; }
            `}</style>
        </Modal>
    );
};

export default BillingDetailModal;

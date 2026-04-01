import React from "react";
import { Table, Spinner, Badge } from "reactstrap";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const typeConfig = {
    Assets: { icon: "fas fa-coins", tone: "primary", label: "Aset" },
    Liability: { icon: "fas fa-file-invoice", tone: "warning", label: "Kewajiban" },
    Equity: { icon: "fas fa-landmark", tone: "info", label: "Ekuitas" },
    Revenue: { icon: "fas fa-chart-line", tone: "success", label: "Pendapatan" },
    Expense: { icon: "fas fa-receipt", tone: "danger", label: "Beban" },
};

const AccountingSummaryTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat ringkasan akuntansi...</p>
            </div>
        );
    }

    // Group accounts by type
    const grouped = {};
    (data.accounts || []).forEach((acc) => {
        const type = acc.account_type || "Other";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(acc);
    });

    const netIncome = (data.total_revenue || 0) - (data.total_expense || 0);

    return (
        <div className="summary-tab">
            {/* Quick Net Income */}
            <div className={`quick-stat p-4 rounded-xl mb-5 ${netIncome >= 0 ? 'profit' : 'loss'}`}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <small className="d-block font-weight-bold text-uppercase" style={{ opacity: 0.8, letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Laba Bersih Periode Ini
                        </small>
                        <h2 className="mb-0 font-weight-900 text-white" style={{ fontSize: '1.8rem' }}>
                            {formatCurrency(netIncome)}
                        </h2>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="mini-stat">
                            <small className="d-block" style={{ opacity: 0.7 }}>Revenue</small>
                            <strong>{formatCurrency(data.total_revenue)}</strong>
                        </div>
                        <div className="mini-stat">
                            <small className="d-block" style={{ opacity: 0.7 }}>Expense</small>
                            <strong>{formatCurrency(data.total_expense)}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Groups */}
            {Object.keys(grouped).map((type) => {
                const config = typeConfig[type] || { icon: "fas fa-folder", tone: "dark", label: type };
                return (
                    <div key={type} className="mb-5">
                        <div className="d-flex align-items-center mb-3">
                            <div className={`icon-sm bg-gradient-${config.tone} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
                                style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                                <i className={config.icon} />
                            </div>
                            <h5 className="mb-0 font-weight-bold text-dark">{config.label}</h5>
                            <Badge color={config.tone} pill className="ms-auto px-3 py-2">{grouped[type].length} Akun</Badge>
                        </div>
                        <div className="table-responsive">
                            <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                                <thead className="thead-light-soft">
                                    <tr>
                                        <th className="ps-4">Nama Akun</th>
                                        <th className="text-end">Debit</th>
                                        <th className="text-end">Kredit</th>
                                        <th className="text-end pe-4">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grouped[type].map((acc, i) => (
                                        <tr key={acc.id_account || i} className="acct-row">
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className={`dot bg-${config.tone} me-3`} />
                                                    <span className="font-weight-bold text-dark">{acc.account_name}</span>
                                                </div>
                                            </td>
                                            <td className="text-end text-muted font-weight-bold">{formatCurrency(acc.total_debit)}</td>
                                            <td className="text-end text-muted font-weight-bold">{formatCurrency(acc.total_credit)}</td>
                                            <td className="text-end pe-4">
                                                <span className={`font-weight-900 ${acc.balance >= 0 ? '' : 'text-danger'}`}>
                                                    {formatCurrency(acc.balance)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                );
            })}

            {Object.keys(grouped).length === 0 && (
                <div className="text-center py-5 text-muted">
                    <i className="fas fa-chart-bar fs-1 d-block mb-3" style={{ opacity: 0.3 }} />
                    <p>Belum ada data akuntansi dalam periode ini.</p>
                </div>
            )}

            <style>{`
                .quick-stat {
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .quick-stat.profit {
                    background: linear-gradient(135deg, #059669, #10b981);
                }
                .quick-stat.loss {
                    background: linear-gradient(135deg, #dc2626, #ef4444);
                }
                .quick-stat::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 180px;
                    height: 180px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 50%;
                }
                .mini-stat {
                    text-align: center;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 10px;
                }
                .gap-3 { gap: 1rem; }
                .thead-light-soft th {
                    background: #f8fafc; color: #8898aa; font-size: 0.7rem;
                    text-transform: uppercase; letter-spacing: 0.5px; border-top: none;
                    font-weight: 700; padding: 12px 16px;
                }
                .acct-row td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .acct-row:hover { background: #f8fafc; }
                .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .rounded-xl { border-radius: 12px; }
                .font-weight-900 { font-weight: 900; }
                .icon-sm { flex-shrink: 0; }
                .bg-gradient-primary { background: linear-gradient(135deg, #5e72e4, #825ee4); }
                .bg-gradient-warning { background: linear-gradient(135deg, #fb6340, #fbb140); }
                .bg-gradient-success { background: linear-gradient(135deg, #2dce89, #2dcead); }
                .bg-gradient-info { background: linear-gradient(135deg, #11cdef, #1171ef); }
                .bg-gradient-danger { background: linear-gradient(135deg, #f5365c, #f56036); }
            `}</style>
        </div>
    );
};

export default AccountingSummaryTab;

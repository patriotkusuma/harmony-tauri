import React from "react";
import { Table, Spinner, Badge } from "reactstrap";
import ExpenseBreakdownChart from "components/molecules/accounting/ExpenseBreakdownChart";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const IncomeStatementTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat laporan laba rugi...</p>
            </div>
        );
    }

    const isProfit = data.net_income >= 0;

    return (
        <div className="income-statement-tab">
            {/* Top Analysis Section */}
            <div className="row mb-4">
                <div className="col-xl-7">
                    {/* Net Income Highlight Card */}
                    <div className={`net-income-card p-4 rounded-xl h-100 ${isProfit ? 'profit' : 'loss'}`}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-uppercase font-weight-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.8 }}>
                                    {isProfit ? '🎉 Laba Bersih' : '⚠️ Rugi Bersih'}
                                </h6>
                                <h2 className="mb-0 font-weight-900 text-white" style={{ fontSize: '2rem' }}>
                                    {formatCurrency(Math.abs(data.net_income))}
                                </h2>
                            </div>
                            <div className="text-end">
                                <div className={`icon-circle ${isProfit ? 'bg-success-glow' : 'bg-danger-glow'}`}>
                                    <i className={`fas ${isProfit ? 'fa-arrow-up' : 'fa-arrow-down'} fs-4 text-white`} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mt-3 gap-4 text-white">
                            <div>
                                <small className="d-block text-white-50">Total Pendapatan</small>
                                <strong>{formatCurrency(data.total_revenue)}</strong>
                            </div>
                            <div>
                                <small className="d-block text-white-50">Total Beban</small>
                                <strong>{formatCurrency(data.total_expense)}</strong>
                            </div>
                            {data.total_revenue > 0 && (
                                <div>
                                    <small className="d-block text-white-50">Margin</small>
                                    <strong>{((data.net_income / data.total_revenue) * 100).toFixed(1)}%</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-xl-5 mt-4 mt-xl-0">
                    <ExpenseBreakdownChart expenses={data.expense} />
                </div>
            </div>

            {/* Revenue Section */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-sm bg-gradient-emerald text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                        <i className="fas fa-chart-line" />
                    </div>
                    <h5 className="mb-0 font-weight-bold text-dark">Pendapatan (Revenue)</h5>
                    <Badge color="success" pill className="ms-auto px-3 py-2">{data.revenue.length} Sumber</Badge>
                </div>
                <div className="table-responsive">
                    <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                        <thead className="thead-light-soft">
                            <tr>
                                <th className="ps-4">Sumber Pendapatan</th>
                                <th className="text-end pe-4">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.revenue.length > 0 ? data.revenue.map((acc, i) => (
                                <tr key={acc.id_account || i} className="acct-row">
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="dot bg-success me-3" />
                                            <span className="font-weight-bold text-dark">{acc.account_name}</span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <span className="font-weight-900 text-success">{formatCurrency(acc.balance)}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="2" className="text-center text-muted py-4"><i className="fas fa-inbox me-2" />Belum ada data pendapatan</td></tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td className="ps-4 font-weight-900 text-dark text-uppercase">Total Pendapatan</td>
                                <td className="text-end pe-4"><span className="font-weight-900 fs-5 text-success">{formatCurrency(data.total_revenue)}</span></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>

            {/* Expense Section */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-sm bg-gradient-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                        <i className="fas fa-receipt" />
                    </div>
                    <h5 className="mb-0 font-weight-bold text-dark">Beban (Expense)</h5>
                    <Badge color="danger" pill className="ms-auto px-3 py-2">{data.expense.length} Pos</Badge>
                </div>
                <div className="table-responsive">
                    <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                        <thead className="thead-light-soft">
                            <tr>
                                <th className="ps-4">Pos Pengeluaran</th>
                                <th className="text-end pe-4">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.expense.length > 0 ? data.expense.map((acc, i) => (
                                <tr key={acc.id_account || i} className="acct-row">
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="dot bg-danger me-3" />
                                            <span className="font-weight-bold text-dark">{acc.account_name}</span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <span className="font-weight-900 text-danger">{formatCurrency(acc.balance)}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="2" className="text-center text-muted py-4"><i className="fas fa-inbox me-2" />Belum ada data beban</td></tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td className="ps-4 font-weight-900 text-dark text-uppercase">Total Beban</td>
                                <td className="text-end pe-4"><span className="font-weight-900 fs-5 text-danger">{formatCurrency(data.total_expense)}</span></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>

            <style>{`
                .net-income-card {
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .net-income-card.profit {
                    background: linear-gradient(135deg, #059669, #10b981);
                }
                .net-income-card.loss {
                    background: linear-gradient(135deg, #dc2626, #ef4444);
                }
                .net-income-card::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                .icon-circle {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .bg-success-glow { background: rgba(255,255,255,0.2); box-shadow: 0 0 30px rgba(255,255,255,0.1); }
                .bg-danger-glow { background: rgba(255,255,255,0.2); box-shadow: 0 0 30px rgba(255,255,255,0.1); }
                .rounded-xl { border-radius: 12px; }
                .bg-gradient-emerald { background: linear-gradient(135deg, #10b981, #059669); }
                .bg-gradient-danger { background: linear-gradient(135deg, #f5365c, #f56036); }
                .thead-light-soft th {
                    background: #f8fafc; color: #8898aa; font-size: 0.7rem;
                    text-transform: uppercase; letter-spacing: 0.5px; border-top: none;
                    font-weight: 700; padding: 12px 16px;
                }
                .acct-row td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .acct-row:hover { background: #f8fafc; }
                .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .total-row td { padding: 16px; border-top: 2px solid #e2e8f0; background: #f8fafc; }
                .font-weight-900 { font-weight: 900; }
                .icon-sm { flex-shrink: 0; }
                .gap-4 { gap: 1.5rem; }
            `}</style>
        </div>
    );
};

export default IncomeStatementTab;

import React from "react";
import { Table, Spinner, Badge } from "reactstrap";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const AccountTable = ({ title, icon, accounts, total, totalLabel, tone }) => (
    <div className="acct-section mb-5">
        <div className="d-flex align-items-center mb-3">
            <div className={`icon-sm bg-gradient-${tone} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
                style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                <i className={icon} />
            </div>
            <h5 className="mb-0 font-weight-bold text-dark">{title}</h5>
            <Badge color={tone} pill className="ms-auto px-3 py-2 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                {accounts.length} Akun
            </Badge>
        </div>
        <div className="table-responsive">
            <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                <thead className="thead-light-soft">
                    <tr>
                        <th className="ps-4" style={{ width: '40%' }}>Nama Akun</th>
                        <th className="text-end">Debit</th>
                        <th className="text-end">Kredit</th>
                        <th className="text-end pe-4">Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 ? accounts.map((acc, i) => (
                        <tr key={acc.id_account || i} className="acct-row">
                            <td className="ps-4">
                                <div className="d-flex align-items-center">
                                    <div className={`dot bg-${tone} me-3`} />
                                    <div>
                                        <span className="font-weight-bold text-dark d-block">{acc.account_name}</span>
                                        {acc.account_code && <small className="text-muted">{acc.account_code}</small>}
                                    </div>
                                </div>
                            </td>
                            <td className="text-end text-muted font-weight-bold">{formatCurrency(acc.total_debit)}</td>
                            <td className="text-end text-muted font-weight-bold">{formatCurrency(acc.total_credit)}</td>
                            <td className="text-end pe-4">
                                <span className={`font-weight-900 ${acc.balance >= 0 ? 'text-default' : 'text-danger'}`}>
                                    {formatCurrency(acc.balance)}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" className="text-center text-muted py-4">
                                <i className="fas fa-inbox me-2" />Tidak ada data akun
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className="total-row">
                        <td colSpan="3" className="ps-4 font-weight-900 text-dark text-uppercase" style={{ fontSize: '0.85rem' }}>
                            {totalLabel}
                        </td>
                        <td className="text-end pe-4">
                            <span className={`font-weight-900 fs-5 ${total >= 0 ? `text-${tone}` : 'text-danger'}`}>
                                {formatCurrency(total)}
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    </div>
);

const BalanceSheetTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat neraca...</p>
            </div>
        );
    }

    const isBalanced = Math.abs(data.total_assets - (data.total_liabilities + data.total_equity)) < 1;

    return (
        <div className="balance-sheet-tab">
            {/* Balance Indicator */}
            <div className={`balance-indicator d-flex align-items-center justify-content-between p-3 rounded-lg mb-4 ${isBalanced ? 'bg-success-soft' : 'bg-danger-soft'}`}>
                <div className="d-flex align-items-center">
                    <i className={`fas ${isBalanced ? 'fa-check-circle text-success' : 'fa-exclamation-triangle text-danger'} me-3 fs-4`} />
                    <div>
                        <strong className={isBalanced ? 'text-success' : 'text-danger'}>
                            {isBalanced ? 'Neraca Seimbang ✓' : 'Neraca Tidak Seimbang!'}
                        </strong>
                        <p className="mb-0 text-muted small">
                            Total Aset = Total Kewajiban + Total Ekuitas
                        </p>
                    </div>
                </div>
                <span className="font-weight-bold text-dark">{formatCurrency(data.total_assets)}</span>
            </div>

            <AccountTable
                title="Aset (Harta)"
                icon="fas fa-coins"
                accounts={data.assets}
                total={data.total_assets}
                totalLabel="Total Aset"
                tone="primary"
            />

            <AccountTable
                title="Kewajiban (Utang)"
                icon="fas fa-file-invoice"
                accounts={data.liabilities}
                total={data.total_liabilities}
                totalLabel="Total Kewajiban"
                tone="warning"
            />

            <AccountTable
                title="Ekuitas (Modal)"
                icon="fas fa-landmark"
                accounts={data.equity}
                total={data.total_equity}
                totalLabel="Total Ekuitas"
                tone="success"
            />

            <style>{`
                .bg-success-soft { background: rgba(45, 206, 137, 0.1); border: 1px solid rgba(45, 206, 137, 0.2); }
                .bg-danger-soft { background: rgba(245, 54, 92, 0.1); border: 1px solid rgba(245, 54, 92, 0.2); }
                .rounded-lg { border-radius: 10px; }
                .thead-light-soft th {
                    background: #f8fafc;
                    color: #8898aa;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-top: none;
                    font-weight: 700;
                    padding: 12px 16px;
                }
                .acct-row td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .acct-row:hover { background: #f8fafc; }
                .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .total-row td { padding: 16px; border-top: 2px solid #e2e8f0; background: #f8fafc; }
                .font-weight-900 { font-weight: 900; }
                .icon-sm { flex-shrink: 0; }
                .bg-gradient-primary { background: linear-gradient(135deg, #5e72e4, #825ee4); }
                .bg-gradient-warning { background: linear-gradient(135deg, #fb6340, #fbb140); }
                .bg-gradient-success { background: linear-gradient(135deg, #2dce89, #2dcead); }
            `}</style>
        </div>
    );
};

export default BalanceSheetTab;

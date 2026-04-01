import React from "react";
import { Table, Spinner, Badge, Button } from "reactstrap";
import moment from "moment";

const AccountingPeriodsTab = ({ periods, autoCloseEnabled, loading, onToggleAutoClose, onClosePeriod }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat periode akuntansi...</p>
            </div>
        );
    }

    const statusBadge = (status) => {
        switch (status) {
            case "OPEN":
                return <Badge color="success" pill className="px-3 py-2 font-weight-bold">Aktif</Badge>;
            case "CLOSED":
                return <Badge color="secondary" pill className="px-3 py-2 font-weight-bold">Ditutup</Badge>;
            default:
                return <Badge color="info" pill className="px-3 py-2 font-weight-bold">{status}</Badge>;
        }
    };

    return (
        <div className="periods-tab">
            {/* Auto Close Toggle */}
            <div className="auto-close-card p-4 rounded-xl mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="auto-close-icon me-3">
                        <i className="fas fa-clock" />
                    </div>
                    <div>
                        <strong className="text-dark d-block">Auto-Close Periode</strong>
                        <small className="text-muted">
                            Otomatis menutup periode setiap akhir bulan
                        </small>
                    </div>
                </div>
                <div className="form-check form-switch" style={{ transform: 'scale(1.3)' }}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={autoCloseEnabled}
                        onChange={(e) => onToggleAutoClose(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>

            {/* Periods Table */}
            <div className="table-responsive">
                <Table className="align-items-center table-flush table-hover mb-0" size="sm">
                    <thead className="thead-light-soft">
                        <tr>
                            <th className="ps-4">Periode</th>
                            <th>Tanggal Mulai</th>
                            <th>Tanggal Akhir</th>
                            <th>Status</th>
                            <th>Ditutup Pada</th>
                            <th className="text-center pe-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periods.length > 0 ? periods.map((period) => (
                            <tr key={period.id} className="acct-row">
                                <td className="ps-4">
                                    <div className="d-flex align-items-center">
                                        <div className={`dot ${period.status === 'OPEN' ? 'bg-success' : 'bg-secondary'} me-3`} />
                                        <strong className="text-dark">{period.name || `Periode ${moment(period.start_date).format('MMMM YYYY')}`}</strong>
                                    </div>
                                </td>
                                <td className="text-muted">{moment(period.start_date).format('DD MMM YYYY')}</td>
                                <td className="text-muted">{moment(period.end_date).format('DD MMM YYYY')}</td>
                                <td>{statusBadge(period.status)}</td>
                                <td className="text-muted">
                                    {period.closed_at ? moment(period.closed_at).format('DD MMM YYYY HH:mm') : '-'}
                                </td>
                                <td className="text-center pe-4">
                                    {period.status === "OPEN" && (
                                        <Button
                                            color="warning"
                                            size="sm"
                                            className="rounded-pill px-3 font-weight-bold"
                                            onClick={() => {
                                                if (window.confirm(`Yakin ingin menutup periode ${period.name || moment(period.start_date).format('MMMM YYYY')}?`)) {
                                                    onClosePeriod(period.id);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-lock me-1" /> Tutup
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-5">
                                    <i className="fas fa-calendar-times fs-2 d-block mb-3" style={{ opacity: 0.3 }} />
                                    Belum ada periode akuntansi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <style>{`
                .auto-close-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                }
                .auto-close-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: white;
                    flex-shrink: 0;
                }
                .thead-light-soft th {
                    background: #f8fafc; color: #8898aa; font-size: 0.7rem;
                    text-transform: uppercase; letter-spacing: 0.5px; border-top: none;
                    font-weight: 700; padding: 12px 16px;
                }
                .acct-row td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
                .acct-row:hover { background: #f8fafc; }
                .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .rounded-xl { border-radius: 12px; }
            `}</style>
        </div>
    );
};

export default AccountingPeriodsTab;

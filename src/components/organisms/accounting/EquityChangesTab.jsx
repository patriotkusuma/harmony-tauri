import React from "react";
import { Spinner } from "reactstrap";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const EquityChangesTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat perubahan ekuitas...</p>
            </div>
        );
    }

    const equityGrowth = data.beginning_equity !== 0
        ? ((data.ending_equity - data.beginning_equity) / Math.abs(data.beginning_equity)) * 100
        : 0;

    const items = [
        { label: "Modal Awal Periode", value: data.beginning_equity, icon: "fas fa-flag-checkered", color: "#6366f1" },
        { label: "Laba/Rugi Bersih", value: data.net_income, icon: "fas fa-chart-line", color: data.net_income >= 0 ? "#10b981" : "#ef4444", isAdd: true },
        { label: "Prive / Dividen", value: data.withdrawals_dividends, icon: "fas fa-hand-holding-usd", color: "#f59e0b", isSub: true },
        { label: "Modal Akhir Periode", value: data.ending_equity, icon: "fas fa-flag", color: "#3b82f6", isResult: true },
    ];

    return (
        <div className="equity-tab">
            {/* Growth Card */}
            <div className="equity-growth-card p-4 rounded-xl mb-5 d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="text-uppercase font-weight-bold mb-1 text-white" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.8 }}>
                        Pertumbuhan Ekuitas
                    </h6>
                    <h2 className="mb-0 font-weight-900 text-white" style={{ fontSize: '2rem' }}>
                        {equityGrowth >= 0 ? '+' : ''}{equityGrowth.toFixed(1)}%
                    </h2>
                    <small className="text-white" style={{ opacity: 0.7 }}>
                        {formatCurrency(data.beginning_equity)} → {formatCurrency(data.ending_equity)}
                    </small>
                </div>
                <div className="equity-icon-circle">
                    <i className={`fas ${equityGrowth >= 0 ? 'fa-trending-up fa-arrow-up' : 'fa-arrow-down'} fs-3`} />
                </div>
            </div>

            {/* Equity Flow Steps */}
            <div className="equity-flow mx-auto" style={{ maxWidth: 600 }}>
                {items.map((item, i) => (
                    <div key={item.label} className="equity-step-wrapper">
                        {i > 0 && !item.isResult && (
                            <div className="step-operator text-center">
                                <span className={`operator-badge ${item.isSub ? 'subtract' : 'add'}`}>
                                    {item.isSub ? '−' : '+'}
                                </span>
                            </div>
                        )}
                        {item.isResult && (
                            <div className="step-operator text-center">
                                <span className="operator-badge result">=</span>
                            </div>
                        )}
                        <div className={`equity-step p-4 rounded-xl ${item.isResult ? 'result-step' : ''}`}
                            style={{ borderLeft: `4px solid ${item.color}` }}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="step-icon me-3" style={{ background: `${item.color}15`, color: item.color }}>
                                        <i className={item.icon} />
                                    </div>
                                    <span className="font-weight-bold text-dark">{item.label}</span>
                                </div>
                                <h4 className={`mb-0 font-weight-900 ${item.value >= 0 ? '' : 'text-danger'}`}>
                                    {formatCurrency(item.value)}
                                </h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .equity-growth-card {
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    position: relative;
                    overflow: hidden;
                }
                .equity-growth-card::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 50%;
                }
                .equity-icon-circle {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.15);
                    color: white;
                    flex-shrink: 0;
                }
                .equity-step {
                    background: white;
                    border: 1px solid #e2e8f0;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .equity-step:hover {
                    transform: translateX(8px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
                }
                .equity-step.result-step {
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border-color: #93c5fd;
                }
                .step-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }
                .step-operator { padding: 8px 0; }
                .operator-badge {
                    display: inline-flex;
                    width: 32px;
                    height: 32px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-weight: 900;
                    font-size: 1rem;
                }
                .operator-badge.add { background: rgba(16, 185, 129, 0.12); color: #059669; }
                .operator-badge.subtract { background: rgba(245, 158, 11, 0.12); color: #d97706; }
                .operator-badge.result { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
                .rounded-xl { border-radius: 12px; }
                .font-weight-900 { font-weight: 900; }
            `}</style>
        </div>
    );
};

export default EquityChangesTab;

import React from "react";
import { Spinner } from "reactstrap";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const FlowItem = ({ icon, label, value, tone, isLast }) => (
    <div className="flow-item-wrapper">
        <div className={`flow-item p-4 rounded-xl ${tone}`}>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="flow-icon me-3">
                        <i className={`${icon} fs-5`} />
                    </div>
                    <div>
                        <small className="d-block flow-label">{label}</small>
                        <h4 className="mb-0 font-weight-900 flow-value">{formatCurrency(value)}</h4>
                    </div>
                </div>
                <div className={`flow-badge ${value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'}`}>
                    {value > 0 ? '+' : value < 0 ? '-' : '±'} {value !== 0 ? formatCurrency(Math.abs(value)) : '0'}
                </div>
            </div>
        </div>
        {!isLast && (
            <div className="flow-connector text-center">
                <i className="fas fa-arrow-down text-muted" style={{ fontSize: '1.2rem', opacity: 0.4 }} />
            </div>
        )}
    </div>
);

const CashFlowTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat arus kas...</p>
            </div>
        );
    }

    const flows = [
        { icon: "fas fa-store", label: "Aktivitas Operasional", value: data.operating_activities, tone: "operating" },
        { icon: "fas fa-chart-pie", label: "Aktivitas Investasi", value: data.investing_activities, tone: "investing" },
        { icon: "fas fa-university", label: "Aktivitas Pendanaan", value: data.financing_activities, tone: "financing" },
    ];

    return (
        <div className="cash-flow-tab">
            {/* Net Cash Flow Summary */}
            <div className="net-cash-card p-4 rounded-xl mb-5">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="text-uppercase font-weight-bold mb-1 text-white" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.8 }}>
                            Arus Kas Bersih
                        </h6>
                        <h2 className="mb-0 font-weight-900 text-white" style={{ fontSize: '2rem' }}>
                            {formatCurrency(data.net_cash_flow)}
                        </h2>
                        <small className="text-white" style={{ opacity: 0.7 }}>
                            Penjumlahan dari semua aktivitas kas
                        </small>
                    </div>
                    <div className="cash-icon-circle">
                        <i className="fas fa-money-bill-wave fs-3" />
                    </div>
                </div>
            </div>

            {/* Flow Items */}
            <div className="flow-stack mx-auto" style={{ maxWidth: 600 }}>
                {flows.map((flow, i) => (
                    <FlowItem
                        key={flow.tone}
                        icon={flow.icon}
                        label={flow.label}
                        value={flow.value}
                        tone={flow.tone}
                        isLast={i === flows.length - 1}
                    />
                ))}
            </div>

            {/* Formula */}
            <div className="formula-card p-4 rounded-xl mt-5 text-center">
                <small className="text-muted font-weight-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Formula</small>
                <p className="mb-0 mt-2 font-weight-bold text-dark" style={{ fontSize: '0.95rem' }}>
                    Arus Kas Bersih = Operasional ({formatCurrency(data.operating_activities)}) + Investasi ({formatCurrency(data.investing_activities)}) + Pendanaan ({formatCurrency(data.financing_activities)})
                </p>
            </div>

            <style>{`
                .net-cash-card {
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    position: relative;
                    overflow: hidden;
                }
                .net-cash-card::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 50%;
                }
                .cash-icon-circle {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.15);
                    color: white;
                }
                .flow-item {
                    border: 1px solid #e2e8f0;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    background: white;
                }
                .flow-item:hover {
                    transform: translateX(8px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
                }
                .flow-item.operating { border-left: 4px solid #3b82f6; }
                .flow-item.investing { border-left: 4px solid #8b5cf6; }
                .flow-item.financing { border-left: 4px solid #10b981; }
                .flow-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    color: #475569;
                }
                .flow-label { color: #94a3b8; font-weight: 600; font-size: 0.8rem; }
                .flow-value { color: #1e293b; }
                .flow-badge {
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .flow-badge.positive { background: rgba(45, 206, 137, 0.12); color: #059669; }
                .flow-badge.negative { background: rgba(245, 54, 92, 0.12); color: #dc2626; }
                .flow-badge.neutral { background: rgba(148, 163, 184, 0.12); color: #64748b; }
                .flow-connector { padding: 8px 0; }
                .formula-card { background: #f8fafc; border: 1px dashed #cbd5e1; }
                .rounded-xl { border-radius: 12px; }
                .font-weight-900 { font-weight: 900; }
            `}</style>
        </div>
    );
};

export default CashFlowTab;

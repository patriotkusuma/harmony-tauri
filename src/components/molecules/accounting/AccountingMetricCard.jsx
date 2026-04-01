import React from "react";
import { Col } from "reactstrap";

const formatCurrency = (val) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const AccountingMetricCard = ({ icon, label, value, sub, tone, isCurrency = true }) => (
    <Col lg="3" md="6" className="mb-4 mb-lg-0">
        <div className="acct-tile p-4 rounded-xl backdrop-blur position-relative overflow-hidden">
            <div className={`icon icon-shape bg-soft-${tone} text-${tone} rounded-circle mb-3 shadow-premium`}>
                <i className={icon} />
            </div>
            <div>
                <h6 className="text-white-50 uppercase mb-1 ls-1 font-weight-bold" style={{ fontSize: '0.7rem' }}>{label}</h6>
                <h2 className="text-white mb-0 font-weight-900" style={{ fontSize: '1.35rem' }}>
                    {isCurrency ? formatCurrency(value) : value}
                </h2>
                <small className="text-white-50">{sub}</small>
            </div>
            <div className={`accent-bar bg-${tone} position-absolute`} style={{ height: '4px', bottom: 0, left: 0, right: 0, opacity: 0.5 }} />
            <style>{`
                .bg-soft-info { background: rgba(17, 205, 239, 0.2); }
                .bg-soft-danger { background: rgba(245, 54, 92, 0.2); }
                .bg-soft-success { background: rgba(45, 206, 137, 0.2); }
                .bg-soft-primary { background: rgba(94, 114, 228, 0.2); }
                .bg-soft-warning { background: rgba(251, 99, 64, 0.2); }
                .bg-soft-emerald { background: rgba(16, 185, 129, 0.2); }
                .text-emerald { color: #10b981 !important; }
                .bg-emerald { background-color: #10b981 !important; }
                .font-weight-900 { font-weight: 900; }
                .acct-tile {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: transform 0.3s ease, background 0.3s ease;
                }
                .acct-tile:hover {
                    transform: translateY(-5px);
                    background: rgba(255,255,255,0.08);
                }
            `}</style>
        </div>
    </Col>
);

export default AccountingMetricCard;

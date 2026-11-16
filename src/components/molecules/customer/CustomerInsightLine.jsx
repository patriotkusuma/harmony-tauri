/* ================================================================
   Customer Insights — Molecule: CustomerInsightLine
   Satu baris ringkas, bahasa sehari-hari, untuk kasir.
   ================================================================ */
import React from 'react';
import { describeCustomerInsights, formatRupiah } from 'utils/customerInsights';

const CustomerInsightLine = ({ insights, showDebt = false, size = 'sm', className = '' }) => {
  if (!insights) return null;

  const text = describeCustomerInsights(insights);
  const debt = insights.outstanding_amount || 0;
  const fontSize = size === 'xs' ? '0.7rem' : '0.76rem';

  return (
    <>
      <span
        className={`d-flex flex-wrap align-items-center ${className}`}
        style={{ gap: 6, rowGap: 4 }}
      >
        <span
          className="cust-insight-line__text"
          style={{ fontSize, color: '#6b7c93', fontWeight: 600, lineHeight: 1.35 }}
        >
          {text}
        </span>

        {showDebt && debt > 0 && (
          <span
            className="cust-insight-line__debt"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 20,
              background: 'rgba(245,54,92,0.08)',
              border: '1px solid rgba(245,54,92,0.18)',
              color: '#f5365c',
              fontSize: '0.66rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ fontSize: '0.6rem' }} />
            Belum lunas {formatRupiah(debt)}
          </span>
        )}
      </span>

      <style>{`
        body.dark-mode .cust-insight-line__text { color: #94a3b8 !important; }
        body.dark-mode .cust-insight-line__debt {
          background: rgba(245, 54, 92, .14) !important;
          border-color: rgba(245, 54, 92, .32) !important;
          color: #fb7185 !important;
        }
      `}</style>
    </>
  );
};

export default CustomerInsightLine;

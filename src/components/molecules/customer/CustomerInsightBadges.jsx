/* ================================================================
   Customer Insights — Molecule: CustomerInsightBadges
   Deretan badge ringkas untuk list/saran customer.
   ================================================================ */
import React from 'react';
import InsightBadge from 'components/atoms/customer/InsightBadge';
import { buildInsightBadges } from 'utils/customerInsights';

const CustomerInsightBadges = ({ insights, max = 3, size = 'xs', className = '' }) => {
  const badges = buildInsightBadges(insights);
  if (!badges.length) return null;

  const visible = badges.slice(0, max);
  const hidden = badges.length - visible.length;

  return (
    <div
      className={`d-flex flex-wrap align-items-center ${className}`}
      style={{ gap: 4, rowGap: 4, maxWidth: '100%' }}
    >
      {visible.map((badge) => (
        <InsightBadge key={badge.key} {...badge} size={size} />
      ))}
      {hidden > 0 && (
        <span
          title={badges.slice(max).map((b) => b.label).join(' · ')}
          style={{
            fontSize: '0.64rem',
            fontWeight: 700,
            color: '#8898aa',
            padding: '1px 6px',
            borderRadius: 20,
            background: 'rgba(136,152,170,0.10)',
          }}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
};

export default CustomerInsightBadges;

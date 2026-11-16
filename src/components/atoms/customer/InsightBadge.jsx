/* ================================================================
   Customer Insights — Atom: InsightBadge
   Pill kecil untuk satu sinyal insight (preferensi, tunggakan, dll).
   ================================================================ */
import React from 'react';

const InsightBadge = ({ icon, label, color = '#5e72e4', bg, title, size = 'sm' }) => {
  const isSmall = size === 'xs';

  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 4 : 5,
        padding: isSmall ? '1px 7px' : '3px 9px',
        borderRadius: 20,
        background: bg || `${color}14`,
        border: `1px solid ${color}2e`,
        color,
        fontSize: isSmall ? '0.66rem' : '0.72rem',
        fontWeight: 700,
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}
    >
      {icon && <i className={icon} style={{ fontSize: isSmall ? '0.6rem' : '0.68rem', flexShrink: 0 }} />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </span>
  );
};

export default InsightBadge;

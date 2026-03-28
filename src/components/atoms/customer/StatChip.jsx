/* ================================================================
   Customer Management — Atom: StatChip
   Chip kecil untuk menampilkan angka statistik (total order, dll).
   ================================================================ */
import React from 'react';

const StatChip = ({ icon, label, value, color = '#5e72e4' }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 12px', borderRadius: 20,
    background: `${color}14`, border: `1px solid ${color}30`,
    fontSize: '0.78rem', fontWeight: 700, color,
  }}>
    {icon && <i className={icon} style={{ fontSize: '0.8rem' }} />}
    <span>{value}</span>
    {label && <span style={{ fontWeight: 500, opacity: 0.8 }}>{label}</span>}
  </div>
);

export default StatChip;

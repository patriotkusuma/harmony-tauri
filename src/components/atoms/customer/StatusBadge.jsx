/* ================================================================
   Customer Management — Atom: StatusBadge
   Menampilkan badge status tipe customer atau status order.
   ================================================================ */
import React from 'react';

const CUSTOMER_TYPE = {
  member:     { label: 'Member',     color: '#5e72e4', bg: 'rgba(94,114,228,0.1)' },
  non_member: { label: 'Non Member', color: '#8898aa', bg: 'rgba(136,152,170,0.12)' },
  not_member: { label: 'Non Member', color: '#8898aa', bg: 'rgba(136,152,170,0.12)' },
};

const ORDER_STATUS = {
  diterima:     { label: 'Diterima',     color: '#11cdef', bg: 'rgba(17,205,239,0.1)' },
  diproses:     { label: 'Diproses',     color: '#fb6340', bg: 'rgba(251,99,64,0.1)' },
  setrika:      { label: 'Setrika',      color: '#f5a623', bg: 'rgba(245,166,35,0.1)' },
  siap_diambil: { label: 'Siap Diambil', color: '#2dce89', bg: 'rgba(45,206,137,0.1)' },
  selesai:      { label: 'Selesai',      color: '#2dce89', bg: 'rgba(45,206,137,0.1)' },
  dibatalkan:   { label: 'Dibatalkan',   color: '#f5365c', bg: 'rgba(245,54,92,0.1)'  },
};

export const CustomerTypeBadge = ({ tipe }) => {
  const cfg = CUSTOMER_TYPE[tipe] ?? { label: tipe, color: '#8898aa', bg: 'rgba(136,152,170,0.1)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem',
      fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase',
      color: cfg.color, background: cfg.bg,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS[status] ?? { label: status, color: '#8898aa', bg: 'rgba(136,152,170,0.1)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem',
      fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase',
      color: cfg.color, background: cfg.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

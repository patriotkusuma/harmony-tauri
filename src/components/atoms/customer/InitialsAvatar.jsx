/* ================================================================
   Customer — Atom: InitialsAvatar
   Avatar inisial tanpa request jaringan, cepat untuk layar kasir.
   ================================================================ */
import React from 'react';

const PALETTE = [
  ['#5e72e4', '#eef0fd'],
  ['#2dce89', '#e8f8f2'],
  ['#11cdef', '#e3f9fd'],
  ['#fb6340', '#fff0eb'],
  ['#f5365c', '#fde8ec'],
  ['#8965e0', '#f0ebfd'],
  ['#f4a261', '#fff4ea'],
  ['#2196f3', '#e3f2fd'],
];

export const getInitials = (name = '') => {
  const clean = name.trim();
  if (!clean) return '?';
  const words = clean.split(/\s+/);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
};

const InitialsAvatar = ({ name = '', size = 42, className = '' }) => {
  const idx = (name.charCodeAt(0) || 0) % PALETTE.length;
  const [fg, bg] = PALETTE[idx];

  return (
    <span
      className={`d-inline-flex align-items-center justify-content-center flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: fg,
        fontWeight: 800,
        fontSize: Math.max(11, Math.round(size * 0.34)),
        letterSpacing: '0.02em',
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
};

export default InitialsAvatar;

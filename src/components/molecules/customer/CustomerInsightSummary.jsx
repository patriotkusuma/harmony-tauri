/* ================================================================
   Customer Insights — Molecule: CustomerInsightSummary
   Panel ringkas untuk customer terpilih di kasir.
   ================================================================ */
import React from 'react';
import {
  PREFERENCE_META,
  getConfidenceMeta,
  formatRupiah,
  formatCompactRupiah,
  formatDaysAgo,
} from 'utils/customerInsights';

const Stat = ({ value, label }) => (
  <div style={{ textAlign: 'center', padding: '0 6px', minWidth: 0 }}>
    <div
      className="cust-insight__stat-value"
      style={{
        fontSize: '0.98rem',
        fontWeight: 800,
        color: '#32325d',
        lineHeight: 1.15,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}
    </div>
    <div
      className="cust-insight__stat-label"
      style={{
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: '#8898aa',
        marginTop: 2,
      }}
    >
      {label}
    </div>
  </div>
);

const ConfidenceDots = ({ level, color, label }) => (
  <span
    title={label}
    aria-label={label}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}
  >
    {[1, 2, 3].map((dot) => (
      <span
        key={dot}
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: dot <= level ? color : 'rgba(136,152,170,0.28)',
        }}
      />
    ))}
  </span>
);

const CustomerInsightSummary = ({ insights, variant = 'checkout', className = '' }) => {
  if (!insights) return null;

  const isNew = !insights.orders_total;
  const pref = PREFERENCE_META[insights.preferred_class] || PREFERENCE_META.LAINNYA;
  const conf = getConfidenceMeta(insights);
  const hasDebt = (insights.outstanding_amount || 0) > 0;
  const isCompact = variant === 'compact';

  const hasClearPreference =
    ['REGULER', 'EXPRESS', 'KILAT'].includes(insights.preferred_class) &&
    (insights.preferred_sample_size || 0) >= 3;

  let prefTitle = 'Baru beberapa kali';
  let prefSub = `${insights.orders_total || 0} cucian · belum ada pola yang jelas`;

  if (hasClearPreference) {
    prefTitle = `Biasanya ${pref.label}`;
    prefSub = `${insights.preferred_sample_size} dari 10 cucian terakhir`;
  } else if (insights.preferred_class === 'CAMPURAN') {
    prefTitle = 'Layanan campur';
    prefSub = 'Tidak ada layanan yang benar-benar dominan';
  } else if (insights.preferred_class === 'LAINNYA') {
    prefTitle = 'Layanan khusus';
    prefSub = `${insights.orders_total || 0} cucian · satuan atau layanan khusus`;
  }

  return (
    <div
      className={`cust-insight text-start ${className}`}
      style={{
        border: '1px solid #e9ecef',
        borderRadius: 14,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fe 100%)',
        padding: '11px 12px',
        boxShadow: '0 2px 8px rgba(50,50,93,0.04)',
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center" style={{ gap: 8 }}>
        <span
          className="cust-insight__label"
          style={{
            fontSize: '0.64rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8898aa',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-chart-line me-1" />
          Riwayat Pelanggan
        </span>
        <span className="d-flex align-items-center" style={{ gap: 6 }}>
          {insights.is_dummy && (
            <span
              title="Data masih dummy / contoh"
              style={{
                fontSize: '0.56rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#fb6340',
                background: 'rgba(251,99,64,0.10)',
                border: '1px solid rgba(251,99,64,0.22)',
                borderRadius: 20,
                padding: '1px 6px',
              }}
            >
              CONTOH
            </span>
          )}
          {!isNew && (
            <span
              className="d-inline-flex align-items-center"
              style={{ gap: 4, fontSize: '0.6rem', fontWeight: 700, color: conf.color }}
            >
              <ConfidenceDots level={conf.level} color={conf.color} label={conf.label} />
              <span className="cust-insight__conf-label" style={{ color: '#8898aa' }}>{conf.label}</span>
            </span>
          )}
        </span>
      </div>

      {/* Isi */}
      {isNew ? (
        <div className="d-flex align-items-center" style={{ gap: 10, marginTop: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: PREFERENCE_META.SAMPEL_KECIL.bg,
              color: PREFERENCE_META.SAMPEL_KECIL.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className="fas fa-seedling" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="cust-insight__title" style={{ fontSize: '0.86rem', fontWeight: 800, color: '#32325d' }}>
              Pelanggan baru
            </div>
            <div className="cust-insight__sub" style={{ fontSize: '0.7rem', color: '#8898aa' }}>
              Belum ada riwayat cuci di sini.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Preferensi layanan */}
          <div className="d-flex align-items-center" style={{ gap: 10, marginTop: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: pref.bg,
                color: pref.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i className={pref.icon} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                className="cust-insight__title"
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: '#32325d',
                  lineHeight: 1.2,
                }}
              >
                {prefTitle}
              </div>
              <div className="cust-insight__sub" style={{ fontSize: '0.7rem', color: '#8898aa', lineHeight: 1.3 }}>
                {prefSub}
              </div>
            </div>
          </div>

          {/* Statistik singkat */}
          {!isCompact && (
            <div
              className="cust-insight__stats d-flex align-items-stretch"
              style={{
                marginTop: 10,
                background: '#fff',
                border: '1px solid #eef0f5',
                borderRadius: 10,
                padding: '7px 0',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Stat value={insights.orders_total || 0} label="Sudah cuci" />
              </div>
              <div className="cust-insight__divider" style={{ width: 1, background: '#eef0f5', margin: '2px 0' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Stat value={insights.orders_90d || 0} label="3 bulan" />
              </div>
              <div className="cust-insight__divider" style={{ width: 1, background: '#eef0f5', margin: '2px 0' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Stat value={formatCompactRupiah(insights.avg_order_value)} label="Rata-rata" />
              </div>
            </div>
          )}

          {/* Tunggakan — selalu paling menonjol */}
          {hasDebt ? (
            <div
              className="cust-insight__debt-box d-flex align-items-start"
              style={{
                marginTop: 9,
                padding: '8px 10px',
                borderRadius: 10,
                background: 'rgba(245,54,92,0.07)',
                border: '1px solid rgba(245,54,92,0.18)',
                gap: 9,
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ color: '#f5365c', fontSize: '0.85rem', marginTop: 1 }}
              />
              <div style={{ minWidth: 0 }}>
                <div className="cust-insight__debt-title" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f5365c', lineHeight: 1.2 }}>
                  Belum lunas {formatRupiah(insights.outstanding_amount)}
                </div>
                <div className="cust-insight__sub" style={{ fontSize: '0.68rem', color: '#8898aa', marginTop: 1 }}>
                  {insights.unpaid_orders || 0} tagihan belum dibayar
                  {insights.oldest_unpaid_days > 0
                    ? ` · tertua ${insights.oldest_unpaid_days} hari`
                    : ''}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="cust-insight__paid d-flex align-items-center"
              style={{ marginTop: 8, gap: 6, fontSize: '0.69rem', fontWeight: 700, color: '#2dce89' }}
            >
              <i className="fas fa-check-circle" />
              Semua tagihan lunas
            </div>
          )}

          {/* Terakhir order */}
          <div
            className="cust-insight__foot d-flex justify-content-between align-items-center"
            style={{ marginTop: 7, fontSize: '0.66rem', color: '#8898aa' }}
          >
            <span>
              <i className="fas fa-clock me-1" />
              Terakhir cuci {formatDaysAgo(insights.days_since_last_order)}
            </span>
            {insights.orders_30d > 0 && (
              <span className="cust-insight__foot-count" style={{ color: '#2dce89', fontWeight: 700 }}>
                <i className="fas fa-bolt me-1" />
                {insights.orders_30d} kali bulan ini
              </span>
            )}
          </div>
        </>
      )}

      <style>{`
        body.dark-mode .cust-insight {
          background: linear-gradient(180deg, #1e293b 0%, #161b22 100%) !important;
          border-color: rgba(255, 255, 255, .07) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, .35) !important;
        }
        body.dark-mode .cust-insight__label,
        body.dark-mode .cust-insight__conf-label,
        body.dark-mode .cust-insight__stat-label,
        body.dark-mode .cust-insight__sub,
        body.dark-mode .cust-insight__foot {
          color: #94a3b8 !important;
        }
        body.dark-mode .cust-insight__title,
        body.dark-mode .cust-insight__stat-value {
          color: #f1f5f9 !important;
        }
        body.dark-mode .cust-insight__stats {
          background: #0f172a !important;
          border-color: rgba(255, 255, 255, .08) !important;
        }
        body.dark-mode .cust-insight__divider { background: rgba(255, 255, 255, .08) !important; }
        body.dark-mode .cust-insight__debt-box {
          background: rgba(245, 54, 92, .12) !important;
          border-color: rgba(245, 54, 92, .28) !important;
        }
        body.dark-mode .cust-insight__debt-box i,
        body.dark-mode .cust-insight__debt-title { color: #fb7185 !important; }
        body.dark-mode .cust-insight__paid { color: #4ade80 !important; }
        body.dark-mode .cust-insight__foot-count { color: #4ade80 !important; }
      `}</style>
    </div>
  );
};

export default CustomerInsightSummary;

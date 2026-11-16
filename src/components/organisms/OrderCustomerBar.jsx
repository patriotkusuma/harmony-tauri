/* ================================================================
   Kasir — OrderCustomerBar (Redesign Ergonomis)
   ----------------------------------------------------------------
   Peningkatan:
   - Bar pelanggan lebih kontras dan mudah dikenali statusnya
   - Tampilan peringatan hutang lebih jelas dan menonjol
   - Badge status keanggotaan/riwayat insight terintegrasi rapi
   - Tombol Ganti Pelanggan & Detail Riwayat yang lebih tactile
   ================================================================ */
import React, { useEffect, useState } from 'react';
import InitialsAvatar from 'components/atoms/customer/InitialsAvatar';
import CustomerInsightLine from 'components/molecules/customer/CustomerInsightLine';
import CustomerInsightSummary from 'components/molecules/customer/CustomerInsightSummary';
import { formatRupiah, getCustomerStatusColor } from 'utils/customerInsights';

const NEW_CUSTOMER_INSIGHT = {
  orders_total: 0,
  orders_30d: 0,
  orders_90d: 0,
  avg_order_value: 0,
  days_since_last_order: null,
  preferred_class: 'SAMPEL_KECIL',
  preferred_sample_size: 0,
  confidence_label: 'rendah',
  outstanding_amount: 0,
  unpaid_orders: 0,
  oldest_unpaid_days: 0,
  is_dummy: false,
};

const OrderCustomerBar = ({ nama, telpon, customerInsights, isExistingCustomer = false, onChoose }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [nama]);

  const insights = customerInsights || (nama && !isExistingCustomer ? NEW_CUSTOMER_INSIGHT : null);
  const debt = Number(insights?.outstanding_amount || 0);
  const statusColor = getCustomerStatusColor(insights);

  return (
    <>
      {!nama ? (
        <button
          type="button"
          className="kasir-cust kasir-cust--empty"
          onClick={onChoose}
          aria-label="Pilih pelanggan, tekan F2"
        >
          <span className="kasir-cust__empty-icon">
            <i className="fas fa-user-plus" />
          </span>

          <span className="kasir-cust__empty-copy">
            <span className="kasir-cust__empty-title">Pilih Pelanggan</span>
            <span className="kasir-cust__empty-sub">Cari pelanggan atau tambah baru</span>
          </span>

          <kbd className="kasir-cust__key">F2</kbd>
        </button>
      ) : (
        <section className={`kasir-cust kasir-cust--selected ${debt > 0 ? 'has-debt' : ''}`}>
          <div className="kasir-cust__top">
            <div className="kasir-cust__avatar-wrap">
              <InitialsAvatar name={nama} size={42} />
              <span className="kasir-cust__status-badge" style={{ background: statusColor }} />
            </div>

            <div className="kasir-cust__info">
              <div className="kasir-cust__name-row">
                <span className="kasir-cust__name" title={nama}>{nama}</span>
                {telpon && (
                  <span className="kasir-cust__phone">
                    <i className="fab fa-whatsapp" /> {telpon}
                  </span>
                )}
              </div>

              <CustomerInsightLine insights={insights} />

              {debt > 0 && (
                <div className="kasir-cust__debt-pill">
                  <i className="fas fa-exclamation-circle" />
                  <span>Tunggakan: <strong>{formatRupiah(debt)}</strong></span>
                  {insights.unpaid_orders > 0 && (
                    <span className="kasir-cust__debt-count">({insights.unpaid_orders} nota)</span>
                  )}
                </div>
              )}
            </div>

            <div className="kasir-cust__tools">
              <button
                type="button"
                className="kasir-cust__tool"
                onClick={onChoose}
                title="Ganti pelanggan (F2)"
              >
                <i className="fas fa-user-edit" />
                <span>Ganti</span>
              </button>

              {insights && (
                <button
                  type="button"
                  className={`kasir-cust__tool kasir-cust__tool--ghost ${expanded ? 'is-open' : ''}`}
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-expanded={expanded}
                  title="Lihat riwayat & statistik pelanggan"
                >
                  <i className="fas fa-chart-line" />
                  <span>{expanded ? 'Tutup' : 'Insight'}</span>
                </button>
              )}
            </div>
          </div>

          {expanded && insights && (
            <div className="kasir-cust__history">
              <CustomerInsightSummary insights={insights} />
            </div>
          )}
        </section>
      )}

      <style>{`
        .kasir-cust {
          position: relative;
          z-index: 20;
          flex-shrink: 0;
          padding: 12px 14px;
          background: #ffffff;
          border-bottom: 1px solid #eef1f6;
          transition: background .15s ease;
        }
        .kasir-cust--empty {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border: 0;
          border-bottom: 1px solid #eef1f6;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          text-align: left;
          cursor: pointer;
        }
        .kasir-cust--empty:hover {
          background: linear-gradient(135deg, #edf2fe 0%, #e8eeff 100%);
        }
        .kasir-cust__empty-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #ffffff;
          color: #5e72e4;
          font-size: 0.95rem;
          border: 1px solid #dce4fb;
          box-shadow: 0 4px 10px rgba(94, 114, 228, 0.12);
        }
        .kasir-cust__empty-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .kasir-cust__empty-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
        }
        .kasir-cust__empty-sub {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
        }
        .kasir-cust__key {
          margin-left: auto;
          flex-shrink: 0;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #64748b;
          font-size: 0.64rem;
          font-weight: 800;
          font-family: inherit;
        }

        /* Selected State */
        .kasir-cust--selected.has-debt {
          background: #fff8f8;
          border-left: 3px solid #f5365c;
        }
        .kasir-cust__top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .kasir-cust__avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .kasir-cust__status-badge {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }
        .kasir-cust__info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .kasir-cust__name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .kasir-cust__name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }
        .kasir-cust__phone {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          white-space: nowrap;
        }
        .kasir-cust__phone i { color: #22c55e; }

        /* Debt pill */
        .kasir-cust__debt-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 0.68rem;
          font-weight: 700;
          width: fit-content;
        }
        .kasir-cust__debt-count {
          color: #991b1b;
          font-weight: 600;
        }

        /* Tools */
        .kasir-cust__tools {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }
        .kasir-cust__tool {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 26px;
          padding: 0 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-cust__tool:hover {
          border-color: #5e72e4;
          color: #5e72e4;
          background: #f8faff;
        }
        .kasir-cust__tool--ghost {
          color: #64748b;
        }
        .kasir-cust__tool--ghost.is-open {
          background: #e0e7ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        /* History drawer popup */
        .kasir-cust__history {
          position: absolute;
          top: calc(100% - 2px);
          left: 10px;
          right: 10px;
          z-index: 40;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.25), 0 4px 12px rgba(15, 23, 42, 0.06);
          max-height: min(52vh, 360px);
          overflow-y: auto;
        }

        /* ── Dark Mode ───────────────────────────────────────── */
        body.dark-mode .kasir-cust {
          background: #161b22;
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        body.dark-mode .kasir-cust--empty {
          background: linear-gradient(135deg, #1e293b 0%, #151b26 100%);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        body.dark-mode .kasir-cust--empty:hover {
          background: linear-gradient(135deg, #243247 0%, #1a2233 100%);
        }
        body.dark-mode .kasir-cust__empty-icon {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #60a5fa;
        }
        body.dark-mode .kasir-cust__empty-title { color: #f1f5f9; }
        body.dark-mode .kasir-cust__empty-sub { color: #94a3b8; }
        body.dark-mode .kasir-cust__key {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #94a3b8;
        }
        body.dark-mode .kasir-cust--selected.has-debt {
          background: rgba(239, 68, 68, 0.06);
          border-left-color: #ef4444;
        }
        body.dark-mode .kasir-cust__status-badge {
          border-color: #161b22;
        }
        body.dark-mode .kasir-cust__name { color: #f1f5f9; }
        body.dark-mode .kasir-cust__phone { color: #94a3b8; }
        body.dark-mode .kasir-cust__debt-pill {
          background: rgba(239, 68, 68, 0.18);
          border-color: rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }
        body.dark-mode .kasir-cust__debt-count { color: #fecaca; }
        body.dark-mode .kasir-cust__tool {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.12);
          color: #94a3b8;
        }
        body.dark-mode .kasir-cust__tool:hover {
          border-color: #60a5fa;
          color: #60a5fa;
        }
        body.dark-mode .kasir-cust__tool--ghost.is-open {
          background: rgba(99, 102, 241, 0.25);
          border-color: #818cf8;
          color: #c7d2fe;
        }
        body.dark-mode .kasir-cust__history {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </>
  );
};

export default OrderCustomerBar;

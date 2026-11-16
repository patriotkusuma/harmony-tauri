/* ================================================================
   Kasir — PaymentModal
   ----------------------------------------------------------------
   Modal pembayaran dirancang ulang:
   - total selalu terlihat di atas
   - pilihan cara bayar besar dan jelas
   - nominal cepat (uang pas / pembulatan) untuk mempercepat kasir
   - kembalian / uang kurang dibedakan warna dan teks
   ================================================================ */
import React, { useMemo } from 'react';
import { Modal } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const PAY_METHODS = [
  { key: 'cash', label: 'Tunai', icon: 'fas fa-money-bill-wave' },
  { key: 'qris', label: 'QRIS', icon: 'fas fa-qrcode' },
  { key: 'tf', label: 'Transfer', icon: 'fas fa-university' },
];

const PaymentModal = ({
  isOpen,
  toggle,
  valueBayar,
  setValueBayar,
  tipeBayar,
  setTipeBayar,
  subTotal,
  onSubmitPayment,
  nama,
}) => {
  const total = Number(subTotal) || 0;
  const received = Number(valueBayar) || 0;
  const changeAmount = received - total;
  const isEnough = changeAmount >= 0;

  const quickAmounts = useMemo(() => {
    if (total <= 0) return [];
    const roundUp = (step) => Math.ceil(total / step) * step;
    const values = [total, roundUp(5000), roundUp(10000), roundUp(50000), roundUp(100000)];
    return [...new Set(values.filter((value) => value > 0))]
      .sort((a, b) => a - b)
      .slice(0, 4);
  }, [total]);

  const displayValue = received > 0 ? received.toLocaleString('id-ID') : '';

  const handleAmountChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '');
    setValueBayar(digits ? parseInt(digits, 10) : 0);
  };

  const handleMethodChange = (method) => {
    setTipeBayar(method);
    // QRIS / transfer dianggap uang pas, jadi tombol simpan langsung aktif.
    if (method !== 'cash' && total > 0 && received < total) {
      setValueBayar(total);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isEnough) {
      event.preventDefault();
      onSubmitPayment?.();
    }
  };

  return (
    <Modal
      centered
      isOpen={isOpen}
      autoFocus={false}
      toggle={toggle}
      contentClassName="kasir-pay-modal"
    >
      <div className="kasir-pay">
        <header className="kasir-pay__head">
          <span className="kasir-pay__head-icon">
            <i className="fas fa-receipt" />
          </span>
          <div className="kasir-pay__head-copy">
            <span className="kasir-pay__head-title">Pembayaran</span>
            <span className="kasir-pay__head-sub">
              {nama ? `Pesanan ${nama}` : 'Selesaikan pembayaran pesanan'}
            </span>
          </div>
          <button
            type="button"
            className="kasir-pay__close"
            onClick={toggle}
            aria-label="Tutup pembayaran"
          >
            <i className="fas fa-times" />
          </button>
        </header>

        <div className="kasir-pay__body">
          <div className="kasir-pay__total">
            <span className="kasir-pay__total-label">Total tagihan</span>
            <strong className="kasir-pay__total-amount">
              <RupiahFormater value={total} />
            </strong>
          </div>

          <div className="kasir-pay__label">Cara bayar</div>
          <div className="kasir-pay__methods">
            {PAY_METHODS.map((method) => (
              <button
                key={method.key}
                type="button"
                className={`kasir-pay__method ${tipeBayar === method.key ? 'is-active' : ''}`}
                onClick={() => handleMethodChange(method.key)}
              >
                <i className={method.icon} />
                <span>{method.label}</span>
              </button>
            ))}
          </div>

          <div className="kasir-pay__label kasir-pay__label--amount">
            Uang diterima
            {tipeBayar !== 'cash' && <span>· non-tunai dianggap pas</span>}
          </div>

          <div className="kasir-pay__amount">
            <span className="kasir-pay__currency">Rp</span>
            <input
              autoFocus
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleAmountChange}
              onKeyDown={handleKeyDown}
              placeholder="0"
              aria-label="Uang diterima"
            />
          </div>

          {quickAmounts.length > 0 && (
            <div className="kasir-pay__quick">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`kasir-pay__quick-btn ${received === amount ? 'is-active' : ''}`}
                  onClick={() => setValueBayar(amount)}
                >
                  {amount === total ? 'Uang pas' : <RupiahFormater value={amount} />}
                </button>
              ))}
            </div>
          )}

          <div className={`kasir-pay__change ${isEnough ? 'is-enough' : 'is-short'}`}>
            <span className="kasir-pay__change-label">
              <i className={`fas ${isEnough ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
              {isEnough ? 'Kembalian' : 'Uang kurang'}
            </span>
            <strong className="kasir-pay__change-amount">
              <RupiahFormater value={Math.abs(changeAmount)} />
            </strong>
          </div>
        </div>

        <footer className="kasir-pay__footer">
          <button type="button" className="kasir-pay__cancel" onClick={toggle}>
            Batal
          </button>
          <button
            type="button"
            className="kasir-pay__submit"
            disabled={!isEnough}
            onClick={onSubmitPayment}
          >
            <span>{isEnough ? 'Bayar & Simpan' : 'Uang belum cukup'}</span>
            <i className="fas fa-check" />
          </button>
        </footer>
      </div>

      <style>{`
        .kasir-pay-modal {
          border: 0 !important;
          border-radius: 22px !important;
          overflow: hidden;
          max-height: calc(100vh - 24px);
          box-shadow: 0 40px 90px -24px rgba(8, 18, 48, .6) !important;
        }
        .kasir-pay {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 24px);
          background: #fff;
        }
        .kasir-pay__head {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          padding: 16px 18px;
          background: linear-gradient(135deg, #232f4b 0%, #32325d 100%);
          color: #fff;
        }
        .kasir-pay__head-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, .14);
          border: 1px solid rgba(255, 255, 255, .22);
          font-size: .95rem;
        }
        .kasir-pay__head-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .kasir-pay__head-title {
          font-size: 1.02rem;
          font-weight: 900;
          line-height: 1.2;
        }
        .kasir-pay__head-sub {
          margin-top: 1px;
          font-size: .7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kasir-pay__close {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, .12);
          color: #fff;
          font-size: .66rem;
          cursor: pointer;
        }
        .kasir-pay__close:hover { background: rgba(255, 255, 255, .24); }
        .kasir-pay__body { padding: 14px 18px 10px; overflow-y: auto; }
        .kasir-pay__total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f4f6ff 0%, #f8f9ff 100%);
          border: 1px solid #e6eaf8;
        }
        .kasir-pay__total-label {
          font-size: .72rem;
          font-weight: 800;
          color: #6b7c93;
        }
        .kasir-pay__total-amount {
          font-size: 1.28rem;
          font-weight: 900;
          color: #32325d;
          line-height: 1.1;
          white-space: nowrap;
        }
        .kasir-pay__label {
          margin: 13px 0 6px;
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #8898aa;
        }
        .kasir-pay__label--amount {
          display: flex;
          align-items: baseline;
          gap: 5px;
          flex-wrap: wrap;
        }
        .kasir-pay__label--amount span {
          font-size: .58rem;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
          color: #a3aed0;
        }
        .kasir-pay__methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }
        .kasir-pay__method {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 58px;
          border: 1.5px solid #e9edf5;
          border-radius: 12px;
          background: #fff;
          color: #8898aa;
          font-size: .7rem;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-pay__method i { font-size: .9rem; }
        .kasir-pay__method:hover { border-color: #c7d0f5; color: #5e72e4; background: #fbfcff; }
        .kasir-pay__method.is-active {
          border-color: #5e72e4;
          background: #f2f4ff;
          color: #5e72e4;
          box-shadow: 0 6px 14px -8px rgba(94, 114, 228, .8);
        }
        .kasir-pay__amount {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 2px solid #dfe3eb;
          border-radius: 14px;
          background: #fbfcff;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .kasir-pay__amount:focus-within {
          border-color: #5e72e4;
          box-shadow: 0 0 0 3px rgba(94, 114, 228, .12);
          background: #fff;
        }
        .kasir-pay__currency {
          font-size: .92rem;
          font-weight: 800;
          color: #8898aa;
        }
        .kasir-pay__amount input {
          flex: 1;
          min-width: 0;
          border: 0;
          background: transparent;
          color: #32325d;
          font-size: 1.9rem;
          font-weight: 900;
          letter-spacing: -.01em;
          outline: none;
          line-height: 1.2;
        }
        .kasir-pay__amount input::placeholder { color: #cbd3e1; }
        .kasir-pay__quick {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .kasir-pay__quick-btn {
          height: 30px;
          padding: 0 11px;
          border: 1px solid #e4e8f2;
          border-radius: 999px;
          background: #fff;
          color: #525f7f;
          font-size: .68rem;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-pay__quick-btn:hover { border-color: #c7d0f5; color: #5e72e4; background: #f9faff; }
        .kasir-pay__quick-btn.is-active {
          border-color: #5e72e4;
          background: #5e72e4;
          color: #fff;
        }
        .kasir-pay__change {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
          padding: 9px 12px;
          border-radius: 11px;
          border: 1px solid transparent;
        }
        .kasir-pay__change.is-enough {
          background: #f0fbf6;
          border-color: rgba(45, 206, 137, .25);
          color: #1a8f5e;
        }
        .kasir-pay__change.is-short {
          background: #fff5f7;
          border-color: rgba(245, 54, 92, .25);
          color: #f5365c;
        }
        .kasir-pay__change-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: .74rem;
          font-weight: 800;
        }
        .kasir-pay__change-label i { font-size: .72rem; }
        .kasir-pay__change-amount {
          font-size: 1rem;
          font-weight: 900;
          white-space: nowrap;
        }
        .kasir-pay__footer {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          padding: 10px 18px 18px;
        }
        .kasir-pay__cancel {
          height: 46px;
          padding: 0 16px;
          border: 1px solid #e4e8f2;
          border-radius: 12px;
          background: #fff;
          color: #525f7f;
          font-size: .78rem;
          font-weight: 800;
          cursor: pointer;
        }
        .kasir-pay__cancel:hover { background: #f7f8fc; border-color: #d5dbea; }
        .kasir-pay__submit {
          flex: 1;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, #2dce89 0%, #1a9f68 100%);
          color: #fff;
          font-size: .86rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 22px -10px rgba(45, 206, 137, .9);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .kasir-pay__submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 26px -10px rgba(45, 206, 137, .9);
        }
        .kasir-pay__submit:disabled {
          background: #c6cede;
          color: #fff;
          box-shadow: none;
          cursor: not-allowed;
        }
        .kasir-pay__submit i { font-size: .72rem; }

        /* ── Dark mode ─────────────────────────────────────── */
        body.dark-mode .kasir-pay-modal {
          box-shadow: 0 40px 90px -24px rgba(0, 0, 0, .9) !important;
        }
        body.dark-mode .kasir-pay { background: #161b22; }
        body.dark-mode .kasir-pay__head {
          background: linear-gradient(135deg, #111827 0%, #1e293b 100%);
        }
        body.dark-mode .kasir-pay__head-icon {
          background: rgba(255, 255, 255, .08);
          border-color: rgba(255, 255, 255, .14);
        }
        body.dark-mode .kasir-pay__head-sub { color: rgba(255, 255, 255, .55); }
        body.dark-mode .kasir-pay__close {
          background: rgba(255, 255, 255, .08);
          color: #cbd5e1;
        }
        body.dark-mode .kasir-pay__close:hover { background: rgba(255, 255, 255, .18); }
        body.dark-mode .kasir-pay__total {
          background: linear-gradient(135deg, #1e293b 0%, #182233 100%);
          border-color: rgba(255, 255, 255, .08);
        }
        body.dark-mode .kasir-pay__total-label { color: #94a3b8; }
        body.dark-mode .kasir-pay__total-amount { color: #f8fafc; }
        body.dark-mode .kasir-pay__label { color: #94a3b8; }
        body.dark-mode .kasir-pay__label--amount span { color: #64748b; }
        body.dark-mode .kasir-pay__method {
          background: #0f172a;
          border-color: rgba(255, 255, 255, .1);
          color: #94a3b8;
        }
        body.dark-mode .kasir-pay__method:hover {
          background: #1e293b;
          border-color: #3b82f6;
          color: #93c5fd;
        }
        body.dark-mode .kasir-pay__method.is-active {
          background: rgba(96, 165, 250, .14);
          border-color: #60a5fa;
          color: #93c5fd;
          box-shadow: 0 6px 14px -8px rgba(0, 0, 0, .8);
        }
        body.dark-mode .kasir-pay__amount {
          background: #0f172a;
          border-color: rgba(255, 255, 255, .12);
        }
        body.dark-mode .kasir-pay__amount:focus-within {
          background: #0f172a;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, .15);
        }
        body.dark-mode .kasir-pay__currency { color: #94a3b8; }
        body.dark-mode .kasir-pay__amount input { color: #f1f5f9; }
        body.dark-mode .kasir-pay__amount input::placeholder { color: #475569; }
        body.dark-mode .kasir-pay__quick-btn {
          background: #1e293b;
          border-color: rgba(255, 255, 255, .1);
          color: #cbd5e1;
        }
        body.dark-mode .kasir-pay__quick-btn:hover {
          background: #243247;
          border-color: #3b82f6;
          color: #93c5fd;
        }
        body.dark-mode .kasir-pay__quick-btn.is-active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }
        body.dark-mode .kasir-pay__change.is-enough {
          background: rgba(45, 206, 137, .1);
          border-color: rgba(45, 206, 137, .28);
          color: #4ade80;
        }
        body.dark-mode .kasir-pay__change.is-short {
          background: rgba(245, 54, 92, .12);
          border-color: rgba(245, 54, 92, .3);
          color: #fb7185;
        }
        body.dark-mode .kasir-pay__cancel {
          background: #1e293b;
          border-color: rgba(255, 255, 255, .1);
          color: #cbd5e1;
        }
        body.dark-mode .kasir-pay__cancel:hover {
          background: #243247;
          border-color: rgba(255, 255, 255, .18);
        }
        body.dark-mode .kasir-pay__submit:disabled {
          background: #334155;
          color: #94a3b8;
        }
        @media (max-width: 575.98px) {
          .kasir-pay__head { padding: 14px 14px; }
          .kasir-pay__body { padding: 12px 14px 8px; }
          .kasir-pay__footer { padding: 8px 14px 14px; }
          .kasir-pay__amount input { font-size: 1.55rem; }
          .kasir-pay__total-amount { font-size: 1.12rem; }
        }
      `}</style>
    </Modal>
  );
};

export default PaymentModal;

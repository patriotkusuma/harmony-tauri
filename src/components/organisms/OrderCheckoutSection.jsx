/* ================================================================
   Kasir — OrderCheckoutSection
   ----------------------------------------------------------------
   Kaki tiket pesanan. Tingginya dijaga tetap supaya:
   - total & tombol Proses Pesanan selalu terlihat
   - pengaturan tambahan tidak mendorong apa pun (dibuka di modal)
   ================================================================ */
import React, { useState } from 'react';
import { Input, Modal } from 'reactstrap';
import dayjs from 'dayjs';
import RupiahFormater from 'utils/RupiahFormater';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { formatRupiah } from 'utils/customerInsights';

const SettingRow = ({ icon, title, description, checked, onClick, tone = 'success' }) => (
  <button
    type="button"
    className={`kasir-set__row ${checked ? 'is-on' : ''} kasir-set__row--${tone}`}
    onClick={onClick}
  >
    <span className="kasir-set__row-icon">
      <i className={icon} />
    </span>
    <span className="kasir-set__row-copy">
      <span className="kasir-set__row-title">{title}</span>
      {description && <span className="kasir-set__row-desc">{description}</span>}
    </span>
    <span className={`kasir-set__switch ${checked ? 'is-on' : ''}`} aria-hidden="true">
      <span />
    </span>
  </button>
);

const OrderCheckoutSection = ({
  nama,
  telpon,
  estimasi,
  subTotal,
  isLunas,
  setIsLunas,
  antar,
  setAntar,
  gabungBill,
  setGabungBill,
  keterangan,
  setKeterangan,
  onSubmitOrder,
  isOrderDisabled,
  onSendConfirmation,
  customerInsights,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const debt = Number(customerInsights?.outstanding_amount || 0);
  const hasDebt = debt > 0;
  const hasItems = Number(subTotal || 0) > 0;

  const estimasiText = estimasi && hasItems
    ? dayjs(estimasi).format('HH:mm, DD MMM YY')
    : null;

  const activeSettings = [];
  if (antar === 1) activeSettings.push('Antar/jemput');
  if (hasDebt && gabungBill) activeSettings.push('Gabung tagihan');
  if (keterangan?.trim()) activeSettings.push('Catatan');

  const disabledHint = !nama
    ? 'Pilih pelanggan dulu'
    : !hasItems
      ? 'Pilih paket cucian dulu'
      : 'Lengkapi data pesanan dulu';

  const closeSettings = () => setSettingsOpen(false);

  const handleSendConfirmation = async () => {
    if (!telpon) {
      toast.warning('Nomor WhatsApp pelanggan belum diisi.');
      return;
    }

    const { value: weight } = await Swal.fire({
      title: 'Kirim tagihan ke WhatsApp',
      input: 'number',
      inputLabel: 'Berat cucian (kg)',
      inputPlaceholder: 'Misal: 2.5',
      inputAttributes: { step: '0.1', min: '0' },
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2dce89',
      html: '<p class="small text-muted mb-0">Pelanggan akan menerima rincian tagihan yang belum dibayar.</p>',
    });

    if (!weight) return;

    try {
      // Backend memakai satuan gram.
      const weightInGrams = parseFloat(weight) * 1000;
      await onSendConfirmation(weightInGrams);
      toast.success('Tagihan berhasil dikirim ke WhatsApp.');
    } catch (error) {
      toast.error('Gagal mengirim tagihan ke WhatsApp.');
    }
  };

  return (
    <>
      <footer className="kasir-co">
        <div className="kasir-co__pay" role="group" aria-label="Cara pembayaran">
          <button
            type="button"
            className={`kasir-co__pay-btn kasir-co__pay-btn--later ${!isLunas ? 'is-active' : ''}`}
            onClick={() => setIsLunas(false)}
          >
            <i className="fas fa-clock" />
            <span>Bayar Nanti</span>
          </button>

          <button
            type="button"
            className={`kasir-co__pay-btn kasir-co__pay-btn--now ${isLunas ? 'is-active' : ''}`}
            onClick={() => setIsLunas(true)}
          >
            <i className="fas fa-money-bill-wave" />
            <span>Bayar Sekarang</span>
          </button>
        </div>

        <div className="kasir-co__total">
          <div className="kasir-co__total-copy">
            <span className="kasir-co__total-label">Total tagihan</span>
            <span className="kasir-co__total-sub">
              {estimasiText ? (
                <>
                  <i className="fas fa-clock" /> Selesai sekitar {estimasiText}
                </>
              ) : (
                'Belum ada paket dipilih'
              )}
            </span>
          </div>
          <strong className="kasir-co__total-amount">
            <RupiahFormater value={subTotal} />
          </strong>
        </div>

        <div className="kasir-co__actions">
          <button
            type="button"
            className="kasir-co__settings"
            onClick={() => setSettingsOpen(true)}
            title={activeSettings.length > 0 ? activeSettings.join(' · ') : 'Pengaturan tambahan'}
          >
            <i className="fas fa-sliders-h" />
            <span>Atur</span>
            {activeSettings.length > 0 && (
              <b className="kasir-co__settings-badge">{activeSettings.length}</b>
            )}
          </button>

          <button
            type="button"
            className={`kasir-co__submit ${isLunas ? 'is-paying' : ''}`}
            disabled={isOrderDisabled}
            onClick={onSubmitOrder}
          >
            <span className="kasir-co__submit-copy">
              <span className="kasir-co__submit-title">
                Proses Pesanan
                {!isOrderDisabled && <kbd className="kasir-co__submit-key">F8</kbd>}
              </span>
              <span className="kasir-co__submit-sub">
                {isOrderDisabled
                  ? disabledHint
                  : isLunas
                    ? 'Lanjut ke pembayaran'
                    : 'Simpan sebagai belum dibayar'}
              </span>
            </span>
            <span className="kasir-co__submit-arrow">
              <i className="fas fa-arrow-right" />
            </span>
          </button>
        </div>
      </footer>

      <Modal
        isOpen={settingsOpen}
        toggle={closeSettings}
        centered
        contentClassName="kasir-set-modal"
      >
        <div className="kasir-set">
          <header className="kasir-set__head">
            <div>
              <h4>Pengaturan Pesanan</h4>
              <p>Opsional — ubah kalau perlu.</p>
            </div>
            <button
              type="button"
              className="kasir-set__close"
              onClick={closeSettings}
              aria-label="Tutup pengaturan"
            >
              <i className="fas fa-times" />
            </button>
          </header>

          <div className="kasir-set__body">
            <SettingRow
              icon="fas fa-truck"
              title="Antar / jemput"
              description={antar === 1 ? 'Pesanan diantar atau dijemput.' : 'Pelanggan ambil sendiri di outlet.'}
              checked={antar === 1}
              onClick={() => setAntar(antar === 1 ? 0 : 1)}
            />

            {hasDebt && (
              <SettingRow
                icon="fas fa-object-group"
                title="Gabung dengan tagihan lama"
                description={`Masih ada tagihan ${formatRupiah(debt)}.`}
                checked={gabungBill}
                onClick={() => setGabungBill(!gabungBill)}
                tone="info"
              />
            )}

            <div className="kasir-set__note">
              <label htmlFor="order-note" className="kasir-set__note-label">
                <i className="fas fa-sticky-note" /> Catatan
                <span>opsional</span>
              </label>
              <Input
                id="order-note"
                type="textarea"
                rows="3"
                className="kasir-set__note-input"
                placeholder="Misal: baju luntur, titip jemput jam 5..."
                value={keterangan}
                onChange={(event) => setKeterangan(event.target.value)}
              />
            </div>

            {telpon && hasDebt && (
              <button type="button" className="kasir-set__wa" onClick={handleSendConfirmation}>
                <span className="kasir-set__wa-icon">
                  <i className="fab fa-whatsapp" />
                </span>
                <span className="kasir-set__wa-copy">
                  <span className="kasir-set__wa-title">Kirim tagihan via WhatsApp</span>
                  <span className="kasir-set__wa-desc">Kirim rincian tagihan ke pelanggan.</span>
                </span>
                <i className="fas fa-paper-plane kasir-set__wa-send" />
              </button>
            )}
          </div>

          <footer className="kasir-set__footer">
            <button type="button" className="kasir-set__done" onClick={closeSettings}>
              Selesai
            </button>
          </footer>
        </div>
      </Modal>

      <style>{`
        .kasir-co {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 12px 12px;
          border-top: 1px solid #eef1f6;
          background: #fff;
          box-shadow: 0 -10px 24px -18px rgba(15, 23, 42, .4);
        }
        .kasir-co__pay {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 3px;
          border-radius: 10px;
          background: #f1f3f9;
        }
        .kasir-co__pay-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #8898aa;
          font-size: .7rem;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-co__pay-btn i { font-size: .66rem; }
        .kasir-co__pay-btn:hover { color: #525f7f; }
        .kasir-co__pay-btn.is-active {
          background: #fff;
          box-shadow: 0 2px 8px rgba(15, 23, 42, .1);
        }
        .kasir-co__pay-btn--later.is-active { color: #d9532f; }
        .kasir-co__pay-btn--now.is-active { color: #1a8f5e; }
        .kasir-co__total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 2px 2px 0;
        }
        .kasir-co__total-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .kasir-co__total-label {
          font-size: .68rem;
          font-weight: 800;
          color: #8898aa;
          line-height: 1.2;
        }
        .kasir-co__total-sub {
          margin-top: 1px;
          font-size: .61rem;
          font-weight: 600;
          color: #a3aed0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kasir-co__total-sub i { font-size: .56rem; color: #5e72e4; }
        .kasir-co__total-amount {
          font-size: 1.24rem;
          font-weight: 900;
          color: #32325d;
          line-height: 1.1;
          white-space: nowrap;
        }
        .kasir-co__actions {
          display: flex;
          gap: 7px;
        }
        .kasir-co__settings {
          position: relative;
          width: 52px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border: 1px solid #e4e8f2;
          border-radius: 11px;
          background: #fff;
          color: #525f7f;
          font-size: .56rem;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-co__settings:hover { border-color: #c7d0f5; color: #5e72e4; background: #f9faff; }
        .kasir-co__settings i { font-size: .8rem; }
        .kasir-co__settings-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 14px;
          height: 14px;
          padding: 0 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #5e72e4;
          color: #fff;
          font-size: .5rem;
          font-weight: 900;
        }
        .kasir-co__submit {
          flex: 1;
          min-width: 0;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 12px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, #5e72e4 0%, #4c5fd7 100%);
          color: #fff;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 10px 20px -10px rgba(94, 114, 228, .9);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .kasir-co__submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 24px -10px rgba(94, 114, 228, .9);
        }
        .kasir-co__submit.is-paying {
          background: linear-gradient(135deg, #2dce89 0%, #1a9f68 100%);
          box-shadow: 0 10px 20px -10px rgba(45, 206, 137, .9);
        }
        .kasir-co__submit.is-paying:not(:disabled):hover {
          box-shadow: 0 14px 24px -10px rgba(45, 206, 137, .9);
        }
        .kasir-co__submit:not(:disabled):active { transform: scale(.99); }
        .kasir-co__submit:disabled {
          background: #c6cede;
          box-shadow: none;
          cursor: not-allowed;
        }
        .kasir-co__submit-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .kasir-co__submit-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: .88rem;
          font-weight: 900;
          line-height: 1.2;
        }
        .kasir-co__submit-key {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1px 5px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          font-size: 0.6rem;
          font-weight: 800;
          font-family: inherit;
        }
        .kasir-co__submit-sub {
          font-size: .6rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .78);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kasir-co__submit:disabled .kasir-co__submit-sub { color: rgba(255, 255, 255, .9); }
        .kasir-co__submit-arrow {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, .16);
          font-size: .66rem;
        }

        /* ── Modal pengaturan ─────────────────────────────────── */
        .kasir-set-modal {
          border: 0 !important;
          border-radius: 18px !important;
          overflow: hidden;
          max-height: calc(100vh - 24px);
          box-shadow: 0 30px 70px -20px rgba(15, 23, 42, .5) !important;
        }
        .kasir-set {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 24px);
          background: #fff;
        }
        .kasir-set__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-shrink: 0;
          padding: 16px 18px 12px;
          border-bottom: 1px solid #eef1f6;
        }
        .kasir-set__head h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 900;
          color: #32325d;
          line-height: 1.2;
        }
        .kasir-set__head p {
          margin: 2px 0 0;
          font-size: .72rem;
          font-weight: 600;
          color: #8898aa;
        }
        .kasir-set__close {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #f4f6fb;
          color: #8898aa;
          font-size: .62rem;
          cursor: pointer;
        }
        .kasir-set__close:hover { background: #e9ecf5; color: #525f7f; }
        .kasir-set__body {
          max-height: 54vh;
          overflow-y: auto;
          padding: 14px 18px 4px;
        }
        .kasir-set__row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          margin-bottom: 7px;
          border: 1px solid #eef1f6;
          border-radius: 11px;
          background: #fcfcfe;
          text-align: left;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-set__row:hover { background: #f8f9ff; border-color: #dfe3f2; }
        .kasir-set__row-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f2f4f9;
          color: #8898aa;
          font-size: .72rem;
        }
        .kasir-set__row.is-on .kasir-set__row-icon {
          background: rgba(45, 206, 137, .13);
          color: #2dce89;
        }
        .kasir-set__row--info.is-on .kasir-set__row-icon {
          background: rgba(17, 205, 239, .13);
          color: #11cdef;
        }
        .kasir-set__row-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .kasir-set__row-title {
          font-size: .76rem;
          font-weight: 800;
          color: #525f7f;
          line-height: 1.25;
        }
        .kasir-set__row-desc {
          font-size: .64rem;
          font-weight: 600;
          color: #a3aed0;
          line-height: 1.3;
        }
        .kasir-set__switch {
          position: relative;
          width: 34px;
          height: 19px;
          flex-shrink: 0;
          border-radius: 999px;
          background: #d9dee8;
          transition: background .15s ease;
        }
        .kasir-set__switch span {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
          transition: transform .15s ease;
        }
        .kasir-set__switch.is-on { background: #2dce89; }
        .kasir-set__row--info .kasir-set__switch.is-on { background: #11cdef; }
        .kasir-set__switch.is-on span { transform: translateX(15px); }
        .kasir-set__note { margin-bottom: 7px; }
        .kasir-set__note-label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 5px;
          font-size: .72rem;
          font-weight: 800;
          color: #525f7f;
        }
        .kasir-set__note-label i { font-size: .62rem; color: #8898aa; }
        .kasir-set__note-label span {
          font-size: .6rem;
          font-weight: 600;
          color: #a3aed0;
        }
        .kasir-set__note-input {
          border: 1px solid #e4e8f0 !important;
          border-radius: 9px !important;
          font-size: .78rem !important;
          font-weight: 500 !important;
          background: #fcfcfe !important;
          box-shadow: none !important;
          resize: none;
        }
        .kasir-set__note-input:focus { border-color: #5e72e4 !important; background: #fff !important; }
        .kasir-set__wa {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 8px 10px;
          margin-bottom: 8px;
          border: 1px solid rgba(45, 206, 137, .25);
          border-radius: 11px;
          background: #f2fcf7;
          text-align: left;
          cursor: pointer;
        }
        .kasir-set__wa-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #2dce89;
          color: #fff;
          font-size: .8rem;
        }
        .kasir-set__wa-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .kasir-set__wa-title { font-size: .74rem; font-weight: 800; color: #1a8f5e; }
        .kasir-set__wa-desc { font-size: .63rem; font-weight: 600; color: #66b895; }
        .kasir-set__wa-send { font-size: .62rem; color: #2dce89; }
        .kasir-set__footer { flex-shrink: 0; padding: 10px 18px 16px; }
        .kasir-set__done {
          width: 100%;
          height: 44px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, #5e72e4 0%, #4c5fd7 100%);
          color: #fff;
          font-size: .84rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 20px -10px rgba(94, 114, 228, .9);
        }

        /* ── Dark mode ─────────────────────────────────────── */
        body.dark-mode .kasir-co {
          background: #161b22;
          border-top-color: rgba(255, 255, 255, .06);
          box-shadow: 0 -10px 24px -18px rgba(0, 0, 0, .85);
        }
        body.dark-mode .kasir-co__pay { background: #0f172a; }
        body.dark-mode .kasir-co__pay-btn { color: #94a3b8; }
        body.dark-mode .kasir-co__pay-btn:hover { color: #cbd5e1; }
        body.dark-mode .kasir-co__pay-btn.is-active {
          background: #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, .45);
        }
        body.dark-mode .kasir-co__pay-btn--later.is-active { color: #fb923c; }
        body.dark-mode .kasir-co__pay-btn--now.is-active { color: #4ade80; }
        body.dark-mode .kasir-co__total-label { color: #94a3b8; }
        body.dark-mode .kasir-co__total-sub { color: #64748b; }
        body.dark-mode .kasir-co__total-sub i { color: #60a5fa; }
        body.dark-mode .kasir-co__total-amount { color: #f8fafc; }
        body.dark-mode .kasir-co__settings {
          background: #1e293b;
          border-color: rgba(255, 255, 255, .1);
          color: #cbd5e1;
        }
        body.dark-mode .kasir-co__settings:hover {
          background: #243247;
          border-color: #3b82f6;
          color: #93c5fd;
        }
        body.dark-mode .kasir-co__settings-badge { background: #3b82f6; }
        body.dark-mode .kasir-co__submit:disabled { background: #334155; }
        body.dark-mode .kasir-set { background: #161b22; }
        body.dark-mode .kasir-set__head {
          background: #161b22;
          border-bottom-color: rgba(255, 255, 255, .06);
        }
        body.dark-mode .kasir-set__head h4 { color: #f1f5f9; }
        body.dark-mode .kasir-set__head p { color: #94a3b8; }
        body.dark-mode .kasir-set__close {
          background: rgba(255, 255, 255, .08);
          color: #94a3b8;
        }
        body.dark-mode .kasir-set__close:hover {
          background: rgba(255, 255, 255, .14);
          color: #e2e8f0;
        }
        body.dark-mode .kasir-set__row {
          background: #1e293b;
          border-color: rgba(255, 255, 255, .06);
        }
        body.dark-mode .kasir-set__row:hover {
          background: #243247;
          border-color: rgba(255, 255, 255, .12);
        }
        body.dark-mode .kasir-set__row-icon {
          background: rgba(255, 255, 255, .06);
          color: #94a3b8;
        }
        body.dark-mode .kasir-set__row-title { color: #e2e8f0; }
        body.dark-mode .kasir-set__row-desc { color: #94a3b8; }
        body.dark-mode .kasir-set__switch { background: #475569; }
        body.dark-mode .kasir-set__note-label { color: #e2e8f0; }
        body.dark-mode .kasir-set__note-label i,
        body.dark-mode .kasir-set__note-label span { color: #94a3b8; }
        body.dark-mode .kasir-set__note-input {
          background: #0f172a !important;
          border-color: rgba(255, 255, 255, .1) !important;
          color: #e2e8f0 !important;
        }
        body.dark-mode .kasir-set__note-input:focus {
          background: #0f172a !important;
          border-color: #60a5fa !important;
        }
        body.dark-mode .kasir-set__wa {
          background: rgba(45, 206, 137, .08);
          border-color: rgba(45, 206, 137, .22);
        }
        body.dark-mode .kasir-set__wa-title { color: #4ade80; }
        body.dark-mode .kasir-set__wa-desc { color: #86efac; }
      `}</style>
    </>
  );
};

export default OrderCheckoutSection;

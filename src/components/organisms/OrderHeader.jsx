/* ================================================================
   Kasir — OrderHeader
   ----------------------------------------------------------------
   Header halaman: identitas halaman, kode pesanan, dan aksi cepat.
   Dibuat tipis supaya ruang katalog & tiket pesanan tetap lega.
   ================================================================ */
import React from 'react';

const pad = (value) => String(value).padStart(2, '0');

const todayLabel = () => {
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

const ActionButton = ({ icon, label, shortcut, onClick }) => (
  <button type="button" className="kasir-head__action" onClick={onClick} title={`${label} (${shortcut})`}>
    <i className={icon} />
    <span className="kasir-head__action-label">{label}</span>
    <kbd className="kasir-head__key">{shortcut}</kbd>
  </button>
);

const OrderHeader = ({ kodePesan, onPrintNama, onPrintLastOrder, onRFIDAttach }) => {
  const now = new Date();

  return (
    <header className="kasir-head">
      <div className="kasir-head__brand">
        <div className="kasir-head__icon">
          <i className="fas fa-cash-register" />
        </div>
        <div className="kasir-head__copy">
          <h1>Kasir</h1>
          <p>
            {todayLabel()} · {pad(now.getHours())}.{pad(now.getMinutes())}
          </p>
        </div>
      </div>

      <div className="kasir-head__right">
        {kodePesan && (
          <div className="kasir-head__code">
            <span>Kode pesanan</span>
            <strong>{kodePesan}</strong>
          </div>
        )}

        <div className="kasir-head__actions">
          <ActionButton
            icon="fas fa-print"
            label="Cetak Nama"
            shortcut="F5"
            onClick={onPrintNama}
          />
          <ActionButton
            icon="fas fa-receipt"
            label="Struk Terakhir"
            shortcut="F3"
            onClick={onPrintLastOrder}
          />
          <ActionButton
            icon="fas fa-link"
            label="RFID"
            shortcut="F4"
            onClick={onRFIDAttach}
          />
        </div>
      </div>

      <style>{`
        .kasir-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .kasir-head__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .kasir-head__icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 14px;
          color: #fff;
          font-size: 1.05rem;
          background: rgba(255, 255, 255, .16);
          border: 1px solid rgba(255, 255, 255, .28);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25);
          backdrop-filter: blur(6px);
        }
        .kasir-head__copy h1 {
          margin: 0;
          font-size: 1.42rem;
          font-weight: 900;
          letter-spacing: .01em;
          color: #fff;
          line-height: 1.1;
          text-shadow: 0 2px 10px rgba(8, 18, 48, .25);
        }
        .kasir-head__copy p {
          margin: 2px 0 0;
          font-size: .74rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .78);
        }
        .kasir-head__right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .kasir-head__code {
          display: flex;
          flex-direction: column;
          padding: 7px 12px;
          border-radius: 11px;
          background: rgba(8, 18, 48, .22);
          border: 1px solid rgba(255, 255, 255, .18);
          color: #fff;
          line-height: 1.2;
          backdrop-filter: blur(6px);
        }
        .kasir-head__code span {
          font-size: .56rem;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, .62);
        }
        .kasir-head__code strong {
          margin-top: 1px;
          font-size: .74rem;
          font-weight: 800;
          letter-spacing: .02em;
          white-space: nowrap;
        }
        .kasir-head__actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .kasir-head__action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, .22);
          border-radius: 10px;
          background: rgba(255, 255, 255, .13);
          color: #fff;
          font-size: .7rem;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background .15s ease, border-color .15s ease, transform .15s ease;
        }
        .kasir-head__action:hover {
          background: rgba(255, 255, 255, .24);
          border-color: rgba(255, 255, 255, .4);
          transform: translateY(-1px);
        }
        .kasir-head__action i { font-size: .72rem; }
        .kasir-head__key {
          padding: 1px 4px;
          border-radius: 4px;
          background: rgba(8, 18, 48, .28);
          border: 1px solid rgba(255, 255, 255, .18);
          color: rgba(255, 255, 255, .8);
          font-size: .54rem;
          font-weight: 700;
          font-family: inherit;
          line-height: 1.35;
        }
        @media (max-width: 575.98px) {
          .kasir-head__copy h1 { font-size: 1.2rem; }
          .kasir-head__action-label,
          .kasir-head__key { display: none; }
          .kasir-head__action { width: 34px; justify-content: center; padding: 0; }
          .kasir-head__code { display: none; }
        }
      `}</style>
    </header>
  );
};

export default OrderHeader;

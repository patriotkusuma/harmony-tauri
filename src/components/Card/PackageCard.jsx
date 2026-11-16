/* ================================================================
   Kasir — PackageCard
   ----------------------------------------------------------------
   Kartu paket besar: gambar, nama, harga, tombol tambah.
   Teks sengaja dibuat sedikit supaya mudah dilihat dan disentuh.
   ================================================================ */
import React from 'react';
import RupiahFormater from 'utils/RupiahFormater';
import { formatImageUrl } from 'utils/formatImageUrl';

const UNIT_LABELS = {
  per_kilo: 'kg',
  kilo_meter: 'm',
  kiloan: 'kg',
  kg: 'kg',
  kilogram: 'kg',
  meter: 'm',
  m: 'm',
  gr: 'gr',
  gram: 'gr',
  satuan: '',
};

const getUnitLabel = (tipeAtauSatuan) => {
  if (!tipeAtauSatuan) return '';
  const key = String(tipeAtauSatuan).toLowerCase();
  return key in UNIT_LABELS ? UNIT_LABELS[key] : tipeAtauSatuan;
};

const PackageCard = ({ paket, quantity = 0, onAddCart }) => {
  const inCart = Number(quantity) > 0;
  const unit = getUnitLabel(paket.tipe || paket.satuan);
  const image = formatImageUrl(paket.gambar);

  return (
    <button
      type="button"
      className={`kasir-pkg ${inCart ? 'is-added' : ''}`}
      onClick={() => onAddCart(paket.id)}
      title={`Tambah ${paket.nama}`}
    >
      <span className="kasir-pkg__photo">
        <span className="kasir-pkg__photo-fallback">
          <i className="fas fa-tshirt" />
        </span>
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        )}

        {inCart && <span className="kasir-pkg__qty">{quantity}</span>}
      </span>

      <span className="kasir-pkg__body">
        <span className="kasir-pkg__name">{paket.nama}</span>

        <span className="kasir-pkg__bottom">
          <span className="kasir-pkg__price">
            <RupiahFormater value={paket.harga} />
            {unit && <small>/{unit}</small>}
          </span>

          <span className="kasir-pkg__add" aria-hidden="true">
            <i className="fas fa-plus" />
          </span>
        </span>
      </span>

      <style>{`
        .kasir-pkg {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 1px solid #e9edf5;
          border-radius: 18px;
          background: #fff;
          text-align: left;
          overflow: hidden;
          cursor: pointer;
          transition: border-color .15s ease, box-shadow .18s ease, transform .18s ease;
        }
        .kasir-pkg:hover {
          border-color: #c7d0f5;
          box-shadow: 0 18px 34px -22px rgba(50, 50, 93, .55);
          transform: translateY(-2px);
        }
        .kasir-pkg:active { transform: scale(.995); }
        .kasir-pkg.is-added {
          border-color: #5e72e4;
          box-shadow: 0 0 0 2px rgba(94, 114, 228, .25);
        }
        .kasir-pkg__photo {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: linear-gradient(135deg, #eef1ff 0%, #e3e9ff 100%);
          overflow: hidden;
        }
        .kasir-pkg__photo-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a9b4ec;
          font-size: 2rem;
        }
        .kasir-pkg__photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .25s ease;
        }
        .kasir-pkg:hover .kasir-pkg__photo img { transform: scale(1.04); }
        .kasir-pkg__qty {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          min-width: 30px;
          height: 30px;
          padding: 0 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #5e72e4;
          color: #fff;
          font-size: .82rem;
          font-weight: 900;
          box-shadow: 0 6px 14px rgba(94, 114, 228, .5);
        }
        .kasir-pkg__body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          padding: 12px 14px 14px;
        }
        .kasir-pkg__name {
          font-size: 1rem;
          font-weight: 900;
          color: #32325d;
          line-height: 1.28;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5em;
        }
        .kasir-pkg__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
        }
        .kasir-pkg__price {
          font-size: 1.02rem;
          font-weight: 900;
          color: #32325d;
          line-height: 1.15;
          white-space: nowrap;
        }
        .kasir-pkg__price small {
          font-size: .7rem;
          font-weight: 700;
          color: #a3aed0;
        }
        .kasir-pkg__add {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eef1ff;
          color: #5e72e4;
          font-size: .78rem;
          transition: background .15s ease, color .15s ease;
        }
        .kasir-pkg:hover .kasir-pkg__add { background: #5e72e4; color: #fff; }
        .kasir-pkg.is-added .kasir-pkg__add { background: #5e72e4; color: #fff; }

        /* ── Dark mode ─────────────────────────────────────── */
        body.dark-mode .kasir-pkg {
          background: #1e293b;
          border-color: rgba(255, 255, 255, .07);
        }
        body.dark-mode .kasir-pkg:hover {
          background: #243247;
          border-color: #3b82f6;
          box-shadow: 0 18px 34px -22px rgba(0, 0, 0, .85);
        }
        body.dark-mode .kasir-pkg.is-added {
          background: #1e2a4a;
          border-color: #60a5fa;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, .25);
        }
        body.dark-mode .kasir-pkg__photo {
          background: linear-gradient(135deg, #1e293b 0%, #111827 100%);
        }
        body.dark-mode .kasir-pkg__photo-fallback { color: #475569; }
        body.dark-mode .kasir-pkg__name,
        body.dark-mode .kasir-pkg__price { color: #f1f5f9; }
        body.dark-mode .kasir-pkg__price small { color: #94a3b8; }
        body.dark-mode .kasir-pkg__add {
          background: rgba(96, 165, 250, .15);
          color: #93c5fd;
        }
        body.dark-mode .kasir-pkg:hover .kasir-pkg__add,
        body.dark-mode .kasir-pkg.is-added .kasir-pkg__add {
          background: #3b82f6;
          color: #fff;
        }
        body.dark-mode .kasir-pkg__qty {
          background: #3b82f6;
          box-shadow: 0 6px 14px rgba(0, 0, 0, .4);
        }
        @media (max-width: 575.98px) {
          .kasir-pkg { border-radius: 16px; }
          .kasir-pkg__body { padding: 10px 11px 12px; gap: 6px; }
          .kasir-pkg__name { font-size: .88rem; min-height: 2.4em; }
          .kasir-pkg__price { font-size: .9rem; }
          .kasir-pkg__add { width: 32px; height: 32px; font-size: .7rem; }
          .kasir-pkg__qty { min-width: 26px; height: 26px; font-size: .74rem; }
        }
      `}</style>
    </button>
  );
};

export default PackageCard;

/* ================================================================
   Kasir — OrderCartSection (Redesign Ergonomis)
   ----------------------------------------------------------------
   Peningkatan:
   - Header cart menampilkan total item & tombol bersihkan lebih jelas
   - Tombol Quick Step gram (+500g, +1kg, +2kg) untuk kiloan
   - Input Qty lebih responsif dengan stepper rapi
   - Visual subtotal lebih kontras dan konsisten
   ================================================================ */
import React, { useEffect, useState } from 'react';
import RupiahFormater from 'utils/RupiahFormater';
import {
  calculateLaundryItemSubtotal,
  findItemSatuan,
  findItemTipe,
  isWeightTipe,
} from 'utils/laundryCalc';

const TIPE_UNITS = {
  per_kilo: 'kg',
  kilo_meter: 'm',
  meter: 'm',
};

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
};

const getUnitLabel = (satuan) => {
  if (!satuan) return '';
  const key = String(satuan).toLowerCase();
  return UNIT_LABELS[key] || satuan;
};

const formatQty = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '';
  return String(number);
};

const CartItemRow = ({ item, itemTipe, itemSatuan, categories, onUpdateCart, onRemoveCart }) => {
  const isWeight = isWeightTipe(itemTipe);
  const priceUnit = isWeight
    ? TIPE_UNITS[String(itemTipe).toLowerCase()] || 'kg'
    : getUnitLabel(itemSatuan);
  const qtyUnit = isWeight ? 'gr' : getUnitLabel(itemSatuan);
  const step = isWeight ? 500 : 1;

  const serverQty = Number(item.qty) || 0;
  const [qty, setQty] = useState(serverQty);

  useEffect(() => {
    setQty(Number(item.qty) || 0);
  }, [item.qty, item.id_jenis_cuci]);

  const qtyMatchesServer = Math.abs((Number(qty) || 0) - serverQty) < 0.000001;
  const previewSubtotal =
    qtyMatchesServer && Number(item.sub_total) > 0
      ? Number(item.sub_total)
      : calculateLaundryItemSubtotal(
          { ...item, qty: Number(qty) || 0, sub_total: 0 },
          categories
        );

  const commit = (nextValue) => {
    const safeValue = Math.max(step, Number(nextValue) || step);
    setQty(safeValue);
    onUpdateCart?.(safeValue, item.id_jenis_cuci);
  };

  const handleInputChange = (event) => {
    const raw = event.target.value
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    setQty(raw);

    if (raw === '') return;
    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && parsed > 0) {
      onUpdateCart?.(parsed, item.id_jenis_cuci);
    }
  };

  const handleBlur = () => {
    const parsed = Number(qty);
    if (!parsed || parsed <= 0) {
      commit(step);
      return;
    }
    setQty(parsed);
  };

  return (
    <div className="kasir-cart__item">
      <div className="kasir-cart__item-top">
        <div className="kasir-cart__item-meta">
          <span className="kasir-cart__item-name" title={item.name}>{item.name}</span>
          <span className="kasir-cart__unit-price">
            <RupiahFormater value={item.price} />{priceUnit ? ` / ${priceUnit}` : ''}
          </span>
        </div>
        <button
          type="button"
          className="kasir-cart__remove"
          onClick={() => onRemoveCart(item)}
          title={`Hapus ${item.name}`}
          aria-label={`Hapus ${item.name}`}
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>

      <div className="kasir-cart__item-bottom">
        <div className="kasir-cart__qty-wrap">
          <div className="kasir-cart__qty">
            <button
              type="button"
              className="kasir-cart__qty-btn"
              onClick={() => commit(Number(qty) - step)}
              disabled={Number(qty) <= step}
              aria-label="Kurangi jumlah"
            >
              <i className="fas fa-minus" />
            </button>

            <input
              type="text"
              inputMode="decimal"
              className="kasir-cart__qty-input"
              value={typeof qty === 'string' ? qty : formatQty(qty)}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onFocus={(event) => event.target.select()}
              aria-label={`Jumlah ${item.name}`}
            />

            {qtyUnit && <span className="kasir-cart__qty-unit">{qtyUnit}</span>}

            <button
              type="button"
              className="kasir-cart__qty-btn"
              onClick={() => commit(Number(qty) + step)}
              aria-label="Tambah jumlah"
            >
              <i className="fas fa-plus" />
            </button>
          </div>

          {/* Quick Step Buttons khusus kiloan (+500g, +1kg) */}
          {isWeight && (
            <div className="kasir-cart__quick-steps">
              <button
                type="button"
                className="kasir-cart__quick-btn"
                onClick={() => commit(Number(qty) + 500)}
                title="Tambah 500 gram"
              >
                +500g
              </button>
              <button
                type="button"
                className="kasir-cart__quick-btn"
                onClick={() => commit(Number(qty) + 1000)}
                title="Tambah 1000 gram (1 kg)"
              >
                +1kg
              </button>
            </div>
          )}
        </div>

        <div className="kasir-cart__subtotal">
          <RupiahFormater value={previewSubtotal} />
        </div>
      </div>
    </div>
  );
};

const OrderCartSection = ({
  cartItems,
  onUpdateCart,
  onRemoveCart,
  onClearCart,
  categories,
}) => {
  const flattenedItems = [];
  if (cartItems) {
    Object.values(cartItems).forEach((val) => {
      if (Array.isArray(val)) {
        flattenedItems.push(...val);
      } else if (val) {
        flattenedItems.push(val);
      }
    });
  }

  const count = flattenedItems.length;

  return (
    <section className="kasir-cart">
      <header className="kasir-cart__head">
        <div className="kasir-cart__head-title">
          <span>Keranjang Cucian</span>
          {count > 0 && (
            <span className="kasir-cart__badge">{count} layanan</span>
          )}
        </div>

        {count > 0 && (
          <button
            type="button"
            className="kasir-cart__clear"
            onClick={onClearCart}
            title="Kosongkan seluruh keranjang"
          >
            <i className="fas fa-trash-alt me-1" /> Kosongkan
          </button>
        )}
      </header>

      <div className="kasir-cart__body">
        {count === 0 ? (
          <div className="kasir-cart__empty">
            <div className="kasir-cart__empty-icon">
              <i className="fas fa-shopping-basket" />
            </div>
            <strong>Keranjang masih kosong</strong>
            <p>Pilih paket layanan di sisi kiri untuk mulai membuat pesanan.</p>
          </div>
        ) : (
          <div className="kasir-cart__list">
            {flattenedItems.map((item) => {
              const itemTipe = findItemTipe(item, categories);
              const itemSatuan = findItemSatuan(item, categories);

              return (
                <CartItemRow
                  key={item.id_jenis_cuci}
                  item={item}
                  itemTipe={itemTipe}
                  itemSatuan={itemSatuan}
                  categories={categories}
                  onUpdateCart={onUpdateCart}
                  onRemoveCart={onRemoveCart}
                />
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .kasir-cart {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          background: #ffffff;
        }
        .kasir-cart__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #eef1f6;
          background: #fafbfd;
          flex-shrink: 0;
        }
        .kasir-cart__head-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .kasir-cart__badge {
          display: inline-flex;
          align-items: center;
          padding: 1px 6px;
          border-radius: 12px;
          background: #e0e7ff;
          color: #4338ca;
          font-size: 0.65rem;
          font-weight: 800;
        }
        .kasir-cart__clear {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all .15s ease;
        }
        .kasir-cart__clear:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Cart Body Scroll */
        .kasir-cart__body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 12px 14px;
        }
        .kasir-cart__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Cart Item Card */
        .kasir-cart__item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .kasir-cart__item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }
        .kasir-cart__item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .kasir-cart__item-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .kasir-cart__item-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.25;
          word-break: break-word;
        }
        .kasir-cart__unit-price {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }
        .kasir-cart__remove {
          background: none;
          border: none;
          color: #cbd5e1;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-cart__remove:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Bottom Row: Stepper & Subtotal */
        .kasir-cart__item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 6px;
          border-top: 1px dashed #f1f5f9;
        }
        .kasir-cart__qty-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .kasir-cart__qty {
          display: inline-flex;
          align-items: center;
          height: 30px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #f8fafc;
          overflow: hidden;
        }
        .kasir-cart__qty-btn {
          width: 26px;
          height: 100%;
          border: none;
          background: transparent;
          color: #475569;
          font-size: 0.68rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .15s ease;
        }
        .kasir-cart__qty-btn:hover:not(:disabled) {
          background: #e2e8f0;
          color: #1e293b;
        }
        .kasir-cart__qty-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .kasir-cart__qty-input {
          width: 58px;
          height: 100%;
          border: none;
          background: #ffffff;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1e293b;
          outline: none;
        }
        .kasir-cart__qty-unit {
          padding-right: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          background: #ffffff;
          height: 100%;
          display: flex;
          align-items: center;
        }

        /* Quick step buttons */
        .kasir-cart__quick-steps {
          display: flex;
          gap: 4px;
        }
        .kasir-cart__quick-btn {
          padding: 2px 6px;
          height: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #f8fafc;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-cart__quick-btn:hover {
          background: #5e72e4;
          border-color: #5e72e4;
          color: #fff;
        }

        /* Subtotal */
        .kasir-cart__subtotal {
          font-size: 0.95rem;
          font-weight: 900;
          color: #1e293b;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        /* Empty state */
        .kasir-cart__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 180px;
          text-align: center;
          color: #64748b;
          padding: 20px;
        }
        .kasir-cart__empty-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 8px;
        }
        .kasir-cart__empty strong {
          font-size: 0.9rem;
          color: #334155;
          margin-bottom: 2px;
        }
        .kasir-cart__empty p {
          font-size: 0.74rem;
          color: #94a3b8;
          margin: 0;
          max-width: 220px;
        }

        /* ── Dark Mode ───────────────────────────────────────── */
        body.dark-mode .kasir-cart { background: #161b22; }
        body.dark-mode .kasir-cart__head {
          background: #0f172a;
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        body.dark-mode .kasir-cart__head-title { color: #94a3b8; }
        body.dark-mode .kasir-cart__badge {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
        }
        body.dark-mode .kasir-cart__item {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.08);
        }
        body.dark-mode .kasir-cart__item:hover {
          border-color: rgba(255, 255, 255, 0.16);
        }
        body.dark-mode .kasir-cart__item-name,
        body.dark-mode .kasir-cart__subtotal { color: #f1f5f9; }
        body.dark-mode .kasir-cart__unit-price { color: #94a3b8; }
        body.dark-mode .kasir-cart__item-bottom {
          border-top-color: rgba(255, 255, 255, 0.06);
        }
        body.dark-mode .kasir-cart__qty {
          border-color: rgba(255, 255, 255, 0.12);
          background: #0f172a;
        }
        body.dark-mode .kasir-cart__qty-btn { color: #94a3b8; }
        body.dark-mode .kasir-cart__qty-btn:hover:not(:disabled) {
          background: #1e293b;
          color: #fff;
        }
        body.dark-mode .kasir-cart__qty-input {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }
        body.dark-mode .kasir-cart__qty-unit {
          background: #0f172a;
          color: #94a3b8;
        }
        body.dark-mode .kasir-cart__quick-btn {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }
        body.dark-mode .kasir-cart__quick-btn:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }
        body.dark-mode .kasir-cart__empty-icon {
          background: #1e293b;
          color: #64748b;
        }
        body.dark-mode .kasir-cart__empty strong { color: #e2e8f0; }
      `}</style>
    </section>
  );
};

export default OrderCartSection;

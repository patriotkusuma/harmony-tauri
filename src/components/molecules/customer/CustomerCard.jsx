/* ================================================================
   Customer Management — Molecule: CustomerCard
   Kartu satu baris customer di list.
   ================================================================ */
import React from 'react';
import CustomerAvatar from 'components/atoms/customer/CustomerAvatar';
import { CustomerTypeBadge } from 'components/atoms/customer/StatusBadge';
import StatChip from 'components/atoms/customer/StatChip';

const fmtCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const CustomerCard = ({ customer, onView, onEdit, onDelete }) => {
  const activeCount = customer.active_orders?.length ?? 0;

  return (
    <div className="cust-card" onClick={() => onView(customer)}>
      <div className="cust-card__left">
        <CustomerAvatar customer={customer} size={42} />
        <div className="cust-card__info">
          <div className="cust-card__name">{customer.nama}</div>
          <div className="cust-card__sub">
            {customer.telpon ? (
              <span><i className="fas fa-phone" style={{ fontSize: '0.7rem', marginRight: 4 }} />{customer.telpon}</span>
            ) : (
              <span style={{ opacity: 0.45 }}>Tanpa nomor</span>
            )}
          </div>
        </div>
      </div>

      <div className="cust-card__badges">
        <CustomerTypeBadge tipe={customer.tipe} />
        <StatChip
          icon="fas fa-shopping-basket"
          value={customer.total_order ?? 0}
          label="order"
          color="#5e72e4"
        />
        {activeCount > 0 && (
          <StatChip
            icon="fas fa-clock"
            value={activeCount}
            label="aktif"
            color="#fb6340"
          />
        )}
        {customer.saldo > 0 && (
           <StatChip
             icon="fas fa-wallet"
             value={fmtCurrency(customer.saldo)}
             color="#2dce89"
           />
        )}
      </div>

      <div className="cust-card__actions" onClick={e => e.stopPropagation()}>
        <button
          className="cust-action-btn cust-action-btn--edit"
          onClick={() => onEdit(customer)}
          title="Edit"
          aria-label="Edit customer"
        >
          <i className="fas fa-pen" />
        </button>
        <button
          className="cust-action-btn cust-action-btn--del"
          onClick={() => onDelete(customer)}
          title="Hapus"
          aria-label="Hapus customer"
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;

/* ================================================================
   Customer Management — Molecule: CustomerSearchBar
   Search + tombol tambah customer.
   ================================================================ */
import React, { useRef } from 'react';
import { useCustomerStore } from 'store/customerStore';

const CustomerSearchBar = ({ onAdd }) => {
  const { search, setSearch, loading } = useCustomerStore();
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 350);
  };

  return (
    <div className="cust-search-bar">
      <div className="cust-search-bar__input-wrap">
        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'} cust-search-bar__icon`} />
        <input
          type="text"
          className="cust-search-bar__input"
          placeholder="Cari nama pelanggan..."
          defaultValue={search}
          onChange={handleChange}
          aria-label="Cari customer"
        />
      </div>
      <button
        className="cust-search-bar__add-btn"
        onClick={onAdd}
        aria-label="Tambah customer baru"
      >
        <i className="fas fa-plus" />
        <span>Tambah Customer</span>
      </button>
    </div>
  );
};

export default CustomerSearchBar;

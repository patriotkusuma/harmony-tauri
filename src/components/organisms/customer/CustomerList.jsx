/* ================================================================
   Customer Management — Organism: CustomerList
   Daftar customer + pagination.
   ================================================================ */
import React from 'react';
import { useCustomerStore } from 'store/customerStore';
import CustomerCard from 'components/molecules/customer/CustomerCard';
import CustomerAvatar from 'components/atoms/customer/CustomerAvatar';
import Swal from 'sweetalert2';

/* ── Empty state ───────────────────────────────────────────────── */
const EmptyState = ({ search }) => (
  <div className="cust-empty">
    <div className="cust-empty__icon"><i className="fas fa-users-slash" /></div>
    <p className="cust-empty__title">
      {search ? `Tidak ada customer untuk "${search}"` : 'Belum ada data customer'}
    </p>
    {!search && <p className="cust-empty__sub">Klik "Tambah Customer" untuk menambahkan pelanggan baru.</p>}
  </div>
);

/* ── Skeleton loader ───────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="cust-card cust-card--skeleton">
    <div className="cust-skeleton-avatar" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="cust-skeleton-line" style={{ width: '40%' }} />
      <div className="cust-skeleton-line" style={{ width: '25%', height: 10 }} />
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <div className="cust-skeleton-line" style={{ width: 60, height: 22, borderRadius: 20 }} />
      <div className="cust-skeleton-line" style={{ width: 60, height: 22, borderRadius: 20 }} />
    </div>
  </div>
);

/* ── Pagination ────────────────────────────────────────────────── */
const Pagination = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  let pages = [];
  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (page >= totalPages - 2) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  }

  return (
    <div className="cust-pagination">
      <button
        className="cust-page-btn"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        aria-label="Halaman sebelumnya"
      >
        <i className="fas fa-chevron-left" />
      </button>
      {pages.map((p, index) => (
        <React.Fragment key={index}>
          {p === '...' ? (
            <span className="cust-page-dots" style={{ margin: '0 4px', opacity: 0.5, letterSpacing: '2px', display: 'flex', alignItems: 'end', paddingBottom: '4px' }}>...</span>
          ) : (
            <button
              className={`cust-page-btn${p === page ? ' active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        className="cust-page-btn"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        aria-label="Halaman berikutnya"
      >
        <i className="fas fa-chevron-right" />
      </button>
      <span className="cust-pagination__info">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total} customer
      </span>
    </div>
  );
};

/* ── Main organism ─────────────────────────────────────────────── */
const CustomerList = () => {
  const {
    customers, loading, error, page, total, limit, search,
    setPage, openEdit, openDetail, deleteCustomer,
  } = useCustomerStore();

  const handleDelete = async (customer) => {
    const result = await Swal.fire({
      title: 'Hapus Customer?',
      html: `Yakin ingin menghapus <strong>${customer.nama}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f5365c',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, Hapus',
    });
    if (result.isConfirmed) {
      const res = await deleteCustomer(customer.id);
      if (!res.ok) Swal.fire('Gagal', res.error, 'error');
    }
  };

  if (error) return (
    <div className="cust-error">
      <i className="fas fa-exclamation-triangle" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="cust-list-wrap">
      {/* List */}
      <div className="cust-list">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : customers.length === 0
            ? <EmptyState search={search} />
            : customers.map(c => (
                <CustomerCard
                  key={c.id}
                  customer={c}
                  onView={openDetail}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))
        }
      </div>

      {/* Pagination */}
      {!loading && <Pagination page={page} total={total} limit={limit} setPage={setPage} />}
    </div>
  );
};

export default CustomerList;

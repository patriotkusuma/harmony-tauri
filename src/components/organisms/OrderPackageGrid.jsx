/* ================================================================
   Kasir — OrderPackageGrid (Redesign Ergonomis)
   ----------------------------------------------------------------
   Fitur baru & peningkatan:
   - Filter Kategori Cepat (Pill tabs: Semua + nama kategori)
   - Badge jumlah paket per kategori
   - Pencarian real-time dengan shortcut '/' (focus) & 'Esc' (clear)
   - Responsive grid 2-3 kolom dengan scroll mandiri
   ================================================================ */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import PackageCard from 'components/Card/PackageCard';

const sortPackages = (packages) =>
  (packages || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

const OrderPackageGrid = ({ categories, cartItems, onAddCart, onSearch }) => {
  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const searchInputRef = useRef(null);

  const categoryList = categories || [];
  const isLoading = categories === undefined || categories === null;

  const visibleCategories = useMemo(
    () => categoryList.filter((cat) => (cat.jenis_cucis?.length || 0) > 0),
    [categoryList]
  );

  // Filter berdasarkan kategori yang dipilih tab
  const filteredCategories = useMemo(() => {
    if (activeCategoryId === 'all') return visibleCategories;
    return visibleCategories.filter((cat) => String(cat.id) === String(activeCategoryId));
  }, [visibleCategories, activeCategoryId]);

  // Total paket aktif
  const totalPackages = useMemo(() => {
    return visibleCategories.reduce((acc, cat) => acc + (cat.jenis_cucis?.length || 0), 0);
  }, [visibleCategories]);

  const getCartQuantity = (packageId) => {
    const batch = cartItems?.[packageId];
    const item = Array.isArray(batch) ? batch[0] : batch;
    return Number(item?.qty || 0);
  };

  const handleSearch = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch?.('');
    searchInputRef.current?.focus();
  };

  // Keyboard shortcut: '/' untuk fokus ke input pencarian
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        clearSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isEmpty = !isLoading && filteredCategories.length === 0;

  return (
    <section className="kasir-catalog">
      <header className="kasir-catalog__head">
        <div className="kasir-catalog__head-top">
          <div className="kasir-catalog__title-wrap">
            <h3 className="kasir-catalog__title">Katalog Paket</h3>
            {!isLoading && (
              <span className="kasir-catalog__count-badge">
                {totalPackages} layanan
              </span>
            )}
          </div>

          <div className="kasir-catalog__search">
            <i className="fas fa-search kasir-catalog__search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              placeholder="Cari paket... (tekan /)"
              onChange={(event) => handleSearch(event.target.value)}
              aria-label="Cari paket cuci"
            />
            {query ? (
              <button
                type="button"
                className="kasir-catalog__search-clear"
                onClick={clearSearch}
                aria-label="Hapus pencarian"
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <kbd className="kasir-catalog__search-shortcut">/</kbd>
            )}
          </div>
        </div>

        {/* Tab Pills Kategori */}
        {!isLoading && visibleCategories.length > 1 && !query && (
          <div className="kasir-catalog__pills" role="tablist" aria-label="Filter kategori">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategoryId === 'all'}
              className={`kasir-catalog__pill ${activeCategoryId === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategoryId('all')}
            >
              Semua
              <span className="kasir-catalog__pill-count">{totalPackages}</span>
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={String(activeCategoryId) === String(cat.id)}
                className={`kasir-catalog__pill ${String(activeCategoryId) === String(cat.id) ? 'is-active' : ''}`}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.nama}
                <span className="kasir-catalog__pill-count">{cat.jenis_cucis?.length || 0}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="kasir-catalog__body">
        {isLoading ? (
          <div className="kasir-catalog__state">
            <i className="fas fa-circle-notch fa-spin kasir-catalog__spinner" />
            <span>Memuat daftar paket...</span>
          </div>
        ) : isEmpty ? (
          <div className="kasir-catalog__state">
            <div className="kasir-catalog__empty-icon">
              <i className="fas fa-search" />
            </div>
            <strong>Paket tidak ditemukan</strong>
            <p className="kasir-catalog__empty-desc">
              {query
                ? `Tidak ada layanan yang cocok dengan kata kunci "${query}".`
                : 'Belum ada paket pada kategori ini.'}
            </p>
            {(query || activeCategoryId !== 'all') && (
              <button
                type="button"
                className="kasir-catalog__state-btn"
                onClick={() => {
                  clearSearch();
                  setActiveCategoryId('all');
                }}
              >
                <i className="fas fa-redo-alt me-1" /> Tampilkan semua paket
              </button>
            )}
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const packages = sortPackages(cat.jenis_cucis);
            if (packages.length === 0) return null;

            return (
              <div className="kasir-catalog__section" key={cat.id}>
                <div className="kasir-catalog__section-header">
                  <h4 className="kasir-catalog__section-title">{cat.nama}</h4>
                  <span className="kasir-catalog__section-badge">
                    {packages.length} paket
                  </span>
                </div>

                <div className="kasir-catalog__grid">
                  {packages.map((paket) => (
                    <PackageCard
                      key={paket.id}
                      paket={paket}
                      quantity={getCartQuantity(paket.id)}
                      onAddCart={onAddCart}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .kasir-catalog {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #eef1f6;
          box-shadow: 0 16px 40px -20px rgba(15, 23, 42, .08);
          overflow: hidden;
        }
        .kasir-catalog__head {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
          padding: 14px 18px 12px;
          border-bottom: 1px solid #eef1f6;
          background: #ffffff;
        }
        .kasir-catalog__head-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .kasir-catalog__title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kasir-catalog__title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .kasir-catalog__count-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 20px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 700;
        }

        /* Search input */
        .kasir-catalog__search {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 200px;
          max-width: 340px;
        }
        .kasir-catalog__search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          font-size: 0.82rem;
          pointer-events: none;
        }
        .kasir-catalog__search input {
          width: 100%;
          height: 38px;
          padding: 0 34px 0 34px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #1e293b;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
          transition: all .15s ease;
        }
        .kasir-catalog__search input:focus {
          background: #fff;
          border-color: #5e72e4;
          box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
        }
        .kasir-catalog__search input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
        .kasir-catalog__search-clear {
          position: absolute;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border: none;
          background: #e2e8f0;
          color: #475569;
          border-radius: 50%;
          font-size: 0.65rem;
          cursor: pointer;
        }
        .kasir-catalog__search-shortcut {
          position: absolute;
          right: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 4px;
          background: #e2e8f0;
          color: #64748b;
          font-size: 0.62rem;
          font-weight: 700;
          font-family: inherit;
          pointer-events: none;
        }

        /* Pills Kategori */
        .kasir-catalog__pills {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .kasir-catalog__pills::-webkit-scrollbar { display: none; }
        .kasir-catalog__pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 12px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 0.74rem;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-catalog__pill:hover {
          background: #edf2f7;
          border-color: #cbd5e1;
        }
        .kasir-catalog__pill.is-active {
          background: #5e72e4;
          border-color: #5e72e4;
          color: #fff;
          box-shadow: 0 4px 10px rgba(94, 114, 228, 0.25);
        }
        .kasir-catalog__pill-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1px 6px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.06);
          font-size: 0.64rem;
          font-weight: 800;
        }
        .kasir-catalog__pill.is-active .kasir-catalog__pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
        }

        /* Catalog Body */
        .kasir-catalog__body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 16px 18px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .kasir-catalog__section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kasir-catalog__section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
          border-bottom: 1px solid #f1f5f9;
        }
        .kasir-catalog__section-title {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 800;
          color: #334155;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .kasir-catalog__section-badge {
          font-size: 0.68rem;
          font-weight: 600;
          color: #94a3b8;
        }
        .kasir-catalog__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        /* Empty state */
        .kasir-catalog__state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 280px;
          gap: 8px;
          text-align: center;
          color: #64748b;
        }
        .kasir-catalog__spinner {
          font-size: 1.8rem;
          color: #5e72e4;
          margin-bottom: 4px;
        }
        .kasir-catalog__empty-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 4px;
        }
        .kasir-catalog__empty-desc {
          margin: 0;
          font-size: 0.78rem;
          color: #94a3b8;
          max-width: 280px;
        }
        .kasir-catalog__state-btn {
          margin-top: 10px;
          padding: 8px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          background: #fff;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all .15s ease;
        }
        .kasir-catalog__state-btn:hover {
          border-color: #5e72e4;
          color: #5e72e4;
        }

        /* ── Dark Mode ───────────────────────────────────────── */
        body.dark-mode .kasir-catalog {
          background: #161b22;
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 16px 40px -20px rgba(0, 0, 0, 0.4);
        }
        body.dark-mode .kasir-catalog__head {
          background: #161b22;
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        body.dark-mode .kasir-catalog__title { color: #f1f5f9; }
        body.dark-mode .kasir-catalog__count-badge {
          background: #1e293b;
          color: #94a3b8;
        }
        body.dark-mode .kasir-catalog__search input {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
        }
        body.dark-mode .kasir-catalog__search input:focus {
          border-color: #60a5fa;
          background: #1e293b;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }
        body.dark-mode .kasir-catalog__search-shortcut,
        body.dark-mode .kasir-catalog__search-clear {
          background: #1e293b;
          color: #94a3b8;
        }
        body.dark-mode .kasir-catalog__pill {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
        }
        body.dark-mode .kasir-catalog__pill:hover {
          background: #1e293b;
          color: #f1f5f9;
        }
        body.dark-mode .kasir-catalog__pill.is-active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }
        body.dark-mode .kasir-catalog__section-header {
          border-bottom-color: rgba(255, 255, 255, 0.06);
        }
        body.dark-mode .kasir-catalog__section-title { color: #cbd5e1; }
        body.dark-mode .kasir-catalog__empty-icon {
          background: #1e293b;
          color: #64748b;
        }
        body.dark-mode .kasir-catalog__state-btn {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
        }
        body.dark-mode .kasir-catalog__state-btn:hover {
          border-color: #60a5fa;
          color: #60a5fa;
        }
      `}</style>
    </section>
  );
};

export default OrderPackageGrid;

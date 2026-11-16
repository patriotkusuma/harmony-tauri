import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Input, Badge, Button } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import CustomerAvatar from 'components/atoms/CustomerAvatar';

// Baris/card di-memo agar mengetik di kolom cari tidak me-render ulang
// seluruh daftar (bisa ratusan pelanggan berutang).
const CustomerBillCard = memo(({ customer, unpaidAmount, orderCount, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(customer)}
        className={`customer-bill-card transition-all p-3 rounded-xl cursor-pointer h-100 d-flex flex-column justify-content-between ${
            isSelected ? 'selected-bill-card shadow-md' : 'bg-white shadow-sm hover-card border'
        }`}
    >
        <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="d-flex align-items-center overflow-hidden me-2">
                <div
                    className={`avatar avatar-md rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
                        isSelected ? 'bg-primary text-white shadow' : 'bg-primary-soft text-primary'
                    }`}
                    style={{ width: '44px', height: '44px', overflow: 'hidden' }}
                >
                    <CustomerAvatar customer={customer} />
                </div>
                <div className="overflow-hidden">
                    <h5 className="mb-0 text-truncate font-weight-bold customer-name" style={{ fontSize: '0.95rem' }}>
                        {customer.nama}
                    </h5>
                    <div className="text-muted font-weight-bold text-xs text-truncate customer-phone">
                        <i className="fab fa-whatsapp text-success me-1" />
                        {customer.telpon || '-'}
                    </div>
                </div>
            </div>

            {orderCount > 1 && (
                <Badge color="light" className="text-dark border font-weight-bold px-2 py-1 note-count-badge" style={{ fontSize: '0.65rem' }}>
                    {orderCount} Nota
                </Badge>
            )}
        </div>

        {customer.keterangan && (
            <div className="text-xs text-truncate mb-2 px-2 py-1 rounded customer-notes-box">
                <i className="fas fa-info-circle me-1 text-info" />
                {customer.keterangan}
            </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-2 border-top card-debt-footer">
            <span className="text-muted text-xs font-weight-bold debt-label">SISA TAGIHAN</span>
            <span className="font-weight-900 text-danger h5 mb-0 debt-val" style={{ color: '#f5365c' }}>
                <RupiahFormater value={unpaidAmount} />
            </span>
        </div>
    </div>
));

const CustomerBillRow = memo(({ customer, unpaidAmount, orderCount, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(customer)}
        className={`customer-bill-row transition-all px-3 py-2 rounded-lg cursor-pointer d-flex align-items-center justify-content-between ${
            isSelected ? 'selected-bill-row shadow-sm' : 'bg-white border hover-row'
        }`}
    >
        <div className="d-flex align-items-center overflow-hidden me-3" style={{ minWidth: 0, flex: 1 }}>
            <div
                className={`avatar avatar-sm rounded-circle me-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-white shadow-sm' : 'bg-primary-soft text-primary'
                }`}
                style={{ width: '34px', height: '34px', overflow: 'hidden' }}
            >
                <CustomerAvatar customer={customer} />
            </div>
            <div className="overflow-hidden me-2" style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center">
                    <span className="font-weight-bold text-dark text-truncate customer-name me-2" style={{ fontSize: '0.9rem' }}>
                        {customer.nama}
                    </span>
                    {orderCount > 1 && (
                        <Badge color="light" className="text-dark border font-weight-bold px-1 py-0 note-count-badge" style={{ fontSize: '0.65rem' }}>
                            {orderCount} Nota
                        </Badge>
                    )}
                </div>
                <div className="text-muted text-xs text-truncate customer-phone">
                    <i className="fab fa-whatsapp text-success me-1" />
                    {customer.telpon || '-'}
                    {customer.keterangan && (
                        <span className="ms-2 text-info opacity-8">• {customer.keterangan}</span>
                    )}
                </div>
            </div>
        </div>

        <div className="text-end flex-shrink-0">
            <div className="font-weight-900 text-danger mb-0 debt-val" style={{ color: '#f5365c', fontSize: '0.95rem' }}>
                <RupiahFormater value={unpaidAmount} />
            </div>
        </div>
    </div>
));

const PaymentCustomerList = ({ 
    customers = [], 
    totalUnpaid = 0, 
    onSearch, 
    onSelect, 
    selectedId,
    loading,
    viewMode = 'card',
    onToggleViewMode,
    calculateCustomerBill
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high', 'multiple'
    const searchInputRef = useRef(null);

    // Global keyboard shortcut '/' to focus search input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchValue(val);
        onSearch(val);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        onSearch('');
        searchInputRef.current?.focus();
    };

    // Filter customers locally by debt amount or multiple orders
    const filteredCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        return customers.filter(customer => {
            const unpaid = Math.abs(calculateCustomerBill ? calculateCustomerBill(customer) : (customer.total_sisa || 0));
            if (activeFilter === 'high') {
                return unpaid >= 100000;
            }
            if (activeFilter === 'multiple') {
                return (customer.pesanans && customer.pesanans.length > 1) || (customer.bills && customer.bills.length > 1);
            }
            return true;
        });
    }, [customers, activeFilter, calculateCustomerBill]);

    return (
        <Card className="border-0 rounded-xl overflow-hidden shadow-sm h-100 d-flex flex-column payment-cust-list-card" style={{ background: '#ffffff', minHeight: '520px' }}>
            <CardHeader className="bg-white border-bottom py-3 px-4 payment-cust-header">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    {/* Ringkasan Belum Bayar */}
                    <div>
                        <div className="text-uppercase text-muted font-weight-bold payment-cust-sub" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                            TOTAL PIUTANG PELANGGAN
                        </div>
                        <div className="d-flex align-items-center mt-1">
                            <span className="h3 font-weight-900 mb-0 text-danger me-2 debt-amount-highlight" style={{ color: '#f5365c' }}>
                                <RupiahFormater value={totalUnpaid} />
                            </span>
                            <Badge color="danger" pill className="px-2 py-1 font-weight-bold shadow-none" style={{ fontSize: '0.75rem' }}>
                                {customers?.length || 0} Pelanggan
                            </Badge>
                        </div>
                    </div>

                    {/* Right Tools: View Mode Toggle & Search */}
                    <div className="d-flex align-items-center gap-2 flex-wrap" style={{ gap: '10px' }}>
                        {/* View Mode Toggle: List vs Card */}
                        <div className="btn-group btn-group-sm p-1 rounded-pill border view-mode-toggle bg-light">
                            <button
                                type="button"
                                className={`btn btn-sm rounded-pill font-weight-bold px-3 py-1 border-0 ${viewMode === 'card' ? 'btn-primary text-white shadow-sm' : 'text-muted bg-transparent'}`}
                                onClick={() => onToggleViewMode && onToggleViewMode('card')}
                                title="Tampilan Card / Grid"
                            >
                                <i className="fas fa-th-large me-1" />
                                <span className="d-none d-sm-inline">Card</span>
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm rounded-pill font-weight-bold px-3 py-1 border-0 ${viewMode === 'list' ? 'btn-primary text-white shadow-sm' : 'text-muted bg-transparent'}`}
                                onClick={() => onToggleViewMode && onToggleViewMode('list')}
                                title="Tampilan List Kompak"
                            >
                                <i className="fas fa-list me-1" />
                                <span className="d-none d-sm-inline">List</span>
                            </button>
                        </div>

                        {/* Quick Search with [/] shortcut */}
                        <div style={{ minWidth: '220px', maxWidth: '320px' }}>
                            <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-light shadow-none search-input-group">
                                <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                                    <i className="fas fa-search" />
                                </span>
                                <Input
                                    innerRef={searchInputRef}
                                    placeholder="Cari [/]..."
                                    className="border-0 bg-transparent font-weight-bold text-dark px-2 search-input-field"
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    style={{ height: '36px', boxShadow: 'none' }}
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        className="btn btn-sm text-muted pe-3 border-0 bg-transparent"
                                        onClick={handleClearSearch}
                                    >
                                        <i className="fas fa-times-circle" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="d-flex align-items-center gap-2 mt-3 pt-2 border-top payment-cust-filter-row" style={{ gap: '8px' }}>
                    <span className="text-muted font-weight-bold filter-label" style={{ fontSize: '0.7rem' }}>Filter:</span>
                    <Button
                        size="sm"
                        color={activeFilter === 'all' ? 'primary' : 'secondary'}
                        className={`py-1 px-3 rounded-pill font-weight-bold filter-pill ${activeFilter === 'all' ? 'shadow-sm text-white' : 'bg-white border text-dark'}`}
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setActiveFilter('all')}
                    >
                        Semua ({customers?.length || 0})
                    </Button>
                    <Button
                        size="sm"
                        color={activeFilter === 'high' ? 'danger' : 'secondary'}
                        className={`py-1 px-3 rounded-pill font-weight-bold filter-pill ${activeFilter === 'high' ? 'shadow-sm text-white' : 'bg-white border text-dark'}`}
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setActiveFilter('high')}
                    >
                        &gt; 100rb
                    </Button>
                    <Button
                        size="sm"
                        color={activeFilter === 'multiple' ? 'info' : 'secondary'}
                        className={`py-1 px-3 rounded-pill font-weight-bold filter-pill ${activeFilter === 'multiple' ? 'shadow-sm text-white' : 'bg-white border text-dark'}`}
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setActiveFilter('multiple')}
                    >
                        Banyak Nota
                    </Button>
                </div>
            </CardHeader>

            {/* List / Card Body */}
            <CardBody className="p-3 flex-grow-1 overflow-auto payment-cust-body" style={{ background: '#f8f9fe', maxHeight: 'calc(100vh - 290px)' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <i className="fas fa-circle-notch fa-spin fa-2x text-primary mb-3" />
                        <p className="text-muted font-weight-bold payment-loading-text">Memperbarui data tagihan pelanggan...</p>
                    </div>
                ) : !filteredCustomers || filteredCustomers.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="avatar avatar-xl rounded-circle bg-success-soft text-success mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                            <i className="fas fa-check-circle fa-2x" />
                        </div>
                        <h4 className="text-dark font-weight-bold mb-1 payment-empty-title">
                            {searchValue ? "Pelanggan Tidak Ditemukan" : "Semua Tagihan Lunas!"}
                        </h4>
                        <p className="text-muted small mb-0 payment-empty-desc">
                            {searchValue 
                                ? `Tidak ada hasil pencarian untuk "${searchValue}".` 
                                : "Tidak ada piutang tertunda saat ini."}
                        </p>
                    </div>
                ) : viewMode === 'card' ? (
                    /* ── Card Mode: Responsive Grid Cards ────────────────── */
                    <div className="customer-cards-grid">
                        <Row className="g-3">
                            {filteredCustomers.map((customer) => {
                                const unpaidAmount = Math.abs(calculateCustomerBill ? calculateCustomerBill(customer) : (customer.total_sisa || 0));
                                const isSelected = selectedId === customer.id;
                                const orderCount = customer.pesanans?.length || customer.bills?.reduce((acc, b) => acc + (b.orders?.length || 1), 0) || 1;

                                return (
                                    <Col xs="12" md="6" key={customer.id}>
                                        <CustomerBillCard
                                            customer={customer}
                                            unpaidAmount={unpaidAmount}
                                            orderCount={orderCount}
                                            isSelected={isSelected}
                                            onSelect={onSelect}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                ) : (
                    /* ── List Mode: Compact cashier table rows ───────────── */
                    <div className="customer-list-rows d-flex flex-column" style={{ gap: '6px' }}>
                        {filteredCustomers.map((customer) => {
                            const unpaidAmount = Math.abs(calculateCustomerBill ? calculateCustomerBill(customer) : (customer.total_sisa || 0));
                            const isSelected = selectedId === customer.id;
                            const orderCount = customer.pesanans?.length || customer.bills?.reduce((acc, b) => acc + (b.orders?.length || 1), 0) || 1;

                            return (
                                <CustomerBillRow
                                    key={customer.id}
                                    customer={customer}
                                    unpaidAmount={unpaidAmount}
                                    orderCount={orderCount}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                />
                            );
                        })}
                    </div>
                )}
            </CardBody>

            <style>{`
                .rounded-xl { border-radius: 14px; }
                .rounded-lg { border-radius: 10px; }
                .bg-primary-soft { background: rgba(94, 114, 228, 0.12); }
                .bg-success-soft { background: rgba(45, 206, 137, 0.12); }
                .customer-bill-card {
                    border: 1.5px solid #e9ecef;
                    transition: all 0.18s ease-in-out;
                }
                .customer-bill-card:hover {
                    border-color: #5e72e4;
                    transform: translateY(-2px);
                }
                .selected-bill-card {
                    background: #ffffff !important;
                    border: 2px solid #5e72e4 !important;
                    box-shadow: 0 4px 18px rgba(94, 114, 228, 0.22) !important;
                }
                .customer-bill-row {
                    border: 1.5px solid #e9ecef;
                    transition: all 0.15s ease-in-out;
                }
                .customer-bill-row:hover {
                    border-color: #5e72e4;
                    background-color: #fcfdff;
                }
                .selected-bill-row {
                    background: #ffffff !important;
                    border: 2px solid #5e72e4 !important;
                    box-shadow: 0 2px 10px rgba(94, 114, 228, 0.18) !important;
                }
                .customer-notes-box {
                    background: rgba(17, 205, 239, 0.08);
                    color: #0f6674;
                }

                /* ── Dark Mode Styles ─────────────────────────────────────────── */
                body.dark-mode .payment-cust-list-card {
                    background: #1e293b !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .payment-cust-header {
                    background: #0f172a !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .payment-cust-body {
                    background: #111827 !important;
                }
                body.dark-mode .payment-cust-sub {
                    color: #94a3b8 !important;
                }
                body.dark-mode .debt-amount-highlight {
                    color: #fb7185 !important;
                }
                body.dark-mode .view-mode-toggle {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                }
                body.dark-mode .search-input-group {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                }
                body.dark-mode .search-input-field {
                    color: #f8fafc !important;
                }
                body.dark-mode .search-input-field::placeholder {
                    color: #64748b !important;
                }
                body.dark-mode .payment-cust-filter-row {
                    border-top-color: rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .filter-label {
                    color: #94a3b8 !important;
                }
                body.dark-mode .filter-pill.bg-white {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: #cbd5e1 !important;
                }
                body.dark-mode .payment-empty-title {
                    color: #f8fafc !important;
                }
                body.dark-mode .payment-empty-desc,
                body.dark-mode .payment-loading-text {
                    color: #94a3b8 !important;
                }

                /* Dark Mode: Card View */
                body.dark-mode .customer-bill-card {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .customer-bill-card:hover {
                    border-color: #818cf8 !important;
                    background: #243247 !important;
                }
                body.dark-mode .selected-bill-card {
                    background: #1e293b !important;
                    border-color: #818cf8 !important;
                    box-shadow: 0 0 0 1px #818cf8, 0 8px 24px rgba(99, 102, 241, 0.3) !important;
                }
                body.dark-mode .customer-name {
                    color: #f8fafc !important;
                }
                body.dark-mode .customer-phone {
                    color: #94a3b8 !important;
                }
                body.dark-mode .note-count-badge {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: #e2e8f0 !important;
                }
                body.dark-mode .customer-notes-box {
                    background: rgba(17, 205, 239, 0.12) !important;
                    color: #67e8f9 !important;
                }
                body.dark-mode .card-debt-footer {
                    border-top-color: rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .debt-label {
                    color: #94a3b8 !important;
                }
                body.dark-mode .debt-val {
                    color: #fb7185 !important;
                }

                /* Dark Mode: List View */
                body.dark-mode .customer-bill-row {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .customer-bill-row:hover {
                    background: #243247 !important;
                    border-color: #818cf8 !important;
                }
                body.dark-mode .selected-bill-row {
                    background: #1e293b !important;
                    border-color: #818cf8 !important;
                    box-shadow: 0 0 0 1px #818cf8, 0 4px 16px rgba(99, 102, 241, 0.25) !important;
                }
            `}</style>
        </Card>
    );
};

export default PaymentCustomerList;

import React, { useEffect } from 'react';
import { Modal } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

// Layout & Hooks
import Order from 'layouts/Order';
import { usePembayaran } from 'hooks/usePembayaran';

// Organisms
import PaymentCustomerList from 'components/organisms/PaymentCustomerList';
import PaymentDetailPanel from 'components/organisms/PaymentDetailPanel';
import PaymentModalContent from 'components/Modals/PaymentModalContent';

const todayLabel = () => {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

const Pembayaran = () => {
    const {
        dataCustomer,
        filtered,
        loading,
        viewMode,
        setViewMode,
        isOpen,
        valueBayar,
        setValueBayar,
        tipeBayar,
        setTipeBayar,
        bukti,
        setBukti,
        preview,
        totalBlmBayar,
        calculateCustomerBill,
        handleSearch,
        selectCustomer,
        handleOpenModal,
        handleCloseModal,
        submitPayment,
        updateStatus,
        kirimQrisDinamis,
        refresh
    } = usePembayaran();

    // Keyboard shortcuts: F8 to open payment modal, Esc to close/deselect
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F8') {
                e.preventDefault();
                if (filtered && !isOpen) {
                    handleOpenModal();
                }
            } else if (e.key === 'Escape') {
                if (isOpen) {
                    handleCloseModal();
                } else if (filtered) {
                    selectCustomer(filtered);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filtered, isOpen, handleOpenModal, handleCloseModal, selectCustomer]);

    return (
        <Order>
            <div className="kasir-page">
                {/* Modern Kasir Header */}
                <header className="kasir-head mb-3">
                    <div className="kasir-head__brand">
                        <div className="kasir-head__icon" style={{ background: 'linear-gradient(135deg, #11cdef, #1171ef)' }}>
                            <i className="fas fa-money-check-alt text-white" />
                        </div>
                        <div className="kasir-head__copy">
                            <h1>Kasir Pembayaran</h1>
                            <p>
                                {todayLabel()} · Pelunasan Tagihan & Kas
                            </p>
                        </div>
                    </div>

                    <div className="kasir-head__right">
                        {/* Quick Metrics */}
                        <div className="d-none d-md-flex align-items-center me-3 px-3 py-1 bg-white rounded-pill border shadow-sm">
                            <span className="text-muted small font-weight-bold me-2">Total Piutang:</span>
                            <span className="font-weight-900 text-danger h6 mb-0">
                                <RupiahFormater value={totalBlmBayar} />
                            </span>
                        </div>

                        {/* Refresh Button */}
                        <button
                            type="button"
                            className="kasir-head__action"
                            onClick={() => refresh()}
                            title="Segarkan data tagihan"
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} />
                            <span className="kasir-head__action-label">Segarkan</span>
                        </button>

                        {/* Bayar Action if Customer Selected */}
                        {filtered && (
                            <button
                                type="button"
                                className="kasir-head__action bg-primary text-white border-0 shadow-sm"
                                onClick={handleOpenModal}
                                title="Bayar Sekarang (F8)"
                            >
                                <i className="fas fa-cash-register me-1" />
                                <span className="kasir-head__action-label font-weight-bold">Bayar (F8)</span>
                                <kbd className="kasir-head__key text-primary bg-white">F8</kbd>
                            </button>
                        )}
                    </div>
                </header>

                {/* Workspace Layout */}
                <div className="kasir-payment-workspace">
                    {/* Kolom Kiri: Daftar Pelanggan Tertagih */}
                    <div className="kasir-payment-workspace__list">
                        <PaymentCustomerList 
                            customers={dataCustomer}
                            totalUnpaid={totalBlmBayar}
                            onSearch={handleSearch}
                            onSelect={selectCustomer}
                            selectedId={filtered?.id}
                            loading={loading}
                            viewMode={viewMode}
                            onToggleViewMode={setViewMode}
                            calculateCustomerBill={calculateCustomerBill}
                        />
                    </div>

                    {/* Kolom Kanan: Rincian Tagihan & Aksi Bayar */}
                    <aside className="kasir-payment-workspace__detail">
                        <PaymentDetailPanel 
                            customer={filtered}
                            onOpenPayment={handleOpenModal}
                            onSendQris={kirimQrisDinamis}
                            onStatusUpdate={updateStatus}
                            calculateCustomerBill={calculateCustomerBill}
                        />
                    </aside>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal 
                centered 
                isOpen={isOpen} 
                toggle={handleCloseModal} 
                autoFocus={false} 
                size="md" 
                contentClassName="border-0 shadow-lg rounded-xl overflow-hidden"
            >
                <PaymentModalContent
                    isOpen={isOpen}
                    toggleModal={handleCloseModal}
                    filteredCustomer={filtered}
                    valueBayar={valueBayar}
                    setValueBayar={setValueBayar}
                    tipeBayar={tipeBayar}
                    setTipeBayar={setTipeBayar}
                    bukti={bukti}
                    setBukti={setBukti}
                    preview={preview}
                    onSubmit={submitPayment}
                />
            </Modal>

            <style>{`
                .kasir-page {
                    max-width: 1640px;
                    margin: 0 auto;
                }
                .kasir-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 8px 12px;
                    background: #ffffff;
                    border: 1px solid #e9ecef;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
                }
                .kasir-head__brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .kasir-head__icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                .kasir-head__copy h1 {
                    font-size: 1.15rem;
                    font-weight: 800;
                    margin: 0;
                    color: #212529;
                }
                .kasir-head__copy p {
                    margin: 0;
                    font-size: 0.75rem;
                    color: #8898aa;
                    font-weight: 600;
                }
                .kasir-head__right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .kasir-head__action {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 14px;
                    background: #f8f9fe;
                    border: 1px solid #e9ecef;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #525f7f;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .kasir-head__action:hover {
                    background: #e9ecef;
                    transform: translateY(-1px);
                }
                .kasir-head__key {
                    display: inline-block;
                    padding: 1px 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    border-radius: 4px;
                    background: #e9ecef;
                    color: #32325d;
                }

                .kasir-payment-workspace {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 440px;
                    gap: 16px;
                    height: calc(100vh - 212px);
                    min-height: 520px;
                }
                .kasir-payment-workspace > * { min-height: 0; }
                .kasir-payment-workspace__list { min-width: 0; height: 100%; }
                .kasir-payment-workspace__detail {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    height: 100%;
                }

                /* ── Dark Mode ── */
                body.dark-mode .kasir-head {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }
                body.dark-mode .kasir-head__copy h1 {
                    color: #f8fafc !important;
                }
                body.dark-mode .kasir-head__copy p {
                    color: #94a3b8 !important;
                }
                body.dark-mode .kasir-head__action {
                    background: #0f172a !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    color: #cbd5e1 !important;
                }
                body.dark-mode .kasir-head__action:hover {
                    background: #1e293b !important;
                    color: #ffffff !important;
                }
                body.dark-mode .kasir-head__key {
                    background: #1e293b !important;
                    color: #818cf8 !important;
                }
                body.dark-mode .modal-content {
                    background: #1e293b !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }

                @media (max-width: 1199.98px) {
                    .kasir-payment-workspace { grid-template-columns: minmax(0, 1fr) 390px; }
                }
                @media (max-width: 991.98px) {
                    .kasir-payment-workspace {
                        grid-template-columns: 1fr;
                        height: auto;
                        min-height: 0;
                    }
                    .kasir-payment-workspace__list { height: auto; }
                    .kasir-payment-workspace__detail { height: auto; }
                }
                .rounded-xl { border-radius: 16px !important; }
            `}</style>
        </Order>
    );
};

export default Pembayaran;

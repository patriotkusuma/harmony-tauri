import React from 'react';

// Layout & Custom Hook
import Order from 'layouts/Order';
import { useOrderManagement } from 'hooks/useOrderManagement';

// Organisms
import OrderHeader from 'components/organisms/OrderHeader';
import OrderPackageGrid from 'components/organisms/OrderPackageGrid';
import OrderCustomerBar from 'components/organisms/OrderCustomerBar';
import OrderCartSection from 'components/organisms/OrderCartSection';
import OrderCheckoutSection from 'components/organisms/OrderCheckoutSection';

// Modals
import CustomerModal from 'components/Modals/CustomerModal';
import PaymentModal from 'components/Modals/PaymentModal';
import RFIDAttachLastOrderModal from 'components/Modals/RFIDAttachLastOrderModal';

const Pesan = () => {
    const {
        // State
        cartItems,
        estimasi,
        subTotal,
        category,
        nama,
        telpon,
        idPelanggan,
        pelanggan,
        customerInsights,
        isSearchingCustomers,
        isLunas,
        setIsLunas,
        isCustomerModalOpen,
        isPaymentModalOpen,
        isRFIDAttachOpen,
        valueBayar,
        setValueBayar,
        tipeBayar,
        setTipeBayar,
        antar,
        setAntar,
        gabungBill,
        setGabungBill,
        keterangan,
        setKeterangan,
        isOrderButtonDisabled,
        kode_pesan,

        // Actions
        addCart,
        updateCart,
        removeOneCart,
        clearCart,
        searchCategory,
        searchCustomers,
        selectCustomer,
        selectNewCustomer,
        handlePrintNama,
        fetchAndPrintLastOrder,
        submitOrder,
        handleOrderSubmission,
        toggleCustomerModal,
        togglePaymentModal,
        toggleRFIDAttach,
        sendConfirmationWA,
    } = useOrderManagement();

    return (
        <Order>
            <div className="kasir-page">
                <OrderHeader
                    kodePesan={kode_pesan}
                    onPrintNama={handlePrintNama}
                    onPrintLastOrder={fetchAndPrintLastOrder}
                    onRFIDAttach={toggleRFIDAttach}
                />

                <div className="kasir-workspace">
                    {/* Kiri: katalog paket */}
                    <div className="kasir-workspace__catalog">
                        <OrderPackageGrid
                            categories={category}
                            cartItems={cartItems}
                            onAddCart={addCart}
                            onSearch={searchCategory}
                        />
                    </div>

                    {/* Kanan: tiket pesanan */}
                    <aside className="kasir-workspace__order">
                        <div className="kasir-ticket">
                            <OrderCustomerBar
                                nama={nama}
                                telpon={telpon}
                                customerInsights={customerInsights}
                                isExistingCustomer={Boolean(idPelanggan)}
                                onChoose={toggleCustomerModal}
                            />

                            <OrderCartSection
                                cartItems={cartItems}
                                onUpdateCart={updateCart}
                                onRemoveCart={removeOneCart}
                                onClearCart={clearCart}
                                categories={category}
                            />

                            <OrderCheckoutSection
                                nama={nama}
                                telpon={telpon}
                                estimasi={estimasi}
                                subTotal={subTotal}
                                isLunas={isLunas}
                                setIsLunas={setIsLunas}
                                antar={antar}
                                setAntar={setAntar}
                                gabungBill={gabungBill}
                                setGabungBill={setGabungBill}
                                keterangan={keterangan}
                                setKeterangan={setKeterangan}
                                onSubmitOrder={handleOrderSubmission}
                                isOrderDisabled={isOrderButtonDisabled}
                                onSendConfirmation={sendConfirmationWA}
                                customerInsights={customerInsights}
                            />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modals */}
            <CustomerModal
                isOpen={isCustomerModalOpen}
                toggle={toggleCustomerModal}
                pelanggan={pelanggan}
                isSearchingCustomers={isSearchingCustomers}
                onSearch={searchCustomers}
                onSelectCustomer={selectCustomer}
                onUseNewCustomer={selectNewCustomer}
            />

            <RFIDAttachLastOrderModal
                isOpen={isRFIDAttachOpen}
                toggle={toggleRFIDAttach}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                toggle={togglePaymentModal}
                valueBayar={valueBayar}
                setValueBayar={setValueBayar}
                tipeBayar={tipeBayar}
                setTipeBayar={setTipeBayar}
                subTotal={subTotal}
                nama={nama}
                onSubmitPayment={submitOrder}
            />

            <style>{`
                .kasir-page {
                    max-width: 1640px;
                    margin: 0 auto;
                }
                .kasir-workspace {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 396px;
                    gap: 16px;
                    height: calc(100vh - 212px);
                    min-height: 520px;
                }
                .kasir-workspace > * { min-height: 0; }
                .kasir-workspace__catalog { min-width: 0; height: 100%; }
                .kasir-workspace__order {
                    display: flex;
                    min-width: 0;
                    min-height: 0;
                }
                .kasir-ticket {
                    --kasir-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-width: 0;
                    min-height: 0;
                    background: #fff;
                    border-radius: var(--kasir-radius);
                    box-shadow: 0 34px 80px -40px rgba(8, 18, 48, .65);
                }
                .kasir-ticket > .kasir-cust {
                    border-top-left-radius: var(--kasir-radius);
                    border-top-right-radius: var(--kasir-radius);
                }
                .kasir-ticket > .kasir-co {
                    border-bottom-left-radius: var(--kasir-radius);
                    border-bottom-right-radius: var(--kasir-radius);
                }

                /* ── Dark mode ─────────────────────────────────────── */
                body.dark-mode .kasir-ticket {
                    background: #161b22;
                    box-shadow: 0 34px 80px -40px rgba(0, 0, 0, .95);
                }
                @media (max-width: 1199.98px) {
                    .kasir-workspace { grid-template-columns: minmax(0, 1fr) 372px; }
                }
                @media (max-width: 991.98px) {
                    .kasir-workspace {
                        grid-template-columns: 1fr;
                        height: auto;
                        min-height: 0;
                    }
                    .kasir-workspace__catalog { height: auto; }
                    .kasir-ticket { --kasir-radius: 18px; }
                }
                @media (max-width: 575.98px) {
                    .kasir-workspace { gap: 12px; }
                    .kasir-ticket { --kasir-radius: 16px; }
                }
            `}</style>
        </Order>
    );
};

export default Pesan;

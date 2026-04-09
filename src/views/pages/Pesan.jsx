import React from 'react';
import { Container, Row, Col, Modal } from 'reactstrap';

// Layout & Custom Hook
import Order from 'layouts/Order';
import { useOrderManagement } from 'hooks/useOrderManagement';

// Organisms
import OrderHeader from 'components/organisms/OrderHeader';
import OrderPackageGrid from 'components/organisms/OrderPackageGrid';
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
        setNama,
        telpon,
        setTelpon,
        pelanggan,
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
        kode_pesan,
        isOrderButtonDisabled,
        
        // Actions
        addCart,
        updateCart,
        removeOneCart,
        clearCart,
        searchCategory,
        selectCustomer,
        resetCustomer,
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
            {/* Simple Background Header */}
            <div className="header bg-gradient-default pb-4 pt-5 pt-md-6 px-0 position-relative overflow-hidden">
                <div className="pos-accent accent-1"></div>
                <div className="pos-accent accent-2"></div>
            </div>

            <Container className="mt--7 pb-5 position-relative" style={{ zIndex: 5 }} fluid>
                <Row className="gx-4">
                    {/* Left Column: Glass Panel with Title + Packages */}
                    <Col lg="8">
                        <div className="glass-panel-dark h-100 rounded-xl overflow-hidden shadow-premium border-0">
                            <div className="p-4">
                                <OrderHeader 
                                    onSearch={searchCategory}
                                    onPrintNama={handlePrintNama}
                                    onPrintLastOrder={fetchAndPrintLastOrder}
                                    onRFIDAttach={toggleRFIDAttach}
                                />
                                <div className="mt-2">
                                    <OrderPackageGrid 
                                        categories={category}
                                        cartItems={cartItems}
                                        onAddCart={addCart}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column: Cart + Checkout */}
                    <Col lg="4" className="mt-4 mt-lg-0">
                        <OrderCartSection 
                            cartItems={cartItems}
                            subTotal={subTotal}
                            onUpdateCart={updateCart}
                            onRemoveCart={removeOneCart}
                            onClearCart={clearCart}
                            categories={category}
                        />
                        
                        <OrderCheckoutSection 
                            kodePesan={kode_pesan}
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
                            onEditCustomer={toggleCustomerModal}
                            onSubmitOrder={handleOrderSubmission}
                            isOrderDisabled={isOrderButtonDisabled}
                            onSendConfirmation={sendConfirmationWA}
                        />
                    </Col>
                </Row>
            </Container>

            {/* Modals */}
            <CustomerModal
                isOpen={isCustomerModalOpen}
                toggle={toggleCustomerModal}
                nama={nama}
                setNama={setNama}
                telpon={telpon}
                setTelpon={setTelpon}
                pelanggan={pelanggan}
                onSelectCustomer={selectCustomer}
                resetCustomer={resetCustomer} 
            />

            <RFIDAttachLastOrderModal
                isOpen={isRFIDAttachOpen}
                toggle={toggleRFIDAttach}
            />

            <Modal centered isOpen={isPaymentModalOpen} toggle={togglePaymentModal} contentClassName="rounded-xl border-0 shadow-lg p-0 overflow-hidden">
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    toggle={togglePaymentModal}
                    valueBayar={valueBayar}
                    setValueBayar={setValueBayar}
                    tipeBayar={tipeBayar}
                    setTipeBayar={setTipeBayar}
                    subTotal={subTotal}
                    onSubmitPayment={submitOrder}
                />
            </Modal>

            <style>{`
                .glass-panel-dark {
                    background: rgba(50, 46, 46, 0.37);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .pos-accent {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(94, 114, 228, 0.1) 0%, rgba(94, 114, 228, 0) 100%);
                    z-index: 0;
                }
                .accent-1 { width: 500px; height: 500px; top: -150px; right: -100px; }
                .accent-2 { width: 350px; height: 350px; bottom: -100px; left: -100px; }
                .rounded-xl { border-radius: 1.5rem !important; }
                .mt--8 { margin-top: -12rem !important; }
            `}</style>
        </Order>
    );
};

export default Pesan;
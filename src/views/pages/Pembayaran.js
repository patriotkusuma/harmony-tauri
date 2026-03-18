import React from 'react';
import { Container, Row, Col, Button, Modal } from 'reactstrap';

// Layout & Hooks
import Order from 'layouts/Order';
import { usePembayaran } from 'hooks/usePembayaran';

// Organisms
import PaymentCustomerList from 'components/organisms/PaymentCustomerList';
import PaymentDetailPanel from 'components/organisms/PaymentDetailPanel';
import PaymentModalContent from 'components/Modals/PaymentModalContent';

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

    return (
        <Order>
            <div className="header bg-gradient-info pb-6 pt-4 pt-md-0 px-4 shadow-lg">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col md="6">
                                <h1 className="display-2 text-white font-weight-bold mb-0">Pembayaran Kasir</h1>
                                <p className="text-white opacity-8 h4 mt-2 mb-0">
                                    Proses tagihan aktif, penerimaan dana, dan konfirmasi pengambilan barang.
                                </p>
                            </Col>
                            <Col md="6" className="text-right">
                                <div className="btn-group shadow-premium rounded-pill overflow-hidden bg-white-20 p-1">
                                    <Button
                                        color={viewMode === "legacy" ? "white" : "link"}
                                        size="sm"
                                        onClick={() => setViewMode("legacy")}
                                        className={`px-4 rounded-pill font-weight-bold ${viewMode === 'legacy' ? 'text-primary' : 'text-white'}`}
                                    >
                                        <i className="fas fa-list mr-2" /> List View
                                    </Button>
                                    <Button
                                        color={viewMode === "modern" ? "white" : "link"}
                                        size="sm"
                                        onClick={() => setViewMode("modern")}
                                        className={`px-4 rounded-pill font-weight-bold ${viewMode === 'modern' ? 'text-primary' : 'text-white'}`}
                                    >
                                        <i className="fas fa-th-large mr-2" /> Grid View
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 pb-5" fluid>
                <Row className="gx-4">
                    <Col lg="8" className="mb-4">
                        <PaymentCustomerList 
                            customers={dataCustomer}
                            totalUnpaid={totalBlmBayar}
                            onSearch={handleSearch}
                            onSelect={selectCustomer}
                            selectedId={filtered?.id}
                            loading={loading}
                            viewMode={viewMode === 'modern' ? 'modern' : 'legacy'}
                            calculateCustomerBill={calculateCustomerBill}
                        />
                    </Col>

                    <Col lg="4" className="mb-4">
                        <PaymentDetailPanel 
                            customer={filtered}
                            onOpenPayment={handleOpenModal}
                            onSendQris={kirimQrisDinamis}
                            onStatusUpdate={updateStatus}
                            calculateCustomerBill={calculateCustomerBill}
                        />
                    </Col>
                </Row>
            </Container>

            {/* Payment Modal */}
            <Modal centered isOpen={isOpen} toggle={handleCloseModal} autoFocus={false} size="md" contentClassName="border-0 shadow-lg rounded-xl">
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
                .display-2 { font-size: 2.8rem; }
                .bg-white-20 { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important; }
                .rounded-xl { border-radius: 1.5rem !important; }
                .modern-selection-overlay {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1040;
                    padding-bottom: 2rem;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    height: 85vh;
                    display: flex;
                    align-items: flex-end;
                }
                .btn-close-modern {
                    position: absolute;
                    top: -20px;
                    right: 10px;
                    width: 45px;
                    height: 45px;
                    z-index: 1050;
                }
                .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @media (max-width: 768px) {
                    .display-2 { font-size: 2rem; }
                }
            `}</style>
        </Order>
    );
};

export default Pembayaran;
import React, { useState } from "react";
import { Container, Row, Col, Card, CardHeader } from "reactstrap";

// Hooks
import { useCustomerPayment } from "hooks/useCustomerPayment";

// Organisms
import PaymentStats from "components/organisms/PaymentStats";
import PaymentFilterSection from "components/organisms/PaymentFilterSection";
import PaymentListTable from "components/organisms/PaymentListTable";
import PaymentDetailModal from "components/Modals/PaymentDetailModal";

const Bayar = () => {
    const { 
        payments, 
        loading, 
        rowPerPage, 
        currentPage, 
        searchData, 
        dateFrom, 
        setDateFrom, 
        dateTo, 
        setDateTo, 
        tipe, 
        handleSearch, 
        handleTipeChange, 
        handlePageChange, 
        handleRowPerPageChange,
        refresh 
    } = useCustomerPayment();

    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const openDetail = (id) => {
        setSelectedPaymentId(id);
        setIsDetailOpen(true);
    };

    return (
        <>
            <div className="header bg-gradient-info pb-6 pt-5 pt-md-6 px-4 shadow-lg">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="6" xs="12">
                                <h1 className="display-2 text-white font-weight-bold">History Transaksi</h1>
                                <p className="text-white opacity-8 h4 mt-2">
                                    Laporan terintegrasi seluruh aliran dana dari pelanggan ke outlet.
                                </p>
                            </Col>
                            <Col lg="6" xs="12" className="text-right d-none d-lg-block">
                                <i className="fas fa-file-invoice-dollar fa-4x text-white opacity-2" />
                            </Col>
                        </Row>
                        <PaymentStats 
                            transferTotal={payments?.transferPayment || 0}
                            cashTotal={payments?.cashPayment || 0}
                        />
                    </div>
                </Container>
            </div>

            <Container className="mt--7 pb-5" fluid>
                <Row>
                    <Col>
                        <Card className="shadow-premium border-0 glass-card overflow-hidden">
                            <CardHeader className="bg-transparent border-0 py-4">
                                <Row className="align-items-center">
                                    <Col>
                                        <h3 className="mb-0 text-dark font-weight-bold">
                                            <i className="fas fa-list-check mr-2 text-primary" />
                                            Data Pembayaran Pelanggan
                                        </h3>
                                    </Col>
                                    <Col className="text-right">
                                        <button 
                                            onClick={() => refresh()} 
                                            className="btn btn-sm btn-light rounded-circle shadow-sm"
                                            disabled={loading}
                                        >
                                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} />
                                        </button>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <PaymentFilterSection 
                                rowPerPage={rowPerPage}
                                onRowPerPageChange={handleRowPerPageChange}
                                tipe={tipe}
                                onTipeChange={handleTipeChange}
                                dateFrom={dateFrom}
                                setDateFrom={setDateFrom}
                                dateTo={dateTo}
                                setDateTo={setDateTo}
                                searchData={searchData}
                                onSearchChange={handleSearch}
                            />

                            <PaymentListTable 
                                payments={payments}
                                loading={loading}
                                rowPerPage={rowPerPage}
                                onPageChange={handlePageChange}
                                previousPage={() => handlePageChange(currentPage - 1)}
                                nextPage={() => handlePageChange(currentPage + 1)}
                                onRowClick={(id) => openDetail(id)}
                            />
                        </Card>
                    </Col>
                </Row>
                <PaymentDetailModal 
                    isOpen={isDetailOpen}
                    toggle={() => setIsDetailOpen(!isDetailOpen)}
                    paymentId={selectedPaymentId}
                />
            </Container>

            <style>{`
                .display-2 { font-size: 2.8rem; }
                .bg-gradient-info { 
                    background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
                }
                @media (max-width: 768px) {
                    .display-2 { font-size: 2rem; }
                }
            `}</style>
        </>
    );
};

export default Bayar;
import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';

// Hooks
import { useDeposit } from '../../hooks/useDeposit';

// Organisms
import DepositList from '../../components/organisms/deposit/DepositList';
import DepositDetail from '../../components/organisms/deposit/DepositDetail';
import TopUpModal from '../../components/organisms/deposit/TopUpModal';

const Deposit = () => {
    const {
        deposits,
        loading,
        search,
        setSearch,
        page,
        setPage,
        totalItems,
        limit,
        selectedCustomer,
        setSelectedCustomer,
        historyLoading,
        fetchHistory,
        topUpModal,
        setTopUpModal,
        topUpLoading,
        topUpData,
        setTopUpData,
        handleTopUp,
        openTopUp
    } = useDeposit();

    const handleSelect = (id) => {
        fetchHistory(id);
    };

    return (
        <>
            <div className="header bg-gradient-info pb-6 pt-5 pt-md-6 px-4 shadow-lg">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="6" xs="12">
                                <h1 className="display-2 text-white font-weight-bold">Deposit Pelanggan</h1>
                                <p className="text-white opacity-8 h4 mt-2">
                                    Kelola saldo deposit, histori transaksi, dan top-up untuk pelanggan setia Anda.
                                </p>
                            </Col>
                            <Col lg="6" xs="12" className="text-right d-none d-lg-block">
                                <i className="fas fa-coins fa-4x text-white opacity-2" />
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 pb-5" fluid>
                <Row>
                    <Col>
                        <Card className="shadow-premium border-0 glass-card">
                            {selectedCustomer ? (
                                <DepositDetail 
                                    customer={selectedCustomer}
                                    loading={historyLoading}
                                    onBack={() => setSelectedCustomer(null)}
                                    onTopUp={openTopUp}
                                />
                            ) : (
                                <DepositList 
                                    items={deposits}
                                    loading={loading}
                                    search={search}
                                    onSearch={setSearch}
                                    onSelect={handleSelect}
                                    onTopUp={openTopUp}
                                    totalItems={totalItems}
                                    page={page}
                                    setPage={setPage}
                                    limit={limit}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modals */}
            <TopUpModal 
                isOpen={topUpModal}
                toggle={() => setTopUpModal(!topUpModal)}
                data={topUpData}
                setData={setTopUpData}
                loading={topUpLoading}
                onSave={handleTopUp}
            />

            <style>{`
                .display-2 { font-size: 2.8rem; }
                .bg-gradient-info { 
                    background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                }
                .shadow-premium {
                    box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
                }
                .cursor-pointer { cursor: pointer; }
                .animate__animated { animation-duration: 0.5s; }
                
                .pagination-premium .page-link {
                    border: none;
                    margin: 0 3px;
                    border-radius: 8px !important;
                    color: #525f7f;
                    font-weight: 500;
                }
                .pagination-premium .page-item.active .page-link {
                    background-color: #5e72e4;
                    box-shadow: 0 4px 11px rgba(94, 114, 228, 0.35);
                }
                
                @media (max-width: 768px) {
                    .display-2 { font-size: 2rem; }
                }
            `}</style>
        </>
    );
};

export default Deposit;
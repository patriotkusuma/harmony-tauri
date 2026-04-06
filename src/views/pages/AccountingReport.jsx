import React from "react";
import { Container, Row, Card, CardHeader, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useAccountingReport } from "hooks/useAccountingReport";

// Molecules
import AccountingReportHeader from "components/molecules/accounting/AccountingReportHeader";
import AccountingMetricCard from "components/molecules/accounting/AccountingMetricCard";

// Organisms
import AccountingSummaryTab from "components/organisms/accounting/AccountingSummaryTab";
import BalanceSheetTab from "components/organisms/accounting/BalanceSheetTab";
import IncomeStatementTab from "components/organisms/accounting/IncomeStatementTab";
import CashFlowTab from "components/organisms/accounting/CashFlowTab";
import EquityChangesTab from "components/organisms/accounting/EquityChangesTab";
import FinancialNotesTab from "components/organisms/accounting/FinancialNotesTab";
import AccountingPeriodsTab from "components/organisms/accounting/AccountingPeriodsTab";
import WithdrawalTab from "components/organisms/accounting/WithdrawalTab";
import TransferTab from "components/organisms/accounting/TransferTab";

const tabs = [
    { id: "summary", label: "Ringkasan", icon: "fas fa-th-large" },
    { id: "income-statement", label: "Laba Rugi", icon: "fas fa-balance-scale" },
    { id: "balance-sheet", label: "Neraca", icon: "fas fa-columns" },
    { id: "cash-flow", label: "Arus Kas", icon: "fas fa-money-bill-wave" },
    { id: "equity-changes", label: "Ekuitas", icon: "fas fa-chart-area" },
    { id: "notes", label: "Catatan", icon: "fas fa-sticky-note" },
    { id: "withdrawals", label: "Prive", icon: "fas fa-hand-holding-usd" },
    { id: "transfers", label: "Pemindahan", icon: "fas fa-exchange-alt" },
    { id: "periods", label: "Periode", icon: "fas fa-calendar-check" },
];

const AccountingReport = () => {
    const {
        loading,
        filters,
        setFilters,
        activeReportTab,
        setActiveReportTab,
        summary,
        balanceSheet,
        incomeStatement,
        cashFlow,
        equityChanges,
        financialNotes,
        periods,
        autoCloseEnabled,
        withdrawals,
        transfers,
        handleRefresh,
        toggleAutoClose,
        forceClosePeriod,
        createWithdrawal,
        deleteWithdrawal,
        createTransfer,
        deleteTransfer,
    } = useAccountingReport();

    const netIncome = (summary.total_revenue || 0) - (summary.total_expense || 0);

    return (
        <div className="acct-report-page">
            {/* Header Section */}
            <div className="header bg-gradient-finance pb-8 pt-5 pt-md-8 px-4 position-relative overflow-hidden">
                <div className="bloom bloom-1"></div>
                <div className="bloom bloom-2"></div>
                <div className="bloom bloom-3"></div>
                <Container fluid>
                    <div className="header-body">
                        <AccountingReportHeader
                            filters={filters}
                            setFilters={setFilters}
                            onRefresh={handleRefresh}
                            loading={loading}
                        />

                        {/* Summary Metric Cards */}
                        <Row className="metrics-row animate__animated animate__fadeIn">
                            <AccountingMetricCard
                                icon="fas fa-chart-line"
                                label="Total Pendapatan"
                                value={summary.total_revenue}
                                sub="Revenue"
                                tone="success"
                            />
                            <AccountingMetricCard
                                icon="fas fa-receipt"
                                label="Total Beban"
                                value={summary.total_expense}
                                sub="Expense"
                                tone="danger"
                            />
                            <AccountingMetricCard
                                icon="fas fa-wallet"
                                label="Laba Bersih"
                                value={netIncome}
                                sub={netIncome >= 0 ? "Profit" : "Loss"}
                                tone={netIncome >= 0 ? "primary" : "danger"}
                            />
                            <AccountingMetricCard
                                icon="fas fa-coins"
                                label="Total Aset"
                                value={summary.total_assets}
                                sub="Assets"
                                tone="info"
                            />
                        </Row>
                    </div>
                </Container>
            </div>

            {/* Tab Content Section */}
            <Container className="mt--6 mb-5" fluid>
                <Card className="shadow-premium border-0 glass-panel overflow-hidden">
                    <CardHeader className="bg-transparent border-0 pt-4 pb-0">
                        <Nav tabs className="nav-fill flex-column flex-sm-row rounded-pill bg-light p-1 mx-3 border-0 acct-nav">
                            {tabs.map((tab) => (
                                <NavItem key={tab.id}>
                                    <NavLink
                                        className={classnames("rounded-pill py-2 font-weight-bold cursor-pointer", {
                                            active: activeReportTab === tab.id
                                        })}
                                        onClick={() => setActiveReportTab(tab.id)}
                                    >
                                        <i className={`${tab.icon} me-2`} />
                                        {tab.label}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </CardHeader>
                    <CardBody className="px-md-5 py-5 min-h-500 animate__animated animate__fadeIn">
                        <TabContent activeTab={activeReportTab}>
                            <TabPane tabId="summary">
                                <AccountingSummaryTab data={summary} loading={loading} />
                            </TabPane>
                            <TabPane tabId="balance-sheet">
                                <BalanceSheetTab data={balanceSheet} loading={loading} />
                            </TabPane>
                            <TabPane tabId="income-statement">
                                <IncomeStatementTab data={incomeStatement} loading={loading} />
                            </TabPane>
                            <TabPane tabId="cash-flow">
                                <CashFlowTab data={cashFlow} loading={loading} />
                            </TabPane>
                            <TabPane tabId="equity-changes">
                                <EquityChangesTab data={equityChanges} loading={loading} />
                            </TabPane>
                            <TabPane tabId="notes">
                                <FinancialNotesTab data={financialNotes} loading={loading} />
                            </TabPane>
                            <TabPane tabId="withdrawals">
                                <WithdrawalTab
                                    data={withdrawals}
                                    loading={loading}
                                    accounts={summary.accounts || []}
                                    onCreateWithdrawal={createWithdrawal}
                                    onDeleteWithdrawal={deleteWithdrawal}
                                />
                            </TabPane>
                            <TabPane tabId="transfers">
                                <TransferTab
                                    data={transfers}
                                    accounts={summary.accounts || []}
                                    loading={loading}
                                    onCreateTransfer={createTransfer}
                                    onDeleteTransfer={deleteTransfer}
                                />
                            </TabPane>
                            <TabPane tabId="periods">
                                <AccountingPeriodsTab
                                    periods={periods}
                                    autoCloseEnabled={autoCloseEnabled}
                                    loading={loading}
                                    onToggleAutoClose={toggleAutoClose}
                                    onClosePeriod={forceClosePeriod}
                                />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </Container>

            <style>{`
                .bg-gradient-finance {
                    background: linear-gradient(135deg, #0c1222 0%, #1a1f3a 50%, #0f172a 100%);
                    border-bottom: 4px solid #10b981;
                }
                .text-white-50 { color: rgba(255,255,255,0.6) !important; }
                .backdrop-blur { backdrop-filter: blur(10px); }
                .rounded-xl { border-radius: 12px; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important; }
                .glass-panel { background: rgba(255,255,255,0.97); backdrop-filter: blur(5px); }
                
                .acct-nav .nav-link.active {
                    background: linear-gradient(135deg, #10b981, #059669) !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                .acct-nav .nav-link { 
                    border: none !important; 
                    color: #64748b; 
                    font-size: 0.8rem;
                    transition: all 0.25s ease;
                }
                .acct-nav .nav-link:hover:not(.active) {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.08);
                }
                .min-h-500 { min-height: 500px; }
                
                .bloom {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.08;
                }
                .bloom-1 { width: 400px; height: 400px; top: -100px; right: -50px; background: #10b981; }
                .bloom-2 { width: 300px; height: 300px; bottom: -100px; left: -50px; background: #6366f1; }
                .bloom-3 { width: 250px; height: 250px; top: 50%; left: 40%; background: #3b82f6; }

                .uppercase { text-transform: uppercase; }
                .ls-1 { letter-spacing: 0.5px; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default AccountingReport;

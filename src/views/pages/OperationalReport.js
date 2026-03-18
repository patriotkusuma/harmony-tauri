import React, { useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useOperationalReport } from "hooks/useOperationalReport";

// Atoms/Molecules
import OperationalMetricCard from "components/molecules/operational/OperationalMetricCard";
import OperationalReportHeader from "components/molecules/operational/OperationalReportHeader";

// Organisms
import OrderProductionTable from "components/organisms/operational/OrderProductionTable";
import InventoryUsageTable from "components/organisms/operational/InventoryUsageTable";
import EmployeePerformanceTable from "components/organisms/operational/EmployeePerformanceTable";
import RfidAuditTable from "components/organisms/operational/RfidAuditTable";

const OperationalReport = () => {
    const [activeTab, setActiveTab] = useState("orders");
    const { 
        loading, 
        filters, 
        setFilters, 
        orderReports, 
        inventoryReports, 
        employeeReports, 
        rfidReports, 
        fetchOrderReport, 
        fetchInventoryReport, 
        fetchEmployeeReport, 
        fetchRfidReport 
    } = useOperationalReport();

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            if (tab === "orders") fetchOrderReport();
            if (tab === "inventory") fetchInventoryReport();
            if (tab === "employees") fetchEmployeeReport();
            if (tab === "rfid") fetchRfidReport();
        }
    };

    const handleExport = () => {
        // Implementation for export
        console.log("Exporting data for ", activeTab);
    };

    return (
        <div className="op-report-page">
            <div className="header bg-gradient-premium pb-8 pt-5 pt-md-8 px-4 position-relative overflow-hidden">
                <div className="bloom bloom-1"></div>
                <div className="bloom bloom-2"></div>
                <Container fluid>
                    <div className="header-body">
                        <OperationalReportHeader 
                            filters={filters} 
                            setFilters={setFilters} 
                            onExport={handleExport} 
                        />

                        {/* Summary Metrics Section */}
                        <Row className="metrics-row animate__animated animate__fadeIn">
                            {activeTab === "orders" && (
                                <>
                                    <OperationalMetricCard icon="fas fa-hourglass-start" label="Outstanding" value={orderReports.summary.total_outstanding || 0} sub="Pesanan Baru" tone="info" />
                                    <OperationalMetricCard icon="fas fa-exclamation-triangle" label="Overdue" value={orderReports.summary.total_overdue || 0} sub="Melewati SLA" tone="danger" />
                                    <OperationalMetricCard icon="fas fa-check-double" label="Selesai" value={orderReports.summary.total_completed || 0} sub="Total Berhasil" tone="success" />
                                    <OperationalMetricCard icon="fas fa-tasks" label="Total" value={(orderReports.summary.total_outstanding || 0) + (orderReports.summary.total_completed || 0)} sub="Pesanan" tone="primary" />
                                </>
                            )}
                            {activeTab === "inventory" && (
                                <>
                                    <OperationalMetricCard icon="fas fa-arrow-up" label="Stok Keluar" value={inventoryReports.data.length || 0} sub="Transaksi" tone="warning" />
                                    <OperationalMetricCard icon="fas fa-bell" label="Low Stock" value={inventoryReports.lowStockAlerts.length || 0} sub="Perlu Restock" tone="danger" />
                                    <OperationalMetricCard icon="fas fa-boxes" label="Update Harian" value={inventoryReports.data.length || 0} sub="Aktif" tone="primary" />
                                </>
                            )}
                            {activeTab === "employees" && (
                                <>
                                    <OperationalMetricCard icon="fas fa-users" label="Karyawan" value={employeeReports.length || 0} sub="Terlibat" tone="info" />
                                    <OperationalMetricCard icon="fas fa-bolt" label="Produktif" value={employeeReports.length > 0 ? employeeReports[0].nama_pegawai : '-'} sub="Top Performer" tone="success" />
                                    <OperationalMetricCard icon="fas fa-medal" label="Sla Rate" value="92%" sub="Target 90%" tone="primary" />
                                </>
                            )}
                            {activeTab === "rfid" && (
                                <>
                                    <OperationalMetricCard icon="fas fa-tag" label="RFID Aktif" value={rfidReports.summary.total_active || 0} sub="Sedang Dipakai" tone="info" />
                                    <OperationalMetricCard icon="fas fa-box-open" label="RFID Idle" value={rfidReports.summary.total_idle || 0} sub="Tersedia" tone="success" />
                                    <OperationalMetricCard icon="fas fa-search-location" label="Lost Risk" value={rfidReports.summary.total_lost_risk || 0} sub="Audit Segera" tone="danger" />
                                </>
                            )}
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 mb-5" fluid>
                <Card className="shadow-premium border-0 glass-panel overflow-hidden">
                    <CardHeader className="bg-transparent border-0 pt-4 pb-0">
                        <Nav tabs className="nav-fill flex-column flex-sm-row rounded-pill bg-light p-1 mx-3 border-0">
                            <NavItem>
                                <NavLink
                                    className={classnames("rounded-pill py-2 font-weight-bold cursor-pointer", { active: activeTab === "orders" })}
                                    onClick={() => toggle("orders")}
                                >
                                    <i className="fas fa-spinner mr-2" />
                                    Produksi & Produksi
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("rounded-pill py-2 font-weight-bold cursor-pointer", { active: activeTab === "inventory" })}
                                    onClick={() => toggle("inventory")}
                                >
                                    <i className="fas fa-warehouse mr-2" />
                                    Pemakaian Stok
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("rounded-pill py-2 font-weight-bold cursor-pointer", { active: activeTab === "employees" })}
                                    onClick={() => toggle("employees")}
                                >
                                    <i className="fas fa-user-tie mr-2" />
                                    Kinerja Karyawan
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("rounded-pill py-2 font-weight-bold cursor-pointer", { active: activeTab === "rfid" })}
                                    onClick={() => toggle("rfid")}
                                >
                                    <i className="fas fa-fingerprint mr-2" />
                                    Audit RFID
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </CardHeader>
                    <CardBody className="px-md-5 py-5 min-h-500 animate__animated animate__fadeIn">
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="orders">
                                <OrderProductionTable data={orderReports.data} loading={loading} />
                            </TabPane>
                            <TabPane tabId="inventory">
                                <InventoryUsageTable 
                                    data={inventoryReports.data} 
                                    lowStockAlerts={inventoryReports.lowStockAlerts} 
                                    loading={loading} 
                                />
                            </TabPane>
                            <TabPane tabId="employees">
                                <EmployeePerformanceTable data={employeeReports} loading={loading} />
                            </TabPane>
                            <TabPane tabId="rfid">
                                <RfidAuditTable data={rfidReports.data} loading={loading} />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </Container>

            <style>{`
                .bg-gradient-premium {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-bottom: 4px solid #3b82f6;
                }
                .text-white-50 { color: rgba(255,255,255,0.6) !important; }
                .backdrop-blur { backdrop-filter: blur(10px); }
                .rounded-xl { border-radius: 12px; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important; }
                .glass-panel { background: rgba(255,255,255,0.95); backdrop-filter: blur(5px); }
                .nav-tabs .nav-link.active {
                    background-color: #3b82f6 !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                .nav-tabs .nav-link { border: none !important; color: #64748b; }
                .min-h-500 { min-height: 500px; }
                
                .bloom {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.1;
                }
                .bloom-1 { width: 400px; height: 400px; top: -100px; right: -50px; background: #3b82f6; }
                .bloom-2 { width: 300px; height: 300px; bottom: -100px; left: -50px; background: #8b5cf6; }

                .uppercase { text-transform: uppercase; }
                .ls-1 { letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
};

export default OperationalReport;

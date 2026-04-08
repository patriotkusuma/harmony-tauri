import React, { useState, useMemo } from "react";
import { 
    Container, Row, Col, Card, CardHeader, Input, 
    InputGroup, InputGroupText, Button, Nav, NavItem, NavLink,
    TabContent, TabPane
} from "reactstrap";

// Custom Hooks
import { useBilling } from "hooks/useBilling";
import RupiahFormater from "utils/RupiahFormater";

// Organisms (Atomic Structure)
import BillingStats from "components/organisms/BillingStats";
import BillingListTable from "components/organisms/BillingListTable";

const BillingManagement = () => {
    const [activeTab, setActiveTab] = useState("1");

    // Hook 1: Daftar Penagihan Utama (Aktif/Lunas)
    const mainBilling = useBilling(""); 
    
    // Hook 2: Daftar Tagihan yang sudah DIGABUNG (History/Archived)
    const mergedBilling = useBilling("MERGED");

    const { 
        bills: mainBills, loading: mainLoading, page: mainPage, setPage: setMainPage, 
        totalPages: mainTotalPages, search: mainSearch, setSearch: setMainSearch, 
        refresh: mainRefresh, joinBills, sendNotification, status: mainStatus, setStatus: setMainStatus 
    } = mainBilling;

    const {
        bills: mergedBills, loading: mergedLoading, page: mergedPage, setPage: setMergedPage,
        totalPages: mergedTotalPages, search: mergedSearch, setSearch: setMergedSearch,
        refresh: mergedRefresh
    } = mergedBilling;

    const [selectedIds, setSelectedIds] = useState([]);

    // Logic: Toggle selection for merge
    const toggleSelect = (uuid) => {
        setSelectedIds(prev => prev.includes(uuid) 
            ? prev.filter(id => id !== uuid) 
            : [...prev, uuid]
        );
    };

    const handleJoin = async () => {
        await joinBills(selectedIds);
        setSelectedIds([]);
    };

    // Calculate Dynamic Stats (based on main list)
    const totalOutstanding = useMemo(() => 
        mainBills.reduce((sum, b) => b.status !== 'PAID' ? sum + b.total_amount : sum, 0), 
    [mainBills]);

    const unpaidCount = useMemo(() => (mainBills || []).filter(b => b.status === 'UNPAID').length, [mainBills]);
    const partialCount = useMemo(() => (mainBills || []).filter(b => b.status === 'PARTIAL').length, [mainBills]);
    const activeGroups = useMemo(() => {
        const groups = new Set((mainBills || []).map(b => b.group_id).filter(id => !!id));
        return groups.size;
    }, [mainBills]);

    return (
        <>
            {/* Admin-style Header with Stats Section */}
            <div className="header pb-8 pt-5 pt-md-8 px-4 bg-gradient-info shadow-lg position-relative overflow-hidden">
                <div className="pos-accent accent-1"></div>
                <div className="pos-accent accent-2"></div>
                
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="8" xs="7">
                                <h6 className="h2 text-white d-inline-block mb-0 font-weight-bold">
                                    Manajemen Tagihan
                                </h6>
                                <p className="text-white opacity-8 h4 mt-2">
                                    Total Penagihan: <span className="font-weight-bold"><RupiahFormater value={totalOutstanding} /></span>
                                </p>
                            </Col>
                            <Col lg="4" xs="5" className="text-end">
                                {activeTab === "1" && (
                                    <Button 
                                        className={`px-4 rounded-pill shadow-premium transition-all ${selectedIds.length >= 2 ? 'pulse-button' : 'opacity-6'}`}
                                        color="white" 
                                        disabled={selectedIds.length < 2 || mainLoading}
                                        onClick={handleJoin}
                                    >
                                        <i className="fas fa-layer-group text-primary me-2" />
                                        <span className="text-primary font-weight-bold">
                                            Gabung Nota {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
                                        </span>
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        
                        {/* ATOM: Organism - BillingStats */}
                        <div className="mt-4">
                            <BillingStats 
                                totalOutstanding={totalOutstanding}
                                unpaidCount={unpaidCount}
                                partialCount={partialCount}
                                activeGroups={activeGroups}
                            />
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 px-4 pb-5 position-relative" style={{ zIndex: 5 }} fluid>
                <Row>
                    <Col>
                        <Nav tabs className="nav-tabs-premium mb-0 border-0">
                            <NavItem>
                                <NavLink
                                    className={`rounded-top-xl transition-all ${activeTab === "1" ? "active bg-white" : "text-white opacity-7"}`}
                                    onClick={() => setActiveTab("1")}
                                    style={{ cursor: "pointer", border: "none", fontWeight: "bold" }}
                                >
                                    <i className="fas fa-file-invoice-dollar me-2" />
                                    Penagihan Aktif
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={`rounded-top-xl transition-all ${activeTab === "2" ? "active bg-white" : "text-white opacity-7"}`}
                                    onClick={() => setActiveTab("2")}
                                    style={{ cursor: "pointer", border: "none", fontWeight: "bold" }}
                                >
                                    <i className="fas fa-layer-group me-2" />
                                    Tagihan Digabung
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Card className="shadow-premium border-0 glass-panel-light overflow-hidden rounded-bottom-xl rounded-top-right-xl">
                                    <CardHeader className="bg-transparent border-bottom-0 py-4">
                                        <Row className="align-items-center g-3">
                                            <Col lg="5">
                                                <InputGroup className="input-group-alternative rounded-pill shadow-sm border bg-white">
                                                    <InputGroupText className="bg-transparent border-0 px-4">
                                                        <i className="fas fa-search text-muted"/>
                                                    </InputGroupText>
                                                    <Input 
                                                        className="border-0 font-weight-bold" 
                                                        placeholder="Cari Nota, Customer..." 
                                                        value={mainSearch}
                                                        onChange={(e) => setMainSearch(e.target.value)}
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col lg="3">
                                                <div className="d-flex align-items-center">
                                                    <label className="mb-0 mr-3 text-muted font-weight-bold small text-uppercase">Status:</label>
                                                    <Input 
                                                        type="select" 
                                                        className="rounded-pill shadow-sm border font-weight-bold"
                                                        value={mainStatus}
                                                        onChange={(e) => setMainStatus(e.target.value)}
                                                    >
                                                        <option value="">Semua Status</option>
                                                        <option value="UNPAID">Hutang (Unpaid)</option>
                                                        <option value="PARTIAL">Cicilan (Partial)</option>
                                                        <option value="PAID">Lunas (Paid)</option>
                                                    </Input>
                                                </div>
                                            </Col>
                                            <Col className="text-end">
                                                <Button 
                                                    color="secondary" outline 
                                                    className="rounded-circle btn-icon-only shadow-sm border-0 bg-white" 
                                                    onClick={mainRefresh}
                                                >
                                                    <i className={`fas fa-sync-alt ${mainLoading ? 'fa-spin' : ''} text-primary`} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <BillingListTable 
                                        bills={mainBills.filter(b => b.status !== 'MERGED')}
                                        loading={mainLoading}
                                        selectedIds={selectedIds}
                                        toggleSelect={toggleSelect}
                                        onSendNotification={sendNotification}
                                        page={mainPage}
                                        totalPages={mainTotalPages}
                                        setPage={setMainPage}
                                        onRefresh={mainRefresh}
                                    />
                                </Card>
                            </TabPane>

                            <TabPane tabId="2">
                                <Card className="shadow-premium border-0 glass-panel-light overflow-hidden rounded-bottom-xl rounded-top-right-xl">
                                    <CardHeader className="bg-transparent border-bottom-0 py-4">
                                        <Row className="align-items-center g-3">
                                            <Col lg="5">
                                                <InputGroup className="input-group-alternative rounded-pill shadow-sm border bg-white">
                                                    <InputGroupText className="bg-transparent border-0 px-4">
                                                        <i className="fas fa-search text-muted"/>
                                                    </InputGroupText>
                                                    <Input 
                                                        className="border-0 font-weight-bold" 
                                                        placeholder="Cari Tagihan Digabung..." 
                                                        value={mergedSearch}
                                                        onChange={(e) => setMergedSearch(e.target.value)}
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col className="text-end">
                                                <Button 
                                                    color="secondary" outline 
                                                    className="rounded-circle btn-icon-only shadow-sm border-0 bg-white" 
                                                    onClick={mergedRefresh}
                                                >
                                                    <i className={`fas fa-sync-alt ${mergedLoading ? 'fa-spin' : ''} text-primary`} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <BillingListTable 
                                        bills={mergedBills}
                                        loading={mergedLoading}
                                        selectedIds={[]}
                                        toggleSelect={() => {}}
                                        onSendNotification={sendNotification}
                                        page={mergedPage}
                                        totalPages={mergedTotalPages}
                                        setPage={setMergedPage}
                                        onRefresh={mergedRefresh}
                                    />
                                </Card>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .glass-panel-light {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .btn-icon-only {
                    width: 45px;
                    height: 45px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important; }
                .rounded-xl { border-radius: 1.5rem !important; }
                .rounded-top-xl { border-radius: 1.25rem 1.25rem 0 0 !important; }
                .rounded-bottom-xl { border-radius: 0 0 1.25rem 1.25rem !important; }
                .rounded-top-right-xl { border-top-right-radius: 1.25rem !important; }
                
                .nav-tabs-premium .nav-link {
                    padding: 0.75rem 1.5rem;
                    margin-right: 0.5rem;
                    border: none;
                }
                .nav-tabs-premium .nav-link.active {
                    color: #5e72e4 !important;
                    box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
                }
                
                .pos-accent {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(94, 114, 228, 0.1) 0%, rgba(94, 114, 228, 0) 100%);
                    z-index: 0;
                }
                .accent-1 { width: 500px; height: 500px; top: -150px; right: -100px; }
                .accent-2 { width: 350px; height: 350px; bottom: -100px; left: -100px; }
                
                .pulse-button { animation: pulse-border 2s infinite; }
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
                .bg-gradient-info { background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; }
            `}</style>
        </>
    );
};

export default BillingManagement;

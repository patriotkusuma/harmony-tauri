import React, { useCallback, useState } from 'react';
import { Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Header from 'components/Headers/Header';
import { useInventory } from 'hooks/useInventory';
import { useInventoryAudit } from 'hooks/useInventoryAudit';
import { useInventoryStore } from 'store/inventoryStore';
import InventoryHeader from 'components/organisms/InventoryHeader';
import InventoryListTable from 'components/organisms/InventoryListTable';
import InventoryStats from 'components/organisms/InventoryStats';
import InventoryDetailModal from 'components/organisms/InventoryDetailModal';
import InventoryAdjustModal from 'components/organisms/InventoryAdjustModal';
import InventoryCreateModal from 'components/organisms/InventoryCreateModal';
import SatuanManagement from 'components/organisms/SatuanManagement';
import StockOpnameTab from 'components/organisms/StockOpnameTab';
import StockOpnameModal from 'components/organisms/StockOpnameModal';
import Pagination from 'components/Pagination/Pagination';

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    
    // Safely destructure hooks
    const inventoryData = useInventory();
    const auditData = useInventoryAudit();
    
    // Destructure inventory hook values with defaults
    const {
        inventory = { data: [], total: 0 },
        movements = [],
        isLoading = false,
        isLoadingMovements = false,
        filters = { page: 1, limit: 10, search: '' },
        setFilters = () => {},
        adjustStock = () => {},
        createInventory = () => {},
        updateInventory = () => {},
        deleteInventory = () => {},
        references = { units: [] },
        isSubmitting = false,
    } = inventoryData || {};

    // Destructure audit hook values with defaults
    const { 
        audits = [], 
        isLoading: isLoadingAudits = false, 
        performAudit = () => {}, 
        isSubmitting: isSubmittingAudit = false 
    } = auditData || {};

    const {
        isDetailModalOpen,
        toggleDetailModal,
        isAdjustModalOpen,
        toggleAdjustModal,
        isCreateModalOpen,
        toggleCreateModal,
        selectedItem,
        setSelectedItem,
    } = useInventoryStore();

    const handleSearch = (query) => {
        setFilters({ ...filters, search: query, page: 1 });
    };

    const handlePageChange = (pageNumber) => {
        setFilters({ ...filters, page: pageNumber });
    };

    const onDetailOpen = (item) => {
        setSelectedItem(item);
        toggleDetailModal(true);
    };

    const onAdjustOpen = (item) => {
        setSelectedItem(item);
        toggleAdjustModal(true);
    };

    const onEditOpen = (item) => {
        setSelectedItem(item);
        toggleCreateModal(true);
    };

    const onDeleteItem = async (item) => {
        if (item && window.confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"? Data akan terhapus permanen.`)) {
            await deleteInventory(item.uuid);
        }
    };

    const handleAdjustSubmit = (data) => {
        adjustStock(data);
    };

    const handleCreateSubmit = (data) => {
        if (selectedItem?.uuid) {
            updateInventory({ uuid: selectedItem.uuid, payload: data });
        } else {
            createInventory(data);
        }
    };

    // Global loading for first time enter
    if (isLoading && (!inventory || !inventory.data)) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Header />
                <Container className="mt--6 pb-5" fluid>
                    <div className="text-center py-5 bg-white rounded-xl shadow-premium">
                        <div className="spinner-border text-primary mb-3" />
                        <h4 className="text-muted">Memuat Modul Inventaris...</h4>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <Header />
            <Container className="mt--6 pb-5" fluid>
                <div className="nav-wrapper mb-3" style={{ position: 'relative', zIndex: 10 }}>
                    <Nav className="nav-pills-custom justify-content-center justify-content-md-start" pills>
                        <NavItem>
                            <NavLink
                                className={classnames('rounded-pill px-4 font-weight-bold shadow-sm', { 
                                    active: activeTab === 'inventory',
                                    'text-white': activeTab === 'inventory'
                                })}
                                onClick={(e) => { e.preventDefault(); setActiveTab('inventory'); }}
                                href="#"
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-boxes me-2" /> Stok Inventaris
                            </NavLink>
                        </NavItem>
                        <NavItem className="ms-md-2">
                            <NavLink
                                className={classnames('rounded-pill px-4 font-weight-bold shadow-sm', { 
                                    active: activeTab === 'satuan',
                                    'text-white': activeTab === 'satuan'
                                })}
                                onClick={(e) => { e.preventDefault(); setActiveTab('satuan'); }}
                                href="#"
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-ruler me-2" /> Satuan Unit
                            </NavLink>
                        </NavItem>
                        <NavItem className="ms-md-2 mt-2 mt-md-0">
                            <NavLink
                                className={classnames('rounded-pill px-4 font-weight-bold shadow-sm', { 
                                    active: activeTab === 'audit',
                                    'text-white': activeTab === 'audit'
                                })}
                                onClick={(e) => { e.preventDefault(); setActiveTab('audit'); }}
                                href="#"
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-check-double me-2" /> Audit & Opname
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="inventory">
                        <InventoryStats data={inventory} />
                        <Card className="shadow-premium border-0 rounded-xl overflow-hidden mb-4">
                            <CardBody className="p-4 p-md-5">
                                <InventoryHeader 
                                    filters={filters}
                                    onSearch={handleSearch}
                                    onAdd={() => toggleCreateModal(true)}
                                />
                                <div className="mt-4">
                                    <InventoryListTable 
                                        data={inventory}
                                        loading={isLoading}
                                        onDetail={onDetailOpen}
                                        onAdjust={onAdjustOpen}
                                        onEdit={onEditOpen}
                                        onDelete={onDeleteItem}
                                    />
                                </div>
                                {inventory && inventory.total > filters.limit && (
                                    <div className="mt-4 d-flex justify-content-center">
                                        <Pagination
                                            currentPage={inventory.current_page}
                                            rowPerPage={filters.limit}
                                            totalPosts={inventory.total}
                                            onPageChange={handlePageChange}
                                            previousPage={() => handlePageChange(filters.page - 1)}
                                            nextPage={() => handlePageChange(filters.page + 1)}
                                        />
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </TabPane>

                    <TabPane tabId="satuan">
                        <Card className="shadow-premium border-0 rounded-xl overflow-hidden mb-4">
                            <CardBody className="p-4 p-md-5">
                                <SatuanManagement />
                            </CardBody>
                        </Card>
                    </TabPane>

                    <TabPane tabId="audit">
                        <Card className="shadow-premium border-0 rounded-xl overflow-hidden mb-4">
                            <CardBody className="p-4 p-md-5">
                                <StockOpnameTab 
                                    audits={audits}
                                    isLoading={isLoadingAudits}
                                    onStartOpname={() => setIsAuditModalOpen(true)}
                                />
                            </CardBody>
                        </Card>
                    </TabPane>
                </TabContent>
            </Container>

            <InventoryDetailModal 
                isOpen={isDetailModalOpen}
                toggle={() => toggleDetailModal()}
                item={selectedItem}
                movements={movements}
                loading={isLoadingMovements}
            />

            <InventoryAdjustModal 
                isOpen={isAdjustModalOpen}
                toggle={() => toggleAdjustModal()}
                item={selectedItem}
                onSubmit={handleAdjustSubmit}
                loading={isSubmitting}
            />

            <InventoryCreateModal 
                isOpen={isCreateModalOpen}
                toggle={() => {
                    toggleCreateModal();
                    if (isCreateModalOpen) setSelectedItem(null);
                }}
                references={references}
                item={selectedItem}
                onSubmit={handleCreateSubmit}
                loading={isSubmitting}
            />

            <StockOpnameModal 
                isOpen={isAuditModalOpen}
                toggle={() => setIsAuditModalOpen(!isAuditModalOpen)}
                onSubmit={performAudit}
                inventories={inventory}
                loading={isSubmittingAudit}
            />

            <style>{`
                .rounded-xl { border-radius: 1.5rem !important; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) !important; }
                
                .nav-pills-custom .nav-link { 
                    border: 1px solid transparent; 
                    color: #8898aa; 
                    background: rgba(255,255,255,0.8);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .nav-pills-custom .nav-link.active { 
                    background: #5e72e4 !important; 
                    color: #ffffff !important; 
                    transform: scale(1.05);
                    box-shadow: 0 7px 14px rgba(50,50,93,.12) !important;
                }
                .nav-pills-custom .nav-link:hover:not(.active) { 
                    background: #eee;
                    color: #32325d;
                }
                
                body.dark-mode .nav-pills-custom .nav-link {
                    background: #1e293b;
                    color: #94a3b8;
                }
                body.dark-mode .nav-pills-custom .nav-link:hover:not(.active) {
                    background: #2d4059;
                    color: #f8fafc;
                }

                .ms-md-2 { margin-left: 0.5rem; }
            `}</style>
        </div>
    );
};

export default InventoryManagement;

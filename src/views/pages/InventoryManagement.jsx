import React, { useCallback } from 'react';
import { Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import Header from 'components/Headers/Header';
import { useInventory } from 'hooks/useInventory';
import { useInventoryStore } from 'store/inventoryStore';

// Organisms
import InventoryHeader from 'components/organisms/InventoryHeader';
import InventoryStats from 'components/organisms/InventoryStats';
import InventoryListTable from 'components/organisms/InventoryListTable';
import InventoryDetailModal from 'components/organisms/InventoryDetailModal';
import InventoryAdjustModal from 'components/organisms/InventoryAdjustModal';
import InventoryCreateModal from 'components/organisms/InventoryCreateModal';
import SatuanManagement from 'components/organisms/SatuanManagement';
import Pagination from 'components/Pagination/Pagination';

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = React.useState('inventory');
    const {
        inventory,
        movements,
        isLoading,
        isLoadingMovements,
        filters,
        setFilters,
        adjustStock,
        createInventory,
        updateInventory,
        deleteInventory,
        references,
        isSubmitting,
    } = useInventory();

    const {
        selectedItem,
        setSelectedItem,
        isDetailModalOpen,
        toggleDetailModal,
        isAdjustModalOpen,
        toggleAdjustModal,
        isCreateModalOpen,
        toggleCreateModal,
    } = useInventoryStore();

    const handleSearch = useCallback((val) => {
        setFilters({ search: val, page: 1 });
    }, [setFilters]);

    const handlePageChange = useCallback((page) => {
        setFilters({ page });
    }, [setFilters]);

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
        if (window.confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"? Data akan terhapus permanen.`)) {
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

    return (
        <>
            <Header />
            <Container className="mt--6 pb-5" fluid>
                <div className="nav-wrapper mb-3">
                    <Nav className="nav-pills-custom" pills role="tablist">
                        <NavItem>
                            <NavLink
                                className={classnames('rounded-pill px-4 font-weight-bold shadow-sm', { active: activeTab === 'inventory' })}
                                onClick={() => setActiveTab('inventory')}
                                href="#inventory"
                            >
                                <i className="fas fa-boxes me-2" /> Stok Inventaris
                            </NavLink>
                        </NavItem>
                        <NavItem className="ms-md-2">
                            <NavLink
                                className={classnames('rounded-pill px-4 font-weight-bold shadow-sm', { active: activeTab === 'satuan' })}
                                onClick={() => setActiveTab('satuan')}
                                href="#satuan"
                            >
                                <i className="fas fa-ruler me-2" /> Satuan Unit
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
                    if (isCreateModalOpen) setSelectedItem(null); // Clear on close
                }}
                references={references}
                item={selectedItem}
                onSubmit={handleCreateSubmit}
                loading={isSubmitting}
            />

            <style>{`
                .rounded-xl { border-radius: 1.5rem !important; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) !important; }
                
                .nav-pills-custom .nav-link { 
                    border: 1px solid transparent; 
                    color: #8898aa; 
                    background: rgba(255,255,255,0.8);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-pills-custom .nav-link.active { 
                    background: #5e72e4 !important; 
                    color: #fff !important; 
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
            `}</style>
        </>
    );
};

export default InventoryManagement;

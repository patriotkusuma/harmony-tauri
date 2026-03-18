import React, { useCallback } from 'react';
import { Container, Card, CardBody } from 'reactstrap';
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
import Pagination from 'components/Pagination/Pagination';

const InventoryManagement = () => {
    const {
        inventory,
        movements,
        isLoading,
        isLoadingMovements,
        filters,
        setFilters,
        adjustStock,
        createInventory,
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

    const handleAdjustSubmit = (data) => {
        adjustStock(data);
    };

    const handleCreateSubmit = (data) => {
        createInventory(data);
    };

    return (
        <>
            <Header />
            <Container className="mt--7 pb-5" fluid>
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
                toggle={() => toggleCreateModal()}
                references={references}
                onSubmit={handleCreateSubmit}
                loading={isSubmitting}
            />

            <style>{`
                .rounded-xl { border-radius: 1.5rem !important; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) !important; }
            `}</style>
        </>
    );
};

export default InventoryManagement;

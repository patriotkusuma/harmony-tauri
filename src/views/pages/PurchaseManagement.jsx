import React, { useCallback } from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import Header from 'components/Headers/Header';
import { usePurchase } from 'hooks/usePurchase';

// Organisms
import PurchaseHeader from 'components/organisms/PurchaseHeader';
import PurchaseStats from 'components/organisms/PurchaseStats';
import PurchaseListTable from 'components/organisms/PurchaseListTable';
import PurchaseFormModal from 'components/organisms/PurchaseFormModal';
import Pagination from 'components/Pagination/Pagination';

const PurchaseManagement = () => {
    const {
        purchases,
        isLoading,
        filters,
        setFilters,
        isFormModalOpen,
        toggleFormModal,
        editMode,
        selectedPurchase,
        references,
        handleEdit,
        handleAddNew,
        createPurchase,
        updatePurchase,
        deletePurchase,
        isSubmitting,
    } = usePurchase();

    const handleSearch = useCallback((val) => {
        setFilters({ search: val, page: 1 });
    }, [setFilters]);

    const handleTypeFilter = useCallback((val) => {
        setFilters({ type: val, page: 1 });
    }, [setFilters]);

    const handlePageChange = useCallback((page) => {
        setFilters({ page });
    }, [setFilters]);

    const onFormSubmit = (data) => {
        if (editMode && selectedPurchase) {
            updatePurchase({ id: selectedPurchase.id, payload: data });
        } else {
            createPurchase(data);
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--6 pb-5" fluid>
                <PurchaseStats data={purchases} />
                
                <Card className="shadow-premium border-0 rounded-xl overflow-hidden mb-4">
                    <CardBody className="p-4 p-md-5">
                        <PurchaseHeader 
                            filters={filters}
                            onSearch={handleSearch}
                            onTypeFilter={handleTypeFilter}
                            onAdd={handleAddNew}
                        />
                        
                        <div className="mt-4">
                            <PurchaseListTable 
                                data={purchases}
                                loading={isLoading}
                                onEdit={handleEdit}
                                onDelete={deletePurchase}
                            />
                        </div>

                        {purchases && purchases.total > filters.limit && (
                            <div className="mt-4 d-flex justify-content-center">
                                <Pagination
                                    currentPage={purchases.current_page}
                                    rowPerPage={filters.limit}
                                    totalPosts={purchases.total}
                                    onPageChange={handlePageChange}
                                    previousPage={() => handlePageChange(filters.page - 1)}
                                    nextPage={() => handlePageChange(filters.page + 1)}
                                />
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Container>

            <PurchaseFormModal 
                isOpen={isFormModalOpen}
                toggle={() => toggleFormModal()}
                editMode={editMode}
                initialData={selectedPurchase}
                references={references}
                onSubmit={onFormSubmit}
                loading={isSubmitting}
            />

            <style>{`
                .rounded-xl { border-radius: 1.5rem !important; }
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) !important; }
            `}</style>
        </>
    );
};

export default PurchaseManagement;

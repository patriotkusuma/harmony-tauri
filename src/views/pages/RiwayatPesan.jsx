import React, { useCallback } from "react";
import { Container, Card, CardHeader, CardBody, Row, Button } from "reactstrap";
import Header from "components/Headers/Header";
import Pagination from "components/Pagination/Pagination";
import OrderFilter from "components/organisms/OrderFilter";
import OrderTableView from "components/organisms/OrderTableView";
import OrderGridView from "components/organisms/OrderGridView";
import OrderDetailsModal from "components/organisms/OrderDetailsModal";
import { useOrder } from "hooks/useOrder";

export const RiwayatPesan = () => {
  const { 
    pesanan, 
    viewMode, 
    setViewMode, 
    filters, 
    setFilters,
    isFetching,
    refreshData
  } = useOrder();

  const pageChange = useCallback((page) => {
    setFilters({ page });
  }, [setFilters]);

  const previousPage = useCallback(() => {
    setFilters({ page: filters.page - 1 });
  }, [filters.page, setFilters]);

  const nextPage = useCallback(() => {
    setFilters({ page: filters.page + 1 });
  }, [filters.page, setFilters]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Refresh with F5
      if (e.key === 'F5') {
        e.preventDefault();
        refreshData();
      }
      
      // Focus Search with Ctrl + F
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshData]);

  return (
    <>
      {/* Slim header bar that matches AdminNavbar gradient */}
      <div className="header bg-gradient-info pb-6 pt-5 pt-md-6" />

      <Container className="mt--6" fluid>
        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white py-3 border-bottom">
            <Row className="align-items-center">
              <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h6 className="text-uppercase text-muted ls-1 mb-1 small">Harmony Laundry</h6>
                  <h2 className="mb-0 text-dark fw-bold">Riwayat Transaksi</h2>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    color="info"
                    size="sm"
                    onClick={refreshData}
                    disabled={isFetching}
                    className="px-3"
                  >
                    <i className={`fas fa-sync-alt ${isFetching ? 'fa-spin' : ''} me-1`} />
                    Refresh
                  </Button>
                  <div className="btn-group">
                    <Button
                      color={viewMode === "list" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      <i className="fas fa-list me-1" /> List
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      <i className="fas fa-th-large me-1" /> Grid
                    </Button>
                  </div>
                </div>
              </div>
            </Row>
          </CardHeader>

          <CardBody>
            <OrderFilter />
            {viewMode === "list" ? <OrderTableView /> : <OrderGridView />}
            {pesanan && (
              <Pagination
                currentPage={pesanan.current_page}
                rowPerPage={pesanan.per_page}
                totalPosts={pesanan.total}
                onPageChange={pageChange}
                previousPage={previousPage}
                nextPage={nextPage}
              />
            )}
          </CardBody>
        </Card>
      </Container>

      <OrderDetailsModal />
    </>
  );
};

import React from "react";
import { Row, Col, FormGroup } from "reactstrap";
import { useOrderStore } from "store/orderStore";

const OrderFilter = () => {
  const filters = useOrderStore((state) => state.filters);
  const setFilters = useOrderStore((state) => state.setFilters);
  const viewMode = useOrderStore((state) => state.viewMode);

  return (
    <div className="hl-filter-card">
      <Row className="align-items-end flex-wrap g-3">
        {/* Row Per Page */}
        <Col xs="6" sm="4" lg="1">
          <FormGroup className="mb-0">
            <label className="hl-filter-label">Show</label>
            <select
              value={filters.rowPerPage}
              onChange={(e) =>
                setFilters({
                  rowPerPage: Number(e.target.value),
                  page: 1,
                })
              }
              className="hl-input font-weight-bold"
            >
              {viewMode === "list" ? (
                <>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </>
              ) : (
                <>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </>
              )}
            </select>
          </FormGroup>
        </Col>

        {/* Status Filter */}
        <Col xs="6" sm="8" lg="2">
          <FormGroup className="mb-0">
            <label className="hl-filter-label">Status</label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({
                  status: e.target.value,
                  page: 1,
                })
              }
              className="hl-input font-weight-bold"
            >
              <option value="">Semua Status</option>
              <option value="cuci">🧺 Cuci</option>
              <option value="selesai">✅ Selesai</option>
              <option value="diambil">🚚 Diambil</option>
            </select>
          </FormGroup>
        </Col>

        {/* Date From */}
        <Col xs="6" sm="6" lg="2">
          <FormGroup className="mb-0">
            <label className="hl-filter-label">Dari Tanggal</label>
            <input
              type="date"
              className="hl-input"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                setFilters({
                  dateFrom: e.target.value,
                  page: 1,
                })
              }
            />
          </FormGroup>
        </Col>

        {/* Date To */}
        <Col xs="6" sm="6" lg="2">
          <FormGroup className="mb-0">
            <label className="hl-filter-label">Sampai Tanggal</label>
            <input
              type="date"
              className="hl-input"
              value={filters.dateTo || ""}
              onChange={(e) =>
                setFilters({
                  dateTo: e.target.value,
                  page: 1,
                })
              }
            />
          </FormGroup>
        </Col>

        {/* Search Input */}
        <Col xs="12" lg="5">
          <FormGroup className="mb-0">
            <label className="hl-filter-label">Cari Pesanan</label>
            <div className="position-relative">
              <i 
                className="fas fa-search position-absolute text-muted" 
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem" }} 
              />
              <input
                id="search-input"
                className="hl-input"
                style={{ paddingLeft: "36px" }}
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({
                    search: e.target.value,
                    page: 1,
                  })
                }
                placeholder="Cari kode pesanan / customer..."
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default OrderFilter;

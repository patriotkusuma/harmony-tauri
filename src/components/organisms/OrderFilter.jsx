import React from "react";
import { Row, Col, Input, InputGroup, FormGroup, Label } from "reactstrap";
import { useOrderStore } from "store/orderStore";

const OrderFilter = () => {
  const filters = useOrderStore((state) => state.filters);
  const setFilters = useOrderStore((state) => state.setFilters);
  const viewMode = useOrderStore((state) => state.viewMode);

  return (
    <div className="filter-wrapper mb-4 p-3 rounded-xl shadow-sm border bg-white">
      <Row className="align-items-end flex-wrap gx-3 gy-3">
        {/* Row Per Page */}
        <Col xs="6" lg="1">
          <FormGroup className="mb-0">
            <Label className="label-premium">Show</Label>
            <Input
              type="select"
              value={filters.rowPerPage}
              onChange={(e) =>
                setFilters({
                  rowPerPage: Number(e.target.value),
                  page: 1,
                })
              }
              className="dark-filter-input font-weight-bold"
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
            </Input>
          </FormGroup>
        </Col>

        {/* Status Filter */}
        <Col xs="6" lg="2">
          <FormGroup className="mb-0">
            <Label className="label-premium">Status</Label>
            <InputGroup className="input-group-alternative border">
              <div className="input-group-prepend px-2 d-flex align-items-center bg-transparent">
                <i className="fas fa-filter text-muted small" />
              </div>
              <Input
                type="select"
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({
                    status: e.target.value,
                    page: 1,
                  })
                }
                className="border-0 bg-transparent ps-0 font-weight-bold"
              >
                <option value="">Semua Status</option>
                <option value="cuci">🧺 Cuci</option>
                <option value="selesai">✅ Selesai</option>
                <option value="diambil">🚚 Diambil</option>
              </Input>
            </InputGroup>
          </FormGroup>
        </Col>

        {/* Date From */}
        <Col xs="6" lg="2">
          <FormGroup className="mb-0">
            <Label className="label-premium">Dari Tanggal</Label>
            <InputGroup className="input-group-alternative border">
              <div className="input-group-prepend px-2 d-flex align-items-center bg-transparent">
                <i className="far fa-calendar-alt text-muted small" />
              </div>
              <Input
                type="date"
                className="border-0 bg-transparent ps-0"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters({
                    dateFrom: e.target.value,
                    page: 1,
                  })
                }
              />
            </InputGroup>
          </FormGroup>
        </Col>

        {/* Date To */}
        <Col xs="6" lg="2">
          <FormGroup className="mb-0">
            <Label className="label-premium">Sampai Tanggal</Label>
            <InputGroup className="input-group-alternative border">
              <div className="input-group-prepend px-2 d-flex align-items-center bg-transparent">
                <i className="far fa-calendar-check text-muted small" />
              </div>
              <Input
                type="date"
                className="border-0 bg-transparent ps-0"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters({
                    dateTo: e.target.value,
                    page: 1,
                  })
                }
              />
            </InputGroup>
          </FormGroup>
        </Col>

        {/* Search */}
        <Col xs="12" lg="5" className="ms-lg-auto">
          <FormGroup className="mb-0">
            <Label className="label-premium">Cari Pesanan</Label>
            <InputGroup className="input-group-alternative border shadow-none bg-lighter rounded-pill overflow-hidden">
              <div className="input-group-prepend px-3 d-flex align-items-center bg-lighter">
                <i className="fas fa-search text-muted" />
              </div>
              <Input
                id="search-input"
                className="border-0 bg-lighter font-weight-bold"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    search: e.target.value,
                    page: 1,
                  })
                }
                placeholder="Kode pesanan atau nama customer..."
              />
              {filters.search && (
                <div 
                    className="input-group-append px-3 d-flex align-items-center bg-lighter cursor-pointer"
                    onClick={() => setFilters({ search: "", page: 1 })}
                >
                    <i className="fas fa-times-circle text-muted" />
                </div>
              )}
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>

      <style>{`
        .rounded-xl { border-radius: 1rem !important; }
        .label-premium {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: #8898aa;
            margin-bottom: 0.4rem;
            display: block;
            margin-left: 0.25rem;
        }
        .filter-wrapper {
            transition: all 0.3s ease;
            background: #fff;
        }
        .dark-filter-input {
            background-color: #f4f5f7 !important;
            border: 1px solid #d1d9e6 !important;
            border-radius: 0.5rem !important;
            height: 44px !important;
        }
        .bg-lighter {
            background-color: #f8f9fe !important;
        }
        .gx-3 { margin-right: -0.75rem; margin-left: -0.75rem; }
        .gx-3 > [class*="col-"] { padding-right: 0.75rem; padding-left: 0.75rem; }
      `}</style>
    </div>
  );
};

export default OrderFilter;

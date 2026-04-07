import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Input,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  UncontrolledTooltip
} from "reactstrap";
import Header from "components/Headers/Header.jsx";
import { useActivityLog } from "../../hooks/useActivityLog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ActivityLogs = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
    type: "",
    level: "",
    search: ""
  });

  const { logs, total, currentPage, isLoading, markAsRead } = useActivityLog(filters);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      default: return 'info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'inventory': return 'fas fa-boxes text-info';
      case 'purchase': return 'fas fa-shopping-cart text-danger';
      case 'finance': return 'fas fa-money-bill-wave text-success';
      case 'system': return 'fas fa-cogs text-primary';
      default: return 'fas fa-bell text-gray';
    }
  };

  const totalPages = Math.ceil(total / filters.limit);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow border-0 overflow-hidden">
              <CardHeader className="bg-white border-0 py-4">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0 font-weight-900 text-uppercase ls-1">
                      <i className="fas fa-stream text-primary me-2" />
                      Log Aktivitas Sistem
                    </h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => markAsRead()}
                      className="rounded-pill px-4 shadow-sm"
                    >
                      Tandai Semua Dibaca
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="pt-0">
                {/* Filters */}
                <Row className="mb-4 bg-white p-3 rounded-lg mx-0 shadow-sm border border-light">
                  <Col md="3">
                    <label className="text-xs font-weight-bold text-muted text-uppercase">Cari Aktivitas</label>
                    <Input
                      placeholder="Keyword..."
                      type="text"
                      className="form-control-alternative rounded-pill"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    />
                  </Col>
                  <Col md="3">
                    <label className="text-xs font-weight-bold text-muted text-uppercase">Tipe</label>
                    <Input
                      type="select"
                      className="form-control-alternative rounded-pill"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                    >
                      <option value="">Semua Tipe</option>
                      <option value="inventory">Inventaris</option>
                      <option value="purchase">Pembelian</option>
                      <option value="finance">Keuangan</option>
                      <option value="system">Sistem</option>
                    </Input>
                  </Col>
                  <Col md="3">
                    <label className="text-xs font-weight-bold text-muted text-uppercase">Level</label>
                    <Input
                      type="select"
                      className="form-control-alternative rounded-pill"
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value, page: 1 })}
                    >
                      <option value="">Semua Level</option>
                      <option value="info">Info</option>
                      <option value="success">Berhasil</option>
                      <option value="warning">Peringatan</option>
                      <option value="danger">Kritis</option>
                    </Input>
                  </Col>
                  <Col md="3" className="d-flex align-items-end">
                    <div className="text-muted text-xs ms-auto mb-2">
                        Total {total} Aktivitas
                    </div>
                  </Col>
                </Row>

                {/* Timeline / List */}
                <div className="activity-timeline">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted">Memuat aktivitas...</p>
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-lg shadow-sm">
                        <i className="fas fa-coffee fa-3x text-light mb-3" />
                        <h4 className="text-muted">Belum ada log aktivitas</h4>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush shadow-sm rounded-lg overflow-hidden border border-light">
                      {logs.map((log) => (
                        <div 
                          key={log.id} 
                          className={`list-group-item list-group-item-action border-bottom p-4 border-start-5 transition-all ${!log.is_read ? 'bg-soft-primary border-primary' : 'bg-white border-light'}`}
                        >
                          <Row className="align-items-start">
                            <Col xs="auto" className="pe-0">
                                <div className="icon-badge shadow-sm rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                    <i className={getTypeIcon(log.type)} />
                                </div>
                            </Col>
                            <Col className="ms-3">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h5 className={`mb-0 font-weight-800 ${!log.is_read ? 'text-primary' : 'text-dark'}`}>
                                    {log.action}
                                </h5>
                                <small className="text-muted font-weight-600">
                                  <i className="far fa-clock me-1" />
                                  {dayjs(log.created_at).fromNow()}
                                </small>
                              </div>
                              <p className="text-sm text-balance mb-2 text-dark opacity-8">
                                {log.message}
                              </p>
                              <div className="d-flex align-items-center gap-2 mt-2">
                                <Badge color={getLevelBadge(log.level)} pill className="ls-1 text-uppercase px-2 py-1 text-2xs">
                                  {log.level}
                                </Badge>
                                <span className="text-2xs text-muted font-weight-bold opacity-6">
                                    <i className="fas fa-tag me-1" />
                                    {log.type}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination className="pagination-separate pagination-primary">
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem active={i + 1 === currentPage} key={i}>
                          <PaginationLink onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                      </PaginationItem>
                    </Pagination>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .bg-soft-primary { background-color: rgba(94, 114, 228, 0.04) !important; }
        .font-weight-800 { font-weight: 800 !important; }
        .font-weight-900 { font-weight: 900 !important; }
        .ls-1 { letter-spacing: 0.5px !important; }
        .text-2xs { font-size: 0.65rem !important; }
        .border-start-5 { border-left: 5px solid transparent; }
        .transition-all { transition: all 0.3s ease; }
        .list-group-item:hover { transform: translateX(5px); }
        .icon-badge i { font-size: 1.2rem; }
        .pagination-primary .page-item.active .page-link { background-color: #5e72e4; border-color: #5e72e4; }
      `}</style>
    </>
  );
};

export default ActivityLogs;

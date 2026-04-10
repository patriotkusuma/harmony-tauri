import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, CardHeader, CardBody, Row, Col, Input, Button } from "reactstrap";
import { useKostStore, STATUS_CONFIG, STATUS_FLOW } from "../../store/kostStore";
import KostHeader from "../../components/organisms/kost/KostHeader";
import KostTable from "../../components/organisms/kost/KostTable";
import KostStatusModal from "../../components/organisms/kost/KostStatusModal";
import KostChatSidebar from "../../components/organisms/kost/KostChatSidebar";
import _ from "lodash"; // Assuming lodash is available, or use a simple debounce

const KostManagement = () => {
  const { kosts, meta, dataLoaded, fetchKosts } = useKostStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusModal, setStatusModal] = useState({ open: false, kost: null });
  const [chatSidebar, setChatSidebar] = useState({ open: false, kost: null });

  // Debounced search function
  const debouncedFetch = useCallback(
    _.debounce((q, s) => {
      fetchKosts(1, q, s);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch(searchTerm, filterStatus);
    // Cleanup debounce on unmount
    return () => debouncedFetch.cancel();
  }, [searchTerm, filterStatus, debouncedFetch]);

  const openStatusModal = (kost) => setStatusModal({ open: true, kost });
  const closeStatusModal = () => setStatusModal({ open: false, kost: null });

  const openChatSidebar = (kost) => setChatSidebar({ open: true, kost });
  const closeChatSidebar = () => setChatSidebar({ open: false, kost: null });

  const handlePageChange = (newPage) => {
    fetchKosts(newPage, searchTerm, filterStatus);
  };

  return (
    <>
      <KostHeader filterStatus={filterStatus} onFilterChange={setFilterStatus} />

      <Container className="mt--7" fluid>
        <Card className="shadow border-0 overflow-hidden" style={{ borderRadius: "16px" }}>
          {/* Toolbar */}
          <CardHeader className="border-0 bg-white" style={{ padding: "16px 24px" }}>
            <Row className="align-items-center">
              <Col md="4">
                <div style={{ position: "relative" }}>
                  <i
                    className="fas fa-search"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#adb5bd",
                    }}
                  />
                  <Input
                    placeholder="Cari nama / alamat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "36px", borderRadius: "50px", border: "1px solid #e2e8f0" }}
                  />
                </div>
              </Col>
              <Col md="4" className="mt-2 mt-md-0">
                <Input
                  type="select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ borderRadius: "50px", border: "1px solid #e2e8f0", cursor: "pointer" }}
                >
                  <option value="all">Semua Status</option>
                  {STATUS_FLOW.map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </Input>
              </Col>
              <Col md="4" className="text-right mt-2 mt-md-0">
                <span className="text-muted small">
                   Menampilkan {kosts.length} dari {meta.total} data
                </span>
                {dataLoaded && (
                  <Button
                    color="light"
                    size="sm"
                    className="ml-3"
                    onClick={() => fetchKosts(meta.page, searchTerm, filterStatus)}
                  >
                    <i className="fas fa-sync" />
                  </Button>
                )}
              </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0">
            <KostTable 
              filtered={kosts} 
              onOpenStatusModal={openStatusModal} 
              onOpenChat={openChatSidebar}
            />
          </CardBody>

          {/* Pagination */}
          {dataLoaded && meta.total > meta.limit && (
            <div
              className="px-4 py-3 border-top d-flex justify-content-between align-items-center"
              style={{ background: "#f8fafc" }}
            >
              <span className="text-muted small">Total: {meta.total} data</span>
              <div>
                <Button
                  color="light"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => handlePageChange(meta.page - 1)}
                  className="mr-2"
                >
                  <i className="fas fa-chevron-left" />
                </Button>
                <span className="text-muted small mx-2">Halaman {meta.page}</span>
                <Button
                  color="light"
                  size="sm"
                  disabled={meta.page * meta.limit >= meta.total}
                  onClick={() => handlePageChange(meta.page + 1)}
                >
                  <i className="fas fa-chevron-right" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Container>

      <KostStatusModal
        isOpen={statusModal.open}
        kost={statusModal.kost}
        onClose={closeStatusModal}
      />

      <KostChatSidebar
        isOpen={chatSidebar.open}
        kost={chatSidebar.kost}
        onClose={closeChatSidebar}
      />

      <style>{`
        .bg-gradient-kost {
          background: linear-gradient(87deg, #11998e 0, #38ef7d 100%) !important;
        }
        body.dark-mode .bg-gradient-kost {
          background: linear-gradient(87deg, #1e293b 0, #0f2027 100%) !important;
        }
        body.dark-mode .card { background: #1e293b !important; color: #f8fafc !important; }
        body.dark-mode thead { background: #0f172a !important; }
        body.dark-mode tbody tr:hover { background: rgba(255,255,255,0.04); }
        body.dark-mode .text-dark { color: #f0f4ff !important; }
        .kost-stat-pill:hover { transform: translateY(-2px); }
        .kost-th {
          padding: 12px 12px;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8898aa;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default KostManagement;

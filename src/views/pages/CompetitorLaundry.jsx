import React, { useState } from "react";
import { Container, Card, CardHeader, CardBody, Row, Col, Input, Button } from "reactstrap";
import { useCompetitorStore, COMPETITOR_STATUS_CONFIG, COMPETITOR_STATUS_FLOW } from "../../store/competitorStore";
import CompetitorHeader from "../../components/organisms/competitor/CompetitorHeader";
import CompetitorTable from "../../components/organisms/competitor/CompetitorTable";
import CompetitorStatusModal from "../../components/organisms/competitor/CompetitorStatusModal";

const CompetitorLaundry = () => {
  const { competitors, meta, dataLoaded, fetchCompetitors } = useCompetitorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusModal, setStatusModal] = useState({ open: false, competitor: null });

  const filtered = competitors.filter((c) => {
    const matchSearch =
      !searchTerm ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openStatusModal = (c) => setStatusModal({ open: true, competitor: c });
  const closeStatusModal = () => setStatusModal({ open: false, competitor: null });

  return (
    <>
      <CompetitorHeader filterStatus={filterStatus} onFilterChange={setFilterStatus} />

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
                    placeholder="Cari nama / alamat kompetitor..."
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
                  {COMPETITOR_STATUS_FLOW.map((s) => (
                    <option key={s} value={s}>
                      {COMPETITOR_STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md="4" className="text-right mt-2 mt-md-0">
                <span className="text-muted small">
                  {filtered.length} dari {competitors.length} data
                </span>
                {dataLoaded && (
                  <Button
                    color="light"
                    size="sm"
                    className="ml-3"
                    onClick={() => fetchCompetitors(meta.page)}
                  >
                    <i className="fas fa-sync" />
                  </Button>
                )}
              </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0">
            <CompetitorTable filtered={filtered} onOpenStatusModal={openStatusModal} />
          </CardBody>

          {/* Pagination */}
          {dataLoaded && meta.total > meta.limit && (
            <div
              className="px-4 py-3 border-top d-flex justify-content-between align-items-center"
              style={{ background: "#f8fafc" }}
            >
              <span className="text-muted small">Total: {meta.total} kompetitor</span>
              <div>
                <Button
                  color="light"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => fetchCompetitors(meta.page - 1)}
                  className="mr-2"
                >
                  <i className="fas fa-chevron-left" />
                </Button>
                <span className="text-muted small mx-2">Halaman {meta.page}</span>
                <Button
                  color="light"
                  size="sm"
                  disabled={meta.page * meta.limit >= meta.total}
                  onClick={() => fetchCompetitors(meta.page + 1)}
                >
                  <i className="fas fa-chevron-right" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Container>

      <CompetitorStatusModal
        isOpen={statusModal.open}
        competitor={statusModal.competitor}
        onClose={closeStatusModal}
      />

      <style>{`
        .bg-gradient-competitor {
          background: linear-gradient(87deg, #e05c5c 0%, #f7971e 100%) !important;
        }
        body.dark-mode .bg-gradient-competitor {
          background: linear-gradient(87deg, #1e293b 0%, #3b1010 100%) !important;
        }
        body.dark-mode .card { background: #1e293b !important; color: #f8fafc !important; }
        body.dark-mode thead { background: #0f172a !important; }
        body.dark-mode tbody tr:hover { background: rgba(255,255,255,0.04); }
        body.dark-mode .text-dark { color: #f0f4ff !important; }
        .competitor-stat-pill:hover { transform: translateY(-2px); }
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

export default CompetitorLaundry;

import React from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { useCompetitorStore, COMPETITOR_STATUS_CONFIG, COMPETITOR_STATUS_FLOW } from "../../../store/competitorStore";

const CompetitorHeader = ({ filterStatus, onFilterChange }) => {
  const { competitors, loading, importLoading, dataLoaded, fetchCompetitors, importFromCSV } =
    useCompetitorStore();

  const stats = COMPETITOR_STATUS_FLOW.reduce((acc, s) => {
    acc[s] = competitors.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await importFromCSV(file);
    e.target.value = "";
  };

  return (
    <div className="header bg-gradient-competitor pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center mt--6 mb-4">
            <Col lg="8" md="10">
              <h2
                className="text-white font-weight-900 mb-1"
                style={{ letterSpacing: "-0.02em", fontSize: "2rem" }}
              >
                <i className="fas fa-store-alt mr-3" />
                Kompetitor Laundry
              </h2>
              <p className="text-white opacity-8 lead mb-0" style={{ fontSize: "1rem" }}>
                Pantau dan analisa laundry kompetitor di sekitar area bisnis Anda.
              </p>
            </Col>
            <Col lg="4" md="2" className="text-right mt-3 mt-md-0">
              <label
                htmlFor="competitor-csv-import"
                className="btn btn-white btn-sm shadow font-weight-bold"
                style={{
                  cursor: importLoading ? "not-allowed" : "pointer",
                  borderRadius: "50px",
                  padding: "10px 24px",
                  opacity: importLoading ? 0.7 : 1,
                }}
              >
                {importLoading ? (
                  <><Spinner size="sm" className="mr-2" />Mengimpor...</>
                ) : (
                  <><i className="fas fa-file-csv mr-2 text-success" />Import CSV</>
                )}
              </label>
              <input
                id="competitor-csv-import"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={importLoading}
              />
              {!dataLoaded && (
                <Button
                  color="info"
                  size="sm"
                  className="ml-2 font-weight-bold shadow"
                  style={{ borderRadius: "50px", padding: "10px 20px" }}
                  onClick={() => fetchCompetitors(1)}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : <><i className="fas fa-sync mr-2" />Muat Data</>}
                </Button>
              )}
            </Col>
          </Row>

          {/* Stat Pills */}
          <Row className="mt-2">
            {COMPETITOR_STATUS_FLOW.map((s) => {
              const cfg = COMPETITOR_STATUS_CONFIG[s];
              const isActive = filterStatus === s;
              return (
                <Col key={s} xs="6" sm="4" md="2" className="mb-3">
                  <div
                    className="competitor-stat-pill"
                    onClick={() => onFilterChange(isActive ? "all" : s)}
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      border: isActive
                        ? "2px solid rgba(255,255,255,0.6)"
                        : "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div className="text-white-50 small mb-1">
                      <i className={`${cfg.icon} mr-1`} />
                      {cfg.label}
                    </div>
                    <div className="text-white font-weight-bold" style={{ fontSize: "1.4rem" }}>
                      {stats[s] || 0}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default CompetitorHeader;

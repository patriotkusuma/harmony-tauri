import React, { useState, useEffect } from "react";
import { Container, Card } from "reactstrap";
import Header from "components/Headers/Header";
import { webhookService } from "../../services/api/webhook";
import { toast } from "react-toastify";
import WebhookFilter from "../../components/molecules/webhook/WebhookFilter";
import WebhookList from "../../components/organisms/webhook/WebhookList";
import WebhookModal from "../../components/organisms/webhook/WebhookModal";

const WebhookLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Custom Filters
  const [filters, setFilters] = useState({
    status: "",
    event: "",
    device_id: "",
    page: 1,
    limit: 50
  });

  // Modal Detailed Variables
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const payload = { ...filters };
      Object.keys(payload).forEach(key => !payload[key] && delete payload[key]);
      
      const res = await webhookService.getLogs(payload);
      setLogs(res.data || []);
    } catch (error) {
      toast.error("Gagal mendapatkan webhook logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [filters.page, filters.status]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const viewDetail = (log) => {
    setSelectedLog(log);
    toggleModal();
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Card className="shadow-premium border-0 mb-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom-custom flex-wrap" style={{ gap: '15px' }}>
            <div>
              <h3 className="mb-0 text-dark font-weight-900 title-adaptive">Log API Webhook</h3>
              <p className="text-muted mb-0 small opacity-8">
                Monitoring *incoming request* dari WhatsApp / Pihak Ketiga secara real-time.
              </p>
            </div>
            
            <WebhookFilter 
              filters={filters} 
              setFilters={setFilters} 
              onSearch={fetchLogs} 
            />
          </div>

          <WebhookList 
             logs={logs} 
             loading={loading} 
             onViewDetail={viewDetail} 
          />
        </Card>

        <WebhookModal 
          isOpen={modalOpen} 
          toggle={toggleModal} 
          log={selectedLog} 
        />

        <style>{`
          .title-adaptive { color: #172b4d; }
          body.dark-mode .title-adaptive { color: #f8fafc !important; }
          .custom-wrapper { background-color: #ffffff; border: 1px solid #f1f3f9; }
          body.dark-mode .custom-wrapper { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.05); }
          .custom-op-table { border-collapse: separate; border-spacing: 0; }
          .op-row { transition: all 0.2s ease; }
          .op-row:hover { background-color: #fcfdfe !important; }
          body.dark-mode .op-row:hover { background-color: rgba(255,255,255,0.02) !important; }
          .border-bottom-custom { border-bottom: 1px solid #f1f3f9; vertical-align: middle; }
          body.dark-mode .border-bottom-custom { border-bottom: 1px solid rgba(255,255,255,0.05); }
          .table-header-row { background: #f8f9fe; }
          body.dark-mode .table-header-row { background: #0f172a; }
          .table-header-cell {
            padding: 1rem 1.5rem; font-size: 0.70rem; font-weight: 800; text-transform: uppercase;
            letter-spacing: 1px; color: #8898aa; background-color: transparent; border-bottom: 2px solid #e9ecef; border-top: none;
          }
          body.dark-mode .table-header-cell { border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; }
          .custom-input { border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 600; padding: 0.75rem 1rem; color: #172b4d; }
          body.dark-mode .custom-input { background-color: #0f172a !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #f8fafc !important;}
          /* Fix Modal Headers in Darkmode */
          body.dark-mode .dark-modal-ready .modal-content { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          body.dark-mode .dark-modal-ready .modal-header { border-bottom: 1px solid rgba(255,255,255,0.05); }
        `}</style>
      </Container>
    </>
  );
};

export default WebhookLogs;

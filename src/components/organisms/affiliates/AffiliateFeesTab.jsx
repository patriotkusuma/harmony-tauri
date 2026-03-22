import React, { useState, useEffect } from "react";
import { Row } from "reactstrap";
import axios from "../../../services/axios-instance";
import { toast } from "react-toastify";

import AffiliateFeeForm from "./AffiliateFeeForm";
import AffiliateFeeTable from "./AffiliateFeeTable";

const AffiliateFeesTab = () => {
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("manager"); // manager | customer
  const [editFee, setEditFee] = useState(null);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      // Parallel fetch using Promise.all
      const [feesRes, servicesRes] = await Promise.all([
        axios.get(`api/v2/affiliates/fees?type=${filterType}`).catch(() => ({ data: { data: [] } })),
        axios.get("api/jenis-cuci").catch(() => ({ data: { data: [] } }))
      ]);
      
      setData(feesRes.data?.data || []);
      // The API wraps the collection in a "data" property: {"data": [...]}
      setServices(servicesRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat aturan fee skema");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const getServiceName = (id) => {
    const s = services.find(srv => srv.id === parseInt(id));
    return s ? s.nama : `Layanan #${id}`;
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm("Hapus aturan fee komisi ini?")) return;
    try {
      await axios.delete(`api/v2/affiliates/fees/${id}`);
      toast.success("Aturan berhasil dihapus!");
      fetchDependencies();
      if (editFee && editFee.ID === id) setEditFee(null);
    } catch(e) {
      toast.error("Gagal menghapus aturan");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="mb-1 text-dark font-weight-900 title-adaptive">Skema Komisi Afiliasi</h3>
        <p className="text-muted mb-0 small opacity-8">Atur besaran fee (Rp / %) yang diberikan ke partner per transaksi selesai.</p>
      </div>

      <Row>
        {/* FORM KONFIGURASI FEE */}
        <AffiliateFeeForm services={services} onSuccess={fetchDependencies} editFee={editFee} setEditFee={setEditFee} />

        {/* TABEL DAFTAR FEE */}
        <AffiliateFeeTable 
            data={data} 
            loading={loading} 
            filterType={filterType} 
            setFilterType={setFilterType} 
            getServiceName={getServiceName} 
            onEditFee={setEditFee}
            onDeleteFee={handleDeleteFee}
        />
      </Row>

      <style>{`
        /* Reuse Premium Style Tags (They override elements gracefully in Darkmode & Lightmode) */
        .title-adaptive { color: #172b4d; }
        body.dark-mode .title-adaptive { color: #f8fafc !important; }

        .custom-wrapper { background-color: #ffffff; border: 1px solid #f1f3f9; }
        body.dark-mode .custom-wrapper { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.05); }

        .bg-input-box { background-color: #fcfdfe; }
        body.dark-mode .bg-input-box { background-color: #0f172a; }

        .custom-op-table { border-collapse: separate; border-spacing: 0; }
        .op-row { transition: all 0.2s ease-in-out; }
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

        .custom-input { border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 600; padding: 0.75rem 1rem; color: #172b4d; transition: all 0.2s ease; }
        .custom-input:focus { box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.2); border-color: #5e72e4; }
        body.dark-mode .custom-input { background-color: #0f172a !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #f8fafc !important;}
        body.dark-mode .custom-input:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2) !important; }
        
        body.dark-mode .text-success { color: #4ade80 !important; }
      `}</style>
    </div>
  );
};

export default AffiliateFeesTab;

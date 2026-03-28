import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Badge, Input } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import affiliateService from "../../../services/api/affiliate";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

const AffiliateCommissionsTab = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);

  // Fetch Affiliates Dropdown
  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const res = await affiliateService.getAffiliates();
        const list = res.data?.data || [];
        setAffiliates(list);
        if (list.length > 0) setSelectedAffiliate(list[0].id.toString());
      } catch (err) {
        toast.error("Gagal mengambil data dropdown affiliate");
      }
    };
    fetchAffiliates();
  }, []);

  // Fetch Commission for selected affiliate
  const fetchCommissions = async () => {
    if (!selectedAffiliate) return;
    setLoading(true);
    try {
      const res = await affiliateService.getCommissions(selectedAffiliate, selectedStatus);
      setCommissions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menarik data komisi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAffiliate, selectedStatus]);

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      if (action === 'confirm') {
        await affiliateService.confirmCommission(id);
        toast.success("Komisi berhasil diverifikasi!");
      } else if (action === 'pay') {
        await affiliateService.payCommission(id);
        toast.success("Komisi dicairkan! Saldo partner bertambah/terbayar.");
      }
      fetchCommissions();
    } catch (err) {
      toast.error(err.response?.data?.details || `Gagal memproses ${action}`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge color="warning" pill>Menunggu</Badge>;
      case 'verified': return <Badge color="info" pill>Terverifikasi</Badge>;
      case 'paid': return <Badge color="success" pill>Terbayar Lunas</Badge>;
      case 'canceled': return <Badge color="danger" pill>Dibatalkan</Badge>;
      default: return <Badge color="secondary" pill>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom-custom flex-wrap" style={{gap: '15px'}}>
        <div>
          <h3 className="mb-0 text-dark font-weight-900 title-adaptive">Log Payout Komisi</h3>
          <p className="text-muted mb-0 small opacity-8">Transparansi status fee partner, pencairan uang tunai, atau transfer deposit.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
            <span className="text-muted fw-bold small d-none d-md-block">Filter:</span>
            <Input type="select" className="w-auto custom-input py-2 text-sm bg-input-box title-adaptive cursor-pointer shadow-sm rounded-pill" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="verified">Terverifikasi</option>
                <option value="paid">Terbayar</option>
                <option value="canceled">Dibatalkan</option>
            </Input>
            <Input type="select" className="w-auto custom-input py-2 text-sm bg-input-box title-adaptive cursor-pointer shadow-sm rounded-pill" value={selectedAffiliate} onChange={(e) => setSelectedAffiliate(e.target.value)}>
                <option value="">-- Partner --</option>
                {affiliates.map(af => (
                    <option key={af.id} value={af.id}>{af.name}</option>
                ))}
            </Input>
        </div>
      </div>

      <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
        <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr className="table-header-row">
              <td className="table-header-cell">Waktu Record</td>
              <td className="table-header-cell">ID Nota Jual</td>
              <td className="table-header-cell text-center">Beban Qty</td>
              <td className="table-header-cell">Komisi Masuk / Fee</td>
              <td className="table-header-cell text-center">Status</td>
              <td className="table-header-cell text-center">Aksi Payout</td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-5"><Spinner color="primary" /></td></tr>
            ) : (!commissions || commissions.length === 0) ? (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="fas fa-file-invoice-dollar fa-3x text-light mb-3 empty-icon"></i>
                  <h4 className="text-muted font-weight-bold mb-0">Riwayat Komisi Masih Kosong.</h4>
                  <small className="text-muted">Ketika customer menggunakan afiliasi ini, rekapan akan muncul di sini.</small>
                </td>
              </tr>
            ) : (
              commissions.map((item, idx) => (
                <tr key={idx} className="op-row">
                  <td className="px-4 py-3 border-bottom-custom text-dark font-weight-700 title-adaptive">
                    {moment(item.CreatedAt).format("DD MMM YYYY")}
                    <span className="d-block text-muted small">{moment(item.CreatedAt).format("HH:mm")}</span>
                  </td>
                  <td className="px-4 border-bottom-custom text-primary font-weight-bold tracking-widest">
                    #{item.IdPesanan}
                    <span className="d-block text-muted opacity-8 small fw-normal">Cust #{item.IdCustomer}</span>
                  </td>
                  <td className="px-4 text-center border-bottom-custom">
                      <div className="bg-input-box border-input rounded d-inline-block px-2 py-1">
                          <span className="font-weight-900 title-adaptive">{item.Qty}</span>
                      </div>
                  </td>
                  <td className="px-4 border-bottom-custom">
                    <span className="font-weight-900 text-success d-block">{formatRupiah(item.CalculatedFee)}</span>
                    <small className="text-muted fw-bold">Penjualan: {formatRupiah(item.BasePrice)}</small>
                  </td>
                  <td className="text-center px-4 border-bottom-custom">
                    {getStatusBadge(item.StatusPembayaran)}
                  </td>
                  <td className="text-center px-4 border-bottom-custom">
                    <div className="d-flex justify-content-center gap-1">
                      {item.StatusPembayaran === 'pending' && (
                        <Button color="info" size="sm" className="rounded-pill shadow-sm" disabled={processing === item.ID} onClick={() => handleAction(item.ID, 'confirm')}>
                           {processing === item.ID ? <i className="fas fa-spinner fa-spin"/> : <i className="fas fa-check"/>} Verifikasi
                        </Button>
                      )}
                      {item.StatusPembayaran === 'verified' && (
                        <Button color="success" size="sm" className="rounded-pill shadow-sm" disabled={processing === item.ID} onClick={() => handleAction(item.ID, 'pay')}>
                           {processing === item.ID ? <i className="fas fa-spinner fa-spin"/> : <i className="fas fa-wallet"/>} Byr Cairkan
                        </Button>
                      )}
                      {(item.StatusPembayaran === 'paid' || item.StatusPembayaran === 'canceled') && (
                        <span className="text-muted font-weight-600 opacity-8 small"><i className="fas fa-lock me-1"></i>Selesai</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <style>{`
        /* Reuse Premium Style Tags */
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
        body.dark-mode .custom-input { background-color: #0f172a !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #f8fafc !important;}

        body.dark-mode .text-success { color: #4ade80 !important; }
      `}</style>
    </div>
  );
};

export default AffiliateCommissionsTab;

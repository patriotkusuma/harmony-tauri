import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import affiliateService from "../../../services/api/affiliate";

const AffiliateListTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [custModalOpen, setCustModalOpen] = useState(false);
  const [trxModalOpen, setTrxModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeAffiliate, setActiveAffiliate] = useState(null);
  const [linkedCustomers, setLinkedCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [searchCust, setSearchCust] = useState("");
  const [allCustomers, setAllCustomers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "manager",
    group_name: "",
    no_wa: "",
    status: "active",
    level: "bronze"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await affiliateService.getAffiliates();
      setData(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data Affiliate");
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedCustomers = async (affiliateId) => {
    try {
      const res = await affiliateService.getLinkedCustomers(affiliateId);
      setLinkedCustomers(res.data?.data || []);
    } catch (err) {
      toast.error("Gagal memuat data pelanggan tertaut");
    }
  };

  const fetchTransactions = async (affiliateId) => {
    try {
      const res = await affiliateService.getTransactions(affiliateId);
      const data = res.data?.data || {};
      setTransactions(data.transactions || []);
      setTotalCommission(data.total_commission || 0);
    } catch (err) {
      toast.error("Gagal memuat riwayat transaksi");
    }
  };

  const fetchAllCustomers = async (search = "") => {
    try {
      const res = await affiliateService.searchCustomers(search); 
      setAllCustomers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleCustModal = () => setCustModalOpen(!custModalOpen);
  const toggleTrxModal = () => setTrxModalOpen(!trxModalOpen);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      group_name: item.group_name || "",
      no_wa: item.no_wa || "",
      status: item.status,
      level: item.level
    });
    setModalOpen(true);
  };

  const handleManageCustomers = (item) => {
    setActiveAffiliate(item);
    fetchLinkedCustomers(item.id);
    fetchAllCustomers();
    setCustModalOpen(true);
  };

  const handleViewTransactions = (item) => {
    setActiveAffiliate(item);
    fetchTransactions(item.id);
    setTrxModalOpen(true);
  };

  const handleLinkCustomer = async (customerId) => {
    try {
      await affiliateService.linkCustomers(activeAffiliate.id, [customerId]);
      toast.success("Pelanggan berhasil ditautkan!");
      fetchLinkedCustomers(activeAffiliate.id);
    } catch (err) {
      toast.error("Gagal menautkan pelanggan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus partner afiliasi ini?")) return;
    try {
      await affiliateService.deleteAffiliate(id);
      toast.success("Partner berhasil dihapus");
      fetchData();
    } catch (err) {
      toast.error("Gagal menghapus partner");
    }
  };

  const handleSave = async () => {
    if (!formData.name) return toast.warning("Nama partner wajib diisi");
    setSaving(true);
    try {
      if (editId) {
        await affiliateService.updateAffiliate(editId, formData);
        toast.success("Data partner berhasil diperbarui!");
      } else {
        await affiliateService.createAffiliate(formData);
        toast.success("Partner Afiliasi berhasil ditambahkan!");
      }
      toggleModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.details || "Gagal menyimpan partner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3 shadow-sm" role="status" style={{ width: '3rem', height: '3rem' }}></div>
      <h4 className="mt-3 text-muted font-weight-bold">Memuat Data Kemitraan...</h4>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom-custom">
        <div>
          <h3 className="mb-0 text-dark font-weight-900 title-adaptive">Direktori Partner</h3>
          <p className="text-muted mb-0 small opacity-8">Manajemen data pengurus kos dan customer yang menjadi agen.</p>
        </div>
        <Button color="primary" className="rounded-pill shadow-sm px-4 ls-1 font-weight-bold" onClick={() => {
            setEditId(null);
            setFormData({ name: "", type: "manager", group_name: "", no_wa: "", status: "active", level: "bronze" });
            setModalOpen(true);
        }}>
          <i className="fas fa-plus me-2" /> Tambah Partner
        </Button>
      </div>

      <div className="table-responsive rounded-lg overflow-hidden custom-wrapper shadow-sm border-0">
        <Table className="align-middle mb-0 custom-op-table" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr className="table-header-row">
              <td className="table-header-cell">Nama Partner</td>
              <td className="table-header-cell">Organisasi / Kos</td>
              <td className="table-header-cell text-center">Tipe / Level</td>
              <td className="table-header-cell">No. WA</td>
              <td className="table-header-cell text-center">Status</td>
              <td className="table-header-cell text-center">Aksi</td>
            </tr>
          </thead>
          <tbody>
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="fas fa-hands-helping fa-3x text-light mb-3 empty-icon"></i>
                  <h4 className="text-muted font-weight-bold mb-0">Belum Ada Partner Afiliasi</h4>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="op-row">
                  <td className="px-4 py-3 border-bottom-custom">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm rounded-circle d-flex align-items-center justify-content-center me-3 icon-avatar text-primary font-weight-bold">
                        {item.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <span className="font-weight-900 item-title d-block text-dark title-adaptive">{item.name}</span>
                        <small className="text-muted">ID: #{item.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 border-bottom-custom text-dark font-weight-700 title-adaptive opacity-9">
                    {item.group_name || <span className="opacity-5">-</span>}
                  </td>
                  <td className="px-4 text-center border-bottom-custom">
                    <Badge color={item.type === 'manager' ? 'info' : 'secondary'} className="rounded-pill me-2">
                        {item.type === 'manager' ? 'Pengurus' : 'Customer'}
                    </Badge>
                    <Badge className={`rounded-pill bg-${item.level === 'gold' ? 'warning' : item.level === 'silver' ? 'default' : 'danger'}`}>
                        {item.level.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 border-bottom-custom">
                    <span className="font-weight-600 item-title text-success"><i className="fab fa-whatsapp me-2"></i>{item.no_wa || '-'}</span>
                  </td>
                  <td className="text-center border-bottom-custom">
                    <div className={ `d-inline-flex align-items-center rounded-pill font-weight-bold px-3 py-1 ${item.status === 'active' ? 'badge-soft-success' : 'badge-soft-danger'}` } style={{ fontSize: '0.75rem' }}>
                      <div className="dot-indicator rounded-circle me-2"></div>
                      {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </div>
                  </td>
                  <td className="text-center border-bottom-custom px-4">
                    <Button color="link" title="Riwayat Transaksi" className="text-warning btn-sm p-0 me-3" onClick={() => handleViewTransactions(item)}>
                       <i className="fas fa-history"></i>
                    </Button>
                    <Button color="link" title="Kelola Pelanggan" className="text-info btn-sm p-0 me-3" onClick={() => handleManageCustomers(item)}>
                       <i className="fas fa-users-cog"></i>
                    </Button>
                    <Button color="link" title="Edit Data" className="text-primary btn-sm p-0 me-3" onClick={() => handleEdit(item)}>
                       <i className="fas fa-edit"></i>
                    </Button>
                    <Button color="link" title="Hapus" className="text-danger btn-sm p-0" onClick={() => handleDelete(item.id)}>
                       <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* MODAL RIWAYAT TRANSAKSI */}
      <Modal isOpen={trxModalOpen} toggle={toggleTrxModal} size="lg" className="modal-dialog-centered dark-modal-ready">
        <ModalHeader toggle={toggleTrxModal} className="border-bottom-custom">
          <span className="font-weight-900 text-dark title-adaptive">
            <i className="fas fa-history me-2 text-warning" />
            Riwayat Transaksi: {activeAffiliate?.name}
          </span>
        </ModalHeader>
        <ModalBody className="bg-white custom-wrapper">
            <div className="table-responsive">
                <Table size="sm" className="align-middle border-0">
                    <thead className="table-header-row" style={{ fontSize: '0.65rem' }}>
                        <tr>
                            <th className="py-2">KODE PESAN</th>
                            <th className="py-2">PELANGGAN</th>
                            <th className="py-2 text-end">TOTAL HARGA</th>
                            <th className="py-2 text-end">KOMISI</th>
                            <th className="py-2 text-center">TANGGAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            <>
                                {transactions.map((t, idx) => (
                                    <tr key={idx} className="border-bottom-custom text-sm">
                                        <td className="font-weight-bold">{t.kode_pesan}</td>
                                        <td>{t.customer_nama}</td>
                                        <td className="text-end">Rp {t.total_harga?.toLocaleString()}</td>
                                        <td className="text-end text-success font-weight-bold">Rp {t.commission?.toLocaleString()}</td>
                                        <td className="text-center small text-muted">{new Date(t.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-light-soft">
                                    <td colSpan="3" className="text-end py-3 font-weight-bold">TOTAL PENDAPATAN KOMISI</td>
                                    <td className="text-end py-3 font-weight-900 text-primary h5 mb-0">Rp {totalCommission?.toLocaleString()}</td>
                                    <td></td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">Belum ada riwayat transaksi</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </ModalBody>
        <ModalFooter className="bg-white border-top-0">
          <Button color="secondary" onClick={toggleTrxModal} className="rounded-pill font-weight-bold px-4">Tutup</Button>
        </ModalFooter>
      </Modal>

      {/* MODAL TAMBAH */}
      <Modal isOpen={modalOpen} toggle={toggleModal} className="modal-dialog-centered dark-modal-ready">
        <ModalHeader toggle={toggleModal} className="border-bottom-custom pb-3">
          <span className="font-weight-900 text-dark title-adaptive"><i className="fas fa-handshake me-2 text-primary" />Registrasi Partner Baru</span>
        </ModalHeader>
        <ModalBody className="bg-white custom-wrapper">
          <Row>
            <Col md="12">
              <FormGroup>
                <Label className="font-weight-bold title-adaptive opacity-8">Nama Lengkap</Label>
                <Input type="text" name="name" className="custom-input bg-input-box" placeholder="Contoh: Budi Santoso" value={formData.name} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="font-weight-bold title-adaptive opacity-8">Tipe Partner</Label>
                <Input type="select" name="type" className="custom-input bg-input-box" value={formData.type} onChange={handleChange}>
                  <option value="manager">Pengurus Kos/Gedung</option>
                  <option value="customer">Customer Umum</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="font-weight-bold title-adaptive opacity-8">Level Skema</Label>
                <Input type="select" name="level" className="custom-input bg-input-box" value={formData.level} onChange={handleChange}>
                  <option value="bronze">Bronze (Standar)</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold (VIP)</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label className="font-weight-bold title-adaptive opacity-8">Nama Kos / Organisasi</Label>
                <Input type="text" name="group_name" className="custom-input bg-input-box" placeholder="Contoh: Kos Putra Biru" value={formData.group_name} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label className="font-weight-bold title-adaptive opacity-8">No WhatsApp</Label>
                <Input type="number" name="no_wa" className="custom-input bg-input-box" placeholder="Contoh: 08123456" value={formData.no_wa} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="border-top-0 custom-wrapper pt-0 bg-white">
          <Button color="secondary" onClick={toggleModal} className="rounded-pill font-weight-bold px-4" disabled={saving}>Batal</Button>
          <Button color="primary" onClick={handleSave} className="rounded-pill font-weight-bold px-4 shadow-sm" disabled={saving}>
            {saving ? <i className="fas fa-spinner fa-spin me-2" /> : <i className="fas fa-save me-2" />} Simpan Partner
          </Button>
        </ModalFooter>
      </Modal>

      {/* MODAL KELOLA PELANGGAN (LINKING) */}
      <Modal isOpen={custModalOpen} toggle={toggleCustModal} size="lg" className="modal-dialog-centered dark-modal-ready">
        <ModalHeader toggle={toggleCustModal} className="border-bottom-custom">
          <span className="font-weight-900 text-dark title-adaptive">
            <i className="fas fa-users-cog me-2 text-info" />
            Kelola Pelanggan: {activeAffiliate?.name}
          </span>
        </ModalHeader>
        <ModalBody className="bg-white custom-wrapper">
          <Row>
            <Col md="6" className="border-end-custom">
              <h5 className="font-weight-bold mb-3 title-adaptive">Tautkan Pelanggan Baru</h5>
              <FormGroup>
                <div className="search-box mb-2">
                  <Input 
                    type="text" 
                    placeholder="Cari Nama/ID Pelanggan..." 
                    value={searchCust} 
                    onChange={(e) => {
                      setSearchCust(e.target.value);
                      fetchAllCustomers(e.target.value);
                    }}
                    className="custom-input bg-input-box"
                  />
                </div>
                <div className="list-group list-group-flush rounded border-0 overflow-auto" style={{ maxHeight: '300px' }}>
                  {allCustomers.filter(c => !linkedCustomers.some(lc => lc.id === c.id)).map(c => (
                    <div key={c.id} className="list-group-item d-flex justify-content-between align-items-center px-1 py-2 bg-transparent border-bottom-custom">
                      <div className="text-sm">
                        <div className="font-weight-bold title-adaptive">
                          {c.nama} {c.keterangan ? <span className="text-muted fw-normal">({c.keterangan})</span> : ''}
                        </div>
                        <div className="d-block text-muted small mt-1">
                          <i className="fas fa-phone-alt me-1" /> {c.telpon || '-'}
                        </div>
                      </div>
                      <Button color="info" size="sm" className="rounded-pill p-1 px-2" onClick={() => handleLinkCustomer(c.id)}>
                        <i className="fas fa-link me-1" /> Tautkan
                      </Button>
                    </div>
                  ))}
                  {allCustomers.length === 0 && <div className="text-muted small text-center py-4">Ketik untuk mencari pelanggan...</div>}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <h5 className="font-weight-bold mb-3 title-adaptive">Pelanggan Terdaftar ({linkedCustomers.length})</h5>
              <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                {linkedCustomers.length > 0 ? (
                  <Table size="sm" borderless className="align-middle border-0">
                    <tbody>
                      {linkedCustomers.map(lc => (
                        <tr key={lc.id} className="border-bottom-custom">
                          <td className="ps-0 py-2">
                            <div className="font-weight-bold text-sm title-adaptive">
                                {lc.nama} {lc.keterangan ? <span className="text-muted fw-normal small">({lc.keterangan})</span> : ''}
                            </div>
                            <small className="text-muted d-block opacity-8 mt-1">
                                <i className="fas fa-map-marker-alt me-1" /> {lc.alamat || 'Tanpa Alamat'}
                            </small>
                          </td>
                          <td className="text-end pe-0">
                            <Badge color="success" pill className="px-2">Aktif</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5 opacity-5">
                    <i className="fas fa-user-slash fa-2x mb-3 d-block" />
                    <span className="small font-weight-bold">Belum ada pelanggan terhubung</span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="bg-white border-top-0">
          <Button color="secondary" onClick={toggleCustModal} className="rounded-pill font-weight-bold px-4">Tutup</Button>
        </ModalFooter>
      </Modal>

      <style>{`
        /* Table Internal Overrides - Premium Look */
        .title-adaptive { color: #172b4d; }
        body.dark-mode .title-adaptive { color: #f8fafc !important; }

        .custom-wrapper { background-color: #ffffff; border: 1px solid #f1f3f9; }
        body.dark-mode .custom-wrapper { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.05); }

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

        .icon-avatar { width: 40px; height: 40px; background-color: rgba(94, 114, 228, 0.1); }
        body.dark-mode .icon-avatar { background-color: rgba(129, 140, 248, 0.15); color: #818cf8 !important; }

        /* Status Pills */
        .dot-indicator { width: 6px; height: 6px; }
        .badge-soft-success { background-color: rgba(45, 206, 137, 0.1); color: #2dce89; box-shadow: 0 0 0 1px rgba(45, 206, 137, 0.1) inset; }
        .badge-soft-success .dot-indicator { background-color: #2dce89; }
        .badge-soft-danger { background-color: rgba(245, 54, 92, 0.1); color: #f5365c; box-shadow: 0 0 0 1px rgba(245, 54, 92, 0.1) inset; }
        .badge-soft-danger .dot-indicator { background-color: #f5365c; }

        /* Form Controls */
        .custom-input { border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 600; padding: 0.75rem 1rem; color: #172b4d; transition: all 0.2s ease; }
        .custom-input:focus { box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.2); border-color: #5e72e4; }
        body.dark-mode .custom-input { background-color: #0f172a !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #f8fafc !important;}
        body.dark-mode .custom-input:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2) !important; }

        /* Fix Modal Headers in Darkmode */
         body.dark-mode .dark-modal-ready .modal-content { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        body.dark-mode .dark-modal-ready .modal-header { border-bottom: 1px solid rgba(255,255,255,0.05); }

        .bg-light-soft { background-color: #f8f9fe; }
        body.dark-mode .bg-light-soft { background-color: rgba(255,255,255,0.02); }
      `}</style>
    </div>
  );
};

export default AffiliateListTab;

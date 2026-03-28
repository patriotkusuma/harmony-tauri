import React, { useState, useEffect } from "react";
import { Col, FormGroup, Label, Input, Card, CardBody, Row, Button } from "reactstrap";
import { toast } from "react-toastify";
import affiliateService from "../../../services/api/affiliate";

const AffiliateFeeForm = ({ services = [], onSuccess, editFee, setEditFee }) => {
  const [saving, setSaving] = useState(false);
  const [searchSvc, setSearchSvc] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    affiliate_type: "manager",
    id_jenis_cuci: "",
    fee_type: "flat", // flat | percentage | progressive
    amount: "",
    min_qty: 0,
  });

  useEffect(() => {
    if (editFee) {
        setFormData({
            affiliate_type: editFee.AffiliateType,
            id_jenis_cuci: editFee.IdJenisCuci,
            fee_type: editFee.FeeType,
            amount: editFee.Amount,
            min_qty: editFee.MinQty || 0
        });
        const svc = (Array.isArray(services) ? services : []).find(s => s.id === editFee.IdJenisCuci);
        if (svc) setSearchSvc(svc.nama);
    } else {
        setFormData({
            affiliate_type: "manager",
            id_jenis_cuci: "",
            fee_type: "flat",
            amount: "",
            min_qty: 0,
        });
        setSearchSvc("");
    }
  }, [editFee, services]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredServices = (Array.isArray(services) ? services : []).filter(s =>
    s.nama.toLowerCase().includes(searchSvc.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.id_jenis_cuci || formData.amount === "") {
        return toast.warning("Pilih Layanan dari dropdown dan isi Nominal Fee");
    }

    setSaving(true);
    try {
      const payload = {
          ...formData,
          amount: parseFloat(formData.amount),
          min_qty: parseFloat(formData.min_qty),
          id_jenis_cuci: parseInt(formData.id_jenis_cuci)
      };

      if (editFee) {
          await affiliateService.updateFee(editFee.ID, payload);
          toast.success("Aturan berhasil diperbarui!");
          setEditFee(null);
      } else {
          await affiliateService.setFee(payload);
          toast.success("Pengaturan skema komisi berhasil disimpan!");
      }
      
      setFormData({ affiliate_type: "manager", id_jenis_cuci: "", fee_type: "flat", amount: "", min_qty: 0 });
      setSearchSvc("");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.details || "Gagal menyimpan fee komisi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Col xl="4" className="mb-4">
      <Card className="border-0 shadow-sm rounded-xl custom-wrapper h-100">
          <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom-custom pb-2">
                  <h5 className="font-weight-900 title-adaptive mb-0">
                    <i className={`fas ${editFee ? 'fa-edit' : 'fa-cog'} text-primary me-2`}></i>{editFee ? 'Edit Aturan' : 'Atur Fee Baru'}
                  </h5>
                  {editFee && (
                      <Button color="link" className="text-danger p-0 m-0 btn-sm font-weight-bold opacity-8" onClick={() => setEditFee(null)}>
                          Batal
                      </Button>
                  )}
              </div>
              <form onSubmit={handleSave}>
                  <FormGroup>
                      <Label className="font-weight-bold title-adaptive opacity-8 small">Target Partner</Label>
                      <Input type="select" name="affiliate_type" className="custom-input bg-input-box text-sm" value={formData.affiliate_type} onChange={handleChange}>
                          <option value="manager">Pengurus Kos / Organisasi</option>
                          <option value="customer">Customer Publik</option>
                      </Input>
                  </FormGroup>

                  <FormGroup style={{ position: 'relative' }}>
                      <Label className="font-weight-bold title-adaptive opacity-8 small">Jenis Layanan</Label>
                      <Input 
                          type="text" 
                          className="custom-input bg-input-box text-sm" 
                          placeholder="Cari & Pilih Layanan..."
                          value={searchSvc}
                          onChange={(e) => {
                              setSearchSvc(e.target.value);
                              setShowDropdown(true);
                              if (formData.id_jenis_cuci) setFormData({...formData, id_jenis_cuci: ""});
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                          required={!formData.id_jenis_cuci}
                      />
                      {formData.id_jenis_cuci && (
                          <i className="fas fa-check-circle text-success" style={{position:'absolute', right:'15px', top:'38px'}} />
                      )}
                      
                      {showDropdown && (
                          <div className="shadow border rounded bg-input-box drop-container" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                             {filteredServices.length > 0 ? filteredServices.map(s => (
                                <div 
                                   key={s.id} 
                                   className="px-3 py-2 cursor-pointer title-adaptive drop-item"
                                   style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(136, 152, 170, 0.1)' }}
                                   onMouseDown={() => {
                                       setSearchSvc(s.nama);
                                       setFormData({...formData, id_jenis_cuci: s.id});
                                       setShowDropdown(false);
                                   }}
                                >
                                   {s.nama}
                                </div>
                             )) : (
                                <div className="px-3 py-2 text-muted small">Layanan tidak ditemukan</div>
                             )}
                          </div>
                      )}
                  </FormGroup>

                  <Row>
                      <Col md="6">
                          <FormGroup>
                              <Label className="font-weight-bold title-adaptive opacity-8 small">Metode Hitung</Label>
                              <Input type="select" name="fee_type" className="custom-input bg-input-box text-sm px-2" value={formData.fee_type} onChange={handleChange}>
                                  <option value="flat">Flat (Rp)</option>
                                  <option value="percentage">Persen (%)</option>
                                  <option value="progressive">Progresif</option>
                              </Input>
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                              <Label className="font-weight-bold title-adaptive opacity-8 small">Nilai / Nominal</Label>
                              <Input type="number" step="any" name="amount" className="custom-input bg-input-box text-sm px-2 font-weight-bold text-success" placeholder="Mis: 2000" value={formData.amount} onChange={handleChange} required />
                          </FormGroup>
                      </Col>
                  </Row>

                  <FormGroup className="mb-4">
                      <Label className="font-weight-bold title-adaptive opacity-8 small">Batas Minimal Berat/Pcs (Opsional)</Label>
                      <Input type="number" step="any" name="min_qty" className="custom-input bg-input-box text-sm" value={formData.min_qty} onChange={handleChange} placeholder="Batas minimum layanan.." />
                      <small className="text-muted d-block mt-1">Isi 0 jika tidak ada syarat batas minimum cucian.</small>
                  </FormGroup>

                  <Button color="primary" block className="rounded-pill font-weight-bold shadow-sm" type="submit" disabled={saving}>
                      {saving ? <i className="fas fa-spinner fa-spin me-2" /> : <i className="fas fa-save me-2" />} Simpan Aturan
                  </Button>
              </form>
          </CardBody>
      </Card>
    </Col>
  );
};

export default AffiliateFeeForm;

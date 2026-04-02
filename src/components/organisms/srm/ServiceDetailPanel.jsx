import React, { useState, useEffect } from "react";
import { 
  Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, 
  Row, Col, Spinner, Alert 
} from "reactstrap";
import ImagePicker from "components/atoms/srm/ImagePicker";
import Swal from "sweetalert2";
import { formatImageUrl } from "store/serviceRevenueStore";


const ServiceDetailPanel = ({ 
  service, 
  categories, 
  revenueAccounts, 
  onSave, 
  onUpload, 
  onBack,
  isLoading,
  errorMessage,
  onClearError,
  priceHistory = [],
  onFetchHistory
}) => {
  const [form, setForm] = useState({
    id_category_paket: "",
    nama: "",
    harga: "",
    tipe: "per_kilo",
    keterangan: "",
    id_revenue_account: "",
    gambar: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        id_category_paket: service.id_category_paket || service.category_paket?.id || "",
        nama: service.nama,
        harga: service.harga,
        tipe: service.tipe,
        keterangan: service.keterangan || "",
        id_revenue_account: service.id_revenue_account || "",
        gambar: service.gambar || "",
      });
      onFetchHistory(service.id);
    }
  }, [service]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    const url = await onUpload(service.id, imageFile);
    if (url) {
      setForm(p => ({ ...p, gambar: url }));
      setImageFile(null); // Clear selected file after success
      Swal.fire({
        icon: 'success',
        title: 'Gambar Terunggah',
        text: 'URL gambar telah diperbarui otomatis.',
        timer: 1500,
        showConfirmButton: false
      });
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // We pass the updated form (which has the URL in 'gambar')
    // We pass null for imageFile because we handled separately or we can still pass it if you want the store to handle
    const success = await onSave(service.id, form, null);
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data layanan telah diperbarui.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  if (!service) return null;

  return (
    <Card className="border-0 shadow-lg detail-panel overflow-hidden">
      <CardHeader className="bg-transparent border-0 pt-4 pb-0 d-flex align-items-center">
        <Button color="link" onClick={onBack} className="p-0 me-3 text-dark">
          <i className="fas fa-arrow-left" />
        </Button>
        <div>
          <h4 className="mb-0 font-weight-bold">Detail Layanan</h4>
          <small className="text-muted">Konfigurasi lengkap dan aset visual.</small>
        </div>
      </CardHeader>
      
      <CardBody className="pt-4">
        {errorMessage && (
          <Alert color="danger" toggle={onClearError} className="mb-4 py-2 small">
            {errorMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg="4" className="text-center mb-4">
               <Label className="small font-weight-bold text-muted text-uppercase d-block mb-3">Foto Layanan</Label>
               <ImagePicker 
                 currentImage={formatImageUrl(form.gambar)} 
                 onImageSelect={setImageFile} 
                 label="Pilih Foto"
               />
               
               {imageFile && (
                 <Button 
                   color="success" 
                   size="sm" 
                   className="mt-2 w-100 rounded-pill shadow-none" 
                   onClick={handleImageUpload}
                   disabled={isUploading}
                 >
                   {isUploading ? <Spinner size="sm" /> : <><i className="fas fa-upload me-2" /> Unggah Sekarang</>}
                 </Button>
               )}

               <div className="mt-4 p-3 rounded-lg bg-light text-start border">
                  <div className="small font-weight-bold text-dark mb-1">URL Gambar</div>
                  <div className="text-break x-small text-muted" style={{ fontSize: '0.65rem' }}>
                    {form.gambar || "Belum ada gambar terunggah"}
                  </div>
               </div>
               
               <div className="mt-3 p-3 rounded-lg bg-light text-start border">
                  <div className="small font-weight-bold text-dark mb-1">ID Unik</div>
                  <code className="x-small text-break" style={{ fontSize: '0.7rem' }}>{service.uuid_jenis_cuci}</code>
               </div>
            </Col>

            
            <Col lg="8">
              <div className="p-4 rounded-xl shadow-sm border bg-white mb-4">
                 <h5 className="font-weight-bold mb-3">Informasi Umum</h5>
                 <Row>
                   <Col md="12">
                     <FormGroup>
                        <Label className="small font-weight-bold">Nama Layanan</Label>
                        <Input 
                          className="form-control-alternative no-border-radius"
                          value={form.nama}
                          onChange={(e) => setForm(p => ({ ...p, nama: e.target.value }))}
                          required
                        />
                     </FormGroup>
                   </Col>
                   <Col md="6">
                     <FormGroup>
                        <Label className="small font-weight-bold">Kategori Paket</Label>
                        <Input 
                          type="select"
                          className="form-control-alternative no-border-radius"
                          value={form.id_category_paket}
                          onChange={(e) => setForm(p => ({ ...p, id_category_paket: e.target.value }))}
                          required
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                        </Input>
                     </FormGroup>
                   </Col>
                   <Col md="6">
                      <FormGroup>
                        <Label className="small font-weight-bold">Tipe Tarif</Label>
                        <Input 
                          type="select"
                          className="form-control-alternative no-border-radius"
                          value={form.tipe}
                          onChange={(e) => setForm(p => ({ ...p, tipe: e.target.value }))}
                        >
                          <option value="per_kilo">Per Kilo</option>
                          <option value="satuan">Satuan / Item</option>
                          <option value="meter">Per Meter</option>
                        </Input>
                      </FormGroup>
                   </Col>
                   <Col md="12">
                     <FormGroup className="mb-0">
                        <Label className="small font-weight-bold">Harga Jual</Label>
                        <Input 
                          type="number"
                          className="form-control-alternative no-border-radius h2 font-weight-bold text-primary"
                          value={form.harga}
                          onChange={(e) => setForm(p => ({ ...p, harga: e.target.value }))}
                          required
                        />
                     </FormGroup>
                   </Col>
                 </Row>
              </div>

              <div className="p-4 rounded-xl shadow-sm border bg-success-soft border-success mb-4">
                 <h5 className="font-weight-bold mb-3 text-success">
                   <i className="fas fa-file-invoice-dollar me-2" />
                   Konfigurasi Keuangan
                 </h5>
                 <FormGroup className="mb-0">
                    <Label className="small font-weight-bold">Akun Pendapatan (Revenue)</Label>
                    <Input 
                      type="select"
                      className="form-control-alternative no-border-radius border-success"
                      value={form.id_revenue_account}
                      onChange={(e) => setForm(p => ({ ...p, id_revenue_account: e.target.value }))}
                    >
                       <option value="">Gunakan Akun Default</option>
                       {revenueAccounts.map(acc => (
                         <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                       ))}
                    </Input>
                    <p className="small text-muted mt-2 mb-0">
                      Pilih ke akun mana pendapatan dari layanan ini akan dicatat di laporan keuangan.
                    </p>
                 </FormGroup>
              </div>

              <FormGroup>
                 <Label className="small font-weight-bold">Keterangan / Deskripsi</Label>
                 <Input 
                    type="textarea"
                    rows="4"
                    className="form-control-alternative no-border-radius"
                    value={form.keterangan}
                    onChange={(e) => setForm(p => ({ ...p, keterangan: e.target.value }))}
                    placeholder="Contoh: Estimasi pengerjaan 2 hari kerja..."
                 />
              </FormGroup>

              {priceHistory && priceHistory.length > 0 && (
                <div className="p-4 rounded-xl shadow-sm border bg-white mb-4">
                  <h5 className="font-weight-bold mb-3">
                    <i className="fas fa-history me-2 text-primary" />
                    Riwayat Perubahan Harga
                   </h5>
                   <div className="table-responsive">
                     <table className="table align-items-center table-flush table-sm">
                       <thead className="thead-light">
                         <tr>
                            <th className="small">Tanggal Perubahan</th>
                            <th className="small text-right">Harga</th>
                         </tr>
                       </thead>
                       <tbody>
                         {priceHistory.map((h, i) => (
                           <tr key={i}>
                             <td className="small text-muted">{formatDate(h.created_at)}</td>
                             <td className="text-right font-weight-bold">{formatCurrency(h.harga)}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}

              <div className="d-flex justify-content-end pt-3" style={{ gap: '12px' }}>
                 <Button color="link" className="text-muted" onClick={onBack}>Batal</Button>
                 <Button color="primary" type="submit" className="px-5 rounded-pill shadow-none" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : "Simpan Perubahan"}
                 </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
      <style>{`
        .detail-panel { border-radius: 24px !important; }
        .bg-success-soft { background: #f0fdf4; }
        .no-border-radius { border-radius: 12px !important; }
        .rounded-xl { border-radius: 16px !important; }
      `}</style>
    </Card>
  );
};

export default ServiceDetailPanel;

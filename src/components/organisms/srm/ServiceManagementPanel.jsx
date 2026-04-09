import React, { useMemo, useState, useEffect } from "react";
import { 
  Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, 
  Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText 
} from "reactstrap";
import ServiceItemCard from "components/molecules/srm/ServiceItemCard";
import Swal from "sweetalert2";

const initialForm = {
  id_category_paket: "",
  nama: "",
  harga: "",
  tipe: "per_kilo",
  keterangan: "",
  gambar: "",
  id_revenue_account: "",
};

const ServiceManagementPanel = ({
  categories = [],
  services = [],
  revenueAccounts = [],
  selectedCategoryId,
  selectedServiceId,
  resolveRevenueAccount,
  onSelectService,
  onAddService,
  onDeleteService,
  onOpenDetail,
  errorMessage,
  onClearError,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setForm({ ...initialForm, id_category_paket: selectedCategoryId || "" });
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const catId = item.id_category_paket || item.category_paket?.id;
      const matchesCategory = selectedCategoryId ? catId === selectedCategoryId : true;
      const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategoryId, searchQuery]);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return "Semua Layanan";
    const cat = categories.find(c => c.id === selectedCategoryId);
    return cat ? cat.nama : "Layanan";
  }, [categories, selectedCategoryId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.id_category_paket) return;
    const success = await onAddService(form);
    if (success) toggleModal();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Layanan?",
      text: "Data ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) onDeleteService(id);
  };

  return (
    <>
      <Card className="border-0 shadow-lg service-dashboard">
        <CardHeader className="bg-transparent border-0 pb-3 pt-4">
          <Row className="align-items-center">
            <Col md="6">
              <h4 className="mb-0 font-weight-bold text-dark">
                {selectedCategoryName}
              </h4>
              <small className="text-muted font-weight-bold" style={{ fontSize: '0.65rem' }}>
                {filteredServices.length} LAYANAN AKTIF
              </small>
            </Col>
            <Col md="6" className="text-end">
              <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                <InputGroup className="input-group-alternative d-none d-md-flex shadow-none border" style={{ maxWidth: '200px', borderRadius: '10px' }}>
                  <InputGroupText className="bg-transparent border-0 py-0 pe-2 ps-3">
                    <i className="fas fa-search text-muted" style={{ fontSize: '0.8rem' }} />
                  </InputGroupText>
                  <Input 
                    placeholder="Cari layanan..." 
                    type="text" 
                    className="border-0 h-auto py-2 px-0 bg-transparent"
                    style={{ fontSize: '0.85rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <Button color="primary" className="shadow-none px-4 rounded-pill" size="sm" onClick={toggleModal}>
                  <i className="fas fa-plus me-2" /> Baru
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="pt-2">
          {filteredServices.length === 0 ? (
            <div className="text-center py-6">
               <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                  <i className="fas fa-soap text-muted opacity-5" style={{ fontSize: '2rem' }} />
               </div>
               <h5 className="text-muted">Layanan belum tersedia</h5>
               <p className="text-muted small">Mulai tambahkan jenis layanan untuk kategori ini.</p>
            </div>
          ) : (
            <div className="service-grid-container pe-2" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: "auto" }}>
              <Row>
                {filteredServices.map((service) => (
                  <Col xl="4" md="6" key={service.id} className="mb-3">
                    <ServiceItemCard
                      service={service}
                      isActive={selectedServiceId === service.id}
                      resolvedAccount={resolveRevenueAccount(service.uuid_jenis_cuci)}
                      onClick={() => onSelectService(service.id)}
                      onEdit={() => onOpenDetail(service.id)}
                      onDelete={() => handleDelete(service.id)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered className="modal-srm">
        <ModalHeader toggle={toggleModal} className="border-0 pb-0">
           <span className="h4 font-weight-bold text-dark">Tambah Jenis Cuci</span>
        </ModalHeader>
        <Form onSubmit={submit}>
          <ModalBody>
            <FormGroup>
               <Label className="small font-weight-bold">Nama Layanan</Label>
               <Input 
                  className="form-control-alternative no-border-radius"
                  value={form.nama}
                  onChange={(e) => setForm(p => ({ ...p, nama: e.target.value }))}
                  placeholder="Misal: Cuci Kiloan Regular"
                  required
               />
            </FormGroup>
            <FormGroup>
               <Label className="small font-weight-bold">Kategori</Label>
               <Input 
                  type="select"
                  className="form-control-alternative no-border-radius"
                  value={form.id_category_paket}
                  onChange={(e) => setForm(p => ({ ...p, id_category_paket: e.target.value }))}
                  required
               >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
               </Input>
            </FormGroup>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label className="small font-weight-bold">Harga</Label>
                  <Input 
                    type="number"
                    className="form-control-alternative no-border-radius"
                    value={form.harga}
                    onChange={(e) => setForm(p => ({ ...p, harga: e.target.value }))}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="small font-weight-bold">Tipe</Label>
                   <Input 
                    type="select"
                    className="form-control-alternative no-border-radius"
                    value={form.tipe}
                    onChange={(e) => setForm(p => ({ ...p, tipe: e.target.value }))}
                  >
                    <option value="per_kilo">Kilo</option>
                    <option value="satuan">Unit</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="border-0 pt-0">
             <Button color="link" className="text-muted" onClick={toggleModal}>Batal</Button>
             <Button color="primary" type="submit" className="px-4">Simpan & Lanjutkan</Button>
          </ModalFooter>
        </Form>
      </Modal>

      <style>{`
        .service-dashboard {
          border-radius: 20px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px);
        }
        .service-grid-container::-webkit-scrollbar { width: 3px; }
        .service-grid-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .no-border-radius { border-radius: 10px !important; }
        .py-6 { padding-top: 5rem; padding-bottom: 5rem; }
      `}</style>
    </>
  );
};


export default ServiceManagementPanel;



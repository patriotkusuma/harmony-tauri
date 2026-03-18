import React, { useMemo, useState } from "react";
import { 
  Badge, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label,
  Modal, ModalBody, ModalFooter, ModalHeader, Row
} from "reactstrap";
import CategoryItemCard from "components/molecules/srm/CategoryItemCard";
import Swal from "sweetalert2";

const initialForm = { nama: "", deskripsi: "", tipe_durasi: "hari", durasi: 1 };

const CategoryManagementPanel = ({
  categories = [],
  services = [],
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setForm(initialForm);
      setIsEditing(false);
      setEditingId(null);
    }
  };

  const serviceCountByCategory = useMemo(() => {
    return services.reduce((acc, svc) => {
      const catId = svc.id_category_paket || svc.category_paket?.id;
      acc[catId] = (acc[catId] || 0) + 1;
      return acc;
    }, {});
  }, [services]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return;
    
    let success;
    if (isEditing) {
      success = await onUpdateCategory(editingId, form);
    } else {
      success = await onAddCategory(form);
    }

    if (success) {
      toggleModal();
    }
  };

  const handleEdit = (cat) => {
    setForm({
      nama: cat.nama,
      deskripsi: cat.deskripsi || "",
      tipe_durasi: cat.tipe_durasi,
      durasi: cat.durasi,
    });
    setIsEditing(true);
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kategori?",
      text: "Pastikan tidak ada layanan yang terhubung ke kategori ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      onDeleteCategory(id);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg category-sidebar">
        <CardHeader className="bg-transparent border-0 pb-3 pt-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0 font-weight-bold text-dark">Kategori</h4>
            <small className="text-muted text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Pilih untuk filter layanan</small>
          </div>
          <Button 
            color="primary" 
            size="sm" 
            className="btn-icon-only rounded-circle shadow-none"
            onClick={toggleModal}
          >
            <i className="fas fa-plus" />
          </Button>
        </CardHeader>
        <CardBody className="px-3 pt-0">
          <div className="category-list-scroll pr-1" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: "auto" }}>
            {categories.length === 0 ? (
              <div className="text-center py-5 text-muted small border rounded-lg bg-light">
                <i className="fas fa-folder-open d-block mb-2 opacity-5" style={{ fontSize: '1.5rem' }} />
                Belum ada kategori.
              </div>
            ) : (
              categories.map((category) => (
                <CategoryItemCard
                  key={category.id}
                  category={category}
                  serviceCount={serviceCountByCategory[category.id] || 0}
                  isActive={selectedCategoryId === category.id}
                  onClick={() => onSelectCategory(category.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered className="modal-srm">
        <ModalHeader toggle={toggleModal} className="border-0 pb-0">
          <span className="h3 font-weight-bold text-dark">
            {isEditing ? "Edit Kategori" : "Kategori Baru"}
          </span>
        </ModalHeader>
        <Form onSubmit={submit}>
          <ModalBody>
            <FormGroup>
              <Label className="small font-weight-bold text-muted">Nama Kategori</Label>
              <Input
                className="form-control-alternative no-border-radius"
                value={form.nama}
                onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                placeholder="Misal: Cuci Kiloan, Satuan..."
                required
              />
            </FormGroup>
            <FormGroup>
              <Label className="small font-weight-bold text-muted">Deskripsi Singkat</Label>
              <Input
                className="form-control-alternative no-border-radius"
                type="textarea"
                rows="2"
                value={form.deskripsi}
                onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                placeholder="Jelaskan jenis layanan dalam kategori ini"
              />
            </FormGroup>
            <Row>
              <Col md="7">
                <FormGroup>
                  <Label className="small font-weight-bold text-muted">Satuan Waktu</Label>
                  <Input
                    type="select"
                    className="form-control-alternative no-border-radius"
                    value={form.tipe_durasi}
                    onChange={(e) => setForm((p) => ({ ...p, tipe_durasi: e.target.value }))}
                  >
                    <option value="hari">Hari</option>
                    <option value="jam">Jam</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="5">
                <FormGroup>
                  <Label className="small font-weight-bold text-muted">Estimasi</Label>
                  <Input
                    type="number"
                    min={1}
                    className="form-control-alternative no-border-radius"
                    value={form.durasi}
                    onChange={(e) => setForm((p) => ({ ...p, durasi: e.target.value }))}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="border-0 pt-0">
            <Button color="link" className="text-muted shadow-none" onClick={toggleModal}>Batal</Button>
            <Button color="primary" type="submit" className="px-4 shadow-none">
              {isEditing ? "Simpan Perubahan" : "Buat Kategori"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <style>{`
        .category-sidebar {
          border-radius: 20px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          min-height: 500px;
        }
        .category-list-scroll::-webkit-scrollbar { width: 3px; }
        .category-list-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .modal-srm .modal-content {
          border-radius: 20px;
          border: none;
          box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
        }
        .no-border-radius { border-radius: 10px !important; }
      `}</style>
    </>
  );
};

export default CategoryManagementPanel;



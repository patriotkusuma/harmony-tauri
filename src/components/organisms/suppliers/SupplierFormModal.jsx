import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, FormGroup, Label, Input } from "reactstrap";

const SupplierFormModal = ({ isOpen, toggle, selectedData, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    telpone: "",
    email: "",
    address: "",
    supplier_type: "",
    description: ""
  });

  useEffect(() => {
    if (selectedData) {
      setFormData({
        name: selectedData.name || "",
        contact_person: selectedData.contact_person || "",
        telpone: selectedData.telpone || "",
        email: selectedData.email || "",
        address: selectedData.address || "",
        supplier_type: selectedData.supplier_type || "",
        description: selectedData.description || ""
      });
    } else {
      setFormData({
        name: "",
        contact_person: "",
        telpone: "",
        email: "",
        address: "",
        supplier_type: "",
        description: ""
      });
    }
  }, [selectedData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    // Basic validation according to API docs
    if (!formData.name || !formData.supplier_type) {
      alert("Nama Supplier dan Kategori Tipe wajib diisi!");
      return;
    }
    
    // Clean up empty fields if necessary, or pass empty strings
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered dark-modal-ready" size="lg">
      <ModalHeader toggle={toggle} className="border-bottom-custom pb-3">
        <span className="font-weight-900 text-dark title-adaptive">
            <i className={`fas ${selectedData ? 'fa-edit' : 'fa-truck-loading'} me-2 text-primary`} />
            {selectedData ? 'Edit Data Supplier' : 'Registrasi Supplier Baru'}
        </span>
      </ModalHeader>
      <ModalBody className="bg-white custom-wrapper">
        <Row>
          <Col md="6">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Nama Vendor / Supplier <span className="text-danger">*</span></Label>
              <Input type="text" name="name" className="custom-input bg-input-box" placeholder="Contoh: Toko Berkah" value={formData.name} onChange={handleChange} required />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Kategori / Tipe <span className="text-danger">*</span></Label>
              <Input type="select" name="supplier_type" className="custom-input bg-input-box" value={formData.supplier_type} onChange={handleChange} required>
                <option value="">-- Pilih Kategori --</option>
                <option value="Online Marketplace">Online Marketplace</option>
                <option value="Toko Fisik Retail">Toko Fisik Retail</option>
                <option value="Distributor">Distributor</option>
                <option value="Lainnya">Lainnya</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Kontak Person (PIC)</Label>
              <Input type="text" name="contact_person" className="custom-input bg-input-box" placeholder="Nama pengurus/sales vendor" value={formData.contact_person} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">No Telepon / WA</Label>
              <Input type="number" name="telpone" className="custom-input bg-input-box" placeholder="Contoh: 081234..." value={formData.telpone} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Email</Label>
              <Input type="email" name="email" className="custom-input bg-input-box" placeholder="Alamat surel vendor" value={formData.email} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Alamat Lengkap</Label>
              <Input type="textarea" rows="2" name="address" className="custom-input bg-input-box" placeholder="Alamat gudang / toko" value={formData.address} onChange={handleChange} />
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Label className="font-weight-bold title-adaptive opacity-8">Keterangan / Catatan Tambahan</Label>
              <Input type="text" name="description" className="custom-input bg-input-box" placeholder="Deskripsi mengenai supplier ini" value={formData.description} onChange={handleChange} />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="border-top-0 custom-wrapper pt-0 bg-white">
        <Button color="secondary" onClick={toggle} className="rounded-pill font-weight-bold px-4" disabled={saving}>Batal</Button>
        <Button color="primary" onClick={handleFormSubmit} className="rounded-pill font-weight-bold px-4 shadow-sm" disabled={saving}>
          {saving ? <i className="fas fa-spinner fa-spin me-2" /> : <i className="fas fa-save me-2" />} {selectedData ? 'Simpan Perubahan' : 'Simpan Supplier'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SupplierFormModal;

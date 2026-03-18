import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const ModalTambah = (props) => {
  const { modal, toggle, onSubmit } = props; // Assuming onSubmit prop for handling upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [keterangan, setKeterangan] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = () => {
    // Pass data to parent component for actual upload
    if (onSubmit && selectedFile) {
      onSubmit({ file: selectedFile, keterangan });
    }
    // Reset state and close modal after submission
    setSelectedFile(null);
    setPreview(null);
    setKeterangan("");
    toggle();
  };

  // Reset state when modal is closed without submitting
  const handleToggle = () => {
    if (modal) { // Only reset if modal was open
      setSelectedFile(null);
      setPreview(null);
      setKeterangan("");
    }
    toggle();
  };

  return (
    <>
      <Modal isOpen={modal} toggle={handleToggle} centered size="md"> {/* Changed size to md for a more compact look */}
        <ModalHeader toggle={handleToggle} className="bg-white border-bottom shadow-sm">
          <h5 className="modal-title text-dark font-weight-bold">
            <i className="fas fa-camera-retro mr-2 text-primary"></i>Unggah Bukti Pakaian
          </h5>
        </ModalHeader>
        <ModalBody className="p-4">
          <Form>
            <Row>
              <Col md="12">
                <FormGroup className="mb-4">
                  <Label htmlFor="file-upload-input" className="w-100" style={{ cursor: 'pointer' }}>
                    {preview ? (
                      <div className="text-center position-relative mb-3">
                        <img
                          src={preview}
                          alt="Preview Bukti"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: '250px', border: '1px solid #dee2e6' }}
                        />
                        <Button
                          color="danger"
                          size="sm"
                          className="position-absolute rounded-circle shadow-lg border-white border-2"
                          style={{ top: '-10px', right: '-10px', width: '30px', height: '30px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); setPreview(null); const fileInput = document.getElementById('file-upload-input'); if (fileInput) fileInput.value = null; }}
                          title="Hapus gambar"
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-5 border-dashed rounded bg-light" style={{borderWidth: '2px'}}>
                        <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                        <p className="text-muted font-weight-bold mb-0">Klik untuk memilih gambar</p>
                        <small className="text-muted d-block">Format JPG, PNG, GIF (Maks. 5MB)</small>
                      </div>
                    )}
                  </Label>
                  <Input id="file-upload-input" name="file" type="file" className="d-none" onChange={handleFileChange} accept="image/*" />
                  {selectedFile && !preview && <small className="text-muted mt-1 d-block">File: {selectedFile.name}</small>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="keterangan-foto" className="form-control-label text-dark">
                    Keterangan (Opsional)
                  </Label>
                  <Input type="textarea" rows="3" className="form-control-alternative" placeholder="Deskripsi singkat mengenai foto bukti..." id="keterangan-foto" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter className="bg-white d-flex justify-content-end p-3 border-top"> {/* Changed to justify-content-end */}
          <Button color="link" onClick={handleToggle} className="px-4 text-muted mr-2"> {/* Changed to link for subtle cancel */}
            <i className="fas fa-times mr-2"></i>Batal
          </Button>
          <Button color="primary" onClick={handleSubmit} disabled={!selectedFile} className="px-4 shadow-sm"> {/* Changed to primary for main action */}
            <i className="fas fa-cloud-upload-alt mr-2"></i>Upload Bukti
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalTambah;

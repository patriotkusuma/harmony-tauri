import React, { useEffect, useState } from "react";
import { Container, Button, Card, CardBody, CardHeader } from "reactstrap";
import SupplierTable from "../../components/organisms/suppliers/SupplierTable";
import SupplierFormModal from "../../components/organisms/suppliers/SupplierFormModal";
import useSupplierStore from "../../store/supplierStore";

const SupplierManagement = () => {
  const { suppliers, loading, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } = useSupplierStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModal = () => {
    if (modalOpen) {
        setSelectedSupplier(null); // Reset on close
    }
    setModalOpen(!modalOpen);
  };

  const handleEdit = (item) => {
    setSelectedSupplier(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data supplier ini secara permanen?")) {
      await deleteSupplier(id);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    let success = false;
    if (selectedSupplier) {
      success = await updateSupplier(selectedSupplier.id, data);
    } else {
      success = await createSupplier(data);
    }
    
    if (success) {
        toggleModal();
    }
    setSaving(false);
  };

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8 bg-gradient-info custom-header">
        <Container fluid>
          <div className="header-body">
             {/* Header filler */}
          </div>
        </Container>
      </div>

      <Container className="mt--7 custom-container" fluid>
        <Card className="shadow-lg border-0 bg-white custom-card fade-in">
          <CardHeader className="bg-transparent pb-3 pt-4 border-bottom-custom px-4 d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h2 className="mb-0 text-dark font-weight-900 title-adaptive lh-110">
                <i className="fas fa-truck-loading text-primary me-2"></i>Vendor & Supplier
              </h2>
              <p className="text-muted mb-0 small opacity-8 mt-1">
                Lacak kontak distribusi, kelola vendor bahan baku / perlengkapan operasional.
              </p>
            </div>
            <Button color="primary" className="rounded-pill shadow-sm px-4 mt-3 mt-md-0 d-flex align-items-center font-weight-bold" onClick={toggleModal}>
              <i className="fas fa-plus me-2" />
              <span>Daftar Supplier</span>
            </Button>
          </CardHeader>
          
          <CardBody className="p-4 bg-transparent position-relative">
            <SupplierTable 
              data={suppliers}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardBody>
        </Card>
      </Container>

      {/* MODAL HANDLING */}
      <SupplierFormModal 
         isOpen={modalOpen}
         toggle={toggleModal}
         selectedData={selectedSupplier}
         onSave={handleSave}
         saving={saving}
      />

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

        /* Fix Modal Headers in Darkmode */
        body.dark-mode .dark-modal-ready .modal-content { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        body.dark-mode .dark-modal-ready .modal-header { border-bottom: 1px solid rgba(255,255,255,0.05); }
        
        /* Darkmode Overrides */
        body.dark-mode .custom-card { background-color: #1e293b !important; border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.25) !important;}
      `}</style>
    </>
  );
};

export default SupplierManagement;

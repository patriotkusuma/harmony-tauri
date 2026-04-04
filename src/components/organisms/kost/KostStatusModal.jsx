import React, { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge,
} from "reactstrap";
import Swal from "sweetalert2";
import { useKostStore, STATUS_CONFIG, STATUS_FLOW } from "../../../store/kostStore";

const KostStatusModal = ({ isOpen, kost, onClose }) => {
  const { updateStatus } = useKostStore();
  const [selectedStatus, setSelectedStatus] = useState(kost?.status ?? "pending");

  // Sync ketika kost berbeda (modal dibuka untuk kost lain)
  React.useEffect(() => {
    if (kost) setSelectedStatus(kost.status);
  }, [kost]);

  const handleSave = async () => {
    if (selectedStatus === kost?.status) {
      onClose();
      return;
    }
    const result = await Swal.fire({
      title: "Ubah Status?",
      text: `"${kost?.name}" → ${STATUS_CONFIG[selectedStatus]?.label}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
      confirmButtonColor: "#5e72e4",
    });
    if (!result.isConfirmed) return;

    const ok = await updateStatus(kost.id, selectedStatus);
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader
        toggle={onClose}
        style={{ border: "none", paddingBottom: 0 }}
      >
        <i className="fas fa-edit mr-2 text-primary" />
        Ubah Status Kerjasama
      </ModalHeader>
      <ModalBody>
        <p className="text-muted small mb-3">
          <strong>{kost?.name}</strong>
        </p>
        <div className="d-flex flex-column" style={{ gap: "8px" }}>
          {STATUS_FLOW.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isSelected = selectedStatus === s;
            return (
              <div
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: isSelected ? "2px solid #5e72e4" : "1px solid #e2e8f0",
                  background: isSelected ? "#f0f3ff" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.15s",
                }}
              >
                <Badge
                  color={cfg.color}
                  pill
                  style={{ width: "10px", height: "10px", padding: "5px" }}
                />
                <div className="font-weight-bold" style={{ fontSize: "0.88rem" }}>
                  <i className={`${cfg.icon} mr-2`} />
                  {cfg.label}
                </div>
                {isSelected && (
                  <i className="fas fa-check-circle text-primary ml-auto" />
                )}
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter style={{ border: "none" }}>
        <Button
          color="primary"
          onClick={handleSave}
          style={{ borderRadius: "50px", padding: "8px 28px" }}
        >
          Simpan
        </Button>
        <Button
          color="light"
          onClick={onClose}
          style={{ borderRadius: "50px" }}
        >
          Batal
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default KostStatusModal;

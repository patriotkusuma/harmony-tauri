import React, { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge,
} from "reactstrap";
import Swal from "sweetalert2";
import { useCompetitorStore, COMPETITOR_STATUS_CONFIG, COMPETITOR_STATUS_FLOW } from "../../../store/competitorStore";

const CompetitorStatusModal = ({ isOpen, competitor, onClose }) => {
  const { updateStatus } = useCompetitorStore();
  const [selectedStatus, setSelectedStatus] = useState(competitor?.status ?? "potential");

  React.useEffect(() => {
    if (competitor) setSelectedStatus(competitor.status);
  }, [competitor]);

  const handleSave = async () => {
    if (selectedStatus === competitor?.status) {
      onClose();
      return;
    }
    const result = await Swal.fire({
      title: "Ubah Status Kompetitor?",
      text: `"${competitor?.name}" → ${COMPETITOR_STATUS_CONFIG[selectedStatus]?.label}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
      confirmButtonColor: "#e05c5c",
    });
    if (!result.isConfirmed) return;
    const ok = await updateStatus(competitor.id, selectedStatus);
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose} style={{ border: "none", paddingBottom: 0 }}>
        <i className="fas fa-edit mr-2 text-danger" />
        Ubah Status Kompetitor
      </ModalHeader>
      <ModalBody>
        <p className="text-muted small mb-3">
          <strong>{competitor?.name}</strong>
        </p>
        <div className="d-flex flex-column" style={{ gap: "8px" }}>
          {COMPETITOR_STATUS_FLOW.map((s) => {
            const cfg = COMPETITOR_STATUS_CONFIG[s];
            const isSelected = selectedStatus === s;
            return (
              <div
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: isSelected ? "2px solid #e05c5c" : "1px solid #e2e8f0",
                  background: isSelected ? "#fff5f5" : "#fff",
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
                {isSelected && <i className="fas fa-check-circle text-danger ml-auto" />}
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter style={{ border: "none" }}>
        <Button
          color="danger"
          onClick={handleSave}
          style={{ borderRadius: "50px", padding: "8px 28px" }}
        >
          Simpan
        </Button>
        <Button color="light" onClick={onClose} style={{ borderRadius: "50px" }}>
          Batal
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CompetitorStatusModal;

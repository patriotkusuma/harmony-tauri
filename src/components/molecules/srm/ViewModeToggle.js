import React from "react";
import { ButtonGroup, Button } from "reactstrap";

const ViewModeToggle = ({ mode, onToggle }) => {
  return (
    <ButtonGroup className="view-mode-toggle p-1 shadow-sm" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
      <Button
        color={mode === "category" ? "primary" : "link"}
        className={`px-3 py-2 rounded-lg border-0 ${mode === "category" ? "text-white shadow-none" : "text-white opacity-7"}`}
        style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
        onClick={() => onToggle("category")}
      >
        <i className="fas fa-layer-group mr-2" />
        KATEGORI
      </Button>
      <Button
        color={mode === "list" ? "primary" : "link"}
        className={`px-3 py-2 rounded-lg border-0 ${mode === "list" ? "text-white shadow-none" : "text-white opacity-7"}`}
        style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
        onClick={() => onToggle("list")}
      >
        <i className="fas fa-list-ul mr-2" />
        LIHAT SEMUA
      </Button>
      <style>{`
        .view-mode-toggle .btn {
          transition: all 0.2s ease;
        }
        .view-mode-toggle .btn-link {
          color: #94a3b8 !important;
        }
        .view-mode-toggle .btn-link:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.05);
          text-decoration: none;
        }
        .view-mode-toggle .btn-primary {
           background-color: #3b82f6 !important;
           border: 1px solid #60a5fa !important;
        }
      `}</style>
    </ButtonGroup>

  );
};

export default ViewModeToggle;

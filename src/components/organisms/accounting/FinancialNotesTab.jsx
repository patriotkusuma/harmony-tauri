import React from "react";
import { Spinner } from "reactstrap";

const FinancialNotesTab = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="text-muted mt-3">Memuat catatan...</p>
            </div>
        );
    }

    return (
        <div className="financial-notes-tab">
            <div className="notes-container mx-auto" style={{ maxWidth: 700 }}>
                {/* Company Info */}
                <div className="note-section mb-4">
                    <div className="note-header d-flex align-items-center mb-3">
                        <div className="note-icon me-3">
                            <i className="fas fa-building" />
                        </div>
                        <h5 className="mb-0 font-weight-bold text-dark">Informasi Perusahaan</h5>
                    </div>
                    <div className="note-body p-4 rounded-xl">
                        <p className="mb-0 text-dark" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                            {data.company_info || "Belum ada informasi perusahaan."}
                        </p>
                    </div>
                </div>

                {/* Accounting Policies */}
                <div className="note-section mb-4">
                    <div className="note-header d-flex align-items-center mb-3">
                        <div className="note-icon me-3">
                            <i className="fas fa-gavel" />
                        </div>
                        <h5 className="mb-0 font-weight-bold text-dark">Kebijakan Akuntansi</h5>
                    </div>
                    <div className="note-body p-4 rounded-xl">
                        <p className="mb-0 text-dark" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                            {data.accounting_policies || "Belum ada informasi kebijakan akuntansi."}
                        </p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="disclaimer p-4 rounded-xl text-center">
                    <i className="fas fa-info-circle text-info mb-3 fs-3 d-block" />
                    <p className="text-muted mb-0 small">
                        Catatan ini merupakan bagian integral dari laporan keuangan dan harus dibaca bersama-sama dengan laporan keuangan lainnya.
                        Angka-angka yang disajikan belum diaudit oleh auditor independen.
                    </p>
                </div>
            </div>

            <style>{`
                .note-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
                    color: #4f46e5;
                    flex-shrink: 0;
                }
                .note-body {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-left: 4px solid #6366f1;
                }
                .disclaimer {
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                    border: 1px dashed #7dd3fc;
                }
                .rounded-xl { border-radius: 12px; }
            `}</style>
        </div>
    );
};

export default FinancialNotesTab;

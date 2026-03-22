import React from 'react';
import { 
    Modal, ModalBody, ModalFooter, 
    Button, Table, Row, Col
} from 'reactstrap';
import moment from 'moment';

const InventoryDetailModal = ({ 
    isOpen, 
    toggle, 
    item, 
    movements, 
    loading 
}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" centered contentClassName="border-0 shadow-premium modal-custom" style={{ borderRadius: '20px' }}>
            <div className="modal-header-custom d-flex align-items-center justify-content-between p-4 border-bottom-custom">
                <div className="d-flex align-items-center">
                    <div className="icon-box-primary rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm">
                        <i className="fas fa-history text-primary fa-lg" />
                    </div>
                    <div>
                        <h3 className="mb-0 font-weight-900 title-text">Riwayat Pergerakan Stok</h3>
                        <p className="text-muted mb-0 font-weight-bold" style={{ fontSize: '0.85rem' }}>{item?.nama}</p>
                    </div>
                </div>
                <button type="button" className="close-btn-custom" onClick={toggle}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            
            <ModalBody className="p-0">
                {/* Info Metadata */}
                <div className="metadata-box p-4 border-bottom-custom">
                    <Row>
                        <Col md="3" className="text-center border-right-custom">
                            <h6 className="text-uppercase text-muted font-weight-800 ls-1 mb-2" style={{ fontSize: '0.65rem' }}>Stok Saat Ini</h6>
                            <h2 className="mb-0 font-weight-900 text-primary">{item?.current_stock}</h2>
                            <small className="text-muted font-weight-bold text-uppercase">{item?.unit_name}</small>
                        </Col>
                        <Col md="3" className="text-center border-right-custom">
                            <h6 className="text-uppercase text-muted font-weight-800 ls-1 mb-2" style={{ fontSize: '0.65rem' }}>Stok Awal</h6>
                            <h2 className="mb-0 font-weight-900 stat-text">{item?.initial_stock}</h2>
                        </Col>
                        <Col md="3" className="text-center border-right-custom">
                            <h6 className="text-uppercase text-muted font-weight-800 ls-1 mb-2" style={{ fontSize: '0.65rem' }}>Harga Beli</h6>
                            <h2 className="mb-0 font-weight-900 text-success" style={{ fontSize: '1.2rem' }}>
                                Rp {item?.cost_per_unit?.toLocaleString('id-ID')}
                            </h2>
                        </Col>
                        <Col md="3" className="text-center">
                            <h6 className="text-uppercase text-muted font-weight-800 ls-1 mb-2" style={{ fontSize: '0.65rem' }}>Tgl Perolehan</h6>
                            <h3 className="mb-0 font-weight-bold stat-text mt-1" style={{ fontSize: '1rem' }}>
                                {item?.purchase_date ? moment(item.purchase_date).format('DD/MM/YYYY') : '-'}
                            </h3>
                        </Col>
                    </Row>
                </div>

                <div className="p-3 bg-label-box border-bottom-custom">
                    <h6 className="text-uppercase text-primary font-weight-800 mb-0" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        <i className="fas fa-stream me-2" /> Timeline Pergerakan
                    </h6>
                </div>
                
                <div style={{ maxHeight: '450px', overflowY: 'auto' }} className="table-responsive">
                    <Table className="align-middle custom-timeline-table mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead className="sticky-top">
                            <tr>
                                <td className="table-header-cell">Tanggal</td>
                                <td className="table-header-cell">Tipe</td>
                                <td className="table-header-cell text-center">Jumlah</td>
                                <td className="table-header-cell">Sumber / Ket</td>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border text-primary me-2 shadow-sm" role="status" style={{ width: '1.5rem', height: '1.5rem' }}></div>
                                        <span className="text-muted font-weight-bold">Memuat riwayat...</span>
                                    </td>
                                </tr>
                            ) : (!movements || movements.length === 0) ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <i className="fas fa-folder-open fa-3x text-light mb-3 empty-icon"></i>
                                        <h5 className="text-muted font-weight-bold mb-0">Belum Ada Riwayat</h5>
                                    </td>
                                </tr>
                            ) : (
                                Array.isArray(movements) && movements.map((m) => (
                                    <tr key={m.id} className="timeline-row">
                                        <td className="font-weight-bold py-3 border-bottom-custom stat-text">
                                            {moment(m.movement_date).format('DD MMM YYYY')}
                                        </td>
                                        <td className="border-bottom-custom">
                                            <div className={`d-inline-flex align-items-center rounded-pill font-weight-bold px-3 py-1 ${
                                                m.movement_type === 'in' ? 'badge-soft-success' : 
                                                m.movement_type === 'out' ? 'badge-soft-danger' : 'badge-soft-info'
                                            }`} style={{ fontSize: '0.7rem' }}>
                                                {m.movement_type === 'in' ? 'Masuk' : m.movement_type === 'out' ? 'Keluar' : 'Koreksi'}
                                            </div>
                                        </td>
                                        <td className="text-center border-bottom-custom">
                                            <span className={`h4 mb-0 font-weight-900 ${m.movement_type === 'out' ? 'text-danger' : m.movement_type === 'in' ? 'text-success' : 'text-info'}`}>
                                                {m.movement_type === 'out' ? '-' : m.movement_type === 'in' ? '+' : ''}{m.quantity}
                                            </span>
                                        </td>
                                        <td className="border-bottom-custom">
                                            <div className="d-flex flex-column">
                                                <span className="font-weight-800 stat-text text-uppercase" style={{ fontSize: '0.75rem' }}>{m.reference_type}</span>
                                                <small className="text-muted italic">{m.description || '-'}</small>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
            <ModalFooter className="modal-footer-custom py-3 border-top-0">
                <Button color="light" onClick={toggle} className="px-5 font-weight-bold rounded-pill border-0 shadow-sm btn-close-modal">
                    Tutup
                </Button>
            </ModalFooter>

            <style>{`
                /* Modal Styling */
                .modal-custom .modal-content { border-radius: 20px; overflow: hidden; background-color: #ffffff; border: none !important; }
                body.dark-mode .modal-custom .modal-content { background-color: #1e293b; color: #f8fafc; }
                
                .shadow-premium { box-shadow: 0 15px 35px rgba(50,50,93,.2), 0 5px 15px rgba(0,0,0,.17) !important; }

                /* Headers & Footers */
                .modal-header-custom { background-color: #ffffff; border-bottom: 1px solid #f1f3f9; }
                body.dark-mode .modal-header-custom { background-color: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.05); }
                
                .modal-footer-custom { background-color: #f8f9fe; }
                body.dark-mode .modal-footer-custom { background-color: #0f172a; }

                /* Close Button */
                .close-btn-custom { background: none; border: none; font-size: 1.25rem; color: #adb5bd; transition: color 0.2s; opacity: 0.7; }
                .close-btn-custom:hover { color: #f5365c; opacity: 1; }
                body.dark-mode .close-btn-custom { color: #94a3b8; }
                body.dark-mode .close-btn-custom:hover { color: #fb7185; }

                /* Texts & Icons */
                .title-text { color: #172b4d; letter-spacing: 0.3px; }
                body.dark-mode .title-text { color: #f8fafc; }
                
                .stat-text { color: #172b4d; }
                body.dark-mode .stat-text { color: #f1f5f9; }
                
                .icon-box-primary { width: 48px; height: 48px; background-color: rgba(94, 114, 228, 0.1); }
                body.dark-mode .icon-box-primary { background-color: rgba(129, 140, 248, 0.15); }

                /* Metadata Grid */
                .metadata-box { background-color: #fcfdfe; }
                body.dark-mode .metadata-box { background-color: #0f172a; }
                
                .bg-label-box { background-color: #f8f9fe; }
                body.dark-mode .bg-label-box { background-color: #1e293b; }

                .border-right-custom { border-right: 1px dashed #e9ecef; }
                body.dark-mode .border-right-custom { border-right: 1px dashed rgba(255,255,255,0.1); }
                
                .border-bottom-custom { border-bottom: 1px solid #f1f3f9; vertical-align: middle; }
                body.dark-mode .border-bottom-custom { border-bottom: 1px solid rgba(255,255,255,0.05); }

                /* Timeline Table */
                .custom-timeline-table .table-header-cell {
                    padding: 0.8rem 1.5rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 1px; color: #8898aa; background-color: #f8f9fe; border-bottom: 2px solid #e9ecef; border-top: none;
                }
                body.dark-mode .custom-timeline-table .table-header-cell { background-color: #1e293b; border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; }
                
                .timeline-row { transition: background-color 0.2s; }
                .timeline-row:hover { background-color: rgba(94, 114, 228, 0.03); }
                body.dark-mode .timeline-row:hover { background-color: rgba(129, 140, 248, 0.05); }
                .timeline-row td { padding: 1rem 1.5rem; }

                /* Soft Badges */
                .badge-soft-success { background-color: rgba(45, 206, 137, 0.1); color: #2dce89; }
                .badge-soft-warning { background-color: rgba(251, 99, 64, 0.1); color: #fb6340; }
                .badge-soft-danger { background-color: rgba(245, 54, 92, 0.1); color: #f5365c; }
                .badge-soft-info { background-color: rgba(17, 205, 239, 0.1); color: #11cdef; }

                /* Footer Button */
                .btn-close-modal { color: #525f7f; background-color: #ffffff; transition: all 0.2s; }
                body.dark-mode .btn-close-modal { background-color: #1e293b; color: #cbd5e1; }
                .btn-close-modal:hover { transform: translateY(-1px); box-shadow: 0 4px 11px rgba(0,0,0,.1) !important; color: #32325d; }
                body.dark-mode .btn-close-modal:hover { color: #fff; box-shadow: 0 4px 11px rgba(0,0,0,.3) !important; }
            `}</style>
        </Modal>
    );
};

export default InventoryDetailModal;

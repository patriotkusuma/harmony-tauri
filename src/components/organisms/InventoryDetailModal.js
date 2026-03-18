import React from 'react';
import { 
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Button, Badge, Table, Row, Col
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
        <Modal isOpen={isOpen} toggle={toggle} size="lg" centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <ModalHeader toggle={toggle} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-history fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Riwayat Pergerakan Stok</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>{item?.nama}</small>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="py-0 px-0">
                {/* Info Metadata */}
                <div className="bg-light p-4 border-bottom">
                    <Row>
                        <Col md="3" className="text-center border-right">
                            <h6 className="text-uppercase text-muted ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Stok Saat Ini</h6>
                            <h2 className="mb-0 font-weight-bold text-primary">{item?.current_stock}</h2>
                            <small className="text-muted font-weight-bold text-uppercase">{item?.unit_name}</small>
                        </Col>
                        <Col md="3" className="text-center border-right">
                            <h6 className="text-uppercase text-muted ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Stok Awal</h6>
                            <h2 className="mb-0 font-weight-bold text-dark">{item?.initial_stock}</h2>
                        </Col>
                        <Col md="3" className="text-center border-right">
                            <h6 className="text-uppercase text-muted ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Harga Beli</h6>
                            <h2 className="mb-0 font-weight-bold text-success" style={{ fontSize: '1.2rem' }}>
                                Rp {item?.cost_per_unit?.toLocaleString('id-ID')}
                            </h2>
                        </Col>
                        <Col md="3" className="text-center">
                            <h6 className="text-uppercase text-muted ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Tgl Perolehan</h6>
                            <h2 className="mb-0 font-weight-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                {item?.purchase_date ? moment(item.purchase_date).format('DD/MM/YYYY') : '-'}
                            </h2>
                        </Col>
                    </Row>
                </div>

                <div className="p-3 bg-secondary-soft">
                    <h6 className="text-uppercase text-info font-weight-bold mb-0" style={{ fontSize: '0.7rem' }}>
                        <i className="fas fa-stream mr-2" /> Timeline Pergerakan Stok
                    </h6>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Table className="align-items-center table-flush mb-0" hover>
                        <thead className="thead-light sticky-top">
                            <tr>
                                <th className="text-xs font-weight-bold py-3">Tanggal</th>
                                <th className="text-xs font-weight-bold py-3">Tipe</th>
                                <th className="text-xs font-weight-bold py-3 text-center">Jumlah</th>
                                <th className="text-xs font-weight-bold py-3">Sumber / Ket</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5"><i className="fas fa-spinner fa-spin mr-2" />Memuat riwayat...</td></tr>
                            ) : (!movements || movements.length === 0) ? (
                                <tr><td colSpan="4" className="text-center py-5 text-muted">Belum ada riwayat pergerakan untuk item ini.</td></tr>
                            ) : (
                                Array.isArray(movements) && movements.map((m) => (
                                    <tr key={m.id}>
                                        <td className="font-weight-bold py-3 h6">
                                            {moment(m.movement_date).format('DD MMM YYYY')}
                                        </td>
                                        <td>
                                            <Badge 
                                                color={
                                                    m.movement_type === 'in' ? 'success' : 
                                                    m.movement_type === 'out' ? 'danger' : 'info'
                                                } 
                                                pill
                                                className="font-weight-bold px-2 py-1"
                                                style={{ fontSize: '0.65rem' }}
                                            >
                                                {m.movement_type === 'in' ? 'MASUK' : m.movement_type === 'out' ? 'KELUAR' : 'KOREKSI'}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <span className={`h5 mb-0 font-weight-900 ${m.movement_type === 'out' ? 'text-danger' : m.movement_type === 'in' ? 'text-success' : 'text-info'}`}>
                                                {m.movement_type === 'out' ? '-' : m.movement_type === 'in' ? '+' : ''}{m.quantity}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-xs font-weight-bold text-dark text-uppercase">{m.reference_type}</span>
                                                <small className="text-muted italic">{m.description}</small>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
            <ModalFooter className="bg-light border-0 py-3">
                <Button color="secondary" onClick={toggle} className="px-5 font-weight-bold rounded-pill shadow-none border-0">
                    Tutup
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default InventoryDetailModal;

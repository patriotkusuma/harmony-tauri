import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Badge } from 'reactstrap';

const TYPE_META = {
  basket: { color: "primary", icon: "fas fa-shopping-basket", label: "Basket" },
  machine: { color: "warning", icon: "fas fa-cog", label: "Mesin" },
  operator: { color: "info", icon: "fas fa-user-cog", label: "Operator" },
};

const STATUS_META = {
  ASSIGNED: { color: "success", label: "Assigned" },
  AVAILABLE: { color: "secondary", label: "Available" },
};

const RFIDCardDetailModal = ({ isOpen, toggle, card }) => {
    if (!card) return null;
    const type = TYPE_META[card.type] || { color: "secondary", icon: "fas fa-tag", label: card.type || "-" };
    const status = STATUS_META[card.status] || { color: "secondary", label: card.status };

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <ModalHeader toggle={toggle} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle fa-2x mr-3 text-white-50" />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">Informasi Detail Kartu</h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Manajemen Inventori RFID</small>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="py-4">
                <div className="text-center mb-4">
                    <div className="mx-auto mb-3 shadow-premium d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #11cdef 0%, #1171ef 100%)', border: '5px solid #fff' }}>
                        <i className={`${type.icon} fa-3x text-white`} />
                    </div>
                    <h2 className="text-dark font-weight-bold font-monospace ls-2 m-0 mt-2">{card.code}</h2>
                    <Badge color={status.color} className="rounded-pill px-4 py-2 mt-2 shadow-sm font-weight-bold border">{status.label}</Badge>
                </div>

                <div className="bg-secondary p-4 rounded-lg shadow-inner">
                    <Row className="mb-3">
                        <Col xs="5" className="text-dark font-weight-bold opacity-6">ID REGISTRASI</Col>
                        <Col xs="7" className="text-dark font-weight-900">#{card.id}</Col>
                    </Row>
                    <hr className="my-2 border-white opacity-2" />
                    <Row className="mb-3">
                        <Col xs="5" className="text-dark font-weight-bold opacity-6">TIPE KARTU</Col>
                        <Col xs="7">
                            <Badge color={type.color} pill className="font-weight-bold px-3">{type.label}</Badge>
                        </Col>
                    </Row>
                    <hr className="my-2 border-white opacity-2" />
                    <Row className="mb-3">
                        <Col xs="5" className="text-dark font-weight-bold opacity-6">STATUS</Col>
                        <Col xs="7" className="text-dark font-weight-bold">{status.label}</Col>
                    </Row>
                    
                    {card.assigned_order && (
                        <>
                            <hr className="my-2 border-white opacity-2" />
                            <Row>
                                <Col xs="5" className="text-dark font-weight-bold opacity-6">DATA PESANAN</Col>
                                <Col xs="7">
                                    <div className="font-weight-900 text-primary h5 mb-0">{card.assigned_order.order_code}</div>
                                    <div className="text-dark text-sm mt-1 font-weight-bold">{card.assigned_order.customer_name}</div>
                                    <Badge color="info" className="mt-1 shadow-none border">{card.assigned_order.order_status}</Badge>
                                </Col>
                            </Row>
                        </>
                    )}

                    {card.assigned_machine && (
                        <>
                            <hr className="my-2 border-white opacity-2" />
                            <Row>
                                <Col xs="5" className="text-dark font-weight-bold opacity-6">DATA MESIN</Col>
                                <Col xs="7">
                                    <div className="font-weight-900 text-warning h5 mb-0">{card.assigned_machine.machine_name}</div>
                                    <Badge color="warning" className="mt-1 font-weight-bold border shadow-none">{card.assigned_machine.machine_type}</Badge>
                                </Col>
                            </Row>
                        </>
                    )}

                    {card.assigned_user && (
                        <>
                            <hr className="my-2 border-white opacity-2" />
                            <Row>
                                <Col xs="5" className="text-dark font-weight-bold opacity-6">OPERATOR</Col>
                                <Col xs="7">
                                    <div className="font-weight-900 text-info h5 mb-0">{card.assigned_user.user_name}</div>
                                    <div className="text-dark text-sm mt-1 font-weight-bold">Role: {card.assigned_user.user_role}</div>
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </ModalBody>
            <ModalFooter className="border-0 bg-light p-3">
                <Button color="secondary" block onClick={toggle} className="font-weight-bold rounded-lg shadow-none">
                    Tutup Informasi
                </Button>
            </ModalFooter>
            <style>{`
                .font-monospace { font-family: 'Courier New', Courier, monospace; }
                .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
            `}</style>
        </Modal>
    );
};

export default RFIDCardDetailModal;

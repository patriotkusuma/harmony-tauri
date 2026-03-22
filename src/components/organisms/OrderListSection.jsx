import React from 'react';
import { Card, CardHeader, CardBody, Badge, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';

const OrderListSection = ({ 
    activeMode, 
    setActiveMode, 
    searchQuery, 
    setSearchQuery, 
    orders, 
    linkedOrders, 
    selectedOrder, 
    setSelectedOrder, 
    loading, 
    fetchUnlinkedOrders,
    handleDetach,
    scannedRFID,
    clearUID
}) => {

    const filteredLinkedOrders = linkedOrders.filter(
        (o) =>
          (o.order_code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.rfid_code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card className="shadow-premium border-0 glass-card">
            <CardHeader className="bg-transparent border-0 py-4">
                <Row className="align-items-center">
                    <Col xs="8">
                        <h3 className="mb-0 text-dark font-weight-bold">
                            <i className="fas fa-id-badge me-2 text-primary" />
                            Daftar Pesanan
                        </h3>
                    </Col>
                    <Col className="text-end" xs="4">
                        <div className="btn-group btn-group-sm shadow-sm rounded-lg overflow-hidden">
                            <Button
                                color={activeMode === "attach" ? "primary" : "secondary"}
                                onClick={() => { setActiveMode("attach"); setSearchQuery(""); clearUID(); }}
                                className="px-4"
                            >
                                <i className="fas fa-link me-1" /> Attach
                            </Button>
                            <Button
                                color={activeMode === "detach" ? "warning" : "secondary"}
                                onClick={() => { setActiveMode("detach"); setSearchQuery(""); clearUID(); }}
                                className="px-4"
                            >
                                <i className="fas fa-unlink me-1" /> Detach
                            </Button>
                        </div>
                    </Col>
                </Row>
            </CardHeader>

            <CardBody className="pt-0">
                <FormGroup className="px-3 py-2 bg-secondary-soft rounded-lg mb-4">
                    <Label className="text-xs text-uppercase font-weight-bold text-muted mb-2">
                        {activeMode === "attach" ? "🔍 Cari Order Aktif" : "🔍 Cari Order Terhubung"}
                    </Label>
                    <div className="input-group input-group-merge shadow-none border-0">
                        <Input
                            placeholder="Ketik nama atau kode..."
                            className="form-control-alternative border-0 shadow-sm"
                            style={{ borderRadius: '10px 0 0 10px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" && activeMode === "attach" && fetchUnlinkedOrders(searchQuery)}
                        />
                        {activeMode === "attach" && (
                            <div className="input-group-append">
                                <Button color="primary" className="shadow-sm" style={{ borderRadius: '0 10px 10px 0' }} onClick={() => fetchUnlinkedOrders(searchQuery)}>
                                    <i className="fas fa-search" />
                                </Button>
                            </div>
                        )}
                    </div>
                </FormGroup>

                <div className="pe-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="text-center py-5 opacity-5">
                            <i className="fas fa-circle-notch fa-spin fa-2x text-primary mb-2" />
                            <p className="mb-0">Sinkronisasi data...</p>
                        </div>
                    ) : activeMode === "attach" ? (
                        orders.length === 0 ? (
                            <div className="text-center py-5 opacity-5 italic text-muted">Data tidak ditemukan</div>
                        ) : (
                            orders.map((order) => {
                                const isSelected = selectedOrder?.id === order.id;
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`transition-all mb-3 p-3 rounded-lg border cursor-pointer ${isSelected ? 'border-primary bg-primary-soft-10 shadow-premium' : 'bg-white opacity-8'}`}
                                        style={{ borderLeftWidth: isSelected ? '6px' : '1px' }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="font-weight-bold text-primary me-2 h5 mb-0">{order.kode_pesan}</span>
                                                    {isSelected && <Badge color="primary" pill className="text-xs">Aktif</Badge>}
                                                </div>
                                                <h5 className="mb-1 text-dark font-weight-bold">{order.customer?.nama}</h5>
                                                <small className="text-muted"><i className="far fa-clock me-1" />{moment(order.created_at).format("DD MMM, HH:mm")}</small>
                                            </div>
                                            <Button color={isSelected ? "primary" : "secondary"} size="sm" className="rounded-circle btn-icon-only shadow-sm">
                                                <i className={isSelected ? "fas fa-check" : "fas fa-plus"} />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    ) : (
                        filteredLinkedOrders.length === 0 ? (
                            <div className="text-center py-5 opacity-5 italic text-muted">Tidak ada rfid terhubung</div>
                        ) : (
                            filteredLinkedOrders.map((order) => {
                                const isHighlighted = scannedRFID && order.rfid_code === scannedRFID;
                                return (
                                    <div
                                        key={order.order_id}
                                        className={`transition-all mb-3 p-3 rounded-lg border ${isHighlighted ? 'border-warning bg-warning-soft-10 shadow-premium pulse-warning' : 'bg-white opacity-8'}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="font-weight-bold h5 mb-1 d-block text-dark">{order.order_code}</span>
                                                <h5 className="mb-2 text-primary">{order.customer_name}</h5>
                                                <Badge color={isHighlighted ? "warning" : "success"} pill className="px-3">
                                                    <i className="fas fa-tag me-2" />{order.rfid_code}
                                                </Badge>
                                            </div>
                                            <Button color="danger" outline size="sm" onClick={() => handleDetach(order)} className="rounded-pill shadow-sm">
                                                <i className="fas fa-unlink me-1" /> Detach
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>
            </CardBody>
            <style>{`
                .bg-primary-soft-10 { background: rgba(94, 114, 228, 0.08); }
                .bg-warning-soft-10 { background: rgba(251, 99, 64, 0.08); }
                .bg-secondary-soft { background: rgba(0,0,0,0.02); }
                .pulse-warning { animation: pulse-warn 2s infinite; }
                @keyframes pulse-warn {
                    0% { box-shadow: 0 0 0 0 rgba(251, 99, 64, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(251, 99, 64, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(251, 99, 64, 0); }
                }
            `}</style>
        </Card>
    );
};

export default OrderListSection;

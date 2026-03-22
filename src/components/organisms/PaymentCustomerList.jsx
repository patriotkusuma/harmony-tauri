import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Input, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import CustomerAvatar from 'components/atoms/CustomerAvatar';

const PaymentCustomerList = ({ 
    customers, 
    totalUnpaid, 
    onSearch, 
    onSelect, 
    selectedId,
    loading,
    viewMode,
    calculateCustomerBill
}) => {
    return (
        <Card className={`shadow-premium border-0 glass-card overflow-hidden ${viewMode === 'modern' ? 'h-100' : ''}`}>
            <CardHeader className="bg-white border-0 py-4">
                <Row className="align-items-center">
                    <Col md="7">
                        <h4 className="text-uppercase text-muted ls-1 mb-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                            Ringkasan Tagihan
                        </h4>
                        <div className="d-flex align-items-center">
                            <span className="h2 font-weight-900 mb-0 text-danger me-2">
                                <RupiahFormater value={totalUnpaid} />
                            </span>
                            <Badge color="danger" pill className="px-2 py-1 font-weight-bold shadow-sm">
                                <i className="fas fa-exclamation-circle me-1" /> Belum Bayar
                            </Badge>
                        </div>
                    </Col>
                    <Col md="5" className="mt-3 mt-md-0">
                        <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-light">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-transparent border-0"><i className="fas fa-search text-muted" /></span>
                            </div>
                            <Input
                                placeholder="Cari Nama Customer..."
                                className="border-0 bg-transparent font-weight-bold text-dark"
                                onChange={(e) => onSearch(e.target.value)}
                                style={{ height: '38px' }}
                            />
                        </div>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className="bg-secondary-soft p-4 slim-scroll" style={{ maxHeight: viewMode === 'modern' ? '65vh' : '75vh', overflowY: 'auto' }}>
                {loading ? (
                    <div className="text-center py-7">
                        <i className="fas fa-circle-notch fa-spin fa-2x text-primary mb-3" />
                        <p className="text-dark font-weight-bold">Memperbarui Tagihan...</p>
                    </div>
                ) : !customers || customers.length === 0 ? (
                    <div className="text-center py-7 opacity-7">
                        <i className="fas fa-check-circle fa-4x text-success mb-3" />
                        <h3 className="text-dark font-weight-bold">Semua Lunas!</h3>
                        <p className="text-muted italic">Tidak ada tagihan tertunda saat ini.</p>
                    </div>
                ) : (
                    <Row className="gy-3">
                        {customers.map((customer) => {
                            const unpaidAmount = Math.abs(calculateCustomerBill(customer));
                            const isSelected = selectedId === customer.id;
                            return (
                                <Col lg={viewMode === 'modern' ? "4" : "12"} md={viewMode === 'modern' ? "6" : "12"} key={customer.id} className="mb-3">
                                    <div 
                                        onClick={() => onSelect(customer)}
                                        className={`transition-all p-3 rounded-xl d-flex align-items-center cursor-pointer border-2 ${isSelected ? 'bg-primary shadow-lg scale-102 border-primary' : 'bg-white shadow-sm hover-elevate border-transparent'}`}
                                        style={{ 
                                            position: 'relative',
                                            border: '2px solid transparent',
                                            boxShadow: isSelected ? '0 10px 25px rgba(94, 114, 228, 0.3)' : '0 4px 6px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <div className={`avatar avatar-md rounded-circle shadow-inner me-3 d-flex align-items-center justify-content-center bg-primary text-white`} style={{ minWidth: '45px', height: '45px', overflow: 'hidden' }}>
                                            <CustomerAvatar customer={customer} />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className={`mb-0 text-truncate font-weight-900 ${isSelected ? 'text-white' : 'text-dark'}`} style={{ color: isSelected ? '#fff' : '#000' }}>
                                                {customer.nama}
                                            </h5>
                                            {customer.keterangan && (
                                                <div className={`text-xs text-truncate ${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ opacity: isSelected ? 0.7 : 0.8 }}>
                                                    {customer.keterangan}
                                                </div>
                                            )}
                                            <div className="d-flex align-items-center mt-1">
                                                <span className={`font-weight-bold text-sm ${isSelected ? 'text-white-50' : 'text-danger'}`}>
                                                    <RupiahFormater value={unpaidAmount} />
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="ms-2">
                                                <i className="fas fa-check-circle text-white fa-lg" />
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </CardBody>
            <style>{`
                .bg-secondary-soft { background: #f8f9fe; }
                .rounded-xl { border-radius: 12px; }
                .scale-102 { transform: scale(1.02); }
                .border-transparent { border-color: rgba(0,0,0,0); }
                .border-2 { border-width: 2px !important; }
            `}</style>
        </Card>
    );
};

export default PaymentCustomerList;

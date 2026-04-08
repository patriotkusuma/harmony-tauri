import React from "react";
import { Row, Col, Button, Container } from "reactstrap";

const BillingHeader = ({ totalUnpaidCount, selectedCount, onJoin, loading }) => {
    return (
        <div className="header bg-billing-premium pb-6 pt-5 pt-md-6 px-4 shadow-lg position-relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="abstract-circle-1" />
            <div className="abstract-circle-2" />
            
            <Container fluid className="position-relative">
                <div className="header-body">
                    <Row className="align-items-center py-4">
                        <Col lg="7" xs="12">
                            <h6 className="text-uppercase text-white ls-1 mb-1 opacity-7">Financial Control</h6>
                            <h1 className="display-2 text-white font-weight-bold mb-0">Manajemen Penagihan</h1>
                            <p className="text-white opacity-8 h4 mt-2 font-weight-light">
                                <span className="text-warning font-weight-bold">{totalUnpaidCount} Tagihan</span> aktif ditemukan. 
                                Gunakan fitur grup untuk menagih nota kolektif pelanggan.
                            </p>
                        </Col>
                        <Col lg="5" xs="12" className="text-end mt-4 mt-lg-0">
                            <div className="d-flex flex-column align-items-end">
                                <Button 
                                    className={`px-5 py-3 rounded-pill shadow-premium transform-hover transition-all ${selectedCount >= 2 ? 'pulse-button' : 'opacity-6'}`}
                                    color="white" 
                                    disabled={selectedCount < 2 || loading}
                                    onClick={onJoin}
                                >
                                    <i className="fas fa-layer-group text-primary me-2" />
                                    <span className="text-primary font-weight-bold">
                                        Gabungkan {selectedCount > 0 ? `(${selectedCount})` : ''}
                                    </span>
                                </Button>
                                {selectedCount > 0 && (
                                    <small className="text-white mt-2 animate-fade-in">
                                        <i className="fas fa-info-circle me-1" /> 
                                        {selectedCount} item terpilih untuk penggabungan nota.
                                    </small>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            <style>{`
                .bg-billing-premium {
                    background: linear-gradient(135deg, #11cdef 0%, #1171ef 100%) !important;
                    position: relative;
                }
                .display-2 { font-size: 3rem; letter-spacing: -1px; }
                .shadow-premium { 
                    box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important; 
                }
                .abstract-circle-1 {
                    position: absolute; width: 300px; height: 300px;
                    background: rgba(255, 255, 255, 0.1); border-radius: 50%;
                    top: -100px; right: -50px;
                }
                .abstract-circle-2 {
                    position: absolute; width: 150px; height: 150px;
                    background: rgba(255, 255, 255, 0.05); border-radius: 50%;
                    bottom: -20px; left: 10%;
                }
                .transform-hover:hover { transform: translateY(-3px); }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .pulse-button {
                    animation: pulse-border 2s infinite;
                }
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 768px) {
                    .display-2 { font-size: 2.2rem; }
                }
            `}</style>
        </div>
    );
};

export default BillingHeader;

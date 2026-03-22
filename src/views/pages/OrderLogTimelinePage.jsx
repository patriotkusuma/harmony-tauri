import React from "react";
import { Container, Row, Col, Card } from "reactstrap";

// Hooks
import { useMachineLog } from "hooks/useMachineLog";

// Organisms
import MachineLogHeader from "components/organisms/MachineLogHeader";
import MachineLogTimeline from "components/organisms/MachineLogTimeline";

const OrderLogTimelinePage = () => {
    const { date, setDate, logs, loading, fetchTimeline, searchTerm, setSearchTerm } = useMachineLog();

    return (
        <>
            {/* Header Background */}
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8 px-4 shadow-lg">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="6" xs="12">
                                <h1 className="display-2 text-white font-weight-bold">Log Produksi</h1>
                                <p className="text-white opacity-8 h4 mt-2">
                                    Pantau setiap detak aktivitas mesin dan produktivitas outlet secara transparan.
                                </p>
                            </Col>
                            <Col lg="6" xs="12" className="text-end d-none d-lg-block">
                                <i className="fas fa-history fa-4x text-white opacity-2" />
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 pb-5" fluid>
                <Row>
                    <Col>
                        <Card className="shadow-premium border-0 glass-card overflow-hidden" style={{ borderRadius: '15px' }}>
                            <MachineLogHeader 
                                date={date} 
                                setDate={setDate}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onRefresh={() => fetchTimeline(date)} 
                                loading={loading} 
                            />
                            <MachineLogTimeline 
                                logs={logs} 
                                loading={loading} 
                            />
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .display-2 { font-size: 2.8rem; }
                .bg-gradient-info { 
                    background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
                }
                @media (max-width: 768px) {
                    .display-2 { font-size: 2rem; }
                }
            `}</style>
        </>
    );
};

export default OrderLogTimelinePage;

import React from "react";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import RupiahFormater from "utils/RupiahFormater";

const BillingStats = ({ totalOutstanding, unpaidCount, partialCount, activeGroups }) => {
    const stats = [
        {
            title: "Total Piutang",
            value: totalOutstanding,
            icon: "fas fa-hand-holding-usd",
            color: "bg-gradient-danger",
            isMoney: true
        },
        {
            title: "Belum Bayar",
            value: unpaidCount,
            icon: "fas fa-clock",
            color: "bg-gradient-warning",
            suffix: " Nota"
        },
        {
            title: "Bayar Sebagian",
            value: partialCount,
            icon: "fas fa-file-invoice-dollar",
            color: "bg-gradient-info",
            suffix: " Nota"
        },
        {
            title: "Grup Tagihan",
            value: activeGroups,
            icon: "fas fa-layer-group",
            color: "bg-gradient-primary",
            suffix: " Grup"
        }
    ];

    return (
        <Row>
            {stats.map((stat, idx) => (
                <Col lg="3" md="6" key={idx} className="mb-4">
                    <Card className="card-stats shadow-premium border-0 glass-card-stats transform-hover transition-all">
                        <CardBody className="p-3">
                            <Row>
                                <div className="col">
                                    <h5 className="text-uppercase text-muted mb-0 font-weight-bold" style={{fontSize: '0.75rem'}}>
                                        {stat.title}
                                    </h5>
                                    <span className="h3 font-weight-bold mb-0 text-dark">
                                        {stat.isMoney ? <RupiahFormater value={stat.value} /> : `${stat.value}${stat.suffix || ''}`}
                                    </span>
                                </div>
                                <Col className="col-auto">
                                    <div className={`icon icon-shape ${stat.color} text-white rounded-circle shadow`}>
                                        <i className={stat.icon} />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            ))}
            <style>{`
                .glass-card-stats {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(5px);
                }
                .card-stats .icon { width: 3rem; height: 3rem; }
                .icon-shape {
                    display: inline-flex;
                    padding: 12px;
                    text-align: center;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                }
                .bg-gradient-danger { background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important; }
                .bg-gradient-warning { background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important; }
                .bg-gradient-info { background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; }
                .bg-gradient-primary { background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important; }
            `}</style>
        </Row>
    );
};

export default BillingStats;

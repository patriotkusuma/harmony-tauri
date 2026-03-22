import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const PaymentStats = ({ transferTotal, cashTotal }) => {
    const stats = [
        {
            title: "Transfer Minggu Ini",
            value: transferTotal,
            icon: "fas fa-exchange-alt",
            color: "bg-default",
            textColor: "text-white"
        },
        {
            title: "Cash Minggu Ini",
            value: cashTotal,
            icon: "fas fa-wallet",
            color: "bg-warning",
            textColor: "text-white"
        }
    ];

    return (
        <Row className="mb-4">
            {stats.map((stat, i) => (
                <Col lg="6" xl="3" key={i} className="mb-4">
                    <Card className="shadow-premium border-0 glass-card transition-all hover-translate-up">
                        <CardBody className="py-4">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="text-uppercase text-muted ls-1 mb-1 font-weight-bold" style={{ fontSize: '0.75rem' }}>
                                        {stat.title}
                                    </h6>
                                    <span className="h1 font-weight-900 mb-0 d-block text-dark" style={{ color: '#000' }}>
                                        <RupiahFormater value={stat.value} />
                                    </span>
                                </Col>
                                <Col className="col-auto">
                                    <div className={`icon icon-shape ${stat.color} ${stat.textColor} rounded-circle shadow-lg`} style={{ width: '48px', height: '48px' }}>
                                        <i className={stat.icon} />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default PaymentStats;

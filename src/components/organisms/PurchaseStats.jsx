import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const PurchaseStats = ({ data }) => {
    // Quick summary logic
    const items = data?.data || [];
    const totalExpenditure = items.reduce((acc, curr) => acc + curr.total_amount, 0);
    const persediaanCount = items.filter(i => i.type === 'Persediaan').length;
    const invCount = items.filter(i => i.type === 'Investasi').length;

    const stats = [
        { title: 'Total Pengeluaran', value: totalExpenditure, icon: 'fa-wallet', color: 'bg-primary' },
        { title: 'Item Persediaan', value: persediaanCount, icon: 'fa-box', color: 'bg-success', isCount: true },
        { title: 'Alokasi Investasi', value: invCount, icon: 'fa-chart-line', color: 'bg-warning', isCount: true },
        { title: 'Record Transaksi', value: items.length, icon: 'fa-clipboard-list', color: 'bg-info', isCount: true },
    ];

    return (
        <Row className="mb-4">
            {stats.map((stat, i) => (
                <Col key={i} lg="3" md="6">
                    <Card className="card-stats mb-4 mb-xl-0 border-0 shadow-premium rounded-xl">
                        <CardBody>
                            <Row>
                                <div className="col">
                                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0 font-weight-bold" style={{ fontSize: '0.6rem' }}>
                                        {stat.title}
                                    </CardTitle>
                                    <span className="h3 font-weight-900 mb-0">
                                        {stat.isCount ? stat.value : <RupiahFormater value={stat.value} />}
                                    </span>
                                </div>
                                <Col className="col-auto">
                                    <div className={`icon icon-shape ${stat.color} text-white rounded-circle shadow`}>
                                        <i className={`fas ${stat.icon}`} />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            ))}
            <style>{`
                .rounded-xl { border-radius: 1.25rem !important; }
                .font-weight-900 { font-weight: 900 !important; }
            `}</style>
        </Row>
    );
};

export default PurchaseStats;

import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

const InventoryStats = ({ data }) => {
    const items = data?.data || [];
    const menipisCount = items.filter(i => i.current_stock > 0 && i.current_stock < i.initial_stock * 0.3).length;
    const habisCount = items.filter(i => i.current_stock <= 0).length;

    const stats = [
        { title: 'Total Item', value: items.length, icon: 'fa-boxes', color: 'bg-primary' },
        { title: 'Stok Menipis', value: menipisCount, icon: 'fa-exclamation-triangle', color: 'bg-warning' },
        { title: 'Stok Habis', value: habisCount, icon: 'fa-times-circle', color: 'bg-danger' },
        { title: 'Asset Barang', value: items.length, icon: 'fa-warehouse', color: 'bg-success' },
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
                                    <span className="h3 font-weight-900 mb-0">{stat.value}</span>
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
        </Row>
    );
};

export default InventoryStats;

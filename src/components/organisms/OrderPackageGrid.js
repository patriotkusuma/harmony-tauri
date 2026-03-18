import React from 'react';
import { Row, Col, Badge } from 'reactstrap';
import PackageCard from 'components/Card/PackageCard';

const OrderPackageGrid = ({ categories, cartItems, onAddCart }) => {
    if (!categories) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-circle-notch fa-spin fa-2x text-primary mb-3"></i>
                <p className="text-muted font-weight-bold">Memuat daftar paket...</p>
            </div>
        );
    }

    return (
        <div className="order-package-grid slim-scroll pr-2" style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
            {categories.map((cat) => (
                <div key={cat.id} className="mb-5">
                    <div className="d-flex align-items-center mb-3">
                        <div className="category-line flex-grow-1 bg-lighter" style={{ height: '2px' }}></div>
                        <div className="mx-3 d-flex flex-column align-items-center">
                            <Badge color="primary" className="px-4 py-2 rounded-pill shadow-sm text-uppercase ls-1 mb-1" style={{ fontSize: '0.85rem' }}>
                                {cat.nama}
                            </Badge>
                            <span className="text-muted small font-weight-900">{cat.durasi} {cat.tipe_durasi}</span>
                        </div>
                        <div className="category-line flex-grow-1 bg-lighter" style={{ height: '2px' }}></div>
                    </div>
                    
                    <Row className="gx-3 gy-3">
                        {cat.jenis_cucis && cat.jenis_cucis
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((paket) => (
                                <Col lg="4" md="6" key={paket.id} className="mb-3">
                                    <PackageCard
                                        paket={paket}
                                        isAddedToCart={cartItems && cartItems[paket.id] !== undefined}
                                        onAddCart={onAddCart}
                                    />
                                </Col>
                            ))}
                    </Row>
                </div>
            ))}
            <style>{`
                .order-package-grid::-webkit-scrollbar { width: 4px; }
                .order-package-grid::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
                .category-line { opacity: 0.5; }
            `}</style>
        </div>
    );
};

export default OrderPackageGrid;

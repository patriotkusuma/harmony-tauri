import React from 'react';
import { Row, Col, Button, Container } from 'reactstrap';

const BlogHeader = ({ onAdd, onAiGenerate, isListView }) => {
    return (
        <div className="header-body">
            <Row className="align-items-center py-4 px-3">
                <Col lg="6" xs="12">
                    <h1 className="display-2 text-white font-weight-bold">Blog & Konten</h1>
                    <p className="text-white opacity-8 h4 mt-2">Dapatkan pelanggan lebih banyak lewat konten artikel menarik & SEO optimized.</p>
                </Col>
                <Col lg="6" xs="12" className="text-end">
                    {isListView && (
                        <div className="d-flex justify-content-end align-items-center" style={{ gap: '10px' }}>
                            <Button 
                                color="neutral" 
                                size="sm" 
                                className="shadow-premium px-4 font-weight-bold text-success"
                                onClick={onAiGenerate}
                            >
                                <i className="fas fa-robot me-2" />
                                Generate AI
                            </Button>
                            <Button 
                                color="neutral" 
                                size="sm" 
                                className="shadow-premium px-4 font-weight-bold text-primary"
                                onClick={onAdd}
                            >
                                <i className="fas fa-plus me-2" />
                                Tulis Artikel
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
            <style>{`
                .display-2 { font-size: 2.8rem; }
                @media (max-width: 768px) {
                   .display-2 { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default BlogHeader;

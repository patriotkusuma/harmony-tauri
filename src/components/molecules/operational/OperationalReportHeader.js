import React from "react";
import { Col, Row, Button, Input } from "reactstrap";

const OperationalReportHeader = ({ filters, setFilters, onExport }) => {
    return (
        <Row className="align-items-center mb-4">
            <Col lg="6">
                <h1 className="display-2 text-white font-weight-bold mb-1">
                    Laporan Operasional
                </h1>
                <p className="text-white-50 lead mb-0">
                    Monitor detak jantung bisnis Anda secara riil dan transparan.
                </p>
            </Col>
            <Col lg="6" className="text-right mt-3 mt-lg-0">
                <div className="d-flex justify-content-lg-end align-items-center flex-wrap" style={{ gap: '15px' }}>
                    <div className="filter-group bg-white-10 p-2 rounded-xl backdrop-blur d-flex align-items-center">
                        <i className="far fa-calendar-alt text-white-50 mr-2 ml-2" />
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                            className="bg-transparent border-0 text-white font-weight-bold text-sm flat-date-input"
                        />
                        <span className="text-white-50 mx-2">s/d</span>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                            className="bg-transparent border-0 text-white font-weight-bold text-sm flat-date-input"
                        />
                    </div>
                    <Button 
                        color="secondary" 
                        size="sm" 
                        className="rounded-pill shadow-lg px-4 font-weight-bold uppercase ls-1"
                        onClick={onExport}
                    >
                        <i className="fas fa-file-export mr-2" />
                        Export
                    </Button>
                </div>
            </Col>
            <style>{`
                .bg-white-10 { background: rgba(255,255,255,0.1); }
                .backdrop-blur { backdrop-filter: blur(10px); }
                .rounded-xl { border-radius: 12px; }
                .flat-date-input { width: 130px; }
            `}</style>
        </Row>
    );
};

export default OperationalReportHeader;

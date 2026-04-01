import React from "react";
import { Col, Row, Button, Input } from "reactstrap";

const AccountingReportHeader = ({ filters, setFilters, onRefresh, loading }) => {
    return (
        <Row className="align-items-center mb-4">
            <Col lg="5">
                <h2 className="text-white font-weight-900 mb-1" style={{ letterSpacing: '-0.02em', fontSize: '2rem' }}>
                    Laporan Akuntansi
                </h2>
                <p className="text-white opacity-8 lead mb-0" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Laporan keuangan lengkap untuk transparansi bisnis Anda.
                </p>
            </Col>
            <Col lg="7" className="text-lg-end mt-4 mt-lg-0">
                <div className="d-flex justify-content-lg-end align-items-center flex-wrap" style={{ gap: '15px' }}>
                    <div className="filter-group bg-white-10 p-2 rounded-pill backdrop-blur d-flex align-items-center flex-grow-1 flex-md-grow-0 justify-content-center border-light-subtle shadow-sm">
                        <i className="far fa-calendar-alt text-white opacity-6 ms-3 me-2" />
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ startDate: e.target.value })}
                            className="bg-transparent border-0 text-white font-weight-bold flat-date-input shadow-none focus-none"
                            style={{ fontSize: '0.85rem' }}
                        />
                        <span className="text-white opacity-6 mx-2 font-weight-bold" style={{ fontSize: '0.85rem' }}>s/d</span>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ endDate: e.target.value })}
                            className="bg-transparent border-0 text-white font-weight-bold flat-date-input shadow-none focus-none pe-3"
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>
                    <Button
                        color="info"
                        className="rounded-pill shadow-sm px-4 font-weight-bold uppercase ls-1 btn-refresh-premium m-0 p-2 d-flex align-items-center"
                        onClick={onRefresh}
                        disabled={loading}
                        style={{ fontSize: '0.8rem', padding: '0.65rem 1.5rem', border: 'none' }}
                    >
                        <i className={`fas fa-sync-alt me-2 ${loading ? 'fa-spin' : ''}`} />
                        {loading ? 'Memuat...' : 'Refresh Data'}
                    </Button>
                </div>
            </Col>
            <style>{`
                .bg-white-10 { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); }
                .backdrop-blur { backdrop-filter: blur(10px); }
                .flat-date-input { width: 125px; cursor: pointer; }
                .focus-none:focus { box-shadow: none !important; background-color: rgba(255,255,255,0.05) !important; border-radius: 8px;}
                ::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.7; transition: 0.2s; }
                ::-webkit-calendar-picker-indicator:hover { opacity: 1; }
            `}</style>
        </Row>
    );
};

export default AccountingReportHeader;

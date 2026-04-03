import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Badge, Spinner, UncontrolledTooltip, Button } from 'reactstrap';
import { useAiInsights, useOrderDuration } from '../../hooks/useAiInsights';
import moment from 'moment';
import { toast } from 'react-toastify';

const AiInsightWidget = () => {
    const [period, setPeriod] = useState('monthly');
    const { data, isLoading, error, refetch, refetchWithRefresh } = useAiInsights(period);
    const { data: durationData, isLoading: durationLoading } = useOrderDuration(period);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const stats = data?.stats;
    const insights = data?.ai_insight;

    const handleForceRefresh = async () => {
        setIsRefreshing(true);
        const loadingToast = toast.loading(`AI sedang menganalisis performa ${period}...`);
        try {
            await refetchWithRefresh();
            await refetch();
            toast.update(loadingToast, { render: "Insight diperbarui!", type: "success", isLoading: false, autoClose: 2000 });
        } catch (err) {
            toast.update(loadingToast, { render: "Gagal memperbarui insight", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsRefreshing(false);
        }
    };

    if (isLoading && !isRefreshing) {
        return (
            <Card className="glass-card shadow-premium border-0 mb-4 overflow-hidden">
                <CardBody className="p-5 text-center">
                    <div className="ai-loader mx-auto mb-4" />
                    <h5 className="text-primary font-weight-bold mb-1">Menghubungkan ke Gemini AI ...</h5>
                    <p className="text-muted text-sm">Sedang menganalisis performa bisnis Anda</p>
                </CardBody>
                <style>{`
                    .ai-loader {
                        width: 60px;
                        height: 60px;
                        border: 6px solid rgba(17, 205, 239, 0.1);
                        border-radius: 50%;
                        border-top-color: #11cdef;
                        animation: spin 1s ease-in-out infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="glass-card shadow-premium border-0 mb-4 bg-light-danger">
                <CardBody className="p-4 text-center">
                    <i className="fas fa-exclamation-triangle fa-2x text-danger mb-3" />
                    <h6 className="text-danger font-weight-bold">Gagal memuat AI Insights</h6>
                    <small className="text-muted d-block mb-3">Pastikan API Gemini terintegrasi dengan benar di backend.</small>
                    <button className="btn btn-sm btn-outline-danger px-4" onClick={() => refetch()}>
                        Coba Lagi
                    </button>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="glass-card shadow-premium border-0 mb-4 overflow-hidden dash-ai-card">
            <div className="bg-gradient-info px-4 py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="ai-pulse-container me-3">
                        <i className="fas fa-robot text-white fa-lg" id="aiRobotIcon" />
                        <div className="ai-pulse" />
                    </div>
                    <div>
                        <h5 className="text-white mb-0 font-weight-bold ls-1">AI Business Insights</h5>
                        <div className="d-flex align-items-center">
                            <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Powered by Gemini AI</small>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <Button 
                        color="neutral" 
                        size="sm" 
                        className="rounded-pill px-3 py-1 font-weight-bold text-primary shadow-sm"
                        onClick={handleForceRefresh}
                        disabled={isRefreshing}
                    >
                        <i className={`fas fa-magic me-1 ${isRefreshing ? 'fa-spin' : ''}`} />
                        {isRefreshing ? 'Analyzing...' : 'Re-generate'}
                    </Button>
                    <div className="ms-2 d-flex">
                        <Badge 
                            color={period === 'daily' ? 'neutral' : 'transparent'} 
                            className={`px-3 py-2 cursor-pointer text-white border-white-op ${period === 'daily' ? 'text-primary' : ''}`}
                            onClick={() => setPeriod('daily')}
                        >Daily</Badge>
                        <Badge 
                            color={period === 'monthly' ? 'neutral' : 'transparent'} 
                            className={`px-3 py-2 cursor-pointer text-white border-white-op ${period === 'monthly' ? 'text-primary' : ''}`}
                            onClick={() => setPeriod('monthly')}
                        >Monthly</Badge>
                    </div>
                </div>
            </div>

            <CardBody className="p-4 position-relative">
                {/* 1. Summary Narrative */}
                <div className="mb-4 bg-secondary-soft p-3 rounded-lg border-left-premium border-info">
                   <p className="text-dark font-weight-bold mb-1" style={{ fontSize: '0.95rem' }}>
                       Ringkasan Performa:
                   </p>
                   <p className="text-muted mb-0 italic" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                       "{insights?.summary || 'Data insight tidak tersedia'}"
                   </p>
                </div>

                {/* 2. Mini Stats Table */}
                <Row className="mb-4 g-3">
                    <Col xs="6" md="4" lg="2">
                        <div className="stat-pills">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Omset</span>
                            <div className="h5 font-weight-bold text-dark mb-0">
                                Rp {stats?.total_revenue?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="4" lg="2">
                        <div className="stat-pills">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Profit</span>
                            <div className="h5 font-weight-bold text-success mb-0">
                                Rp {stats?.net_profit?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="4" lg="2">
                        <div className="stat-pills">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Uang Masuk</span>
                            <div className="h5 font-weight-bold text-info mb-0">
                                Rp {stats?.total_payments?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="4" lg="3">
                        <div className="stat-pills border-primary-op">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Saldo Kas</span>
                            <div className="h5 font-weight-bold text-primary mb-0">
                                Rp {stats?.total_account_balance?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="4" lg="1">
                        <div className="stat-pills">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Order</span>
                            <div className="h5 font-weight-bold text-dark mb-0">
                                {stats?.total_orders || 0}
                            </div>
                        </div>
                    </Col>
                    <Col xs="6" md="4" lg="2">
                        <div className="stat-pills">
                            <span className="text-xs text-muted text-uppercase font-weight-900">Baru</span>
                            <div className="h5 font-weight-bold text-info mb-0">
                                {stats?.new_customers || 0}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* 3. Detailed Insights */}
                <div className="insight-grid">
                    <div className="insight-item mb-3">
                        <div className="d-flex align-items-center mb-2">
                             <div className="icon-circle-sm bg-info-soft text-info me-2">
                                <i className="fas fa-chart-line" />
                             </div>
                             <h6 className="mb-0 font-weight-bold text-info">Analisis Performa</h6>
                        </div>
                        <p className="text-sm text-dark-75 mb-0 ps-4 ms-1 border-left-soft">
                             {insights?.performance_analysis || 'AI sedang menganalisis tren transaksi...'}
                        </p>
                    </div>

                    <div className="insight-item">
                        <div className="d-flex align-items-center mb-2">
                             <div className="icon-circle-sm bg-success-soft text-success me-2">
                                <i className="fas fa-lightbulb" />
                             </div>
                             <h6 className="mb-0 font-weight-bold text-success">Saran Strategis AI</h6>
                        </div>
                        <ul className="list-unstyled ps-4 ms-1 border-left-soft-success mb-0">
                            {insights?.strategic_recommendations?.map((rec, idx) => (
                                <li key={idx} className="text-sm text-dark-75 mb-2 d-flex">
                                    <i className="fas fa-check-circle text-success-light me-2 mt-1" />
                                    <span>{rec}</span>
                                </li>
                            )) || <li className="text-sm text-muted">Saran tidak tersedia</li>}
                        </ul>
                        {insights?.daily_report_narrative && (
                            <div className="mt-3 p-3 bg-light-success rounded border-left-success-solid">
                                <h6 className="text-xs font-weight-bold text-success text-uppercase mb-1">Narasi Operasional:</h6>
                                <p className="text-sm text-dark-75 mb-0 italic">
                                    "{insights.daily_report_narrative}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Duration Insight */}
                    {!durationLoading && durationData && (
                        <div className="insight-item mt-4">
                            <div className="d-flex align-items-center mb-2">
                                 <div className="icon-circle-sm bg-warning-soft text-warning me-2">
                                    <i className="fas fa-stopwatch" />
                                 </div>
                                 <h6 className="mb-0 font-weight-bold text-warning">Durasi Pengerjaan Pesanan</h6>
                            </div>
                            <div className="ps-4 ms-1 border-left-soft-warning">
                                <Row className="mt-2 mb-2">
                                    <Col xs="4">
                                        <div className="text-xs text-muted">Rata-rata</div>
                                        <div className="font-weight-bold">{durationData.avg_hours?.toFixed(1) || 0} Jam</div>
                                    </Col>
                                    <Col xs="4">
                                        <div className="text-xs text-muted">Tercepat</div>
                                        <div className="font-weight-bold text-success">{durationData.min_hours?.toFixed(1) || 0} Jam</div>
                                    </Col>
                                    <Col xs="4">
                                        <div className="text-xs text-muted">Terlambat</div>
                                        <div className="font-weight-bold text-danger">{durationData.max_hours?.toFixed(1) || 0} Jam</div>
                                    </Col>
                                </Row>
                                {durationData.status_breakdown && durationData.status_breakdown.length > 0 && (
                                    <div className="mt-2">
                                        <span className="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Berdasarkan Status Bawah:</span>
                                        {durationData.status_breakdown.map((b, i) => (
                                            <Badge key={i} color="light" className="text-dark me-2 mb-1 shadow-sm border">
                                                {b.status.toUpperCase()}: {(b.avg_hours || 0).toFixed(1)} Jam
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardBody>

            <style>{`
                .ai-pulse-container { position: relative; }
                .ai-pulse {
                    position: absolute;
                    top: -5px; right: -5px; bottom: -5px; left: -5px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    animation: pulse-ring 2s infinite;
                    z-index: 10;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 0; }
                    80%, 100% { transform: scale(1.1); opacity: 0; }
                }
                .dash-ai-card {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .dash-ai-card:hover {
                    transform: translateY(-5px);
                }
                .border-white-op { border: 1px solid rgba(255,255,255,0.3); }
                .bg-secondary-soft { background: rgba(0,0,0,0.02); }
                .border-left-premium { border-left: 4px solid; border-radius: 4px 12px 12px 4px; }
                .stat-pills { padding: 10px; border-radius: 12px; border: 1px solid #f8f9fe; background: #fff; text-align: center; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                .icon-circle-sm { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem; }
                .bg-info-soft { background: rgba(17, 205, 239, 0.08); }
                .bg-success-soft { background: rgba(45, 206, 137, 0.08); }
                .bg-warning-soft { background: rgba(251, 99, 64, 0.08); }
                .text-success-light { color: #2dce89; opacity: 0.6; }
                .border-left-soft { border-left: 2px dashed rgba(17, 205, 239, 0.3); }
                .border-left-soft-success { border-left: 2px dashed rgba(45, 206, 137, 0.3); }
                .border-left-soft-warning { border-left: 2px dashed rgba(251, 99, 64, 0.3); }
                .text-dark-75 { color: #525f7f; }
                .bg-light-success { background: rgba(45, 206, 137, 0.05); }
                .border-left-success-solid { border-left: 3px solid #2dce89; }
                .border-primary-op { border: 1px solid rgba(94, 114, 228, 0.2) !important; background: rgba(94, 114, 228, 0.03) !important; }
            `}</style>
        </Card>
    );
};

export default AiInsightWidget;

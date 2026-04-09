import React, { useState } from "react";
import { Table, Badge, Button, Spinner, Pagination, PaginationItem, PaginationLink, Collapse } from "reactstrap";
import RupiahFormater from "utils/RupiahFormater";
import moment from "moment";
import BillingDetailModal from "components/Modals/BillingDetailModal";

const BillingListTable = ({ 
    bills, loading, selectedIds, toggleSelect, onSendNotification, page, totalPages, setPage, onRefresh
}) => {
    const [modalBillId, setModalBillId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState([]);

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => 
            prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
        );
    };

    const openDetail = (billId) => {
        setModalBillId(billId);
        setIsDetailOpen(true);
    };
    const closeDetail = () => setIsDetailOpen(false);
    
    const getStatusBadge = (s) => {
        switch(s) {
            case 'PAID': return <Badge color="success" pill className="px-3 py-1">LUNAS</Badge>;
            case 'PARTIAL': return <Badge color="warning" pill className="px-3 py-1 text-white">DP / CICIL</Badge>;
            case 'UNPAID': return <Badge color="danger" pill className="px-3 py-1">HUTANG</Badge>;
            case 'MERGED': return <Badge color="info" pill className="px-3 py-1">DIGABUNG</Badge>;
            default: return <Badge color="secondary" pill className="px-3 py-1">{s}</Badge>;
        }
    };

    // LOGIC: Group bills by GroupID
    const groupedData = [];
    const processedGroupIds = new Set();

    bills.forEach(bill => {
        if (!bill.group_id) {
            groupedData.push({ type: 'single', data: bill });
        } else if (!processedGroupIds.has(bill.group_id)) {
            processedGroupIds.add(bill.group_id);
            const members = bills.filter(b => b.group_id === bill.group_id);
            const root = members.find(m => m.group_role === 'ROOT') || members[0];
            
            // Calculate aggregate totals for the group header
            const totalRemaining = members.reduce((sum, m) => sum + (m.total_remaining ?? m.total_amount), 0);
            const totalAmount = members.reduce((sum, m) => sum + m.total_amount, 0);
            const totalPaid = members.reduce((sum, m) => sum + (m.total_paid || 0), 0);

            groupedData.push({ 
                type: 'group', 
                groupId: bill.group_id,
                root: root,
                members: members,
                totals: { totalRemaining, totalAmount, totalPaid }
            });
        }
    });

    const renderBillRow = (b, isMember = false, groupId = null) => (
        <tr key={b.uuid} className={`transition-all ${selectedIds.includes(b.uuid) ? 'bg-primary-soft border-left-selected' : ''} ${isMember ? 'bg-light-nested' : ''}`}>
            <td className="text-center px-4">
                {(b.status === 'UNPAID' || b.status === 'PARTIAL') && !isMember && (
                    <div className="custom-control custom-checkbox custom-checkbox-premium">
                        <input 
                            type="checkbox" 
                            className="custom-control-input"
                            id={`check-${b.uuid}`}
                            checked={selectedIds.includes(b.uuid)}
                            onChange={() => toggleSelect(b.uuid)}
                        />
                        <label className="custom-control-label" htmlFor={`check-${b.uuid}`} />
                    </div>
                )}
                {isMember && <i className="fas fa-level-up-alt fa-rotate-90 text-muted opacity-5" />}
            </td>
            <td>
                <div className="d-flex align-items-center">
                    <div className={`bill-icon mr-3 ${isMember ? 'scale-80' : ''}`}>
                        <i className={`fas ${isMember ? 'fa-receipt text-muted' : 'fa-file-invoice-dollar text-primary'} opacity-5`} />
                    </div>
                    <div className="d-flex flex-column">
                        <span className={`${isMember ? 'h6' : 'h5'} font-weight-bold text-dark mb-0`}>#{b.id}</span>
                        <code className="text-muted x-small">{b.uuid.substring(0,8)}</code>
                    </div>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center py-1">
                    {!isMember && (
                        <div className="avatar avatar-sm rounded-circle shadow-sm bg-gradient-info text-white mr-3 d-flex align-items-center justify-content-center">
                            {b.customer.nama.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="d-flex flex-column ml-1">
                        <span className={`${isMember ? 'text-muted' : 'font-weight-bold text-dark'} mb-0`}>{b.customer.nama}</span>
                        <div className="d-flex flex-column mt-1">
                            {!isMember && (
                                <small className="text-muted">
                                    <i className="fab fa-whatsapp text-success mr-1" />
                                    {b.customer.telpon || 'No Phone'}
                                </small>
                            )}
                            {b.customer.keterangan && (
                                <div className={`cust-note-bubble mt-1 ${isMember ? 'scaled-70' : ''}`}>
                                    <i className="fas fa-sticky-note mr-1 text-warning" />
                                    {b.customer.keterangan}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </td>
            <td className="text-center">{getStatusBadge(b.status)}</td>
            <td className="text-end">
                <div className="d-flex flex-column align-items-end">
                    <span className={`${isMember ? 'h5 text-muted' : 'h4 font-weight-bold text-dark'} mb-0`}>
                        <RupiahFormater value={b.total_remaining ?? b.total_amount} />
                    </span>
                    {b.total_paid > 0 && (
                        <small className="text-muted">
                            (Total: <RupiahFormater value={b.total_amount} />)
                        </small>
                    )}
                </div>
            </td>
            <td className="text-center">
                <div className="d-flex flex-column text-muted" style={{fontSize: '0.8rem'}}>
                    <span>{moment(b.created_at).format('DD MMM YYYY')}</span>
                    <span>{moment(b.created_at).format('HH:mm')}</span>
                </div>
            </td>
            <td className="text-end pr-5">
                <Button 
                    color="link" 
                    className="p-1 mx-2 action-btn btn-wa" 
                    onClick={() => onSendNotification(b.id)} 
                    title="Kirim Nagihan WA"
                >
                    <i className="fab fa-whatsapp fa-lg" />
                </Button>
                <Button 
                    color="link" 
                    className="p-1 mx-2 action-btn btn-pay" 
                    title="Detail & Bayar"
                    onClick={() => openDetail(b.id)}
                >
                    <i className="fas fa-arrow-right" />
                </Button>
            </td>
        </tr>
    );

    return (
        <div className="table-responsive">
            <Table className="align-items-center table-flush border-top-0" hover>
                <thead className="thead-light">
                    <tr>
                        <th className="text-center px-4" style={{width: '60px'}}>
                             <i className="fas fa-check-double text-muted" />
                        </th>
                        <th>ID Bill / Grup</th>
                        <th>Pelanggan</th>
                        <th className="text-center">Status</th>
                        <th className="text-end">Sisa Tagihan</th>
                        <th className="text-center">Dibuat Pada</th>
                        <th className="text-end pr-5">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center py-5">
                                <Spinner size="lg" color="primary" />
                                <h4 className="mt-3 text-muted font-weight-light">Mensinkronisasi data keuangan...</h4>
                            </td>
                        </tr>
                    ) : groupedData.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-5">
                                <i className="fas fa-folder-open fa-3x text-lighter mb-3" />
                                <h4 className="text-muted">Tidak ada tagihan yang ditemukan</h4>
                            </td>
                        </tr>
                    ) : groupedData.map((item, idx) => {
                        if (item.type === 'single') {
                            return renderBillRow(item.data);
                        } else {
                            const isExpanded = expandedGroups.includes(item.groupId);
                            return (
                                <React.Fragment key={item.groupId}>
                                    {/* Group Header Row */}
                                    <tr className={`group-header-row ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleGroup(item.groupId)}>
                                        <td className="text-center">
                                            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} text-primary`} />
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="group-badge mr-3">
                                                    <i className="fas fa-layer-group text-primary" />
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="h5 font-weight-bold text-dark mb-0">GRUP TAGIHAN</span>
                                                    <small className="text-primary font-weight-bold text-uppercase" style={{fontSize: '0.6rem'}}>
                                                        {item.members.length} Nota Digabung
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center py-1">
                                                <div className="avatar avatar-sm rounded-circle shadow-sm bg-gradient-primary text-white mr-3 d-flex align-items-center justify-content-center">
                                                    G
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="font-weight-bold text-dark mb-0">{item.root.customer.nama}</span>
                                                    <div className="d-flex flex-column">
                                                        <small className="text-muted">Grup Pelanggan Utama</small>
                                                        {item.root.customer.keterangan && (
                                                            <small className="text-info font-italic mt-1">
                                                                <i className="fas fa-info-circle mr-1" />
                                                                {item.root.customer.keterangan}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Badge color="info" pill className="px-3 py-1 shadow-sm">KOLEKTIF</Badge>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex flex-column align-items-end">
                                                <span className="h4 font-weight-bold text-primary mb-0">
                                                    <RupiahFormater value={item.totals.totalRemaining} />
                                                </span>
                                                <small className="text-muted font-weight-bold">Total Gabungan</small>
                                            </div>
                                        </td>
                                        <td className="text-center text-muted small">
                                            {moment(item.root.created_at).format('DD/MM/YY')}
                                        </td>
                                        <td className="text-end pr-5 text-muted">
                                             <small className="mr-3">Klik untuk rincian</small>
                                             <i className="fas fa-expand-alt opacity-3" />
                                        </td>
                                    </tr>
                                    
                                    {/* Members (Hidden/Shown via CSS or mapping) */}
                                    {isExpanded && item.members.map(member => renderBillRow(member, true, item.groupId))}
                                </React.Fragment>
                            );
                        }
                    })}
                </tbody>
            </Table>

            <div className="py-4 d-flex justify-content-between align-items-center px-4">
                <small className="text-muted font-weight-bold">
                    Menampilkan <span className="text-primary">{bills.length}</span> nota dalam grup
                </small>
                <Pagination className="pagination-premium mb-0">
                    <PaginationItem disabled={page <= 1}>
                        <PaginationLink onClick={(e) => { e.preventDefault(); setPage(page-1); }} previous>
                           <i className="fas fa-angle-left" />
                        </PaginationLink>
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem active={page === i + 1} key={i}>
                            <PaginationLink onClick={(e) => { e.preventDefault(); setPage(i+1); }}>{i + 1}</PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={page >= totalPages}>
                        <PaginationLink onClick={(e) => { e.preventDefault(); setPage(page+1); }} next>
                             <i className="fas fa-angle-right" />
                        </PaginationLink>
                    </PaginationItem>
                </Pagination>
            </div>

            <style>{`
                .bg-primary-soft { background-color: rgba(94, 114, 228, 0.04) !important; }
                .bg-light-nested { background-color: #f8f9fe !important; }
                .border-left-selected { border-left: 4px solid #5e72e4 !important; }
                .x-small { font-size: 0.65rem; }
                .bill-icon {
                    width: 32px; height: 32px;
                    background: #f4f5f7; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                }
                .bill-icon.scale-80 { transform: scale(0.85); background: white; }
                .group-badge {
                    width: 40px; height: 40px;
                    background: #e8ebf8; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: inset 0 0 5px rgba(94, 114, 228, 0.1);
                }
                .group-header-row { cursor: pointer; transition: background 0.2s; border-left: 4px solid #adb5bd; }
                .group-header-row:hover { background-color: #f1f3f9 !important; }
                .group-header-row.expanded { background-color: #edf0ff !important; border-left: 4px solid #5e72e4; }
                
                .cust-note-bubble {
                    background: #fff8e1;
                    color: #b08900;
                    font-size: 0.72rem;
                    padding: 2px 8px;
                    border-radius: 6px;
                    display: inline-block;
                    font-style: italic;
                    border-left: 3px solid #ffca28;
                    width: fit-content;
                    max-width: 250px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .cust-note-bubble.scaled-70 { transform: scale(0.85); transform-origin: left top; margin-bottom: -5px; }

                .action-btn { transition: all 0.2s ease; opacity: 0.7; }
                .action-btn:hover { opacity: 1; transform: scale(1.2); }
                .btn-wa:hover { color: #2dce89 !important; }
                .btn-pay:hover { color: #5e72e4 !important; }
                
                /* Custom Checkbox Premium */
                .custom-checkbox-premium .custom-control-label::before {
                    width: 1.5rem; height: 1.5rem;
                    border: 2px solid #dee2e6;
                }
                .custom-checkbox-premium .custom-control-label::after {
                    width: 1.5rem; height: 1.5rem;
                }
                .custom-checkbox-premium .custom-control-input:checked ~ .custom-control-label::before {
                    background-color: #5e72e4;
                    border-color: #5e72e4;
                }
                .transition-all { transition: all 0.2s ease-in-out; }
            `}</style>

            {/* Modal Detail & Bayar */}
            <BillingDetailModal
                billId={modalBillId}
                isOpen={isDetailOpen}
                toggle={closeDetail}
                onPaymentSuccess={() => {
                    closeDetail();
                    if (onRefresh) onRefresh();
                }}
            />
        </div>
    );
};

export default BillingListTable;

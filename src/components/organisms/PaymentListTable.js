import React from 'react';
import { CardBody, CardFooter, Table, Badge } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';
import moment from 'moment';
import Pagination from '../Pagination/Pagination';

const PaymentListTable = ({ 
    payments, 
    loading, 
    rowPerPage, 
    onPageChange, 
    previousPage, 
    nextPage,
    onRowClick
}) => {
    const checkTipe = (tipe) => {
        switch (tipe) {
            case "qris":
                return <Badge color="success" className="px-3 py-2 rounded-pill shadow-none border"><i className="fas fa-qrcode mr-2" />QRIS</Badge>;
            case "cash":
                return <Badge color="warning" className="px-3 py-2 rounded-pill shadow-none border text-white"><i className="fas fa-wallet mr-2" />CASH</Badge>;
            case "tf":
                return <Badge color="primary" className="px-3 py-2 rounded-pill shadow-none border"><i className="fas fa-exchange-alt mr-2" />TRANSFER</Badge>;
            default:
                return <Badge color="secondary" className="px-3 py-2 rounded-pill shadow-none border">{tipe}</Badge>;
        }
    };

    return (
        <>
            <CardBody className="p-0">
                {loading ? (
                    <div className="text-center py-7">
                        <i className="fas fa-circle-notch fa-spin fa-3x text-primary mb-3" />
                        <h4 className="text-dark font-weight-bold">Sinkronisasi Data Pembayaran...</h4>
                    </div>
                ) : !payments || payments.data.length === 0 ? (
                    <div className="text-center py-7 opacity-7">
                        <i className="fas fa-receipt fa-4x text-muted mb-3" />
                        <h3 className="text-dark font-weight-bold">Tidak Ada Data Pembayaran</h3>
                        <p className="text-muted italic">Cek filter pencarian atau rentang tanggal.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table className="align-items-center table-flush border-0" hover>
                            <thead className="thead-light">
                                <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                                    <th className="font-weight-bold text-dark border-0 py-4" style={{ width: '60px' }}>No.</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Pelanggan</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Total Tagihan</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Jumlah Dibayar</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Kembalian</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Metode</th>
                                    <th className="font-weight-bold text-dark border-0 py-4">Waktu Transaksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.map((py, index) => (
                                    <tr 
                                        key={py.id} 
                                        className="transition-all clickable-row" 
                                        onClick={() => onRowClick && onRowClick(py.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="py-4 border-0 font-weight-bold text-dark opacity-5">
                                            {(payments.current_page - 1) * rowPerPage + index + 1}
                                        </td>
                                        <td className="py-4 border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="mr-3 rounded-circle bg-primary-soft-10 d-flex align-items-center justify-content-center shadow-inner" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-user text-primary" />
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 text-dark font-weight-bold" style={{ color: '#000' }}>{py.customer?.nama}</h5>
                                                    <small className="text-primary font-weight-bold h6">{py.customer?.telpon}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className="h5 font-weight-900 text-dark" style={{ color: '#000' }}>
                                                <RupiahFormater value={py.total_pembayaran} />
                                            </span>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className="h5 font-weight-900 text-success">
                                                <RupiahFormater value={py.nominal_bayar} />
                                            </span>
                                        </td>
                                        <td className="py-4 border-0">
                                            <span className={`h5 font-weight-900 ${py.kembalian > 0 ? 'text-warning' : 'text-muted'}`}>
                                                <RupiahFormater value={py.kembalian} />
                                            </span>
                                        </td>
                                        <td className="py-4 border-0">
                                            {checkTipe(py.tipe)}
                                        </td>
                                        <td className="py-4 border-0 text-dark font-weight-bold text-sm">
                                            <i className="far fa-calendar-alt mr-2 opacity-5" />
                                            {moment(py.created_at).format('D MMMM YYYY')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </CardBody>
            {payments && payments.total > 0 && (
                <CardFooter className="py-4 border-0 bg-transparent">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <p className="text-dark font-weight-bold text-sm mb-3 mb-md-0">
                            Menampilkan <span className="text-primary">{(payments.current_page - 1) * rowPerPage + 1}</span> sampai <span className="text-primary">{Math.min(payments.current_page * rowPerPage, payments.total)}</span> dari total <span className="text-primary">{payments.total}</span> data
                        </p>
                        <Pagination
                            currentPage={payments.current_page}
                            rowPerPage={rowPerPage}
                            totalPosts={payments.total}
                            onPageChange={onPageChange}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            lastPage={payments.last_page}
                        />
                    </div>
                </CardFooter>
            )}
            <style>{`
                .bg-primary-soft-10 { background: rgba(94, 114, 228, 0.08); }
                .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
                .clickable-row:hover { background-color: rgba(0,0,0,0.03) !important; }
            `}</style>
        </>
    );
};

export default PaymentListTable;

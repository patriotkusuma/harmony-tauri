import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Badge,
  Table,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import dayjs from 'dayjs';

const formatRupiah = (num) => `Rp ${(Number(num) || 0).toLocaleString('id-ID')}`;

export const getStatusBadge = (status) => {
  switch (status) {
    case 'OPEN':
      return <Badge color="info">SHIFT AKTIF (OPEN)</Badge>;
    case 'CLOSED_MATCH':
      return <Badge color="success">SESUAI / KLOP</Badge>;
    case 'CLOSED_SHORTAGE':
      return <Badge color="danger">KURANG (PIUTANG KARYAWAN)</Badge>;
    case 'CLOSED_OVERAGE':
      return <Badge color="warning">SELISIH LEBIH</Badge>;
    default:
      return <Badge color="secondary">{status}</Badge>;
  }
};

export const ShiftAuditDetailModal = ({
  isOpen,
  toggle,
  shift,
  isPrivileged,
  onSaveReview,
  submitting,
}) => {
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    if (shift) {
      setReviewNotes(shift.review_notes || '');
    }
  }, [shift]);

  if (!shift) return null;

  const diff = Number(shift.difference || 0);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <ModalHeader toggle={toggle} className="bg-gradient-dark text-white">
        <i className="fas fa-search-dollar me-2" />
        Detail Audit Laci Kasir — {shift.shift_name} (#{shift.id})
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col md="4">
            <div className="p-3 border rounded bg-light h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small font-weight-bold text-uppercase">Info Sesi Shift</span>
                {getStatusBadge(shift.status)}
              </div>
              <div className="small mb-1">
                <strong>Dibuka Oleh:</strong> {shift.opened_by_name}
              </div>
              <div className="small mb-1">
                <strong>Waktu Buka:</strong> {dayjs(shift.opened_at).format('DD MMM YYYY HH:mm')}
              </div>
              <div className="small mb-1">
                <strong>Ditutup Oleh:</strong> {shift.closed_by_name || '-'}
              </div>
              <div className="small mb-1">
                <strong>Waktu Tutup:</strong>{' '}
                {shift.closed_at ? dayjs(shift.closed_at).format('DD MMM YYYY HH:mm') : '-'}
              </div>
              {shift.opening_notes && (
                <div className="small text-muted mt-2 border-top pt-1">
                  <strong>Catatan Buka:</strong> {shift.opening_notes}
                </div>
              )}
              {shift.closing_notes && (
                <div className="small text-muted mt-1">
                  <strong>Catatan Tutup:</strong> {shift.closing_notes}
                </div>
              )}
            </div>
          </Col>

          <Col md="4">
            <div className="p-3 border rounded h-100">
              <div className="text-muted small font-weight-bold text-uppercase mb-2">
                Rincian Perhitungan Sistem
              </div>
              {shift.blind_mode ? (
                <div className="alert alert-secondary py-3 mb-0 text-center small">
                  <i className="fas fa-eye-slash me-1" /> Disembunyikan (Blind Mode Aktif)
                </div>
              ) : (
                <Table size="sm" borderless className="mb-0 small">
                  <tbody>
                    <tr>
                      <td>Modal Awal Laci:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.opening_cash)}</td>
                    </tr>
                    <tr className="text-success">
                      <td>+ Tunai Order & Tagihan:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.cash_in_sales)}</td>
                    </tr>
                    <tr className="text-success">
                      <td>+ Tunai Top-Up Deposit:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.cash_in_deposits)}</td>
                    </tr>
                    <tr className="text-success">
                      <td>+ Kas Masuk Manual:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.cash_in_manual)}</td>
                    </tr>
                    <tr className="text-danger">
                      <td>- Belanja / Pengeluaran Kas:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.cash_out_purchases)}</td>
                    </tr>
                    <tr className="text-danger border-bottom">
                      <td>- Kas Keluar Manual:</td>
                      <td className="text-end font-weight-bold">{formatRupiah(shift.cash_out_manual)}</td>
                    </tr>
                    <tr className="font-weight-bold text-dark">
                      <td>Ekspektasi Saldo Sistem:</td>
                      <td className="text-end">{formatRupiah(shift.expected_cash)}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </Col>

          <Col md="4">
            <div className="p-3 border rounded h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="text-muted small font-weight-bold text-uppercase mb-2">
                  Hasil Rekonsiliasi & Selisih
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Uang Menurut Sistem:</span>
                  <strong>{shift.blind_mode ? 'Disembunyikan' : formatRupiah(shift.expected_cash)}</strong>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Uang Fisik Dihitung:</span>
                  <strong>{shift.actual_cash != null ? formatRupiah(shift.actual_cash) : 'Belum Ditutup'}</strong>
                </div>
              </div>

              {shift.difference != null && (
                <div
                  className={`p-2 rounded text-center ${
                    diff < 0
                      ? 'bg-danger text-white'
                      : diff > 0
                      ? 'bg-warning text-dark'
                      : 'bg-success text-white'
                  }`}
                >
                  <div className="small font-weight-bold text-uppercase">
                    {diff < 0
                      ? 'Selisih Kurang (Dibukukan Piutang Karyawan)'
                      : diff > 0
                      ? 'Selisih Lebih'
                      : 'Klop / Tidak Ada Selisih'}
                  </div>
                  <div className="h3 mb-0 font-weight-bold text-white">
                    {diff > 0 ? '+' : ''}
                    {formatRupiah(diff)}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="5">
            <h6 className="text-uppercase text-muted font-weight-bold small mb-2">
              Rincian Lembar/Koin Fisik Saat Tutup Shift
            </h6>
            {shift.denominations && shift.denominations.length > 0 ? (
              <div className="table-responsive border rounded mb-3">
                <Table size="sm" className="mb-0 small">
                  <thead className="thead-light">
                    <tr>
                      <th>Pecahan</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shift.denominations.map((d, i) => (
                      <tr key={i}>
                        <td>Rp {Number(d.nominal).toLocaleString('id-ID')}</td>
                        <td className="text-center font-weight-bold">{d.qty}</td>
                        <td className="text-end font-weight-bold">{formatRupiah(d.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-muted small border rounded p-3 mb-3">
                Tidak ada rincian lembar pecahan tercatat pada shift ini.
              </div>
            )}

            {isPrivileged && shift.status !== 'OPEN' && (
              <div className="p-3 border rounded bg-secondary">
                <FormGroup className="mb-2">
                  <Label className="form-control-label small font-weight-bold">
                    Catatan Verifikasi / Tindak Lanjut Owner
                  </Label>
                  <Input
                    type="textarea"
                    rows="2"
                    bsSize="sm"
                    placeholder="Contoh: Sudah dikonfirmasi ke kasir, dipotong gaji bulan ini..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </FormGroup>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => onSaveReview(shift.id, reviewNotes)}
                  disabled={submitting}
                >
                  <i className="fas fa-check-double me-1" /> Simpan Verifikasi Owner
                </Button>
              </div>
            )}
          </Col>

          <Col md="7">
            <h6 className="text-uppercase text-muted font-weight-bold small mb-2">
              Log Aliran Uang Tunai Selama Shift (Real-Time Audit Trail)
            </h6>
            <div className="table-responsive border rounded" style={{ maxHeight: 280, overflowY: 'auto' }}>
              <Table size="sm" className="align-items-center mb-0 small">
                <thead className="thead-light">
                  <tr>
                    <th>Waktu</th>
                    <th>Sumber</th>
                    <th>Keterangan</th>
                    <th className="text-end">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {shift.system_cash_feed && shift.system_cash_feed.length > 0 ? (
                    shift.system_cash_feed.map((ev, idx) => (
                      <tr key={idx}>
                        <td className="text-nowrap">{dayjs(ev.timestamp).format('HH:mm')}</td>
                        <td>
                          <Badge color={ev.direction === 'IN' ? 'success' : 'warning'} pill>
                            {ev.source}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-wrap">{ev.description}</div>
                          {ev.actor_name && (
                            <small className="text-muted">Oleh: {ev.actor_name}</small>
                          )}
                        </td>
                        <td
                          className={`text-end font-weight-bold text-nowrap ${
                            ev.direction === 'IN' ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {ev.direction === 'IN' ? '+' : '-'}
                          {formatRupiah(ev.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        {shift.blind_mode
                          ? 'Log transaksi sistem disembunyikan selama mode Blind Count.'
                          : 'Belum ada transaksi tunai tercatat pada periode shift ini.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Tutup
        </Button>
      </ModalFooter>
    </Modal>
  );
};

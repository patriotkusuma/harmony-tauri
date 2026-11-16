import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Table,
  Input,
  Spinner,
} from 'reactstrap';
import dayjs from 'dayjs';
import { useCashierAudit } from 'hooks/useCashierAudit';
import {
  OpenShiftModal,
  CashMutationModal,
  BlindCloseShiftModal,
} from 'components/organisms/cashier_audit/CashierAuditModals';
import {
  ShiftAuditDetailModal,
  getStatusBadge,
} from 'components/organisms/cashier_audit/ShiftAuditDetailModal';

const formatRupiah = (num) => `Rp ${(Number(num) || 0).toLocaleString('id-ID')}`;

const CashierAudit = () => {
  const {
    activeShift,
    isPrivileged,
    historyItems,
    summaryStats,
    selectedShiftDetail,
    loadingActive,
    loadingHistory,
    submitting,
    filters,
    setFilters,
    fetchShiftHistory,
    refreshAll,

    openModal,
    setOpenModal,
    openForm,
    setOpenForm,
    handleOpenShift,

    mutationModal,
    setMutationModal,
    mutationForm,
    setMutationForm,
    handleAddMutation,

    closeModal,
    setCloseModal,
    denominations,
    updateDenominationQty,
    denominationTotal,
    manualActualCash,
    setManualActualCash,
    effectiveActualCash,
    closingNotes,
    setClosingNotes,
    resetCloseForm,
    handleCloseShift,

    detailModal,
    setDetailModal,
    handleOpenDetail,
    handleReviewShift,
  } = useCashierAudit();

  const handleFilterChange = (key, val) => {
    const next = { ...filters, [key]: val, page: 1 };
    setFilters(next);
    fetchShiftHistory(next);
  };

  return (
    <>
      <div className="header bg-gradient-primary pb-6 pt-5 pt-md-6 px-4 shadow-sm">
        <Container fluid>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-white font-weight-bold mb-1">
                <i className="fas fa-cash-register me-2" />
                Audit Kasir & Tracking Laci Tunai (Per Shift)
              </h2>
              <p className="text-white opacity-8 mb-0 small">
                Pantau modal laci, mutasi kas tunai real-time, Blind Count penutupan shift, dan deteksi otomatis selisih kas ke Piutang Karyawan.
              </p>
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <Button
                color="light"
                size="sm"
                onClick={refreshAll}
                disabled={loadingActive || loadingHistory}
              >
                <i className="fas fa-sync-alt me-1" /> Refresh Data
              </Button>
              {!activeShift ? (
                <Button color="success" size="sm" onClick={() => setOpenModal(true)}>
                  <i className="fas fa-unlock me-1" /> Buka Shift Kasir Baru
                </Button>
              ) : (
                <>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => {
                      setMutationForm({
                        mutation_type: 'OUT',
                        category: 'Operasional Laci',
                        amount: '',
                        description: '',
                      });
                      setMutationModal(true);
                    }}
                  >
                    <i className="fas fa-exchange-alt me-1" /> Catat Kas Masuk/Keluar Laci
                  </Button>
                  <Button color="danger" size="sm" onClick={() => setCloseModal(true)}>
                    <i className="fas fa-lock me-1" /> Tutup Shift (Blind Count)
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* KPI Summary Cards */}
          <Row>
            <Col xl="3" md="6" className="mb-3">
              <Card className="card-stats border-0 shadow-sm h-100">
                <CardBody className="py-3">
                  <Row>
                    <div className="col">
                      <h6 className="card-title text-uppercase text-muted mb-1">Status Laci Saat Ini</h6>
                      <span className="h3 font-weight-bold mb-0 text-dark">
                        {activeShift ? activeShift.shift_name : 'BELUM DIBUKA'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div
                        className={`icon icon-shape ${
                          activeShift ? 'bg-success' : 'bg-secondary'
                        } text-white rounded-circle shadow`}
                      >
                        <i className={`fas ${activeShift ? 'fa-door-open' : 'fa-door-closed'}`} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-2 mb-0 text-muted text-sm">
                    {activeShift ? (
                      <>
                        Kasir: <strong>{activeShift.opened_by_name}</strong> sejak{' '}
                        {dayjs(activeShift.opened_at).format('HH:mm')}
                      </>
                    ) : (
                      'Silakan buka shift sebelum transaksi tunai'
                    )}
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col xl="3" md="6" className="mb-3">
              <Card className="card-stats border-0 shadow-sm h-100">
                <CardBody className="py-3">
                  <Row>
                    <div className="col">
                      <h6 className="card-title text-uppercase text-muted mb-1">Total Shift Klop / Sesuai</h6>
                      <span className="h2 font-weight-bold mb-0 text-success">
                        {summaryStats.match_shifts || 0}{' '}
                        <small className="text-muted font-weight-normal">
                          / {summaryStats.total_shifts || 0} Shift
                        </small>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-check-circle" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-2 mb-0 text-muted text-sm">
                    Shift tanpa selisih uang fisik vs sistem
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col xl="3" md="6" className="mb-3">
              <Card className="card-stats border-0 shadow-sm h-100">
                <CardBody className="py-3">
                  <Row>
                    <div className="col">
                      <h6 className="card-title text-uppercase text-muted mb-1">
                        Total Selisih Kurang (Piutang)
                      </h6>
                      <span className="h3 font-weight-bold mb-0 text-danger">
                        {formatRupiah(summaryStats.total_shortage_amount)}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-user-Secret fa-exclamation-triangle" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-2 mb-0 text-muted text-sm">
                    Dari <strong>{summaryStats.shortage_shifts || 0}</strong> shift minus (Piutang Karyawan)
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col xl="3" md="6" className="mb-3">
              <Card className="card-stats border-0 shadow-sm h-100">
                <CardBody className="py-3">
                  <Row>
                    <div className="col">
                      <h6 className="card-title text-uppercase text-muted mb-1">
                        Total Selisih Lebih (Plus)
                      </h6>
                      <span className="h3 font-weight-bold mb-0 text-warning">
                        {formatRupiah(summaryStats.total_overage_amount)}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-coins" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-2 mb-0 text-muted text-sm">
                    Dari <strong>{summaryStats.overage_shifts || 0}</strong> shift dengan kelebihan uang fisik
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt--5 pb-5" fluid>
        {/* Panel Sesi Shift Aktif */}
        <Card className="shadow border-0 mb-4">
          <CardHeader className="bg-white border-0 d-flex flex-wrap justify-content-between align-items-center py-3">
            <div>
              <h4 className="mb-0 text-dark font-weight-bold">
                <i className="fas fa-drawer-alt text-primary me-2" />
                Status Sesi Laci Kasir Aktif
              </h4>
            </div>
            {activeShift && (
              <Badge color="success" pill className="px-3 py-2">
                SHIFT SEDANG BERJALAN — {activeShift.shift_name}
              </Badge>
            )}
          </CardHeader>
          <CardBody>
            {loadingActive ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
              </div>
            ) : !activeShift ? (
              <div className="text-center py-4 bg-light rounded border">
                <i className="fas fa-cash-register fa-3x text-muted mb-3" />
                <h4 className="text-dark font-weight-bold">Belum Ada Shift Kasir yang Dibuka</h4>
                <p className="text-muted small mb-3">
                  Buka shift kasir terlebih dahulu dan masukkan jumlah modal uang kembalian di laci agar seluruh uang tunai masuk/keluar terlacak per penanggung jawab.
                </p>
                <Button color="primary" onClick={() => setOpenModal(true)}>
                  <i className="fas fa-unlock me-1" /> Buka Shift Kasir Sekarang
                </Button>
              </div>
            ) : (
              <>
                <Row className="align-items-stretch">
                  <Col md="3" className="mb-3 mb-md-0">
                    <div className="p-3 border rounded bg-light h-100">
                      <div className="text-muted small font-weight-bold text-uppercase">Modal Awal Laci</div>
                      <div className="h3 font-weight-bold text-dark mt-1 mb-1">
                        {formatRupiah(activeShift.opening_cash)}
                      </div>
                      <div className="small text-muted">
                        Petugas: <strong>{activeShift.opened_by_name}</strong>
                      </div>
                      <div className="small text-muted">
                        Mulai: {dayjs(activeShift.opened_at).format('DD MMM YYYY HH:mm')}
                      </div>
                    </div>
                  </Col>

                  <Col md="3" className="mb-3 mb-md-0">
                    <div className="p-3 border rounded h-100">
                      <div className="text-muted small font-weight-bold text-uppercase">
                        Mutasi Kas Manual (Laci)
                      </div>
                      <div className="d-flex justify-content-between mt-2 small">
                        <span className="text-success">+ Masuk Manual:</span>
                        <strong>{formatRupiah(activeShift.cash_in_manual)}</strong>
                      </div>
                      <div className="d-flex justify-content-between mt-1 small">
                        <span className="text-danger">- Keluar Manual:</span>
                        <strong>{formatRupiah(activeShift.cash_out_manual)}</strong>
                      </div>
                      <div className="mt-2 pt-2 border-top">
                        <Button
                          size="sm"
                          color="outline-warning"
                          block
                          onClick={() => setMutationModal(true)}
                        >
                          <i className="fas fa-plus-minus me-1" /> Input Kas Masuk/Keluar
                        </Button>
                      </div>
                    </div>
                  </Col>

                  <Col md="6">
                    {activeShift.blind_mode ? (
                      <div className="p-3 border border-warning rounded bg-secondary h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-lock fa-2x text-warning me-3" />
                          <div>
                            <h5 className="mb-1 text-dark font-weight-bold">
                              Proteksi Blind Count Aktif
                            </h5>
                            <p className="small text-muted mb-0">
                              Total uang tunai dari transaksi sistem disembunyikan selama shift berlangsung agar penghitungan fisik saat tutup kasir dilakukan secara jujur dan independen.
                            </p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <Button color="danger" size="sm" onClick={() => setCloseModal(true)}>
                            <i className="fas fa-calculator me-1" /> Hitung Fisik & Tutup Shift
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 border border-primary rounded bg-neutral h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-primary small font-weight-bold text-uppercase">
                            <i className="fas fa-eye me-1" /> Monitor Real-Time Owner / Admin
                          </span>
                          <Badge color="primary">LIVE SYSTEM CASH</Badge>
                        </div>
                        <Row className="small mb-2">
                          <Col sm="6">
                            <div className="d-flex justify-content-between">
                              <span>+ Order & Pelunasan Tunai:</span>
                              <strong className="text-success">{formatRupiah(activeShift.cash_in_sales)}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>+ Top-Up Deposit Tunai:</span>
                              <strong className="text-success">{formatRupiah(activeShift.cash_in_deposits)}</strong>
                            </div>
                          </Col>
                          <Col sm="6">
                            <div className="d-flex justify-content-between">
                              <span>- Belanja Tunai:</span>
                              <strong className="text-danger">{formatRupiah(activeShift.cash_out_purchases)}</strong>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-1 mt-1">
                              <span className="font-weight-bold">Uang Seharusnya di Laci:</span>
                              <strong className="text-primary" style={{ fontSize: '1rem' }}>
                                {formatRupiah(activeShift.expected_cash)}
                              </strong>
                            </div>
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            size="sm"
                            color="outline-dark"
                            onClick={() => handleOpenDetail(activeShift.id)}
                          >
                            <i className="fas fa-list-ul me-1" /> Lihat Rincian Arus Kas Shift Ini
                          </Button>
                          <Button size="sm" color="danger" onClick={() => setCloseModal(true)}>
                            <i className="fas fa-lock me-1" /> Tutup Shift & Audit
                          </Button>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Daftar Mutasi Manual pada Shift Aktif */}
                {activeShift.mutations && activeShift.mutations.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <h6 className="text-uppercase text-muted small font-weight-bold mb-2">
                      Catatan Kas Masuk / Keluar Manual Shift Ini
                    </h6>
                    <div className="table-responsive">
                      <Table size="sm" className="align-items-center mb-0 small">
                        <thead className="thead-light">
                          <tr>
                            <th>Jam</th>
                            <th>Tipe</th>
                            <th>Kategori</th>
                            <th>Keterangan</th>
                            <th>Petugas</th>
                            <th className="text-end">Nominal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeShift.mutations.map((m) => (
                            <tr key={m.id}>
                              <td>{dayjs(m.created_at).format('HH:mm')}</td>
                              <td>
                                <Badge color={m.mutation_type === 'IN' ? 'success' : 'warning'}>
                                  {m.mutation_type === 'IN' ? 'MASUK' : 'KELUAR'}
                                </Badge>
                              </td>
                              <td className="font-weight-bold">{m.category}</td>
                              <td>{m.description}</td>
                              <td>{m.user_name}</td>
                              <td
                                className={`text-end font-weight-bold ${
                                  m.mutation_type === 'IN' ? 'text-success' : 'text-danger'
                                }`}
                              >
                                {m.mutation_type === 'IN' ? '+' : '-'}
                                {formatRupiah(m.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Tabel Riwayat Audit Shift Kasir */}
        <Card className="shadow border-0">
          <CardHeader className="bg-white border-0 py-3">
            <Row className="align-items-center">
              <Col md="4" className="mb-2 mb-md-0">
                <h4 className="mb-0 text-dark font-weight-bold">
                  <i className="fas fa-clipboard-check text-info me-2" />
                  Riwayat Audit Shift & Selisih Laci
                </h4>
              </Col>
              <Col md="8">
                <div className="d-flex flex-wrap justify-content-md-end gap-2">
                  <Input
                    type="select"
                    bsSize="sm"
                    style={{ width: 200 }}
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Semua Status Audit</option>
                    <option value="OPEN">Shift Aktif (OPEN)</option>
                    <option value="CLOSED_MATCH">Sesuai / Klop</option>
                    <option value="CLOSED_SHORTAGE">Selisih Kurang (Piutang Karyawan)</option>
                    <option value="CLOSED_OVERAGE">Selisih Lebih</option>
                  </Input>
                  <Input
                    type="date"
                    bsSize="sm"
                    style={{ width: 155 }}
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  />
                  <Input
                    type="date"
                    bsSize="sm"
                    style={{ width: 155 }}
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </CardHeader>

          <div className="table-responsive">
            <Table className="align-items-center table-flush mb-0" hover>
              <thead className="thead-light">
                <tr>
                  <th>Waktu Shift</th>
                  <th>Shift & Kasir</th>
                  <th className="text-end">Modal Awal</th>
                  <th className="text-end">Saldo Sistem</th>
                  <th className="text-end">Fisik Laci</th>
                  <th className="text-end">Selisih</th>
                  <th className="text-center">Status Audit</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <Spinner size="sm" color="primary" className="me-2" /> Memuat riwayat audit kasir...
                    </td>
                  </tr>
                ) : historyItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      Belum ada data audit shift kasir pada rentang tanggal ini.
                    </td>
                  </tr>
                ) : (
                  historyItems.map((item) => {
                    const diff = Number(item.difference || 0);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="font-weight-bold text-dark">
                            {dayjs(item.opened_at).format('DD MMM YYYY')}
                          </div>
                          <small className="text-muted">
                            {dayjs(item.opened_at).format('HH:mm')} —{' '}
                            {item.closed_at ? dayjs(item.closed_at).format('HH:mm') : 'Aktif'}
                          </small>
                        </td>
                        <td>
                          <div className="font-weight-bold text-primary">{item.shift_name}</div>
                          <small className="text-muted">
                            Buka: {item.opened_by_name}
                            {item.closed_by_name ? ` | Tutup: ${item.closed_by_name}` : ''}
                          </small>
                        </td>
                        <td className="text-end font-weight-bold">
                          {formatRupiah(item.opening_cash)}
                        </td>
                        <td className="text-end font-weight-bold">
                          {item.blind_mode ? (
                            <Badge color="secondary">Blind Mode</Badge>
                          ) : (
                            formatRupiah(item.expected_cash)
                          )}
                        </td>
                        <td className="text-end font-weight-bold">
                          {item.actual_cash != null ? formatRupiah(item.actual_cash) : '-'}
                        </td>
                        <td className="text-end font-weight-bold">
                          {item.difference == null ? (
                            '-'
                          ) : (
                            <span
                              className={
                                diff < 0
                                  ? 'text-danger'
                                  : diff > 0
                                  ? 'text-warning'
                                  : 'text-success'
                              }
                            >
                              {diff > 0 ? '+' : ''}
                              {formatRupiah(diff)}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          {getStatusBadge(item.status)}
                          {item.review_notes && (
                            <div className="mt-1">
                              <Badge color="default" pill>
                                <i className="fas fa-check me-1" /> Direview Owner
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            color="outline-primary"
                            onClick={() => handleOpenDetail(item.id)}
                          >
                            <i className="fas fa-eye me-1" /> Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* Modals */}
      <OpenShiftModal
        isOpen={openModal}
        toggle={() => setOpenModal(!openModal)}
        form={openForm}
        setForm={setOpenForm}
        onSubmit={handleOpenShift}
        submitting={submitting}
      />

      <CashMutationModal
        isOpen={mutationModal}
        toggle={() => setMutationModal(!mutationModal)}
        form={mutationForm}
        setForm={setMutationForm}
        onSubmit={handleAddMutation}
        submitting={submitting}
      />

      <BlindCloseShiftModal
        isOpen={closeModal}
        toggle={() => setCloseModal(!closeModal)}
        activeShift={activeShift}
        denominations={denominations}
        updateDenominationQty={updateDenominationQty}
        denominationTotal={denominationTotal}
        manualActualCash={manualActualCash}
        setManualActualCash={setManualActualCash}
        effectiveActualCash={effectiveActualCash}
        closingNotes={closingNotes}
        setClosingNotes={setClosingNotes}
        resetCloseForm={resetCloseForm}
        onSubmit={handleCloseShift}
        submitting={submitting}
      />

      <ShiftAuditDetailModal
        isOpen={detailModal}
        toggle={() => setDetailModal(!detailModal)}
        shift={selectedShiftDetail}
        isPrivileged={isPrivileged}
        onSaveReview={handleReviewShift}
        submitting={submitting}
      />
    </>
  );
};

export default CashierAudit;

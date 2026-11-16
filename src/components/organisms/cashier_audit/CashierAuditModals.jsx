import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Badge,
  Table,
  Spinner,
} from 'reactstrap';

const formatRupiah = (num) => `Rp ${(Number(num) || 0).toLocaleString('id-ID')}`;

export const OpenShiftModal = ({
  isOpen,
  toggle,
  form,
  setForm,
  onSubmit,
  submitting,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="bg-gradient-primary text-white">
        <i className="fas fa-cash-register me-2" />
        Buka Shift Kasir & Modal Laci Awal
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalBody>
          <div className="alert alert-info py-2 px-3 small mb-3">
            <i className="fas fa-info-circle me-1" />
            Hitung uang tunai modal kembalian yang ada di dalam laci sebelum mulai menerima transaksi.
          </div>

          <FormGroup>
            <Label className="form-control-label font-weight-bold">Nama / Jadwal Shift</Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {['Shift Pagi', 'Shift Siang/Sore', 'Shift Malam', 'Shift Full'].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  size="sm"
                  color={form.shift_name === preset ? 'primary' : 'outline-primary'}
                  onClick={() => setForm({ ...form, shift_name: preset })}
                >
                  {preset}
                </Button>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Contoh: Shift Pagi (Kosongkan untuk otomatis)"
              value={form.shift_name}
              onChange={(e) => setForm({ ...form, shift_name: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-control-label font-weight-bold">
              Modal Uang Tunai di Laci (Opening Cash) <span className="text-danger">*</span>
            </Label>
            <InputGroup>
              <InputGroupText>Rp</InputGroupText>
              <Input
                type="number"
                min="0"
                required
                placeholder="0"
                value={form.opening_cash}
                onChange={(e) => setForm({ ...form, opening_cash: e.target.value })}
                className="font-weight-bold"
                style={{ fontSize: '1.15rem' }}
              />
            </InputGroup>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {[0, 50000, 100000, 150000, 200000, 300000, 500000].map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  size="sm"
                  color="outline-secondary"
                  className="rounded-pill px-2 py-1"
                  onClick={() => setForm({ ...form, opening_cash: amt })}
                >
                  {formatRupiah(amt)}
                </Button>
              ))}
            </div>
          </FormGroup>

          <FormGroup className="mb-0">
            <Label className="form-control-label font-weight-bold">Catatan Pembukaan Laci</Label>
            <Input
              type="textarea"
              rows="2"
              placeholder="Contoh: Uang pecahan Rp 2.000 & Rp 5.000 lengkap dari shift sebelumnya"
              value={form.opening_notes}
              onChange={(e) => setForm({ ...form, opening_notes: e.target.value })}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggle} disabled={submitting}>
            Batal
          </Button>
          <Button color="primary" type="submit" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : <><i className="fas fa-unlock me-1" /> Buka Shift Sekarang</>}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export const CashMutationModal = ({
  isOpen,
  toggle,
  form,
  setForm,
  onSubmit,
  submitting,
}) => {
  const isOut = form.mutation_type === 'OUT';
  const categories = isOut
    ? ['Operasional Laci', 'Beli Plastik/Kebutuhan Kecil', 'Setor Tunai ke Owner/Bank', 'Kasbon / Pinjaman', 'Lainnya']
    : ['Tambah Modal Kembalian', 'Tukar Uang Pecahan', 'Pengembalian Sisa Belanja', 'Lainnya'];

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className={isOut ? 'bg-gradient-warning text-white' : 'bg-gradient-success text-white'}>
        <i className={`fas ${isOut ? 'fa-arrow-circle-up' : 'fa-arrow-circle-down'} me-2`} />
        {isOut ? 'Catat Uang Keluar dari Laci Kasir' : 'Catat Uang Masuk Manual ke Laci'}
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalBody>
          <FormGroup>
            <Label className="form-control-label font-weight-bold">Jenis Mutasi Kas Laci</Label>
            <div className="d-flex gap-2">
              <Button
                type="button"
                color={form.mutation_type === 'OUT' ? 'warning' : 'outline-warning'}
                className="flex-fill"
                onClick={() => setForm({ ...form, mutation_type: 'OUT', category: 'Operasional Laci' })}
              >
                <i className="fas fa-minus-circle me-1" /> Kas Keluar (Ambil dari Laci)
              </Button>
              <Button
                type="button"
                color={form.mutation_type === 'IN' ? 'success' : 'outline-success'}
                className="flex-fill"
                onClick={() => setForm({ ...form, mutation_type: 'IN', category: 'Tambah Modal Kembalian' })}
              >
                <i className="fas fa-plus-circle me-1" /> Kas Masuk (Tambah ke Laci)
              </Button>
            </div>
          </FormGroup>

          <FormGroup>
            <Label className="form-control-label font-weight-bold">Kategori Keperluan</Label>
            <Input
              type="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label className="form-control-label font-weight-bold">Nominal Uang Tunai <span className="text-danger">*</span></Label>
            <InputGroup>
              <InputGroupText>Rp</InputGroupText>
              <Input
                type="number"
                min="1"
                required
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="font-weight-bold"
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-0">
            <Label className="form-control-label font-weight-bold">
              Keterangan Lengkap (Wajib untuk Audit) <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              rows="3"
              required
              placeholder="Jelaskan untuk apa uang diambil/dimasukkan beserta bukti/penerima..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggle} disabled={submitting}>
            Batal
          </Button>
          <Button color={isOut ? 'warning' : 'success'} type="submit" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : 'Simpan Mutasi Laci'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export const BlindCloseShiftModal = ({
  isOpen,
  toggle,
  activeShift,
  denominations,
  updateDenominationQty,
  denominationTotal,
  manualActualCash,
  setManualActualCash,
  effectiveActualCash,
  closingNotes,
  setClosingNotes,
  resetCloseForm,
  onSubmit,
  submitting,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gradient-danger text-white">
        <i className="fas fa-user-shield me-2" />
        Tutup Kasir & Audit Fisik Uang Laci (Blind Count)
      </ModalHeader>
      <ModalBody>
        <div className="alert alert-default bg-secondary border-left-danger py-2 px-3 mb-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-eye-slash fa-2x text-danger me-3" />
            <div className="small text-dark">
              <strong>Mode Blind Count Aktif:</strong> Saldo ekspektasi sistem disembunyikan selama proses hitung fisik.
              Masukkan jumlah lembar/koin uang tunai yang benar-benar ada di laci saat ini.
              Selisih kurang akan otomatis dibukukan sebagai <strong>Piutang Karyawan</strong>.
            </div>
          </div>
        </div>

        <Row>
          <Col md="7">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-uppercase text-muted mb-0 font-weight-bold">
                1. Kalkulator Pecahan Uang (Kertas & Koin)
              </h6>
              <Button size="sm" color="link" className="text-danger p-0" onClick={resetCloseForm}>
                Reset Hitungan
              </Button>
            </div>
            <div className="table-responsive border rounded" style={{ maxHeight: 340, overflowY: 'auto' }}>
              <Table size="sm" className="align-items-center mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>Pecahan</th>
                    <th style={{ width: 110 }}>Jml Lembar/Koin</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {denominations.map((d) => (
                    <tr key={d.nominal}>
                      <td className="font-weight-bold text-dark">
                        Rp {d.nominal.toLocaleString('id-ID')}
                      </td>
                      <td>
                        <Input
                          type="number"
                          min="0"
                          bsSize="sm"
                          value={d.qty === 0 ? '' : d.qty}
                          placeholder="0"
                          onChange={(e) => updateDenominationQty(d.nominal, e.target.value)}
                          className="text-center font-weight-bold"
                        />
                      </td>
                      <td className="text-end font-weight-bold text-primary">
                        {d.subtotal > 0 ? formatRupiah(d.subtotal) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>

          <Col md="5" className="d-flex flex-column justify-content-between mt-3 mt-md-0">
            <div>
              <h6 className="text-uppercase text-muted mb-2 font-weight-bold">
                2. Ringkasan Fisik Laci
              </h6>
              <div className="p-3 rounded bg-gradient-neutral border mb-3">
                <div className="text-muted small">Shift Aktif:</div>
                <div className="font-weight-bold text-dark mb-2">
                  {activeShift?.shift_name} — {activeShift?.opened_by_name}
                </div>
                <div className="text-muted small">Total dari Rincian Pecahan:</div>
                <div className="h3 font-weight-bold text-primary mb-0">
                  {formatRupiah(denominationTotal)}
                </div>
              </div>

              {denominationTotal === 0 && (
                <FormGroup>
                  <Label className="form-control-label small font-weight-bold">
                    Atau Input Total Tunai Langsung (Jika Tanpa Rincian Pecahan)
                  </Label>
                  <InputGroup size="sm">
                    <InputGroupText>Rp</InputGroupText>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={manualActualCash}
                      onChange={(e) => setManualActualCash(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
              )}

              <FormGroup>
                <Label className="form-control-label small font-weight-bold">
                  Catatan Penutupan Shift (Opsional)
                </Label>
                <Input
                  type="textarea"
                  rows="3"
                  placeholder="Contoh: Uang disetor ke brankas Rp 500rb, sisanya ditinggal di laci..."
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                />
              </FormGroup>
            </div>

            <div className="p-3 rounded bg-dark text-white">
              <div className="small text-light opacity-8">TOTAL FISIK DIKUNCI:</div>
              <div className="h2 text-white font-weight-bold mb-0">
                {formatRupiah(effectiveActualCash)}
              </div>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggle} disabled={submitting}>
          Batal
        </Button>
        <Button color="danger" onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <Spinner size="sm" />
          ) : (
            <>
              <i className="fas fa-lock me-1" /> Kunci Hitungan & Tutup Shift
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

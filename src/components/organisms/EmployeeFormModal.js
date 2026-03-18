import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, FormGroup, Label, Input, CustomInput } from 'reactstrap';

const EmployeeFormModal = ({ 
    isOpen, 
    toggle, 
    editMode, 
    form, 
    setForm, 
    outlets, 
    loading, 
    onSubmit,
    handleOutletToggle
}) => {
    return (
        <Modal isOpen={isOpen} toggle={() => !loading && toggle()} size="lg" centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <ModalHeader toggle={() => !loading && toggle()} className="bg-gradient-primary text-white py-4 border-0">
                <div className="d-flex align-items-center">
                    <i className={`fas ${editMode ? 'fa-user-edit' : 'fa-user-plus'} fa-2x mr-3 text-white-50`} />
                    <div>
                        <h4 className="text-white mb-0 font-weight-bold ls-1">
                            {editMode ? "Penyuntingan Data Pegawai" : "Registrasi Pegawai Baru"}
                        </h4>
                        <small className="text-white-50 text-uppercase font-weight-bold" style={{ fontSize: '0.65rem' }}>Manajemen Sumber Daya Manusia</small>
                    </div>
                </div>
            </ModalHeader>
            <form onSubmit={onSubmit}>
                <ModalBody className="py-4">
                    <Row>
                        {/* Kolom Kiri: Informasi Akun */}
                        <Col md="6">
                            <h5 className="text-primary text-uppercase ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.75rem' }}>Informasi Akun & Login</h5>
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1">NAMA LENGKAP</Label>
                                <Input
                                    required
                                    placeholder="Masukkan nama pegawai"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1">EMAIL LOGIN</Label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="nama@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1">
                                    PASSWORD {editMode && "(KOSONGKAN JIKA TETAP)"}
                                </Label>
                                <Input
                                    required={!editMode}
                                    type="password"
                                    placeholder="******"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                />
                            </FormGroup>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1">PERAN (ROLE)</Label>
                                        <Input
                                            type="select"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                        >
                                            <option value="pegawai">Pegawai</option>
                                            <option value="admin">Admin</option>
                                            <option value="owner">Owner</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1">GAJI (RP)</Label>
                                        <Input
                                            type="number"
                                            value={form.gaji}
                                            onChange={(e) => setForm({ ...form, gaji: parseInt(e.target.value) })}
                                            className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        {/* Kolom Kanan: Detail & Akses */}
                        <Col md="6">
                            <h5 className="text-primary text-uppercase ls-1 mb-3 font-weight-bold" style={{ fontSize: '0.75rem' }}>Detail & Hak Akses</h5>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1">TELEPON</Label>
                                        <Input
                                            placeholder="081xxx"
                                            value={form.telpon}
                                            onChange={(e) => setForm({ ...form, telpon: e.target.value })}
                                            className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label className="text-xs font-weight-bold text-muted ml-1">WHATSAPP</Label>
                                        <Input
                                            placeholder="6281xxx"
                                            value={form.no_wa}
                                            onChange={(e) => setForm({ ...form, no_wa: e.target.value })}
                                            className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted ml-1">TANGGAL MASUK</Label>
                                <Input
                                    type="date"
                                    value={form.tanggal_masuk}
                                    onChange={(e) => setForm({ ...form, tanggal_masuk: e.target.value })}
                                    className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="text-xs font-weight-bold text-muted d-block ml-1">STATUS AKTIVASI</Label>
                                <div className="d-flex p-2 bg-light rounded shadow-inner" style={{ gap: '20px' }}>
                                    <CustomInput
                                        type="radio"
                                        id="modalStatusActive"
                                        label="Aktif"
                                        name="modalStatus"
                                        checked={form.status === "active"}
                                        onChange={() => setForm({ ...form, status: "active" })}
                                        className="font-weight-bold text-dark"
                                    />
                                    <CustomInput
                                        type="radio"
                                        id="modalStatusInactive"
                                        label="Nonaktif"
                                        name="modalStatus"
                                        checked={form.status === "inactive"}
                                        onChange={() => setForm({ ...form, status: "inactive" })}
                                        className="font-weight-bold text-dark"
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <Label className="text-xs font-weight-bold text-muted ml-1">HAK AKSES OUTLET</Label>
                                <div className="p-3 bg-white border rounded shadow-sm" style={{ maxHeight: "120px", overflowY: "auto" }}>
                                    {outlets.map((o) => (
                                        <CustomInput
                                            key={o.id}
                                            type="checkbox"
                                            id={`modal-outlet-${o.id}`}
                                            label={o.nama_outlet}
                                            checked={form.outlet_ids.includes(o.id)}
                                            onChange={() => handleOutletToggle(o.id)}
                                            className="font-weight-bold text-dark mb-1"
                                        />
                                    ))}
                                </div>
                            </FormGroup>
                        </Col>

                        {/* Full Width Row */}
                        <Col md="12" className="mt-3">
                            <FormGroup className="mb-0">
                                <Label className="text-xs font-weight-bold text-muted ml-1">ALAMAT LENGKAP</Label>
                                <Input
                                    type="textarea"
                                    rows="2"
                                    placeholder="Masukkan alamat domisili pegawai..."
                                    value={form.alamat}
                                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                    className="form-control-alternative border shadow-none font-weight-bold text-dark"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="bg-light border-0 p-4">
                    <Button color="secondary" outline onClick={toggle} disabled={loading} className="px-4 border-0 font-weight-bold shadow-none">
                        Batal
                    </Button>
                    <Button color="primary" type="submit" disabled={loading} className="px-5 shadow-premium font-weight-bold rounded-lg py-2">
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin mr-2" />Memproses...</>
                        ) : (
                            <><i className={`fas ${editMode ? 'fa-save' : 'fa-check-circle'} mr-2`} />{editMode ? "Perbarui Data" : "Simpan Pegawai"}</>
                        )}
                    </Button>
                </ModalFooter>
            </form>
            <style>{`
                .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
            `}</style>
        </Modal>
    );
};

export default EmployeeFormModal;

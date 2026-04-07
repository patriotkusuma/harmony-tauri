import React, { useState } from 'react';
import { 
    Table, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Row, Col
} from 'reactstrap';
import { useSatuan } from 'hooks/useSatuan';

const SatuanManagement = () => {
    const { units, isLoading, createSatuan, updateSatuan, deleteSatuan, isSubmitting } = useSatuan();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSatuan, setSelectedSatuan] = useState(null);
    const [form, setForm] = useState({ nama: '', description: '' });

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen) {
            setSelectedSatuan(null);
            setForm({ nama: '', description: '' });
        }
    };

    const handleEdit = (item) => {
        setSelectedSatuan(item);
        setForm({ nama: item.nama, description: item.description || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus satuan ini? Pastikan tidak ada barang yang menggunakan satuan ini.")) {
            await deleteSatuan(id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSatuan) {
            updateSatuan({ id: selectedSatuan.id, payload: form });
        } else {
            createSatuan(form);
        }
        toggleModal();
    };

    if (isLoading) return <div className="p-4 text-center">Memuat data satuan...</div>;

    return (
        <div className="satuan-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 font-weight-bold text-muted text-uppercase ls-1">Daftar Satuan Unit</h4>
                <Button color="primary" size="sm" className="rounded-pill px-4 shadow-sm" onClick={toggleModal}>
                    <i className="fas fa-plus me-2" /> Tambah Satuan
                </Button>
            </div>

            <div className="table-responsive rounded-lg shadow-sm border overflow-hidden">
                <Table className="align-middle mb-0 bg-white" hover>
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">ID</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">Nama Satuan</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0">Keterangan</th>
                            <th className="px-4 py-3 text-xs font-weight-bold text-muted text-uppercase ls-1 border-0 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(units || []).map((u) => (
                            <tr key={u.id}>
                                <td className="px-4 py-3 font-weight-bold text-muted border-0">{u.id}</td>
                                <td className="px-4 py-3 font-weight-bold border-0">{u.nama}</td>
                                <td className="px-4 py-3 border-0">{u.description || '-'}</td>
                                <td className="px-4 py-3 border-0 text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button size="sm" color="info" outline className="rounded-pill px-3" onClick={() => handleEdit(u)}>
                                            <i className="fas fa-edit" />
                                        </Button>
                                        <Button size="sm" color="danger" outline className="rounded-pill px-3" onClick={() => handleDelete(u.id)}>
                                            <i className="fas fa-trash" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered contentClassName="border-0 shadow-lg rounded-xl">
                <ModalHeader toggle={toggleModal} className="border-bottom-0 pb-0">
                    <span className="font-weight-900">{selectedSatuan ? 'Edit Satuan' : 'Tambah Satuan Baru'}</span>
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                    <ModalBody className="py-4">
                        <FormGroup>
                            <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Nama Satuan</Label>
                            <Input 
                                required
                                value={form.nama}
                                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                placeholder="Misal: kg, liter, pcs"
                                className="rounded-lg border-light"
                            />
                        </FormGroup>
                        <FormGroup className="mb-0">
                            <Label className="text-xs font-weight-bold text-muted ms-1 text-uppercase ls-1">Keterangan</Label>
                            <Input 
                                type="textarea"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Opsional..."
                                className="rounded-lg border-light"
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter className="border-top-0 pt-0">
                        <Button color="light" className="rounded-pill px-4" onClick={toggleModal}>Batal</Button>
                        <Button color="primary" className="rounded-pill px-5 shadow-sm" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
};

export default SatuanManagement;

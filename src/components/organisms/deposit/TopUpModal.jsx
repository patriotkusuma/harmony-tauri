import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, InputGroup, InputGroupText, Spinner } from 'reactstrap';

const TopUpModal = ({ isOpen, toggle, data, setData, onSave, loading }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="modal-premium">
            <ModalHeader toggle={toggle} className="border-0 pb-0">
                <h3 className="mb-0 font-weight-bold">Top-up Saldo Customer</h3>
            </ModalHeader>
            <ModalBody className="py-4">
                <FormGroup>
                    <Label className="form-control-label">Nominal Top-up</Label>
                    <InputGroup className="input-group-alternative mb-3 shadow-none border rounded-lg overflow-hidden">
                        <>
                            <InputGroupText className="bg-white border-0">Rp</InputGroupText>
                        </>
                        <Input
                            placeholder="0"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData({ ...data, amount: e.target.value })}
                            className="border-0 h-auto py-3 font-weight-bold"
                            style={{ fontSize: '1.2rem' }}
                        />
                    </InputGroup>
                    <div className="quick-amounts d-flex flex-wrap mt-2">
                        {[50000, 100000, 200000, 500000].map(amt => (
                            <Button 
                                key={amt}
                                size="sm" 
                                color="outline-info" 
                                className="me-2 mb-2 rounded-pill px-3"
                                onClick={() => setData({ ...data, amount: amt })}
                            >
                                {amt.toLocaleString('id-ID')}
                            </Button>
                        ))}
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label className="form-control-label">Keterangan (Opsional)</Label>
                    <Input
                        type="textarea"
                        placeholder="Contoh: Top up saldo bulanan, via cash, dll"
                        rows="3"
                        value={data.keterangan}
                        onChange={(e) => setData({ ...data, keterangan: e.target.value })}
                        className="form-control-alternative border rounded-lg"
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
                <Button color="link" className="text-muted" onClick={toggle} disabled={loading}>
                    Batal
                </Button>
                <Button 
                    color="primary" 
                    className="rounded-pill px-4 shadow-sm" 
                    onClick={onSave}
                    disabled={loading || !data.amount}
                >
                    {loading ? <Spinner size="sm" /> : 'Proses Top-up'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default TopUpModal;

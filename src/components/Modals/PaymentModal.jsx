import React from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const PaymentModal = ({ isOpen, toggle, valueBayar, setValueBayar, subTotal, onSubmitPayment }) => {
    const changeAmount = valueBayar - subTotal;

    return (
        <Modal centered isOpen={isOpen} autoFocus={false} toggle={toggle}>
            <ModalHeader toggle={toggle}>Pembayaran</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <Label className="form-label">Uang Cash</Label>
                            <Input
                                style={{ fontSize: '48px', color: '#000', fontWeight: 'bold' }}
                                className="form-control-alternative"
                                name="total_bayar"
                                id="total_bayar"
                                placeholder="50000"
                                autoFocus={true}
                                type="number"
                                value={valueBayar === 0 ? '' : valueBayar} // Display empty string for 0 initially
                                onChange={(e) => setValueBayar(parseInt(e.target.value) || 0)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Table>
                    <tbody>
                        <tr>
                            <td className="font-weight-bold"><h4>Sub Total</h4></td>
                            <td><h4><RupiahFormater value={subTotal || 0} /></h4></td>
                        </tr>
                        <tr>
                            <td className="font-weight-bold"><h4>Jumlah Bayar</h4></td>
                            <td><h4><RupiahFormater value={valueBayar || 0} /></h4></td>
                        </tr>
                        <tr>
                            <td className="font-weight-bold"><h4>Kembali</h4></td>
                            <td>
                                <h4 className={`p-2 rounded ${changeAmount >= 0 ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                    <RupiahFormater value={changeAmount || 0} />
                                </h4>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
                <Button color="primary" onClick={onSubmitPayment}>
                    Simpan
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default PaymentModal;
import React from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import RupiahFormater from 'utils/RupiahFormater';

const PaymentModal = ({ isOpen, toggle, valueBayar, setValueBayar, tipeBayar, setTipeBayar, subTotal, onSubmitPayment }) => {
    const changeAmount = valueBayar - subTotal;

    return (
        <Modal centered isOpen={isOpen} autoFocus={false} toggle={toggle}>
            <ModalHeader toggle={toggle}>Pembayaran</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <Label className="form-label text-muted mb-2" style={{ fontWeight: 600 }}>NOMINAL BAYAR / UANG DITERIMA</Label>
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
                <Row className="mb-3">
                    <Col md="12">
                        <Label className="form-label text-muted mb-2" style={{ fontWeight: 600 }}>PILIH METODE PEMBAYARAN</Label>
                        <div className="d-flex w-100 justify-content-between" style={{ gap: '12px' }}>
                            <div
                                onClick={() => setTipeBayar('cash')}
                                style={{ flex: 1, padding: '1.2rem 0.5rem', border: '2px solid', borderColor: tipeBayar === 'cash' ? '#5e72e4' : '#e9ecef', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease', background: tipeBayar === 'cash' ? '#f0f3fe' : '#ffffff', boxShadow: tipeBayar === 'cash' ? '0 4px 12px rgba(94, 114, 228, 0.15)' : 'none' }}
                            >
                                <i className="ni ni-money-coins mb-2 d-block" style={{ fontSize: '26px', color: tipeBayar === 'cash' ? '#5e72e4' : '#adb5bd', transition: 'all 0.2s' }}></i>
                                <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px', color: tipeBayar === 'cash' ? '#5e72e4' : '#8898aa' }}>CASH / TUNAI</span>
                            </div>
                            <div
                                onClick={() => setTipeBayar('qris')}
                                style={{ flex: 1, padding: '1.2rem 0.5rem', border: '2px solid', borderColor: tipeBayar === 'qris' ? '#11cdef' : '#e9ecef', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease', background: tipeBayar === 'qris' ? '#e7f9fc' : '#ffffff', boxShadow: tipeBayar === 'qris' ? '0 4px 12px rgba(17, 205, 239, 0.15)' : 'none' }}
                            >
                                <i className="ni ni-mobile-button mb-2 d-block" style={{ fontSize: '26px', color: tipeBayar === 'qris' ? '#11cdef' : '#adb5bd', transition: 'all 0.2s' }}></i>
                                <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px', color: tipeBayar === 'qris' ? '#11cdef' : '#8898aa' }}>QRIS / DANA BIZ</span>
                            </div>
                            <div
                                onClick={() => setTipeBayar('tf')}
                                style={{ flex: 1, padding: '1.2rem 0.5rem', border: '2px solid', borderColor: tipeBayar === 'tf' ? '#2dce89' : '#e9ecef', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease', background: tipeBayar === 'tf' ? '#ebf9f3' : '#ffffff', boxShadow: tipeBayar === 'tf' ? '0 4px 12px rgba(45, 206, 137, 0.15)' : 'none' }}
                            >
                                <i className="ni ni-credit-card mb-2 d-block" style={{ fontSize: '26px', color: tipeBayar === 'tf' ? '#2dce89' : '#adb5bd', transition: 'all 0.2s' }}></i>
                                <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px', color: tipeBayar === 'tf' ? '#2dce89' : '#8898aa' }}>TRANSFER BCA</span>
                            </div>
                        </div>
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
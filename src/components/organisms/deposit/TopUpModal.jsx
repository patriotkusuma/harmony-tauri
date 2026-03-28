import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, InputGroup, InputGroupText, Spinner, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { useState, useEffect, useCallback } from 'react';
import axios from 'services/axios-instance';
import { debounce } from 'lodash';
import CustomerAvatar from 'components/atoms/customer/CustomerAvatar';
import { whatsappInstance } from 'services/whatsapp-instance';
import { toast } from 'react-toastify';

const TopUpModal = ({ isOpen, toggle, data, setData, onSave, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [waStatus, setWaStatus] = useState(null); // null, 'loading', 'active', 'inactive'

    // Sync search input with data when modal opens
    useEffect(() => {
        if (isOpen) {
            setSearchTerm(data.customer_name || '');
            setSearchResults([]);
            setWaStatus(null);
        }
    }, [isOpen, data.id_customer]);

    // Check WhatsApp status (similar to CustomerModal logic)
    const checkWhatsApp = useCallback(async (phone) => {
        if (!phone || phone.length < 9) return;
        setWaStatus('loading');
        try {
            const jid = phone.replace(/\D/g, '') + "@s.whatsapp.net";
            const res = await whatsappInstance.get('/user/check', {
                params: { phone: jid },
                headers: { 'X-Device-Id': 'harmony-gebang' }
            });
            setWaStatus(res.data?.results?.is_on_whatsapp ? 'active' : 'inactive');
        } catch (err) {
            setWaStatus(null);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchTerm || (data.id_customer && searchTerm === data.customer_name)) {
            setSearchResults([]);
            return;
        }

        const fetchData = debounce(async () => {
            setSearching(true);
            try {
                const res = await axios.get('api/customer/get-customer', {
                    params: { nama: searchTerm }
                });
                setSearchResults(res.data.customers || []);
            } catch (err) {
                console.error(err);
            } finally {
                setSearching(false);
            }
        }, 500);

        fetchData();
        return () => fetchData.cancel();
    }, [searchTerm, data.id_customer]);

    const handleSelect = (customer) => {
        setData({ 
            ...data, 
            id_customer: customer.id,
            customer_name: customer.nama 
        });
        setSearchTerm(customer.nama);
        setSearchResults([]);
        checkWhatsApp(customer.telpon);
    };

    const handleClearSelection = () => {
        setData({ ...data, id_customer: '', customer_name: '' });
        setSearchTerm('');
        setSearchResults([]);
        setWaStatus(null);
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered className="modal-premium">
            <ModalHeader toggle={toggle} className="border-0 pb-0">
                <h3 className="mb-0 font-weight-bold">
                    {data.id_customer ? 'Top-up Saldo Pelanggan' : 'Top-up Baru (Umum)'}
                </h3>
            </ModalHeader>
            <ModalBody className="py-4">
                {/* Customer Selector for "General" Plus button */}
                {!data.fixedCustomer && (
                    <FormGroup className="position-relative">
                        <Label className="form-control-label">Pilih Pelanggan</Label>
                        <InputGroup className="input-group-alternative mb-2 shadow-none border rounded-lg overflow-hidden">
                            <InputGroupText className="bg-white border-0"><i className="fas fa-search" /></InputGroupText>
                            <Input
                                placeholder="Cari nama pelanggan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0"
                            />
                            {searching && <InputGroupText className="bg-white border-0"><Spinner size="sm" /></InputGroupText>}
                        </InputGroup>
                        
                        {searchResults.length > 0 && (
                            <ListGroup className="position-absolute w-100 shadow-lg border-0" style={{ zIndex: 1050, maxHeight: 250, overflowY: 'auto', borderRadius: '12px' }}>
                                {searchResults.map(c => (
                                    <ListGroupItem 
                                        key={c.id} 
                                        action 
                                        onClick={() => handleSelect(c)}
                                        className="d-flex align-items-center py-3 border-bottom border-light"
                                        style={{ transition: 'all 0.2s' }}
                                    >
                                        <div style={{ width: 40, height: 40 }} className="me-3">
                                            <CustomerAvatar customer={c} size={40} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="font-weight-bold text-dark small">{c.nama}</div>
                                            <div className="text-muted d-flex align-items-center" style={{ fontSize: '0.72rem' }}>
                                                <i className="fab fa-whatsapp me-1 text-success" />
                                                {c.telpon}
                                            </div>
                                        </div>
                                        <i className="fas fa-chevron-right text-muted opacity-5" />
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        )}
                        {data.id_customer && (
                            <div className="mt-2 animate__animated animate__fadeIn d-flex align-items-center">
                                <Badge color="success" pill className="px-3 py-2 d-flex align-items-center text-white" style={{ fontSize: '0.75rem', gap: 10 }}>
                                    <span><i className="fas fa-check-circle me-1" /> Terpilih: {data.customer_name}</span>
                                    <i 
                                        className="fas fa-times-circle cursor-pointer ms-2 hover-scale" 
                                        style={{ opacity: 0.8, fontSize: '0.9rem' }}
                                        onClick={handleClearSelection}
                                        title="Hapus pilihan"
                                    />
                                </Badge>
                            </div>
                        )}
                    </FormGroup>
                )}

                {data.fixedCustomer && (
                    <div className="bg-light p-3 rounded-lg mb-4 d-flex align-items-center border">
                        <div style={{ width: 45, height: 45 }} className="me-3">
                            <CustomerAvatar customer={{ nama: data.customer_name, telpon: data.customer_phone }} size={45} />
                        </div>
                        <div>
                            <div className="font-weight-bold text-dark">{data.customer_name}</div>
                            <div className="text-muted small">Target Top-up</div>
                        </div>
                    </div>
                )}
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

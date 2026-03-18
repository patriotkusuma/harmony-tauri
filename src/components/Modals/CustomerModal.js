import { useState, useEffect } from 'react'; // Pastikan useEffect diimpor
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import CustomerAvatar from 'components/atoms/CustomerAvatar';
import { whatsappInstance } from 'services/whatsapp-instance';
import { toast } from 'react-toastify';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const COUNTRY_LIST = [
    { code: '62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '65', flag: '🇸🇬', name: 'Singapore' },
    { code: '66', flag: '🇹🇭', name: 'Thailand' },
    { code: '63', flag: '🇵🇭', name: 'Philippines' },
    { code: '84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '886', flag: '🇹🇼', name: 'Taiwan' },
    { code: '81', flag: '🇯🇵', name: 'Japan' },
    { code: '82', flag: '🇰🇷', name: 'South Korea' },
    { code: '86', flag: '🇨🇳', name: 'China' },
    { code: '91', flag: '🇮🇳', name: 'India' },
    { code: '92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '971', flag: '🇦🇪', name: 'UAE' },
    { code: '61', flag: '🇦🇺', name: 'Australia' },
    { code: '64', flag: '🇳🇿', name: 'New Zealand' },
    { code: '1', flag: '🇺🇸', name: 'USA' },
    { code: '1', flag: '🇨🇦', name: 'Canada' },
    { code: '44', flag: '🇬🇧', name: 'UK' },
    { code: '33', flag: '🇫🇷', name: 'France' },
    { code: '49', flag: '🇩🇪', name: 'Germany' },
    { code: '39', flag: '🇮🇹', name: 'Italy' },
    { code: '34', flag: '🇪🇸', name: 'Spain' },
    { code: '7', flag: '🇷🇺', name: 'Russia' },
    { code: '55', flag: '🇧🇷', name: 'Brazil' },
    { code: '52', flag: '🇲🇽', name: 'Mexico' },
    { code: '27', flag: '🇿🇦', name: 'South Africa' },
    { code: '234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '20', flag: '🇪🇬', name: 'Egypt' },
    { code: '90', flag: '🇹🇷', name: 'Turkey' },
    { code: '31', flag: '🇳🇱', name: 'Netherlands' },
    { code: '41', flag: '🇨🇭', name: 'Switzerland' },
    { code: '46', flag: '🇸🇪', name: 'Sweden' },
    { code: '32', flag: '🇧🇪', name: 'Belgium' },
    { code: '43', flag: '🇦🇹', name: 'Austria' },
    { code: '47', flag: '🇳🇴', name: 'Norway' },
    { code: '45', flag: '🇩🇰', name: 'Denmark' },
    { code: '358', flag: '🇫🇮', name: 'Finland' },
    { code: '353', flag: '🇮🇪', name: 'Ireland' },
    { code: '351', flag: '🇵🇹', name: 'Portugal' },
    { code: '30', flag: '🇬🇷', name: 'Greece' },
    { code: '48', flag: '🇵🇱', name: 'Poland' },
    { code: '420', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '36', flag: '🇭🇺', name: 'Hungary' },
    { code: '40', flag: '🇷🇴', name: 'Romania' },
    { code: '372', flag: '🇪🇪', name: 'Estonia' },
    { code: '371', flag: '🇱🇻', name: 'Latvia' },
    { code: '370', flag: '🇱🇹', name: 'Lithuania' },
    { code: '380', flag: '🇺🇦', name: 'Ukraine' },
    { code: '359', flag: '🇧🇬', name: 'Bulgaria' },
    { code: '385', flag: '🇭🇷', name: 'Croatia' },
    { code: '381', flag: '🇷🇸', name: 'Serbia' },
    { code: '421', flag: '🇸🇰', name: 'Slovakia' },
    { code: '386', flag: '🇸🇮', name: 'Slovenia' },
    { code: '352', flag: '🇱🇺', name: 'Luxembourg' },
    { code: '356', flag: '🇲🇹', name: 'Malta' },
    { code: '354', flag: '🇮🇸', name: 'Iceland' },
    { code: '357', flag: '🇨🇾', name: 'Cyprus' },
    { code: '972', flag: '🇮🇱', name: 'Israel' },
    { code: '962', flag: '🇯🇴', name: 'Jordan' },
    { code: '961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '974', flag: '🇶🇦', name: 'Qatar' },
    { code: '968', flag: '🇴🇲', name: 'Oman' },
    { code: '973', flag: '🇧🇭', name: 'Bahrain' },
    { code: '964', flag: '🇮🇶', name: 'Iraq' },
    { code: '98', flag: '🇮🇷', name: 'Iran' },
    { code: '93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '977', flag: '🇳🇵', name: 'Nepal' },
    { code: '960', flag: '🇲🇻', name: 'Maldives' },
    { code: '95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '855', flag: '🇰🇭', name: 'Cambodia' },
    { code: '856', flag: '🇱🇦', name: 'Laos' },
    { code: '673', flag: '🇧🇳', name: 'Brunei' },
    { code: '853', flag: '🇲🇴', name: 'Macau' },
    { code: '976', flag: '🇲🇳', name: 'Mongolia' },
    { code: '998', flag: '🇺🇿', name: 'Uzbekistan' },
    { code: '7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '992', flag: '🇹🇯', name: 'Tajikistan' },
    { code: '993', flag: '🇹🇲', name: 'Turkmenistan' },
    { code: '996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: '994', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: '374', flag: '🇦🇲', name: 'Armenia' },
    { code: '995', flag: '🇬🇪', name: 'Georgia' },
    { code: '212', flag: '🇲🇦', name: 'Morocco' },
    { code: '213', flag: '🇩🇿', name: 'Algeria' },
    { code: '216', flag: '🇹🇳', name: 'Tunisia' },
    { code: '218', flag: '🇱🇾', name: 'Libya' },
    { code: '249', flag: '🇸🇩', name: 'Sudan' },
    { code: '251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: '254', flag: '🇰🇪', name: 'Kenya' },
    { code: '255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '256', flag: '🇺🇬', name: 'Uganda' },
    { code: '233', flag: '🇬🇭', name: 'Ghana' },
    { code: '225', flag: '🇨🇮', name: 'Ivory Coast' },
    { code: '221', flag: '🇸🇳', name: 'Senegal' },
    { code: '237', flag: '🇨🇲', name: 'Cameroon' },
    { code: '244', flag: '🇦🇴', name: 'Angola' },
    { code: '263', flag: '🇿🇼', name: 'Zimbabwe' },
    { code: '2 Zambian code 60', flag: '🇿🇲', name: 'Zambia' }, // Note: skip complex codes, keep major
    { code: '260', flag: '🇿🇲', name: 'Zambia' },
    { code: '267', flag: '🇧🇼', name: 'Botswana' },
    { code: '2 Namibia 64', flag: '🇳🇦', name: 'Namibia' },
    { code: '264', flag: '🇳🇦', name: 'Namibia' },
    { code: '230', flag: '🇲🇺', name: 'Mauritius' },
    { code: '54', flag: '🇦🇷', name: 'Argentina' },
    { code: '56', flag: '🇨🇱', name: 'Chile' },
    { code: '57', flag: '🇨🇴', name: 'Colombia' },
    { code: '58', flag: '🇻🇪', name: 'Venezuela' },
    { code: '51', flag: '🇵🇪', name: 'Peru' },
    { code: '593', flag: '🇪🇨', name: 'Ecuador' },
    { code: '591', flag: '🇧🇴', name: 'Bolivia' },
    { code: '595', flag: '🇵🇾', name: 'Paraguay' },
    { code: '598', flag: '🇺🇾', name: 'Uruguay' },
    { code: '506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '507', flag: '🇵🇦', name: 'Panama' },
    { code: '502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '504', flag: '🇭🇳', name: 'Honduras' },
    { code: '505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '53', flag: '🇨🇺', name: 'Cuba' },
    { code: '1', flag: '🇯🇲', name: 'Jamaica' },
    { code: '1', flag: '🇹🇹', name: 'Trinidad and Tobago' },
    { code: '423', flag: '🇱🇮', name: 'Liechtenstein' },
    { code: '377', flag: '🇲🇨', name: 'Monaco' },
    { code: '378', flag: '🇸🇲', name: 'San Marino' },
    { code: '376', flag: '🇦🇩', name: 'Andorra' },
    { code: '39', flag: '🇻🇦', name: 'Vatican City' },
];

const CustomerModal = ({
    isOpen,
    toggle,
    nama,
    setNama,
    telpon,
    setTelpon,
    pelanggan, // Sekarang akan selalu berupa array []
    onSelectCustomer,
    resetCustomer
}) => {
    const [hoveredCustomerId, setHoveredCustomerId] = useState(0);

    // Gunakan state ini untuk mengontrol tampilan search/selected
    const [isSearchingMode, setIsSearchingMode] = useState(false);
    const [isCheckingWA, setIsCheckingWA] = useState(false);
    const [waStatus, setWaStatus] = useState(null); // null, 'loading', 'active', 'inactive'

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    const customerSelected = !!nama || !!telpon;

    useEffect(() => {
        // Saat modal dibuka, jika belum ada customer terpilih, masuk mode pencarian
        if (isOpen && !customerSelected) {
            setIsSearchingMode(true);
        } else if (!isOpen) {
            // Saat modal ditutup, reset mode pencarian
            setIsSearchingMode(false);
        }
    }, [isOpen, customerSelected]);

    const handleSelect = (customer) => {
        onSelectCustomer(customer);
        setIsSearchingMode(false); // Keluar dari mode pencarian setelah memilih
        // toggle(); // Anda bisa memilih untuk menutup modal otomatis di sini
    };

    const handleClearSelection = () => {
        resetCustomer(); // Ini akan mengosongkan nama, telpon, idPelanggan di useCustomer
        setIsSearchingMode(true); // Masuk mode pencarian untuk memungkinkan input baru
    };

    const handleCheckWhatsApp = async () => {
        if (!telpon) {
            toast.warning("Masukkan nomor telepon terlebih dahulu");
            return;
        }

        setIsCheckingWA(true);
        setWaStatus('loading');

        try {
            // The 'telpon' state is now pre-formatted (e.g., 628123...)
            // Ensure it's purely digits and append JID suffix for the API
            let jid = telpon.replace(/\D/g, '') + "@s.whatsapp.net";
            
            // Call API v2 user check
            const response = await whatsappInstance.get('/user/check', {
                params: { phone: jid },
                headers: { 'X-Device-Id': 'harmony-gebang' }
            });

            const isOnWA = response.data?.results?.is_on_whatsapp;
            setWaStatus(isOnWA ? 'active' : 'inactive');
            
            if (isOnWA) {
                toast.success("Nomor ini terdaftar di WhatsApp");
            } else {
                toast.info("Nomor ini tidak terdaftar di WhatsApp");
            }
        } catch (error) {
            console.error("Error checking WhatsApp:", error);
            setWaStatus(null);
            toast.error("Gagal mengecek nomor WhatsApp");
        } finally {
            setIsCheckingWA(false);
        }
    };

    // Auto-check WhatsApp after typing (Debounce 1s)
    useEffect(() => {
        if (!telpon || telpon.length < 9) {
            setWaStatus(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            handleCheckWhatsApp();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [telpon]);

    return (
        <Modal centered size="lg" isOpen={isOpen} autoFocus={false} toggle={toggle}>
            <ModalHeader toggle={toggle}>Identitas Customer</ModalHeader>
            <ModalBody>
                {customerSelected && !isSearchingMode ? (
                    <div className="text-center mb-3">
                        <h4 className="text-primary mt-2">Customer Terpilih:</h4>
                        <div style={{ width: '80px', height: '80px', margin: '0 auto', fontSize: '2rem' }} className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center bg-primary text-white my-3 shadow-sm font-weight-bold">
                            <CustomerAvatar customer={{ nama, telpon }} fallbackType="initials" />
                        </div>
                        <h3 className="mb-0">{nama || 'N/A'}</h3>
                        <p className="lead">{telpon || 'N/A'}</p>
                        <Button color="warning" onClick={handleClearSelection} className="mt-2">
                            Ganti Customer
                        </Button>
                    </div>
                ) : (
                    <>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="label-dark">Nama</Label>
                                    <Input
                                        className="dark-input"
                                        name="nama"
                                        id="nama"
                                        placeholder="Nama Pelanggan"
                                        autoFocus={true} // Tetap autoFocus
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label className="label-dark">Telpon / WA</Label>
                                    <div className="d-flex align-items-center">
                                        <div style={{ marginRight: '8px' }}>
                                            <Dropdown isOpen={isDropdownOpen} toggle={() => setIsDropdownOpen(!isDropdownOpen)}>
                                                <DropdownToggle 
                                                    caret 
                                                    className="dark-input px-2 d-flex align-items-center justify-content-between"
                                                    style={{ width: '100px', height: '44px', borderRadius: '0.375rem', fontSize: '1rem', border: '1px solid #d1d9e6', background: '#f4f5f7' }}
                                                >
                                                    {(() => {
                                                        const found = COUNTRY_LIST.find(c => telpon.startsWith(c.code));
                                                        return found ? `${found.flag} +${found.code}` : "🇮🇩 +62";
                                                    })()}
                                                </DropdownToggle>
                                                <DropdownMenu 
                                                    style={{ 
                                                        maxHeight: '300px', 
                                                        overflowY: 'auto', 
                                                        width: '250px', 
                                                        padding: '10px',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <div className="p-2 mb-2 sticky-top bg-white" style={{ top: '-10px', zIndex: 10 }}>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Cari negara/kode..." 
                                                            className="form-control-sm"
                                                            value={countrySearch}
                                                            onChange={(e) => setCountrySearch(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                                                            autoFocus
                                                        />
                                                    </div>
                                                    {COUNTRY_LIST.filter(c => 
                                                        c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                                                        c.code.includes(countrySearch)
                                                    ).map(country => (
                                                        <DropdownItem 
                                                            key={`${country.code}-${country.name}`}
                                                            onClick={() => {
                                                                const newCode = country.code;
                                                                const currentFound = COUNTRY_LIST.find(c => telpon.startsWith(c.code));
                                                                const oldCode = currentFound ? currentFound.code : '62';
                                                                const rest = telpon.startsWith(oldCode) ? telpon.substring(oldCode.length) : telpon;
                                                                setTelpon(newCode + rest);
                                                                setCountrySearch('');
                                                            }}
                                                            className="d-flex align-items-center py-2"
                                                        >
                                                            <span className="mr-2" style={{ fontSize: '1.2rem' }}>{country.flag}</span>
                                                            <span className="flex-fill">{country.name}</span>
                                                            <span className="text-muted small">+{country.code}</span>
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <Input
                                            className="dark-input"
                                            name="telpon"
                                            id="telpon"
                                            placeholder="812xxxxxx"
                                            style={{ height: '44px' }}
                                            value={(() => {
                                                const found = COUNTRY_LIST.find(c => telpon.startsWith(c.code));
                                                return found ? telpon.substring(found.code.length) : telpon;
                                            })()}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, '');
                                                const found = COUNTRY_LIST.find(c => telpon.startsWith(c.code));
                                                const code = found ? found.code : '62';
                                                
                                                if (val.startsWith('0')) val = val.substring(1);
                                                if (val.startsWith(code)) val = val.substring(code.length);
                                                
                                                setTelpon(code + val);
                                            }}
                                        />
                                        <div className="ml-2" style={{ width: '25px' }}>
                                            {isCheckingWA ? (
                                                <i className="fas fa-spinner fa-spin text-info" />
                                            ) : waStatus === 'active' ? (
                                                <i className="fas fa-check-circle text-success" />
                                            ) : waStatus === 'inactive' ? (
                                                <i className="fas fa-times-circle text-danger" />
                                            ) : (
                                                <i className="fab fa-whatsapp text-muted opacity-5" />
                                            )}
                                        </div>
                                    </div>
                                    {waStatus === 'active' && <small className="text-success font-weight-bold ml-1">Terdaftar di WhatsApp</small>}
                                    {waStatus === 'inactive' && <small className="text-danger font-weight-bold ml-1">Tidak terdaftar di WhatsApp</small>}
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* Tampilan saran pelanggan */}
                        <Col className="mt-2">
                            {/* Hanya tampilkan saran jika ada hasil dan sedang mencari */}
                            {isSearchingMode && pelanggan?.length > 0 && (
                                <div className="mt-2">
                                    <h5>Saran Pelanggan:</h5>
                                    <Row className="px-2 mt-2">
                                    {pelanggan.map((plg) => (
                                        <Col md="6" xs="12" key={plg.id} className="px-1">
                                            <Button
                                                className="w-100 mb-2 text-left p-2 shadow-sm"
                                                onClick={() => handleSelect(plg)}
                                                color={hoveredCustomerId === plg.id ? 'default' : 'white'}
                                                onMouseEnter={() => setHoveredCustomerId(plg.id)}
                                                onMouseLeave={() => setHoveredCustomerId(0)}
                                                style={{ display: 'flex', alignItems: 'center', whiteSpace: 'normal', borderRadius: '10px' }}
                                            >
                                                <div style={{ width: '45px', height: '45px', overflow: 'hidden', marginRight: '12px' }} className={`rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center font-weight-bold ${hoveredCustomerId === plg.id ? 'bg-white text-default' : 'bg-primary text-white'}`}>
                                                    <CustomerAvatar customer={plg} fallbackType="initials" />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="font-weight-bold text-truncate" style={{ fontSize: '0.95rem' }} title={plg.nama}>{plg.nama}</div>
                                                    <div className={`text-truncate text-sm ${hoveredCustomerId === plg.id ? "text-light" : "text-muted"}`}>
                                                        <i className="fab fa-whatsapp mr-1"></i>{plg.telpon}
                                                    </div>
                                                    {plg.keterangan && <div className={`text-xs mt-1 text-truncate ${hoveredCustomerId === plg.id ? 'text-white' : 'text-primary'}`} title={plg.keterangan}>({plg.keterangan})</div>}
                                                </div>
                                            </Button>
                                        </Col>
                                    ))}
                                    </Row>
                                </div>
                            )}
                            {/* Kondisi untuk pesan loading/tidak ditemukan */}
                            {isSearchingMode && (nama || telpon) && pelanggan?.length === 0 && (
                                <p className="text-muted mt-2">Tidak ada pelanggan ditemukan.</p>
                            )}
                            {isSearchingMode && !nama && !telpon && pelanggan?.length === 0 && (
                                <p className="text-muted mt-2">Mulai ketik untuk mencari pelanggan.</p>
                            )}
                        </Col>
                    </>
                )}
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
                <Button color="secondary" onClick={toggle}>
                    Batal
                </Button>
                <Button color="primary" onClick={toggle}> {/* Tombol OK/Simpan hanya menutup modal setelah interaksi */}
                    OK
                </Button>
            </ModalFooter>
            <style>{`
                .dark-input {
                    background-color: #f4f5f7 !important;
                    border: 1px solid #d1d9e6 !important;
                    color: #2d3436 !important;
                    font-weight: 500 !important;
                    transition: all 0.2s ease;
                }
                .dark-input:focus {
                    background-color: #fff !important;
                    border-color: #5e72e4 !important;
                    box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02) !important;
                }
                .label-dark {
                    color: #525f7f !important;
                    font-weight: 600;
                    letter-spacing: 0.025em;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .modal-content {
                    border-radius: 1.25rem !important;
                    border: none !important;
                    box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) !important;
                }
                .modal-header {
                    border-bottom: 1px solid #f4f5f7 !important;
                    padding: 1.5rem !important;
                }
                .modal-footer {
                    border-top: 1px solid #f4f5f7 !important;
                }
            `}</style>
        </Modal>
    );
};

export default CustomerModal;
/* ================================================================
   Kasir — Modal: CustomerModal
   ----------------------------------------------------------------
   Tugasnya cuma satu: memilih pelanggan secepat mungkin.
   - Satu kolom, klik baris langsung memilih & menutup modal.
   - Nama baru bisa disimpan lewat tombol "Pakai Nama Ini".
   - Query pencarian dipisah dari data pelanggan yang sudah dipilih.
   ================================================================ */
import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from 'reactstrap';
import InitialsAvatar from 'components/atoms/customer/InitialsAvatar';
import CustomerInsightLine from 'components/molecules/customer/CustomerInsightLine';
import { COUNTRY_LIST } from 'utils/countryList';
import { whatsappInstance } from 'services/whatsapp-instance';
import { toast } from 'react-toastify';

const DEFAULT_COUNTRY = '62';

const CustomerModal = ({
    isOpen,
    toggle,
    pelanggan = [],
    isSearchingCustomers = false,
    onSearch,
    onSelectCustomer,
    onUseNewCustomer,
}) => {
    // State pencarian sengaja lokal. Data pelanggan terpilih tetap di hook induk.
    const [queryNama, setQueryNama] = useState('');
    const [phoneBody, setPhoneBody] = useState('');
    const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
    const [countryOpen, setCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [waStatus, setWaStatus] = useState(null);
    const [isCheckingWa, setIsCheckingWa] = useState(false);

    const selectedCountry = COUNTRY_LIST.find((c) => c.code === countryCode) || COUNTRY_LIST[0];
    const fullPhone = phoneBody ? `${countryCode}${phoneBody}` : '';
    const trimmedName = queryNama.trim();
    const hasQuery = Boolean(trimmedName || phoneBody);
    const canUseNew = trimmedName.length > 0;

    const filteredCountries = useMemo(() => {
        const keyword = countrySearch.trim().toLowerCase();
        if (!keyword) return COUNTRY_LIST;
        return COUNTRY_LIST.filter(
            (c) => c.name.toLowerCase().includes(keyword) || c.code.includes(keyword)
        );
    }, [countrySearch]);

    // Saat modal ditutup, bersihkan pencarian. Saat dibuka, mulai dari kosong.
    useEffect(() => {
        if (!isOpen) {
            setQueryNama('');
            setPhoneBody('');
            setCountryCode(DEFAULT_COUNTRY);
            setCountrySearch('');
            setCountryOpen(false);
            setWaStatus(null);
            setIsCheckingWa(false);
            onSearch?.('', '');
            return;
        }

        onSearch?.('', '');
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Pencarian berjalan saat nama atau nomor berubah.
    useEffect(() => {
        if (!isOpen) return;

        const searchPhone = phoneBody.length >= 3 ? fullPhone : '';

        if (!trimmedName && !searchPhone) {
            onSearch?.('', '');
            return;
        }

        onSearch?.(trimmedName, searchPhone);
    }, [isOpen, trimmedName, fullPhone, phoneBody.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePhoneChange = (event) => {
        let digits = event.target.value.replace(/\D/g, '');

        if (digits.startsWith('0')) digits = digits.slice(1);
        if (digits.startsWith(countryCode)) digits = digits.slice(countryCode.length);

        setPhoneBody(digits);
        setWaStatus(null);
    };

    const handleCheckWhatsApp = async () => {
        if (!fullPhone || fullPhone.length < 9) {
            toast.warning('Isi nomor WhatsApp dulu ya.');
            return;
        }

        setIsCheckingWa(true);
        setWaStatus('loading');

        try {
            const jid = `${fullPhone.replace(/\D/g, '')}@s.whatsapp.net`;
            const response = await whatsappInstance.get('/user/check', {
                params: { phone: jid },
                headers: { 'X-Device-Id': 'harmony-gebang' },
            });

            const isOnWa = response.data?.results?.is_on_whatsapp;
            setWaStatus(isOnWa ? 'active' : 'inactive');
        } catch (error) {
            console.error('Error checking WhatsApp:', error);
            setWaStatus(null);
            toast.error('Gagal mengecek nomor WhatsApp.');
        } finally {
            setIsCheckingWa(false);
        }
    };

    const handleSelect = (customer) => {
        onSelectCustomer?.(customer);
        onSearch?.('', '');
        toggle?.();
    };

    const handleUseNew = () => {
        if (!canUseNew) return;

        onUseNewCustomer?.({ nama: trimmedName, telpon: fullPhone });
        onSearch?.('', '');
        toggle?.();
    };

    return (
        <Modal
            centered
            size="lg"
            isOpen={isOpen}
            autoFocus={false}
            toggle={toggle}
            contentClassName="customer-picker__content"
        >
            <ModalHeader toggle={toggle} className="customer-picker__header">
                <span className="customer-picker__title">Pilih Pelanggan</span>
                <span className="customer-picker__subtitle">
                    Cari pelanggan lama, atau ketik nama untuk pelanggan baru.
                </span>
            </ModalHeader>

            <ModalBody className="p-0">
                <div className="customer-picker__search">
                    <div className="customer-picker__field">
                        <label className="customer-picker__label" htmlFor="customer-search-name">
                            Nama pelanggan
                        </label>
                        <Input
                            id="customer-search-name"
                            autoFocus
                            className="customer-picker__input"
                            placeholder="Ketik sebagian nama..."
                            value={queryNama}
                            onChange={(e) => setQueryNama(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="customer-picker__field">
                        <label className="customer-picker__label" htmlFor="customer-search-phone">
                            Nomor WhatsApp <span>(opsional)</span>
                        </label>
                        <div className="customer-picker__phone">
                            <Dropdown
                                isOpen={countryOpen}
                                toggle={() => setCountryOpen((prev) => !prev)}
                            >
                                <DropdownToggle caret className="customer-picker__country">
                                    <span>{selectedCountry.flag}</span>
                                    <span>+{selectedCountry.code}</span>
                                </DropdownToggle>
                                <DropdownMenu
                                    end
                                    className="customer-picker__country-menu"
                                >
                                    <div className="customer-picker__country-search">
                                        <Input
                                            type="text"
                                            placeholder="Cari negara / kode..."
                                            value={countrySearch}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                        />
                                    </div>
                                    {filteredCountries.map((country) => (
                                        <DropdownItem
                                            key={`${country.code}-${country.name}`}
                                            onClick={() => {
                                                setCountryCode(country.code);
                                                setCountryOpen(false);
                                                setCountrySearch('');
                                                setWaStatus(null);
                                            }}
                                            className="d-flex align-items-center"
                                        >
                                            <span className="me-2">{country.flag}</span>
                                            <span className="flex-fill">{country.name}</span>
                                            <span className="text-muted small">+{country.code}</span>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                            <Input
                                id="customer-search-phone"
                                className="customer-picker__input customer-picker__phone-input"
                                inputMode="tel"
                                placeholder="81234567890"
                                value={phoneBody}
                                onChange={handlePhoneChange}
                                autoComplete="off"
                            />

                            <button
                                type="button"
                                className={`customer-picker__wa-check ${waStatus === 'active' ? 'is-active' : ''} ${waStatus === 'inactive' ? 'is-inactive' : ''}`}
                                onClick={handleCheckWhatsApp}
                                disabled={isCheckingWa || phoneBody.length < 3}
                                title="Cek nomor ini terdaftar di WhatsApp"
                                aria-label="Cek nomor WhatsApp"
                            >
                                {isCheckingWa ? (
                                    <i className="fas fa-spinner fa-spin" />
                                ) : waStatus === 'active' ? (
                                    <i className="fas fa-check-circle" />
                                ) : waStatus === 'inactive' ? (
                                    <i className="fas fa-times-circle" />
                                ) : (
                                    <i className="fab fa-whatsapp" />
                                )}
                            </button>
                        </div>
                        {waStatus === 'active' && (
                            <small className="customer-picker__wa-note is-active">Nomor terdaftar di WhatsApp</small>
                        )}
                        {waStatus === 'inactive' && (
                            <small className="customer-picker__wa-note is-inactive">Nomor belum terdaftar di WhatsApp</small>
                        )}
                    </div>
                </div>

                <div className="customer-picker__results slim-scroll">
                    {isSearchingCustomers ? (
                        <div className="customer-picker__state">
                            <i className="fas fa-circle-notch fa-spin" />
                            <span>Mencari pelanggan...</span>
                        </div>
                    ) : !hasQuery ? (
                        <div className="customer-picker__state customer-picker__state--muted">
                            <i className="fas fa-search" />
                            <span>Mulai ketik nama atau nomor WhatsApp.</span>
                        </div>
                    ) : pelanggan.length > 0 ? (
                        <>
                            <div className="customer-picker__result-count">
                                {pelanggan.length} pelanggan ditemukan
                            </div>
                            {pelanggan.map((plg) => (
                                <button
                                    key={plg.id ?? `${plg.nama}-${plg.telpon}`}
                                    type="button"
                                    className="customer-picker__row"
                                    onClick={() => handleSelect(plg)}
                                >
                                    <InitialsAvatar name={plg.nama} size={42} />
                                    <span className="customer-picker__row-body">
                                        <span className="customer-picker__row-top">
                                            <span className="customer-picker__row-name">{plg.nama}</span>
                                            {plg.telpon && (
                                                <span className="customer-picker__row-phone">
                                                    <i className="fab fa-whatsapp" /> {plg.telpon}
                                                </span>
                                            )}
                                        </span>
                                        <CustomerInsightLine insights={plg.insights} showDebt size="xs" />
                                        {plg.keterangan && (
                                            <span className="customer-picker__row-note">{plg.keterangan}</span>
                                        )}
                                    </span>
                                    <i className="fas fa-chevron-right customer-picker__row-arrow" />
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className="customer-picker__empty">
                            <i className="fas fa-user-plus" />
                            <div>
                                <strong>Belum ada pelanggan yang cocok.</strong>
                                <span>Kalau ini pelanggan baru, pakai tombol “Pakai Nama Ini” di bawah.</span>
                            </div>
                        </div>
                    )}
                </div>
            </ModalBody>

            <ModalFooter className="customer-picker__footer">
                <Button color="link" className="customer-picker__cancel" onClick={toggle}>
                    Batal
                </Button>

                <div className="customer-picker__footer-right">
                    <span className="customer-picker__new-hint">Pelanggan baru?</span>
                    <Button
                        color="primary"
                        className="customer-picker__new-btn"
                        disabled={!canUseNew}
                        onClick={handleUseNew}
                    >
                        <i className="fas fa-user-plus me-2" />
                        Pakai Nama Ini
                    </Button>
                </div>
            </ModalFooter>

            <style>{`
                .customer-picker__content {
                    border: 0 !important;
                    border-radius: 18px !important;
                    overflow: hidden;
                    box-shadow: 0 24px 60px rgba(50,50,93,0.22), 0 8px 20px rgba(0,0,0,0.08);
                }
                .customer-picker__header {
                    border-bottom: 1px solid #eef0f5 !important;
                    padding: 16px 20px !important;
                    align-items: flex-start;
                }
                .customer-picker__header .btn-close {
                    margin-top: 1px;
                }
                .customer-picker__title {
                    display: block;
                    font-size: 1.12rem;
                    font-weight: 800;
                    color: #32325d;
                    line-height: 1.2;
                }
                .customer-picker__subtitle {
                    display: block;
                    margin-top: 3px;
                    font-size: 0.76rem;
                    font-weight: 600;
                    color: #8898aa;
                }
                .customer-picker__search {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    padding: 14px 18px;
                    background: #f8f9fe;
                    border-bottom: 1px solid #eef0f5;
                }
                .customer-picker__field { min-width: 0; }
                .customer-picker__label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #6b7c93;
                }
                .customer-picker__label span {
                    font-weight: 600;
                    text-transform: none;
                    letter-spacing: 0;
                    color: #a3aed0;
                }
                .customer-picker__input {
                    height: 42px;
                    border: 1px solid #dfe3eb !important;
                    border-radius: 10px !important;
                    background: #fff !important;
                    color: #32325d !important;
                    font-size: 0.86rem !important;
                    font-weight: 600 !important;
                    box-shadow: none !important;
                }
                .customer-picker__input:focus {
                    border-color: #5e72e4 !important;
                    box-shadow: 0 0 0 3px rgba(94,114,228,0.12) !important;
                }
                .customer-picker__phone {
                    display: flex;
                    align-items: stretch;
                    gap: 6px;
                }
                .customer-picker__phone .dropdown { flex-shrink: 0; }
                .customer-picker__country {
                    height: 42px;
                    min-width: 84px;
                    padding: 0 10px;
                    border: 1px solid #dfe3eb !important;
                    border-radius: 10px !important;
                    background: #fff !important;
                    color: #525f7f !important;
                    font-size: 0.78rem !important;
                    font-weight: 800 !important;
                    box-shadow: none !important;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                .customer-picker__country-menu {
                    min-width: 260px;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #eef0f5;
                    border-radius: 12px;
                    box-shadow: 0 14px 30px rgba(50,50,93,0.16);
                    padding: 8px;
                }
                .customer-picker__country-search {
                    position: sticky;
                    top: -8px;
                    z-index: 2;
                    background: #fff;
                    padding: 4px 4px 8px;
                }
                .customer-picker__country-search input {
                    height: 34px;
                    font-size: 0.78rem;
                }
                .customer-picker__country-menu .dropdown-item {
                    border-radius: 8px;
                    font-size: 0.8rem;
                    padding: 8px 10px;
                }
                .customer-picker__phone-input { flex: 1; min-width: 0; }
                .customer-picker__wa-check {
                    width: 42px;
                    flex-shrink: 0;
                    border: 1px solid #dfe3eb;
                    border-radius: 10px;
                    background: #fff;
                    color: #2dce89;
                    font-size: 0.95rem;
                    transition: all 0.15s ease;
                }
                .customer-picker__wa-check:hover:not(:disabled) { background: #f0fbf6; border-color: #2dce89; }
                .customer-picker__wa-check:disabled { color: #c8d0dd; cursor: not-allowed; }
                .customer-picker__wa-check.is-active { background: #f0fbf6; border-color: #2dce89; }
                .customer-picker__wa-check.is-inactive { color: #f5365c; background: #fff5f7; border-color: rgba(245,54,92,0.35); }
                .customer-picker__wa-note {
                    display: inline-block;
                    margin-top: 4px;
                    font-size: 0.68rem;
                    font-weight: 700;
                }
                .customer-picker__wa-note.is-active { color: #1a8f5e; }
                .customer-picker__wa-note.is-inactive { color: #f5365c; }
                .customer-picker__results {
                    min-height: 230px;
                    max-height: min(48vh, 390px);
                    overflow-y: auto;
                    padding: 12px 14px 6px;
                    background: #fff;
                }
                .customer-picker__result-count {
                    padding: 0 4px 7px;
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #a3aed0;
                }
                .customer-picker__row {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    width: 100%;
                    padding: 10px 11px;
                    margin-bottom: 8px;
                    border: 1px solid #eef0f5;
                    border-radius: 12px;
                    background: #fff;
                    text-align: left;
                    cursor: pointer;
                    transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
                }
                .customer-picker__row:hover,
                .customer-picker__row:focus-visible {
                    border-color: #b9c2f4;
                    background: #f8f9ff;
                    transform: translateY(-1px);
                    outline: none;
                }
                .customer-picker__row-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
                .customer-picker__row-top {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 2px;
                }
                .customer-picker__row-name {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: #32325d;
                    line-height: 1.2;
                }
                .customer-picker__row-phone {
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #8898aa;
                    white-space: nowrap;
                }
                .customer-picker__row-phone i { color: #2dce89; }
                .customer-picker__row-note {
                    margin-top: 3px;
                    font-size: 0.68rem;
                    color: #8898aa;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .customer-picker__row-arrow {
                    font-size: 0.62rem;
                    color: #c8d0dd;
                    flex-shrink: 0;
                }
                .customer-picker__state,
                .customer-picker__empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 210px;
                    padding: 20px;
                    text-align: center;
                    color: #5e72e4;
                }
                .customer-picker__state i,
                .customer-picker__empty > i {
                    font-size: 1.4rem;
                    opacity: 0.75;
                }
                .customer-picker__state span {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #8898aa;
                }
                .customer-picker__state--muted i { color: #a3aed0; }
                .customer-picker__empty {
                    flex-direction: row;
                    justify-content: flex-start;
                    min-height: 0;
                    padding: 18px;
                    border: 1px dashed #d9def0;
                    border-radius: 12px;
                    background: #f8f9fe;
                    text-align: left;
                }
                .customer-picker__empty > i {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(94,114,228,0.1);
                    flex-shrink: 0;
                }
                .customer-picker__empty strong {
                    display: block;
                    font-size: 0.84rem;
                    color: #32325d;
                }
                .customer-picker__empty span {
                    display: block;
                    margin-top: 2px;
                    font-size: 0.72rem;
                    color: #8898aa;
                    line-height: 1.35;
                }
                .customer-picker__footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-top: 1px solid #eef0f5 !important;
                    padding: 12px 18px !important;
                    background: #fff;
                }
                .customer-picker__cancel {
                    padding: 0 !important;
                    color: #8898aa !important;
                    font-weight: 800 !important;
                    font-size: 0.8rem !important;
                    text-decoration: none !important;
                }
                .customer-picker__footer-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .customer-picker__new-hint {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #8898aa;
                }
                .customer-picker__new-btn {
                    border-radius: 10px !important;
                    padding: 8px 14px !important;
                    font-size: 0.8rem !important;
                    font-weight: 800 !important;
                    box-shadow: 0 4px 10px rgba(94,114,228,0.22) !important;
                }

                /* ── Dark mode ─────────────────────────────────────── */
                body.dark-mode .customer-picker__content {
                    background: #161b22;
                    box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 8px 20px rgba(0,0,0,0.45);
                }
                body.dark-mode .customer-picker__header {
                    background: #161b22;
                    border-bottom-color: rgba(255,255,255,0.06) !important;
                }
                body.dark-mode .customer-picker__header .btn-close { filter: invert(1) grayscale(1); opacity: .6; }
                body.dark-mode .customer-picker__title { color: #f1f5f9; }
                body.dark-mode .customer-picker__subtitle { color: #94a3b8; }
                body.dark-mode .customer-picker__search {
                    background: #111827;
                    border-bottom-color: rgba(255,255,255,0.06);
                }
                body.dark-mode .customer-picker__label { color: #94a3b8; }
                body.dark-mode .customer-picker__label span { color: #64748b; }
                body.dark-mode .customer-picker__input,
                body.dark-mode .customer-picker__country {
                    background: #0f172a !important;
                    border-color: rgba(255,255,255,0.12) !important;
                    color: #e2e8f0 !important;
                }
                body.dark-mode .customer-picker__input::placeholder { color: #64748b; }
                body.dark-mode .customer-picker__input:focus {
                    border-color: #60a5fa !important;
                    box-shadow: 0 0 0 3px rgba(96,165,250,0.15) !important;
                }
                body.dark-mode .customer-picker__country-menu {
                    background: #1e293b;
                    border-color: rgba(255,255,255,0.1);
                    box-shadow: 0 14px 30px rgba(0,0,0,0.7);
                }
                body.dark-mode .customer-picker__country-search { background: #1e293b; }
                body.dark-mode .customer-picker__country-menu .dropdown-item { color: #cbd5e1; }
                body.dark-mode .customer-picker__country-menu .dropdown-item:hover,
                body.dark-mode .customer-picker__country-menu .dropdown-item:focus {
                    background: #243247;
                    color: #93c5fd;
                }
                body.dark-mode .customer-picker__wa-check {
                    background: #1e293b;
                    border-color: rgba(255,255,255,0.12);
                    color: #4ade80;
                }
                body.dark-mode .customer-picker__wa-check:hover:not(:disabled) {
                    background: rgba(45,206,137,0.14);
                    border-color: #2dce89;
                }
                body.dark-mode .customer-picker__wa-check:disabled { color: #475569; }
                body.dark-mode .customer-picker__wa-check.is-active {
                    background: rgba(45,206,137,0.14);
                    border-color: #2dce89;
                }
                body.dark-mode .customer-picker__wa-check.is-inactive {
                    background: rgba(245,54,92,0.15);
                    border-color: rgba(245,54,92,0.4);
                    color: #fb7185;
                }
                body.dark-mode .customer-picker__wa-note.is-active { color: #4ade80; }
                body.dark-mode .customer-picker__wa-note.is-inactive { color: #fb7185; }
                body.dark-mode .customer-picker__results { background: #0f141b; }
                body.dark-mode .customer-picker__result-count { color: #64748b; }
                body.dark-mode .customer-picker__row {
                    background: #1e293b;
                    border-color: rgba(255,255,255,0.06);
                }
                body.dark-mode .customer-picker__row:hover,
                body.dark-mode .customer-picker__row:focus-visible {
                    background: #243247;
                    border-color: #3b82f6;
                }
                body.dark-mode .customer-picker__row-name { color: #f1f5f9; }
                body.dark-mode .customer-picker__row-phone { color: #94a3b8; }
                body.dark-mode .customer-picker__row-note { color: #94a3b8; }
                body.dark-mode .customer-picker__row-arrow { color: #475569; }
                body.dark-mode .customer-picker__state { color: #60a5fa; }
                body.dark-mode .customer-picker__state span { color: #94a3b8; }
                body.dark-mode .customer-picker__state--muted i { color: #475569; }
                body.dark-mode .customer-picker__empty {
                    background: #1e293b;
                    border-color: rgba(255,255,255,0.12);
                }
                body.dark-mode .customer-picker__empty > i {
                    background: rgba(96,165,250,0.14);
                }
                body.dark-mode .customer-picker__empty strong { color: #f1f5f9; }
                body.dark-mode .customer-picker__empty span { color: #94a3b8; }
                body.dark-mode .customer-picker__footer {
                    background: #161b22;
                    border-top-color: rgba(255,255,255,0.06) !important;
                }
                body.dark-mode .customer-picker__cancel { color: #94a3b8 !important; }
                body.dark-mode .customer-picker__new-hint { color: #94a3b8; }
                @media (max-width: 575.98px) {
                    .customer-picker__search { grid-template-columns: 1fr; }
                    .customer-picker__footer { flex-direction: column-reverse; align-items: stretch; }
                    .customer-picker__footer-right { justify-content: space-between; }
                    .customer-picker__new-hint { display: none; }
                    .customer-picker__new-btn { width: 100%; }
                    .customer-picker__results { max-height: 45vh; }
                    .customer-picker__cancel { text-align: center; }
                }
            `}</style>
        </Modal>
    );
};

export default CustomerModal;

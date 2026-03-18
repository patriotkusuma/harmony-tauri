import { useState, useCallback, useMemo } from 'react';
import moment from 'moment';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';
import desktopBridge from 'services/desktop-bridge';

// Sub-hooks
import useCart from './useChart';
import useCategory from './useCategory';
import useCustomer from './useCustomer';
import useHotkeys from './useHotKeys';

// Utils
import { calculateGrandTotal } from 'utils/laundryCalc';

const generateOrderCode = () => `HRMN-${moment().unix()}`;

export const useOrderManagement = () => {
    const authenticated = localStorage.getItem('token') || null;
    const [orderCode, setOrderCode] = useState(generateOrderCode);
    
    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
    }), [authenticated]);

    // Integrate Sub-hooks
    const { cartItems, estimasi, addCart, updateCart, removeOneCart, clearCart, subTotal } = useCart(authenticated);
    const { category, searchCategory } = useCategory(authenticated);
    
    const { nama, setNama, telpon, setTelpon, idPelanggan, pelanggan, selectCustomer, resetCustomer } = useCustomer(authenticated);

    // Local State
    const [isLunas, setIsLunas] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isRFIDAttachOpen, setIsRFIDAttachOpen] = useState(false);
    const [valueBayar, setValueBayar] = useState(0);
    const [antar, setAntar] = useState(0);

    const handlePrintNama = useCallback(async () => {
        if (!desktopBridge.hasNativePrint()) {
            toast.warning("Fitur Print Nama hanya tersedia di aplikasi Desktop.");
            return;
        }
        try {
            const res = await axios.get('api/pesanan/last-order', { headers });
            const order = res.data?.data;
            if (!order) {
                toast.info("Tidak ada last order untuk di-print namanya.");
                return;
            }
            await desktopBridge.printName(order);
        } catch (err) {
            console.error('[useOrderManagement] Error Print Nama:', err);
            toast.error("Gagal mengambil data last order.");
        }
    }, [headers]);

    const fetchAndPrintLastOrder = useCallback(async () => {
        try {
            const res = await axios.get('api/pesanan/last-order', { headers });
            if (desktopBridge.hasNativePrint()) {
                await desktopBridge.printLastOrder(res.data.data);
            } else {
                await axios.post('https://printer.test/last_order.php', { data: JSON.stringify(res.data.data) });
            }
            toast.success("Mencetak struk pesanan terakhir...");
        } catch (err) {
            console.error('[useOrderManagement] Error Last Order Print:', err);
            toast.error("Gagal mengambil data pesanan terakhir.");
        }
    }, [headers]);

    const submitOrder = useCallback(async () => {
        const loadingToast = toast.loading("Sedang memproses pesanan...");
        try {
            const res = await axios.post('api/pesanan/create-pesanan', {
                id_pelanggan: idPelanggan,
                kode_pesan: orderCode,
                nama: nama,
                telpon: telpon,
                status_pembayaran: isLunas ? 'Lunas' : 'Belum Lunas',
                sub_total: subTotal,
                total_bayar: valueBayar !== 0 ? valueBayar : 0,
                antar: antar
            }, { 
                headers,
                // Handle cases where backend might send multiple JSON objects concatenated
                transformResponse: [ (data) => {
                    if (typeof data === 'string') {
                        try {
                            // If we see two JSON objects concatenated like {...}{...}
                            if (data.includes('}{')) {
                                const parts = data.split('}{');
                                // The second part usually contains the full data
                                return JSON.parse('{' + parts[parts.length - 1]);
                            }
                            return JSON.parse(data);
                        } catch (e) {
                            console.error("[useOrderManagement] Response parse error:", e, data);
                            return data;
                        }
                    }
                    return data;
                }]
            });

            // Print - skip if it's a delivery/pickup order (antar > 0)
            if (antar === 0) {
                try {
                    if (desktopBridge.hasNativePrint()) {
                        await desktopBridge.printRaw(res.data.data);
                    } else {
                        await axios.post('https://printer.test/last_order.php', { data: JSON.stringify(res.data.data) });
                    }
                } catch (printErr) {
                    console.error('[useOrderManagement] Printing failed:', printErr);
                    toast.warning("Pesanan tersimpan, tapi gagal mencetak struk.");
                }
            }

            // Reset States
            clearCart();
            resetCustomer();
            setValueBayar(0);
            setIsCustomerModalOpen(false);
            setIsPaymentModalOpen(false);
            setAntar(0);
            setOrderCode(generateOrderCode()); // New code for next order
            
            toast.update(loadingToast, {
                render: "Pesanan berhasil dibuat!",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            console.error('[useOrderManagement] Submit Error:', err);
            toast.update(loadingToast, {
                render: "Gagal membuat pesanan.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }, [idPelanggan, orderCode, nama, telpon, isLunas, subTotal, valueBayar, antar, headers, clearCart, resetCustomer]);

    const handleOrderSubmission = useCallback(() => {
        if (isLunas) {
            setIsPaymentModalOpen(true);
        } else {
            submitOrder();
        }
    }, [isLunas, submitOrder]);

    const toggleCustomerModal = useCallback(() => setIsCustomerModalOpen(prev => !prev), []);
    const togglePaymentModal = useCallback(() => setIsPaymentModalOpen(prev => !prev), []);
    const toggleRFIDAttach = useCallback(() => setIsRFIDAttachOpen(prev => !prev), []);

    // Hotkeys mapping (stable handlers)
    const hotkeyMap = useMemo(() => ({
        openCustomerModal: { keyCode: 113, handler: () => setIsCustomerModalOpen(true) },           // F2
        printLastOrder:    { keyCode: 114, handler: fetchAndPrintLastOrder, preventDefault: true }, // F3
        rfidAttachModal:   { keyCode: 115, handler: () => setIsRFIDAttachOpen(true), preventDefault: true }, // F4
        printNama:         { keyCode: 116, handler: handlePrintNama, preventDefault: true },         // F5
        closeModals: { keyCode: 27, handler: () => {
            setIsCustomerModalOpen(false);
            setIsPaymentModalOpen(false);
            setIsRFIDAttachOpen(false);
        }}, // Escape
    }), [fetchAndPrintLastOrder, handlePrintNama]);

    useHotkeys(hotkeyMap);

    const isOrderButtonDisabled = !nama || !cartItems || Object.keys(cartItems).length === 0;

    return useMemo(() => ({
        cartItems,
        estimasi,
        subTotal,
        category,
        nama,
        setNama,
        telpon,
        setTelpon,
        pelanggan,
        idPelanggan,
        isLunas,
        setIsLunas,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isRFIDAttachOpen,
        setIsRFIDAttachOpen,
        valueBayar,
        setValueBayar,
        antar,
        setAntar,
        kode_pesan: orderCode,
        isOrderButtonDisabled,
        addCart,
        updateCart,
        removeOneCart,
        clearCart,
        searchCategory,
        selectCustomer,
        resetCustomer,
        handlePrintNama,
        fetchAndPrintLastOrder,
        submitOrder,
        handleOrderSubmission,
        toggleCustomerModal,
        togglePaymentModal,
        toggleRFIDAttach,
    }), [
        cartItems, estimasi, subTotal, category, nama, telpon, pelanggan, 
        idPelanggan, isLunas, isCustomerModalOpen, isPaymentModalOpen, 
        isRFIDAttachOpen, valueBayar, antar, orderCode, isOrderButtonDisabled,
        addCart, updateCart, removeOneCart, clearCart, searchCategory,
        selectCustomer, resetCustomer, handlePrintNama, fetchAndPrintLastOrder,
        submitOrder, handleOrderSubmission, toggleCustomerModal, togglePaymentModal,
        toggleRFIDAttach
    ]);
};

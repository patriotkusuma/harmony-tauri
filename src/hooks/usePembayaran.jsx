import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from '../services/axios-instance';
import { toast } from 'react-toastify';

export const usePembayaran = () => {
    const [authenticated] = useState(localStorage.getItem('token') || null);
    const [dataCustomer, setDataCustomer] = useState(null);
    const [filtered, setFiltered] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Modal & Form State
    const [isOpen, setIsOpen] = useState(false);
    const [valueBayar, setValueBayar] = useState('');
    const [tipeBayar, setTipeBayar] = useState('cash');
    const [bukti, setBukti] = useState(null);
    const [preview, setPreview] = useState(null);
    const timerRef = useRef(null);

    const userObj = useMemo(() => {
        try {
            const stored = localStorage.getItem("user");
            if (!stored || stored === "undefined" || stored === "null") return {};
            return JSON.parse(stored) || {};
        } catch (e) { return {}; }
    }, []);

    const userId = userObj.id || userObj.ID || userObj.username || 'default';
    const VIEW_MODE_KEY = `paymentViewMode_${userId}`;

    const [viewMode, setViewMode] = useState(() => {
        const saved = localStorage.getItem(VIEW_MODE_KEY);
        return saved === "legacy" ? "legacy" : "modern";
    });

    useEffect(() => {
        localStorage.setItem(VIEW_MODE_KEY, viewMode);
    }, [viewMode, VIEW_MODE_KEY]);

    const headers = useMemo(() => ({
        'Authorization': `Bearer ${authenticated}`,
        'Content-Type': 'multipart/form-data'
    }), [authenticated]);

    const getCustomer = useCallback(async (search = '') => {
        if (!authenticated) return;
        setLoading(true);
        try {
            const res = await axios.get(`api/v2/customer/has-bill?search=${search}`);
            const mapped = res.data.items.map(item => {
                const flatOrders = item.bills.reduce((acc, bill) => {
                    if (bill.orders && Array.isArray(bill.orders)) {
                        const mappedOrders = bill.orders.map(o => ({
                            id: o.order_id,
                            kode_pesan: o.kode_pesan,
                            keterangan: o.keterangan,
                            total_harga: o.total_harga,
                            paid: o.paid,
                            status_pembayaran: o.status_pembayaran,
                            detail_pesanans: o.detail_pesanans || []
                        }));
                        return [...acc, ...mappedOrders];
                    }
                    return acc;
                }, []);
                
                return {
                    id: item.customer.id,
                    nama: item.customer.nama,
                    telpon: item.customer.telpon,
                    keterangan: item.customer.keterangan,
                    total_sisa: item.total_sisa,
                    total_bayar: item.total_tagihan,
                    telah_bayar: item.total_paid,
                    bills: item.bills,
                    pesanans: flatOrders
                };
            });
            setDataCustomer(mapped);
        } catch (err) {
            console.error("[usePembayaran] Error fetching customers:", err);
            toast.error("Gagal memuat data tagihan");
        } finally {
            setLoading(false);
        }
    }, [authenticated]);

    const handleSearch = useCallback((search) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            getCustomer(search);
        }, 500);
    }, [getCustomer]);

    const selectCustomer = useCallback((customer) => {
        setFiltered(prev => (prev?.id === customer.id ? null : customer));
    }, []);

    const calculateCustomerBill = useCallback((customer) => {
        if (!customer) return 0;
        return customer.total_sisa || 0;
    }, []);

    const handleOpenModal = useCallback(() => {
        if (filtered) {
            const bill = calculateCustomerBill(filtered);
            const amountDue = Math.abs(bill);
            setValueBayar(amountDue > 0 ? amountDue.toString() : '');
        }
        setTipeBayar('cash');
        setBukti(null);
        setIsOpen(true);
    }, [filtered, calculateCustomerBill]);

    const handleCloseModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!bukti) {
            setPreview(undefined);
            return;
        }
        const objectURL = URL.createObjectURL(bukti);
        setPreview(objectURL);
        return () => URL.revokeObjectURL(objectURL);
    }, [bukti]);

    const submitPayment = useCallback(async () => {
        if (!filtered || !filtered.bills || filtered.bills.length === 0) {
            toast.error("Tidak ada tagihan yang bisa dibayar");
            return;
        }

        const loadingSubmitToast = toast.loading("Sedang menyimpan data pembayaran...");

        // Map Tipe Bayar to Accounting ID
        const accountMapping = {
            'cash': '9f28d5df-c1eb-49b9-adc9-d7d945baf9b6', // Kas Tunai
            'tf': 'a97e3541-16d0-404e-9825-0690775e4ddd',   // BCA
            'qris': '9f28d6c7-0436-4f86-af45-b1d246e325b3'  // QRIS
        };

        try {
            let remaining = parseFloat(valueBayar);

            for (const bill of filtered.bills) {
                if (remaining <= 0) break;

                let payForThisBill = remaining;
                // If the bill has lower outstanding than remaining money, map the difference
                if (bill.outstanding && payForThisBill > bill.outstanding) {
                    payForThisBill = bill.outstanding;
                }

                if (payForThisBill <= 0) continue;

                const payload = {
                    nominal: payForThisBill,
                    payment_method: tipeBayar,
                    id_account: accountMapping[tipeBayar]
                };

                await axios.post(`api/v2/bills/${bill.bill_id}/pay`, payload);
                remaining -= payForThisBill;
            }

            await getCustomer();
            setFiltered(null);
            setIsOpen(false);
            setValueBayar('');
            setTipeBayar('cash');
            setBukti(null);

            toast.update(loadingSubmitToast, {
                render: `Berhasil menyimpan pembayaran!`,
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            toast.update(loadingSubmitToast, {
                render: err.response?.data?.error || err.response?.data?.message || "Terjadi kesalahan saat menyimpan pembayaran",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }, [filtered, tipeBayar, valueBayar, authenticated, getCustomer]);

    const updateStatus = useCallback(async (customer, currStatus) => {
        const target = customer || filtered;
        if (!target || !target.pesanan_takable) return;
        
        const loadingToast = toast.loading(`Updating status to ${currStatus}...`);
        try {
            const updatePromises = target.pesanan_takable.map((pesanan) => {
                return axios.post(`/order/${pesanan.kode_pesan}`, {
                    status: currStatus,
                    _method: 'patch'
                });
            });

            await Promise.all(updatePromises);
            await getCustomer();
            setFiltered(null);
            
            toast.update(loadingToast, {
                render: `Status berhasil diubah ke ${currStatus}`,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            console.error("[usePembayaran] Error updating status:", err);
            toast.update(loadingToast, {
                render: "Gagal memperbarui status",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }, [filtered, authenticated, getCustomer]);

    const kirimQrisDinamis = useCallback(async () => {
        if (!filtered) {
            toast.error("Customer belum dipilih");
            return;
        }

        const nominal = Number(filtered.total_bayar) - Number(filtered.telah_bayar);
        if (!nominal || nominal <= 0) {
            toast.error("Nominal pembayaran tidak valid");
            return;
        }

        const amount = Math.round(nominal).toString();
        const phone = filtered.customer?.telpon || filtered.telpon;
        if (!phone) {
            toast.error("Nomor telepon customer tidak tersedia");
            return;
        }

        const loadingToast = toast.loading("Mengirim QRIS dinamis...");
        try {
            await axios.post("/api/qris-dinamis", { amount, phone });

            toast.update(loadingToast, {
                render: "QRIS berhasil dikirim ke customer",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });
        } catch (err) {
            toast.update(loadingToast, {
                render: err.response?.data?.message || "Gagal mengirim QRIS",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    }, [filtered, authenticated]);

    const totalBlmBayar = useMemo(() => {
        const val = dataCustomer?.reduce((prev, current) => {
            return prev + calculateCustomerBill(current);
        }, 0) ?? 0;
        return Math.abs(val);
    }, [dataCustomer, calculateCustomerBill]);

    // Initial Load
    useEffect(() => {
        if (authenticated && dataCustomer === null) {
            getCustomer();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [authenticated, dataCustomer, getCustomer]);

    return useMemo(() => ({
        dataCustomer,
        filtered,
        loading,
        viewMode,
        setViewMode,
        isOpen,
        valueBayar,
        setValueBayar,
        tipeBayar,
        setTipeBayar,
        bukti,
        setBukti,
        preview,
        totalBlmBayar,
        calculateCustomerBill,
        handleSearch,
        selectCustomer,
        handleOpenModal,
        handleCloseModal,
        submitPayment,
        updateStatus,
        kirimQrisDinamis,
        refresh: getCustomer
    }), [
        dataCustomer, filtered, loading, viewMode, setViewMode, isOpen, 
        valueBayar, tipeBayar, bukti, preview, totalBlmBayar, calculateCustomerBill, 
        handleSearch, selectCustomer, handleOpenModal, handleCloseModal, 
        submitPayment, updateStatus, kirimQrisDinamis, getCustomer
    ]);
};

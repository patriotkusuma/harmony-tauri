import { useState, useCallback, useEffect } from 'react';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';

const API_BASE = '/api/v2/bills';

export const useBilling = (initialStatus = 'UNPAID') => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(initialStatus);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchBills = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                q: search,
                status,
                date_from: dateFrom,
                date_to: dateTo,
                per_page: 15
            };
            const res = await axios.get(API_BASE, { params });
            setBills(res.data.items || []);
            setTotal(res.data.total);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            toast.error('Gagal mengambil data tagihan: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    }, [page, search, status, dateFrom, dateTo]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const joinBills = async (billIds) => {
        if (billIds.length < 2) return;
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/join`, { bill_ids: billIds });
            toast.success('Tagihan berhasil digabungkan!');
            fetchBills();
        } catch (err) {
            toast.error('Gagal menggabungkan tagihan: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async (billId) => {
        try {
            await axios.post(`${API_BASE}/${billId}/send`);
            toast.success('Pesan WhatsApp terkirim ke customer!');
        } catch (err) {
            toast.error('Gagal mengirim WhatsApp: ' + (err.response?.data?.error || err.message));
        }
    };

    const processPayment = async (billId, nominal, method) => {
        try {
            const res = await axios.post(`${API_BASE}/${billId}/pay`, { 
                nominal, 
                method 
            });
            toast.success('Pembayaran berhasil diproses!');
            fetchBills();
            return res.data;
        } catch (err) {
            toast.error('Gagal memproses pembayaran: ' + (err.response?.data?.error || err.message));
            return null;
        }
    };

    const splitOrder = async (kodePesan) => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/split-order`, { kode_pesan: kodePesan });
            toast.success('Pesanan berhasil dipisahkan ke tagihan baru!');
            fetchBills();
        } catch (err) {
            toast.error('Gagal memisahkan pesanan: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return {
        bills,
        loading,
        total,
        page,
        setPage,
        totalPages,
        search,
        setSearch,
        status,
        setStatus,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        refresh: fetchBills,
        joinBills,
        sendNotification,
        processPayment,
        splitOrder
    };
};

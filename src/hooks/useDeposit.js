import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const useDeposit = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setLimit] = useState(10);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    
    const [topUpModal, setTopUpModal] = useState(false);
    const [topUpLoading, setTopUpLoading] = useState(false);
    const [topUpData, setTopUpData] = useState({
        id_customer: "",
        amount: "",
        keterangan: ""
    });

    const fetchDeposits = useCallback(async (p = 1, s = search) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: p, limit: limit });
            if (s) params.append("search", s);
            const res = await axios.get(`api/v2/deposit?${params.toString()}`);
            setDeposits(res.data.items || []);
            setTotalItems(res.data.total_items || 0);
            setPage(res.data.page || 1);
        } catch (err) {
            console.error("Error fetching deposits:", err);
            toast.error("Gagal memuat data deposit");
        } finally {
            setLoading(false);
        }
    }, [search, limit]);

    const fetchHistory = async (id_customer) => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`api/v2/deposit/${id_customer}`);
            setSelectedCustomer(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
            toast.error("Gagal memuat riwayat deposit");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleTopUp = async () => {
        if (!topUpData.amount || topUpData.amount <= 0) {
            toast.warning("Nominal harus lebih dari 0");
            return;
        }

        setTopUpLoading(true);
        try {
            await axios.post("api/v2/deposit", {
                id_customer: Number(topUpData.id_customer),
                amount: Number(topUpData.amount),
                keterangan: topUpData.keterangan || "Top up via Kasir"
            });
            toast.success("Top up berhasil diproses");
            setTopUpModal(false);
            fetchDeposits(page);
            if (selectedCustomer && selectedCustomer.id_customer === topUpData.id_customer) {
                fetchHistory(topUpData.id_customer);
            }
        } catch (err) {
            console.error("Error top up:", err);
            toast.error(err.response?.data?.message || "Gagal memproses top up");
        } finally {
            setTopUpLoading(false);
        }
    };

    const openTopUp = (customer) => {
        setTopUpData({
            id_customer: customer.id_customer,
            amount: "",
            keterangan: ""
        });
        setTopUpModal(true);
    };

    useEffect(() => {
        fetchDeposits(1);
    }, [fetchDeposits]);

    return {
        deposits,
        loading,
        search,
        setSearch,
        page,
        setPage,
        totalItems,
        limit,
        selectedCustomer,
        setSelectedCustomer,
        historyLoading,
        fetchHistory,
        fetchDeposits,
        topUpModal,
        setTopUpModal,
        topUpLoading,
        topUpData,
        setTopUpData,
        handleTopUp,
        openTopUp
    };
};

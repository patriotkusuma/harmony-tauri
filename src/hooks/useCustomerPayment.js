import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../services/axios-instance";

export const useCustomerPayment = () => {
    const [payments, setPayments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authToken] = useState(localStorage.getItem("token") || null);
    
    // Initial params from localStorage if available
    const [lastParams] = useState(JSON.parse(localStorage.getItem("bayarLastParams")) || null);
    
    // State-based params for reactivity
    const [rowPerPage, setRowPerPage] = useState(lastParams?.rowPerPage || 10);
    const [currentPage, setCurrentPage] = useState(lastParams?.currentPage || 1);
    const [searchData, setSearchData] = useState(lastParams?.searchData || "");
    const [dateFrom, setDateFrom] = useState(lastParams?.dateFrom || "");
    const [dateTo, setDateTo] = useState(lastParams?.dateTo || "");
    const [tipe, setTipe] = useState(lastParams?.tipe || "");

    const fetchPayments = useCallback(async (overrides = {}) => {
        if (!authToken) return;
        
        setLoading(true);
        try {
            const params = {
                page: overrides.page || currentPage,
                rowPerPage: overrides.rowPerPage || rowPerPage,
                search: overrides.search !== undefined ? overrides.search : searchData,
                dateFrom: overrides.dateFrom || dateFrom || null,
                dateTo: overrides.dateTo || dateTo || null,
                tipe: overrides.tipe !== undefined ? overrides.tipe : (tipe || null)
            };

            // Save to localStorage for persistence
            localStorage.setItem("bayarLastParams", JSON.stringify(params));

            const res = await axios.get("api/pembayaran/get-payments", {
                headers: { 'Authorization': `Bearer ${authToken}` },
                params: params
            });

            if (res.status === 204 || !res.data) {
                setPayments({ data: [], total: 0, current_page: 1, last_page: 1, transferPayment: 0, cashPayment: 0 });
            } else {
                setPayments(res.data);
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
            setPayments({ data: [], total: 0, current_page: 1, last_page: 1, transferPayment: 0, cashPayment: 0 });
        } finally {
            setLoading(false);
        }
    }, [authToken, currentPage, rowPerPage, searchData, dateFrom, dateTo, tipe]);

    // Handle initial fetch and search/filter changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPayments();
        }, searchData ? 700 : 100);

        return () => clearTimeout(delayDebounceFn);
    }, [searchData, tipe, dateFrom, dateTo, rowPerPage, currentPage, fetchPayments]);

    const handleSearch = (val) => {
        setSearchData(val);
        setCurrentPage(1);
    };

    const handleTipeChange = (val) => {
        setTipe(val);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowPerPageChange = (val) => {
        setRowPerPage(val);
        setCurrentPage(1);
    };

    return {
        payments,
        loading,
        rowPerPage,
        currentPage,
        searchData,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        tipe,
        handleSearch,
        handleTipeChange,
        handlePageChange,
        handleRowPerPageChange,
        refresh: fetchPayments
    };
};

import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios-instance";
import moment from "moment";
import { toast } from "react-toastify";
import { useAccountingStore } from "../store/accountingStore";

export const useAccountingReport = () => {
    const { filters, setFilters, activeReportTab, setActiveReportTab } = useAccountingStore();
    const [loading, setLoading] = useState(false);

    // ====== Accounting Summary ======
    const [summary, setSummary] = useState({
        total_assets: 0,
        total_liability: 0,
        total_equity: 0,
        total_revenue: 0,
        total_expense: 0,
        accounts: [],
    });

    // ====== Finance Reports ======
    const [balanceSheet, setBalanceSheet] = useState({
        assets: [], liabilities: [], equity: [],
        total_assets: 0, total_liabilities: 0, total_equity: 0,
    });

    const [incomeStatement, setIncomeStatement] = useState({
        revenue: [], expense: [],
        total_revenue: 0, total_expense: 0, net_income: 0,
    });

    const [cashFlow, setCashFlow] = useState({
        operating_activities: 0, investing_activities: 0,
        financing_activities: 0, net_cash_flow: 0,
    });

    const [equityChanges, setEquityChanges] = useState({
        beginning_equity: 0, net_income: 0,
        withdrawals_dividends: 0, ending_equity: 0,
    });

    const [financialNotes, setFinancialNotes] = useState({
        company_info: "", accounting_policies: "",
    });

    // ====== Periods ======
    const [periods, setPeriods] = useState([]);
    const [autoCloseEnabled, setAutoCloseEnabled] = useState(true);

    // ====== Withdrawals / Prive ======
    const [withdrawals, setWithdrawals] = useState({
        items: [], total_withdrawn: 0, count: 0,
    });

    const buildParams = () => ({
        start_date: filters.startDate,
        end_date: filters.endDate,
    });

    // Base fetcher with toast support
    const fetchWithToast = async (url, setter, label, transform) => {
        setLoading(true);
        try {
            const res = await axios.get(url, { params: buildParams() });
            if (res.data && res.data.data) {
                setter(transform ? transform(res.data.data) : res.data.data);
            }
        } catch (err) {
            console.error(`${label} Error:`, err);
            toast.error(`Gagal memuat ${label}`);
        } finally {
            setLoading(false);
        }
    };

    // ====== Fetch Functions ======
    const fetchSummary = useCallback(async () => {
        await fetchWithToast(
            "api/v2/accounting/summary",
            setSummary,
            "Ringkasan Akuntansi",
            (data) => ({
                total_assets: data.total_assets || 0,
                total_liability: data.total_liability || 0,
                total_equity: data.total_equity || 0,
                total_revenue: data.total_revenue || 0,
                total_expense: data.total_expense || 0,
                accounts: data.accounts || [],
            })
        );
    }, [filters]);

    const fetchBalanceSheet = useCallback(async () => {
        await fetchWithToast(
            "api/v2/finance/balance-sheet",
            setBalanceSheet,
            "Neraca",
            (data) => ({
                assets: data.assets || [],
                liabilities: data.liabilities || [],
                equity: data.equity || [],
                total_assets: data.total_assets || 0,
                total_liabilities: data.total_liabilities || 0,
                total_equity: data.total_equity || 0,
            })
        );
    }, [filters]);

    const fetchIncomeStatement = useCallback(async () => {
        await fetchWithToast(
            "api/v2/finance/income-statement",
            setIncomeStatement,
            "Laba Rugi",
            (data) => ({
                revenue: data.revenue || [],
                expense: data.expense || [],
                total_revenue: data.total_revenue || 0,
                total_expense: data.total_expense || 0,
                net_income: data.net_income || 0,
            })
        );
    }, [filters]);

    const fetchCashFlow = useCallback(async () => {
        await fetchWithToast(
            "api/v2/finance/cash-flow",
            setCashFlow,
            "Arus Kas",
            (data) => ({
                operating_activities: data.operating_activities || 0,
                investing_activities: data.investing_activities || 0,
                financing_activities: data.financing_activities || 0,
                net_cash_flow: data.net_cash_flow || 0,
            })
        );
    }, [filters]);

    const fetchEquityChanges = useCallback(async () => {
        await fetchWithToast(
            "api/v2/finance/equity-changes",
            setEquityChanges,
            "Perubahan Ekuitas",
            (data) => ({
                beginning_equity: data.beginning_equity || 0,
                net_income: data.net_income || 0,
                withdrawals_dividends: data.withdrawals_dividends || 0,
                ending_equity: data.ending_equity || 0,
            })
        );
    }, [filters]);

    const fetchFinancialNotes = useCallback(async () => {
        await fetchWithToast(
            "api/v2/finance/notes",
            setFinancialNotes,
            "Catatan Keuangan",
            (data) => ({
                company_info: data.company_info || "",
                accounting_policies: data.accounting_policies || "",
            })
        );
    }, [filters]);

    const fetchPeriods = useCallback(async () => {
        try {
            const res = await axios.get("api/v2/accounting/periods");
            if (res.data && res.data.data) {
                setPeriods(res.data.data || []);
            }
        } catch (err) {
            console.error("Periods Error:", err);
        }
    }, []);

    const fetchAutoCloseStatus = useCallback(async () => {
        try {
            const res = await axios.get("api/v2/accounting/periods/auto-close");
            if (res.data && res.data.data) {
                setAutoCloseEnabled(res.data.data.is_auto_close_enabled);
            }
        } catch (err) {
            console.error("Auto Close Status Error:", err);
        }
    }, []);

    const toggleAutoClose = async (enabled) => {
        try {
            await axios.put("api/v2/accounting/periods/auto-close", { enabled });
            setAutoCloseEnabled(enabled);
            toast.success(`Auto-close ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
        } catch (err) {
            toast.error("Gagal mengubah pengaturan auto-close");
        }
    };

    const forceClosePeriod = async (periodId) => {
        const loadingToast = toast.loading("Menutup periode...");
        try {
            await axios.post(`api/v2/accounting/periods/close/${periodId}`);
            toast.update(loadingToast, { render: "Periode berhasil ditutup!", type: "success", isLoading: false, autoClose: 2000 });
            fetchPeriods();
        } catch (err) {
            toast.update(loadingToast, { render: "Gagal menutup periode", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // ====== Withdrawal / Prive Functions ======
    const fetchWithdrawals = useCallback(async () => {
        await fetchWithToast(
            "api/v2/accounting/withdrawals",
            setWithdrawals,
            "Riwayat Prive",
            (data) => ({
                items: data.items || [],
                total_withdrawn: data.total_withdrawn || 0,
                count: data.count || 0,
            })
        );
    }, [filters]);

    const createWithdrawal = async (payload) => {
        const loadingToast = toast.loading("Mencatat prive...");
        try {
            await axios.post("api/v2/accounting/withdrawals", payload);
            toast.update(loadingToast, { render: "Prive berhasil dicatat!", type: "success", isLoading: false, autoClose: 2000 });
            fetchWithdrawals();
        } catch (err) {
            toast.update(loadingToast, { render: "Gagal mencatat prive", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const deleteWithdrawal = async (id) => {
        const loadingToast = toast.loading("Menghapus prive...");
        try {
            await axios.delete(`api/v2/accounting/withdrawals/${id}`);
            toast.update(loadingToast, { render: "Prive berhasil dihapus & saldo dikembalikan!", type: "success", isLoading: false, autoClose: 2000 });
            fetchWithdrawals();
        } catch (err) {
            toast.update(loadingToast, { render: "Gagal menghapus prive", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // ====== Transfer Functions ======
    const createTransfer = async (payload) => {
        const loadingToast = toast.loading("Memindahkan dana...");
        try {
            await axios.post("api/v2/accounting/transfers", payload);
            toast.update(loadingToast, { render: "Pemindahan dana berhasil!", type: "success", isLoading: false, autoClose: 2000 });
            fetchSummary(); // Refresh summary to see updated balances
        } catch (err) {
            toast.update(loadingToast, { render: "Gagal memindahkan dana", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // ====== Tab-based auto-fetch ======
    const fetchByTab = useCallback((tab) => {
        switch (tab) {
            case "summary":
                fetchSummary();
                break;
            case "balance-sheet":
                fetchBalanceSheet();
                break;
            case "income-statement":
                fetchIncomeStatement();
                break;
            case "cash-flow":
                fetchCashFlow();
                break;
            case "equity-changes":
                fetchEquityChanges();
                break;
            case "notes":
                fetchFinancialNotes();
                break;
            case "periods":
                fetchPeriods();
                fetchAutoCloseStatus();
                break;
            case "withdrawals":
                fetchWithdrawals();
                break;
            default:
                break;
        }
    }, [fetchSummary, fetchBalanceSheet, fetchIncomeStatement, fetchCashFlow, fetchEquityChanges, fetchFinancialNotes, fetchPeriods, fetchAutoCloseStatus, fetchWithdrawals]);

    // Auto-fetch on tab switch or filter change
    useEffect(() => {
        fetchByTab(activeReportTab);
    }, [activeReportTab, fetchByTab]);

    const handleRefresh = () => {
        fetchByTab(activeReportTab);
    };

    return {
        loading,
        filters,
        setFilters,
        activeReportTab,
        setActiveReportTab,

        // Data
        summary,
        balanceSheet,
        incomeStatement,
        cashFlow,
        equityChanges,
        financialNotes,
        periods,
        autoCloseEnabled,
        withdrawals,

        // Actions
        handleRefresh,
        toggleAutoClose,
        forceClosePeriod,
        createWithdrawal,
        deleteWithdrawal,
        createTransfer,
        fetchByTab,
    };
}

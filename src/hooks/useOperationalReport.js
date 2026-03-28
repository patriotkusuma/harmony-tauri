import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios-instance";
import moment from "moment";
import { toast } from "react-toastify";

export const useOperationalReport = () => {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: moment().startOf('month').format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        page: 1,
        limit: 50,
        outletId: ""
    });

    const [orderReports, setOrderReports] = useState({
        summary: {
            total_outstanding: 0,
            total_overdue: 0,
            total_completed: 0
        },
        data: [],
        meta: {}
    });

    const [inventoryReports, setInventoryReports] = useState({
        data: [],
        lowStockAlerts: [],
        aiInsight: null,
        meta: {}
    });

    const [employeeReports, setEmployeeReports] = useState([]);
    
    const [rfidReports, setRfidReports] = useState({
        summary: {
            total_active: 0,
            total_idle: 0,
            total_lost_risk: 0
        },
        data: [],
        meta: {}
    });

    const buildParams = (f) => ({
        start_date: f.startDate,
        end_date: f.endDate,
        page: f.page,
        limit: f.limit,
        ...(f.outletId && { outlet_id: f.outletId })
    });

    const fetchOrderReport = useCallback(async (isRefresh = false) => {
        setLoading(true);
        let loadingToast = null;
        if (isRefresh) loadingToast = toast.loading("Sinkronisasi data order...");
        try {
            const params = buildParams(filters);
            if (isRefresh) params.refresh = "true";
            const res = await axios.get(`api/v2/reports/operational/orders`, { params });
            if (res.data && res.data.data) {
                setOrderReports({
                    summary: res.data.data.summary || {},
                    data: res.data.data.detail || [],
                    meta: res.data.data.meta || {}
                });
            }
            if (loadingToast) toast.update(loadingToast, { render: "Data sinkron!", type: "success", isLoading: false, autoClose: 2000 });
        } catch (err) {
            console.error("Order Report Error:", err);
            setOrderReports(prev => ({ ...prev, data: [] }));
            if (loadingToast) toast.update(loadingToast, { render: "Gagal sinkron data", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchInventoryReport = useCallback(async (isRefresh = false) => {
        setLoading(true);
        let loadingToast = null;
        if (isRefresh) loadingToast = toast.loading("Menganalisis stok dengan AI...");
        try {
            const params = buildParams(filters);
            if (isRefresh) params.refresh = "true";
            const res = await axios.get(`api/v2/reports/operational/inventory-usage`, { params });
            if (res.data && res.data.data) {
                setInventoryReports({
                    data: res.data.data.detail || [],
                    lowStockAlerts: res.data.data.low_stock_alerts || [],
                    aiInsight: res.data.data.ai_insight || null,
                    meta: res.data.data.meta || {}
                });
            }
            if (loadingToast) toast.update(loadingToast, { render: "Analisis AI Selesai!", type: "success", isLoading: false, autoClose: 2000 });
        } catch (err) {
            console.error("Inventory Report Error:", err);
            if (loadingToast) toast.update(loadingToast, { render: "Gagal memuat analisis", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchEmployeeReport = useCallback(async (isRefresh = false) => {
        setLoading(true);
        let loadingToast = null;
        if (isRefresh) loadingToast = toast.loading("Sinkronisasi kinerja karyawan...");
        try {
            const params = buildParams(filters);
            if (isRefresh) params.refresh = "true";
            const res = await axios.get(`api/v2/reports/operational/employee-performance`, { params });
            if (res.data && res.data.data) {
                setEmployeeReports(res.data.data.detail || []);
            }
            if (loadingToast) toast.update(loadingToast, { render: "Kinerja sinkron!", type: "success", isLoading: false, autoClose: 2000 });
        } catch (err) {
            console.error("Employee Report Error:", err);
            if (loadingToast) toast.update(loadingToast, { render: "Gagal sinkron data", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchRfidReport = useCallback(async (isRefresh = false) => {
        setLoading(true);
        let loadingToast = null;
        if (isRefresh) loadingToast = toast.loading("Audit RFID seketika...");
        try {
            const params = buildParams(filters);
            if (isRefresh) params.refresh = "true";
            const res = await axios.get(`api/v2/reports/operational/rfid`, { params });
            if (res.data && res.data.data) {
                setRfidReports({
                    summary: res.data.data.summary || {},
                    data: res.data.data.detail || [],
                    meta: res.data.data.meta || {}
                });
            }
            if (loadingToast) toast.update(loadingToast, { render: "Audit Selesai!", type: "success", isLoading: false, autoClose: 2000 });
        } catch (err) {
            console.error("RFID Report Error:", err);
            if (loadingToast) toast.update(loadingToast, { render: "Gagal audit data", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrderReport();
    }, [fetchOrderReport]);

    return {
        loading,
        filters,
        setFilters,
        orderReports,
        inventoryReports,
        employeeReports,
        rfidReports,
        fetchOrderReport,
        fetchInventoryReport,
        fetchEmployeeReport,
        fetchRfidReport
    };
};

import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios-instance";
import moment from "moment";

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

    const fetchOrderReport = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`api/v2/reports/operational/orders`, { params: buildParams(filters) });
            if (res.data && res.data.data) {
                setOrderReports({
                    summary: res.data.data.summary || {},
                    data: res.data.data.detail || [],
                    meta: res.data.data.meta || {}
                });
            }
        } catch (err) {
            console.error("Order Report Error:", err);
            setOrderReports(prev => ({ ...prev, data: [] }));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchInventoryReport = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`api/v2/reports/operational/inventory-usage`, { params: buildParams(filters) });
            if (res.data && res.data.data) {
                setInventoryReports({
                    data: res.data.data.detail || [],
                    lowStockAlerts: res.data.data.low_stock_alerts || [],
                    meta: res.data.data.meta || {}
                });
            }
        } catch (err) {
            console.error("Inventory Report Error:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchEmployeeReport = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`api/v2/reports/operational/employee-performance`, { params: buildParams(filters) });
            if (res.data && res.data.data) {
                setEmployeeReports(res.data.data.detail || []);
            }
        } catch (err) {
            console.error("Employee Report Error:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchRfidReport = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`api/v2/reports/operational/rfid`, { params: buildParams(filters) });
            if (res.data && res.data.data) {
                setRfidReports({
                    summary: res.data.data.summary || {},
                    data: res.data.data.detail || [],
                    meta: res.data.data.meta || {}
                });
            }
        } catch (err) {
            console.error("RFID Report Error:", err);
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

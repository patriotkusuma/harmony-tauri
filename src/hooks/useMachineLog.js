import { useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import axios from "../services/axios-instance";

export const useMachineLog = () => {
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchTimeline = useCallback(async (selectedDate) => {
        setLoading(true);
        try {
            const res = await axios.get(`api/order/timeline?date=${selectedDate}`, { headers });
            if (res.data && res.data.data) {
                setLogs(res.data.data);
            } else {
                setLogs([]);
            }
        } catch (err) {
            console.error(err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTimeline(date);
    }, [date, fetchTimeline]);

    const filteredLogs = useMemo(() => {
        if (!searchTerm) return logs;
        const lowTerm = searchTerm.toLowerCase();
        return logs.filter(log => 
            (log.customer_name?.toLowerCase().includes(lowTerm)) ||
            (log.kode_pesan?.toLowerCase().includes(lowTerm)) ||
            (log.machine_id?.toString().includes(lowTerm)) ||
            (log.proses?.toLowerCase().includes(lowTerm))
        );
    }, [logs, searchTerm]);

    return {
        date,
        setDate,
        searchTerm,
        setSearchTerm,
        logs: filteredLogs,
        loading,
        fetchTimeline
    };
};

import { useState, useEffect, useCallback } from 'react';
import axios from '../services/axios-instance';
import { toast } from 'react-toastify';
import { useMQTTRFID } from '../hooks/useMQTTRFID';

export const useRFIDManage = () => {
    const [activeMode, setActiveMode] = useState("attach"); // "attach" | "detach"
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [linkedOrders, setLinkedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [autoAttach, setAutoAttach] = useState(true); // Default changed to true as requested
    const [loading, setLoading] = useState(false);
    const [autoAttachInProgress, setAutoAttachInProgress] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });

    const showError = (title, message) => setErrorModal({ show: true, title, message });
    const closeErrorModal = () => setErrorModal((prev) => ({ ...prev, show: false }));

    const {
        uid: scannedRFID, lastScan,
        connected: mqttConnected, connecting: mqttConnecting,
        clearUID,
    } = useMQTTRFID({
        enabled: true,
        onUID: (uid) => {
            toast.info(`🏷️ RFID Terdeteksi: ${uid}`, { autoClose: 2500 });
        },
    });

    const fetchLinkedOrders = useCallback(async () => {
        try {
            const res = await axios.get("api/rfid/orders/linked");
            setLinkedOrders(res.data.data || []);
        } catch (err) {
            console.error("Error fetching linked orders:", err);
        }
    }, []);

    const fetchUnlinkedOrders = useCallback(async (query = "") => {
        setLoading(true);
        try {
            const res = await axios.get("api/pesanan/get-pesanan", {
                params: {
                    search: query,
                    page: 1,
                    rowPerPage: 50,
                },
            });
            setOrders(res.data?.data || []);
        } catch (err) {
            console.error("Error fetching unlinked orders:", err);
            toast.error("Gagal memuat daftar order");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAttach = async (rfid = scannedRFID) => {
        if (!selectedOrder) {
            showError("Peringatan", "Silakan pilih order terlebih dahulu sebelum melakukan attach RFID.");
            return;
        }
        if (!rfid) {
            showError("Peringatan", "Belum ada RFID yang di-scan.");
            return;
        }
        try {
            await axios.post("api/rfid/attach", {
                order_id: selectedOrder.id,
                rfid_code: rfid,
            });
            toast.success(`✅ RFID ${rfid} berhasil dipasang ke Order ${selectedOrder.kode_pesan}`);
            clearUID();
            setSelectedOrder(null);
            fetchUnlinkedOrders(searchQuery);
        } catch (err) {
            showError("Gagal Attach", err.response?.data?.message || "Terjadi kesalahan saat menyambungkan RFID.");
        }
    };

    const handleDetach = async (order) => {
        const targetOrder = order || selectedOrder;
        if (!targetOrder) {
            showError("Peringatan", "Pilih order yang ingin di-detach.");
            return;
        }
        try {
            await axios.post("api/rfid/detach", {
                order_id: targetOrder.order_id || targetOrder.id,
                rfid_code: targetOrder.rfid_code,
            });
            toast.success("✅ RFID berhasil dilepas.");
            fetchLinkedOrders();
            setSelectedOrder(null);
            clearUID();
        } catch (err) {
            showError("Gagal Detach", err.response?.data?.message || "Terjadi kesalahan saat melepas RFID.");
        }
    };

    useEffect(() => {
        if (activeMode === "detach") fetchLinkedOrders();
        else fetchUnlinkedOrders();
    }, [activeMode, fetchLinkedOrders, fetchUnlinkedOrders]);

    useEffect(() => {
        if (!scannedRFID) return;
        if (activeMode === "attach" && autoAttach && selectedOrder && !autoAttachInProgress) {
            setAutoAttachInProgress(true);
            handleAttach(scannedRFID).finally(() => setAutoAttachInProgress(false));
        }
        if (activeMode === "detach") {
            setSearchQuery(scannedRFID);
        }
    }, [scannedRFID, activeMode, autoAttach, selectedOrder, autoAttachInProgress]);

    return {
        activeMode, setActiveMode,
        searchQuery, setSearchQuery,
        orders, linkedOrders,
        selectedOrder, setSelectedOrder,
        autoAttach, setAutoAttach,
        loading,
        errorModal, closeErrorModal,
        scannedRFID, lastScan, mqttConnected, mqttConnecting,
        clearUID,
        handleAttach, handleDetach,
        fetchUnlinkedOrders
    };
};

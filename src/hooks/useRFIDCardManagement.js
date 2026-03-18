import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";
import desktopBridge from "../services/desktop-bridge";

const PAGE_LIMIT = 10;

export const useRFIDCardManagement = () => {
  // ─── Data State ───────────────────────────────────────────────────────────
  const [rfids, setRfids] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ─── Filter State ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ─── Scan & Register State ────────────────────────────────────────────────
  const [scannedUID, setScannedUID] = useState("");
  const [scanActive, setScanActive] = useState(true);
  const [lastScanTime, setLastScanTime] = useState(null);

  // ─── Register Modal ───────────────────────────────────────────────────────
  const [registerModal, setRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({ rfid_code: "", type: "basket" });
  const [registerLoading, setRegisterLoading] = useState(false);

  // ─── Detail Modal ─────────────────────────────────────────────────────────
  const [detailModal, setDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Keyboard buffer for RFID reader (HID mode)
  const rfidBuffer = useRef("");
  const rfidTimer = useRef(null);

  // ─── Fetch RFIDs ──────────────────────────────────────────────────────────
  const fetchRFIDs = useCallback(async (p = 1, s = search, t = filterType, st = filterStatus) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: PAGE_LIMIT });
      if (s) params.append("search", s);
      if (t) params.append("type", t);
      if (st) params.append("status", st);
      const res = await axios.get(`api/rfids?${params.toString()}`);
      setRfids(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching RFIDs:", err);
      toast.error("Gagal memuat data RFID");
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => {
    fetchRFIDs(page, search, filterType, filterStatus);
  }, [page, fetchRFIDs]);

  const handleScannedUID = useCallback((uid) => {
    setScannedUID(uid);
    setLastScanTime(new Date());
    toast.info(`🏷️ Kartu RFID terdeteksi: ${uid}`, { autoClose: 2000 });
    // Open register modal pre-filled with scanned uid
    setRegisterForm({ rfid_code: uid, type: "basket" });
    setRegisterModal(true);
  }, []);

  // ─── RFID HID Keyboard Listener ───────────────────────────────────────────
  useEffect(() => {
    if (!scanActive) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const uid = rfidBuffer.current.trim();
        if (uid.length >= 4) {
          handleScannedUID(uid);
        }
        rfidBuffer.current = "";
        clearTimeout(rfidTimer.current);
        return;
      }
      if (e.key.length === 1) {
        rfidBuffer.current += e.key;
        clearTimeout(rfidTimer.current);
        rfidTimer.current = setTimeout(() => {
          rfidBuffer.current = "";
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(rfidTimer.current);
    };
  }, [scanActive, handleScannedUID]);

  // ─── Handle Electron RFID ─────────────────────────────────────────────────
  useEffect(() => {
    const stopListen = desktopBridge.onRFIDUID((uid) => {
      if (scanActive) handleScannedUID(uid);
    });
    return () => {
      stopListen?.();
    };
  }, [scanActive, handleScannedUID]);

  // ─── Search & Filter ──────────────────────────────────────────────────────
  const handleSearch = () => {
    setPage(1);
    fetchRFIDs(1, search, filterType, filterStatus);
  };

  const handleFilterType = (type) => {
    setFilterType(type);
    setPage(1);
    fetchRFIDs(1, search, type, filterStatus);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setPage(1);
    fetchRFIDs(1, search, filterType, status);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // ─── Register RFID ────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!registerForm.rfid_code.trim()) {
      toast.warning("Kode RFID tidak boleh kosong");
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await axios.post("api/rfids", {
        rfid_code: registerForm.rfid_code.trim(),
        type: registerForm.type || "basket",
      });
      toast.success(`✅ Kartu ${res.data.data?.code} berhasil didaftarkan!`);
      setRegisterModal(false);
      setRegisterForm({ rfid_code: "", type: "basket" });
      setScannedUID("");
      setPage(1);
      fetchRFIDs(1, search, filterType, filterStatus);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mendaftarkan kartu RFID";
      toast.error(`❌ ${msg}`);
    } finally {
      setRegisterLoading(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return {
    rfids, total, page, loading, SEARCH_LIMIT: PAGE_LIMIT,
    search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus,
    scannedUID, scanActive, setScanActive, lastScanTime,
    registerModal, setRegisterModal, registerForm, setRegisterForm, registerLoading,
    detailModal, setDetailModal, selectedCard, setSelectedCard,
    totalPages,
    handleSearch, handleFilterType, handleFilterStatus, handlePageChange, handleRegister, fetchRFIDs
  };
};

import { useState, useEffect, useCallback } from "react";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";
import moment from "moment";
import Swal from "sweetalert2";
import { useMQTTRFID } from "./useMQTTRFID";

const PAGE_LIMIT = 10;

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "pegawai",
    alamat: "",
    telpon: "",
    no_wa: "",
    gaji: 0,
    status: "active",
    tanggal_masuk: moment().format("YYYY-MM-DD"),
    outlet_ids: [],
  });

  const [rfidModal, setRfidModal] = useState(false);
  const [selectedUserForRfid, setSelectedUserForRfid] = useState(null);
  const [rfidLoading, setRfidLoading] = useState(false);
  const [manualRfid, setManualRfid] = useState("");

  // MQTT RFID Hook
  const {
    uid: scannedRFID,
    connected: mqttConnected,
    clearUID,
  } = useMQTTRFID({
    enabled: rfidModal,
    onUID: (uid) => {
      toast.info(`🏷️ RFID Terdeteksi: ${uid}`, { autoClose: 2000 });
    },
  });

  const fetchEmployees = useCallback(async (p = 1, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: PAGE_LIMIT });
      if (s) params.append("search", s);
      const res = await axios.get(`api/v2/pegawais?${params.toString()}`);
      setEmployees(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchOutlets = useCallback(async () => {
    try {
      const res = await axios.get("api/outlet/get-outlet");
      setOutlets(res.data.outlets || []);
    } catch (err) {
      console.error("Error fetching outlets:", err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(page);
  }, [page, fetchEmployees]);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setEditMode(false);
      setSelectedId(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      password: "",
      role: "pegawai",
      alamat: "",
      telpon: "",
      no_wa: "",
      gaji: 0,
      status: "active",
      tanggal_masuk: moment().format("YYYY-MM-DD"),
      outlet_ids: [],
    });
  };

  const handleEdit = (emp) => {
    setEditMode(true);
    setSelectedId(emp.id);
    setForm({
      nama: emp.nama || "",
      email: emp.user?.email || "",
      password: "", 
      role: emp.user?.role || "pegawai",
      alamat: emp.alamat || "",
      telpon: emp.telpon || "",
      no_wa: emp.no_wa || "",
      gaji: emp.gaji || 0,
      status: emp.status || "active",
      tanggal_masuk: emp.tanggal_masuk ? moment(emp.tanggal_masuk).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
      outlet_ids: emp.outlets ? emp.outlets.map(o => o.id) : [],
    });
    setModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data pegawai dan akun user terkait akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f5365c",
      cancelButtonColor: "#8898aa",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`api/v2/pegawais/${id}`);
          toast.success("Pegawai berhasil dihapus");
          fetchEmployees(page);
        } catch (err) {
          toast.error(err.response?.data?.message || "Gagal menghapus pegawai");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...form };
      if (editMode && !payload.password) {
        delete payload.password;
      }

      if (editMode) {
        await axios.put(`api/v2/pegawais/${selectedId}`, payload);
        toast.success("Data pegawai berhasil diperbarui");
      } else {
        await axios.post("api/v2/pegawais", payload);
        toast.success("Pegawai baru berhasil ditambahkan");
      }
      toggleModal();
      fetchEmployees(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data pegawai");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAttachRFID = async () => {
    const finalRfid = manualRfid.trim() || scannedRFID;
    if (!finalRfid) {
      toast.warning("Silakan scan atau masukkan kode RFID");
      return;
    }
    
    const userId = selectedUserForRfid.user?.id || selectedUserForRfid.user_id || selectedUserForRfid.UserId;

    setRfidLoading(true);
    try {
      await axios.post("api/rfid/attach/user", {
        user_id: userId,
        rfid_code: finalRfid,
      });
      toast.success(`Berhasil menautkan RFID ${finalRfid} ke ${selectedUserForRfid.nama}`);
      setRfidModal(false);
      clearUID();
      setManualRfid("");
      fetchEmployees(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menautkan RFID");
    } finally {
      setRfidLoading(false);
    }
  };

  const openRfidModal = (emp) => {
    const userId = emp.user?.id || emp.user_id || emp.UserId;
    if (!userId) {
      toast.error("Pegawai ini belum memiliki akun user terkait. Silakan edit dan pastikan email/password terisi.");
      return;
    }
    setSelectedUserForRfid(emp);
    setManualRfid("");
    setRfidModal(true);
    clearUID();
  };

  const handleOutletToggle = (id) => {
    setForm(prev => {
      const ids = [...prev.outlet_ids];
      const index = ids.indexOf(id);
      if (index > -1) {
        ids.splice(index, 1);
      } else {
        ids.push(id);
      }
      return { ...prev, outlet_ids: ids };
    });
  };

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return {
    employees, outlets, total, page, setPage, loading, search, setSearch,
    modal, setModal, editMode, formLoading, form, setForm,
    rfidModal, setRfidModal, selectedUserForRfid, rfidLoading, manualRfid, setManualRfid,
    scannedRFID, mqttConnected, clearUID,
    fetchEmployees, toggleModal, handleEdit, handleDelete, handleSubmit,
    handleAttachRFID, openRfidModal, handleOutletToggle, totalPages, PAGE_LIMIT
  };
};

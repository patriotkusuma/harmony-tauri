import { create } from "zustand";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";

export const STATUS_CONFIG = {
  pending:          { label: "Belum Dihubungi",   color: "secondary", icon: "fas fa-clock" },
  proposal_sent:    { label: "Proposal Terkirim",  color: "info",      icon: "fas fa-paper-plane" },
  negotiation:      { label: "Negosiasi",          color: "warning",   icon: "fas fa-comments" },
  closed_affiliate: { label: "Jadi Affiliate",     color: "success",   icon: "fas fa-handshake" },
  rejected:         { label: "Ditolak",            color: "danger",    icon: "fas fa-times-circle" },
};

export const STATUS_FLOW = [
  "pending",
  "proposal_sent",
  "negotiation",
  "closed_affiliate",
  "rejected",
];

export const useKostStore = create((set, get) => ({
  kosts: [],
  meta: { total: 0, page: 1, limit: 20 },
  loading: false,
  importLoading: false,
  dataLoaded: false,

  fetchKosts: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/v2/kosts?page=${page}&limit=20`);
      set({
        kosts: res.data.data ?? [],
        meta: res.data.meta ?? { total: 0, page, limit: 20 },
        dataLoaded: true,
      });
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Gagal memuat data kost.");
    } finally {
      set({ loading: false });
    }
  },

  importFromCSV: async (file) => {
    set({ importLoading: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/v2/kosts/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { total_inserted, total_skipped, total_processed } = res.data.data;
      toast.success(
        `Import selesai! Diproses: ${total_processed} | Berhasil: ${total_inserted} | Duplikat dilewati: ${total_skipped}`
      );
      get().fetchKosts(1);
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Gagal import CSV.");
      return false;
    } finally {
      set({ importLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      await axios.put(`/api/v2/kosts/${id}/status`, { status });
      toast.success("Status berhasil diubah.");
      // Optimistic update lokal tanpa refetch
      set((state) => ({
        kosts: state.kosts.map((k) => (k.id === id ? { ...k, status } : k)),
      }));
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Gagal mengubah status.");
      return false;
    }
  },
}));

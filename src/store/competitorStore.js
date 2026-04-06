import { create } from "zustand";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";

export const COMPETITOR_STATUS_CONFIG = {
  potential:   { label: "Potensial",       color: "info",    icon: "fas fa-eye" },
  monitored:   { label: "Dipantau",        color: "warning", icon: "fas fa-binoculars" },
  high_threat: { label: "Ancaman Tinggi",  color: "danger",  icon: "fas fa-exclamation-circle" },
  partnered:   { label: "Bermitra",        color: "success", icon: "fas fa-handshake" },
  inactive:    { label: "Tidak Aktif",     color: "secondary", icon: "fas fa-pause-circle" },
};

export const COMPETITOR_STATUS_FLOW = [
  "potential",
  "monitored",
  "high_threat",
  "partnered",
  "inactive",
];

export const useCompetitorStore = create((set, get) => ({
  competitors: [],
  meta: { total: 0, page: 1, limit: 20 },
  loading: false,
  importLoading: false,
  dataLoaded: false,

  fetchCompetitors: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/v2/competitor-laundry?page=${page}&limit=20`);
      set({
        competitors: res.data.data ?? [],
        meta: res.data.meta ?? { total: 0, page, limit: 20 },
        dataLoaded: true,
      });
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Gagal memuat data kompetitor.");
    } finally {
      set({ loading: false });
    }
  },

  importFromCSV: async (file) => {
    set({ importLoading: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/v2/competitor-laundry/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { total_inserted, total_skipped, total_processed } = res.data.data;
      toast.success(
        `Import selesai! Diproses: ${total_processed} | Berhasil: ${total_inserted} | Dilewati: ${total_skipped}`
      );
      get().fetchCompetitors(1);
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
      await axios.patch(`/api/v2/competitor-laundry/${id}/status`, { status });
      toast.success("Status kompetitor berhasil diubah.");
      set((state) => ({
        competitors: state.competitors.map((c) => (c.id === id ? { ...c, status } : c)),
      }));
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Gagal mengubah status.");
      return false;
    }
  },
}));

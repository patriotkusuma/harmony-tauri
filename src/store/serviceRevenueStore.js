import { create } from "zustand";
import axios from "../services/axios-instance";
import { formatImageUrl as formatImageUrlUtil } from "../utils/formatImageUrl";

const DEFAULT_REVENUE_ACCOUNT_ID = "9f28e3d5-d62e-4833-a6c9-1a636617af44";

export const formatImageUrl = formatImageUrlUtil;

export const useServiceRevenueStore = create((set, get) => ({
  categories: [],
  services: [],
  revenueAccounts: [
    {
      id: DEFAULT_REVENUE_ACCOUNT_ID,
      code: "4101",
      name: "Pendapatan Jasa Cuci Kiloan",
      type: "Revenue",
    },
  ],
  isLoading: false,
  errorMessage: "",
  selectedCategoryId: null,
  selectedServiceId: null,
  
  viewMode: "category", // "category" or "list"
  isDetailView: false,
  priceHistory: [],

  setErrorMessage: (message) => set({ errorMessage: message }),
  clearErrorMessage: () => set({ errorMessage: "" }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDetailView: (show) => set({ isDetailView: show }),

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/api/v2/category-packets");
      const data = res.data.data?.items || res.data.data || [];
      set({ categories: data, isLoading: false });
      if (data.length > 0 && !get().selectedCategoryId) {
        set({ selectedCategoryId: data[0].id });
      }
    } catch (err) {
      set({ errorMessage: "Gagal mengambil data kategori", isLoading: false });
    }
  },

  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/api/v2/jenis-cuci");
      const data = res.data.data?.items || res.data.data || [];
      set({ services: data, isLoading: false });
    } catch (err) {
      set({ errorMessage: "Gagal mengambil data jenis cuci", isLoading: false });
    }
  },

  setSelectedCategoryId: (id) => {
    set({ selectedCategoryId: id });
  },

  setSelectedServiceId: (id) => set({ selectedServiceId: id }),

  addCategory: async (payload) => {
    try {
      await axios.post("/api/v2/category-packets", payload);
      get().fetchCategories();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal menambah kategori" });
      return false;
    }
  },

  updateCategory: async (id, payload) => {
    try {
      await axios.put(`/api/v2/category-packets/${id}`, payload);
      get().fetchCategories();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal update kategori" });
      return false;
    }
  },

  deleteCategory: async (id) => {
    try {
      await axios.delete(`/api/v2/category-packets/${id}`);
      get().fetchCategories();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal menghapus kategori" });
      return false;
    }
  },

  addService: async (data, imageFile) => {
    // Send JSON for create (backend uses ShouldBindJSON)
    const payload = {
      ...data,
      id_category_paket: Number(data.id_category_paket),
      harga: Number(data.harga),
      id_revenue_account: data.id_revenue_account || DEFAULT_REVENUE_ACCOUNT_ID,
    };

    try {
      const res = await axios.post("/api/v2/jenis-cuci", payload);
      const created = res.data.data;

      // Upload image separately if provided
      if (imageFile && created?.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await axios.put(`/api/v2/jenis-cuci/${created.id}/gambar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }).catch(() => {}); // non-fatal
      }

      get().fetchServices();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.errors || err.response?.data?.message || "Gagal menambah jenis cuci" });
      return false;
    }
  },

  updateService: async (id, data, imageFile) => {
    // Send JSON for update (backend uses ShouldBindJSON)
    const payload = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        payload[key] = data[key];
      }
    });
    if (payload.id_category_paket !== undefined) {
      payload.id_category_paket = Number(payload.id_category_paket);
    }
    if (payload.harga !== undefined) {
      payload.harga = Number(payload.harga);
    }

    try {
      await axios.put(`/api/v2/jenis-cuci/${id}`, payload);

      // Upload image separately if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await axios.put(`/api/v2/jenis-cuci/${id}/gambar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }).catch(() => {}); // non-fatal
      }

      get().fetchServices();
      get().fetchPriceHistory(id);
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.errors || err.response?.data?.message || "Gagal update jenis cuci" });
      return false;
    }
  },

  deleteService: async (id) => {
    try {
      await axios.delete(`/api/v2/jenis-cuci/${id}`);
      get().fetchServices();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal menghapus jenis cuci" });
      return false;
    }
  },

  uploadServiceImage: async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.put(`/api/v2/jenis-cuci/${id}/gambar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // Response returns the updated object in data
      const newImageUrl = res.data.data?.gambar;
      
      // Update the service in the local store
      set(state => ({
        services: state.services.map(s => s.id === id ? { ...s, gambar: newImageUrl } : s)
      }));

      return newImageUrl;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal mengunggah gambar" });
      return null;
    }
  },

  fetchPriceHistory: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/api/v2/jenis-cuci/${id}/history`);
      const data = res.data.data?.items || res.data.data || [];
      set({ priceHistory: data, isLoading: false });
    } catch (err) {
      set({ errorMessage: "Gagal mengambil riwayat harga", isLoading: false });
    }
  },


  resolveRevenueAccount: (uuidJenisCuci) => {
    const { services, revenueAccounts } = get();
    const service = services.find((item) => item.uuid_jenis_cuci === uuidJenisCuci);
    if (!service) return null;

    const mapped = revenueAccounts.find(
      (item) => item.id === service.id_revenue_account
    );
    if (mapped) return { ...mapped, source: "mapped" };

    const fallback = revenueAccounts.find(
      (item) => item.id === DEFAULT_REVENUE_ACCOUNT_ID
    );
    return fallback ? { ...fallback, source: "default" } : null;
  },

  getSelectedService: () => {
    const { services, selectedServiceId } = get();
    return services.find(s => s.id === selectedServiceId);
  }
}));



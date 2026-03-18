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
  selectedServiceUuid: null,
  
  viewMode: "category", // "category" or "list"
  isDetailView: false,

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

  setSelectedServiceUuid: (uuid) => set({ selectedServiceUuid: uuid }),

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
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    if (imageFile) {
      formData.append("gambar", imageFile);
    }
    // Ensure numeric types
    formData.set("id_category_paket", Number(data.id_category_paket));
    formData.set("harga", Number(data.harga));
    if (!data.id_revenue_account) {
       formData.set("id_revenue_account", DEFAULT_REVENUE_ACCOUNT_ID);
    }

    try {
      await axios.post("/api/v2/jenis-cuci", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      get().fetchServices();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal menambah jenis cuci" });
      return false;
    }
  },

  updateService: async (id, data, imageFile) => {
    // If it's standard JSON update (without image), we can still use FormData or logic to switch
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
         formData.append(key, data[key]);
      }
    });
    
    if (imageFile) {
      formData.append("gambar", imageFile);
    }
    
    // Ensure numeric types
    formData.set("id_category_paket", Number(data.id_category_paket));
    formData.set("harga", Number(data.harga));

    try {
      // NOTE: Some backends require POST with _method=PUT for multipart updates
      // We'll try standard PUT first, common in modern APIs
      await axios.put(`/api/v2/jenis-cuci/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      get().fetchServices();
      return true;
    } catch (err) {
      set({ errorMessage: err.response?.data?.message || "Gagal update jenis cuci" });
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
    const { services, selectedServiceUuid } = get();
    return services.find(s => s.uuid_jenis_cuci === selectedServiceUuid);
  }
}));



import { create } from "zustand";
import axios from "../services/axios-instance";
import { toast } from "react-toastify";

const useSupplierStore = create((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,
  
  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("api/v2/suppliers");
      set({ suppliers: res.data?.data || [] });
    } catch (error) {
      console.error(error);
      set({ error: error.message });
      toast.error("Gagal menarik data Supplier");
    } finally {
      set({ loading: false });
    }
  },

  createSupplier: async (data) => {
    try {
      await axios.post("api/v2/suppliers", data);
      toast.success("Supplier berhasil didaftarkan");
      await get().fetchSuppliers();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.details || "Gagal mendaftarkan Supplier");
      return false;
    }
  },

  updateSupplier: async (id, data) => {
    try {
      await axios.put(`api/v2/suppliers/${id}`, data);
      toast.success("Data supplier berhasil diperbarui");
      await get().fetchSuppliers();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.details || "Gagal memperbarui Supplier");
      return false;
    }
  },

  deleteSupplier: async (id) => {
    try {
      await axios.delete(`api/v2/suppliers/${id}`);
      toast.success("Supplier berhasil dihapus");
      await get().fetchSuppliers();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.details || "Gagal menghapus Supplier");
      return false;
    }
  }
}));

export default useSupplierStore;

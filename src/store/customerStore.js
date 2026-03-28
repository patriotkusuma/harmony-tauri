import { create } from 'zustand';
import axios from 'services/axios-instance';

/* ─── Helpers ─────────────────────────────────────────────────── */
const buildParams = ({ search = '', page = 1, limit = 10 }) => {
  const p = new URLSearchParams();
  if (search) p.set('search', search);
  p.set('page', page);
  p.set('limit', limit);
  return p.toString();
};

/* ─── Initial state ───────────────────────────────────────────── */
const initialState = {
  // List
  customers: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  loading: false,
  error: null,

  // Detail / selected
  selected: null,
  detailLoading: false,
  detailError: null,

  // Modal state
  modalMode: null,      // 'create' | 'edit' | 'detail' | null
  modalOpen: false,

  // Form
  formLoading: false,
  formError: null,
};

/* ─── Store ───────────────────────────────────────────────────── */
export const useCustomerStore = create((set, get) => ({
  ...initialState,

  /* ── Fetch list ───────────────────────────────────────────── */
  fetchCustomers: async (params = {}) => {
    const { search, page, limit } = { ...get(), ...params };
    set({ loading: true, error: null });
    try {
      const query = buildParams({ search, page, limit });
      const res = await axios.get(`/api/v2/customer?${query}`);
      const { data, total } = res.data;
      set({ customers: data ?? [], total: total ?? 0, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.error ?? 'Gagal memuat data customer.' });
    }
  },

  /* ── Fetch detail ─────────────────────────────────────────── */
  fetchDetail: async (id) => {
    set({ detailLoading: true, detailError: null });
    try {
      const res = await axios.get(`/api/v2/customer/${id}`);
      set({ selected: res.data.data, detailLoading: false });
    } catch (err) {
      set({ detailLoading: false, detailError: err?.response?.data?.error ?? 'Customer tidak ditemukan.' });
    }
  },

  /* ── Create ───────────────────────────────────────────────── */
  createCustomer: async (payload) => {
    set({ formLoading: true, formError: null });
    try {
      await axios.post('/api/v2/customer', payload);
      set({ formLoading: false });
      get().closeModal();
      get().fetchCustomers();
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.error ?? 'Gagal membuat customer.';
      set({ formLoading: false, formError: msg });
      return { ok: false, error: msg };
    }
  },

  /* ── Update ───────────────────────────────────────────────── */
  updateCustomer: async (id, payload) => {
    set({ formLoading: true, formError: null });
    try {
      await axios.put(`/api/v2/customer/${id}`, payload);
      set({ formLoading: false });
      get().closeModal();
      get().fetchCustomers();
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.error ?? 'Gagal mengupdate customer.';
      set({ formLoading: false, formError: msg });
      return { ok: false, error: msg };
    }
  },

  /* ── Delete ───────────────────────────────────────────────── */
  deleteCustomer: async (id) => {
    try {
      await axios.delete(`/api/v2/customer/${id}`);
      get().fetchCustomers();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.response?.data?.error ?? 'Gagal menghapus customer.' };
    }
  },

  /* ── Pagination / search helpers ─────────────────────────── */
  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCustomers({ search, page: 1 });
  },
  setPage: (page) => {
    set({ page });
    get().fetchCustomers({ page });
  },

  /* ── Modal helpers ────────────────────────────────────────── */
  openCreate: () => set({ modalOpen: true, modalMode: 'create', selected: null, formError: null }),
  openEdit: (customer) => set({ modalOpen: true, modalMode: 'edit', selected: customer, formError: null }),
  openDetail: (customer) => set({ modalOpen: true, modalMode: 'detail', selected: customer }),
  closeModal: () => set({ modalOpen: false, modalMode: null, formError: null }),

  /* ── Reset ────────────────────────────────────────────────── */
  reset: () => set(initialState),
}));

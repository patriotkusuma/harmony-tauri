import { create } from 'zustand';
import axios from '../services/axios-instance';

const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const formatDate = (d) => d.toISOString().split('T')[0];

export const DEFAULT_DENOMINATIONS = [
  { nominal: 100000, label: 'Rp 100.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 50000, label: 'Rp 50.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 20000, label: 'Rp 20.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 10000, label: 'Rp 10.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 5000, label: 'Rp 5.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 2000, label: 'Rp 2.000 (Kertas)', qty: 0, subtotal: 0 },
  { nominal: 1000, label: 'Rp 1.000 (Kertas/Koin)', qty: 0, subtotal: 0 },
  { nominal: 500, label: 'Rp 500 (Koin)', qty: 0, subtotal: 0 },
  { nominal: 200, label: 'Rp 200 (Koin)', qty: 0, subtotal: 0 },
  { nominal: 100, label: 'Rp 100 (Koin)', qty: 0, subtotal: 0 },
];

export const useCashierAuditStore = create((set, get) => ({
  activeShift: null,
  userRole: 'pegawai',
  historyItems: [],
  summaryStats: {
    total_shifts: 0,
    open_shifts: 0,
    match_shifts: 0,
    shortage_shifts: 0,
    overage_shifts: 0,
    total_shortage_amount: 0,
    total_overage_amount: 0,
  },
  totalItems: 0,
  selectedShiftDetail: null,
  lastClosedResult: null,
  loadingActive: false,
  loadingHistory: false,
  submitting: false,
  filters: {
    status: '',
    start_date: formatDate(firstDayOfMonth),
    end_date: formatDate(today),
    page: 1,
    limit: 15,
  },

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  clearLastClosedResult: () => set({ lastClosedResult: null }),

  fetchActiveShift: async () => {
    set({ loadingActive: true });
    try {
      const res = await axios.get('api/v2/cashier-audit/active');
      set({
        activeShift: res.data?.data || null,
        userRole: res.data?.user_role || 'pegawai',
      });
      return res.data?.data || null;
    } catch (err) {
      console.error('[cashierAuditStore] fetchActiveShift error:', err);
      return null;
    } finally {
      set({ loadingActive: false });
    }
  },

  fetchShiftHistory: async (overrideFilters = {}) => {
    set({ loadingHistory: true });
    try {
      const currentFilters = { ...get().filters, ...overrideFilters };
      const params = new URLSearchParams();
      if (currentFilters.status) params.append('status', currentFilters.status);
      if (currentFilters.start_date) params.append('start_date', currentFilters.start_date);
      if (currentFilters.end_date) params.append('end_date', currentFilters.end_date);
      params.append('page', currentFilters.page || 1);
      params.append('limit', currentFilters.limit || 15);

      const res = await axios.get(`api/v2/cashier-audit/history?${params.toString()}`);
      set({
        historyItems: res.data?.items || [],
        summaryStats: res.data?.summary || get().summaryStats,
        totalItems: res.data?.total_items || 0,
      });
    } catch (err) {
      console.error('[cashierAuditStore] fetchShiftHistory error:', err);
    } finally {
      set({ loadingHistory: false });
    }
  },

  fetchShiftDetail: async (shiftId) => {
    try {
      const res = await axios.get(`api/v2/cashier-audit/${shiftId}`);
      set({ selectedShiftDetail: res.data?.data || null });
      return res.data?.data || null;
    } catch (err) {
      console.error('[cashierAuditStore] fetchShiftDetail error:', err);
      throw err;
    }
  },

  openShift: async (payload) => {
    set({ submitting: true });
    try {
      const res = await axios.post('api/v2/cashier-audit/open', payload);
      await get().fetchActiveShift();
      await get().fetchShiftHistory();
      return res.data?.data;
    } finally {
      set({ submitting: false });
    }
  },

  addMutation: async (payload) => {
    set({ submitting: true });
    try {
      const res = await axios.post('api/v2/cashier-audit/mutations', payload);
      await get().fetchActiveShift();
      return res.data?.data;
    } finally {
      set({ submitting: false });
    }
  },

  closeShift: async (payload) => {
    set({ submitting: true });
    try {
      const res = await axios.post('api/v2/cashier-audit/close', payload);
      const closedShift = res.data?.data || null;
      set({
        activeShift: null,
        lastClosedResult: closedShift,
      });
      await get().fetchShiftHistory();
      return closedShift;
    } finally {
      set({ submitting: false });
    }
  },

  reviewShift: async (shiftId, reviewNotes) => {
    set({ submitting: true });
    try {
      const res = await axios.patch(`api/v2/cashier-audit/${shiftId}/review`, {
        review_notes: reviewNotes,
      });
      const updated = res.data?.data;
      set({ selectedShiftDetail: updated });
      await get().fetchShiftHistory();
      return updated;
    } finally {
      set({ submitting: false });
    }
  },
}));

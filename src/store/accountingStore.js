import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default: dari awal bulan hingga hari ini
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const formatDate = (date) => date.toISOString().split('T')[0];

const initialFilters = {
  startDate: formatDate(firstDayOfMonth),
  endDate: formatDate(today),
};

export const useAccountingStore = create(
  persist(
    (set) => ({
      // State
      filters: initialFilters,
      activeReportTab: 'summary', // 'summary' | 'income-statement' | 'balance-sheet' | 'cash-flow' | 'equity-changes' | 'notes' | 'periods'

      // Actions
      setFilters: (updater) => set((state) => ({
        filters: typeof updater === 'function' ? updater(state.filters) : { ...state.filters, ...updater }
      })),

      setActiveReportTab: (tab) => set({ activeReportTab: tab }),

      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: 'accounting-storage', // Persistent localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

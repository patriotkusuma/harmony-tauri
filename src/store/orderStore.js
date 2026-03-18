import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialFilters = {
  page: 1,
  rowPerPage: 10,
  search: '',
  dateFrom: null,
  dateTo: null,
  status: '',
};

export const useOrderStore = create(
  persist(
    (set) => ({
      // State
      viewMode: 'list',
      filters: initialFilters,
      selectedOrder: null,
      isDetailModalOpen: false,

      // Actions
      setViewMode: (mode) => set((state) => {
        // Adjust rowPerPage based on viewMode
        const newRowPerPage = mode === 'grid' ? 12 : 10;
        return { 
          viewMode: mode, 
          filters: { ...state.filters, rowPerPage: newRowPerPage, page: 1 } 
        };
      }),

      setFilters: (updater) => set((state) => ({
        filters: typeof updater === 'function' ? updater(state.filters) : { ...state.filters, ...updater }
      })),

      resetFilters: () => set({ filters: initialFilters }),

      setSelectedOrder: (order) => set({ selectedOrder: order }),

      toggleDetailModal: (order = null) => set((state) => ({
        selectedOrder: order !== null ? order : state.selectedOrder,
        isDetailModalOpen: !state.isDetailModalOpen
      })),
    }),
    {
      name: 'order-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ viewMode: state.viewMode }), // Only persist viewMode
    }
  )
);

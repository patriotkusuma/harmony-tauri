import { create } from 'zustand';

export const useInventoryStore = create((set) => ({
    filters: {
        page: 1,
        limit: 10,
        search: '',
    },
    selectedItem: null,
    isDetailModalOpen: false,
    isAdjustModalOpen: false,
    isCreateModalOpen: false,

    setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
    })),
    setSelectedItem: (item) => set({ selectedItem: item }),
    toggleDetailModal: (isOpen = null) => set((state) => ({ 
        isDetailModalOpen: isOpen !== null ? isOpen : !state.isDetailModalOpen 
    })),
    toggleAdjustModal: (isOpen = null) => set((state) => ({ 
        isAdjustModalOpen: isOpen !== null ? isOpen : !state.isAdjustModalOpen 
    })),
    toggleCreateModal: (isOpen = null) => set((state) => ({ 
        isCreateModalOpen: isOpen !== null ? isOpen : !state.isCreateModalOpen 
    })),
    
    resetSelection: () => set({
        selectedItem: null,
    }),
}));

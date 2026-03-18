import { create } from 'zustand';

export const usePurchaseStore = create((set) => ({
    // State
    filters: {
        page: 1,
        limit: 10,
        search: '',
        type: '',
    },
    viewMode: 'list',
    selectedPurchase: null,
    isFormModalOpen: false,
    editMode: false,

    // Actions
    setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
    })),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSelectedPurchase: (purchase) => set({ selectedPurchase: purchase }),
    toggleFormModal: (isOpen = null) => set((state) => ({ 
        isFormModalOpen: isOpen !== null ? isOpen : !state.isFormModalOpen 
    })),
    setEditMode: (isEdit) => set({ editMode: isEdit }),
    
    resetForm: () => set({
        selectedPurchase: null,
        editMode: false,
    }),
}));

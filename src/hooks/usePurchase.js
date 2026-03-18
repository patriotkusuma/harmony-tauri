import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "services/axios-instance";
import { toast } from "react-toastify";
import { usePurchaseStore } from "store/purchaseStore";

const PURCHASE_QUERY_KEY = ["purchases"];
const REF_QUERY_KEY = ["purchase_references"];

export const usePurchase = () => {
  const queryClient = useQueryClient();

  const filters = usePurchaseStore((state) => state.filters);
  const setFilters = usePurchaseStore((state) => state.setFilters);
  const isFormModalOpen = usePurchaseStore((state) => state.isFormModalOpen);
  const toggleFormModal = usePurchaseStore((state) => state.toggleFormModal);
  const editMode = usePurchaseStore((state) => state.editMode);
  const setEditMode = usePurchaseStore((state) => state.setEditMode);
  const selectedPurchase = usePurchaseStore((state) => state.selectedPurchase);
  const setSelectedPurchase = usePurchaseStore(
    (state) => state.setSelectedPurchase,
  );
  const resetForm = usePurchaseStore((state) => state.resetForm);

  // 1. Fetch Purchases List
  const {
    data: purchases,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...PURCHASE_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await axios.get("api/v2/purchases", { params: filters });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Reference Data
  const { data: references } = useQuery({
    queryKey: REF_QUERY_KEY,
    queryFn: async () => {
      const [suppliers, units, assets, expenses, inventory] = await Promise.all(
        [
          axios.get("api/v2/suppliers"),
          axios.get("api/v2/satuans"),
          axios.get("api/v2/accounts?type=Assets"),
          axios.get("api/v2/accounts?type=Expense"),
          axios.get("api/v2/inventory"),
        ],
      );
      return {
        suppliers: suppliers.data?.data || [],
        units: units.data?.data || [],
        // Defensive check for 204 or empty responses
        assetAccounts: assets.status === 204 ? [] : assets.data?.data || [],
        expenseAccounts:
          expenses.status === 204 ? [] : expenses.data?.data || [],
        inventory: inventory.data?.data || [],
      };
    },
    staleTime: 30 * 60 * 1000, // Long lived
  });

  // 3. Create Purchase Mutation
  const createPurchase = useMutation({
    mutationFn: (payload) => axios.post("api/v2/purchases", payload),
    onSuccess: () => {
      toast.success("Pembelian berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: PURCHASE_QUERY_KEY });
      toggleFormModal(false);
      resetForm();
    },
    onError: (err) => {
      const msg = err.response?.data?.error || "Gagal menyimpan pembelian.";
      toast.error(msg);
    },
  });

  // 4. Update Purchase Mutation
  const updatePurchase = useMutation({
    mutationFn: ({ id, payload }) =>
      axios.patch(`api/v2/purchases/${id}`, payload),
    onSuccess: () => {
      toast.success("Pembelian berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: PURCHASE_QUERY_KEY });
      toggleFormModal(false);
      resetForm();
    },
    onError: (err) => {
      const msg = err.response?.data?.error || "Gagal memperbarui pembelian.";
      toast.error(msg);
    },
  });

  // 5. Delete Purchase Mutation
  const deletePurchase = useMutation({
    mutationFn: (id) => axios.delete(`api/v2/purchases/${id}`),
    onSuccess: () => {
      toast.success("Pembelian berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: PURCHASE_QUERY_KEY });
    },
    onError: (err) => {
      const msg = err.response?.data?.error || "Gagal menghapus pembelian.";
      toast.error(msg);
    },
  });

  const handleEdit = useCallback(
    (purchase) => {
      setSelectedPurchase(purchase);
      setEditMode(true);
      toggleFormModal(true);
    },
    [setSelectedPurchase, setEditMode, toggleFormModal],
  );

  const handleAddNew = useCallback(() => {
    resetForm();
    setEditMode(false);
    toggleFormModal(true);
  }, [resetForm, setEditMode, toggleFormModal]);

  return {
    // State
    purchases,
    isLoading,
    isError,
    filters,
    setFilters,
    isFormModalOpen,
    toggleFormModal,
    editMode,
    selectedPurchase,
    references: references || {
      suppliers: [],
      units: [],
      assetAccounts: [],
      expenseAccounts: [],
      inventory: [],
    },

    // Actions
    handleEdit,
    handleAddNew,
    createPurchase: createPurchase.mutate,
    updatePurchase: updatePurchase.mutate,
    deletePurchase: deletePurchase.mutate,
    isSubmitting: createPurchase.isLoading || updatePurchase.isLoading,
    refresh: refetch,
  };
};

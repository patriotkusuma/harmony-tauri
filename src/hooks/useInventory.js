import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';
import { useInventoryStore } from 'store/inventoryStore';

const INVENTORY_QUERY_KEY = ['inventory'];
const MOVEMENT_QUERY_KEY = ['inventory_movements'];

export const useInventory = () => {
    const queryClient = useQueryClient();
    const filters = useInventoryStore((state) => state.filters);
    const selectedItem = useInventoryStore((state) => state.selectedItem);
    const toggleAdjustModal = useInventoryStore((state) => state.toggleAdjustModal);
    const toggleCreateModal = useInventoryStore((state) => state.toggleCreateModal);

    // 1. Fetch Inventory List
    const { data: inventory, isLoading, isError, refetch } = useQuery({
        queryKey: [...INVENTORY_QUERY_KEY, filters],
        queryFn: async () => {
            const res = await axios.get('api/v2/inventory', { params: filters });
            return res.data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });

    // 2. Fetch Movements for Selected Item
    const { data: movements, isLoading: isLoadingMovements } = useQuery({
        queryKey: [...MOVEMENT_QUERY_KEY, selectedItem?.uuid],
        queryFn: async () => {
            if (!selectedItem?.uuid) return [];
            const res = await axios.get(`api/v2/inventory/${selectedItem.uuid}/movements`);
            return res.data.data || [];
        },
        enabled: !!selectedItem?.uuid,
    });

    // 3. Fetch Units (Satuans) for reference
    const { data: units } = useQuery({
        queryKey: ['satuans'],
        queryFn: async () => {
            const res = await axios.get('api/v2/satuans');
            return res.data?.data || [];
        },
        staleTime: 30 * 60 * 1000,
    });

    // 4. Adjust Stock Mutation
    const adjustStock = useMutation({
        mutationFn: (payload) => 
            axios.post(`api/v2/inventory/${selectedItem?.uuid}/adjust`, payload),
        onSuccess: () => {
            toast.success("Stok berhasil disesuaikan!");
            queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...MOVEMENT_QUERY_KEY, selectedItem?.uuid] });
            toggleAdjustModal(false);
        },
        onError: (err) => {
            const msg = err.response?.data?.error || "Gagal menyesuaikan stok.";
            toast.error(msg);
        }
    });

    // 5. Create Inventory Mutation
    const createInventory = useMutation({
        mutationFn: (payload) => axios.post('api/v2/inventory', payload),
        onSuccess: () => {
            toast.success("Barang inventory berhasil ditambahkan!");
            queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
            toggleCreateModal(false);
        },
        onError: (err) => {
            const msg = err.response?.data?.error || "Gagal menambahkan barang.";
            toast.error(msg);
        }
    });

    return {
        inventory,
        movements: movements || [], // Default to empty array
        isLoading,
        isLoadingMovements,
        isError,
        filters,
        setFilters: useInventoryStore((state) => state.setFilters),
        references: {
            units: units || [],
        },
        adjustStock: adjustStock.mutate,
        createInventory: createInventory.mutate,
        isSubmitting: adjustStock.isLoading || createInventory.isLoading,
        refresh: refetch
    };
};

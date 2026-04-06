import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';

const SATUAN_QUERY_KEY = ['satuans'];

export const useSatuan = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Satuan List
    const { data: units, isLoading, isError, refetch } = useQuery({
        queryKey: SATUAN_QUERY_KEY,
        queryFn: async () => {
            const res = await axios.get('api/v2/satuans');
            return res.data?.data || [];
        },
        staleTime: 10 * 60 * 1000,
    });

    // 2. Create Satuan
    const createSatuan = useMutation({
        mutationFn: (payload) => axios.post('api/v2/satuans', payload),
        onSuccess: () => {
            toast.success("Satuan berhasil ditambahkan!");
            queryClient.invalidateQueries({ queryKey: SATUAN_QUERY_KEY });
        },
        onError: (err) => {
            const msg = err.response?.data?.error || "Gagal menambahkan satuan.";
            toast.error(msg);
        }
    });

    // 3. Update Satuan
    const updateSatuan = useMutation({
        mutationFn: ({ id, payload }) => axios.put(`api/v2/satuans/${id}`, payload),
        onSuccess: () => {
            toast.success("Satuan berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: SATUAN_QUERY_KEY });
        },
        onError: (err) => {
            const msg = err.response?.data?.error || "Gagal memperbarui satuan.";
            toast.error(msg);
        }
    });

    // 4. Delete Satuan
    const deleteSatuan = useMutation({
        mutationFn: (id) => axios.delete(`api/v2/satuans/${id}`),
        onSuccess: () => {
            toast.success("Satuan berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: SATUAN_QUERY_KEY });
        },
        onError: (err) => {
            const msg = err.response?.data?.error || "Gagal menghapus satuan.";
            toast.error(msg);
        }
    });

    return {
        units,
        isLoading,
        isError,
        createSatuan: createSatuan.mutate,
        updateSatuan: updateSatuan.mutate,
        deleteSatuan: deleteSatuan.mutateAsync,
        isSubmitting: createSatuan.isLoading || updateSatuan.isLoading || deleteSatuan.isLoading,
        refresh: refetch
    };
};

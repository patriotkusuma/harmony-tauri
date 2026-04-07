import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';

export const useInventoryAudit = () => {
    const queryClient = useQueryClient();

    // 1. Get Audit History
    const { data: audits = [], isLoading } = useQuery({
        queryKey: ['inventory-audits'],
        queryFn: async () => {
             // BASE_URL added by interceptor
            const response = await axios.get('api/v2/inventory/audit/history');
            return response.data;
        }
    });

    // 2. Perform Audit
    const { mutate: performAudit, isLoading: isSubmitting } = useMutation({
        mutationFn: async (payload) => {
            const response = await axios.post('api/v2/inventory/audit', payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(`Stock opname berhasil dicatat! Selisih: ${data.difference}`);
            queryClient.invalidateQueries(['inventory-audits']);
            queryClient.invalidateQueries(['inventory']); // Refresh stock in main list
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Gagal mencatat stock opname');
        }
    });

    return {
        audits,
        isLoading,
        performAudit,
        isSubmitting
    };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'services/axios-instance';
import { toast } from 'react-toastify';

const ACTIVITY_LOG_KEY = ['activity_logs'];

export const useActivityLog = (filters = {}) => {
    const queryClient = useQueryClient();

    // 1. Fetch Logs
    const { data: logs, isLoading, refetch } = useQuery({
        queryKey: [...ACTIVITY_LOG_KEY, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.type) params.append('type', filters.type);
            if (filters.level) params.append('level', filters.level);
            if (filters.search) params.append('search', filters.search);

            const res = await axios.get(`api/v2/activities?${params.toString()}`);
            return res.data;
        },
        keepPreviousData: true,
        staleTime: 30000, // 30 seconds
    });

    // 2. Fetch Unread Count
    const { data: unreadCount } = useQuery({
        queryKey: ['activity_unread_count'],
        queryFn: async () => {
            const res = await axios.get('api/v2/activities/unread-count');
            return res.data?.count || 0;
        },
        refetchInterval: 60000, // Check every minute
    });

    // 3. Mark as Read
    const markAsRead = useMutation({
        mutationFn: (ids = []) => axios.post('api/v2/activities/read', { ids }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACTIVITY_LOG_KEY });
            queryClient.invalidateQueries({ queryKey: ['activity_unread_count'] });
        },
    });

    return {
        logs: logs?.data || [],
        total: logs?.total || 0,
        currentPage: logs?.current_page || 1,
        limit: logs?.limit || 10,
        unreadCount,
        isLoading,
        markAsRead: markAsRead.mutate,
        refresh: refetch
    };
};

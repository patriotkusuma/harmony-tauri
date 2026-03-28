import { useQuery } from '@tanstack/react-query';
import { insightService } from '../services/api/insight';

export const useAiInsights = (period = 'monthly', outletId = null) => {
  const authToken = localStorage.getItem("token");

  const query = useQuery({
    queryKey: ["ai-insights", period, outletId],
    queryFn: () => insightService.fetchAiInsights(period, outletId),
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60, // 1 hour stale time for insights
  });

  const refetchWithRefresh = async () => {
    return insightService.fetchAiInsights(period, outletId, true);
  };

  return { ...query, refetchWithRefresh };
};

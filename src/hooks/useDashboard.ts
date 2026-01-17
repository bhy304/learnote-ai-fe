import dashboardAPI from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard(),
    staleTime: 60 * 1000, // 1분 동안 캐시를 fresh 상태로 유지
  });
};

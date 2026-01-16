import dashboardAPI from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard(),
    staleTime: 60 * 1000, // 1분 동안 데이터를 신선한 상태로 유지
  });
};

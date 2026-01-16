import dashboardAPI from '@/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useDashboardTodos = () => {
  return useQuery({
    queryKey: ['dashboard', 'todos'],
    queryFn: () => dashboardAPI.getDashboardTodos(),
  });
};

import dashboardAPI from '@/api/dashboard.api';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useDashboard = () => {
  const hasNotes = useAuthStore((state) => state.hasNotes);
  const setHasNotes = useAuthStore((state) => state.setHasNotes);

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard(),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      const currentHasNotes = query.data.totalNotes > 0;
      if (currentHasNotes !== hasNotes) {
        setHasNotes(currentHasNotes);
      }
    }
  }, [query.data, hasNotes, setHasNotes]);

  return query;
};

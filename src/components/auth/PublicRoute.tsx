import { useAuthStore } from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

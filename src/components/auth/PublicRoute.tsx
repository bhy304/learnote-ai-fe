import { useAuthStore } from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

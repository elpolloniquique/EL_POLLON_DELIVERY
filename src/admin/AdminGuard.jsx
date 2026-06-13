import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function AdminGuard() {
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando sesión…</p>
      </div>
    );
  }

  if (!profile?.active) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

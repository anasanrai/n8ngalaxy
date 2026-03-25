import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Spinner } from '../ui/Spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Cast to include role field added via migration
  const role = (profile as (typeof profile & { role?: string }) | null)?.role;

  if (!profile || role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

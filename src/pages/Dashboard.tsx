import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { profile } = useAuth();
  
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-4 text-text-secondary">Welcome back, {profile?.full_name || profile?.email || 'User'}</p>
    </div>
  );
}

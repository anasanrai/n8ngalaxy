import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function SandboxStandaloneHeader() {
  const { user } = useAuth();
  return (
    <div style={{ height: 40, background: '#0D0D14', borderBottom: '0.5px solid #1E1E30', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#6B7280' }}>n8n</span>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#7C3AED' }}>Galaxy</span>
      </Link>
      {user && (
        <Link to="/dashboard" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>
          Dashboard
        </Link>
      )}
    </div>
  );
}

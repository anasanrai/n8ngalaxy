import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function TopBar() {
  const user = useAuthStore((s) => s.user);

  return (
    <div
      style={{
        height: 40,
        background: '#0D0D14',
        borderBottom: '0.5px solid #1E1E30',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#9CA3AF', fontSize: 13 }}>n8n</span>
        <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: '#F4F4F8', fontSize: 13, marginLeft: 2 }}>Galaxy</span>
      </Link>
      
      {user ? (
        <Link 
          to="/dashboard" 
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9CA3AF', textDecoration: 'none', transition: 'color 150ms' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F4F4F8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          Dashboard
        </Link>
      ) : (
        <Link 
          to="/auth" 
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9CA3AF', textDecoration: 'none', transition: 'color 150ms' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F4F4F8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          Sign in
        </Link>
      )}
    </div>
  );
}

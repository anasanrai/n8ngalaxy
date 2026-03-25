import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Terminal, Users, DollarSign, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

type ActivePage = 'overview' | 'sandboxes' | 'users' | 'revenue';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: ActivePage;
}

const navItems: { page: ActivePage; label: string; icon: React.ReactNode; path: string }[] = [
  { page: 'overview',  label: 'Overview',  icon: <LayoutDashboard size={16} />, path: '/admin' },
  { page: 'sandboxes', label: 'Sandboxes', icon: <Terminal size={16} />,        path: '/admin/sandboxes' },
  { page: 'users',     label: 'Users',     icon: <Users size={16} />,           path: '/admin/users' },
  { page: 'revenue',  label: 'Revenue',    icon: <DollarSign size={16} />,      path: '/admin/revenue' },
];

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D14]">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
        style={{ background: '#0D0D14', borderRight: '1px solid #1E1E30' }}
      >
        {/* Logo */}
        <div className="px-5 py-6" style={{ borderBottom: '1px solid #1E1E30' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#9CA3AF', fontSize: 18 }}>
            n8n
          </span>
          <span
            style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: '#7C3AED', fontSize: 18, marginLeft: 2 }}
          >
            Galaxy
          </span>
          <p style={{ fontSize: 10, color: '#6B7280', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Admin
          </p>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-2">
          <p style={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
            MAIN
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ page, label, icon, path }) => {
            const isActive = activePage === page;
            return (
              <Link
                key={page}
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  ...(isActive
                    ? {
                        background: 'rgba(124,58,237,0.12)',
                        color: '#7C3AED',
                        borderRight: '3px solid #7C3AED',
                      }
                    : {
                        color: '#9CA3AF',
                        background: 'transparent',
                      }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = '#13131F';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: profile + logout */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid #1E1E30' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: '#7C3AED', fontSize: 12 }}
            >
              AN
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>Anasan Rai</p>
              <p style={{ color: '#6B7280', fontSize: 11 }}>Admin</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{ color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none', padding: 4, borderRadius: 4 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#EF4444')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#6B7280')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8 min-h-screen bg-[#0D0D14]">
        {children}
      </main>
    </div>
  );
}

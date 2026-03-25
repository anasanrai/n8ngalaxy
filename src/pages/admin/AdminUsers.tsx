import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { formatRelativeTime } from '../../lib/formatters';
import { X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProfileWithCounts {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  sandbox_sessions: { count: number }[];
  purchases: { count: number }[];
}

interface SandboxSession {
  id: string;
  tier: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface Purchase {
  id: string;
  amount_cents: number | null;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }: { name: string | null; size?: number }) {
  const initials = (name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const hue = [...(name ?? 'X')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 35%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'admin';
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 9999,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        background: isAdmin ? 'rgba(124,58,237,0.15)' : 'rgba(107,114,128,0.15)',
        color: isAdmin ? '#7C3AED' : '#6B7280',
      }}
    >
      {role}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<ProfileWithCounts | null>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const { data: profiles = [], isLoading } = useQuery<ProfileWithCounts[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, sandbox_sessions(count), purchases(count)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ProfileWithCounts[];
    },
  });

  // Side-panel sessions
  const { data: userSessions = [] } = useQuery<SandboxSession[]>({
    queryKey: ['admin', 'user-sessions', selectedUser?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sandbox_sessions')
        .select('id, tier, status, created_at, expires_at')
        .eq('user_id', selectedUser!.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as SandboxSession[];
    },
    enabled: !!selectedUser,
  });

  // Side-panel purchases
  const { data: userPurchases = [] } = useQuery<Purchase[]>({
    queryKey: ['admin', 'user-purchases', selectedUser?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('id, amount_cents, created_at')
        .eq('user_id', selectedUser!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Purchase[];
    },
    enabled: !!selectedUser,
  });

  // Filtered
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.email?.toLowerCase().includes(q) ||
        (p.full_name ?? '').toLowerCase().includes(q)
    );
  }, [profiles, search]);

  // Stats
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const totalUsers = profiles.length;
  const activeThisWeek = profiles.filter((p) => new Date(p.created_at) >= weekAgo).length;
  const paidCustomers = profiles.filter((p) => (p.purchases?.[0]?.count ?? 0) > 0).length;

  const handleRoleChange = async (newRole: string) => {
    if (!selectedUser) return;
    setRoleUpdating(true);
    await supabase
      .from('profiles')
      // @ts-expect-error role column added via migration, not in generated types yet
      .update({ role: newRole })
      .eq('id', selectedUser.id);
    setRoleUpdating(false);
    // Update local state
    setSelectedUser({ ...selectedUser, role: newRole });
  };

  return (
    <AdminLayout activePage="users">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8' }}>Users</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name…"
          style={{
            width: 260,
            height: 36,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid #1E1E30',
            background: '#13131F',
            color: '#F4F4F8',
            fontSize: 13,
            outline: 'none',
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users',         value: totalUsers,    color: '#F4F4F8' },
          { label: 'Joined this week',     value: activeThisWeek, color: '#00E5C7' },
          { label: 'Paid customers',       value: paidCustomers,  color: '#7C3AED' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{label}</p>
            <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 32, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#0D0D14', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {['User', 'Email', 'Role', 'Sandboxes', 'Purchases', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3" style={{ whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center" style={{ color: '#6B7280' }}>Loading…</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#13131F' : '#0D0D14', borderTop: '1px solid #1E1E30', height: 56 }}>
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.full_name ?? p.email} size={30} />
                      <span style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 500 }}>{p.full_name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{p.email}</td>
                  <td className="px-5"><RoleBadge role={p.role ?? 'user'} /></td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{p.sandbox_sessions?.[0]?.count ?? 0}</td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{p.purchases?.[0]?.count ?? 0}</td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{formatRelativeTime(p.created_at)}</td>
                  <td className="px-5">
                    <button
                      onClick={() => setSelectedUser(p)}
                      style={{
                        height: 28,
                        padding: '0 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: 'rgba(124,58,237,0.1)',
                        color: '#7C3AED',
                        border: '1px solid rgba(124,58,237,0.3)',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over panel */}
      {selectedUser && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSelectedUser(null)}
          />
          <aside
            className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
            style={{ width: 420, background: '#13131F', borderLeft: '1px solid #1E1E30' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #1E1E30' }}>
              <div className="flex items-center gap-3">
                <Avatar name={selectedUser.full_name ?? selectedUser.email} size={36} />
                <div>
                  <p style={{ color: '#F4F4F8', fontWeight: 600, fontSize: 14 }}>{selectedUser.full_name ?? '—'}</p>
                  <p style={{ color: '#6B7280', fontSize: 12 }}>{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Role selector */}
              <div>
                <p style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Role</p>
                <select
                  value={selectedUser.role ?? 'user'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={roleUpdating}
                  style={{
                    width: '100%',
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 8,
                    border: '1px solid #1E1E30',
                    background: '#0D0D14',
                    color: '#F4F4F8',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              {/* Meta */}
              <div>
                <p style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Joined</p>
                <p style={{ color: '#F4F4F8', fontSize: 13 }}>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </div>

              {/* Sandbox history */}
              <div>
                <p style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Sandbox History (last 5)
                </p>
                {userSessions.length === 0 ? (
                  <p style={{ color: '#6B7280', fontSize: 13 }}>No sandboxes yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userSessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: '#0D0D14' }}>
                        <span style={{ color: '#F4F4F8', fontSize: 13, textTransform: 'capitalize' }}>{s.tier}</span>
                        <span style={{ color: '#6B7280', fontSize: 12 }}>{formatRelativeTime(s.created_at)}</span>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          background: s.status === 'active' ? 'rgba(0,229,199,0.1)' : 'rgba(107,114,128,0.1)',
                          color: s.status === 'active' ? '#00E5C7' : '#6B7280',
                        }}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase history */}
              <div>
                <p style={{ color: '#9CA3AF', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Purchases
                </p>
                {userPurchases.length === 0 ? (
                  <p style={{ color: '#6B7280', fontSize: 13 }}>No purchases yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userPurchases.map((pu) => (
                      <div key={pu.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: '#0D0D14' }}>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', color: '#9CA3AF', fontSize: 11 }}>{pu.id.slice(0, 8)}…</span>
                        <span style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 600 }}>
                          {pu.amount_cents ? `$${(pu.amount_cents / 100).toFixed(2)}` : '—'}
                        </span>
                        <span style={{ color: '#6B7280', fontSize: 12 }}>{formatRelativeTime(pu.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </AdminLayout>
  );
}

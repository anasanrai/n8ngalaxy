import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { formatRelativeTime } from '../../lib/formatters';

const API_SECRET = import.meta.env.VITE_SANDBOX_API_SECRET as string;
const PAGE_SIZE = 10;

type FilterStatus = 'all' | 'active' | 'provisioning' | 'expired' | 'failed';

interface AdminSession {
  id: string;
  user_id: string;
  user_email: string | null;
  tier: string;
  container_name: string | null;
  n8n_url: string | null;
  status: string;
  subdomain: string;
  created_at: string;
  expires_at: string;
  ram_mb: number | null;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: '#00E5C7', provisioning: '#F59E0B', expired: '#6B7280', failed: '#EF4444', destroyed: '#6B7280',
  };
  const c = colors[status] ?? '#6B7280';
  return (
    <span className="flex items-center gap-1.5">
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: status === 'active' ? `0 0 6px ${c}` : 'none', display: 'inline-block', flexShrink: 0 }} />
      <span style={{ color: c, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</span>
    </span>
  );
}

export default function AdminSandboxes() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(0);
  const [destroying, setDestroying] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AdminSession | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const { data: sessions = [], isLoading } = useQuery<AdminSession[]>({
    queryKey: ['admin', 'sandboxes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sandbox_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminSession[];
    },
    refetchInterval: 30000,
  });

  // Computed stats
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      active:       sessions.filter((s) => s.status === 'active').length,
      provisioning: sessions.filter((s) => s.status === 'provisioning').length,
      expiredToday: sessions.filter((s) => s.status === 'expired' && new Date(s.expires_at) >= todayStart).length,
      totalWeek:    sessions.filter((s) => new Date(s.created_at) >= weekStart).length,
    };
  }, [sessions]);

  // Filtered + paginated
  const filtered = useMemo(
    () => (filter === 'all' ? sessions : sessions.filter((s) => s.status === filter)),
    [sessions, filter]
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const filterPills: { key: FilterStatus; label: string }[] = [
    { key: 'all',          label: `All (${sessions.length})` },
    { key: 'active',       label: `Active (${stats.active})` },
    { key: 'provisioning', label: `Provisioning (${stats.provisioning})` },
    { key: 'expired',      label: `Expired (${stats.expiredToday})` },
    { key: 'failed',       label: 'Failed' },
  ];

  const handleDestroyClick = (s: AdminSession) => {
    setSelectedSession(s);
    setShowModal(true);
  };

  const confirmDestroy = async () => {
    if (!selectedSession) return;
    setDestroying(selectedSession.id);
    try {
      const res = await fetch('https://api.n8ngalaxy.com/api/destroy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Secret': API_SECRET },
        body: JSON.stringify({ containerName: selectedSession.container_name, sessionId: selectedSession.id }),
      });
      if (!res.ok) throw new Error('API error');
      qc.invalidateQueries({ queryKey: ['admin', 'sandboxes'] });
    } catch {
      alert('Destroy failed');
    } finally {
      setDestroying(null);
      setShowModal(false);
      setSelectedSession(null);
    }
  };

  const handleCleanup = async () => {
    setCleanupLoading(true);
    try {
      const res = await fetch('https://api.n8ngalaxy.com/api/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Secret': API_SECRET },
      });
      if (!res.ok) throw new Error('Cleanup failed');
      alert('Cleanup triggered successfully!');
      qc.invalidateQueries({ queryKey: ['admin', 'sandboxes'] });
    } catch {
      alert('Cleanup failed');
    } finally {
      setCleanupLoading(false);
    }
  };

  return (
    <AdminLayout activePage="sandboxes">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8' }}>Sandboxes</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterPills.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setPage(0); }}
                style={{
                  height: 32,
                  padding: '0 14px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: filter === key ? '1px solid rgba(124,58,237,0.4)' : '1px solid #1E1E30',
                  background: filter === key ? 'rgba(124,58,237,0.15)' : '#13131F',
                  color: filter === key ? '#7C3AED' : '#9CA3AF',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Cleanup button */}
          <button
            onClick={handleCleanup}
            disabled={cleanupLoading}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #1E1E30',
              background: '#13131F',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Trash2 size={14} />
            {cleanupLoading ? 'Running…' : 'Run Cleanup'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active',          value: stats.active,       color: '#00E5C7' },
          { label: 'Provisioning',    value: stats.provisioning,  color: '#F59E0B' },
          { label: 'Expired today',   value: stats.expiredToday,  color: '#6B7280' },
          { label: 'Total this week', value: stats.totalWeek,     color: '#F4F4F8' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
            <p style={{ fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8', lineHeight: 1 }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#0D0D14', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {['Status', 'Tier', 'Subdomain', 'User', 'Started', 'Expires', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3" style={{ whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center" style={{ color: '#6B7280' }}>Loading…</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center" style={{ color: '#6B7280' }}>No sessions found.</td>
                </tr>
              ) : paged.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ background: i % 2 === 0 ? '#13131F' : '#0D0D14', borderTop: '1px solid #1E1E30', height: 52 }}
                >
                  <td className="px-5"><StatusDot status={s.status} /></td>
                  <td className="px-5" style={{ color: '#F4F4F8', textTransform: 'capitalize', fontSize: 13 }}>{s.tier}</td>
                  <td className="px-5" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#9CA3AF', maxWidth: 180 }}>
                    <span className="block truncate">{s.subdomain}</span>
                  </td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{s.user_email ?? '—'}</td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>{formatRelativeTime(s.created_at)}</td>
                  <td className="px-5" style={{ color: s.status === 'active' ? '#F4F4F8' : '#6B7280', fontSize: 13 }}>
                    {s.status === 'expired' || s.status === 'destroyed' ? 'Ended' : formatRelativeTime(s.expires_at)}
                  </td>
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      {s.status === 'active' && s.n8n_url && (
                        <a href={s.n8n_url} target="_blank" rel="noreferrer"
                          style={{ color: '#00E5C7', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                          <ExternalLink size={12} /> Open
                        </a>
                      )}
                      {s.status === 'active' && (
                        <button onClick={() => handleDestroyClick(s)}
                          style={{ color: '#EF4444', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> Destroy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: '1px solid #1E1E30' }}>
            <span style={{ color: '#9CA3AF', fontSize: 13 }}>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                style={{ height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid #1E1E30', background: '#13131F', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, opacity: page === 0 ? 0.4 : 1 }}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{ height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid #1E1E30', background: '#13131F', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, opacity: page >= totalPages - 1 ? 0.4 : 1 }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Destroy modal */}
      {showModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-xl p-8 w-full max-w-md" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 size={28} style={{ color: '#EF4444' }} />
              </div>
              <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 20, color: '#F4F4F8', marginBottom: 8 }}>
                Destroy Sandbox?
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                This will immediately stop the Docker container and remove all data. This cannot be undone.
              </p>
              <div className="w-full rounded-lg py-3 px-4 mb-6" style={{ background: '#0D0D14', border: '1px solid #1E1E30' }}>
                <code style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#F4F4F8', wordBreak: 'break-all' }}>
                  {selectedSession.subdomain}
                </code>
              </div>
              <div className="flex flex-col w-full gap-3">
                <button onClick={confirmDestroy} disabled={!!destroying}
                  style={{ width: '100%', height: 44, background: '#EF4444', color: '#fff', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, opacity: destroying ? 0.6 : 1 }}>
                  {destroying ? 'Destroying…' : 'Destroy Now'}
                </button>
                <button onClick={() => { setShowModal(false); setSelectedSession(null); }}
                  style={{ width: '100%', height: 44, background: 'transparent', color: '#9CA3AF', fontWeight: 500, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

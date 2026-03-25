import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { formatRelativeTime, formatCurrency } from '../../lib/formatters';

const API_SECRET = import.meta.env.VITE_SANDBOX_API_SECRET as string;

// ── Types ──────────────────────────────────────────────────────────────────────
interface SandboxStats {
  active_count: number;
  provisioning_count: number;
  expired_count: number;
  destroyed_count: number;
  total_count: number;
  last_24h: number;
  last_7d: number;
}

interface RevenueStats {
  total_revenue_cents: number;
  revenue_7d_cents: number;
  total_purchases: number;
}

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
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    active:       { bg: 'rgba(0,229,199,0.12)',  color: '#00E5C7' },
    provisioning: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
    expired:      { bg: 'rgba(107,114,128,0.15)', color: '#6B7280' },
    failed:       { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
    destroyed:    { bg: 'rgba(107,114,128,0.15)', color: '#6B7280' },
  };
  const s = styles[status] ?? styles.expired;
  return (
    <span
      style={{
        ...s,
        padding: '2px 8px',
        borderRadius: 9999,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6 animate-pulse"
      style={{ background: '#13131F', border: '1px solid #1E1E30', height: 100 }}
    />
  );
}

// ── Donut chart data ──────────────────────────────────────────────────────────
const donutData = [
  { name: 'Templates', value: 165, color: '#7C3AED' },
  { name: 'Sandboxes', value: 85,  color: '#00E5C7' },
  { name: 'Hosting',   value: 34,  color: '#F59E0B' },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminOverview() {
  const qc = useQueryClient();
  const [destroying, setDestroying] = useState<string | null>(null);

  // Query 1: sandbox stats
  const { data: sbStats, isLoading: loadingSb, isError: errSb } = useQuery<SandboxStats>({
    queryKey: ['admin', 'sandbox-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sandbox_stats')
        .select('active_count, provisioning_count, expired_count, destroyed_count, total_count, last_24h, last_7d')
        .single();
      if (error) throw error;
      return data as SandboxStats;
    },
  });

  // Query 2: revenue stats
  const { data: revStats, isLoading: loadingRev } = useQuery<RevenueStats>({
    queryKey: ['admin', 'revenue-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_revenue_stats')
        .select('total_revenue_cents, revenue_7d_cents, total_purchases')
        .single();
      if (error) throw error;
      return data as RevenueStats;
    },
  });

  // Query 3: recent sandbox sessions
  const { data: sessions, isLoading: loadingSessions } = useQuery<AdminSession[]>({
    queryKey: ['admin', 'recent-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_sandbox_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []) as AdminSession[];
    },
  });

  // Query 4: waitlist count
  const { data: waitlistData } = useQuery<{ count: number }>({
    queryKey: ['admin', 'waitlist-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('waitlist_signups')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { count: count ?? 0 };
    },
  });

  const handleDestroy = async (session: AdminSession) => {
    if (!confirm(`Destroy sandbox "${session.subdomain}"? This cannot be undone.`)) return;
    setDestroying(session.id);
    try {
      const res = await fetch('https://api.n8ngalaxy.com/api/destroy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Secret': API_SECRET },
        body: JSON.stringify({ containerName: session.container_name, sessionId: session.id }),
      });
      if (!res.ok) throw new Error('Destroy failed');
      qc.invalidateQueries({ queryKey: ['admin', 'recent-sessions'] });
      qc.invalidateQueries({ queryKey: ['admin', 'sandbox-stats'] });
    } catch (e) {
      alert('Destroy failed. Check console.');
      console.error(e);
    } finally {
      setDestroying(null);
    }
  };

  const isLoading = loadingSb || loadingRev || loadingSessions;

  return (
    <AdminLayout activePage="overview">
      {/* Page title */}
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8' }}>
          Overview
        </h1>
      </div>

      {/* Error banner */}
      {errSb && (
        <div className="mb-6 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
          Failed to load data. Refresh to retry.
        </div>
      )}

      {/* Metric cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard label="Active Sandboxes" value={sbStats?.active_count ?? 0} valueColor="#00E5C7" sub={`+${sbStats?.last_24h ?? 0} last 24h`} />
            <MetricCard label="Total Revenue"    value={formatCurrency((revStats?.total_revenue_cents ?? 0))} valueColor="#F4F4F8" sub={`${revStats?.total_purchases ?? 0} purchases`} />
            <MetricCard label="Sessions (7d)"    value={sbStats?.last_7d ?? 0} valueColor="#F4F4F8" sub="sandbox rentals" />
            <MetricCard label="Waitlist"         value={waitlistData?.count ?? 0} valueColor="#7C3AED" sub="CashPilot signups" />
          </>
        )}
      </section>

      {/* Main panels: table + donut */}
      <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-8">
        {/* Recent sessions */}
        <div className="lg:col-span-6 rounded-xl" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E1E30' }}>
            <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8' }}>
              Recent Sandbox Sessions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#0D0D14', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {['Status', 'Tier', 'User', 'Created', 'Expires', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3" style={{ whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingSessions ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center" style={{ color: '#6B7280' }}>
                      Loading…
                    </td>
                  </tr>
                ) : (sessions ?? []).map((s, i) => (
                  <tr
                    key={s.id}
                    style={{ background: i % 2 === 0 ? '#13131F' : '#0D0D14', borderTop: '1px solid rgba(30,30,48,0.6)', height: 48 }}
                  >
                    <td className="px-5"><StatusBadge status={s.status} /></td>
                    <td className="px-5" style={{ color: '#F4F4F8', fontWeight: 500, textTransform: 'capitalize' }}>{s.tier}</td>
                    <td className="px-5" style={{ color: '#9CA3AF' }}>{s.user_email ?? '—'}</td>
                    <td className="px-5" style={{ color: '#9CA3AF' }}>{formatRelativeTime(s.created_at)}</td>
                    <td className="px-5" style={{ color: '#9CA3AF' }}>{formatRelativeTime(s.expires_at)}</td>
                    <td className="px-5 text-right">
                      {s.status === 'active' && (
                        <button
                          onClick={() => handleDestroy(s)}
                          disabled={destroying === s.id}
                          style={{
                            color: '#EF4444',
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: destroying === s.id ? 0.5 : 1,
                          }}
                        >
                          {destroying === s.id ? 'Destroying…' : 'Destroy'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue donut */}
        <div className="lg:col-span-4 rounded-xl p-5 flex flex-col" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 16 }}>
            Revenue Breakdown
          </h3>
          <div className="flex flex-col items-center flex-1">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E1E30', border: 'none', borderRadius: 8, color: '#F4F4F8', fontSize: 12 }}
                  formatter={(value: unknown) => [`$${Number(value)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="w-full space-y-3 mt-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                    <span style={{ color: '#9CA3AF', fontSize: 13 }}>{d.name}</span>
                  </div>
                  <span style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 600 }}>${d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Health */}
      <section className="rounded-xl p-6" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
        <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 20 }}>
          Platform Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HealthItem dot="#10B981" label="VPS API" sub="api.n8ngalaxy.com" status="Online · 99.9% uptime" statusColor="#10B981" />
          <HealthItem dot="#10B981" label="n8n Instance" sub="n8n.n8ngalaxy.com" status="Online" statusColor="#10B981" />
          <HealthItem
            dot="#F59E0B"
            label="Sandbox capacity"
            sub={`${sbStats?.active_count ?? '…'}/15 slots used`}
            status={sbStats ? `${Math.round(((sbStats.active_count) / 15) * 100)}% capacity` : '…'}
            statusColor="#F59E0B"
          />
          <HealthItem dot="#6B7280" label="Last cleanup" sub="Cron every 15min" status="Automated" statusColor="#6B7280" />
        </div>
      </section>
    </AdminLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string | number;
  valueColor: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl p-6 relative overflow-hidden" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
      <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</p>
      <div className="flex items-baseline gap-2">
        <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 36, color: valueColor, lineHeight: 1 }}>
          {value}
        </span>
        {sub && (
          <span className="flex items-center gap-0.5" style={{ color: '#6B7280', fontSize: 12 }}>
            <ArrowUpRight size={12} />
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function HealthItem({
  dot,
  label,
  sub,
  status,
  statusColor,
}: {
  dot: string;
  label: string;
  sub: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 flex-shrink-0" style={{ width: 10, height: 10, borderRadius: '50%', background: dot, boxShadow: `0 0 8px ${dot}88` }} />
      <div>
        <p style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 600 }}>{label}</p>
        <p style={{ color: '#6B7280', fontSize: 11, marginTop: 1 }}>{sub}</p>
        <p style={{ color: statusColor, fontSize: 11, fontWeight: 500, marginTop: 2 }}>{status}</p>
      </div>
    </div>
  );
}

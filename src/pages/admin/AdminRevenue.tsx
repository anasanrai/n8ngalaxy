import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/formatters';

// ── Types ──────────────────────────────────────────────────────────────────────
interface PurchaseRow {
  id: string;
  user_id: string;
  template_id: string | null;
  amount_cents: number | null;
  created_at: string;
  lemonsqueezy_order_id: string | null;
  templates: { title: string; category: string } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const HARDCODED_MRR = 49;

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getLast14Days(): { label: string; date: string }[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { label: dayLabel(d), date: d.toISOString().slice(0, 10) };
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminRevenue() {
  const { data: purchases = [], isLoading } = useQuery<PurchaseRow[]>({
    queryKey: ['admin', 'purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*, templates(title, category)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PurchaseRow[];
    },
  });

  // ── Computed metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalCents = purchases.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);
    const count      = purchases.length;
    const sandboxPurchases  = purchases.filter((p) => !p.template_id);
    const sandboxCents      = sandboxPurchases.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);
    return {
      total:     totalCents,
      avg:       count ? Math.round(totalCents / count) : 0,
      sandbox:   sandboxCents,
      count,
    };
  }, [purchases]);

  // ── Bar chart: last 14 days ─────────────────────────────────────────────────
  const barData = useMemo(() => {
    const days = getLast14Days();
    return days.map(({ label, date }) => {
      const dayPurchases = purchases.filter((p) => p.created_at.startsWith(date));
      const total = dayPurchases.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0) / 100;
      return { label, total };
    });
  }, [purchases]);

  const maxBar = Math.max(...barData.map((d) => d.total), 10);

  // ── Product revenue ────────────────────────────────────────────────────────
  const productRevenue = useMemo(() => {
    const templateCents = purchases.filter((p) => p.template_id).reduce((s, p) => s + (p.amount_cents ?? 0), 0);
    const sandboxCents  = purchases.filter((p) => !p.template_id).reduce((s, p) => s + (p.amount_cents ?? 0), 0);
    return [
      { label: 'Templates', cents: templateCents, color: '#7C3AED' },
      { label: 'Sandboxes', cents: sandboxCents,  color: '#00E5C7' },
      { label: 'Hosting',   cents: 4900,          color: '#F59E0B' },
    ];
  }, [purchases]);
  const maxProduct = Math.max(...productRevenue.map((d) => d.cents), 100);

  return (
    <AdminLayout activePage="revenue">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8' }}>Revenue</h1>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <RevenueCard label="Total Revenue"     value={formatCurrency(metrics.total)}          sub="all time"          color="#F4F4F8" />
        <RevenueCard label="MRR"               value={`$${HARDCODED_MRR}`}                    sub="1 hosting client"  color="#7C3AED" />
        <RevenueCard label="Avg Order Value"   value={formatCurrency(metrics.avg)}            sub={`${metrics.count} purchases`} color="#F4F4F8" />
        <RevenueCard label="Sandbox Revenue"   value={formatCurrency(metrics.sandbox)}         sub="sandbox sessions"  color="#00E5C7" />
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-8">
        {/* Bar chart */}
        <div className="lg:col-span-6 rounded-xl p-6" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 20 }}>
            Revenue over time
          </h3>
          {isLoading ? (
            <div style={{ height: 200, background: '#1E1E30', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
                <YAxis
                  domain={[0, maxBar + 10]}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{ background: '#1E1E30', border: 'none', borderRadius: 8, color: '#F4F4F8', fontSize: 12 }}
                  formatter={(value: unknown) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                  cursor={{ fill: 'rgba(124,58,237,0.08)' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.total > 0 ? '#7C3AED' : '#1E1E30'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Product bars */}
        <div className="lg:col-span-4 rounded-xl p-6" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8', marginBottom: 20 }}>
            Revenue by product
          </h3>
          <div className="space-y-5">
            {productRevenue.map(({ label, cents, color }) => {
              const pct = Math.round((cents / maxProduct) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: '#9CA3AF', fontSize: 13 }}>{label}</span>
                    <span style={{ color: '#F4F4F8', fontSize: 13, fontWeight: 600 }}>{formatCurrency(cents)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 9999, background: '#1E1E30' }}>
                    <div style={{ height: 6, borderRadius: 9999, background: color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E1E30' }}>
          <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15, color: '#F4F4F8' }}>
            Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#0D0D14', color: '#6B7280', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {['Order ID', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3" style={{ whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: '#6B7280' }}>Loading…</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: '#6B7280' }}>No transactions yet.</td></tr>
              ) : purchases.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#13131F' : '#0D0D14', borderTop: '1px solid #1E1E30', height: 52 }}>
                  <td className="px-5">
                    <code style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#9CA3AF' }}>
                      {(p.lemonsqueezy_order_id ?? p.id).slice(0, 14)}…
                    </code>
                  </td>
                  <td className="px-5" style={{ color: '#F4F4F8', fontSize: 13 }}>
                    {p.templates?.title ?? (p.template_id ? 'Template' : 'Sandbox Rental')}
                  </td>
                  <td className="px-5" style={{ color: '#F4F4F8', fontWeight: 600, fontSize: 13 }}>
                    {p.amount_cents ? formatCurrency(p.amount_cents) : '—'}
                  </td>
                  <td className="px-5">
                    <span style={{
                      padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: 'rgba(16,185,129,0.1)', color: '#10B981',
                    }}>
                      PAID
                    </span>
                  </td>
                  <td className="px-5" style={{ color: '#9CA3AF', fontSize: 13 }}>
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function RevenueCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#13131F', border: '1px solid #1E1E30' }}>
      <p style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 32, color, lineHeight: 1 }}>{value}</p>
      <p style={{ color: '#6B7280', fontSize: 11, marginTop: 6 }}>{sub}</p>
    </div>
  );
}

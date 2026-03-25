import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Template } from '../types';
import { useAuthStore } from '../stores/authStore';

const CATEGORIES = [
  'All',
  'Real Estate',
  'Sales',
  'Finance',
  'Marketing',
  'HR',
  'DevOps',
  'AI Agents',
];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('published', true);
      
      if (error) throw error;
      return data as Template[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredAndSortedTemplates = useMemo(() => {
    if (!templates) return [];

    let result = templates;
    if (activeCategory !== 'All') {
      const dbCategory = activeCategory.toLowerCase().replace(' ', '_');
      result = result.filter(t => t.category === dbCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low':
          return a.price_cents - b.price_cents;
        case 'Price: High':
          return b.price_cents - a.price_cents;
        case 'Newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'Featured':
        default:
          if (a.featured === b.featured) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.featured ? -1 : 1;
      }
    });

    return result;
  }, [templates, activeCategory, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14]">
      {/* Top Bar inline */}
      <div
        style={{
          height: 48,
          background: '#0D0D14',
          borderBottom: '0.5px solid #1E1E30',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#9CA3AF', fontSize: 13 }}>n8n</span>
          <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: '#F4F4F8', fontSize: 13, marginLeft: 2 }}>Galaxy</span>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide px-4">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  height: 28,
                  padding: '0 12px',
                  borderRadius: 9999,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                  border: isActive ? '0.5px solid rgba(124,58,237,0.3)' : '0.5px solid #1E1E30',
                  color: isActive ? '#7C3AED' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.color = '#9CA3AF'; }}
                onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.color = '#6B7280'; }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
            }}
          >
            {['Featured', 'Price: Low', 'Price: High', 'Newest'].map(option => (
              <option key={option} value={option} style={{ background: '#13131F', color: '#F4F4F8' }}>{option}</option>
            ))}
          </select>

          {user ? (
            <div 
              style={{ width: 28, height: 28, borderRadius: '50%', background: '#1E1E30', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#F4F4F8' }}
              onClick={() => navigate('/dashboard')}
            >
              U
            </div>
          ) : (
            <span 
              onClick={() => navigate('/auth', { state: { returnTo: '/marketplace' } })}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}
            >
              Sign in
            </span>
          )}
        </div>
      </div>

      <main className="flex-1 w-full" style={{ maxWidth: '100%' }}>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.5px', background: '#1E1E30' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ height: 280, background: '#13131F' }} className="animate-pulse" />
            ))}
          </div>
        ) : filteredAndSortedTemplates.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.5px', background: '#1E1E30' }}>
            
            {filteredAndSortedTemplates.map(t => {
              const price = t.price_cents > 0 ? `$${(t.price_cents / 100).toFixed(2)}` : 'Free';
              const priceColor = t.price_cents > 0 ? '#F4F4F8' : '#00E5C7';
              
              const nodesApproxCount = (t as any).tools_used && (t as any).tools_used.length > 0 ? (t as any).tools_used.length + 3 : 5;

              return (
                <div 
                  key={t.id}
                  onClick={() => navigate(`/template/${t.slug}`)}
                  style={{
                    background: '#0D0D14',
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'background 150ms',
                    borderRight: '0.5px solid #1E1E30',
                    borderBottom: '0.5px solid #1E1E30',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                  className="group"
                  onMouseEnter={(e) => e.currentTarget.style.background = '#13131F'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#0D0D14'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'start' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#6B7280', textTransform: 'uppercase' }}>
                      {t.category.replace('_', ' ')}
                    </span>
                    {t.featured && (
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#F59E0B' }}>★ Featured</span>
                    )}
                  </div>
                  
                  <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 17, color: '#F4F4F8', lineHeight: 1.3, marginBottom: 6 }} className="line-clamp-2">
                    {t.title}
                  </h3>
                  
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', lineHeight: 1.5, flex: 1 }} className="line-clamp-3">
                    {t.description}
                  </p>
                  
                  {(t as any).tools_used && (t as any).tools_used.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                      {(t as any).tools_used.slice(0, 4).map((tool: string) => (
                        <span key={tool} style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 4, padding: '2px 6px', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#6B7280' }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280' }}>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{nodesApproxCount} nodes</span>
                      <GitBranch size={10} />
                    </div>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 16, color: priceColor }}>
                      {price}
                    </span>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#13131F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end justify-center pb-4" style={{ pointerEvents: 'none' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#7C3AED' }}>Get template →</span>
                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontSize: 14 }}>No templates found.</span>
          </div>
        )}
      </main>
    </div>
  );
}

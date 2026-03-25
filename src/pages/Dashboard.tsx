import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, Terminal, Download, Link as LinkIcon, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import type { Purchase, SandboxSession, Template } from '../types';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'templates' | 'sandboxes'>('templates');
  
  // Real-time countdown state for sandboxes
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (activeTab === 'sandboxes') {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const { data: purchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not logged in');
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          template:templates(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Purchase & { template: Template })[];
    },
    enabled: !!user?.id && activeTab === 'templates',
  });

  const { data: sandboxes, isLoading: loadingSandboxes, refetch: refetchSandboxes } = useQuery({
    queryKey: ['sandboxes', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not logged in');
      const { data } = await supabase
        .from('sandbox_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      return data as SandboxSession[];
    },
    enabled: !!user?.id && activeTab === 'sandboxes',
  });

  const handleDownload = (purchase: Purchase) => {
    if (purchase.download_url && new Date(purchase.download_expires_at!) > new Date()) {
      window.open(purchase.download_url, '_blank')
    } else {
      alert('Download link expired. Contact hello@n8ngalaxy.com')
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDestroySandbox = async (id: string) => {
    if (!confirm('Are you sure you want to destroy this sandbox instantly? All un-exported workflows will be lost.')) return;
    
    const { error } = await supabase
      .from('sandbox_sessions')
      // @ts-expect-error type inference failure
      .update({ status: 'destroyed' })
      .eq('id', id);
    
    if (error) {
      alert('Error destroying sandbox.');
    } else {
      refetchSandboxes();
    }
  };

  const formatTimeLeft = (expiresAt: string) => {
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Navbar />

      <main className="flex-grow pt-[112px] pb-[96px] px-6 max-w-[1000px] w-full mx-auto">
        <h1 className="font-display font-extrabold text-[32px] text-text-primary mb-2">Dashboard</h1>
        <p className="font-sans font-normal text-[16px] text-text-secondary mb-12">
          Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'there'}
        </p>

        {/* Tabs */}
        <div className="flex w-full border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 pb-3 text-center text-[15px] transition-colors cursor-pointer border-b-2 ${
              activeTab === 'templates'
                ? 'font-sans font-medium text-text-primary border-primary' 
                : 'font-sans font-normal text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            My Templates
          </button>
          <button
            onClick={() => setActiveTab('sandboxes')}
            className={`flex-1 pb-3 text-center text-[15px] transition-colors cursor-pointer border-b-2 ${
              activeTab === 'sandboxes'
                ? 'font-sans font-medium text-text-primary border-primary' 
                : 'font-sans font-normal text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            My Sandboxes
          </button>
        </div>

        {/* Tab content: Templates */}
        {activeTab === 'templates' && (
          <div className="w-full">
            {loadingPurchases ? (
              <div className="text-text-secondary py-12 text-center text-[14px]">Loading purchases...</div>
            ) : purchases && purchases.length > 0 ? (
              <div className="flex flex-col gap-4">
                {purchases.map(p => (
                  <div key={p.id} className="bg-surface border border-border rounded-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-[8px] h-[20px] rounded-[4px] bg-primary/10 border border-primary/20 text-primary uppercase font-sans font-medium tracking-wide text-[10px]">
                          {p.template.category.replace('_', ' ')}
                        </span>
                        <h3 className="font-display font-bold text-[16px] text-text-primary">
                          {p.template.title}
                        </h3>
                      </div>
                      <span className="font-sans font-normal text-[13px] text-text-tertiary">
                        Purchased {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleDownload(p)}
                      className="h-[36px] px-4 shrink-0 bg-surface border border-border hover:border-primary/50 text-text-primary hover:text-primary font-sans font-medium text-[13px] rounded-input transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-border bg-surface/50 rounded-card">
                <ShoppingBag className="w-12 h-12 text-text-tertiary mb-6" />
                <h3 className="font-display font-bold text-[20px] text-text-secondary mb-2">No templates yet</h3>
                <p className="font-sans font-normal text-[14px] text-text-tertiary mb-6">Browse the marketplace to find your first workflow</p>
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="bg-surface border border-border hover:border-primary hover:bg-surface text-text-primary h-[40px] px-6 font-sans font-medium text-[14px] rounded-input transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab content: Sandboxes */}
        {activeTab === 'sandboxes' && (
          <div className="w-full">
            {loadingSandboxes ? (
              <div className="text-text-secondary py-12 text-center text-[14px]">Loading sandboxes...</div>
            ) : sandboxes && sandboxes.length > 0 ? (
              <div className="flex flex-col gap-4">
                {sandboxes.map(s => (
                  <div key={s.id} className="bg-surface border border-border rounded-card p-6 flex flex-col gap-4">
                    
                    <div className="flex items-center gap-3 mb-2">
                      {s.status === 'active' && (
                        <span className="inline-flex items-center px-2 h-[22px] rounded-[4px] border border-[rgba(0,229,199,0.3)] bg-[rgba(0,229,199,0.1)] text-[#00E5C7] font-sans font-bold text-[11px] uppercase">
                          ACTIVE
                        </span>
                      )}
                      {s.status === 'expired' && (
                        <span className="inline-flex items-center px-2 h-[22px] rounded-[4px] border border-border bg-surface text-text-secondary font-sans font-bold text-[11px] uppercase">
                          EXPIRED
                        </span>
                      )}
                      {(s.status === 'provisioning' || s.status === 'pending') && (
                        <span className="inline-flex items-center px-2 h-[22px] rounded-[4px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] text-[#F59E0B] font-sans font-bold text-[11px] uppercase">
                          SETTING UP
                        </span>
                      )}
                      {(s.status === 'destroyed') && (
                        <span className="inline-flex items-center px-2 h-[22px] rounded-[4px] border border-border bg-surface text-text-secondary font-sans font-bold text-[11px] uppercase">
                          DESTROYED
                        </span>
                      )}
                      <h3 className="font-display font-bold text-[16px] text-text-primary capitalize">
                        {s.tier} Sandbox
                      </h3>
                    </div>

                    {s.status === 'active' && (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-center bg-background border border-border rounded-card p-4">
                          <div className="flex flex-col gap-3 font-mono text-[13px]">
                            <div className="flex items-center gap-2 group">
                              <LinkIcon size={14} className="text-text-tertiary" />
                              <a href={s.n8n_url || '#'} className="text-accent hover:underline truncate" target="_blank" rel="noreferrer">
                                {s.n8n_url || 'URL pending'}
                              </a>
                              <button onClick={() => handleCopy(s.n8n_url || '')} className="text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary">
                              <div className="flex items-center gap-2 group">
                                <span className="opacity-50">user:</span>
                                <span>{s.n8n_username || '...'}</span>
                                <button onClick={() => handleCopy(s.n8n_username || '')} className="text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Copy size={13} />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 group">
                                <span className="opacity-50">pass:</span>
                                <span>{visiblePasswords[s.id] ? s.n8n_password : '••••••••'}</span>
                                <button onClick={() => togglePassword(s.id)} className="text-text-tertiary hover:text-text-primary">
                                  {visiblePasswords[s.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button onClick={() => handleCopy(s.n8n_password || '')} className="text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Copy size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-3 w-full border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 pb-1 md:pb-0 px-2 md:px-4">
                            <span className="font-sans font-medium text-[13px] text-[#F59E0B]">
                              Expires in {formatTimeLeft(s.expires_at)}
                            </span>
                            <div className="flex items-center justify-end gap-2 w-full">
                              <button
                                onClick={() => handleDestroySandbox(s.id)}
                                className="h-[32px] px-3 font-sans font-medium text-[12px] text-text-tertiary hover:text-danger border border-transparent hover:border-danger/30 rounded-input bg-transparent hover:bg-danger/10 transition-colors flex items-center justify-center cursor-pointer"
                                title="Destroy early"
                              >
                                <Trash2 size={13} />
                              </button>
                              <button
                                onClick={() => navigate(`/sandbox/session/${s.id}`)}
                                className="flex-1 max-w-[120px] h-[32px] font-sans font-medium text-[12px] text-white bg-primary hover:bg-primary-hover rounded-input transition-colors flex items-center justify-center cursor-pointer border-none"
                              >
                                Open Editor
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(s.status === 'expired' || s.status === 'destroyed') && (
                      <div className="flex items-center justify-between text-[13px] font-sans">
                        <span className="text-text-tertiary">
                          Created {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <a href="/sandbox" className="text-primary hover:underline font-medium">
                          Rent again →
                        </a>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-border bg-surface/50 rounded-card">
                <Terminal className="w-12 h-12 text-text-tertiary mb-6" />
                <h3 className="font-display font-bold text-[20px] text-text-secondary mb-2">No sandboxes yet</h3>
                <p className="font-sans font-normal text-[14px] text-text-tertiary mb-6">Rent a secure n8n instance by the hour</p>
                <button 
                  onClick={() => navigate('/sandbox')}
                  className="bg-primary hover:bg-primary-hover text-white h-[40px] px-6 font-sans font-medium text-[14px] rounded-input transition-colors cursor-pointer"
                >
                  Try Sandbox $2
                </button>
              </div>
            )}
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}

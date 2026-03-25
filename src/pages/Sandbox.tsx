import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { openPaddleCheckout } from '../lib/paddle';
import TopBar from '../components/layout/TopBar';
import DemoWorkflowCanvas from '../components/canvas/DemoWorkflowCanvas';

type TierKey = 'spark' | 'explorer' | 'builder' | 'pro';

const PADDLE_PRICE_IDS: Record<string, string> = {
  spark:    import.meta.env.VITE_PADDLE_SANDBOX_SPARK    || '',
  explorer: import.meta.env.VITE_PADDLE_SANDBOX_EXPLORER || '',
  builder:  import.meta.env.VITE_PADDLE_SANDBOX_BUILDER  || '',
  pro:      import.meta.env.VITE_PADDLE_SANDBOX_PRO      || '',
};

const TIER_DURATION_MS: Record<string, number> = {
  spark:    1   * 60 * 60 * 1000,
  explorer: 4   * 60 * 60 * 1000,
  builder:  24  * 60 * 60 * 1000,
  pro:      168 * 60 * 60 * 1000,
};

const TIERS: Record<TierKey, { label: string; duration: string; price: string }> = {
  spark:    { label: 'Spark',    duration: '1 hour',  price: '$2' },
  explorer: { label: 'Explorer', duration: '4 hours', price: '$6' },
  builder:  { label: 'Builder',  duration: '1 day',   price: '$9' },
  pro:      { label: 'Pro',      duration: '1 week',  price: '$29' },
};




export default function Sandbox() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [selectedTier, setSelectedTier] = useState<TierKey>('explorer');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [countdown, setCountdown] = useState(90);

  // Auto count down from 90 to 0 on mount
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 12); // fast countdown for aesthetic
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleCheckout() {
    if (!user || !selectedTier) return;
    if (!PADDLE_PRICE_IDS[selectedTier]) {
      alert('Configuration error: missing price ID for ' + selectedTier);
      return;
    }
    setCheckoutLoading(true);
    try {
      const expiresAt = new Date(
        Date.now() + TIER_DURATION_MS[selectedTier]
      ).toISOString();

      const { data: session, error } = await supabase
        .from('sandbox_sessions')
        // @ts-expect-error type inference failure
        .insert({
          user_id: user.id,
          tier: selectedTier,
          subdomain: 'pending',
          expires_at: expiresAt,
          status: 'provisioning',
        })
        .select('id')
        .single();

      if (error || !session) {
        alert('Error creating session: ' + error?.message);
        setCheckoutLoading(false);
        return;
      }

      await openPaddleCheckout({
        priceId: PADDLE_PRICE_IDS[selectedTier],
        userId: user.id,
        userEmail: user.email || '',
        userName: profile?.full_name || '',
        customData: {
          user_id: user.id,
          session_id: (session as any).id,
          tier: selectedTier,
          type: 'sandbox',
        },
      });
      setCheckoutLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout error: ' + err);
      setCheckoutLoading(false);
    }
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, selectedTier, checkoutLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14]">
      <TopBar />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PANEL */}
        <div style={{ width: '55%', position: 'relative', background: '#0A0A0F', borderRight: '0.5px solid #1E1E30' }} className="hidden lg:block relative">
          <DemoWorkflowCanvas />

          {/* Top-left LIVE DEMO badge */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10, pointerEvents: 'none' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E5C7', display: 'block' }} className="animate-pulse" />
            <span style={{ 
              background: 'rgba(0,229,199,0.1)', 
              border: '0.5px solid rgba(0,229,199,0.3)', 
              color: '#00E5C7', 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 500, 
              fontSize: 11, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              padding: '4px 10px',
              borderRadius: 4
            }}>
              LIVE DEMO
            </span>
          </div>

          {/* Bottom strip */}
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, 
            background: 'rgba(10,10,15,0.9)', 
            backdropFilter: 'blur(8px)', 
            padding: '12px 20px', 
            zIndex: 10,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            pointerEvents: 'none'
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280' }}>Your sandbox gets this workflow pre-installed.</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280' }}>Modify it, break it, rebuild it. Destroyed at expiry.</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 w-full lg:w-[45%] flex flex-col" style={{ background: '#0D0D14', overflowY: 'auto' }}>
          <div style={{ padding: '48px 40px', maxWidth: 560, margin: '0 auto', width: '100%' }}>
            
            {/* Top section */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              n8n sandbox rental
            </p>
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 36, color: '#F4F4F8', marginBottom: 6, lineHeight: 1.1 }}>
              Live instance in
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 40 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 48, color: '#00E5C7', lineHeight: 1 }}>
                {countdown > 0 ? countdown : '90s'}
              </span>
              {countdown <= 0 && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#9CA3AF' }}>seconds</span>}
            </div>

            {/* Tier selector */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 24 }}>
              {(Object.keys(TIERS) as TierKey[]).map((tierKey) => {
                const isSelected = selectedTier === tierKey;
                const tier = TIERS[tierKey];
                return (
                  <button
                    key={tierKey}
                    onClick={() => setSelectedTier(tierKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: 64,
                      background: isSelected ? 'rgba(124,58,237,0.06)' : 'transparent',
                      borderBottom: '0.5px solid #1E1E30',
                      borderLeft: isSelected ? '2px solid #7C3AED' : 'none',
                      padding: isSelected ? '0 16px' : '0 16px',
                      paddingLeft: isSelected ? 16 : 18,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#F4F4F8' }}>{tier.label}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280' }}>· {tier.duration}</span>
                    </div>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 18, color: '#F4F4F8' }}>{tier.price}</span>
                  </button>
                );
              })}
            </div>

            {/* Specs pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              {['512MB RAM', 'n8n latest', 'isolated Docker'].map(spec => (
                <span key={spec} style={{ 
                  fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280', 
                  background: '#13131F', border: '0.5px solid #1E1E30', 
                  borderRadius: 9999, padding: '4px 12px' 
                }}>
                  {spec === '512MB RAM' && selectedTier !== 'spark' ? (selectedTier === 'pro' ? '2GB RAM' : '1GB RAM') : spec}
                </span>
              ))}
            </div>

            {/* Action button */}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 8,
                background: '#7C3AED',
                border: 'none',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms',
                gap: 8,
                position: 'relative',
              }}
              onMouseEnter={(e) => { if(!checkoutLoading) e.currentTarget.style.background = '#6D28D9'; }}
              onMouseLeave={(e) => { if(!checkoutLoading) e.currentTarget.style.background = '#7C3AED'; }}
            >
              {checkoutLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Provisioning...</>
              ) : (
                <>
                  Rent {TIERS[selectedTier].label} — {TIERS[selectedTier].price}
                  <span style={{ position: 'absolute', right: 16, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>⌘↵</span>
                </>
              )}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280' }}>
              No account needed to browse. Payment via LemonSqueezy.
            </p>

            {!user && (
              <p 
                onClick={() => navigate('/auth', { state: { returnTo: '/sandbox' } })}
                style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#7C3AED', cursor: 'pointer' }}
              >
                Sign in to save your session history →
              </p>
            )}

            <div style={{ height: '0.5px', background: '#1E1E30', width: '100%', margin: '32px 0' }} />

            {/* FAQ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', marginBottom: 6 }}>What's inside?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                  Full n8n instance. Your credentials. Pre-installed demo workflow. Destroy early from dashboard.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', marginBottom: 6 }}>What happens at expiry?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                  Container destroyed. Workflows deleted. Export before expiry.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', marginBottom: 6 }}>Can I use OpenAI/Claude inside?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                  Yes. Add credentials in n8n Settings → Credentials.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

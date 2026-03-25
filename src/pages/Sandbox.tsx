import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { openPaddleCheckout } from '../lib/paddle';
import SandboxStandaloneHeader from '../components/sandbox/SandboxStandaloneHeader';

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

// SVG Check icon helper
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="#00E5C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Sandbox() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [selectedTier, setSelectedTier] = useState<TierKey>('explorer');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow ⌘↵ to trigger sandbox payment
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (user) handleCheckout();
        else handleSignIn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, profile, selectedTier]);

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

  const handleSignIn = () => {
    navigate('/auth', { state: { returnTo: '/sandbox' } });
  };

  const getTierPriceLabel = (tier: TierKey) => {
    switch (tier) {
      case 'spark': return '$2';
      case 'explorer': return '$6';
      case 'builder': return '$9';
      case 'pro': return '$29';
    }
  };
  
  const getTierLabel = (tier: TierKey) => {
    switch (tier) {
      case 'spark': return 'Spark';
      case 'explorer': return 'Explorer';
      case 'builder': return 'Builder';
      case 'pro': return 'Pro';
    }
  };

  const TIERS: { key: TierKey; name: string; price: string; spec: string }[] = [
    { key: 'spark', name: 'Spark', price: '$2', spec: '1 hour · 512MB RAM' },
    { key: 'explorer', name: 'Explorer', price: '$6', spec: '4 hours · 1GB RAM' },
    { key: 'builder', name: 'Builder', price: '$9', spec: '1 day · 1GB RAM' },
    { key: 'pro', name: 'Pro', price: '$29', spec: '1 week · 2GB RAM' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <SandboxStandaloneHeader />
      
      <div style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 40px)', width: '100%' }}>
        {/* LEFT PANEL */}
        <div style={{ width: '55%', background: '#0A0A0F', borderRight: '0.5px solid #1E1E30', padding: '64px 56px', position: 'relative' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            SANDBOX RENTAL
          </div>
          
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 52, color: '#F4F4F8', lineHeight: 1.1, marginTop: 12, marginBottom: 0 }}>
            The real n8n.<br />
            Yours for an hour.
          </h1>
          
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 17, color: '#6B7280', lineHeight: 1.6, marginTop: 24, maxWidth: 448 }}>
            A live n8n instance spins up in 90 seconds. Full editor. Real credentials. Build anything. Auto-destroyed when time is up.
          </p>
          
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              "Full n8n editor — not a demo, the real thing",
              "400+ integrations available immediately",
              "Add your own API keys inside n8n Settings",
              "Export your workflows before time runs out",
              "Isolated Docker container — completely private",
              "Auto-destroyed at expiry, no cleanup needed"
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,229,199,0.1)', border: '0.5px solid rgba(0,229,199,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <CheckIcon />
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#9CA3AF' }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '32px 56px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#3A3A4A' }}>
              Built on n8n v1 · Docker isolated · Traefik SSL
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: '45%', background: '#0D0D14', padding: '48px 40px', overflowY: 'auto' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#6B7280' }}>
            Ready in
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#F4F4F8', marginTop: 4 }}>
            90 seconds
          </div>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column' }}>
            {TIERS.map(tier => {
              const selected = selectedTier === tier.key;
              return (
                <div 
                  key={tier.key} 
                  onClick={() => setSelectedTier(tier.key as TierKey)}
                  style={{
                    height: 68, borderBottom: '0.5px solid #1E1E30', cursor: 'pointer', transition: '150ms all',
                    borderLeft: selected ? '2px solid #7C3AED' : 'none',
                    paddingLeft: selected ? 16 : 18,
                    paddingRight: 16,
                    background: selected ? 'rgba(124,58,237,0.04)' : 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  className={!selected ? "hover:bg-[rgba(255,255,255,0.02)]" : ""}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#F4F4F8' }}>{tier.name}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#6B7280', marginTop: 4 }}>{tier.spec}</span>
                  </div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: 20, color: '#F4F4F8' }}>{tier.price}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {['n8n latest', 'isolated', 'instant SSL'].map((pill, i) => (
              <span key={i} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 11, color: '#6B7280', background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 9999, padding: '4px 12px' }}>
                {pill}
              </span>
            ))}
          </div>

          <button
            onClick={user ? handleCheckout : handleSignIn}
            disabled={checkoutLoading}
            style={{ 
              marginTop: 32, width: '100%', height: 52, borderRadius: 8, background: '#7C3AED', border: 'none', cursor: 'pointer', transition: '150ms all', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
            className={!checkoutLoading ? "hover:bg-[#6D28D9]" : "opacity-80"}
          >
             {checkoutLoading ? (
               <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#ffffff' }}>
                  <Loader2 size={16} className="animate-spin" /> Provisioning...
               </span>
             ) : (
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
                 <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, color: '#ffffff' }}>Rent {getTierLabel(selectedTier)} — {getTierPriceLabel(selectedTier)}</span>
                 <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>⌘↵</span>
               </div>
             )}
          </button>

          {!user && (
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <span onClick={handleSignIn} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#7C3AED', cursor: 'pointer' }} className="hover:underline">
                Sign in to track your sessions &rarr;
              </span>
            </div>
          )}

          <div style={{ marginTop: 40, borderTop: '0.5px solid #1E1E30', paddingTop: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', margin: 0 }}>What can I do inside?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>
                  Everything n8n supports. Connect APIs, build AI agents, run workflows, manage credentials. It's a full instance.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', margin: 0 }}>What happens when it expires?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>
                  Container destroyed. Export your workflows from n8n <strong>Settings &rarr; Export</strong> before time runs out.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#F4F4F8', margin: 0 }}>Can I extend time?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>
                  Yes. From your dashboard before expiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

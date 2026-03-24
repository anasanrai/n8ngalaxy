import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Clock, Check, X, ExternalLink, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

type TierKey = 'spark' | 'explorer' | 'builder' | 'pro';

const VARIANT_IDS: Record<string, string> = {
  spark:    import.meta.env.VITE_SANDBOX_VARIANT_SPARK    || '',
  explorer: import.meta.env.VITE_SANDBOX_VARIANT_EXPLORER || '',
  builder:  import.meta.env.VITE_SANDBOX_VARIANT_BUILDER  || '',
  pro:      import.meta.env.VITE_SANDBOX_VARIANT_PRO      || '',
}

const TIER_DURATION_MS: Record<string, number> = {
  spark:    1   * 60 * 60 * 1000,
  explorer: 4   * 60 * 60 * 1000,
  builder:  24  * 60 * 60 * 1000,
  pro:      168 * 60 * 60 * 1000,
}

const TIERS: Record<TierKey, { label: string; duration: string; price: string; priceNote: string; memory: string; popular: boolean; variantId: string }> = {
  spark:    { label: 'Spark',    duration: '1 hour',  price: '$2',  priceNote: 'one-time', memory: '512MB RAM', popular: false, variantId: VARIANT_IDS.spark || '918054' },
  explorer: { label: 'Explorer', duration: '4 hours', price: '$6',  priceNote: 'one-time', memory: '1GB RAM',   popular: true,  variantId: VARIANT_IDS.explorer || '918063' },
  builder:  { label: 'Builder',  duration: '1 day',   price: '$9',  priceNote: 'one-time', memory: '1GB RAM',   popular: false, variantId: VARIANT_IDS.builder || '918066' },
  pro:      { label: 'Pro',      duration: '1 week',  price: '$29', priceNote: 'one-time', memory: '2GB RAM',   popular: false, variantId: VARIANT_IDS.pro || '918067' },
};

const FAQS = [
  { q: "What happens when my sandbox expires?", a: "Your n8n instance is automatically destroyed. All workflows inside are deleted. Download your workflows before expiry — use n8n's built-in export." },
  { q: "Can I extend my sandbox time?", a: "Yes. From your dashboard, click Extend on any active sandbox to purchase additional time at the same tier rate." },
  { q: "Is my data private?", a: "Yes. Each sandbox runs in an isolated Docker container. No other user can access your instance. Credentials are unique per session." },
  { q: "What version of n8n do I get?", a: "Always the latest stable n8n release (n8nio/n8n:latest). Updated weekly." },
  { q: "Can I use my own credentials (OpenAI, etc)?", a: "Yes. Once inside n8n, add your credentials normally. They're stored in the container and destroyed with it at expiry." }
];

export default function Sandbox() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleRentTier = (tier: TierKey) => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/sandbox', tier } });
      return;
    }
    setSelectedTier(tier);
    setPaymentModalOpen(true);
  };

  async function handleCheckout() {
    if (!user || !selectedTier) return
    setCheckoutLoading(true)
    try {
      const expiresAt = new Date(Date.now() + TIER_DURATION_MS[selectedTier]).toISOString()
      
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
        .single()

      if (error || !session) throw new Error('Failed to create session')

      const variantId = VARIANT_IDS[selectedTier]
      const params = new URLSearchParams({
        'checkout[email]': user.email || '',
        'checkout[name]': profile?.full_name || '',
        'checkout[custom][user_id]': user.id,
        'checkout[custom][session_id]': (session as any).id,
        'checkout[custom][tier]': selectedTier,
      })

      window.location.href = 
        `https://n8ngalaxy.lemonsqueezy.com/checkout/buy/${variantId}?${params.toString()}`
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1 — Hero */}
        <section className="bg-[#0D0D14] pt-[144px] pb-[64px] px-6 text-center flex flex-col items-center">
          <div className="mb-6 inline-flex items-center px-4 h-8 rounded-pill border border-[rgba(0,229,199,0.3)] bg-[rgba(0,229,199,0.1)] text-[#00E5C7] font-sans font-bold text-[11px] uppercase tracking-wider">
            NEW FEATURE
          </div>
          <h1 className="font-display font-extrabold text-[48px] text-text-primary leading-tight mb-4">
            Rent a live n8n sandbox
          </h1>
          <p className="font-sans font-normal text-[18px] text-text-secondary max-w-[560px] mx-auto leading-relaxed">
            A real n8n instance, live in 90 seconds.<br/>
            Practice workflows, demo to clients, test before deploying.<br/>
            Auto-destroyed at expiry. No cleanup needed.
          </p>
        </section>

        {/* SECTION 2 — Pricing Cards */}
        <section className="max-w-[1008px] mx-auto px-6 mb-24 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.entries(TIERS) as [TierKey, typeof TIERS[TierKey]][]).map(([key, tier]) => (
              <div 
                key={key} 
                className={`flex flex-col relative bg-[#13131F] rounded-[12px] p-[28px] transition-all ${
                  tier.popular 
                    ? 'border border-[rgba(124,58,237,0.5)] shadow-[0_0_40px_rgba(124,58,237,0.1)]' 
                    : 'border border-[#1E1E30]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 right-4 px-3 h-6 rounded-pill bg-[#7C3AED] text-white flex items-center font-sans font-medium text-[11px] uppercase tracking-wider">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="font-display font-extrabold text-[22px] text-text-primary mb-1">
                  {tier.label}
                </h3>
                <span className="font-sans font-normal text-[14px] text-text-secondary mb-6 block">
                  {tier.duration}
                </span>

                <div className="flex flex-col mb-6">
                  <span className="font-display font-extrabold text-[48px] leading-none text-text-primary">
                    {tier.price}
                  </span>
                  <span className="font-sans font-normal text-[13px] text-text-tertiary mt-1">
                    {tier.priceNote}
                  </span>
                </div>

                <hr className="border-t border-[#1E1E30] w-full mb-6" />

                <ul className="flex flex-col gap-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] mt-1 shrink-0" />
                    <span className="font-sans font-normal text-[14px] text-text-secondary">Isolated n8n instance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] mt-1 shrink-0" />
                    <span className="font-sans font-normal text-[14px] text-text-secondary">{tier.memory}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] mt-1 shrink-0" />
                    <span className="font-sans font-normal text-[14px] text-text-secondary">Instant URL + credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] mt-1 shrink-0" />
                    <span className="font-sans font-normal text-[14px] text-text-secondary">Auto-destroyed at expiry</span>
                  </li>
                  {key === 'pro' && (
                    <li className="flex items-start gap-3">
                      <Check className="w-[14px] h-[14px] text-[#00E5C7] mt-1 shrink-0" />
                      <span className="font-sans font-normal text-[14px] text-text-secondary">All free templates pre-loaded</span>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleRentTier(key)}
                  className={`w-full h-[48px] rounded-[8px] font-sans font-semibold text-[15px] transition-colors cursor-pointer flex justify-center items-center shrink-0 ${
                    tier.popular
                      ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
                      : 'bg-[#13131F] border border-[#1E1E30] hover:border-[#7C3AED] text-[#F4F4F8]'
                  }`}
                >
                  Start {tier.label} — {tier.price}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — Features Grid */}
        <section className="bg-[#13131F] py-[96px] px-6 border-y border-[#1E1E30]">
          <div className="max-w-[1008px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">
                90-second setup
              </h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed">
                Your n8n instance is provisioned via Docker. URL and credentials delivered instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">
                Fully isolated
              </h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed">
                Each sandbox runs in its own Docker container. Your data never touches another user's instance.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">
                Auto-cleanup
              </h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed">
                Instance auto-destroys at expiry. No dangling containers, no manual cleanup, no surprise charges.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FAQ */}
        <section className="py-[96px] px-6 w-full">
          <div className="max-w-[720px] mx-auto w-full">
            <h2 className="font-display font-extrabold text-[36px] text-text-primary mb-12 text-center">
              Common questions
            </h2>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-surface border border-border rounded-card overflow-hidden transition-colors hover:border-text-secondary/30"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 cursor-pointer text-left"
                  >
                    <span className="font-sans font-semibold text-[16px] text-text-primary pr-8">{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-text-tertiary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-tertiary shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 pb-6 overflow-hidden transition-all duration-200 ease-in-out ${
                      openFaq === idx ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 pb-0'
                    }`}
                  >
                    <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* PAYMENT MODAL */}
      {paymentModalOpen && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPaymentModalOpen(false)}></div>
          
          <div className="relative mt-[10vh] max-w-[480px] w-[calc(100%-48px)] bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[40px] shadow-2xl flex flex-col z-10 mb-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-[24px] text-text-primary">
                Rent {TIERS[selectedTier].label} Sandbox
              </h2>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-[#0D0D14] border border-[#1E1E30] rounded-[8px] p-4 my-6 flex flex-col gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="font-sans font-medium text-[15px] text-[#F4F4F8]">{TIERS[selectedTier].label} Sandbox</span>
                <span className="font-sans font-medium text-[15px] text-[#F4F4F8]">{TIERS[selectedTier].price}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="font-sans font-normal text-[13px] text-[#9CA3AF]">Duration: {TIERS[selectedTier].duration}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <span className="font-sans font-normal text-[13px] text-[#9CA3AF]">Starts immediately after payment</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full h-[52px] bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-[#7C3AED]/50 disabled:cursor-not-allowed text-white rounded-[8px] font-sans font-semibold text-[16px] transition-colors flex items-center justify-center gap-2 cursor-pointer mb-4"
            >
              {checkoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Pay with LemonSqueezy <ExternalLink size={16} /></>
              )}
            </button>

            <button 
              onClick={() => setPaymentModalOpen(false)}
              className="w-full font-sans font-normal text-[14px] text-text-secondary hover:text-text-primary transition-colors text-center focus:outline-none cursor-pointer py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

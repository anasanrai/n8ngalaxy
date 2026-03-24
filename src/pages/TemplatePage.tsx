import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { GitBranch, Check, ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import type { Template } from '../types';

export default function TemplatePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const { data: template, isLoading } = useQuery({
    queryKey: ['template', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Template;
    },
    enabled: !!slug,
  });

  const { data: hasPurchased } = useQuery({
    queryKey: ['purchased', user?.id, template?.id],
    queryFn: async () => {
      if (!user || !template) return false;
      const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('template_id', template.id)
        .limit(1);
      
      return !error && data && data.length > 0;
    },
    enabled: !!user && !!template,
  });

  const handlePurchase = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/template/${slug}` } });
      return;
    }

    if (template?.price_cents === 0 || hasPurchased) {
      // Free download logic placeholder
      alert('Download started (impl coming soon)');
      return;
    }

    // LemonSqueezy checkout URL construction
    if (template?.lemonsqueezy_product_id) {
      const url = new URL(`https://n8ngalaxy.lemonsqueezy.com/checkout/buy/${template.lemonsqueezy_product_id}`);
      if (user.email) url.searchParams.set('checkout[email]', user.email);
      if (profile?.full_name) url.searchParams.set('checkout[name]', profile.full_name);
      
      // Custom metadata for webhook processing
      url.searchParams.set('checkout[custom][user_id]', user.id);
      url.searchParams.set('checkout[custom][template_id]', template.id);

      window.location.href = url.toString();
    } else {
      alert('Product ID not configured for checkout.');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'real_estate': return 'bg-[rgba(0,229,199,0.1)] border-[rgba(0,229,199,0.3)] text-[#00E5C7]';
      case 'sales': return 'bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.3)] text-[#7C3AED]';
      case 'finance': return 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)] text-[#F59E0B]';
      case 'marketing': return 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444]';
      case 'hr': return 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[#10B981]';
      case 'devops': return 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-[#3B82F6]';
      case 'ai_agents': return 'bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.3)] text-[#A855F7]';
      default: return 'bg-surface border-border text-text-secondary';
    }
  };

  const formatCategory = (cat: string) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[144px] px-6 max-w-[1200px] mx-auto w-full flex justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display font-bold text-[32px] text-text-primary mb-4">Template not found</h1>
        <Link to="/marketplace" className="text-primary hover:underline font-sans font-medium text-[16px]">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[144px] pb-[96px] px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
          
          {/* Left Column - Details */}
          <div className="w-full lg:w-[60%] lg:shrink-0 flex flex-col relative">
            <Link 
              to="/marketplace" 
              className="inline-block font-sans font-normal text-[14px] text-text-secondary hover:text-text-primary transition-colors mb-8 w-fit"
            >
              ← Back to Marketplace
            </Link>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center px-[10px] h-[24px] rounded-pill border font-sans font-medium text-[11px] uppercase tracking-wider ${getCategoryColor(template.category)}`}>
                {formatCategory(template.category)}
              </span>
              {template.featured && (
                <span className="inline-flex items-center px-[10px] h-[24px] rounded-pill border border-primary bg-primary text-white font-sans font-medium text-[11px] uppercase tracking-wider">
                  FEATURED
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-[40px] text-text-primary leading-tight mt-3">
              {template.title}
            </h1>

            <div className="mt-8 font-sans font-normal text-[16px] text-text-secondary leading-[1.7] whitespace-pre-wrap shrink-0">
              {template.description}
            </div>

            <hr className="w-full border-t border-border my-8" />

            <h3 className="font-display font-bold text-[20px] text-text-primary mb-4">
              What's included
            </h3>
            <ul className="space-y-3 mb-8">
              {[
                "Complete workflow JSON file",
                "Setup documentation",
                "Node-by-node breakdown",
                "Free updates"
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="w-[16px] h-[16px] text-accent shrink-0" />
                  <span className="font-sans font-normal text-[15px] text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-display font-bold text-[20px] text-text-primary mb-4">
              Tools used
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {template.tools.map(tool => (
                <span key={tool} className="inline-flex items-center px-3 py-1 rounded-[6px] border border-border bg-background font-sans font-medium text-[13px] text-text-tertiary">
                  {tool}
                </span>
              ))}
            </div>

            <h3 className="font-display font-bold text-[20px] text-text-primary mb-6">
              How it works
            </h3>
            <div className="flex flex-col gap-6">
              {[
                { title: 'Purchase', desc: 'Complete checkout. Instant order confirmation.' },
                { title: 'Download', desc: 'Get your workflow JSON file immediately via email & dashboard.' },
                { title: 'Import', desc: 'Open n8n, click Import, paste JSON. Done in 30 seconds.' }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-row items-start gap-4">
                  <div className="w-[36px] h-[36px] rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 font-sans font-bold text-[14px] text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col gap-1 pt-1.5">
                    <span className="font-sans font-medium text-[15px] text-text-primary">{step.title}</span>
                    <span className="font-sans font-normal text-[14px] text-text-secondary">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end shrink-0 sticky lg:top-[96px]">
            <div className="w-full max-w-[400px] bg-surface border border-border rounded-card p-8 flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[48px] text-text-primary">
                  {template.price_cents === 0 ? 'Free' : `$${(template.price_cents / 100).toLocaleString('en-US', { minimumFractionDigits: template.price_cents % 100 === 0 ? 0 : 2 })}`}
                </span>
                {template.price_cents > 0 && (
                  <span className="font-sans font-normal text-[13px] text-text-tertiary">
                    One-time purchase. Lifetime access.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-text-secondary">
                <GitBranch size={14} />
                <span className="font-sans font-normal text-[14px]">{template.node_count} nodes</span>
              </div>

              <hr className="border-t border-border w-full" />

              <ul className="space-y-3">
                {[
                  "Instant download after purchase",
                  "n8n workflow JSON file",
                  "Works with n8n Cloud + self-hosted",
                  "Free updates included"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span className="font-sans font-normal text-[14px] text-text-secondary leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full pt-4">
                <button
                  onClick={handlePurchase}
                  className={`w-full h-[52px] rounded-input font-sans font-semibold text-[16px] transition-colors cursor-pointer flex items-center justify-center ${
                    hasPurchased 
                      ? 'bg-surface border border-border text-text-primary hover:border-primary' 
                      : template.price_cents === 0 
                        ? 'bg-accent hover:bg-accent-dim text-background' 
                        : 'bg-primary hover:bg-primary-hover text-white'
                  }`}
                >
                  {hasPurchased ? 'Download Again' : template.price_cents === 0 ? 'Download Free' : 'Buy Now'}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-text-tertiary">
                  <ShieldCheck size={12} />
                  <span className="font-sans font-normal text-[12px]">Secure checkout via LemonSqueezy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

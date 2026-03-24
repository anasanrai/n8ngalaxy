import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Terminal, Server, BookOpen, CreditCard, Zap, Link as LinkIcon } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
      <Navbar />

      <main>
        {/* SECTION 1 - Hero */}
        <section className="relative min-h-[calc(100vh-64px)] pt-[64px] flex items-center justify-center px-6">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 70%)'
          }}></div>
          
          <div className="relative z-10 w-full max-w-[720px] mx-auto text-center flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-pill border border-primary/40 bg-primary/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="font-sans font-medium text-[13px] text-primary">Now in beta — sandbox rental live</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-[40px] md:text-[64px] leading-tight text-text-primary mb-6">
              The n8n ecosystem
              <br />
              <span className="text-text-primary">hub for builders</span>
            </h1>

            {/* Subheadline */}
            <p className="font-sans font-normal text-[18px] text-text-secondary max-w-[560px] mx-auto leading-relaxed mb-10">
              Buy workflow templates. Rent a live sandbox. Get managed hosting.
              Everything you need to build and ship with n8n.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center mb-10">
              <button 
                onClick={() => navigate('/marketplace')}
                className="h-[48px] px-7 bg-primary hover:bg-primary-hover text-white font-sans font-medium text-[16px] rounded-input transition-colors cursor-pointer"
              >
                Browse Templates
              </button>
              <button 
                onClick={() => navigate('/sandbox')}
                className="h-[48px] px-7 bg-surface border border-border hover:bg-border text-text-primary font-sans font-medium text-[16px] rounded-input transition-colors cursor-pointer"
              >
                Try Sandbox $2
              </button>
            </div>

            {/* Trust markers */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-text-tertiary font-sans font-normal text-[13px]">
              <span>No subscription required</span>
              <span className="hidden sm:inline">·</span>
              <span>Cancel anytime</span>
              <span className="hidden sm:inline">·</span>
              <span>Instant delivery</span>
            </div>
          </div>
        </section>

        {/* SECTION 2 - Stats bar */}
        <section className="bg-surface border-y border-border py-8">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border">
              {[
                { number: '8,856+', label: 'Workflows in n8n library' },
                { number: '230K+', label: 'Active n8n users' },
                { number: '$2/hr', label: 'Cheapest sandbox rental' },
                { number: '90 sec', label: 'Avg provisioning time' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <span className="font-display font-extrabold text-[32px] text-text-primary mb-1">{stat.number}</span>
                  <span className="font-sans font-normal text-[14px] text-text-secondary">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 - Products */}
        <section className="py-[96px] px-6 max-w-[1200px] mx-auto">
          <div className="text-center w-full mb-16">
            <span className="block font-sans font-medium text-[12px] text-primary tracking-[0.1em] uppercase mb-4">WHAT WE OFFER</span>
            <h2 className="font-display font-extrabold text-[40px] text-text-primary mb-4">Four ways to build with n8n</h2>
            <p className="font-sans font-normal text-[16px] text-text-secondary">Every product feeds the next.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Card 1 - Marketplace */}
            <div className="bg-surface border border-border rounded-card p-8 flex flex-col h-full items-start group">
              <div className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">Workflow Marketplace</h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed mb-6 flex-grow">
                Buy production-ready n8n workflow templates.
                Real estate, sales, finance, HR, AI agents.
                Download JSON, import, done.
              </p>
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="font-sans font-medium text-[13px] text-accent">From $29</span>
                <button onClick={() => navigate('/marketplace')} className="font-sans font-medium text-[14px] text-primary hover:underline cursor-pointer flex items-center">
                  Browse templates <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Card 2 - Sandbox */}
            <div className="bg-surface border border-accent/25 rounded-card p-8 flex flex-col h-full items-start group relative shadow-[0_0_40px_rgba(0,229,199,0.05)]">
              <div className="absolute top-8 right-8 px-2 py-0.5 rounded-pill bg-accent/10 border border-accent/30 flex items-center justify-center">
                <span className="font-sans font-medium text-[11px] text-accent">NEW</span>
              </div>
              <div className="w-12 h-12 rounded-xl border border-accent/20 bg-accent/10 flex items-center justify-center mb-6">
                <Terminal className="text-accent w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">Sandbox Rental</h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed mb-6 flex-grow max-w-[90%]">
                Rent a live n8n instance by the hour.
                Practice, demo to clients, or test before deploying.
                Instant URL + credentials. Auto-destroyed at expiry.
              </p>
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="font-sans font-medium text-[13px] text-accent">From $2/hr</span>
                <button onClick={() => navigate('/sandbox')} className="font-sans font-medium text-[14px] text-primary hover:underline cursor-pointer flex items-center">
                  Rent a sandbox <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Card 3 - Hosting */}
            <div className="bg-surface border border-border rounded-card p-8 flex flex-col h-full items-start group">
              <div className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center mb-6">
                <Server className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">Managed Hosting</h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed mb-6 flex-grow">
                We run n8n on your VPS. Docker, Traefik, SSL,
                backups, updates — all handled. You just use n8n.
              </p>
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="font-sans font-medium text-[13px] text-accent">From $49/mo</span>
                <button onClick={() => navigate('/hosting')} className="font-sans font-medium text-[14px] text-primary hover:underline cursor-pointer flex items-center">
                  See hosting plans <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Card 4 - Learn */}
            <div className="bg-surface border border-border rounded-card p-8 flex flex-col h-full items-start group">
              <div className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-text-primary mb-3">Learn & Community</h3>
              <p className="font-sans font-normal text-[15px] text-text-secondary leading-relaxed mb-6 flex-grow">
                Course, workflow vault, and private Discord.
                Build a real automation business, not just workflows.
              </p>
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="font-sans font-medium text-[13px] text-accent">Course from $97</span>
                <button onClick={() => navigate('/learn')} className="font-sans font-medium text-[14px] text-primary hover:underline cursor-pointer flex items-center">
                  Start learning <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - How sandbox works */}
        <section className="bg-surface py-[96px] px-6">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="text-center w-full mb-16">
              <span className="block font-sans font-medium text-[12px] text-primary tracking-[0.1em] uppercase mb-4">How sandbox rental works</span>
              <h2 className="font-display font-extrabold text-[40px] text-text-primary mb-4">Minutes to production</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 w-full relative">
              {/* Dashed line connector behind items */}
              <div className="hidden lg:block absolute top-[64px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-border z-0"></div>

              {[
                { 
                  icon: <CreditCard className="w-8 h-8 text-primary" />,
                  title: 'Pick your tier', 
                  body: 'Spark $2/hr, Explorer $6/4hr, Builder $9/day, Pro $29/week'
                },
                { 
                  icon: <Zap className="w-8 h-8 text-primary" />,
                  title: 'Instant provisioning', 
                  body: 'Your n8n instance spins up in under 90 seconds via Docker'
                },
                { 
                  icon: <LinkIcon className="w-8 h-8 text-primary" />,
                  title: 'Get your URL', 
                  body: 'Credentials emailed. Instance auto-destroyed at expiry. No cleanup.'
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center flex-1 text-center relative z-10 bg-surface">
                  <span className="font-sans font-medium text-[12px] text-primary mb-4 bg-surface px-2">0{i + 1}</span>
                  <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="font-display font-bold text-[18px] text-text-primary mb-3">{step.title}</h3>
                  <p className="font-sans font-normal text-[14px] text-text-secondary leading-relaxed max-w-[280px]">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 - CTA banner */}
        <section className="py-[96px] px-6 w-full text-center">
          <h2 className="font-display font-extrabold text-[48px] text-text-primary mb-4">Ready to build?</h2>
          <p className="font-sans font-normal text-[18px] text-text-secondary mb-10">Start with a $2 sandbox. No commitment.</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <button 
              onClick={() => navigate('/marketplace')}
              className="h-[48px] px-7 bg-primary hover:bg-primary-hover text-white font-sans font-medium text-[16px] rounded-input transition-colors cursor-pointer"
            >
              Browse Templates
            </button>
            <button 
              onClick={() => navigate('/sandbox')}
              className="h-[48px] px-7 bg-surface border border-border hover:bg-border text-text-primary font-sans font-medium text-[16px] rounded-input transition-colors cursor-pointer"
            >
              Try Sandbox $2
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

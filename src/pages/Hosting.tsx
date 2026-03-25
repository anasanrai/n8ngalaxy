import { Check, Server, Shield, Database, RefreshCw, Bell, Globe } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Hosting() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14] text-[#F4F4F8]">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1 — Hero */}
        <section className="bg-[#0D0D14] pt-[80px] pb-[64px] px-6 text-center">
          <div className="max-w-[560px] mx-auto flex flex-col items-center">
            <span className="font-sans font-medium text-[12px] text-[#7C3AED] tracking-[0.1em] uppercase mb-4 block">
              MANAGED HOSTING
            </span>
            <h1 className="font-display font-extrabold text-[48px] leading-tight mb-4">
              n8n without the DevOps
            </h1>
            <p className="font-sans font-normal text-[18px] text-[#9CA3AF]">
              We run n8n on your VPS. Docker, Traefik, SSL, backups, updates — all handled. You just use n8n.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Pricing cards */}
        <section className="px-6 py-12">
          <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[32px] flex flex-col">
              <h3 className="font-display font-extrabold text-[20px] text-[#F4F4F8] mb-2">Starter</h3>
              <div className="mb-6 flex items-baseline">
                <span className="font-display font-extrabold text-[48px] text-[#F4F4F8]">$49</span>
                <span className="font-sans font-normal text-[16px] text-[#9CA3AF]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'n8n deployed on your VPS',
                  'Docker + Traefik + SSL setup',
                  'Daily encrypted backups',
                  'n8n version updates',
                  'Custom domain (n8n.yourdomain.com)',
                  'Uptime monitoring + Telegram alerts',
                  '1 n8n instance',
                  '5GB storage',
                  'Email support (48h)'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] shrink-0 mt-1" />
                    <span className="font-sans font-normal text-[14px] text-[#9CA3AF] leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Hosting inquiry'}
                className="w-full h-[48px] rounded-[8px] border border-[#1E1E30] hover:border-[#7C3AED] bg-transparent text-[#F4F4F8] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
                title="Get Started"
              >
                Get Started
              </button>
            </div>

            {/* Growth */}
            <div className="bg-[#13131F] border border-[rgba(124,58,237,0.5)] rounded-[12px] p-[32px] flex flex-col relative" style={{ boxShadow: '0 0 40px rgba(124,58,237,0.1)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#7C3AED] text-white font-sans font-bold text-[10px] uppercase tracking-wider rounded-full">
                POPULAR
              </div>
              <h3 className="font-display font-extrabold text-[20px] text-[#F4F4F8] mb-2">Growth</h3>
              <div className="mb-6 flex items-baseline">
                <span className="font-display font-extrabold text-[48px] text-[#F4F4F8]">$99</span>
                <span className="font-sans font-normal text-[16px] text-[#9CA3AF]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'n8n deployed on your VPS',
                  'Docker + Traefik + SSL setup',
                  'Daily encrypted backups',
                  'n8n version updates',
                  'Custom domain (n8n.yourdomain.com)',
                  'Uptime monitoring + Telegram alerts',
                  '2 n8n instances',
                  '20GB storage',
                  'Email support (24h)'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] shrink-0 mt-1" />
                    <span className="font-sans font-normal text-[14px] text-[#9CA3AF] leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Hosting inquiry'}
                className="w-full h-[48px] rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[15px] transition-colors cursor-pointer"
                title="Get Started"
              >
                Get Started
              </button>
            </div>

            {/* Agency */}
            <div className="bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[32px] flex flex-col">
              <h3 className="font-display font-extrabold text-[20px] text-[#F4F4F8] mb-2">Agency</h3>
              <div className="mb-6 flex items-baseline">
                <span className="font-display font-extrabold text-[48px] text-[#F4F4F8]">$299</span>
                <span className="font-sans font-normal text-[16px] text-[#9CA3AF]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'n8n deployed on your VPS',
                  'Docker + Traefik + SSL setup',
                  'Daily encrypted backups',
                  'n8n version updates',
                  'Custom domain (n8n.yourdomain.com)',
                  'Uptime monitoring + Telegram alerts',
                  '5 n8n instances',
                  '100GB storage',
                  'Priority support (4h)',
                  'White-label (remove n8nGalaxy branding)',
                  'Monthly usage report PDF'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-[14px] h-[14px] text-[#00E5C7] shrink-0 mt-1" />
                    <span className="font-sans font-normal text-[14px] text-[#9CA3AF] leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Hosting inquiry'}
                className="w-full h-[48px] rounded-[8px] border border-[#1E1E30] hover:border-[#7C3AED] bg-transparent text-[#F4F4F8] font-sans font-semibold text-[15px] transition-colors cursor-pointer"
                title="Get Started"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3 — What's included detail */}
        <section className="bg-[#13131F] py-[96px] px-6">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="font-display font-extrabold text-[40px] text-center mb-12">
              Everything handled for you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[32px]">
              {[
                { icon: <Server className="w-6 h-6 text-[#7C3AED]" />, title: 'VPS Setup', desc: 'We configure Docker, Traefik v3, and n8n on your server in under 2 hours.' },
                { icon: <Shield className="w-6 h-6 text-[#7C3AED]" />, title: 'SSL Certificates', desc: "Auto-renewed Let's Encrypt certs. Your n8n runs on HTTPS always." },
                { icon: <Database className="w-6 h-6 text-[#7C3AED]" />, title: 'Daily Backups', desc: 'Encrypted daily backups of your n8n data. 7-day retention.' },
                { icon: <RefreshCw className="w-6 h-6 text-[#7C3AED]" />, title: 'Version Updates', desc: 'We update n8n when new versions release. Triggered on your approval.' },
                { icon: <Bell className="w-6 h-6 text-[#7C3AED]" />, title: 'Monitoring', desc: '24/7 uptime monitoring. Telegram alerts if your instance goes down.' },
                { icon: <Globe className="w-6 h-6 text-[#7C3AED]" />, title: 'Custom Domain', desc: 'Point n8n.yourcompany.com to your instance. SSL included.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-[48px] h-[48px] rounded-[12px] bg-[#0D0D14] border border-[#1E1E30] flex items-center justify-center shrink-0 mb-1">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-[18px] text-[#F4F4F8]">{item.title}</h3>
                  <p className="font-sans font-normal text-[14px] text-[#9CA3AF] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — CTA */}
        <section className="bg-[#0D0D14] py-[96px] px-6 border-t border-[#1E1E30] text-center">
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-display font-extrabold text-[40px] text-text-primary mb-4 leading-tight">
              Ready to get started?
            </h2>
            <p className="font-sans font-normal text-[18px] text-text-tertiary mb-8 max-w-[500px] mx-auto">
              Book a 15-minute call. We'll have your n8n running within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://calendly.com/raianasan10/30min"
                className="inline-flex h-[48px] items-center justify-center px-[32px] rounded-[8px] bg-[#7C3AED] text-white font-sans font-semibold text-[16px] transition-colors hover:bg-[#6D28D9]"
                target="_blank"
                rel="noreferrer"
              >
                Book a Call
              </a>
              <button
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com'}
                className="inline-flex h-[48px] items-center justify-center px-[32px] rounded-input bg-transparent text-text-primary border border-border hover:border-text-secondary font-sans font-semibold text-[16px] transition-colors cursor-pointer"
              >
                Email us
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

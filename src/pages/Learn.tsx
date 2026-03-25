import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Learn() {
  const [showAllModules, setShowAllModules] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14] text-[#F4F4F8]">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1 — Hero */}
        <section className="bg-[#0D0D14] pt-[80px] pb-[64px] px-6 text-center">
          <div className="max-w-[800px] mx-auto flex flex-col items-center">
            <span className="font-sans font-medium text-[12px] text-[#7C3AED] tracking-[0.1em] uppercase mb-4 block">
              LEARN
            </span>
            <h1 className="font-display font-extrabold text-[48px] leading-tight mb-4 text-[#F4F4F8]">
              Build a real automation business
            </h1>
            <p className="font-sans font-normal text-[18px] text-[#9CA3AF] max-w-[600px] mx-auto">
              Not just workflows. A complete course on building and selling automation as a service with n8n.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Two product cards */}
        <section className="px-6 py-12">
          <div className="max-w-[860px] mx-auto flex flex-col md:flex-row gap-6">
            
            {/* Card 1 — Mini Course */}
            <div className="flex-1 bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[32px] flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[rgba(0,229,199,0.1)] border border-[rgba(0,229,199,0.3)] text-[#00E5C7] font-sans font-bold text-[10px] uppercase tracking-wider rounded-full mb-4">
                  BEGINNER FRIENDLY
                </span>
                <h3 className="font-display font-extrabold text-[24px] text-[#F4F4F8] mb-2">n8n AI Agent Starter</h3>
                <div className="flex items-baseline">
                  <span className="font-display font-extrabold text-[40px] text-[#F4F4F8]">$97</span>
                  <span className="font-sans font-normal text-[14px] text-[#9CA3AF] ml-2">one-time</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'n8n fundamentals — nodes, canvas, webhooks',
                  'Connecting APIs with HTTP Request node',
                  'AI integration — Claude, GPT inside n8n',
                  '3 production templates included',
                  'Lifetime access + updates'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-[18px] h-[18px] text-[#00E5C7] shrink-0 mt-0.5" />
                    <span className="font-sans font-normal text-[15px] text-[#F4F4F8]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Mini course enrollment'}
                className="w-full h-[52px] rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[16px] transition-colors cursor-pointer"
              >
                Enroll Now — $97
              </button>
            </div>

            {/* Card 2 — Full Course */}
            <div className="flex-[1.2] bg-[#13131F] border border-[rgba(124,58,237,0.5)] rounded-[12px] p-[32px] flex flex-col relative" style={{ boxShadow: '0 0 40px rgba(124,58,237,0.1)' }}>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.3)] text-[#7C3AED] font-sans font-bold text-[10px] uppercase tracking-wider rounded-full mb-4">
                  MOST COMPLETE
                </span>
                <h3 className="font-display font-extrabold text-[24px] text-[#F4F4F8] mb-2">Build a SaaS with n8n</h3>
                <div className="flex items-baseline">
                  <span className="font-display font-extrabold text-[40px] text-[#F4F4F8]">$397</span>
                  <span className="font-sans font-normal text-[14px] text-[#9CA3AF] ml-2">one-time</span>
                </div>
              </div>

              <ul className="space-y-4 mb-6 flex-1">
                {[
                  'n8n fundamentals + advanced nodes',
                  'AI integration — RAG, agents, voice',
                  'Lead generation systems',
                  'Real estate automation stack',
                  'Building your template business',
                  'Selling automation retainers',
                  'Managed hosting setup from scratch',
                  'Building micro-SaaS on n8n',
                  'Client acquisition systems',
                  'Scaling to $10K/mo',
                  'CashPilot-style product building',
                  'Live office hours (4 sessions)'
                ].map((feature, i) => {
                  if (!showAllModules && i >= 6) return null;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-[18px] h-[18px] text-[#00E5C7] shrink-0 mt-0.5" />
                      <span className="font-sans font-normal text-[15px] text-[#F4F4F8]">{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <button 
                onClick={() => setShowAllModules(!showAllModules)}
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F4F4F8] font-sans font-medium text-[14px] mb-8 transition-colors cursor-pointer"
              >
                {showAllModules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showAllModules ? 'Show less' : 'Show all 12 modules'}
              </button>

              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Full course enrollment'}
                className="w-full h-[52px] rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[16px] transition-colors cursor-pointer mt-auto"
              >
                Enroll Now — $397
              </button>
            </div>

          </div>
        </section>

        {/* SECTION 3 — Community membership */}
        <section className="bg-[#13131F] py-[64px] px-6">
          <div className="max-w-[600px] mx-auto bg-[#0D0D14] border border-[#1E1E30] rounded-[12px] p-[40px] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex flex-col items-start">
              <span className="inline-block px-3 py-1 bg-[rgba(0,229,199,0.1)] border border-[rgba(0,229,199,0.3)] text-[#00E5C7] font-sans font-bold text-[10px] uppercase tracking-wider rounded-full mb-4">
                Private Community
              </span>
              <h2 className="font-display font-extrabold text-[32px] text-[#F4F4F8] mb-2 leading-tight">
                The n8n builders community
              </h2>
              <div className="font-display font-extrabold text-[40px] text-[#F4F4F8] mb-6">
                $49<span className="font-sans font-normal text-[16px] text-[#9CA3AF]">/mo</span>
              </div>
              
              <ul className="space-y-4 w-full mb-8">
                {[
                  'Discord access',
                  'Monthly live build session',
                  'Workflow vault (all templates)',
                  'Priority support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-[18px] h-[18px] text-[#00E5C7] shrink-0 mt-0.5" />
                    <span className="font-sans font-normal text-[15px] text-[#F4F4F8]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => window.location.href = 'mailto:hello@n8ngalaxy.com?subject=Community membership'}
                className="w-full h-[52px] rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[16px] transition-colors cursor-pointer"
              >
                Join Community
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

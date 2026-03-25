import { useState } from 'react';
import { CheckCircle2, TrendingUp, FileText, Bell, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { supabase } from '../lib/supabase';

export default function CashPilot() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Freelancer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('waitlist_signups')
        // @ts-expect-error type inference failure
        .insert([
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            source: 'cashpilot',
          }
        ]);

      if (insertError) throw insertError;
      
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14] text-[#F4F4F8]">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1 — Hero */}
        <section className="bg-[#0D0D14] pt-[120px] pb-[80px] px-6 text-center">
          <div className="max-w-[640px] mx-auto flex flex-col items-center">
            
            <div className="flex items-center justify-center mb-6 gap-1">
              <span className="font-sans font-bold text-[28px] text-white">Cash</span>
              <span className="font-sans font-bold text-[28px] text-[#00E5C7]">Pilot</span>
            </div>

            <h1 className="font-display font-extrabold text-[56px] leading-tight mb-6 text-[#F4F4F8]">
              Your AI CFO for freelancers and agencies
            </h1>
            <p className="font-sans font-normal text-[20px] text-[#9CA3AF] max-w-[520px] mx-auto leading-[1.6] mb-12">
              Connect Stripe, PayPal, and your bank. Get weekly AI-generated CFO reports. Know your runway. Never miss an invoice.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-[48px]">
              {['Powered by Claude AI', 'n8n workflows', 'Coming Q2 2026'].map(pill => (
                <span key={pill} className="bg-[#13131F] border border-[#1E1E30] rounded-full px-[20px] py-[8px] font-sans font-medium text-[13px] text-[#9CA3AF]">
                  {pill}
                </span>
              ))}
            </div>

            {/* Waitlist Form */}
            <div className="w-full max-w-[480px] bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[32px] text-left mx-auto">
              {success ? (
                <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 className="w-[32px] h-[32px] text-[#00E5C7] mb-4" />
                  <h3 className="font-display font-bold text-[20px] text-[#F4F4F8] mb-2">You're on the list!</h3>
                  <p className="font-sans font-normal text-[14px] text-[#9CA3AF]">
                    We'll email you when CashPilot launches.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-[20px] text-[#F4F4F8] mb-1">Join the waitlist</h3>
                  <p className="font-sans font-normal text-[14px] text-[#9CA3AF] mb-6">
                    Get early access + 3 months at 50% off
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-[48px] px-4 rounded-input bg-[#0D0D14] border border-[#1E1E30] focus:border-[#7C3AED] focus:outline-none text-[#F4F4F8] font-sans font-normal text-[15px] placeholder:text-[#6B7280] transition-colors"
                    />
                    
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-[48px] px-4 rounded-input bg-[#0D0D14] border border-[#1E1E30] focus:border-[#7C3AED] focus:outline-none text-[#F4F4F8] font-sans font-normal text-[15px] placeholder:text-[#6B7280] transition-colors"
                    />

                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full h-[48px] px-4 rounded-input bg-[#0D0D14] border border-[#1E1E30] focus:border-[#7C3AED] focus:outline-none text-[#F4F4F8] font-sans font-normal text-[15px] transition-colors appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="Freelancer">Freelancer</option>
                      <option value="Agency owner">Agency owner</option>
                      <option value="Small business">Small business</option>
                      <option value="Other">Other</option>
                    </select>

                    {error && (
                      <p className="font-sans font-medium text-[13px] text-[#EF4444] mt-1">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-[48px] mt-2 rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-[#7C3AED]/50 text-white font-sans font-semibold text-[16px] transition-colors flex items-center justify-center cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Waitlist'}
                    </button>
                  </form>
                </>
              )}
            </div>

            <p className="font-sans font-normal text-[13px] text-[#6B7280] mt-6">
              Already 47 people on the waitlist
            </p>

          </div>
        </section>

        {/* SECTION 2 — Feature preview */}
        <section className="bg-[#0D0D14] pb-[120px] px-6">
          <div className="max-w-[1000px] mx-auto flex flex-col items-center">
            <span className="font-sans font-medium text-[11px] text-[#9CA3AF] tracking-[0.1em] uppercase mb-8">
              WHAT CASHPILOT DOES
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[
                { 
                  icon: <TrendingUp className="w-6 h-6 text-[#00E5C7]" />, 
                  title: 'Unified cashflow', 
                  desc: 'Stripe + PayPal + bank CSV in one view' 
                },
                { 
                  icon: <FileText className="w-6 h-6 text-[#00E5C7]" />, 
                  title: 'Weekly CFO report', 
                  desc: 'AI-generated insights every Monday morning' 
                },
                { 
                  icon: <Bell className="w-6 h-6 text-[#00E5C7]" />, 
                  title: 'Smart alerts', 
                  desc: 'Invoice overdue, runway warning, anomaly detection' 
                },
              ].map((feature, i) => (
                <div key={i} className="bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-[24px] flex flex-col items-start">
                  <div className="w-[40px] h-[40px] rounded-[8px] bg-[rgba(0,229,199,0.1)] flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-[18px] text-[#F4F4F8] mb-2">{feature.title}</h3>
                  <p className="font-sans font-normal text-[14px] text-[#9CA3AF] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

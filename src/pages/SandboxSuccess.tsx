import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, Copy, ExternalLink, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import type { SandboxSession } from '../types';

export default function SandboxSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [status, setStatus] = useState<'provisioning' | 'success' | 'error'>('provisioning');
  const [credentials, setCredentials] = useState<{ url: string; user: string; pass: string; expiresAt: string } | null>(null);
  const [countdown, setCountdown] = useState(90);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const sId = searchParams.get('session_id');
    const oId = searchParams.get('order_id');
    if (sId && oId) {
      setSessionId(sId);
      setOrderId(oId);
      setParamsLoaded(true);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: number;
    if (status === 'provisioning') {
      timer = window.setInterval(() => {
        setCountdown((c) => Math.max(0, c - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!paramsLoaded || !sessionId || !orderId) return;

    let pollInterval: number;
    const timeoutAt = Date.now() + 180000; // 3 minutes

    const poll = async () => {
      if (Date.now() > timeoutAt) {
        setTimedOut(true);
        clearInterval(pollInterval);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sandbox_sessions')
          .select('status, n8n_url, n8n_username, n8n_password, expires_at')
          .eq('id', sessionId)
          .single();

        if (error) return;
        const session = data as unknown as SandboxSession;

        if (session.status === 'active' && session.n8n_url) {
          setCredentials({
            url: session.n8n_url,
            user: session.n8n_username || 'n8n',
            pass: session.n8n_password || '',
            expiresAt: session.expires_at,
          });
          setStatus('success');
          clearInterval(pollInterval);
        } else if (session.status === 'failed') {
          setStatus('error');
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    };

    // Initial poll
    poll();
    // Start interval
    pollInterval = window.setInterval(poll, 3000);

    return () => clearInterval(pollInterval);
  }, [paramsLoaded, sessionId, orderId]);

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full mt-16 mb-16">
        {status === 'provisioning' && (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin mb-6" />
            <h1 className="font-display font-bold text-[24px] text-text-primary mb-2">
              Spinning up your instance
            </h1>
            <p className="font-sans font-normal text-[16px] text-text-secondary mb-8">
              This takes about 90 seconds. Don't close this tab.
            </p>
            
            <div className="w-[300px] h-2 bg-surface rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-[#7C3AED] transition-all duration-1000 ease-linear"
                style={{ width: `${Math.max(0, 100 - (countdown / 90) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-sm text-text-tertiary">~{countdown}s remaining</span>
            
            {timedOut && (
              <p className="mt-8 text-amber-500 font-medium animate-pulse">
                Taking longer than expected, check your email
              </p>
            )}
          </div>
        )}

        {status === 'success' && credentials && (
          <div className="w-full max-w-[560px] bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-10 flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-[#00E5C7] mb-6" />
            <h1 className="font-display font-extrabold text-[32px] text-text-primary mb-8 text-center">
              Your sandbox is ready!
            </h1>
            
            <div className="w-full bg-[#0D0D14] border border-[#1E1E30] rounded-[8px] p-6 mb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-sans font-medium text-[13px] text-[#9CA3AF]">Instance URL</span>
                <div className="flex items-center gap-2 w-full">
                  <span className="font-mono text-[15px] text-[#00E5C7] truncate flex-1">{credentials.url}</span>
                  <button onClick={() => handleCopy(credentials.url)} className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer" title="Copy URL">
                    <Copy size={16} />
                  </button>
                  <a href={credentials.url} target="_blank" rel="noreferrer" className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer" title="Open URL">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-[#1E1E30]" />

              <div className="flex flex-col gap-1.5">
                <span className="font-sans font-medium text-[13px] text-[#9CA3AF]">Username</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[15px] text-[#F4F4F8] flex-1">{credentials.user}</span>
                  <button onClick={() => handleCopy(credentials.user)} className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-[#1E1E30]" />

              <div className="flex flex-col gap-1.5">
                <span className="font-sans font-medium text-[13px] text-[#9CA3AF]">Password</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[15px] text-[#F4F4F8] flex-1">{credentials.pass}</span>
                  <button onClick={() => handleCopy(credentials.pass)} className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8 text-[#F59E0B]">
              <Clock size={14} />
              <span className="font-sans font-normal text-[14px]">
                Expires {new Date(credentials.expiresAt).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-[48px] rounded-[8px] bg-surface border border-[#1E1E30] hover:border-primary text-text-primary font-sans font-semibold text-[15px] transition-colors flex items-center justify-center cursor-pointer"
              >
                Go to Dashboard
              </button>
              <a 
                href={credentials.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-[48px] rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[15px] transition-colors flex items-center justify-center cursor-pointer"
              >
                Open n8n
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-[#EF4444] mb-4" />
            <h1 className="font-display font-bold text-[24px] text-text-primary mb-2">
              Setup failed
            </h1>
            <p className="font-sans font-normal text-[14px] text-[#9CA3AF] mb-8">
              Please contact support with your order ID: {orderId || 'unknown'}
            </p>
            <button 
              onClick={() => navigate('/sandbox')}
              className="h-[40px] px-6 rounded-[8px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-sans font-semibold text-[14px] transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

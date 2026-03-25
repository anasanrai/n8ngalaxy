import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import SandboxStandaloneHeader from '../components/sandbox/SandboxStandaloneHeader';
import SandboxActiveView from '../components/sandbox/SandboxActiveView';

export default function SandboxSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<'provisioning' | 'active' | 'failed' | 'timeout'>('provisioning');
  const [lines, setLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Fetch most recent provisioning session
    const fetchSession = async () => {
      const { data } = await supabase
        .from('sandbox_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const payload = data as any;
      if (payload) {
        setSession(payload);
        setStatus(payload.status);
      }
    };

    fetchSession();

    const interval = setInterval(fetchSession, 3000);
    const timeout = setTimeout(() => {
      setStatus(s => s === 'provisioning' ? 'timeout' : s);
    }, 180000); // 3 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user]);

  // Terminal lines timing
  useEffect(() => {
    if (status !== 'provisioning') return;
    
    // Animate progress up to 90% over 90s
    setTimeout(() => setProgress(90), 100);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    timeouts.push(setTimeout(() => setLines(1), 0));
    timeouts.push(setTimeout(() => setLines(2), 800));
    timeouts.push(setTimeout(() => setLines(3), 1600));
    timeouts.push(setTimeout(() => setLines(4), 2400));
    timeouts.push(setTimeout(() => setLines(5), 3200));
    timeouts.push(setTimeout(() => setLines(6), 4000));
    
    return () => timeouts.forEach(clearTimeout);
  }, [status]);

  if (status === 'active') {
    return <SandboxActiveView session={session} />;
  }

  if (status === 'timeout') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
        <SandboxStandaloneHeader />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Clock size={48} color="#F59E0B" style={{ marginBottom: 24 }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#F4F4F8', marginBottom: 12 }}>Taking longer than expected</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#6B7280', marginBottom: 6 }}>Check your email — credentials sent there too.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: 24, background: '#13131F', border: '0.5px solid #1E1E30', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', fontWeight: 500, padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
        <SandboxStandaloneHeader />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <AlertCircle size={48} color="#EF4444" style={{ marginBottom: 24 }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#F4F4F8', marginBottom: 12 }}>Setup failed</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#6B7280', maxWidth: 400, margin: '0 auto' }}>Payment captured. Email hello@n8ngalaxy.com with order ID: {session?.lemonsqueezy_order_id}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: 24, background: '#13131F', border: '0.5px solid #1E1E30', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', fontWeight: 500, padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Provisioning
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <SandboxStandaloneHeader />
      
      <div style={{ maxWidth: '32rem', margin: '0 auto', paddingTop: 128, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} className="animate-pulse mr-3" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, color: '#F4F4F8' }}>Setting up your instance</span>
        </div>

        <div style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 8, padding: 24, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, minHeight: 180 }}>
          {lines >= 1 && <div style={{ color: '#4A4A5A', marginBottom: 8 }}>$ docker pull n8nio/n8n:latest</div>}
          {lines >= 2 && <div style={{ color: '#4A4A5A', marginBottom: 8 }}>$ docker run --name sandbox-{session?.id?.split('-')[0] || '...'}</div>}
          {lines >= 3 && <div style={{ color: '#10B981', marginBottom: 8 }}>✓ Container started</div>}
          {lines >= 4 && <div style={{ color: '#4A4A5A', marginBottom: 8 }}>$ configuring traefik route...</div>}
          {lines >= 5 && <div style={{ color: '#10B981', marginBottom: 8 }}>✓ SSL certificate issued</div>}
          {lines >= 6 && <div style={{ color: '#F59E0B' }} className="animate-pulse">$ waiting for n8n health check...</div>}
          {lines >= 6 && <span className="animate-ping" style={{ color: '#6B7280' }}>|</span>}
        </div>

        <div style={{ marginTop: 32 }}>
          <div style={{ background: '#13131F', height: 2, width: '100%', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #00E5C7)', transition: 'width 90s linear' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280' }}>Usually ready in 60–90 seconds</div>
        </div>
      </div>
    </div>
  );
}

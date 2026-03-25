import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Key, ExternalLink, Clock, Check, X } from 'lucide-react';

export default function SandboxActiveView({ session }: { session: any }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isLowTime, setIsLowTime] = useState(false);

  // Copy state arrays
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!session || !session.expires_at) return;
    const interval = setInterval(() => {
      const ms = new Date(session.expires_at).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeftStr('Expired');
        setIsLowTime(true);
        return;
      }
      
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((ms % (1000 * 60)) / 1000);
      
      let ts = '';
      if (hours > 0) {
        ts = `${hours}h ${mins}m remaining`;
      } else {
        ts = `${mins}m ${secs}s remaining`;
      }
      
      setTimeLeftStr(ts);
      setIsLowTime(ms < 10 * 60 * 1000); // under 10 minutes
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const handleCopy = (val: string, setter: (b: boolean) => void) => {
    navigator.clipboard.writeText(val);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const subdomainStr = session?.n8n_url ? new URL(session.n8n_url).host : '';
  const dateStr = session?.expires_at ? new Date(session.expires_at).toLocaleString() : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
      
      {/* Top Bar - 48px */}
      <div style={{ 
        height: 48, background: '#0D0D14', borderBottom: '0.5px solid #1E1E30', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
        flexShrink: 0
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E5C7' }} className="animate-pulse mr-2" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#00E5C7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            LIVE
          </span>
          <span style={{ width: 1, background: '#1E1E30', height: 16, margin: '0 12px', display: 'inline-block' }} />
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#6B7280' }}>
            {subdomainStr}
          </span>
          <button 
            onClick={() => handleCopy(subdomainStr, setCopiedUrl)}
            style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', marginLeft: 8, padding: 0, display: 'flex' }}
          >
            {copiedUrl ? <Check size={12} color="#00E5C7" /> : <Copy size={12} color="#6B7280" className="hover:text-[#F4F4F8]" />}
          </button>
        </div>

        {/* Center */}
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: isLowTime ? '#EF4444' : '#F59E0B' }}>
          {timeLeftStr}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 6, height: 32, padding: '0 12px', display: 'flex', alignItems: 'center', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#9CA3AF', transition: '150ms' }}
            className="hover:border-[#7C3AED]"
          >
            <Key size={12} color="#9CA3AF" style={{ marginRight: 4 }} />
            Credentials
          </button>
          <button
            onClick={() => { if (session?.n8n_url) window.open(session.n8n_url, '_blank') }}
            style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 6, height: 32, padding: '0 12px', display: 'flex', alignItems: 'center', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#9CA3AF', transition: '150ms' }}
            className="hover:border-[#7C3AED]"
          >
            <ExternalLink size={12} color="#9CA3AF" style={{ marginRight: 4 }} />
            Open in new tab
          </button>
          <Link
            to="/dashboard"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#6B7280', textDecoration: 'none', marginLeft: 8 }}
            className="hover:text-[#F4F4F8]"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        src={session?.n8n_url || ''}
        className="w-full flex-1 border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        allow="*"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        title="n8n session"
      />

      {/* Credentials Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 320, background: '#13131F', borderLeft: '0.5px solid #1E1E30',
        padding: 24, zIndex: 50, transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: '200ms ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#F4F4F8', margin: 0 }}>Credentials</h2>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={16} color="#6B7280" className="hover:text-[#F4F4F8]" />
          </button>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* URL */}
          <div style={{ background: '#0D0D14', border: '0.5px solid #1E1E30', borderRadius: 8, padding: 12 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 }}>URL</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#F4F4F8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 220 }}>{session?.n8n_url || ''}</span>
              <button onClick={() => handleCopy(session?.n8n_url, setCopiedUrl)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {copiedUrl ? <Check size={12} color="#00E5C7" /> : <Copy size={12} color="#6B7280" className="hover:text-[#F4F4F8]" />}
              </button>
            </div>
          </div>

          {/* Username */}
          <div style={{ background: '#0D0D14', border: '0.5px solid #1E1E30', borderRadius: 8, padding: 12 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 }}>Username</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#F4F4F8' }}>{session?.n8n_username || ''}</span>
              <button onClick={() => handleCopy(session?.n8n_username, setCopiedUser)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {copiedUser ? <Check size={12} color="#00E5C7" /> : <Copy size={12} color="#6B7280" className="hover:text-[#F4F4F8]" />}
              </button>
            </div>
          </div>

          {/* Password */}
          <div style={{ background: '#0D0D14', border: '0.5px solid #1E1E30', borderRadius: 8, padding: 12 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Password</span>
              <button 
                onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#7C3AED' }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#F4F4F8' }}>
                {showPass ? (session?.n8n_password || '') : '••••••••••••••••'}
              </span>
              <button onClick={() => handleCopy(session?.n8n_password, setCopiedPass)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {copiedPass ? <Check size={12} color="#00E5C7" /> : <Copy size={12} color="#6B7280" className="hover:text-[#F4F4F8]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expiry */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center' }}>
          <Clock size={14} color="#F59E0B" style={{ marginRight: 8 }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, color: '#F59E0B' }}>Expires: {dateStr}</span>
        </div>

        {/* Warning */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>
            Export workflows from n8n <strong>Settings &rarr; Export</strong> before expiry. Everything is deleted.
          </p>
        </div>

        {/* Extend Time */}
        <button
          onClick={() => navigate('/sandbox')}
          style={{ marginTop: 24, width: '100%', height: 40, background: 'transparent', border: '0.5px solid #1E1E30', borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#9CA3AF', transition: '150ms' }}
          className="hover:border-[#7C3AED]"
        >
          Extend time
        </button>

      </div>
    </div>
  );
}

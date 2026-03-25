import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Copy, Check, EyeOff, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SandboxSession } from '../types';
import TopBar from '../components/layout/TopBar';

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- Mini Flow ---
const WebhookNode = () => (
  <div style={{ background: '#13131F', border: '0.5px solid #7C3AED', borderRadius: 8, padding: 8 }}>
    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#F4F4F8' }}>Webhook Trigger</div>
    <Handle type="source" position={Position.Right} style={{ background: '#00E5C7', width: 6, height: 6, border: 'none' }} />
  </div>
);
const HttpNode = () => (
  <div style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 8, padding: 8 }}>
    <Handle type="target" position={Position.Left} style={{ background: '#00E5C7', width: 6, height: 6, border: 'none' }} />
    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, color: '#F4F4F8' }}>HTTP Request</div>
    <Handle type="source" position={Position.Right} style={{ background: '#00E5C7', width: 6, height: 6, border: 'none' }} />
  </div>
);
const nodeTypes = { webhook: WebhookNode, http: HttpNode };
const initialNodes = [
  { id: '1', position: { x: 50, y: 150 }, type: 'webhook', data: {} },
  { id: '2', position: { x: 250, y: 150 }, type: 'http', data: {} },
];
const initialEdges = [
  { 
    id: 'e1-2', source: '1', target: '2', 
    animated: true, 
    style: { stroke: '#7C3AED', strokeWidth: 1.5, strokeDasharray: '4 4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' }
  },
];

type Status = 'polling' | 'ready' | 'failed' | 'timeout';

const TERMINAL_LINES = [
  { text: "$ docker pull n8nio/n8n:latest", color: "#6B7280" },
  { text: "$ docker run --name sandbox-xyz ...", color: "#6B7280" },
  { text: "$ traefik route configured", color: "#6B7280" },
  { text: "✓ Container started", color: "#10B981" },
  { text: "✓ n8n initializing...", color: "#10B981" },
  { text: "Waiting for health check...", color: "#F59E0B" }
];

export default function SandboxSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<Status>('polling');
  const [session, setSession] = useState<SandboxSession | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [visibleLines, setVisibleLines] = useState(0);
  const [expiresInStr, setExpiresInStr] = useState('');

  // Terminal animation
  useEffect(() => {
    if (status !== 'polling') return;
    const interval = setInterval(() => {
      setVisibleLines(v => (v < TERMINAL_LINES.length ? v + 1 : v));
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  // Progress animation
  useEffect(() => {
    if (status !== 'polling') return;
    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + 1 : p));
    }, 1000); // 1% per sec -> 90% in 90s
    return () => clearInterval(interval);
  }, [status]);

  // Redirect if no session ID
  useEffect(() => {
    if (!sessionId) {
      navigate('/sandbox');
    }
  }, [sessionId, navigate]);

  // Polling logic
  useEffect(() => {
    if (!sessionId || status !== 'polling') return;

    let pollCount = 0;
    const maxPolls = 60; // 3 minutes at 3s intervals

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('sandbox_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) return;

        const sessionData = data as unknown as SandboxSession;

        if (sessionData.status === 'active') {
          setSession(sessionData);
          setStatus('ready');
        } else if (sessionData.status === 'failed') {
          setStatus('failed');
        }
      } catch (err) {}

      pollCount++;
      if (pollCount >= maxPolls) {
        setStatus('timeout');
      }
    };

    const intervalId = setInterval(poll, 3000);
    poll(); // Initial poll

    return () => clearInterval(intervalId);
  }, [sessionId, status]);

  // Expiry countdown
  useEffect(() => {
    if (status !== 'ready' || !session) return;
    
    const updateCountdown = () => {
      const ms = new Date(session.expires_at).getTime() - Date.now();
      if (ms <= 0) {
        setExpiresInStr('expired');
        return;
      }
      const hrs = Math.floor(ms / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      setExpiresInStr(`${hrs}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const int = setInterval(updateCountdown, 1000);
    return () => clearInterval(int);
  }, [status, session]);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14]">
      <TopBar />
      
      <main className="flex-1 flex" style={status === 'polling' || status === 'failed' || status === 'timeout' ? { alignItems: 'center', justifyContent: 'center' } : {}}>
        {status === 'polling' && (
          <div style={{ display: 'flex', flexDirection: 'col', alignItems: 'center', width: '100%', maxWidth: 480, margin: '0 auto', background: '#0A0A0F', padding: 40, borderRadius: 12 }}>
            <div style={{ width: '100%', marginBottom: 32, minHeight: 180 }}>
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: line.color, marginBottom: 8, display: 'flex' }}>
                  {line.text}
                  {i === visibleLines - 1 && i === TERMINAL_LINES.length - 1 && (
                    <span className="animate-pulse" style={{ width: 8, background: line.color, display: 'inline-block', marginLeft: 4 }}>|</span>
                  )}
                </div>
              ))}
              {visibleLines < TERMINAL_LINES.length && (
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#6B7280', display: 'flex' }}>
                  <span className="animate-pulse" style={{ width: 8, background: '#6B7280', display: 'inline-block', marginLeft: 4 }}>|</span>
                </div>
              )}
            </div>

            <div style={{ background: '#13131F', height: 2, width: '100%', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #7C3AED, #00E5C7)', height: '100%', width: `${progress}%`, transition: 'width 1s linear' }} />
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 24 }}>
              Your instance is provisioning.<br/>This takes about 90 seconds.
            </p>
          </div>
        )}

        {status === 'ready' && session && (
          <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
            
            {/* Left Hand Canvas */}
            <div style={{ width: '50%', background: '#0A0A0F', borderRight: '0.5px solid #1E1E30', position: 'relative' }} className="hidden lg:block relative">
              <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                fitView
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={24} size={1} color="#1E1E30" variant={BackgroundVariant.Dots} />
              </ReactFlow>
            </div>

            {/* Right Hand Credentials Panel */}
            <div style={{ width: '100%', maxWidth: '100%', background: '#0D0D14', padding: '48px 40px' }} className="lg:w-1/2 overflow-y-auto">
              <div style={{ maxWidth: 460, margin: '0 auto' }}>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E5C7', display: 'block' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#00E5C7', textTransform: 'uppercase' }}>Live</span>
                </div>

                <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F4F4F8', marginBottom: 6 }}>
                  Your sandbox is running
                </h1>
                
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#F59E0B', marginBottom: 32 }}>
                  Expires in <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>{expiresInStr}</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                  {/* URL */}
                  <div style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>URL</span>
                      <a href={session.n8n_url || '#'} target="_blank" rel="noreferrer" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#00E5C7', textDecoration: 'none' }}>
                        {session.n8n_url?.replace('https://', '')}
                      </a>
                    </div>
                    <button 
                      onClick={() => handleCopy(session.n8n_url || '', 'url')}
                      style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
                    >
                      {copiedField === 'url' ? <Check size={16} color="#00E5C7" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Username */}
                  <div style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>Username</span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#F4F4F8' }}>{session.n8n_username}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(session.n8n_username || '', 'user')}
                      style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
                    >
                      {copiedField === 'user' ? <Check size={16} color="#00E5C7" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Password */}
                  <div style={{ background: '#13131F', border: '0.5px solid #1E1E30', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>Password</span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#F4F4F8' }}>
                        {showPassword ? session.n8n_password : '••••••••••••'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        onClick={() => handleCopy(session.n8n_password || '', 'pass')}
                        style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
                      >
                        {copiedField === 'pass' ? <Check size={16} color="#00E5C7" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <button 
                    onClick={() => window.open(session.n8n_url || '', '_blank')}
                    style={{ width: '100%', height: 48, background: '#00E5C7', color: '#0A0A0F', border: 'none', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                  >
                    Open n8n
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ width: '100%', background: 'transparent', color: '#9CA3AF', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, cursor: 'pointer', textAlign: 'center' }}
                  >
                    Go to Dashboard
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: '"Syne", sans-serif', fontSize: 24, fontWeight: 700, color: '#F4F4F8', marginBottom: 12 }}>Setup failed.</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9CA3AF' }}>Your payment was captured. Email hello@n8ngalaxy.com.</span>
          </div>
        )}

        {status === 'timeout' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: '"Syne", sans-serif', fontSize: 24, fontWeight: 700, color: '#F4F4F8', marginBottom: 12 }}>Taking longer than expected.</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9CA3AF' }}>Check your email.</span>
          </div>
        )}

      </main>
    </div>
  );
}

import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { SandboxSession } from '../types'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Check
} from 'lucide-react'

type Status = 'polling' | 'ready' | 'failed' | 'timeout'

export default function SandboxSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<Status>('polling')
  const [session, setSession] = useState<SandboxSession | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Redirect if no session ID
  useEffect(() => {
    if (!sessionId) {
      navigate('/sandbox')
    }
  }, [sessionId, navigate])

  // Progress bar animation
  useEffect(() => {
    if (status === 'polling') {
      const timer = setTimeout(() => {
        setProgress(95)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [status])

  // Polling logic
  useEffect(() => {
    if (!sessionId || status !== 'polling') return

    let pollCount = 0
    const maxPolls = 60 // 3 minutes at 3s intervals

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('sandbox_sessions')
          .select('*')
          .eq('id', sessionId)
          .single()

        if (error) {
          console.error('Error fetching session:', error)
          return
        }

        const sessionData = data as unknown as SandboxSession

        if (sessionData.status === 'active') {
          setSession(sessionData)
          setStatus('ready')
          clearInterval(interval)
        } else if (sessionData.status === 'failed') {
          setStatus('failed')
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }

      pollCount++
      if (pollCount >= maxPolls) {
        setStatus('timeout')
        clearInterval(interval)
      }
    }

    const interval = setInterval(poll, 3000)
    poll() // Initial poll

    return () => clearInterval(interval)
  }, [sessionId, status])

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D14] text-[#F4F4F8]">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {status === 'polling' && (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="w-16 h-16 text-[#7C3AED] animate-spin" />
            <h1 className="font-display font-extrabold text-[28px] text-[#F4F4F8] mt-6 leading-tight">
              Spinning up your instance
            </h1>
            <p className="font-sans font-normal text-[16px] text-[#9CA3AF] mt-3 max-w-[400px]">
              This takes about 90 seconds. Don't close this tab.
            </p>
            
            <div className="mt-8 bg-[#13131F] rounded-full h-2 w-80 overflow-hidden">
              <div 
                className="h-full bg-[#7C3AED] transition-all duration-[90000ms] ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-sans font-normal text-[13px] text-[#6B7280] mt-4 italic">
              Waiting for payment confirmation...
            </p>
          </div>
        )}

        {status === 'ready' && session && (
          <div className="w-full max-w-[520px] bg-[#13131F] border border-[#1E1E30] rounded-[12px] p-10 flex flex-col items-center mt-16 mb-24 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-[#00E5C7] mb-4" />
            <h1 className="font-display font-extrabold text-[32px] text-[#F4F4F8] text-center leading-tight">
              Your sandbox is ready!
            </h1>
            <p className="font-sans font-normal text-[14px] text-[#9CA3AF] mt-2 mb-8 text-center">
              Credentials also sent to your email.
            </p>

            <div className="w-full space-y-3">
              {/* URL */}
              <div className="bg-[#0D0D14] border border-[#1E1E30] rounded-[8px] p-4 flex justify-between items-center group">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[11px] font-sans font-bold text-[#6B7280] uppercase tracking-wider">Instance URL</span>
                  <span className="font-mono text-[13px] text-[#00E5C7] truncate pr-4">{session.n8n_url}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => handleCopy(session.n8n_url || '', 'url')}
                    className="h-8 px-2 flex items-center justify-center text-[#6B7280] hover:text-[#F4F4F8] transition-colors"
                  >
                    {copiedField === 'url' ? <Check size={14} className="text-[#00E5C7]" /> : <Copy size={14} />}
                  </button>
                  <button 
                    onClick={() => window.open(session.n8n_url || '', '_blank')}
                    className="h-8 px-2 flex items-center justify-center text-[#6B7280] hover:text-[#F4F4F8] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className="bg-[#0D0D14] border border-[#1E1E30] rounded-[8px] p-4 flex justify-between items-center">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[11px] font-sans font-bold text-[#6B7280] uppercase tracking-wider">Username</span>
                  <span className="font-mono text-[13px] text-[#F4F4F8] truncate pr-4">{session.n8n_username}</span>
                </div>
                <button 
                  onClick={() => handleCopy(session.n8n_username || '', 'user')}
                  className="h-8 px-2 flex items-center justify-center text-[#6B7280] hover:text-[#F4F4F8] transition-colors shrink-0"
                >
                  {copiedField === 'user' ? <Check size={14} className="text-[#00E5C7]" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Password */}
              <div className="bg-[#0D0D14] border border-[#1E1E30] rounded-[8px] p-4 flex justify-between items-center">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[11px] font-sans font-bold text-[#6B7280] uppercase tracking-wider">Password</span>
                  <span className="font-mono text-[13px] text-[#F4F4F8] truncate pr-4">
                    {showPassword ? session.n8n_password : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 px-2 flex items-center justify-center text-[#6B7280] hover:text-[#F4F4F8] transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button 
                    onClick={() => handleCopy(session.n8n_password || '', 'pass')}
                    className="h-8 px-2 flex items-center justify-center text-[#6B7280] hover:text-[#F4F4F8] transition-colors"
                  >
                    {copiedField === 'pass' ? <Check size={14} className="text-[#00E5C7]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[#F59E0B]">
              <Clock size={14} />
              <span className="font-sans font-normal text-[13px]">
                Expires {new Date(session.expires_at).toLocaleString()}
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => window.open(session.n8n_url || '', '_blank')}
                className="flex-1 h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[8px] font-sans font-semibold text-[15px] transition-colors flex items-center justify-center px-8"
              >
                Open n8n
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-11 bg-transparent border border-[#1E1E30] hover:border-[#7C3AED] text-[#9CA3AF] hover:text-[#F4F4F8] rounded-[8px] font-sans font-medium text-[15px] transition-all px-6"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
            <AlertCircle className="w-12 h-12 text-[#EF4444]" />
            <h1 className="font-display font-extrabold text-[24px] text-[#F4F4F8] mt-4">
              Setup failed
            </h1>
            <div className="mt-3 space-y-1">
              <p className="font-sans font-normal text-[14px] text-[#9CA3AF]">
                Something went wrong provisioning your instance.
              </p>
              <p className="font-sans font-normal text-[14px] text-[#9CA3AF]">
                Your payment was captured. Please contact support@n8ngalaxy.com
              </p>
            </div>
            <button 
              onClick={() => navigate('/sandbox')}
              className="mt-8 h-10 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[8px] font-sans font-semibold text-[14px] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'timeout' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
            <Clock className="w-12 h-12 text-[#F59E0B]" />
            <h1 className="font-display font-extrabold text-[24px] text-[#F4F4F8] mt-4">
              Taking longer than expected
            </h1>
            <div className="mt-3 space-y-1">
              <p className="font-sans font-normal text-[14px] text-[#9CA3AF]">
                Your instance is still being set up. Check your email for credentials.
              </p>
              <p className="font-sans font-normal text-[14px] text-[#9CA3AF]">
                Check your email
              </p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-8 h-10 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[8px] font-sans font-semibold text-[14px] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

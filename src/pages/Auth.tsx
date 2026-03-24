import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignIn) {
        await signInWithEmail(email, password);
      } else {
        if (!fullName.trim()) throw new Error('Full name is required');
        await signUpWithEmail(email, password, fullName);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // Google Auth handles the redirect
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Auth');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      <NavLink 
        to="/" 
        className="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-2 flex items-center justify-center"
      >
        <ArrowLeft size={24} />
      </NavLink>

      <div className="w-full max-w-[400px] bg-surface border border-border rounded-card p-10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <span className="font-sans font-medium text-text-secondary text-xl">n8n</span>
            <span className="font-display font-extrabold text-primary text-xl">Galaxy</span>
          </div>
          <p className="font-sans font-normal text-[13px] text-text-tertiary">
            The n8n ecosystem hub
          </p>
        </div>

        <div className="flex w-full mb-8 border-b border-border">
          <button
            onClick={() => { setIsSignIn(true); setError(null); }}
            className={`flex-1 pb-3 text-[14px] transition-colors cursor-pointer border-b-2 ${
              isSignIn 
                ? 'font-sans font-medium text-text-primary border-primary' 
                : 'font-sans font-normal text-text-secondary border-transparent'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignIn(false); setError(null); }}
            className={`flex-1 pb-3 text-[14px] transition-colors cursor-pointer border-b-2 ${
              !isSignIn 
                ? 'font-sans font-medium text-text-primary border-primary' 
                : 'font-sans font-normal text-text-secondary border-transparent'
            }`}
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full h-[44px] mb-6 bg-[#1E1E30] hover:bg-[#2A2A3E] border border-[#2A2A3E] text-text-primary font-sans font-medium text-[14px] rounded-input transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-text-tertiary text-[12px] font-sans font-normal">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-[13px] text-text-secondary">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[44px] bg-background border border-border rounded-input px-[14px] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
                required={!isSignIn}
              />
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-[13px] text-text-secondary">Email</label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] bg-background border border-border rounded-input px-[14px] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans font-medium text-[13px] text-text-secondary">Password</label>
              {isSignIn && (
                <a href="#" className="font-sans font-normal text-[13px] text-primary hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] bg-background border border-border rounded-input px-[14px] text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
              required
            />
            {!isSignIn && (
              <span className="font-sans font-normal text-[12px] text-text-tertiary">
                8+ characters
              </span>
            )}
          </div>

          {error && <p className="text-danger text-[13px] font-sans pt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] mt-2 bg-primary hover:bg-primary-hover text-white font-sans font-medium text-[14px] rounded-input transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isSignIn ? (
            <span className="font-sans font-normal text-[13px] text-text-secondary">
              Don't have an account?{' '}
              <button onClick={() => setIsSignIn(false)} className="text-primary hover:underline cursor-pointer">
                Sign up
              </button>
            </span>
          ) : (
            <span className="font-sans font-normal text-[13px] text-text-secondary">
              Already have an account?{' '}
              <button onClick={() => setIsSignIn(true)} className="text-primary hover:underline cursor-pointer">
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Auth');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[400px] bg-surface border border-border rounded-card p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-primary tracking-tight">
            n8nGalaxy
          </h1>
        </div>

        <div className="flex w-full mb-6 border-b border-border">
          <button
            onClick={() => { setIsSignIn(true); setError(null); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              isSignIn 
                ? 'text-primary border-primary' 
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignIn(false); setError(null); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              !isSignIn 
                ? 'text-primary border-primary' 
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[44px] bg-background border border-border rounded-input px-4 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
                required={!isSignIn}
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] bg-background border border-border rounded-input px-4 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] bg-background border border-border rounded-input px-4 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors font-sans"
              required
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] bg-primary hover:bg-primary-hover text-white font-medium rounded-input transition-colors disabled:opacity-50 flex items-center justify-center font-sans tracking-wide"
          >
            {loading ? 'Processing...' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-text-tertiary text-sm font-sans">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full h-[44px] bg-surface hover:bg-border border border-border text-text-primary font-medium rounded-input transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

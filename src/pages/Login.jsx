import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Auth view states (SignUp vs SignIn)
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Google popup authentication failed. Please ensure popup blockers are disabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const { error: signUpErr } = await signUpWithEmail(email, password);
        if (signUpErr) throw signUpErr;
        setSuccess('Account created! Check your email for confirmation or sign in directly.');
        setIsSignUp(false);
      } else {
        const { error: signInErr } = await loginWithEmail(email, password);
        if (signInErr) throw signInErr;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-surface via-surface-container-low to-surface-container flex flex-col justify-center items-center px-6 py-12 select-none animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant p-8 rounded-3xl shadow-xl text-center flex flex-col items-center">
        
        {/* Logo Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
          <span className="material-symbols-outlined text-[32px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
        </div>

        {/* Title */}
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-1">StudyTrack</h1>
        <h2 className="font-headline text-sm font-medium text-on-surface-variant mb-6 uppercase tracking-wider">Academic Clarity System</h2>

        {/* Status Alerts */}
        {error && (
          <div className="w-full mb-4 p-3 rounded-xl bg-error-container text-on-error-container font-mono text-[11px] text-left border border-error/10 animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="w-full mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-[11px] text-left border border-emerald-200 animate-fade-in">
            {success}
          </div>
        )}

        {/* Email Login Form */}
        <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
          <div className="text-left">
            <label className="block font-mono text-[11px] text-on-surface-variant mb-1 ml-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface text-sm transition-all"
            />
          </div>

          <div className="text-left">
            <label className="block font-mono text-[11px] text-on-surface-variant mb-1 ml-1 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface text-sm transition-all"
            />
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-mono text-label-md hover:bg-primary/95 transition-all active:scale-[0.98] shadow-md cursor-pointer mt-2"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              className="font-mono text-[11px] text-primary hover:underline cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>

        {/* Divider line */}
        <div className="relative my-6 w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40"></div>
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/70">
            Or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 border border-outline-variant hover:border-primary/45 rounded-2xl flex items-center justify-center gap-3 font-mono text-label-md text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98] shadow-sm cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
              Loading...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path 
                  fill="#EA4335" 
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.137 4.2a5.86 5.86 0 0 1-5.877-5.86 5.86 5.86 0 0 1 5.877-5.86c1.378 0 2.623.49 3.593 1.42l3.11-3.11c-2.1-1.95-4.87-3.14-8.08-3.14A10.22 10.22 0 0 0 2 12.23a10.22 10.22 0 0 0 10.24 10.23c5.52 0 9.87-3.87 9.87-9.88 0-.6-.08-1.22-.22-1.785z"
                />
              </svg>
              Google Account
            </>
          )}
        </button>

      </div>
    </div>
  );
}

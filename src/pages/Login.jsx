import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, loginAsGuest } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Auth view states (SignUp vs SignIn)
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const { error: signUpErr } = await signUpWithEmail(email, password, { full_name: fullName });
        if (signUpErr) throw signUpErr;
        setSuccess('Account created! Check your email to verify or sign in directly.');
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 select-none animate-fade-in">
      
      {/* Left Panel: Assignify Dark Indigo Hero (PDF Page 1 & 2) */}
      <div className="w-full md:w-1/2 bg-[#1e1b4b] text-white p-8 md:p-16 flex flex-col justify-center items-center text-center md:items-start md:text-left relative overflow-hidden min-h-[240px] md:min-h-screen">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Assignify
          </h1>
          <p className="font-body text-base md:text-xl text-purple-200 font-light leading-relaxed">
            Stay on top of every deadline, in one place.
          </p>
        </div>
      </div>

      {/* Right Panel: Auth Form Card (PDF Page 1 & 2) */}
      <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-left">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-slate-900">
              {isSignUp ? 'Create your account' : 'Sign in to get started'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {isSignUp ? 'Enter your details below to build your profile' : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 animate-fade-in">
              {success}
            </div>
          )}

          {/* Form Container */}
          <form onSubmit={handleEmailSubmit} autoComplete="off" className="bg-slate-100/70 p-6 rounded-2xl border border-slate-200 space-y-4">
            
            {isSignUp && (
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 text-sm"
                />
              </div>
            )}

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 text-sm"
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 text-sm"
              />
            </div>

            {isSignUp && (
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 text-sm"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} className="text-purple-600 hover:underline font-medium">
                  Forgot Password
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Toggle between Sign In and Create Account */}
          <div className="text-center text-xs text-slate-600">
            {isSignUp ? (
              <span>Already have an account? {' '}
                <button onClick={() => { setIsSignUp(false); setError(''); }} className="text-purple-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
                  Sign in
                </button>
              </span>
            ) : (
              <span>Not a member? {' '}
                <button onClick={() => { setIsSignUp(true); setError(''); }} className="text-purple-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
                  Create an account
                </button>
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm border border-slate-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Quick Demo Student Mode Button */}
          <div className="pt-2">
            <button
              onClick={() => loginAsGuest()}
              type="button"
              className="w-full py-3 px-4 bg-[#231f5c] hover:bg-purple-900 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-base">rocket_launch</span>
              <span>Explore as Demo Student (Guest)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}


import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail, 
    resetPasswordForEmail, 
    updateUserPassword,
    isPasswordRecovery,
    setIsPasswordRecovery,
    setCurrentView 
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Auth view mode: 'signin' | 'signup' | 'forgot' | 'recovery'
  const [authMode, setAuthMode] = useState(() => {
    return (isPasswordRecovery || window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) ? 'recovery' : 'signin';
  });

  useEffect(() => {
    if (isPasswordRecovery || window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
      setAuthMode('recovery');
    }
  }, [isPasswordRecovery]);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address to receive reset instructions.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error: resetErr } = await resetPasswordForEmail(email);
      if (resetErr) throw resetErr;
      setSuccess(`Password reset email sent to ${email}! Please check your inbox and click the link to reset your password.`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email. Please verify your address.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNewPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (updateUserPassword) {
        await updateUserPassword(newPassword);
      }
      setSuccess('Your password has been successfully updated! Redirecting...');
      setTimeout(() => {
        setIsPasswordRecovery(false);
        setAuthMode('signin');
        setCurrentView('dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update password. Please try requesting a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (authMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (authMode === 'signup') {
        const { error: signUpErr } = await signUpWithEmail(email, password, { full_name: fullName });
        if (signUpErr) throw signUpErr;
        setSuccess('Account created! Check your email to verify or sign in directly.');
        setAuthMode('signin');
      } else {
        const { error: signInErr } = await loginWithEmail(email, password);
        if (signInErr) throw signInErr;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 select-none animate-fade-in">
      
      {/* Left Showcase Hero Panel */}
      <div className="w-full md:w-5/12 bg-slate-900 text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-screen text-left">
        {/* Top Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer relative z-10"
        >
          <div className="w-9 h-9 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-sm shadow-md">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <span className="font-heading font-extrabold text-xl text-white tracking-tight">Scholar</span>
        </div>

        {/* Center Quote / Pitch */}
        <div className="relative z-10 max-w-md my-auto space-y-4 py-8">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 text-blue-300 border border-white/10">
            Student Operating System
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Structure your coursework. Elevate your GPA.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All your syllabus requirements, project milestones, and exam dates synchronized with live Supabase cloud storage.
          </p>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 text-[11px] text-slate-400 font-mono">
          <span>Protected by Supabase Auth & Row Level Security</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-7/12 p-6 sm:p-12 md:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 text-left">
          
          {/* Header depending on mode */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              {isPasswordRecovery || authMode === 'recovery'
                ? 'Set New Password'
                : authMode === 'forgot'
                ? 'Reset your password'
                : authMode === 'signup'
                ? 'Create your Scholar account'
                : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isPasswordRecovery || authMode === 'recovery'
                ? 'Enter your new secure password below.'
                : authMode === 'forgot'
                ? 'Enter your email address and we will send you instructions to reset your password.'
                : authMode === 'signup'
                ? 'Enter your student details below to create an account.'
                : 'Sign in to access your course dashboard and deliverables.'}
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* VIEW 1: RECOVERY / SET NEW PASSWORD */}
          {(isPasswordRecovery || authMode === 'recovery') ? (
            <form onSubmit={handleUpdateNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update & Save Password'}
              </button>
            </form>
          ) : authMode === 'forgot' ? (
            /* VIEW 2: FORGOT PASSWORD REQUEST FORM */
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send Password Reset Email'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); setSuccess(''); }}
                  className="text-xs text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          ) : (
            /* VIEW 3: STANDARD SIGN IN & SIGN UP */
            <>
              {/* Social Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm border border-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">or with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University / Personal Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {authMode === 'signin' && (
                  <div className="flex items-center justify-between text-xs py-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setError(''); setSuccess(''); }}
                      className="text-blue-600 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Processing...' : authMode === 'signup' ? 'Create Scholar Account' : 'Sign In to Workspace'}
                </button>
              </form>

              {/* Toggle between Sign In and Sign Up */}
              <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
                {authMode === 'signup' ? (
                  <span>Already have an account? {' '}
                    <button onClick={() => { setAuthMode('signin'); setError(''); }} className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
                      Sign in here
                    </button>
                  </span>
                ) : (
                  <span>New to Scholar? {' '}
                    <button onClick={() => { setAuthMode('signup'); setError(''); }} className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer">
                      Create an account
                    </button>
                  </span>
                )}
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}

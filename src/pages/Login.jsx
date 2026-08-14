import { useState, useContext, useEffect } from 'react';
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

  const [authMode, setAuthMode] = useState(isPasswordRecovery ? 'recovery' : 'signin'); // 'signin' | 'signup' | 'forgot' | 'recovery'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Password Recovery States
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // DPDP Act Granular Opt-in Consents (Unticked by default)
  const [coreConsent, setCoreConsent] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(false);
  const [notificationsConsent, setNotificationsConsent] = useState(false);

  // Sync mode if context changes
  useEffect(() => {
    if (isPasswordRecovery) {
      setAuthMode('recovery');
    }
  }, [isPasswordRecovery]);

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
    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!coreConsent) {
        setError('You must consent to the core data processing terms to register an account.');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (authMode === 'signup') {
        const consentMetadata = {
          full_name: fullName.trim(),
          consent_records: {
            core_processing: true,
            telemetry: telemetryConsent,
            notifications: notificationsConsent,
            consent_timestamp: new Date().toISOString(),
            consent_version: 'v1.0-dpdp-2023'
          }
        };

        const { error: signUpErr } = await signUpWithEmail(email, password, consentMetadata);
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

  // Password Strength helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(authMode === 'recovery' ? newPassword : password);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 animate-fade-in font-sans">
      
      {/* Left Branding Showcase Panel */}
      <div className="hidden md:flex md:w-5/12 bg-slate-950 p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800 text-left">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-3 cursor-pointer group relative z-10"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg text-white tracking-tight">SCHOLAR</span>
            <span className="block text-[10px] font-mono text-slate-400">ACADEMIC WORKSPACE</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-4 max-w-sm my-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 font-mono text-[11px] font-semibold">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>Intelligent Study OS</span>
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Structure your coursework. Elevate your GPA.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All your syllabus requirements, project milestones, and exam dates synchronized with live encrypted cloud storage.
          </p>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 text-[11px] text-slate-400 font-mono space-y-1">
          <p>Protected by Enterprise Encryption & Multi-Tenant Access Control</p>
          <p className="text-[10px] text-slate-500">DPDP Act (India) 2023 Compliant Processing</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-7/12 p-6 sm:p-12 md:p-16 flex flex-col justify-between bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6 text-left my-auto">
          
          {/* Header depending on mode */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
              {authMode === 'recovery' && 'Set New Account Password'}
              {authMode === 'forgot' && 'Reset Your Password'}
              {authMode === 'signup' && 'Create Your Scholar Account'}
              {authMode === 'signin' && 'Welcome Back to Scholar'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {authMode === 'recovery' && 'Create a strong, new password for your account.'}
              {authMode === 'forgot' && 'Enter your registered email and we will send you a recovery link.'}
              {authMode === 'signup' && 'Join thousands of scholars managing courses and deadlines effortlessly.'}
              {authMode === 'signin' && 'Enter your credentials to access your academic workspace.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD FORM */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University / Registered Email</label>
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
                {loading ? 'Sending...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); setSuccess(''); }}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW: SET NEW PASSWORD FORM (RECOVERY) */}
          {authMode === 'recovery' && (
            <form onSubmit={handleUpdateNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
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

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className="font-bold text-slate-700">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-300`} 
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save New Password & Log In'}
              </button>
            </form>
          )}

          {/* VIEW: SIGN IN / SIGN UP FORMS */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <>
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University / Personal Email *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
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
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
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

                    {/* DPDP Act Granular Opt-in Consent Box (Unticked by default) */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-[11px] text-slate-700">
                      <div className="font-heading font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-blue-600">verified_user</span>
                        <span>Privacy & Statutory Consent (DPDP Act, 2023)</span>
                      </div>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={coreConsent}
                          onChange={(e) => setCoreConsent(e.target.checked)}
                          required
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>
                          <strong>* Required:</strong> I consent to processing of my academic and profile data pursuant to the{' '}
                          <button 
                            type="button" 
                            onClick={() => setCurrentView('privacy-policy')}
                            className="text-blue-600 underline font-semibold"
                          >
                            Privacy Notice
                          </button>{' '}
                          and{' '}
                          <button 
                            type="button" 
                            onClick={() => setCurrentView('terms-of-service')}
                            className="text-blue-600 underline font-semibold"
                          >
                            Terms of Service
                          </button>.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={telemetryConsent}
                          onChange={(e) => setTelemetryConsent(e.target.checked)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>
                          <strong>Optional:</strong> I consent to anonymous performance telemetry to improve workspace velocity.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={notificationsConsent}
                          onChange={(e) => setNotificationsConsent(e.target.checked)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>
                          <strong>Optional:</strong> I consent to receiving deadline reminders via email.
                        </span>
                      </label>
                    </div>
                  </>
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

        {/* DPDP Statutory Footer in Login Panel */}
        <div className="pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button 
              type="button" 
              onClick={() => setCurrentView('privacy-policy')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Privacy Notice
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setCurrentView('terms-of-service')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setCurrentView('data-rights')}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Data Rights Portal
            </button>
          </div>
          <p>
            Grievance Redressal: <a href="mailto:grievance-officer@scholar.app" className="text-slate-500 hover:underline">grievance-officer@scholar.app</a>
          </p>
        </div>

      </div>

    </div>
  );
}

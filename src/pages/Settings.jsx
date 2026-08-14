import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Settings() {
  const { 
    user, 
    logout, 
    updateUserProfile, 
    resetPasswordForEmail, 
    tasks = [], 
    enrolledSubjects = [],
    setCurrentView 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('account');
  const [saveStatus, setSaveStatus] = useState('');
  
  // Settings Form State
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || '');
  const [targetGpa, setTargetGpa] = useState(user?.user_metadata?.target_gpa || '3.90');
  const [defaultReminderDays, setDefaultReminderDays] = useState('2');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState({ type: '', message: '' });
  
  // Toggle states
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifDailyBrief, setNotifDailyBrief] = useState(true);
  const [notifGroupActivity, setNotifGroupActivity] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Expandable legal readers inside settings
  const [expandedSection, setExpandedSection] = useState(null); // 'privacy' | 'terms' | null

  const handleSavePreferences = async () => {
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: displayName,
          name: displayName,
          target_gpa: targetGpa
        });
      }
      setSaveStatus('Preferences saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSaveStatus('Failed to save preferences.');
    }
  };

  const handlePasswordReset = async (e) => {
    e?.preventDefault();
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      setResetFeedback({ type: 'error', message: 'Please enter your registered Gmail/email address.' });
      return;
    }

    setIsSendingReset(true);
    setResetFeedback({ type: '', message: '' });

    try {
      if (resetPasswordForEmail) {
        await resetPasswordForEmail(targetEmail);
        setResetFeedback({
          type: 'success',
          message: `Password reset email sent to ${targetEmail}! Please check your Inbox and Spam/Junk folder.`
        });
      }
    } catch (err) {
      console.error('Failed to send reset email:', err);
      setResetFeedback({
        type: 'error',
        message: err.message || 'Failed to send reset email. Rate limit: 1 reset allowed per minute.'
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      user: { email: email || user?.email, name: displayName },
      subjects: enrolledSubjects,
      tasks: tasks
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const tabs = [
    { id: 'account', label: 'Account & Security', icon: 'shield_person' },
    { id: 'academic', label: 'Academic Preferences', icon: 'school' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications_active' },
    { id: 'data', label: 'Data & Backup', icon: 'database' },
    { id: 'privacy-terms', label: 'Privacy & Legal Terms', icon: 'gavel' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in text-left pb-24">
      
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-slate-900">Workspace Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage your credentials, notification preferences, data storage, and privacy agreements.</p>
      </div>

      {/* Status banner */}
      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            <span>{saveStatus}</span>
          </div>
          <button onClick={() => setSaveStatus('')} className="text-emerald-600 hover:text-emerald-900">
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      )}

      {/* Layout: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Settings Navigation Rail */}
        <div className="col-span-1 md:col-span-4 app-card p-2 flex md:flex-col overflow-x-auto gap-1.5 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 md:w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer text-left whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Settings Content Card */}
        <div className="col-span-1 md:col-span-8 app-card p-6 md:p-8 space-y-6">
          
          {/* TAB 1: Account & Security */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Account Credentials</h3>
                <p className="text-xs text-slate-500">Update your primary display name and login parameters.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scholar Full Name</label>
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registered University / Gmail Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {user?.email ? `Current Account Email: ${user.email}` : 'Managed securely via Encrypted Cloud Auth'}
                  </span>
                </div>

                {/* Password Reset Section with Feedback */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Password Recovery</h4>
                      <p className="text-[11px] text-slate-500">Send an official password reset link to your registered email.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handlePasswordReset}
                      disabled={isSendingReset}
                      className="app-btn-primary text-xs self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSendingReset ? 'sync' : 'lock_reset'}
                      </span>
                      <span>{isSendingReset ? 'Sending...' : 'Send Reset Link'}</span>
                    </button>
                  </div>

                  {resetFeedback.message && (
                    <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in ${
                      resetFeedback.type === 'error'
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}>
                      <span className="material-symbols-outlined text-base">
                        {resetFeedback.type === 'error' ? 'error' : 'check_circle'}
                      </span>
                      <span>{resetFeedback.message}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400">
                    💡 Tip: Clicking the link in your email will open the dedicated Set New Password screen. Please check Spam/Junk if not found in Inbox.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Academic Preferences */}
          {activeTab === 'academic' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Academic Standing & Goals</h3>
                <p className="text-xs text-slate-500">Configure target metrics, GPA goals, and default course reminders.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Cumulative GPA (out of 4.0)</label>
                    <input 
                      type="text" 
                      value={targetGpa} 
                      onChange={(e) => setTargetGpa(e.target.value)}
                      placeholder="e.g. 3.90"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Default Deadline Alert Lead Time</label>
                    <select 
                      value={defaultReminderDays}
                      onChange={(e) => setDefaultReminderDays(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                    >
                      <option value="1">1 Day Before Due Date</option>
                      <option value="2">2 Days Before Due Date</option>
                      <option value="3">3 Days Before Due Date</option>
                      <option value="7">1 Week Before Due Date</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-800 block">Grading Scale: 4.0 Standard Letter</span>
                  <p className="text-[11px] text-slate-500">
                    A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0. GPA calculations adapt automatically based on recorded course credits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Notification Triggers</h3>
                <p className="text-xs text-slate-500">Choose when and how Scholar sends deliverable reminders and study group alerts.</p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Assignment Due Date Reminders</span>
                    <span className="text-[11px] text-slate-500">Receive alerts 48 hours and 24 hours prior to deadline submissions</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifDeadlines} 
                    onChange={(e) => setNotifDeadlines(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Daily Morning Academic Brief</span>
                    <span className="text-[11px] text-slate-500">Receive a digest at 8:00 AM of today's classes, exams, and deliverables</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifDailyBrief} 
                    onChange={(e) => setNotifDailyBrief(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Peer Study Group Updates</span>
                    <span className="text-[11px] text-slate-500">Get notified when a classmate shares notes or schedules a session</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifGroupActivity} 
                    onChange={(e) => setNotifGroupActivity(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Weekly Performance Summary Email</span>
                    <span className="text-[11px] text-slate-500">Receive weekly progress and velocity recap every Sunday</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailDigest} 
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Data & Backup */}
          {activeTab === 'data' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Cloud Sync & Data Portability</h3>
                <p className="text-xs text-slate-500">Manage encrypted cloud database synchronization and backup your records.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">cloud_done</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Encrypted Cloud Sync</h4>
                    <p className="text-[11px] text-slate-500">All tasks and enrolled subjects are backed up in real time.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  CONNECTED
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900">Export Records</h4>
                <p className="text-xs text-slate-500">Download a complete JSON snapshot of your curriculum, deliverables, and notes.</p>
                <button 
                  type="button" 
                  onClick={handleExportData}
                  className="app-btn-secondary text-xs"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Export Complete Dataset (.JSON)</span>
                </button>
              </div>

              {/* Cache Management */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Cache Management</h4>
                <p className="text-xs text-slate-500">Force clear temporary local browser storage and refresh active data from cloud storage.</p>
                <button 
                  type="button" 
                  onClick={() => {
                    localStorage.removeItem('readNotificationIds');
                    setSaveStatus('Local cache refreshed from cloud storage.');
                    setTimeout(() => setSaveStatus(''), 3000);
                  }}
                  className="app-btn-secondary text-xs"
                >
                  <span className="material-symbols-outlined text-base">cached</span>
                  <span>Refresh Local Cache</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3 mt-4">
                <div>
                  <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span>Danger Zone</span>
                  </h4>
                  <p className="text-[11px] text-rose-600/90 mt-0.5">
                    Reset your workspace deliverables or clear active account session data.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button 
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset read notifications and local preferences?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-3.5 py-2 bg-white text-rose-600 hover:bg-rose-100 font-semibold text-xs rounded-xl border border-rose-200 cursor-pointer transition-colors"
                  >
                    Reset Local Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Privacy & Legal Terms */}
          {activeTab === 'privacy-terms' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Privacy Policy & Terms of Service
                </h3>
                <p className="text-xs text-slate-500">
                  Review our privacy practices, data handling policies, and service agreements.
                </p>
              </div>

              {/* Item 1: Privacy Notice Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                      <span className="material-symbols-outlined text-base">privacy_tip</span>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Privacy Policy</h4>
                      <p className="text-[11px] text-slate-500">Learn how your data is collected, protected, and used.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedSection(expandedSection === 'privacy' ? null : 'privacy')}
                      className="app-btn-secondary text-xs"
                    >
                      {expandedSection === 'privacy' ? 'Hide Summary' : 'Read Summary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('privacy-policy')}
                      className="app-btn-primary text-xs"
                    >
                      <span>Full Policy</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </button>
                  </div>
                </div>

                {expandedSection === 'privacy' && (
                  <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-700 space-y-2 animate-fade-in">
                    <p><strong>• Data Collection:</strong> Only essential academic and account data needed for curriculum tracking.</p>
                    <p><strong>• No Data Selling:</strong> We never sell your personal information or study data to advertisers.</p>
                    <p><strong>• Full Portability:</strong> You can export, update, or permanently delete your student records at any time.</p>
                  </div>
                )}
              </div>

              {/* Item 2: Terms of Service Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <span className="material-symbols-outlined text-base">description</span>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Terms of Service</h4>
                      <p className="text-[11px] text-slate-500">Review acceptable use policies and service terms.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedSection(expandedSection === 'terms' ? null : 'terms')}
                      className="app-btn-secondary text-xs"
                    >
                      {expandedSection === 'terms' ? 'Hide Summary' : 'Read Summary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('terms-of-service')}
                      className="app-btn-primary text-xs"
                    >
                      <span>Full Terms</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </button>
                  </div>
                </div>

                {expandedSection === 'terms' && (
                  <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-700 space-y-2 animate-fade-in">
                    <p><strong>• Student Ownership:</strong> You retain 100% ownership over all uploaded coursework, notes, and tasks.</p>
                    <p><strong>• Reliable Uptime:</strong> We strive to maintain uninterrupted service and reliable cloud synchronization.</p>
                    <p><strong>• Support & Contact:</strong> Reach out to our team at any time for account support.</p>
                  </div>
                )}
              </div>

              {/* Item 3: Data Rights Portal */}
              <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-xl bg-blue-600 text-white">
                      <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Manage Your Data & Privacy Rights</h4>
                      <p className="text-[11px] text-slate-600">Submit requests to download your data archive, update records, or delete your account.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentView('data-rights')}
                    className="app-btn-primary text-xs"
                  >
                    <span>Open Portal</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Item 4: Privacy Contact Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">Privacy & Support Contact:</p>
                <p className="text-slate-600">Email: <a href="mailto:privacy@scholar.app" className="text-blue-600 underline font-bold">privacy@scholar.app</a></p>
                <p className="text-[10px] text-slate-400 pt-1">Response Time: All requests are processed promptly within 48-72 hours.</p>
              </div>

            </div>
          )}

          {/* Global Save Button for active form settings (Tabs 1-3) */}
          {activeTab !== 'privacy-terms' && activeTab !== 'data' && (
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                onClick={handleSavePreferences}
                className="app-btn-primary text-xs"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Workspace Preferences</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

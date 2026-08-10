import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Settings() {
  const { 
    user, 
    logout, 
    theme, 
    setTheme, 
    subjects, 
    setCurrentView,
    notificationsEnabled,
    toggleNotifications
  } = useContext(AppContext);

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  // Helper for dynamic user avatar
  const renderAvatar = () => {
    const avatarCleared = user?.user_metadata?.avatar_cleared;
    const avatarUrl = !avatarCleared && (user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.photoURL);
    if (avatarUrl) {
      return (
        <img 
          alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'user profile'} 
          className="w-24 h-24 rounded-full border-4 border-surface-container object-cover" 
          src={avatarUrl}
        />
      );
    }
    const nameToUse = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User';
    const initial = nameToUse ? nameToUse[0].toUpperCase() : 'G';
    return (
      <div className="w-24 h-24 rounded-full border-4 border-surface-container bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-3xl">
        {initial}
      </div>
    );
  };

  const activeSubjectsCount = subjects.filter(s => s.pendingCount > 0).length;

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-margin-mobile py-8 text-left pb-24">
      {/* Top Header Row (Back & Title) */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('dashboard')}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">arrow_back</span>
        </button>
        <h2 className="font-headline text-headline-md font-bold text-primary">Settings</h2>
      </header>

      {/* Profile Header */}
      <section className="py-6 flex flex-col items-center text-center border-b border-outline-variant mb-6">
        <div className="relative mb-4">
          {renderAvatar()}
          <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-surface cursor-pointer hover:scale-105 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-white text-[16px]">edit</span>
          </div>
        </div>
        
        <h3 className="font-headline text-headline-sm font-bold text-on-surface">
          {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User'}
        </h3>
        <p className="font-body text-body-sm text-on-surface-variant mt-1">
          {user?.email || 'guest@studytrack.demo'}
        </p>
        <p className="font-body text-[11px] text-on-surface-variant/70 mt-0.5">
          {user?.user_metadata?.major && user?.user_metadata?.year 
            ? `${user.user_metadata.major} • ${user.user_metadata.year}` 
            : user?.user_metadata?.major || user?.user_metadata?.year || 'Academic Profile'}
        </p>

        <button 
          onClick={() => setCurrentView('profile')}
          className="mt-4 px-6 py-2 rounded-full border border-outline font-mono text-label-md text-primary hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
        >
          View Profile
        </button>
      </section>

      {/* Account Section */}
      <div className="mb-6">
        <h4 className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider mb-2 ml-2">Account</h4>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-outline-variant">
          <div>
            <div 
              onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">person</span>
                <div>
                  <p className="font-body text-body-md font-semibold text-on-surface">Personal Information</p>
                  <p className="font-body text-body-sm text-on-surface-variant">Email</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">
                {showPersonalInfo ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {showPersonalInfo && (
              <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 space-y-4 text-left">
                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Email (Account)</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-high text-on-surface-variant opacity-75 cursor-not-allowed text-sm font-body"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Academic Preferences */}
      {(user?.user_metadata?.year || user?.user_metadata?.major || user?.user_metadata?.gpa || activeSubjectsCount > 0) && (
        <div className="mb-6">
          <h4 className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider mb-2 ml-2">Academic</h4>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-outline-variant">
            {user?.user_metadata?.year && (
              <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">calendar_today</span>
                  <div>
                    <p className="font-body text-body-md font-semibold text-on-surface">Academic Year</p>
                    <p className="font-body text-body-sm text-on-surface-variant">{user.user_metadata.year}</p>
                  </div>
                </div>
              </div>
            )}

            {user?.user_metadata?.major && (
              <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">school</span>
                  <div>
                    <p className="font-body text-body-md font-semibold text-on-surface">Major</p>
                    <p className="font-body text-body-sm text-on-surface-variant">{user.user_metadata.major}</p>
                  </div>
                </div>
              </div>
            )}

            {user?.user_metadata?.gpa && (
              <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">insights</span>
                  <div>
                    <p className="font-body text-body-md font-semibold text-on-surface">GPA</p>
                    <p className="font-body text-body-sm text-on-surface-variant">{user.user_metadata.gpa}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group" onClick={() => setCurrentView('subjects')}>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">auto_stories</span>
                <div>
                  <p className="font-body text-body-md font-semibold text-on-surface">Course Load</p>
                  <p className="font-body text-body-sm text-on-surface-variant">{activeSubjectsCount} Active Subjects</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </div>
      )}

      {/* App Preferences */}
      <div className="mb-6">
        <h4 className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider mb-2 ml-2">App Preferences</h4>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-outline-variant">
          {/* Deadline Reminders Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
              <div>
                <p className="font-body text-body-md font-semibold text-on-surface">Deadline Reminders</p>
                <p className="font-body text-body-sm text-on-surface-variant">24h & 1h before due</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={notificationsEnabled}
                onChange={toggleNotifications}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                notificationsEnabled ? 'bg-primary' : 'bg-outline-variant'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </div>
            </label>
          </div>

          {/* Theme Switcher */}
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-on-surface-variant">palette</span>
              <p className="font-body text-body-md font-semibold text-on-surface">Appearance</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                  theme === 'light' 
                    ? 'border-primary bg-surface-container-low text-primary' 
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">light_mode</span>
                <span className="font-mono text-[11px]">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-primary bg-surface-container-low text-primary font-bold' 
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">dark_mode</span>
                <span className="font-mono text-[11px]">Dark</span>
              </button>
              
              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer ${
                  theme === 'system' 
                    ? 'border-primary bg-surface-container-low text-primary font-bold' 
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">settings_brightness</span>
                <span className="font-mono text-[11px]">System</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-8">
        <h4 className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider mb-2 ml-2">Support & About</h4>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-outline-variant">
          <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">info</span>
              <p className="font-body text-body-md font-semibold text-on-surface">About StudyTrack</p>
            </div>
            <p className="font-mono text-label-md text-outline">v2.4.0</p>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button 
        onClick={logout}
        className="w-full py-4 rounded-xl border border-error text-error font-headline text-headline-sm font-bold hover:bg-error-container/10 active:scale-[0.98] transition-all cursor-pointer text-center"
      >
        Sign Out
      </button>

      <p className="text-center mt-6 font-body text-body-sm text-on-surface-variant/40 italic">
        Designed for Academic Excellence
      </p>

    </div>
  );
}

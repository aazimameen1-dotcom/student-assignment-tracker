import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navigation() {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    logout,
    notificationsEnabled,
    notifications,
    readNotificationIds,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedTaskId
  } = useContext(AppContext);

  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationsDropdown(false);
      }
    }
    if (showNotificationsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationsDropdown]);

  const unreadNotifications = notifications.filter(n => !readNotificationIds.includes(n.id));
  const hasUnread = unreadNotifications.length > 0;

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { view: 'tasks', label: 'Tasks', icon: 'assignment' },
    { view: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { view: 'subjects', label: 'Subjects', icon: 'category' }
  ];

  // Helper for dynamic user avatar
  const renderAvatar = () => {
    const avatarCleared = user?.user_metadata?.avatar_cleared;
    const avatarUrl = !avatarCleared && (user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.photoURL);
    if (avatarUrl) {
      return (
        <img 
          alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'user profile'} 
          className="w-full h-full object-cover" 
          src={avatarUrl}
        />
      );
    }
    // Fallback letter avatar
    const nameToUse = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest User';
    const initial = nameToUse ? nameToUse[0].toUpperCase() : 'G';
    return (
      <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
        {initial}
      </div>
    );
  };

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentView('profile')}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-outline-variant cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            {renderAvatar()}
          </div>
          <div className="cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-primary leading-none">StudyTrack</h1>
            {user && (
              <span className="hidden md:inline font-mono text-[9px] text-on-surface-variant opacity-60">
                {user.email}
              </span>
            )}
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors relative cursor-pointer"
            >
              notifications
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-error border border-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 py-3 text-left overflow-hidden animate-fade-in">
                <div className="px-4 py-2 border-b border-outline-variant/30 flex justify-between items-center">
                  <h4 className="font-headline text-body-md font-bold text-on-surface">Notifications</h4>
                  {hasUnread && (
                    <button 
                      onClick={() => markAllNotificationsAsRead(unreadNotifications.map(n => n.id))}
                      className="font-mono text-[10px] text-primary hover:underline font-bold bg-transparent border-none cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/15">
                  {!notificationsEnabled ? (
                    <div className="p-4 text-center text-on-surface-variant italic font-body text-body-sm">
                      Deadline reminders are currently disabled. You can enable them in Settings.
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-on-surface-variant italic font-body text-body-sm">
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map(n => {
                      const isUnread = !readNotificationIds.includes(n.id);
                      
                      const typeIcons = {
                        warning: 'warning',
                        error: 'error',
                        info: 'info'
                      };
                      const typeColors = {
                        warning: 'text-amber-500',
                        error: 'text-error',
                        info: 'text-primary'
                      };

                      return (
                        <div 
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.taskId) {
                              setSelectedTaskId(n.taskId);
                              setCurrentView('assignment-details');
                            }
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 items-start relative ${
                            isUnread ? 'bg-surface-container/20' : ''
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[20px] mt-0.5 ${typeColors[n.type] || 'text-on-surface-variant'}`}>
                            {typeIcons[n.type] || 'notifications'}
                          </span>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <p className={`font-body text-body-sm leading-tight text-on-surface ${isUnread ? 'font-bold' : ''}`}>
                                {n.title}
                              </p>
                              {isUnread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                              )}
                            </div>
                            <p className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-normal">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Button */}
          <button 
            onClick={() => setCurrentView('settings')}
            title="Settings"
            className={`material-symbols-outlined p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 cursor-pointer ${
              currentView === 'settings' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            settings
          </button>

          {/* Sign Out Button in Header */}
          <button 
            onClick={logout}
            title="Sign Out"
            className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container text-error hover:text-red-700 transition-colors active:scale-95 cursor-pointer"
          >
            logout
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 ml-4">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`font-mono text-label-md transition-colors cursor-pointer ${
                  currentView === item.view 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Slim Desktop Sidebar Navigation (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-20 flex-col items-center py-8 bg-surface border-r border-outline-variant space-y-6 z-35">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'tasks' && currentView === 'assignment-details');
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              title={item.label}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container shadow-sm scale-105' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </button>
          );
        })}
        
        {/* Logout at bottom of desktop rail */}
        <div className="mt-auto space-y-4">
          <button 
            onClick={logout}
            className="p-3 text-error hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[24px]">logout</span>
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              currentView === 'settings' 
                ? 'bg-primary-container text-on-primary-container shadow-sm scale-105' 
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
            title="Settings"
          >
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentView === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
          </button>
        </div>
      </aside>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 pb-safe border-t border-outline-variant bg-surface h-16 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'tasks' && currentView === 'assignment-details');
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 cursor-pointer transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-mono text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

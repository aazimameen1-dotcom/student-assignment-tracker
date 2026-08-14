import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navigation() {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    logout,
    notifications = [],
    readNotificationIds = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedTaskId,
    setSelectedSubjectKey,
    tasks = [],
    enrolledSubjects = []
  } = useContext(AppContext);

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotificationsDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !readNotificationIds.includes(n.id));
  const hasUnread = unreadNotifications.length > 0;

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { view: 'subjects', label: 'Courses', icon: 'auto_stories' },
    { view: 'tasks', label: 'Tasks & Deadlines', icon: 'checklist' },
    { view: 'projects', label: 'Projects', icon: 'folder_open' },
    { view: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { view: 'analytics', label: 'Analytics', icon: 'insights' },
    { view: 'study-groups', label: 'Study Groups', icon: 'groups' },
    { view: 'research', label: 'Research Papers', icon: 'menu_book' }
  ];

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'subjects': return 'Enrolled Courses';
      case 'tasks': return 'Tasks & Deadlines';
      case 'projects': return 'Academic Projects';
      case 'assignment-details': return 'Project Workspace';
      case 'calendar': return 'Academic Calendar';
      case 'analytics': return 'Performance Analytics';
      case 'study-groups': return 'Peer Study Groups';
      case 'research': return 'Research Discovery';
      case 'profile': return 'Scholar Profile';
      case 'settings': return 'Account Settings';
      case 'privacy-policy': return 'Privacy Policy';
      case 'terms-of-service': return 'Terms of Service';
      case 'data-rights': return 'Data Privacy Portal';
      default: return 'Scholar Workspace';
    }
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.photoURL || localStorage.getItem('user_avatar');
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Alex Morgan';
  const userInitial = userName[0]?.toUpperCase() || 'A';
  const avatarUrl = getAvatarUrl();

  const handleNavClick = (view) => {
    setCurrentView(view);
    setShowMobileDrawer(false);
  };

  return (
    <>
      {/* Modern Fixed Top Utility Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-nav z-30 flex items-center justify-between px-3 sm:px-6 md:px-8 md:pl-72 transition-all">
        {/* Left Side: Mobile Hamburger + Brand / Page Title */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowMobileDrawer(true)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm md:hidden">
              S
            </div>
            <span className="font-heading font-bold text-sm text-slate-900 md:hidden">Scholar</span>
          </div>

          <div className="hidden md:block">
            <h1 className="font-heading font-bold text-lg text-slate-900 tracking-tight">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="relative max-w-md w-full mx-4 hidden sm:block" ref={searchRef}>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search assignments, courses, papers..." 
              className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs border border-transparent focus:border-slate-300 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Live Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-11 left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase font-mono">Tasks</div>
              {tasks.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject?.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                <div 
                  key={t.id}
                  onClick={() => {
                    setSelectedTaskId(t.id);
                    setCurrentView('assignment-details');
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500">{t.subject} • Due {t.dueDate}</p>
                  </div>
                  <span className="material-symbols-outlined text-xs text-slate-400">arrow_forward</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Notifications & User Avatar Profile Button */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-left">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-slate-900">Notifications ({unreadNotifications.length})</span>
                  {hasUnread && (
                    <button 
                      onClick={() => markAllNotificationsAsRead(unreadNotifications.map(n => n.id))}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No new alerts</div>
                  ) : (
                    notifications.map(n => (
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
                        className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 items-start"
                      >
                        <span className="material-symbols-outlined text-blue-600 text-base mt-0.5">info</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Trigger */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 sm:pl-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{userName}</p>
                <p className="text-[10px] text-slate-500 font-mono">Scholar</p>
              </div>

              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in text-left">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'student@scholar.app'}</p>
                </div>
                
                <button 
                  onClick={() => { setCurrentView('profile'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  <span>Your Profile</span>
                </button>

                <button 
                  onClick={() => { setCurrentView('settings'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">settings</span>
                  <span>Settings & Preferences</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button 
                  onClick={() => { setShowUserMenu(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modern Left Sidebar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 glass-sidebar z-40 flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          {/* App Brand Header */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 px-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base text-slate-900 tracking-tight leading-tight">SCHOLAR</h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">ACADEMIC TRACKER</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view || (item.view === 'subjects' && currentView === 'assignment-details');
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Links (Profile & Settings) */}
        <div className="space-y-1 pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentView('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              currentView === 'profile' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            <span>Profile</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              currentView === 'settings' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Accessible from Top Left Hamburger) */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setShowMobileDrawer(false)} 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    S
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900">SCHOLAR</h3>
                    <p className="text-[10px] font-mono text-slate-400">STUDENT OS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {/* Navigation List */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = currentView === item.view || (item.view === 'subjects' && currentView === 'assignment-details');
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer text-left ${
                        isActive 
                          ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Bottom Section */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  currentView === 'profile' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Profile</span>
              </button>

              <button
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  currentView === 'settings' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-base">settings</span>
                <span>Settings</span>
              </button>

              <button
                onClick={() => { setShowMobileDrawer(false); logout(); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (5 Core Actions) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-nav z-40 flex items-center justify-around px-2 border-t border-slate-200/80">
        {[
          { view: 'dashboard', label: 'Home', icon: 'grid_view' },
          { view: 'tasks', label: 'Tasks', icon: 'checklist' },
          { view: 'projects', label: 'Projects', icon: 'folder_open' },
          { view: 'calendar', label: 'Calendar', icon: 'calendar_today' },
          { view: 'analytics', label: 'Stats', icon: 'insights' }
        ].map((item) => {
          const isActive = currentView === item.view || (item.view === 'tasks' && currentView === 'assignment-details');
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-slate-900 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

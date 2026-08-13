import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navigation() {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    logout,
    notifications,
    readNotificationIds,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedTaskId,
    setSelectedSubjectKey,
    tasks = [],
    enrolledSubjects = []
  } = useContext(AppContext);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
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

  // Determine title badge text based on currentView
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'profile':
        return 'Your Profile';
      case 'subjects':
      case 'courses':
        return 'Courses Overview';
      case 'tasks':
        return 'Tasks & Deliverables';
      case 'assignment-details':
      case 'projects':
        return 'Projects Tracking';
      case 'analytics':
        return 'Performance Analytics';
      case 'calendar':
        return 'Academic Calendar';
      case 'study-groups':
        return 'Study Groups';
      case 'research':
        return 'Research Discovery';
      case 'settings':
        return 'Settings';
      default:
        return 'Scholar Tracker';
    }
  };

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { view: 'subjects', label: 'Courses Overview', icon: 'school' },
    { view: 'tasks', label: 'Tasks', icon: 'assignment' },
    { view: 'assignment-details', label: 'Projects', icon: 'account_tree' },
    { view: 'analytics', label: 'Analytics', icon: 'analytics' },
    { view: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { view: 'study-groups', label: 'Study Groups', icon: 'groups' },
    { view: 'research', label: 'Research Discovery', icon: 'biotech' },
    { view: 'profile', label: 'Profile', icon: 'person' },
    { view: 'settings', label: 'Settings', icon: 'settings' }
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
    const nameToUse = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Alex Morgan';
    const initial = nameToUse ? nameToUse[0].toUpperCase() : 'A';
    return (
      <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
        {initial}
      </div>
    );
  };

  const handleBackNav = () => {
    if (currentView === 'dashboard') return;
    if (currentView === 'assignment-details') {
      setCurrentView('subjects');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <>
      {/* Assignify Header Bar (Exact PDF design: #231f5c indigo bar) */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-[#231f5c] text-white shadow-md flex items-center justify-between px-4 md:px-8">
        
        {/* Left Side: Hamburger Menu + Back Arrow + Title Badge */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDrawer(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white flex items-center justify-center"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>

          {currentView !== 'dashboard' && (
            <button 
              onClick={handleBackNav}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white flex items-center justify-center"
              title="Go Back"
              aria-label="Go Back to Previous Page"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          {/* White Pill Badge showing Page Title */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="bg-white text-[#231f5c] px-4 py-1.5 rounded-xl font-headline font-bold text-sm md:text-base shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {getHeaderTitle()}
          </div>
        </div>

        {/* Center / Search bar with live results dropdown */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6 relative">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-300 text-sm">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search subjects, assignments..."
              className="w-full pl-9 pr-8 py-1.5 bg-white/10 text-white placeholder-slate-300 rounded-xl text-xs focus:outline-none focus:bg-white/20 transition-all border border-white/10"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}
                className="absolute right-2.5 top-2 text-slate-300 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-10 left-0 w-full bg-white text-slate-800 rounded-2xl shadow-2xl z-50 p-2 border border-slate-200 text-left animate-fade-in max-h-80 overflow-y-auto">
              {/* Tasks Results */}
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase font-mono">Assignments</div>
              {tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <p className="px-3 py-1.5 text-xs text-slate-400 italic">No matching tasks</p>
              ) : (
                tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                  <div 
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setCurrentView('assignment-details');
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="p-2 hover:bg-purple-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.title}</p>
                      <p className="text-[10px] text-slate-500">{t.subject} • {t.timeLeft}</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-purple-600">chevron_right</span>
                  </div>
                ))
              )}

              {/* Subjects Results */}
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase font-mono mt-2 border-t border-slate-100 pt-2">Subjects</div>
              {enrolledSubjects.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <p className="px-3 py-1.5 text-xs text-slate-400 italic">No matching subjects</p>
              ) : (
                enrolledSubjects.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                  <div 
                    key={s.code}
                    onClick={() => {
                      if (setSelectedSubjectKey) {
                        const keyMap = {
                          'DIC107T': 'web-design',
                          'DIC102C': 'python',
                          'DIC105E': 'disaster-management',
                          'DIC110H': 'global-literature',
                          'DIC102S': 'physics',
                          'DIC103M': 'mathematics'
                        };
                        setSelectedSubjectKey(keyMap[s.code] || 'web-design');
                      }
                      setCurrentView('subjects');
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="p-2 hover:bg-purple-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-500">{s.code}</p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-purple-600">chevron_right</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Side: Notifications + Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative cursor-pointer text-white flex items-center"
              title="Notifications"
              aria-label="Toggle Notifications Menu"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-[#231f5c] animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl z-50 py-3 text-left border border-slate-200 overflow-hidden animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-headline text-sm font-bold text-slate-900">Notifications</h4>
                  {hasUnread && (
                    <button 
                      onClick={() => markAllNotificationsAsRead(unreadNotifications.map(n => n.id))}
                      className="text-[11px] text-purple-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs italic">
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map(n => {
                      const isUnread = !readNotificationIds.includes(n.id);
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
                          className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                            isUnread ? 'bg-purple-50/50' : ''
                          }`}
                        >
                          <span className="material-symbols-outlined text-purple-600 text-lg mt-0.5">info</span>
                          <div className="flex-1">
                            <p className={`text-xs text-slate-900 ${isUnread ? 'font-bold' : ''}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setCurrentView('profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 cursor-pointer hover:border-white transition-all shadow-sm"
            title="View Profile"
          >
            {renderAvatar()}
          </div>
        </div>
      </header>

      {/* Slide-out Drawer Navigation Menu */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDrawer(false)}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative w-72 max-w-[80%] bg-[#231f5c] text-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                  {renderAvatar()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {user?.user_metadata?.full_name || 'Alex Morgan'}
                  </h3>
                  <p className="text-[11px] text-purple-200 opacity-80">{user?.user_metadata?.student_id || 'STU102938'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = currentView === item.view || (item.view === 'subjects' && currentView === 'assignment-details');
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setShowDrawer(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-purple-600 text-white font-bold shadow-md' 
                        : 'text-purple-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setShowDrawer(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slim Desktop Sidebar Rail (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-16 flex-col items-center py-6 bg-[#231f5c] text-white border-r border-white/10 space-y-5 z-35 shadow-sm">
        {navItems.slice(0, 5).map((item) => {
          const isActive = currentView === item.view || (item.view === 'subjects' && currentView === 'assignment-details');
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              title={item.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-md scale-105' 
                  : 'text-purple-200/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            </button>
          );
        })}

        <div className="mt-auto space-y-3">
          <button 
            onClick={() => setCurrentView('settings')}
            title="Settings"
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'settings' ? 'bg-purple-600 text-white' : 'text-purple-200/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 border-t border-slate-200 bg-[#231f5c] text-white h-16 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const isActive = currentView === item.view || (item.view === 'subjects' && currentView === 'assignment-details');
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer transition-colors ${
                isActive ? 'text-white font-bold' : 'text-purple-300/70'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-[10px] mt-0.5 leading-none">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}


import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { 
    tasks, 
    subjects, 
    setCurrentView, 
    setSelectedTaskId, 
    addTask,
    addSubject,
    user
  } = useContext(AppContext);

  const [showLogToast, setShowLogToast] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubColor, setNewSubColor] = useState('blue');

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Guest';
    const firstName = fullName.split(' ')[0];
    if (hour < 12) return `Good morning, ${firstName}.`;
    if (hour < 18) return `Good afternoon, ${firstName}.`;
    return `Good evening, ${firstName}.`;
  };

  // Dynamic stats
  const incompleteTasksThisWeek = tasks.filter(t => t.category === 'This Week' && t.status !== 'completed');
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const weeklyCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Get next 3 upcoming deadlines (incomplete tasks)
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'completed')
    .slice(0, 3);

  const handleDailyLog = () => {
    setShowLogToast(true);
    setTimeout(() => setShowLogToast(false), 3000);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName || !newSubCode) return;
    addSubject({
      name: newSubName,
      code: newSubCode,
      desc: newSubDesc,
      color: newSubColor
    });
    setNewSubName('');
    setNewSubCode('');
    setNewSubDesc('');
    setNewSubColor('blue');
    setShowSubjectModal(false);
  };

  const viewTaskDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setCurrentView('assignment-details');
  };

  return (
    <div className="animate-fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8">
      
      {/* Toast Notification for Daily Log */}
      {showLogToast && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-lg font-mono text-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          Daily productivity log submitted!
        </div>
      )}

      {/* Header Section */}
      <section className="mb-10 text-left">
        <p className="font-mono text-label-md text-primary mb-2 uppercase tracking-wide">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 className="font-headline text-headline-lg font-bold text-on-surface">{getGreeting()}</h2>
        <p className="font-body text-body-md text-on-surface-variant mt-1">
          You have {incompleteTasksThisWeek.length} deadlines approaching this week. Stay focused.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="bento-grid">
        
        {/* Weekly Progress Card (Asymmetric Large) */}
        <div className="col-span-1 md:col-span-4 glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <h3 className="font-headline text-headline-sm mb-6 font-semibold">Weekly Goal</h3>
          
          <div className="relative w-44 h-44 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle 
                className="text-surface-container-highest" 
                cx="18" 
                cy="18" 
                fill="transparent" 
                r="15.915" 
                stroke="currentColor" 
                strokeWidth="2.5"
              />
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="18" 
                cy="18" 
                fill="transparent" 
                r="15.915" 
                stroke="currentColor" 
                strokeDasharray={`${weeklyCompletionRate} ${100 - weeklyCompletionRate}`} 
                strokeDashoffset="0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-headline-lg font-bold text-primary">{weeklyCompletionRate}%</span>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Completed</span>
            </div>
          </div>
          
          <p className="font-body text-body-sm text-on-surface-variant">
            {completedTasksCount} of {totalTasksCount} tasks completed overall
          </p>
          <button 
            onClick={handleDailyLog}
            className="mt-6 w-full py-3 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            Complete Daily Log
          </button>
        </div>

        {/* Upcoming Deadlines (High Density) */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline text-headline-sm font-semibold">At a Glance</h3>
            <button 
              onClick={() => setCurrentView('tasks')}
              className="font-mono text-label-md text-primary flex items-center gap-1 hover:underline cursor-pointer"
            >
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((task) => {
              const daysLeft = task.timeLeft;
              const isUrgent = daysLeft.toLowerCase().includes('left') || daysLeft.toLowerCase().includes('tomorrow') || daysLeft.toLowerCase().includes('today');

              return (
                <div 
                  key={task.id}
                  onClick={() => viewTaskDetails(task.id)}
                  className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:border-primary/40 transition-colors cursor-pointer group"
                >
                  {/* Calendar Widget in Card */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border ${
                    isUrgent 
                      ? 'bg-error-container/20 border-error-container/40 text-error' 
                      : 'bg-surface-container-highest border-outline-variant text-on-surface'
                  }`}>
                    <span className="font-mono text-[10px] font-bold uppercase">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="font-headline text-headline-sm font-bold">
                      {new Date(task.dueDate).getDate()}
                    </span>
                  </div>

                  {/* Task details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-mono rounded uppercase border border-outline-variant">
                        {task.subject}
                      </span>
                      {isUrgent ? (
                        <span className="font-mono text-[10px] text-error font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">alarm</span> 
                          {task.timeLeft}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-on-surface-variant">
                          {task.timeLeft}
                        </span>
                      )}
                    </div>
                    <h4 className="font-body text-body-md font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                  </div>

                  <span className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
                    chevron_right
                  </span>
                </div>
              );
            })
          ) : (
            <div className="glass-card p-8 rounded-2xl text-center text-on-surface-variant flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-primary">verified</span>
              <p className="font-body text-body-md font-medium">All caught up! No pending deadlines.</p>
            </div>
          )}
        </div>

        {/* Subject Quick Links */}
        <div className="col-span-1 md:col-span-12 text-left">
          <h3 className="font-headline text-headline-sm mb-4 font-semibold">My Subjects</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.slice(0, 3).map((sub) => (
              <div 
                key={sub.code}
                onClick={() => setCurrentView('subjects')}
                className="glass-card p-6 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-primary-container/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">
                    {sub.code.startsWith('CS') ? 'code' : sub.code.startsWith('MATH') ? 'calculate' : sub.code.startsWith('HIST') ? 'history_edu' : 'trending_up'}
                  </span>
                </div>
                <h4 className="font-body text-body-md font-bold mb-1 truncate">{sub.code}</h4>
                <p className="font-body text-body-sm text-on-surface-variant">{sub.pendingCount} Active Tasks</p>
              </div>
            ))}

            {/* Add Subject quick card */}
            <div 
              onClick={() => setShowSubjectModal(true)}
              className="glass-card p-6 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer flex flex-col justify-center border-dashed border-2 border-outline-variant"
            >
              <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center mb-4 text-outline group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">add</span>
              </div>
              <h4 className="font-body text-body-md font-bold mb-1 text-outline">Add Subject</h4>
              <p className="font-body text-body-sm text-outline">New semester?</p>
            </div>
          </div>
        </div>

      </div>

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold">Add New Subject</h3>
              <button 
                onClick={() => setShowSubjectModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Subject Code *</label>
                <input 
                  type="text" 
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g. ECON 302"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Subject Name *</label>
                <input 
                  type="text" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Intermediate Macroeconomics"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Description</label>
                <input 
                  type="text" 
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  placeholder="e.g. Analysis of monetary policies"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Theme Accent Color</label>
                <select 
                  value={newSubColor}
                  onChange={(e) => setNewSubColor(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary"
                >
                  <option value="blue">Blue (Corporate-Modern)</option>
                  <option value="indigo">Indigo (Technical-Focus)</option>
                  <option value="purple">Purple (Creative-Reflection)</option>
                  <option value="emerald">Emerald (Goal-Velocity)</option>
                  <option value="slate">Slate (Metadata-Neutral)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="flex-1 py-3 border border-outline text-on-surface rounded-lg font-mono text-label-md hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

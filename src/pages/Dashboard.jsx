import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { 
    user, 
    tasks = [], 
    enrolledSubjects = [], 
    setCurrentView, 
    setSelectedTaskId, 
    updateTaskMilestone 
  } = useContext(AppContext);

  // Quick Scratchpad note synced with localStorage
  const [quickNote, setQuickNote] = useState(() => {
    return localStorage.getItem('scholar_scratchpad_notes') || '';
  });

  const handleNoteChange = (e) => {
    setQuickNote(e.target.value);
    localStorage.setItem('scholar_scratchpad_notes', e.target.value);
  };

  // Dynamic Date Greeting
  const now = new Date();
  const currentHour = now.getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const formattedToday = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Scholar';

  // Dynamic Workspace Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

  // Urgent deliverables due in next 48 hours or overdue
  const urgentTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((taskDate - todayDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  });

  const totalMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.length : 0), 0);
  const completedMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.filter(m => m.completed).length : 0), 0);
  const milestoneVelocity = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 80;

  const targetGpa = user?.user_metadata?.target_gpa || '3.85';

  const getSubjectBadgeStyle = (code) => {
    if (!code) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  // Mini Calendar generation for current month
  const currentMonthDays = [];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOffset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // Monday start
  
  for (let i = 0; i < firstDayOffset; i++) {
    currentMonthDays.push({ num: '', isCurrent: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasDeadline = tasks.some(t => t.dueDate === dStr && t.status !== 'completed');
    currentMonthDays.push({
      num: d,
      dateStr: dStr,
      isToday: d === now.getDate(),
      isCurrent: true,
      hasDeadline
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8 animate-fade-in text-left pb-24">
      
      {/* Top Welcome & Horizon Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider block mb-1">
            {formattedToday}
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have <span className="font-semibold text-slate-900">{pendingTasks.length} active deliverables</span> across {enrolledSubjects.length} enrolled modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('tasks')}
            className="app-btn-primary text-xs"
          >
            <span className="material-symbols-outlined text-sm">add_task</span>
            <span>New Task</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('calendar')}
            className="app-btn-secondary text-xs"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row (Minimal Frosted Glass) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Progress Gauge */}
        <div className="app-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Deliverables
            </span>
            <div className="font-heading text-2xl font-bold text-slate-900">{overallProgress}%</div>
            <span className="text-[11px] text-slate-500 block">
              {completedTasks} of {totalTasks} cleared
            </span>
          </div>

          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 transition-all duration-1000 ease-out"
                strokeDasharray={`${overallProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-slate-800">
              {completedTasks}
            </span>
          </div>
        </div>

        {/* Target GPA */}
        <div className="app-card p-5 space-y-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Target GPA
            </span>
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-sm">school</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-slate-900">{targetGpa}</div>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold mt-0.5 block">
              Cumulative Standing
            </span>
          </div>
        </div>

        {/* Urgent Deadlines */}
        <div className="app-card p-5 space-y-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Urgent (<span className="text-rose-500">48h</span>)
            </span>
            <span className="p-1 rounded-md bg-rose-50 text-rose-600">
              <span className="material-symbols-outlined text-sm">alarm</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-slate-900">{urgentTasks.length}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {urgentTasks.length > 0 ? 'Action required soon' : 'All caught up'}
            </span>
          </div>
        </div>

        {/* Milestone Velocity */}
        <div className="app-card p-5 space-y-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Velocity
            </span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-slate-900">{milestoneVelocity}%</div>
            <span className="text-[11px] font-mono text-blue-600 font-semibold mt-0.5 block">
              {completedMilestones}/{totalMilestones} checkpoints
            </span>
          </div>
        </div>

      </div>

      {/* Main Split Layout: Active Deliverables & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Deliverables Feed (8 Cols) */}
        <div className="lg:col-span-8 app-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">Active Deliverables</h2>
              <p className="text-xs text-slate-500">Priority assignments ordered by submission deadline.</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('tasks')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({totalTasks})</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 5).map((task) => {
                const completedM = task.milestones ? task.milestones.filter(m => m.completed).length : 0;
                const totalM = task.milestones ? task.milestones.length : 0;
                const progress = task.progress !== undefined ? task.progress : 0;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                            {task.subject}
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-rose-600 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">event</span>
                            <span>{task.dueDate}</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {task.dueTime}
                          </span>
                        </div>
                        <h3
                          onClick={() => {
                            setSelectedTaskId(task.id);
                            setCurrentView('assignment-details');
                          }}
                          className="font-heading text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {task.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setCurrentView('assignment-details');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-700 font-semibold p-1"
                      >
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                      </button>
                    </div>

                    {/* Milestone checkoffs */}
                    {task.milestones && task.milestones.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Milestones ({completedM}/{totalM})</span>
                          <span className="font-bold text-slate-700">{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {task.milestones.slice(0, 2).map((m) => (
                            <label key={m.id} className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer truncate">
                              <input
                                type="checkbox"
                                checked={m.completed}
                                onChange={(e) => updateTaskMilestone(task.id, m.id, e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3"
                              />
                              <span className={m.completed ? 'line-through text-slate-400' : ''}>{m.title}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-slate-200/60 space-y-2">
                <span className="material-symbols-outlined text-3xl text-slate-300">task_alt</span>
                <p className="text-xs text-slate-500 font-medium">All active coursework completed!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Calendar & Academic Scratchpad (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dynamic Mini Calendar */}
          <div className="app-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-heading text-xs font-bold text-slate-900">
                {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setCurrentView('calendar')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Open Calendar →
              </button>
            </div>

            <div className="grid grid-cols-7 text-center font-mono text-[10px] font-bold text-slate-400 pb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {currentMonthDays.map((d, i) => (
                <div
                  key={i}
                  className={`h-7 flex flex-col items-center justify-center rounded-lg text-[11px] relative transition-all ${
                    d.isToday
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : d.isCurrent
                      ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'text-transparent'
                  }`}
                >
                  <span>{d.num}</span>
                  {d.hasDeadline && !d.isToday && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-600"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Academic Scratchpad (Persistent Notes) */}
          <div className="app-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-slate-600">edit_note</span>
                <h3 className="font-heading text-xs font-bold text-slate-900">Academic Scratchpad</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Auto-saved</span>
            </div>

            <textarea
              rows={4}
              value={quickNote}
              onChange={handleNoteChange}
              placeholder="Jot down quick lecture takeaways, formula notes, or thesis ideas..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

        </div>

      </div>

    </div>
  );
}

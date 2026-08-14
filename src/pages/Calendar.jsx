import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Calendar() {
  const { 
    tasks = [], 
    addTask, 
    updateTaskMilestone,
    enrolledSubjects = [],
    selectedDate, 
    setSelectedDate, 
    setCurrentView, 
    setSelectedTaskId 
  } = useContext(AppContext);

  // Active View Mode: 'month' | 'week' | 'agenda'
  const [viewMode, setViewMode] = useState('month');

  // Month navigation state
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      }
    }
    return new Date();
  });

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(enrolledSubjects[0]?.code || 'CS101');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [profName, setProfName] = useState('');
  const [profHours, setProfHours] = useState('');
  const [milestonesList, setMilestonesList] = useState([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // Real today's date formatted YYYY-MM-DD
  const realToday = new Date();
  const realTodayStr = `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthTitle = `${monthNames[currentMonth]} ${currentYear}`;

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleTodayJump = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(realTodayStr);
  };

  // Generate Calendar Grid Days (Monday start)
  const generateCalendarDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
    const mondayBasedFirstDay = (firstDayIndex + 6) % 7; // 0 is Mon, 6 is Sun
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // 1. Previous month trailing days
    for (let i = mondayBasedFirstDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        num: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === realTodayStr
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        num: d,
        isCurrentMonth: true,
        isToday: dateStr === realTodayStr
      });
    }

    // 3. Next month leading days to complete grid (multiples of 7)
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remainingDays; d++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        num: d,
        isCurrentMonth: false,
        isToday: dateStr === realTodayStr
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Tasks for the selected date
  const activeSelectedDate = selectedDate || realTodayStr;
  const selectedDayTasks = tasks.filter(t => t.dueDate === activeSelectedDate);

  // Color mapping helper
  const getSubjectBadgeStyle = (code) => {
    if (!code) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (code.startsWith('PHYS') || code.startsWith('CHEM')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getSubjectDotColor = (code) => {
    if (!code) return 'bg-slate-400';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-600';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-600';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-500';
    if (code.startsWith('PHYS') || code.startsWith('CHEM')) return 'bg-purple-600';
    return 'bg-slate-500';
  };

  // Format date helper
  const formatFriendlyDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short', year: 'numeric' });
  };

  // Add Task Milestone
  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    setMilestonesList(prev => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: newMilestoneTitle.trim(),
        completed: false
      }
    ]);
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id) => {
    setMilestonesList(prev => prev.filter(m => m.id !== id));
  };

  // Submit new task from Calendar
  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate time left relative to today
    const taskDate = new Date(activeSelectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));

    let timeLeft = `${diffDays} Days Left`;
    if (diffDays === 0) timeLeft = 'Due Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';

    let category = 'Later';
    if (diffDays <= 7 && diffDays >= 0) category = 'This Week';
    else if (diffDays <= 14 && diffDays > 7) category = 'Next Week';

    await addTask({
      title: title.trim(),
      subject: subject || (enrolledSubjects[0]?.code || 'CS101'),
      description: description.trim() || 'Scheduled via Calendar workspace.',
      dueDate: activeSelectedDate,
      dueTime,
      category,
      timeLeft,
      professor: {
        name: profName.trim() || 'Faculty Instructor',
        officeHours: profHours.trim() || 'Mon/Wed 2-4 PM'
      },
      milestones: milestonesList.length > 0 ? milestonesList : [
        { id: 'm1', title: 'Prepare deliverables & outline', completed: false },
        { id: 'm2', title: 'Finalize submission', completed: false }
      ]
    });

    setTitle('');
    setDescription('');
    setProfName('');
    setProfHours('');
    setMilestonesList([]);
    setShowAddModal(false);
  };

  // Sort upcoming agenda tasks
  const agendaTasks = [...tasks].sort((a, b) => {
    const da = a.dueDate || '9999';
    const db = b.dueDate || '9999';
    return da.localeCompare(db);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-24">
      
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-700 text-2xl">calendar_month</span>
            <span>Academic Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive syllabus calendar with milestone deadlines and scheduled deliverables.
          </p>
        </div>

        {/* View Switcher & Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Today Button */}
          <button
            type="button"
            onClick={handleTodayJump}
            className="app-btn-secondary text-xs"
          >
            <span className="material-symbols-outlined text-sm">today</span>
            <span>Today</span>
          </button>

          {/* View Mode Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'agenda' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="app-btn-primary text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Month Grid (8 Cols) */}
          <div className="lg:col-span-8 app-card p-4 sm:p-6 space-y-4">
            
            {/* Month Header Navigation */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-heading text-lg font-bold text-slate-900">{monthTitle}</h2>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Weekday Header Labels */}
            <div className="grid grid-cols-7 text-center font-mono text-[11px] font-bold text-slate-400 pb-1">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === activeSelectedDate;
                const dayTasks = tasks.filter(t => t.dueDate === day.dateStr);
                const pendingTasks = dayTasks.filter(t => t.status !== 'completed');

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`min-h-[64px] sm:min-h-[80px] p-1.5 sm:p-2 rounded-xl flex flex-col justify-between transition-all cursor-pointer relative border ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                        : day.isToday
                        ? 'bg-slate-50 border-slate-300 font-bold'
                        : day.isCurrentMonth
                        ? 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
                        : 'bg-slate-50/50 border-transparent text-slate-300'
                    }`}
                  >
                    {/* Day Number and Today Indicator */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs sm:text-sm font-semibold ${
                        isSelected 
                          ? 'text-blue-700 font-bold' 
                          : day.isToday 
                          ? 'w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]' 
                          : day.isCurrentMonth 
                          ? 'text-slate-700' 
                          : 'text-slate-300'
                      }`}>
                        {day.num}
                      </span>

                      {/* Pending count pill on larger screens */}
                      {pendingTasks.length > 0 && (
                        <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-blue-100 text-blue-700">
                          {pendingTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Task Indicator Badges / Dots */}
                    <div className="space-y-1 mt-1 w-full overflow-hidden">
                      {/* Mobile view dots */}
                      <div className="flex sm:hidden gap-1 items-center justify-center flex-wrap">
                        {dayTasks.slice(0, 3).map((t, tidx) => (
                          <div 
                            key={tidx} 
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'completed' ? 'bg-slate-300' : getSubjectDotColor(t.subject)
                            }`}
                          />
                        ))}
                      </div>

                      {/* Desktop view pill cards */}
                      <div className="hidden sm:block space-y-1">
                        {dayTasks.slice(0, 2).map((t) => (
                          <div
                            key={t.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium border ${
                              t.status === 'completed'
                                ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                                : getSubjectBadgeStyle(t.subject)
                            }`}
                            title={t.title}
                          >
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-mono block text-left pl-1">
                            +{dayTasks.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Selected Date Inspector (4 Cols) */}
          <div className="lg:col-span-4 app-card p-6 space-y-5">
            
            {/* Selected Date Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Selected Date
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  {formatFriendlyDate(activeSelectedDate)}
                </h3>
              </div>
              <span className="app-badge app-badge-blue">
                {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'Deliverable' : 'Deliverables'}
              </span>
            </div>

            {/* Task list for selected date */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                          {task.subject}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-rose-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          <span>{task.dueTime || '11:59 PM'}</span>
                        </span>
                      </div>

                      <h4 
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setCurrentView('assignment-details');
                        }}
                        className="font-heading text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer mb-1 line-clamp-2"
                      >
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                        {task.description}
                      </p>

                      {/* Milestones quick-toggle */}
                      {task.milestones && task.milestones.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 block font-semibold">Milestones:</span>
                          {task.milestones.map((m) => (
                            <label key={m.id} className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
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
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="material-symbols-outlined text-3xl text-slate-300">event_available</span>
                  <p className="text-xs text-slate-500 font-medium">No deliverables scheduled for this date.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    + Schedule an assignment
                  </button>
                </div>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full app-btn-primary text-xs py-2.5"
            >
              <span className="material-symbols-outlined text-sm">add_task</span>
              <span>Add Deliverable to Date</span>
            </button>

          </div>

        </div>
      )}

      {/* VIEW 2: AGENDA TIMELINE VIEW */}
      {viewMode === 'agenda' && (
        <div className="app-card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-slate-900">Upcoming Academic Agenda</h2>
            <span className="text-xs text-slate-500 font-mono">{agendaTasks.length} Total Assignments</span>
          </div>

          <div className="space-y-3">
            {agendaTasks.length > 0 ? (
              agendaTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setCurrentView('assignment-details');
                  }}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                      {task.subject}
                    </span>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right font-mono text-xs">
                      <span className="text-slate-900 font-bold block">{formatFriendlyDate(task.dueDate)}</span>
                      <span className="text-rose-600 font-semibold text-[11px]">{task.dueTime || '11:59 PM'}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
                No upcoming assignments found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Schedule Deliverable
                </h3>
                <p className="text-xs text-slate-500">Adding to {formatFriendlyDate(activeSelectedDate)}</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverable Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Linear Algebra Problem Set 3"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject *</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    {enrolledSubjects.map(sub => (
                      <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input 
                    type="text" 
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="11:59 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Criteria</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline syllabus deliverables, formulas, or submission format..."
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              {/* Milestones Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700">Milestones Breakdown</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="e.g. Read Chapters 4-5"
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={handleAddMilestone}
                    className="app-btn-secondary text-xs"
                  >
                    Add
                  </button>
                </div>

                {milestonesList.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {milestonesList.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                        <span className="text-slate-800">{m.title}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="app-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="app-btn-primary text-xs"
                >
                  Schedule Assignment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Calendar() {
  const { 
    tasks, 
    addTask, 
    enrolledSubjects,
    selectedDate, 
    setSelectedDate, 
    setCurrentView, 
    setSelectedTaskId 
  } = useContext(AppContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(enrolledSubjects[0]?.code || '');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('11:59 PM');

  // Custom Course Contact and Milestones states for Calendar.jsx
  const [profName, setProfName] = useState('');
  const [profHours, setProfHours] = useState('');
  const [milestonesList, setMilestonesList] = useState([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const newMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newMilestoneTitle.trim(),
      completed: false
    };
    setMilestonesList(prev => [...prev, newMilestone]);
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id) => {
    setMilestonesList(prev => prev.filter(m => m.id !== id));
  };

  // Hardcode October 2024 calendar details for high-fidelity replication of mockups
  const year = 2024;
  const month = 9; // October (0-indexed)
  const monthName = 'October 2024';

  // October 2024 starts on a Tuesday (day 2 in grid if Mon is 1). 
  // Let's build a grid of days matching the mockup:
  // Preceded by Sep 30, Sep 29... let's just make a static array of days to represent the grid structure:
  // Each day has: date string (YYYY-MM-DD), displayNum, isCurrentMonth, dots (array of task objects)
  const calendarDays = [];

  // Add leading September days (matching mockup)
  // Sep 26 (Thu) to Sep 30 (Mon)
  const sepDays = [
    { dateStr: '2024-09-26', num: 26, currentMonth: false },
    { dateStr: '2024-09-27', num: 27, currentMonth: false },
    { dateStr: '2024-09-28', num: 28, currentMonth: false },
    { dateStr: '2024-09-29', num: 29, currentMonth: false },
    { dateStr: '2024-09-30', num: 30, currentMonth: false },
  ];
  calendarDays.push(...sepDays);

  // Add October days (1 to 31)
  for (let d = 1; d <= 31; d++) {
    const pad = d < 10 ? '0' + d : d;
    calendarDays.push({
      dateStr: `2024-10-${pad}`,
      num: d,
      currentMonth: true
    });
  }

  // Add trailing November days (1 to 6 to fill grid)
  for (let d = 1; d <= 6; d++) {
    calendarDays.push({
      dateStr: `2024-11-0${d}`,
      num: d,
      currentMonth: false
    });
  }

  // Find tasks matching selected day
  const selectedDayTasks = tasks.filter(t => t.dueDate === selectedDate);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title) return;

    // Estimate time left based on selected date
    const dateObj = new Date(selectedDate);
    const today = new Date('2024-10-12'); // set static mock current date
    const diffTime = dateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeLeft = `${diffDays} Days`;
    if (diffDays === 0) timeLeft = 'Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';
    else timeLeft = `${diffDays} Days Left`;

    // Determine category based on due date
    let category = 'Later';
    if (diffDays <= 7 && diffDays >= 0) category = 'This Week';
    else if (diffDays <= 14 && diffDays > 7) category = 'Next Week';

    addTask({
      title,
      subject,
      description,
      dueDate: selectedDate,
      dueTime,
      category,
      timeLeft,
      professor: {
        name: profName.trim(),
        officeHours: profHours.trim()
      },
      milestones: milestonesList
    });

    setTitle('');
    setDescription('');
    setProfName('');
    setProfHours('');
    setMilestonesList([]);
    setNewMilestoneTitle('');
    setShowAddModal(false);
  };

  const handleCardClick = (id) => {
    setSelectedTaskId(id);
    setCurrentView('assignment-details');
  };

  // Helper to retrieve color representation for dots
  const getSubjectDotColor = (subjectCode) => {
    if (subjectCode.startsWith('CS')) return 'bg-primary';
    if (subjectCode.startsWith('MATH')) return 'bg-secondary';
    if (subjectCode.startsWith('HIST')) return 'bg-tertiary-container';
    return 'bg-error';
  };

  // Formatted selected date
  const formatSelectedDate = () => {
    const parts = selectedDate.split('-');
    if (parts.length !== 3) return selectedDate;
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="animate-fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 text-left pb-24">
      
      <main className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Calendar Grid Panel */}
        <section className="flex-grow lg:max-w-4xl">
          <div className="bg-surface-container-lowest border border-outline-variant p-3 sm:p-6 rounded-2xl shadow-sm">
            
            {/* Header controls */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-headline-md font-bold text-on-surface">{monthName}</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Week Headers */}
            <div className="calendar-grid text-center mb-4 font-semibold">
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">MON</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">TUE</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">WED</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">THU</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">FRI</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">SAT</span>
              <span className="font-mono text-[10px] sm:text-xs md:text-sm text-on-surface-variant">SUN</span>
            </div>

            {/* Grid days */}
            <div className="calendar-grid gap-y-4">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDate;
                const dayTasks = tasks.filter(t => t.dueDate === day.dateStr && t.status !== 'completed');
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day.dateStr)}
                    className={`h-14 flex flex-col items-center justify-center relative cursor-pointer rounded-xl transition-all ${
                      day.currentMonth 
                        ? isSelected
                          ? 'bg-primary text-on-primary shadow-md scale-105 z-10 font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                        : 'text-on-surface-variant/30 font-light'
                    }`}
                  >
                    <span className="font-body text-sm sm:text-base">{day.num}</span>
                    
                    {/* Event Dots */}
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5 sm:gap-1 mt-1 justify-center max-w-full overflow-hidden px-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div 
                            key={task.id}
                            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : getSubjectDotColor(task.subject)
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Right Side: Task Details for Selected Day */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="flex items-baseline justify-between">
            <h3 className="font-headline text-headline-sm font-semibold text-on-surface">{formatSelectedDate()}</h3>
            <span className="font-mono text-label-md text-primary font-bold">
              {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'TASK' : 'TASKS'}
            </span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const progress = task.progress !== undefined ? task.progress : 0;
                
                return (
                  <div 
                    key={task.id}
                    onClick={() => handleCardClick(task.id)}
                    className={`group bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-left ${
                      isCompleted ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-mono text-[9px] uppercase tracking-wider border border-primary/20">
                        {task.subject}
                      </span>
                      <span className="font-mono text-label-md text-error">{task.dueTime}</span>
                    </div>
                    
                    <h4 className="font-headline text-headline-sm font-semibold mb-1 truncate text-on-surface group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <p className="font-body text-body-sm text-on-surface-variant mb-4 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl text-center text-on-surface-variant italic">
                No tasks scheduled for this date.
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-primary text-on-primary rounded-full font-mono text-label-md shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            ADD TASK
          </button>
        </aside>

      </main>

      {/* Add Task Modal targeting selectedDate */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">
                Add Task for {formatSelectedDate()}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Task Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Econometrics Problem Set 4"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Course/Subject *</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                >
                  {enrolledSubjects.map(sub => (
                    <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core deliverables and criteria..."
                  rows="3"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Time</label>
                <input 
                  type="text" 
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 11:59 PM"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              {/* Course Contact Section */}
              <div className="border-t border-outline-variant/30 pt-4">
                <h4 className="font-headline text-headline-sm font-semibold mb-3 text-on-surface">Course Contact (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-label-md text-on-surface-variant mb-1">Professor Name</label>
                    <input 
                      type="text" 
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Thompson"
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-label-md text-on-surface-variant mb-1">Office Hours</label>
                    <input 
                      type="text" 
                      value={profHours}
                      onChange={(e) => setProfHours(e.target.value)}
                      placeholder="e.g. Mon/Wed 2-4PM"
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Milestones Checklist Section */}
              <div className="border-t border-outline-variant/30 pt-4">
                <h4 className="font-headline text-headline-sm font-semibold mb-3 text-on-surface">Milestones Checklist</h4>
                
                {/* Add Milestone input row */}
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMilestone(e);
                      }
                    }}
                    placeholder="Add a milestone (e.g. Final Draft)"
                    className="flex-1 px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                  />
                  <button 
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-4 bg-secondary-container text-on-secondary-container rounded-lg font-mono text-label-md hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Milestones List */}
                {milestonesList.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    {milestonesList.map((m) => (
                      <div key={m.id} className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded-md border border-outline-variant/20">
                        <span className="font-body text-body-sm text-on-surface truncate pr-2">{m.title}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-error text-[18px] cursor-pointer"
                        >
                          close
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-[12px] text-on-surface-variant italic">No milestones added. List will be empty unless items are added.</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-outline text-on-surface rounded-lg font-mono text-label-md hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

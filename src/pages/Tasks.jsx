import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Tasks() {
  const { tasks, enrolledSubjects, addTask, setCurrentView, setSelectedTaskId } = useContext(AppContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(enrolledSubjects[0]?.code || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2024-10-24');
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [category, setCategory] = useState('This Week');

  // Custom Course Contact and Milestones states
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

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title) return;

    const taskSubject = subject || (enrolledSubjects[0]?.code || '');
    if (!taskSubject) {
      alert("Please select or add a subject first.");
      return;
    }

    // Estimate time left based on due date
    const dateObj = new Date(dueDate);
    const today = new Date('2024-10-12'); // set static mock current date
    const diffTime = dateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeLeft = `${diffDays} Days`;
    if (diffDays === 0) timeLeft = 'Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';
    else timeLeft = `${diffDays} Days Left`;

    addTask({
      title,
      subject: taskSubject,
      description,
      dueDate,
      dueTime,
      category,
      timeLeft,
      professor: {
        name: profName.trim(),
        officeHours: profHours.trim()
      },
      milestones: milestonesList
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setProfName('');
    setProfHours('');
    setMilestonesList([]);
    setNewMilestoneTitle('');
    setShowAddModal(false);
  };

  // Grouping tasks
  const thisWeekTasks = tasks.filter(t => t.category === 'This Week');
  const nextWeekTasks = tasks.filter(t => t.category === 'Next Week');
  const laterTasks = tasks.filter(t => t.category === 'Later');

  const handleCardClick = (id) => {
    setSelectedTaskId(id);
    setCurrentView('assignment-details');
  };

  const renderTaskCard = (task) => {
    const isUrgent = task.timeLeft.toLowerCase().includes('left') || task.timeLeft.toLowerCase().includes('tomorrow') || task.timeLeft.toLowerCase().includes('today');
    const progress = task.progress !== undefined ? task.progress : 0;
    const isCompleted = task.status === 'completed';

    // Get color theme based on subject color
    const subjectColorMap = {
      'ECON 302': 'bg-blue-50 border-blue-200/50 text-blue-700',
      'CS 101': 'bg-indigo-50 border-indigo-200/50 text-indigo-700',
      'HIST 210': 'bg-slate-50 border-slate-200/50 text-slate-700',
      'PHYS 101': 'bg-amber-50 border-amber-200/50 text-amber-700',
      'PSYC 210': 'bg-purple-50 border-purple-200/50 text-purple-700',
      'CS 302': 'bg-emerald-50 border-emerald-200/50 text-emerald-700',
    };

    const subjectClass = subjectColorMap[task.subject] || 'bg-surface-container-high border-outline-variant text-on-surface-variant';

    return (
      <div 
        key={task.id}
        onClick={() => handleCardClick(task.id)}
        className={`glass-card p-5 rounded-2xl flex flex-col transition-all cursor-pointer group hover:-translate-y-1 ${
          isCompleted ? 'opacity-75' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full font-mono text-label-md uppercase border ${subjectClass}`}>
            {task.subject}
          </span>
          <span className={`font-mono text-label-md flex items-center gap-1 ${
            isCompleted 
              ? 'text-primary' 
              : isUrgent 
                ? 'text-error' 
                : 'text-on-surface-variant'
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {isCompleted ? 'check_circle' : 'alarm'}
            </span>
            {isCompleted ? 'Completed' : task.timeLeft}
          </span>
        </div>

        <h4 className="font-headline text-headline-sm font-semibold mb-2 group-hover:text-primary transition-colors text-left text-on-surface">
          {task.title}
        </h4>
        <p className="font-body text-body-sm text-on-surface-variant mb-6 text-left line-clamp-2">
          {task.description}
        </p>

        <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">event</span>
            <span className="font-mono text-label-md">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short' })}, {task.dueTime}
            </span>
          </div>
          <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isCompleted ? 'bg-primary' : 'bg-primary'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="animate-fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 text-left pb-24">
        {/* Header */}
        <section className="py-8">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface mb-2">Tasks</h2>
          <p className="font-body text-body-md text-on-surface-variant">Manage your upcoming academic obligations.</p>
        </section>

        {/* Category: This Week */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              calendar_today
            </span>
            <h3 className="font-headline text-headline-sm font-semibold uppercase tracking-wider text-primary">This Week</h3>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-mono text-[11px]">
              {thisWeekTasks.length}
            </span>
          </div>
          
          {thisWeekTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thisWeekTasks.map(renderTaskCard)}
            </div>
          ) : (
            <p className="font-body text-body-sm text-on-surface-variant italic">No tasks due this week.</p>
          )}
        </section>

        {/* Category: Next Week */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-secondary">next_plan</span>
            <h3 className="font-headline text-headline-sm font-semibold uppercase tracking-wider text-secondary">Next Week</h3>
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-mono text-[11px]">
              {nextWeekTasks.length}
            </span>
          </div>

          {nextWeekTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nextWeekTasks.map(renderTaskCard)}
            </div>
          ) : (
            <p className="font-body text-body-sm text-on-surface-variant italic">No tasks due next week.</p>
          )}
        </section>

        {/* Category: Later */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-on-surface-variant">hourglass_empty</span>
            <h3 className="font-headline text-headline-sm font-semibold uppercase tracking-wider text-on-surface-variant">Later</h3>
            <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-mono text-[11px]">
              {laterTasks.length}
            </span>
          </div>

          {laterTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laterTasks.map(renderTaskCard)}
            </div>
          ) : (
            <p className="font-body text-body-sm text-on-surface-variant italic">No tasks due later.</p>
          )}
        </section>
      </div>

      {/* Floating Action Button - Moved outside the animated wrapper */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px] transition-transform group-hover:rotate-90">add</span>
      </button>

      {/* Add Task Modal - Moved outside the animated wrapper */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">Add New Task</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              {enrolledSubjects.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-200">
                  Please create at least one subject in the <strong>Subject Mastery</strong> tab first.
                </div>
              ) : (
                <>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-label-md text-on-surface-variant mb-1">Course/Subject *</label>
                      <select 
                        value={subject || enrolledSubjects[0]?.code}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                      >
                        {enrolledSubjects.map(sub => (
                          <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-label-md text-on-surface-variant mb-1">Timeline Group</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                      >
                        <option value="This Week">This Week</option>
                        <option value="Next Week">Next Week</option>
                        <option value="Later">Later</option>
                      </select>
                    </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Date</label>
                      <input 
                        type="date" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
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
                </>
              )}

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
                  disabled={enrolledSubjects.length === 0}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

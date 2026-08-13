import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Tasks() {
  const { tasks, enrolledSubjects, addTask, updateTaskMilestone, setCurrentView, setSelectedTaskId } = useContext(AppContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, in-progress, completed, overdue
  const [subjectFilter, setSubjectFilter] = useState('all');

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
    
    const calculateTimeLeft = (days) => {
      if (days === 0) return 'Today';
      if (days === 1) return 'Tomorrow';
      if (days < 0) return 'Overdue';
      return `${days} Days Left`;
    };
    const timeLeft = calculateTimeLeft(diffDays);

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

  // Filter tasks based on search, status filter, and subject filter
  const filteredTasks = tasks.filter(task => {
    // Search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Subject filter
    if (subjectFilter !== 'all' && task.subject !== subjectFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'completed') return task.status === 'completed';
    if (statusFilter === 'in-progress') return task.status !== 'completed' && task.timeLeft !== 'Overdue';
    if (statusFilter === 'overdue') return task.timeLeft === 'Overdue' || (task.status !== 'completed' && new Date(task.dueDate) < new Date('2024-10-12'));

    return true;
  });

  // Grouping filtered tasks
  const thisWeekTasks = filteredTasks.filter(t => t.category === 'This Week');
  const nextWeekTasks = filteredTasks.filter(t => t.category === 'Next Week');
  const laterTasks = filteredTasks.filter(t => t.category === 'Later');

  const handleCardClick = (id) => {
    setSelectedTaskId(id);
    setCurrentView('assignment-details');
  };

  const handleToggleComplete = (e, task) => {
    e.stopPropagation();
    const nextCompleted = task.status !== 'completed';
    if (task.milestones && task.milestones.length > 0) {
      task.milestones.forEach(m => {
        updateTaskMilestone(task.id, m.id, nextCompleted);
      });
    } else {
      updateTaskMilestone(task.id, 'm1', nextCompleted);
    }
  };

  const renderTaskCard = (task) => {
    const isUrgent = task.timeLeft.toLowerCase().includes('left') || task.timeLeft.toLowerCase().includes('tomorrow') || task.timeLeft.toLowerCase().includes('today');
    const progress = task.progress !== undefined ? task.progress : 0;
    const isCompleted = task.status === 'completed';

    const subjectClass = 'bg-surface-container-high border-outline-variant text-on-surface-variant';

    return (
      <div 
        key={task.id}
        onClick={() => handleCardClick(task.id)}
        className={`glass-card p-5 rounded-2xl flex flex-col transition-all cursor-pointer group hover:-translate-y-1 relative ${
          isCompleted ? 'opacity-75 bg-emerald-50/20 border-emerald-200' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-md font-mono text-[11px] font-extrabold uppercase tracking-wide border ${subjectClass}`}>
            {task.subject}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleToggleComplete(e, task)}
              title={isCompleted ? "Mark in progress" : "Mark completed"}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isCompleted 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCompleted ? 'check' : 'circle'}
              </span>
            </button>
            <span className={`font-mono text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
              isCompleted 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                : isUrgent 
                  ? 'text-rose-700 bg-rose-50 border-rose-200' 
                  : 'text-indigo-900 bg-indigo-50 border-indigo-200'
            }`}>
              <span className="material-symbols-outlined text-[14px]">
                {isCompleted ? 'verified' : 'alarm'}
              </span>
              {isCompleted ? 'Completed' : task.timeLeft}
            </span>
          </div>
        </div>

        <h4 className={`font-headline text-lg font-bold mb-2 group-hover:text-purple-700 transition-colors text-left ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </h4>
        <p className="font-body text-xs text-slate-600 mb-6 text-left line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <span className="material-symbols-outlined text-sm text-indigo-500">event</span>
            <span>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {task.dueTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-600">{progress}%</span>
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-8 py-8 text-left pb-24">
        {/* Header */}
        <section className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Tasks & Deliverables</h2>
            <p className="font-body text-xs text-slate-600">Track, organize, and complete your academic obligations with zero clutter.</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#1e1b4b] to-[#231f5c] hover:from-indigo-900 hover:to-purple-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Deliverable</span>
          </button>
        </section>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-indigo-100/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-bold w-full md:w-auto overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${statusFilter === 'all' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({tasks.length})
              </button>
              <button 
                onClick={() => setStatusFilter('in-progress')}
                className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${statusFilter === 'in-progress' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                In Progress ({tasks.filter(t => t.status !== 'completed' && t.timeLeft !== 'Overdue').length})
              </button>
              <button 
                onClick={() => setStatusFilter('completed')}
                className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${statusFilter === 'completed' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Completed ({tasks.filter(t => t.status === 'completed').length})
              </button>
              <button 
                onClick={() => setStatusFilter('overdue')}
                className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${statusFilter === 'overdue' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Overdue ({tasks.filter(t => t.timeLeft === 'Overdue').length})
              </button>
            </div>

            {/* Subject Dropdown Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 font-mono font-semibold">Subject:</span>
              <select 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-outline-variant rounded-xl bg-surface text-xs font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {enrolledSubjects.map(s => (
                  <option key={s.code} value={s.code}>{s.code} ({s.name})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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

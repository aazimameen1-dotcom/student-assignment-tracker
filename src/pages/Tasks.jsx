import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Tasks() {
  const { 
    tasks = [], 
    enrolledSubjects = [], 
    addTask, 
    deleteTask,
    updateTaskMilestone, 
    setCurrentView, 
    setSelectedTaskId 
  } = useContext(AppContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed, soon
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [viewLayout, setViewLayout] = useState('grid'); // 'grid' | 'table'

  // New Task Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(enrolledSubjects[0]?.code || 'CS101');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [profName, setProfName] = useState('');
  const [profHours, setProfHours] = useState('');
  const [milestonesList, setMilestonesList] = useState([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

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

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskSubject = subject || (enrolledSubjects[0]?.code || 'CS101');

    // Dynamic date calculations
    const taskDate = new Date(dueDate);
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
      subject: taskSubject,
      description: description.trim() || 'No specific instructions provided.',
      dueDate,
      dueTime,
      category,
      timeLeft,
      professor: {
        name: profName.trim() || 'Faculty Instructor',
        officeHours: profHours.trim() || 'Mon/Wed 2-4 PM'
      },
      milestones: milestonesList.length > 0 ? milestonesList : [
        { id: 'm1', title: 'Initial Draft & Outline', completed: false },
        { id: 'm2', title: 'Final Review & Submission', completed: false }
      ]
    });

    setTitle('');
    setDescription('');
    setProfName('');
    setProfHours('');
    setMilestonesList([]);
    setShowAddModal(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    // Search
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Subject
    const matchesSubject = subjectFilter === 'all' || task.subject === subjectFilter;

    // Status / Urgency
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = task.status !== 'completed';
    } else if (statusFilter === 'completed') {
      matchesStatus = task.status === 'completed';
    } else if (statusFilter === 'soon') {
      matchesStatus = task.timeLeft === 'Due Today' || task.timeLeft === 'Tomorrow' || task.category === 'This Week';
    }

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Calculate live stats
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const dueThisWeekTasks = tasks.filter(t => t.category === 'This Week' && t.status !== 'completed').length;

  const getSubjectBadgeStyle = (code) => {
    if (!code) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (code.startsWith('PHYS') || code.startsWith('CHEM')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-700 text-2xl">checklist</span>
            <span>Tasks & Deliverables</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage course problem sets, lab reports, readings, and assignment milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="app-btn-primary text-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="app-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Total</span>
            <span className="font-heading text-lg font-bold text-slate-900">{totalTasks}</span>
          </div>
        </div>

        <div className="app-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">pending_actions</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">In Progress</span>
            <span className="font-heading text-lg font-bold text-slate-900">{activeTasks}</span>
          </div>
        </div>

        <div className="app-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">alarm</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Due This Week</span>
            <span className="font-heading text-lg font-bold text-slate-900">{dueThisWeekTasks}</span>
          </div>
        </div>

        <div className="app-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">Completed</span>
            <span className="font-heading text-lg font-bold text-slate-900">{completedTasks}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'soon', label: 'Due Soon' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Subject Filter & Layout Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-52">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {enrolledSubjects.map(sub => (
              <option key={sub.code} value={sub.code}>{sub.code}</option>
            ))}
          </select>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-base">view_list</span>
            </button>
          </div>
        </div>

      </div>

      {/* VIEW 1: GRID LAYOUT */}
      {viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const progress = task.progress !== undefined ? task.progress : 0;
              const completedCount = task.milestones ? task.milestones.filter(m => m.completed).length : 0;
              const totalMilestones = task.milestones ? task.milestones.length : 0;

              return (
                <div
                  key={task.id}
                  className={`app-card p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between ${
                    isCompleted ? 'opacity-70 bg-slate-50/50' : 'bg-white shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Header: Subject & Due Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                        {task.subject}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-rose-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>{task.dueTime || '11:59 PM'}</span>
                      </span>
                    </div>

                    {/* Task Title & Description */}
                    <div>
                      <h3
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setCurrentView('assignment-details');
                        }}
                        className="font-heading text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    {/* Milestone checklist preview */}
                    {task.milestones && task.milestones.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Milestones ({completedCount}/{totalMilestones})</span>
                          <span className="font-bold text-slate-700">{progress}%</span>
                        </div>

                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full transition-all duration-300 ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        {task.milestones.slice(0, 3).map((m) => (
                          <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={(e) => updateTaskMilestone(task.id, m.id, e.target.checked)}
                              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                            />
                            <span className={`truncate ${m.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {m.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Card Footer: Due Date & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-slate-400">calendar_today</span>
                      <span>{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setCurrentView('assignment-details');
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        Details →
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full app-card p-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-300">task_alt</span>
              <h3 className="font-heading text-sm font-bold text-slate-700">No tasks found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No matching academic deliverables found with current filter selections.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="app-btn-primary text-xs"
              >
                + Add Deliverable
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: TABLE LAYOUT */
        <div className="app-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Milestones</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    const progress = task.progress !== undefined ? task.progress : 0;

                    return (
                      <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span 
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setCurrentView('assignment-details');
                            }}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block truncate max-w-xs"
                          >
                            {task.title}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-xs">{task.description}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                            {task.subject}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {task.dueDate} ({task.dueTime})
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{progress}% done</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer mr-2"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setCurrentView('assignment-details');
                            }}
                            className="text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No matching tasks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  Add New Task Deliverable
                </h3>
                <p className="text-xs text-slate-500">Record assignment parameters, due dates, and milestones</p>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Lab 4: Virtual Memory"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize requirements, grading rubric, or submission requirements..."
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              {/* Milestones Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700">Milestone Checkpoints</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="e.g. Complete test cases & write-up"
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
                  Save Deliverable
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

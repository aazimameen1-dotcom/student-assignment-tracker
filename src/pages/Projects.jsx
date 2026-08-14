import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Projects() {
  const { 
    tasks = [], 
    addTask, 
    enrolledSubjects = [], 
    setSelectedTaskId, 
    setCurrentView,
    updateTaskMilestone 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-progress' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSubject, setProjectSubject] = useState(enrolledSubjects[0]?.code || 'CS101');
  const [projectDesc, setProjectDesc] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [milestones, setMilestones] = useState([
    { id: 'm1', title: 'System Architecture & Spec', completed: true },
    { id: 'm2', title: 'Core Implementation & Database Schema', completed: false },
    { id: 'm3', title: 'Testing & Final Report Submission', completed: false }
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Add Milestone to Form
  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    setMilestones(prev => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: newMilestoneText.trim(),
        completed: false
      }
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  // Submit New Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    // Calculate time left
    const targetDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    let timeLeft = `${diffDays} Days Left`;
    if (diffDays === 0) timeLeft = 'Due Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';

    await addTask({
      title: projectTitle.trim(),
      subject: projectSubject,
      description: projectDesc.trim() || 'Comprehensive course project deliverable.',
      dueDate,
      dueTime,
      category: diffDays <= 7 ? 'This Week' : 'Later',
      timeLeft,
      professor: {
        name: 'Project Advisory Faculty',
        officeHours: 'TBD'
      },
      milestones: milestones.length > 0 ? milestones : [
        { id: 'm1', title: 'Initial Project Proposal', completed: false },
        { id: 'm2', title: 'Final Prototype Submission', completed: false }
      ]
    });

    setProjectTitle('');
    setProjectDesc('');
    setShowCreateModal(false);
  };

  // Filter project-type deliverables
  const projectList = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || task.subject === selectedSubject;

    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'in-progress' && task.status !== 'completed') ||
      (activeTab === 'completed' && task.status === 'completed');

    return matchesSearch && matchesSubject && matchesTab;
  });

  const totalProjects = tasks.length;
  const inProgressProjects = tasks.filter(t => t.status !== 'completed').length;
  const completedProjects = tasks.filter(t => t.status === 'completed').length;

  const getBadgeStyle = (code) => {
    if (!code) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-700 text-2xl">folder_open</span>
            <span>Academic Projects</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track multi-stage course deliverables, research capstones, and milestone roadmaps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="app-btn-primary text-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Project</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <span className="material-symbols-outlined text-xl">folder</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Projects</span>
            <span className="font-heading text-xl font-bold text-slate-900">{totalProjects}</span>
          </div>
        </div>

        <div className="app-card p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <span className="material-symbols-outlined text-xl">pending_actions</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">In Progress</span>
            <span className="font-heading text-xl font-bold text-slate-900">{inProgressProjects}</span>
          </div>
        </div>

        <div className="app-card p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-xl">task_alt</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Completed</span>
            <span className="font-heading text-xl font-bold text-slate-900">{completedProjects}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="app-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Subject Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="all">All Courses</option>
            {enrolledSubjects.map(sub => (
              <option key={sub.code} value={sub.code}>{sub.code}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectList.length > 0 ? (
          projectList.map((project) => {
            const isDone = project.status === 'completed';
            const progress = project.progress !== undefined ? project.progress : 0;
            const completedCount = project.milestones ? project.milestones.filter(m => m.completed).length : 0;
            const totalMilestones = project.milestones ? project.milestones.length : 0;

            return (
              <div
                key={project.id}
                className={`app-card p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between ${
                  isDone ? 'opacity-75 bg-slate-50/50' : 'bg-white shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Subject Badge & Due Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getBadgeStyle(project.subject)}`}>
                      {project.subject}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-rose-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">event</span>
                      <span>{project.dueDate}</span>
                    </span>
                  </div>

                  {/* Project Title & Desc */}
                  <div>
                    <h3 
                      onClick={() => {
                        setSelectedTaskId(project.id);
                        setCurrentView('assignment-details');
                      }}
                      className="font-heading text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Milestones Progress</span>
                      <span className="font-bold text-slate-900">{completedCount}/{totalMilestones} ({progress}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Milestone checklist preview */}
                  {project.milestones && project.milestones.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      {project.milestones.slice(0, 3).map((m) => (
                        <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={(e) => updateTaskMilestone(project.id, m.id, e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          />
                          <span className={`truncate ${m.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {m.title}
                          </span>
                        </label>
                      ))}
                      {project.milestones.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono block pl-5">
                          +{project.milestones.length - 3} more deliverables
                        </span>
                      )}
                    </div>
                  )}

                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {project.timeLeft || 'In Progress'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTaskId(project.id);
                      setCurrentView('assignment-details');
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Workspace</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full app-card p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-300">folder_off</span>
            <h3 className="font-heading text-sm font-bold text-slate-700">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching academic deliverables found with the current filters.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="app-btn-primary text-xs"
            >
              + Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Create Academic Project
                </h3>
                <p className="text-xs text-slate-500">Define project scope, course, and deliverables</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Capstone"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course *</label>
                  <select 
                    value={projectSubject}
                    onChange={(e) => setProjectSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    {enrolledSubjects.map(sub => (
                      <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Final Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Overview & Objectives</label>
                <textarea 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Briefly describe project requirements, deliverables, and repo link..."
                  rows="2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              {/* Milestones Planner */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">Project Milestones & Stages</label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {milestones.length} {milestones.length === 1 ? 'stage' : 'stages'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddMilestone(e);
                      }
                    }}
                    placeholder="e.g. Peer Review & Final Code Freeze"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddMilestone(e);
                    }}
                    className="app-btn-primary text-xs px-3.5 py-2 shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Stage</span>
                  </button>
                </div>

                {milestones.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto mt-2 p-1">
                    {milestones.map((m, idx) => (
                      <div key={m.id || idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold font-mono flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 font-medium">{m.title}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveMilestone(m.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="Remove Stage"
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
                  onClick={() => setShowCreateModal(false)}
                  className="app-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="app-btn-primary text-xs"
                >
                  Create Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function AssignmentDetails() {
  const { 
    selectedTaskId, 
    tasks, 
    updateTaskMilestone, 
    setCurrentView,
    enrolledSubjects,
    editTask,
    deleteTask
  } = useContext(AppContext);

  const [toastMessage, setToastMessage] = useState('');

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await deleteTask(task.id);
      setCurrentView('tasks');
    }
  };

  // Task Edit Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editProfName, setEditProfName] = useState('');
  const [editProfHours, setEditProfHours] = useState('');
  const [editMilestonesList, setEditMilestonesList] = useState([]);
  const [editNewMilestoneTitle, setEditNewMilestoneTitle] = useState('');

  const openEditModal = () => {
    setEditTitle(task.title || '');
    setEditSubject(task.subject || '');
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate || '2024-10-24');
    setEditDueTime(task.dueTime || '11:59 PM');
    setEditCategory(task.category || 'This Week');
    setEditProfName(task.professor?.name || '');
    setEditProfHours(task.professor?.officeHours || '');
    setEditMilestonesList(task.milestones || []);
    setEditNewMilestoneTitle('');
    setShowEditModal(true);
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!editNewMilestoneTitle.trim()) return;
    const newMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: editNewMilestoneTitle.trim(),
      completed: false
    };
    setEditMilestonesList(prev => [...prev, newMilestone]);
    setEditNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id) => {
    setEditMilestonesList(prev => prev.filter(m => m.id !== id));
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editTitle) return;

    // Estimate time left based on due date
    const dateObj = new Date(editDueDate);
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

    try {
      await editTask(task.id, {
        title: editTitle,
        subject: editSubject,
        description: editDescription,
        dueDate: editDueDate,
        dueTime: editDueTime,
        category: editCategory,
        timeLeft,
        professor: {
          name: editProfName.trim(),
          officeHours: editProfHours.trim()
        },
        milestones: editMilestonesList
      });
      setShowEditModal(false);
      triggerToast("Assignment updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating task.");
    }
  };

  // Find the selected task
  const task = tasks.find(t => t.id === selectedTaskId);

  // If no task selected, show empty state or navigate back
  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="font-body text-body-md text-on-surface-variant">No assignment selected.</p>
        <button 
          onClick={() => setCurrentView('tasks')}
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded"
        >
          Go to Tasks
        </button>
      </div>
    );
  }

  const handleMilestoneToggle = (milestoneId, currentCompleted) => {
    updateTaskMilestone(task.id, milestoneId, !currentCompleted);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmit = () => {
    // Check off all milestones as a shortcut of completion
    task.milestones.forEach(m => {
      if (!m.completed) {
        updateTaskMilestone(task.id, m.id, true);
      }
    });
    triggerToast("Assignment submitted successfully!");
    setTimeout(() => {
      setCurrentView('tasks');
    }, 1500);
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className="animate-fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 text-left pb-32">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-lg font-mono text-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Back button and title top row */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('tasks')}
            aria-label="Go back" 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">arrow_back</span>
          </button>
          <div>
            <span className="font-mono text-label-md text-on-surface-variant">{task.subject}</span>
            <h2 className="font-headline text-headline-md font-bold text-primary truncate max-w-[250px] md:max-w-none">
              {task.subject} Details
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={openEditModal}
            className="px-4 py-2 border border-outline text-primary rounded-xl font-mono text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Task
          </button>

          <button 
            onClick={handleDeleteTask}
            className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-mono text-label-md transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            title="Delete Assignment"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span className="hidden md:inline">Delete</span>
          </button>
        </div>
      </header>

      {/* Header Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop mb-8">
        
        {/* Left Info: Title & Metadata */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-label-md ${
              isCompleted 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-primary-container text-on-primary-container'
            }`}>
              {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-highest text-primary font-mono text-label-md border border-outline-variant">
              {task.subject}
            </span>
          </div>

          <h3 className="font-headline text-headline-lg font-bold text-on-surface tracking-tight leading-tight">
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <span className="font-body text-body-sm">
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {task.dueTime}
              </span>
            </div>
            
            {!isCompleted && (
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-error-container/30 border border-error/15 text-error">
                <span className="material-symbols-outlined text-[18px]">alarm</span>
                <span className="font-mono text-label-md font-bold uppercase tracking-wider">
                  {task.timeLeft}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Info: Circular Progress Widget */}
        <div className="lg:col-span-4 paper-card p-6 rounded-2xl flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle 
                className="text-surface-container-highest" 
                cx="18" 
                cy="18" 
                fill="none" 
                r="15.915" 
                stroke="currentColor" 
                strokeWidth="3"
              />
              <circle 
                className="text-primary transition-all duration-500" 
                cx="18" 
                cy="18" 
                fill="none" 
                r="15.915" 
                stroke="currentColor" 
                strokeDasharray={`${task.progress} ${100 - task.progress}`} 
                strokeLinecap="round" 
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-headline text-headline-sm font-bold text-primary">{task.progress}%</span>
            </div>
          </div>
          <p className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider">Current Progress</p>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        
        {/* Main Brief & Checklist */}
        <div className="lg:col-span-8 space-y-gutter-desktop">
          
          {/* Brief */}
          <section className="paper-card p-8 rounded-2xl">
            <h4 className="font-headline text-headline-sm mb-4 flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-primary">description</span>
              Assignment Brief
            </h4>
            <div className="font-body text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line space-y-4">
              {task.description}
            </div>
          </section>

          {/* Checklist */}
          <section className="paper-card p-8 rounded-2xl">
            <h4 className="font-headline text-headline-sm mb-6 flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-primary">checklist</span>
              Milestones
            </h4>
            
            <div className="space-y-3">
              {task.milestones.map((m) => (
                <label 
                  key={m.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors group"
                >
                  <input 
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => handleMilestoneToggle(m.id, m.completed)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`font-body text-body-md transition-all ${
                      m.completed ? 'line-through text-on-surface-variant/65' : 'text-on-surface font-medium'
                    }`}>
                      {m.title}
                    </p>
                    {m.completed && m.completedDate && (
                      <span className="font-mono text-[11px] text-on-surface-variant opacity-60">
                        Completed on {m.completedDate}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar panels */}
        <aside className="lg:col-span-4 space-y-gutter-desktop">
          
          {/* Resources Panel */}
          <section className="paper-card p-6 rounded-2xl">
            <h4 className="font-headline text-headline-sm mb-4 flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-primary">link</span>
              Resources
            </h4>
            
            <div className="space-y-3">
              {task.resources && task.resources.length > 0 ? (
                task.resources.map((res, index) => {
                  const isPdf = res.type === 'pdf';
                  const isExcel = res.type === 'excel';
                  const icon = isPdf ? 'picture_as_pdf' : isExcel ? 'description' : 'language';
                  const iconColor = isPdf ? 'text-red-600 bg-red-50' : isExcel ? 'text-blue-600 bg-blue-50' : 'text-on-surface-variant bg-surface-container-highest';
                  
                  return (
                    <a 
                      key={index}
                      href={res.link || '#'}
                      target={res.link ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant group"
                    >
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${iconColor}`}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-body text-body-sm truncate text-on-surface group-hover:text-primary transition-colors">
                          {res.name}
                        </p>
                        <p className="font-mono text-[11px] text-on-surface-variant">
                          {res.size || 'External Link'}
                        </p>
                      </div>
                    </a>
                  );
                })
              ) : (
                <p className="font-body text-body-sm text-on-surface-variant italic">No resources attached.</p>
              )}
            </div>

            <button 
              onClick={() => triggerToast("New material uploaded (Mocked)")}
              className="w-full mt-4 py-2.5 border border-outline-variant rounded-lg font-mono text-label-md text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Material
            </button>
          </section>

          {/* Contact Professor Panel */}
          {task.professor && (
            <section className="paper-card p-6 rounded-2xl">
              <h4 className="font-headline text-headline-sm mb-4 flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary">person_search</span>
                Course Contact
              </h4>
              <div className="flex items-center gap-3">
                {task.professor.avatar ? (
                  <img 
                    alt={task.professor.name || 'Professor'} 
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    src={task.professor.avatar}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                    {task.professor.name 
                      ? task.professor.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'Prof'}
                  </div>
                )}
                <div>
                  <p className="font-body text-body-md font-semibold text-on-surface">{task.professor.name || 'TBD'}</p>
                  <p className="font-mono text-[11px] text-on-surface-variant">Office Hours: {task.professor.officeHours || 'TBD'}</p>
                </div>
              </div>
              
              <button 
                onClick={() => triggerToast(`Message compose window opened for ${task.professor.name || 'Professor'}`)}
                className="w-full mt-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-mono text-label-md hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Message Professor
              </button>
            </section>
          )}

        </aside>
      </div>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant z-40 px-margin-mobile md:px-margin-desktop py-4 shadow-lg">
        <div className="max-w-container-max-width mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-mono text-label-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Last autosaved at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => {
                triggerToast("Draft version saved locally!");
                setTimeout(() => setCurrentView('tasks'), 1000);
              }}
              className="flex-1 md:flex-none px-6 py-3 border border-primary text-primary rounded-lg font-mono text-label-md hover:bg-primary/5 transition-all active:scale-95 cursor-pointer text-center"
            >
              Save Draft
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 md:flex-none px-8 py-3 bg-primary text-on-primary rounded-lg font-headline text-headline-sm font-bold shadow-md hover:bg-primary-fixed-dim hover:text-primary transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              Submit Assignment
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">Edit Task</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleEditTask} className="space-y-4">
              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Task Title *</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Econometrics Problem Set 4"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Course/Subject *</label>
                  <select 
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
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
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
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
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Summarize the deliverables and criteria..."
                  rows="3"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Time</label>
                  <input 
                    type="text" 
                    value={editDueTime}
                    onChange={(e) => setEditDueTime(e.target.value)}
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
                      value={editProfName}
                      onChange={(e) => setEditProfName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Thompson"
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-label-md text-on-surface-variant mb-1">Office Hours</label>
                    <input 
                      type="text" 
                      value={editProfHours}
                      onChange={(e) => setEditProfHours(e.target.value)}
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
                    value={editNewMilestoneTitle}
                    onChange={(e) => setEditNewMilestoneTitle(e.target.value)}
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
                {editMilestonesList.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    {editMilestonesList.map((m) => (
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
                  <p className="font-body text-[12px] text-on-surface-variant italic">No milestones added.</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-outline text-on-surface rounded-lg font-mono text-label-md hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-mono text-label-md hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

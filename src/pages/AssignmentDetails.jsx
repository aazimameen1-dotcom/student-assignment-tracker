import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function AssignmentDetails() {
  const { 
    selectedTaskId, 
    tasks = [], 
    updateTaskMilestone, 
    setCurrentView,
    enrolledSubjects = [],
    editTask,
    deleteTask
  } = useContext(AppContext);

  const [toastMessage, setToastMessage] = useState('');

  // Find the selected task, or default to the first available task
  const task = tasks.find(t => t.id === selectedTaskId) || tasks[0];

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
  const [quickCheckpointTitle, setQuickCheckpointTitle] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddQuickCheckpoint = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!quickCheckpointTitle.trim() || !task) return;

    const newCheckpoint = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: quickCheckpointTitle.trim(),
      completed: false
    };

    const updatedMilestones = [...(task.milestones || []), newCheckpoint];
    await editTask(task.id, { milestones: updatedMilestones });
    setQuickCheckpointTitle('');
    triggerToast('Milestone checkpoint added!');
  };

  const openEditModal = () => {
    if (!task) return;
    setEditTitle(task.title || '');
    setEditSubject(task.subject || (enrolledSubjects[0]?.code || 'CS101'));
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setEditDueTime(task.dueTime || '11:59 PM');
    setEditCategory(task.category || 'This Week');
    setEditProfName(task.professor?.name || '');
    setEditProfHours(task.professor?.officeHours || '');
    setEditMilestonesList(task.milestones ? [...task.milestones] : []);
    setEditNewMilestoneTitle('');
    setShowEditModal(true);
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
      triggerToast('Assignment deleted');
      setCurrentView('tasks');
    }
  };

  const handleAddMilestone = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editNewMilestoneTitle.trim()) return;
    const newMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: editNewMilestoneTitle.trim(),
      completed: false
    };
    setEditMilestonesList(prev => [...prev, newMilestone]);
    setEditNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id) => {
    setEditMilestonesList(prev => prev.filter(m => m.id !== id));
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !task) return;

    // Calculate dynamic time left relative to today
    const taskDate = new Date(editDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));

    let timeLeft = `${diffDays} Days Left`;
    if (diffDays === 0) timeLeft = 'Due Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';

    let category = editCategory;
    if (diffDays <= 7 && diffDays >= 0) category = 'This Week';
    else if (diffDays <= 14 && diffDays > 7) category = 'Next Week';

    try {
      await editTask(task.id, {
        title: editTitle.trim(),
        subject: editSubject,
        description: editDescription.trim(),
        dueDate: editDueDate,
        dueTime: editDueTime,
        category,
        timeLeft,
        professor: {
          name: editProfName.trim() || 'Faculty Instructor',
          officeHours: editProfHours.trim() || 'Mon/Wed 2-4 PM'
        },
        milestones: editMilestonesList
      });
      setShowEditModal(false);
      triggerToast('Assignment updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating task. Please try again.');
    }
  };

  const handleCompleteAllMilestones = () => {
    if (!task || !task.milestones) return;
    task.milestones.forEach(m => {
      if (!m.completed) {
        updateTaskMilestone(task.id, m.id, true);
      }
    });
    triggerToast('All milestones completed! Assignment cleared.');
  };

  // If no tasks exist in workspace, show empty state
  if (!task) {
    return (
      <div className="max-w-xl mx-auto p-12 app-card text-center space-y-4 my-12 animate-fade-in text-left">
        <span className="material-symbols-outlined text-4xl text-slate-300">folder_open</span>
        <h3 className="font-heading text-base font-bold text-slate-900">No Assignment Selected</h3>
        <p className="text-xs text-slate-500">Pick an assignment from your tasks board or project hub to view its deliverables.</p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={() => setCurrentView('tasks')} className="app-btn-primary text-xs">
            Browse Tasks
          </button>
          <button onClick={() => setCurrentView('projects')} className="app-btn-secondary text-xs">
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = task.status === 'completed';
  const completedMCount = task.milestones ? task.milestones.filter(m => m.completed).length : 0;
  const totalMCount = task.milestones ? task.milestones.length : 0;
  const progress = task.progress !== undefined ? task.progress : 0;

  const getSubjectBadgeStyle = (code) => {
    if (!code) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (code.startsWith('CS') || code.startsWith('SE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code.startsWith('MATH') || code.startsWith('STAT')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (code.startsWith('HIST') || code.startsWith('ENG')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-32">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl font-mono text-xs flex items-center gap-2 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar: Breadcrumb, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('tasks')}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Back to Tasks"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSubjectBadgeStyle(task.subject)}`}>
                {task.subject}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {task.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={openEditModal}
            className="app-btn-secondary text-xs"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit Task</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteTask}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Brief & Milestones (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Assignment Brief */}
          <div className="app-card p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-base text-slate-700">description</span>
              <h2 className="font-heading text-sm font-bold text-slate-900">Assignment Brief & Scope</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {task.description || 'No detailed instructions recorded for this assignment.'}
            </p>
          </div>

          {/* Section 2: Interactive Milestone Checklist */}
          <div className="app-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-slate-700">checklist</span>
                <h2 className="font-heading text-sm font-bold text-slate-900">Deliverable Milestones</h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                {completedMCount}/{totalMCount} Cleared ({progress}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Checkpoints list */}
            <div className="space-y-2.5">
              {task.milestones && task.milestones.length > 0 ? (
                task.milestones.map((m) => (
                  <label
                    key={m.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      m.completed 
                        ? 'bg-slate-50/70 border-slate-200/80 text-slate-400' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={(e) => updateTaskMilestone(task.id, m.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <span className={`text-xs font-medium ${m.completed ? 'line-through' : ''}`}>
                        {m.title}
                      </span>
                    </div>

                    {m.completedDate && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Cleared {m.completedDate}
                      </span>
                    )}
                  </label>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No milestones defined.</p>
              )}
            </div>

            {/* Quick Inline Checkpoint Adder */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Add Milestone Checkpoint</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickCheckpointTitle}
                  onChange={(e) => setQuickCheckpointTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddQuickCheckpoint(e);
                    }
                  }}
                  placeholder="e.g. Complete section 3 & submit draft"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddQuickCheckpoint}
                  className="app-btn-primary text-xs px-3.5 py-2 shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Checkpoint</span>
                </button>
              </div>
            </div>

            {!isCompleted && totalMCount > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCompleteAllMilestones}
                  className="app-btn-secondary text-xs"
                >
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  <span>Mark All Milestones Complete</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Metadata & Course Contact (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Submission Deadlines Card */}
          <div className="app-card p-6 space-y-4">
            <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Deadline Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">Due Date</span>
                <span className="font-bold text-slate-900">{task.dueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">Submission Time</span>
                <span className="font-bold text-slate-900">{task.dueTime || '11:59 PM'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">Time Remaining</span>
                <span className={`font-bold font-mono ${task.timeLeft?.includes('Passed') ? 'text-rose-600' : 'text-blue-600'}`}>
                  {task.timeLeft || 'On Schedule'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">Category</span>
                <span className="font-semibold text-slate-700">{task.category || 'General'}</span>
              </div>
            </div>
          </div>

          {/* Instructor & Office Hours Card */}
          <div className="app-card p-6 space-y-4">
            <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Course Instructor
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {task.professor?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">{task.professor?.name || 'Professor'}</p>
                <p className="text-[11px] text-slate-500">{task.professor?.officeHours || 'Office hours on syllabus'}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Edit Assignment Deliverable
                </h3>
                <p className="text-xs text-slate-500">Update parameters, milestone checkpoints, or course deadlines.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleEditTaskSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course *</label>
                  <select 
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    {enrolledSubjects.map(sub => (
                      <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Grouping</label>
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Scope & Instructions</label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input 
                    type="text" 
                    value={editDueTime}
                    onChange={(e) => setEditDueTime(e.target.value)}
                    placeholder="11:59 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Course Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor Name</label>
                  <input 
                    type="text" 
                    value={editProfName}
                    onChange={(e) => setEditProfName(e.target.value)}
                    placeholder="Dr. Sarah Thompson"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office Hours</label>
                  <input 
                    type="text" 
                    value={editProfHours}
                    onChange={(e) => setEditProfHours(e.target.value)}
                    placeholder="Mon/Wed 2-4 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Milestones Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">Milestone Checkpoints</label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {editMilestonesList.length} checkpoints
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={editNewMilestoneTitle}
                    onChange={(e) => setEditNewMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddMilestone(e);
                      }
                    }}
                    placeholder="Add a milestone (e.g. Final Code Polish)"
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
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto mt-2">
                  {editMilestonesList.map((m, idx) => (
                    <div key={m.id || idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
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
                        title="Remove Checkpoint"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="app-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="app-btn-primary text-xs"
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

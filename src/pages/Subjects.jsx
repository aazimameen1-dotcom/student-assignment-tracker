import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Subjects() {
  const { 
    subjects, 
    tasks, 
    addSubject, 
    deleteSubject,
    editSubject,
    addTask,
    weeklyVelocity 
  } = useContext(AppContext);

  const [activeMenuCode, setActiveMenuCode] = useState(null);

  // Edit Subject states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubName, setEditSubName] = useState('');
  const [editSubDesc, setEditSubDesc] = useState('');
  const [editSubColor, setEditSubColor] = useState('blue');

  const handleEditSubject = (e) => {
    e.preventDefault();
    if (!editSubName) return;
    editSubject(editSubCode, {
      name: editSubName,
      desc: editSubDesc,
      color: editSubColor
    });
    setShowEditModal(false);
  };

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubColor, setNewSubColor] = useState('blue');

  // Task Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2024-10-24');
  const [taskDueTime, setTaskDueTime] = useState('11:59 PM');
  const [taskCategory, setTaskCategory] = useState('This Week');
  const [taskSubjectCode, setTaskSubjectCode] = useState('');

  // Custom Course Contact and Milestones states for Subjects.jsx
  const [taskProfName, setTaskProfName] = useState('');
  const [taskProfHours, setTaskProfHours] = useState('');
  const [taskMilestonesList, setTaskMilestonesList] = useState([]);
  const [taskNewMilestoneTitle, setTaskNewMilestoneTitle] = useState('');

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

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!taskNewMilestoneTitle.trim()) return;
    const newMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskNewMilestoneTitle.trim(),
      completed: false
    };
    setTaskMilestonesList(prev => [...prev, newMilestone]);
    setTaskNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id) => {
    setTaskMilestonesList(prev => prev.filter(m => m.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskSubjectCode) return;

    const dateObj = new Date(taskDueDate);
    const today = new Date('2024-10-12');
    const diffTime = dateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeLeft = `${diffDays} Days`;
    if (diffDays === 0) timeLeft = 'Today';
    else if (diffDays === 1) timeLeft = 'Tomorrow';
    else if (diffDays < 0) timeLeft = 'Overdue';
    else timeLeft = `${diffDays} Days Left`;

    addTask({
      title: taskTitle,
      subject: taskSubjectCode,
      description: taskDesc,
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      category: taskCategory,
      timeLeft,
      professor: {
        name: taskProfName.trim(),
        officeHours: taskProfHours.trim()
      },
      milestones: taskMilestonesList
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskProfName('');
    setTaskProfHours('');
    setTaskMilestonesList([]);
    setTaskNewMilestoneTitle('');
    setShowTaskModal(false);
  };

  const getSubjectColorClasses = (color) => {
    switch (color) {
      case 'indigo':
        return {
          chip: 'bg-indigo-100/50 text-indigo-700 dark:text-indigo-400',
          bar: 'bg-indigo-600',
        };
      case 'purple':
        return {
          chip: 'bg-purple-100/50 text-purple-700 dark:text-purple-400',
          bar: 'bg-purple-600',
        };
      case 'emerald':
        return {
          chip: 'bg-emerald-100/50 text-emerald-700 dark:text-emerald-400',
          bar: 'bg-emerald-600',
        };
      case 'slate':
        return {
          chip: 'bg-slate-100/50 text-slate-700 dark:text-slate-400',
          bar: 'bg-slate-600',
        };
      case 'amber':
        return {
          chip: 'bg-amber-100/50 text-amber-700 dark:text-amber-400',
          bar: 'bg-amber-600',
        };
      case 'blue':
      default:
        return {
          chip: 'bg-blue-100/50 text-blue-700 dark:text-blue-400',
          bar: 'bg-blue-600',
        };
    }
  };

  // Unique pending tasks count across active subjects
  const totalCompletedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalSubjectsCount = subjects.length;

  return (
    <>
      <div className="animate-fade-in max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 text-left pb-24">
      {/* Header */}
      <section className="mb-10">
        <h2 className="font-headline text-headline-lg font-bold text-on-surface mb-2">Subject Mastery</h2>
        <p className="font-body text-body-md text-on-surface-variant max-w-2xl">
          Organize your academic journey. Track progress, manage pending assignments, and focus on what matters most in your curriculum.
        </p>
      </section>

      {/* Bento Grid of Subjects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const colors = getSubjectColorClasses(sub.color);
          const hasPending = sub.pendingCount > 0;

          return (
            <div 
              key={sub.code}
              className="paper-card rounded-2xl p-6 flex flex-col justify-between min-h-[220px] relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full font-mono text-label-md border border-outline-variant/40 ${colors.chip}`}>
                    {sub.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskSubjectCode(sub.code);
                        setTaskTitle('');
                        setTaskDesc('');
                        setShowTaskModal(true);
                      }}
                      className="material-symbols-outlined text-outline cursor-pointer p-1 rounded-full hover:bg-surface-container hover:text-primary transition-all text-[20px]"
                      title="Add Task to this Subject"
                    >
                      add_task
                    </span>
                    <div className="relative">
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuCode(activeMenuCode === sub.code ? null : sub.code);
                        }}
                        className="material-symbols-outlined text-outline cursor-pointer p-1 rounded-full hover:bg-surface-container transition-colors"
                      >
                        more_vert
                      </span>
                    {activeMenuCode === sub.code && (
                      <div className="absolute right-0 top-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-10 w-28 text-left overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditSubCode(sub.code);
                            setEditSubName(sub.name);
                            setEditSubDesc(sub.desc || '');
                            setEditSubColor(sub.color || 'blue');
                            setShowEditModal(true);
                            setActiveMenuCode(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-surface-container text-on-surface font-mono text-[11px] flex items-center gap-1.5 cursor-pointer border-none border-b border-outline-variant/30"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete ${sub.code}? This will also delete all tasks associated with it.`)) {
                              await deleteSubject(sub.code);
                            }
                            setActiveMenuCode(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-error-container/20 text-error font-mono text-[11px] flex items-center gap-1.5 cursor-pointer border-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                <h3 className="font-headline text-headline-sm font-semibold mb-1 text-on-surface">
                  {sub.name}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant line-clamp-1">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <div className={`flex items-center gap-2 ${hasPending ? 'text-primary' : 'text-emerald-600'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {hasPending ? 'assignment' : 'verified'}
                    </span>
                    <span className="font-mono text-label-md font-bold">
                      {hasPending ? `${sub.pendingCount} PENDING` : 'ALL COMPLETED'}
                    </span>
                  </div>
                  <span className="font-mono text-label-md text-outline">{sub.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${colors.bar}`}
                    style={{ width: `${sub.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Subject Action Card */}
        <button 
          onClick={() => setShowSubjectModal(true)}
          className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] hover:bg-surface-container-low transition-all group active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-4xl text-outline mb-4 group-hover:text-primary transition-colors">
            add_circle
          </span>
          <span className="font-headline text-headline-sm font-semibold text-outline group-hover:text-primary transition-colors">
            Add New Subject
          </span>
        </button>
      </div>

      {/* Study Insights Section */}
      <section className="mt-16 bg-surface-container-low rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/30">
        <div className="flex-1">
          <h3 className="font-headline text-headline-md font-bold mb-3 text-on-surface">Weekly Learning Velocity</h3>
          <p className="font-body text-body-md text-on-surface-variant mb-6">
            You've completed {totalCompletedTasks} tasks across {totalSubjectsCount} subjects this week. Your completion rate is 15% higher than last month.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded font-mono text-label-md uppercase active:opacity-80 transition-opacity shadow-sm cursor-pointer">
              View detailed report
            </button>
            <button className="border border-outline text-on-surface px-6 py-2.5 rounded font-mono text-label-md uppercase bg-surface-container-lowest hover:bg-surface transition-colors cursor-pointer">
              Adjust goals
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-48 h-48 flex items-center justify-center relative">
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
              strokeDasharray={`${weeklyVelocity} ${100 - weeklyVelocity}`} 
              strokeDashoffset="0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-headline text-headline-lg font-bold text-primary">{weeklyVelocity}%</span>
            <span className="font-mono text-[10px] text-outline uppercase tracking-widest font-bold">Weekly</span>
          </div>
        </div>
      </section>

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">Add New Subject</h3>
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
                  placeholder="e.g. CSCI-301"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Subject Name *</label>
                <input 
                  type="text" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Description</label>
                <input 
                  type="text" 
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Theme Accent Color</label>
                <select 
                  value={newSubColor}
                  onChange={(e) => setNewSubColor(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                  <option value="slate">Slate</option>
                  <option value="amber">Amber</option>
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

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">Add Task to {taskSubjectCode}</h3>
              <button 
                onClick={() => setShowTaskModal(false)}
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
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Write Literature Review"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Timeline Group</label>
                <select 
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="This Week">This Week</option>
                  <option value="Next Week">Next Week</option>
                  <option value="Later">Later</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Description</label>
                <textarea 
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Summarize criteria and deliverables..."
                  rows="3"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface resize-none"
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-mono text-label-md text-on-surface-variant mb-1">Due Time</label>
                  <input 
                    type="text" 
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
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
                      value={taskProfName}
                      onChange={(e) => setTaskProfName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Thompson"
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-label-md text-on-surface-variant mb-1">Office Hours</label>
                    <input 
                      type="text" 
                      value={taskProfHours}
                      onChange={(e) => setTaskProfHours(e.target.value)}
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
                    value={taskNewMilestoneTitle}
                    onChange={(e) => setTaskNewMilestoneTitle(e.target.value)}
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
                {taskMilestonesList.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
                    {taskMilestonesList.map((m) => (
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
                  onClick={() => setShowTaskModal(false)}
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

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-headline-sm font-semibold text-on-surface">Edit Subject</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleEditSubject} className="space-y-4">
              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Subject Code (Immutable)</label>
                <input 
                  type="text" 
                  value={editSubCode}
                  disabled
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-high text-on-surface-variant opacity-75 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Subject Name *</label>
                <input 
                  type="text" 
                  value={editSubName}
                  onChange={(e) => setEditSubName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Description</label>
                <input 
                  type="text" 
                  value={editSubDesc}
                  onChange={(e) => setEditSubDesc(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block font-mono text-label-md text-on-surface-variant mb-1">Theme Accent Color</label>
                <select 
                  value={editSubColor}
                  onChange={(e) => setEditSubColor(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary text-on-surface"
                >
                  <option value="blue">Blue</option>
                  <option value="indigo">Indigo</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                  <option value="slate">Slate</option>
                  <option value="amber">Amber</option>
                </select>
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
    </>
  );
}

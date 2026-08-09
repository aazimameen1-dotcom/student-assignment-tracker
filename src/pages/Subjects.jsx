import React, { useState } from 'react';

export default function Subjects() {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('web-design');
  const [activeTab, setActiveTab] = useState('pending'); // pending, completed, upcoming
  const [assignmentReminder, setAssignmentReminder] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('14th August');

  // Complete Wireframe Subject Datasets matching PDF Pages 5, 7-12, 15-19
  const courseData = {
    'web-design': {
      code: 'DIC107T',
      title: 'Web Design',
      instructor: 'Mr Salmaan Farooq',
      credits: '3 Credits',
      overallProgress: 72,
      submissionRate: 95,
      description: 'Master the visual language of the web. This course covers typography, color theory, and wireframing to design engaging, human-centered digital environments.',
      modules: [
        { name: 'Design Thinking', pct: 95 },
        { name: 'User Persona', pct: 82 },
        { name: 'Competition Audit', pct: 47 },
        { name: 'Paper Wireframe', pct: 100 },
        { name: 'UX Research', pct: 32 }
      ],
      hoursSpent: [2.5, 5.0, 4.2, 7.8, 8.5, 7.5, 7.0],
      pendingTasks: [
        { id: 'wd-p1', name: 'Hi-Fi Prototype', deadline: '14th August', priority: 'high' },
        { id: 'wd-p2', name: 'Wireframe', deadline: '12th August', priority: 'high' },
        { id: 'wd-p3', name: 'UX Research', deadline: '8th August', priority: 'high' },
        { id: 'wd-p4', name: 'Competition Audit', deadline: '5th August', priority: 'high' },
        { id: 'wd-p5', name: 'User Journey', deadline: '3rd August', priority: 'high' },
        { id: 'wd-p6', name: 'User Flow', deadline: '1st August', priority: 'low' },
        { id: 'wd-p7', name: 'Empathy Map', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'wd-c1', name: 'Course Orientation', date: '20th July', grade: 'Complete' },
        { id: 'wd-c2', name: 'Design Principles Quiz', date: '24th July', grade: 'A-' },
        { id: 'wd-c3', name: 'Mood Board Exercise', date: '28th July', grade: 'A' },
        { id: 'wd-c4', name: 'Research Brief', date: '29th July', grade: 'B+' }
      ]
    },
    'python': {
      code: 'DIC102C',
      title: 'Python',
      instructor: 'Prof Asif Ali Banka',
      credits: '3 Credits',
      overallProgress: 62,
      submissionRate: 54,
      description: 'Build a practical foundation in programming. This course covers Python syntax, data structures, and functions, culminating in a mini project that applies your skills to a real problem.',
      modules: [
        { name: 'File Handling & Libraries', pct: 30 },
        { name: 'Data Structures', pct: 78 },
        { name: 'Functions & OOP', pct: 34 },
        { name: 'Python Basics & Syntax', pct: 100 },
        { name: 'Mini Project', pct: 8 }
      ],
      hoursSpent: [3.0, 4.5, 3.8, 8.0, 8.8, 7.2, 6.5],
      pendingTasks: [
        { id: 'py-p1', name: 'Syntax Practice Exercises', deadline: '14th August', priority: 'high' },
        { id: 'py-p2', name: 'Data Structures Assignment', deadline: '12th August', priority: 'high' },
        { id: 'py-p3', name: 'Functions & OOP Exercise', deadline: '8th August', priority: 'high' },
        { id: 'py-p4', name: 'File Handling Task', deadline: '5th August', priority: 'high' },
        { id: 'py-p5', name: 'Library Exploration Notebook', deadline: '3rd August', priority: 'high' },
        { id: 'py-p6', name: 'Peer Review Feedback', deadline: '1st August', priority: 'low' },
        { id: 'py-p7', name: 'Mini Project Submission', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'py-c1', name: 'Environment Setup', date: '20th July', grade: 'Complete' },
        { id: 'py-c2', name: 'Intro to Python Quiz', date: '24th July', grade: 'A-' },
        { id: 'py-c3', name: 'Basic Syntax Exercises', date: '28th July', grade: 'A' },
        { id: 'py-c4', name: 'Variables & Loops Practice', date: '29th July', grade: 'B+' }
      ]
    },
    'disaster-management': {
      code: 'DIC105E',
      title: 'Disaster Management',
      instructor: 'Prof. Emergency Mgmt',
      credits: '2 Credits',
      overallProgress: 67,
      submissionRate: 86,
      description: 'Learn to prepare for and respond to crises. This course covers risk assessment, emergency planning, and community resilience, using real case studies to examine effective disaster response.',
      modules: [
        { name: 'Risk Assessment', pct: 95 },
        { name: 'Emergency Response Planning', pct: 67 },
        { name: 'Community Resilience', pct: 56 },
        { name: 'Case Studies', pct: 100 },
        { name: 'Policy & Governance', pct: 12 }
      ],
      hoursSpent: [2.0, 3.5, 4.0, 6.5, 7.2, 6.0, 5.5],
      pendingTasks: [
        { id: 'dm-p1', name: 'Risk Assessment Report', deadline: '14th August', priority: 'high' },
        { id: 'dm-p2', name: 'Emergency Plan Draft', deadline: '12th August', priority: 'high' },
        { id: 'dm-p3', name: 'Community Case Study', deadline: '8th August', priority: 'high' },
        { id: 'dm-p4', name: 'Policy Brief', deadline: '5th August', priority: 'high' },
        { id: 'dm-p5', name: 'Group Simulation Exercise', deadline: '3rd August', priority: 'high' },
        { id: 'dm-p6', name: 'Final Response Plan', deadline: '1st August', priority: 'low' },
        { id: 'dm-p7', name: 'Field Notes', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'dm-c1', name: 'Course Introduction', date: '21st July', grade: 'Complete' },
        { id: 'dm-c2', name: 'Hazard Identification Exercise', date: '25th July', grade: 'A' },
        { id: 'dm-c3', name: 'Vulnerability Assessment', date: '29th July', grade: 'B' },
        { id: 'dm-c4', name: 'Syllabus Review', date: '30th July', grade: 'Complete' }
      ]
    },
    'global-literature': {
      code: 'DIC110H',
      title: 'Global Literature',
      instructor: 'Dr Afshana Sultan',
      credits: '3 Credits',
      overallProgress: 72,
      submissionRate: 95,
      description: 'Explore the world through its stories. This course examines how narrative, voice, and cultural context shape literature across borders, moving from close reading to comparative analysis.',
      modules: [
        { name: 'Comparative Narratives', pct: 95 },
        { name: 'Cultural Contexts', pct: 47 },
        { name: 'Translation & Voice', pct: 9 },
        { name: 'Postcolonial Literature', pct: 62 },
        { name: 'Critical Analysis Essay', pct: 32 }
      ],
      hoursSpent: [3.5, 6.0, 5.0, 9.0, 9.5, 8.0, 7.5],
      pendingTasks: [
        { id: 'gl-p1', name: 'Comparative Essay Outline', deadline: '14th August', priority: 'high' },
        { id: 'gl-p2', name: 'Cultural Reading Response', deadline: '12th August', priority: 'high' },
        { id: 'gl-p3', name: 'Translation Analysis', deadline: '8th August', priority: 'high' },
        { id: 'gl-p4', name: 'Postcolonial Text Summary', deadline: '5th August', priority: 'high' },
        { id: 'gl-p5', name: 'Critical Analysis Essay', deadline: '3rd August', priority: 'high' },
        { id: 'gl-p6', name: 'Peer Review Feedback', deadline: '1st August', priority: 'low' },
        { id: 'gl-p7', name: 'Field Visit', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'gl-c1', name: 'Course Orientation Reading', date: '20th July', grade: 'B' },
        { id: 'gl-c2', name: 'Literary Terms Quiz', date: '24th July', grade: 'A-' },
        { id: 'gl-c3', name: 'Author Background Research', date: '28th July', grade: 'A' },
        { id: 'gl-c4', name: 'Syllabus Reflection', date: '29th July', grade: 'B+' }
      ]
    },
    'physics': {
      code: 'DIC102S',
      title: 'Physics',
      instructor: 'Prof Farooq Hussain',
      credits: '4 Credits',
      overallProgress: 54,
      submissionRate: 43,
      description: 'Understand the physical world through experimentation and theory. This course covers mechanics, thermodynamics, and electromagnetism, with hands-on labs reinforcing core physical principles.',
      modules: [
        { name: 'Mechanics', pct: 95 },
        { name: 'Thermodynamics', pct: 2 },
        { name: 'Waves & Optics', pct: 47 },
        { name: 'Modern Physics', pct: 67 },
        { name: 'Electromagnetism', pct: 87 }
      ],
      hoursSpent: [2.8, 4.2, 5.1, 7.0, 8.2, 6.8, 6.0],
      pendingTasks: [
        { id: 'ph-p1', name: 'Mechanics Lab Report', deadline: '14th August', priority: 'high' },
        { id: 'ph-p2', name: 'Thermodynamics Problem Set', deadline: '12th August', priority: 'high' },
        { id: 'ph-p3', name: 'Waves & Optics Quiz', deadline: '8th August', priority: 'high' },
        { id: 'ph-p4', name: 'Electromagnetism Assignment', deadline: '5th August', priority: 'high' },
        { id: 'ph-p5', name: 'Modern Physics Response', deadline: '3rd August', priority: 'high' },
        { id: 'ph-p6', name: 'Lab Practical', deadline: '1st August', priority: 'low' },
        { id: 'ph-p7', name: 'Experiments', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'ph-c1', name: 'Course Orientation', date: '21st July', grade: 'Complete' },
        { id: 'ph-c2', name: 'Units & Measurements Quiz', date: '25th July', grade: 'A' },
        { id: 'ph-c3', name: 'Kinematics Problem Set', date: '29th July', grade: 'B' },
        { id: 'ph-c4', name: 'Lab Safety Training', date: '30th July', grade: 'Complete' }
      ]
    },
    'mathematics': {
      code: 'DIC103M',
      title: 'Mathematics',
      instructor: 'Dr Zahoor Ahmad',
      credits: '4 Credits',
      overallProgress: 89,
      submissionRate: 96,
      description: 'Build a strong quantitative foundation. This course covers core algebra, calculus, and statistics, developing the problem-solving techniques needed for advanced coursework in computing and design.',
      modules: [
        { name: 'Algebra Foundations', pct: 100 },
        { name: 'Calculus I', pct: 24 },
        { name: 'Probability & Statistics', pct: 60 },
        { name: 'Linear Algebra', pct: 100 },
        { name: 'Problem Solving Techniques', pct: 15 }
      ],
      hoursSpent: [3.2, 6.5, 5.5, 8.5, 9.2, 8.4, 7.8],
      pendingTasks: [
        { id: 'ma-p1', name: 'Algebra Problem Set', deadline: '14th August', priority: 'high' },
        { id: 'ma-p2', name: 'Calculus I Assignment', deadline: '12th August', priority: 'high' },
        { id: 'ma-p3', name: 'Probability Worksheet', deadline: '8th August', priority: 'high' },
        { id: 'ma-p4', name: 'Statistics Case Study', deadline: '5th August', priority: 'high' },
        { id: 'ma-p5', name: 'Linear Algebra Exercises', deadline: '3rd August', priority: 'high' },
        { id: 'ma-p6', name: 'Practice Exam', deadline: '1st August', priority: 'low' },
        { id: 'ma-p7', name: 'Test', deadline: '6th August', priority: 'low' }
      ],
      completedTasks: [
        { id: 'ma-c1', name: 'Course Orientation Reading', date: '20th July', grade: 'B' },
        { id: 'ma-c2', name: 'Literary Terms Quiz', date: '24th July', grade: 'A-' },
        { id: 'ma-c3', name: 'Author Background Research', date: '28th July', grade: 'A' },
        { id: 'ma-c4', name: 'Syllabus Reflection', date: '29th July', grade: 'B+' }
      ]
    }
  };

  const currentCourse = courseData[selectedSubjectKey] || courseData['web-design'];

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newDeliverable = {
      id: `custom-${Date.now()}`,
      name: newTitle.trim(),
      deadline: newDeadline,
      priority: 'high'
    };
    currentCourse.pendingTasks.unshift(newDeliverable);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
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
    </div>
  );
}



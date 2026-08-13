import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Complete Wireframe Datasets matching PDF Pages 5, 7-12, 15-19
const COURSE_DATA = {
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
    description: 'Explore the world through its stories. This course examines how narrative, voice, and cultural context shape literature across borders, moving from close reading to comparative analysis of texts.',
    modules: [
      { name: 'Comparative Narratives', pct: 95 },
      { name: 'Cultural Contexts', pct: 47 },
      { name: 'Translation & Voice', pct: 9 },
      { name: 'Postcolonial Literature', pct: 62 },
      { name: 'Critical Analysis Essay', pct: 32 }
    ],
    hoursSpent: [2.2, 4.0, 3.5, 7.5, 8.0, 7.1, 6.8],
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

const COURSE_LIST = [
  { key: 'web-design', title: 'Web Design' },
  { key: 'python', title: 'Python' },
  { key: 'disaster-management', title: 'Disaster Mgmt' },
  { key: 'global-literature', title: 'Global Literature' },
  { key: 'physics', title: 'Physics' },
  { key: 'mathematics', title: 'Mathematics' }
];

export default function Subjects() {
  const { 
    selectedSubjectKey: ctxSubjectKey, 
    setSelectedSubjectKey: setCtxSubjectKey,
    addTask
  } = useContext(AppContext);
  
  // Active selected course state (synchronized with AppContext)
  const selectedKey = ctxSubjectKey || 'web-design';
  const setSelectedKey = (key) => {
    if (setCtxSubjectKey) setCtxSubjectKey(key);
  };

  const [courseState, setCourseState] = useState(COURSE_DATA);
  const [activeTab, setActiveTab] = useState('pending'); // pending, completed, upcoming
  const [assignmentReminder, setAssignmentReminder] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('14th August');

  const currentCourse = courseState[selectedKey] || courseState['web-design'];

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newDeliverable = {
      id: `custom-${Date.now()}`,
      name: newTitle.trim(),
      deadline: newDeadline,
      priority: 'high'
    };

    setCourseState(prev => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        pendingTasks: [newDeliverable, ...prev[selectedKey].pendingTasks]
      }
    }));

    // Also add to global tasks so it syncs across app
    if (addTask) {
      addTask({
        title: newTitle.trim(),
        subject: currentCourse.code,
        description: `Deliverable for ${currentCourse.title}`,
        dueDate: '2024-10-24',
        dueTime: '11:59 PM',
        category: 'This Week',
        timeLeft: '3 Days Left',
        professor: { name: currentCourse.instructor, officeHours: 'Mon/Wed 2-4 PM' },
        milestones: [
          { id: 'm1', title: 'Initial Draft & Plan', completed: false },
          { id: 'm2', title: 'Review & Final Submission', completed: false }
        ]
      });
    }

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left pb-24 select-none">
      
      {/* Top Subject Switcher Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-indigo-100 no-scrollbar">
        {COURSE_LIST.map((c) => {
          const isSelected = selectedKey === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className={`px-5 py-2.5 rounded-xl font-headline text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#231f5c] text-white shadow-md'
                  : 'bg-white text-purple-950 hover:bg-purple-700 hover:text-white border border-slate-200'
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {/* Main Course Progress Section matching PDF Pages 5 & 7-12 */}
      <div className="space-y-6">
        
        {/* Banner Title Card */}
        <div className="bg-[#231f5c] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <span className="text-xs text-purple-200 uppercase font-mono font-bold tracking-wider">{currentCourse.code} • {currentCourse.credits}</span>
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-white mt-0.5">
              Your Progress in {currentCourse.title}
            </h1>
            <p className="text-xs text-purple-100 opacity-90 mt-1">Instructor: {currentCourse.instructor}</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Assignment</span>
          </button>
        </div>

        {/* Bento Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Overall Completion Circular Gauge */}
          <div className="col-span-1 md:col-span-4 assignify-card-lavender p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-200/60"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#231f5c]"
                  strokeDasharray={`${currentCourse.overallProgress}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline text-3xl font-extrabold text-slate-900">{currentCourse.overallProgress}%</span>
                <span className="text-xs text-slate-600 font-semibold mt-0.5">complete</span>
              </div>
            </div>
          </div>

          {/* Card 2: Submission Rate Gauge */}
          <div className="col-span-1 md:col-span-4 assignify-card-purple p-6 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm">
            <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-[11px] font-bold self-start">
              Submission rate
            </div>

            <div className="relative w-28 h-28 flex items-center justify-center my-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-purple-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#8b5cf6]"
                  strokeDasharray={`${currentCourse.submissionRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-headline text-xl font-bold text-slate-900">{currentCourse.submissionRate}%</span>
            </div>

            <p className="text-xs text-purple-950 font-semibold">Submission rate in {currentCourse.title}</p>
          </div>

          {/* Card 3: August 2026 Calendar Widget */}
          <div className="col-span-1 md:col-span-4 bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
              <span>August 2026</span>
              <span className="text-slate-400 cursor-pointer">&lt; &gt;</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-bold">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-700">
              <span className="text-slate-300">30</span>
              <span className="text-purple-700 relative">1<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
              <span>2</span><span>3</span><span>4</span>
              <span className="text-purple-700 relative">5<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
              <span className="text-purple-700 relative">6<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
              
              <span>7</span>
              <span className="text-purple-700 relative">8<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
              <span>9</span><span>10</span><span>11</span>
              <span className="text-purple-700 relative">12<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
              <span>13</span>

              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">14</span>
              <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
            </div>
          </div>

        </div>

        {/* Detailed Layout Grid: Modules, Tasks, Course Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Detailed Module Progress */}
          <div className="col-span-1 md:col-span-4 assignify-card-lavender p-6 rounded-2xl space-y-6 shadow-sm">
            <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-bold inline-block">
              Detailed Module Progress
            </div>

            <div className="space-y-4">
              {currentCourse.modules.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{m.name}</span>
                    <span className="font-mono text-purple-700">{m.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#8b5cf6] h-2 rounded-full" style={{ width: `${m.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reminder Toggle Box */}
            <div className="pt-4 border-t border-indigo-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Assignment Reminder</span>
              <button 
                onClick={() => setAssignmentReminder(!assignmentReminder)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${assignmentReminder ? 'bg-purple-600' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${assignmentReminder ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {/* Middle Column: Tasks & Deliverables Table */}
          <div className="col-span-1 md:col-span-8 space-y-6">
            
            <div className="assignify-card-lavender p-6 rounded-2xl space-y-4 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
                <h3 className="font-headline text-base font-bold text-slate-900">Task and deliverables</h3>
                
                {/* Pending / Completed / Upcoming Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-indigo-100 text-xs font-bold">
                  <button 
                    onClick={() => setActiveTab('pending')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'pending' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'completed' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeTab === 'upcoming' ? 'bg-[#231f5c] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Upcoming
                  </button>
                </div>
              </div>

              {/* Tasks List Table */}
              <div className="space-y-2 text-xs">
                {activeTab === 'pending' && currentCourse.pendingTasks.map((t) => (
                  <div key={t.id} className="bg-white p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                      <span className="font-bold text-slate-900">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 font-mono">{t.deadline}</span>
                      <span className={`material-symbols-outlined text-sm ${t.priority === 'high' ? 'text-black' : 'text-slate-300'}`}>flag</span>
                    </div>
                  </div>
                ))}

                {activeTab === 'completed' && currentCourse.completedTasks.map((t) => (
                  <div key={t.id} className="bg-white p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span className="font-bold text-slate-900">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 font-mono">{t.date}</span>
                      <span className="font-bold text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded">{t.grade}</span>
                    </div>
                  </div>
                ))}

                {activeTab === 'upcoming' && (
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 text-center text-slate-500 italic">
                    Upcoming modules and assignments for next semester will be announced soon.
                  </div>
                )}
              </div>

            </div>

            {/* Course Description Box */}
            <div className="assignify-card-lavender p-6 rounded-2xl space-y-3 text-xs shadow-sm">
              <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg font-bold inline-block">
                Course Description
              </div>
              <div className="space-y-1 font-semibold text-slate-800">
                <p>Instructor: {currentCourse.instructor}</p>
                <p>Course Code: {currentCourse.code}</p>
                <p>Credit Hours: {currentCourse.credits}</p>
              </div>
              <p className="text-slate-700 leading-relaxed pt-2 border-t border-indigo-200/60">
                {currentCourse.description}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-lg font-bold text-slate-900">Add Assignment to {currentCourse.title}</h3>
              <button onClick={() => setShowAddModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-700">close</button>
            </div>

            <form onSubmit={handleAddAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. UX Case Study Report"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deadline Date</label>
                <input 
                  type="text" 
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="e.g. 18th August"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-slate-200 rounded-xl font-bold text-slate-700">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#231f5c] text-white rounded-xl font-bold shadow">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

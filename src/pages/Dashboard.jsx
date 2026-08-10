import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { 
    user,
    setCurrentView, 
    setSelectedSubjectKey
  } = useContext(AppContext);

  const [seeAllSubjects, setSeeAllSubjects] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Alex';

  // All 6 Wireframe Subjects from PDF with mapping keys
  const defaultSubjects = [
    {
      key: 'global-literature',
      code: 'DIC110H',
      title: 'Global Literature',
      desc: 'Explore literary works from different cultures and languages, and analyze how themes and narratives connect across societies.',
      icon: 'auto_stories',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeColor: 'bg-[#231f5c]'
    },
    {
      key: 'web-design',
      code: 'DIC107T',
      title: 'Web Designing',
      desc: 'Learn the principles of layout, visual hierarchy, and user experience to build intuitive, functional websites.',
      icon: 'palette',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeColor: 'bg-purple-600'
    },
    {
      key: 'python',
      code: 'DIC102C',
      title: 'Python',
      desc: 'Build a foundation in programming logic and syntax through hands-on coding exercises and projects.',
      icon: 'code',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeColor: 'bg-blue-600'
    },
    {
      key: 'mathematics',
      code: 'DIC103M',
      title: 'Mathematics',
      desc: 'The fundamental study of patterns, structures, and pure logic, providing quantitative reasoning for algorithmic thinking.',
      icon: 'functions',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeColor: 'bg-indigo-600'
    },
    {
      key: 'disaster-management',
      code: 'DIC105E',
      title: 'Disaster Management',
      desc: 'A comprehensive study of risk assessment, emergency response, and mitigation strategies to effectively manage crises.',
      icon: 'public',
      color: 'bg-[#eef2ff] border-indigo-200 text-indigo-900',
      badgeColor: 'bg-slate-700'
    },
    {
      key: 'physics',
      code: 'DIC102S',
      title: 'Physics',
      desc: 'A foundational study of the natural world, utilizing mathematical frameworks to understand forces of nature and properties of matter.',
      icon: 'science',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeColor: 'bg-[#231f5c]'
    }
  ];

  const visibleSubjects = seeAllSubjects ? defaultSubjects : defaultSubjects.slice(0, 3);

  const handleCourseClick = (key) => {
    if (setSelectedSubjectKey) {
      setSelectedSubjectKey(key);
    }
    setCurrentView('subjects');
  };

  const upcomingDeadlines = [
    {
      id: 'dl-1',
      title: 'Global Literature Essay',
      text: 'Your biographical analysis essay on Toba Tek Singh is due Monday, August 24 by 11:59 PM. Please focus on the literary devices discussed in our last lecture.'
    },
    {
      id: 'dl-2',
      title: 'Mathematics Problem Set',
      text: 'Problem sets covering evaluation metrics and differentiation are due Wednesday, August 19 by 5:00 PM. Show all mathematical steps clearly. Late submissions will not be accepted.'
    },
    {
      id: 'dl-3',
      title: 'Web Design Submission',
      text: 'Interactive wireframe submissions are due Friday, August 14 by 11:59 PM. Prioritize intuitive user flows over complex coding, and submit your links through the student portal.'
    }
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left pb-24">
      
      {/* Welcome Banner Header (PDF Page 13 & 14) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {firstName}!
          </h1>
        </div>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
          <span className="material-symbols-outlined text-3xl md:text-4xl">menu_book</span>
        </div>
      </div>

      {/* Top Bento Stats Overview (PDF Page 13 & 14) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Assignment Overview */}
        <div className="assignify-card-lavender p-6 flex flex-col justify-between shadow-sm">
          <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold self-start mb-4">
            Assignment Overview
          </div>
          
          <div className="text-center my-2">
            <span className="text-5xl font-extrabold text-slate-900 block font-headline">25</span>
            <span className="text-xs text-slate-600 font-medium">Total Tasks</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 my-3 overflow-hidden">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium text-center mb-4">18 Completed(72%)</p>

          <div className="flex items-center justify-around text-xs pt-2 border-t border-indigo-200/60">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-sm bg-emerald-100 rounded-full p-0.5">check</span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1 text-amber-700 font-semibold">
              <span className="material-symbols-outlined text-sm bg-amber-100 rounded-full p-0.5">star</span>
              <span>6 in progress</span>
            </div>
            <div className="flex items-center gap-1 text-red-700 font-semibold">
              <span className="material-symbols-outlined text-sm bg-red-100 rounded-full p-0.5">close</span>
              <span>1 overdue</span>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Progress */}
        <div className="assignify-card-lavender p-6 flex flex-col justify-between shadow-sm">
          <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold self-start mb-4">
            Academic Progress
          </div>

          <div className="flex flex-col items-center my-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#231f5c]"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-headline text-2xl font-extrabold text-slate-900">78%</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-700 font-semibold">Avg progress across Subjects</p>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">Ahead of schedule</p>
          </div>
        </div>

        {/* Card 3: Grade Summary Graph */}
        <div className="assignify-card-lavender p-6 flex flex-col justify-between shadow-sm">
          <div className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold self-start mb-2">
            Grade Summary
          </div>

          <div className="my-2 bg-white/60 p-4 rounded-xl border border-indigo-100 relative h-36 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-bold text-purple-900">
              <span className="bg-purple-100 px-2 py-0.5 rounded">1st Semester 8.7 SGPA</span>
              <span className="bg-purple-200 px-2 py-0.5 rounded">2nd Semester 9.21 SGPA</span>
            </div>

            {/* Simulated Line Graph Curve matching PDF */}
            <svg className="w-full h-20 overflow-visible" viewBox="0 0 200 60">
              <path
                d="M 10 45 Q 60 15, 100 35 T 190 10"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 Q 70 30, 120 40 T 190 20"
                fill="none"
                stroke="#231f5c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-[11px] text-slate-500 text-center font-medium">Consistent upward SGPA trajectory</p>
        </div>

      </div>

      {/* Subjects Section (PDF Page 13 & 14) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-sm">
            Subjects
          </div>
          <button 
            onClick={() => setSeeAllSubjects(!seeAllSubjects)}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer hover:underline"
          >
            {seeAllSubjects ? 'see less' : 'see all'}
          </button>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-4">
          {visibleSubjects.map((sub) => (
            <div 
              key={sub.code}
              onClick={() => handleCourseClick(sub.key)}
              className={`${sub.color} p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-[#231f5c] flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">{sub.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-slate-900">{sub.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{sub.desc}</p>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseClick(sub.key);
                }}
                className="px-6 py-2.5 bg-[#231f5c] hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines Section (PDF Page 13 & 14) */}
      <div className="space-y-4">
        <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-sm inline-block">
          Upcoming Deadlines
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingDeadlines.map((dl) => (
            <div 
              key={dl.id}
              onClick={() => setCurrentView('subjects')}
              className="assignify-card-lavender p-6 flex flex-col justify-between hover:border-purple-300 transition-all cursor-pointer shadow-sm"
            >
              <p className="text-xs text-slate-700 leading-relaxed">{dl.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section (PDF Page 6, 13, 14) */}
      <footer className="bg-[#1e1b4b] text-white p-8 md:p-12 rounded-3xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3">Support & Feedback</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Help & FAQ</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Report a Bug</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Suggest a Feature</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3">Academic Utility</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Academic Calendar</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">University Portal</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Study Resources</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3">System & Settings</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Sync Status</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">theme</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">version 2.0</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3">Legal & Privacy</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Privacy Policy</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Export My Data</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer">Copyright © 2026 Assignify</p>
        </div>
      </footer>

    </div>
  );
}


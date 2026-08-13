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
      color: 'bg-indigo-50/80 border-indigo-200/80 text-indigo-950 hover:border-indigo-400',
      badgeColor: 'bg-[#231f5c]'
    },
    {
      key: 'web-design',
      code: 'DIC107T',
      title: 'Web Designing',
      desc: 'Learn the principles of layout, visual hierarchy, and user experience to build intuitive, functional websites.',
      icon: 'palette',
      color: 'bg-purple-50/80 border-purple-200/80 text-purple-950 hover:border-purple-400',
      badgeColor: 'bg-purple-600'
    },
    {
      key: 'python',
      code: 'DIC102C',
      title: 'Python',
      desc: 'Build a foundation in programming logic and syntax through hands-on coding exercises and projects.',
      icon: 'code',
      color: 'bg-blue-50/80 border-blue-200/80 text-blue-950 hover:border-blue-400',
      badgeColor: 'bg-blue-600'
    },
    {
      key: 'mathematics',
      code: 'DIC103M',
      title: 'Mathematics',
      desc: 'The fundamental study of patterns, structures, and pure logic, providing quantitative reasoning for algorithmic thinking.',
      icon: 'functions',
      color: 'bg-purple-50/80 border-purple-200/80 text-purple-950 hover:border-purple-400',
      badgeColor: 'bg-indigo-600'
    },
    {
      key: 'disaster-management',
      code: 'DIC105E',
      title: 'Disaster Management',
      desc: 'A comprehensive study of risk assessment, emergency response, and mitigation strategies to effectively manage crises.',
      icon: 'public',
      color: 'bg-[#eef2ff]/80 border-indigo-200/80 text-indigo-950 hover:border-indigo-400',
      badgeColor: 'bg-slate-700'
    },
    {
      key: 'physics',
      code: 'DIC102S',
      title: 'Physics',
      desc: 'A foundational study of the natural world, utilizing mathematical frameworks to understand forces of nature and properties of matter.',
      icon: 'science',
      color: 'bg-purple-50/80 border-purple-200/80 text-purple-950 hover:border-purple-400',
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
      subject: 'DIC110H',
      due: 'Aug 24, 11:59 PM',
      text: 'Your biographical analysis essay on Toba Tek Singh is due Monday, August 24 by 11:59 PM. Focus on literary devices.'
    },
    {
      id: 'dl-2',
      title: 'Mathematics Problem Set',
      subject: 'DIC103M',
      due: 'Aug 19, 5:00 PM',
      text: 'Problem sets covering evaluation metrics and differentiation are due Wednesday, August 19 by 5:00 PM.'
    },
    {
      id: 'dl-3',
      title: 'Web Design Wireframes',
      subject: 'DIC107T',
      due: 'Aug 14, 11:59 PM',
      text: 'Interactive wireframe submissions are due Friday, August 14 by 11:59 PM. Prioritize intuitive user flows.'
    }
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 text-left pb-24">
      
      {/* Welcome Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1e1b4b] via-[#231f5c] to-[#312e81] rounded-3xl p-6 md:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-purple-200 border border-white/10 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Semester 2 • Active Track
          </span>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-purple-200/90 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
            You have <strong className="text-white font-bold">3 assignments</strong> due this week. Stay focused and keep your academic momentum high!
          </p>
        </div>

        <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-purple-200 shadow-inner shrink-0 hidden sm:flex">
          <span className="material-symbols-outlined text-3xl md:text-5xl">school</span>
        </div>

        {/* Ambient Glow Decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Top Bento Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Assignment Overview */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-indigo-100/80 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold font-mono">
              Assignment Overview
            </span>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              72% Done
            </span>
          </div>
          
          <div className="text-center my-2">
            <span className="text-5xl font-extrabold text-slate-900 block font-headline tracking-tight">25</span>
            <span className="text-xs text-slate-600 font-medium">Total Semester Tasks</span>
          </div>

          <div className="w-full bg-slate-200/80 rounded-full h-2.5 my-3 overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium text-center mb-4">18 Completed out of 25 Total Tasks</p>

          <div className="flex items-center justify-around text-xs pt-3 border-t border-slate-200/80">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-xs bg-emerald-100 text-emerald-700 rounded-full p-1">check</span>
              <span>18 Completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="material-symbols-outlined text-xs bg-amber-100 text-amber-700 rounded-full p-1">update</span>
              <span>6 Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="material-symbols-outlined text-xs bg-rose-100 text-rose-700 rounded-full p-1">warning</span>
              <span>1 Due Soon</span>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Progress */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-indigo-100/80 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold font-mono">
              Academic Progress
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ahead
            </span>
          </div>

          <div className="flex flex-col items-center my-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-100"
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
            <p className="text-xs text-slate-700 font-semibold">Average Course Completion</p>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">Top 10% Performance Bracket</p>
          </div>
        </div>

        {/* Card 3: Grade Summary Graph */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-indigo-100/80 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-[#231f5c] text-white px-3 py-1 rounded-lg text-xs font-semibold font-mono">
              Grade Summary
            </span>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-lg">
              SGPA 9.21
            </span>
          </div>

          <div className="my-2 bg-white/80 p-4 rounded-xl border border-indigo-100/80 relative h-36 flex flex-col justify-between shadow-inner">
            <div className="flex justify-between items-center text-[10px] font-bold text-purple-900 font-mono">
              <span className="bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200">Sem 1: 8.70</span>
              <span className="bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-900">Sem 2: 9.21</span>
            </div>

            {/* Simulated Line Graph Curve */}
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

      {/* Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-sm shadow-sm inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-base">auto_stories</span>
            <span>Enrolled Subjects</span>
          </div>
          <button 
            onClick={() => setSeeAllSubjects(!seeAllSubjects)}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer hover:underline flex items-center gap-1"
          >
            <span>{seeAllSubjects ? 'Show Less' : 'View All 6 Subjects'}</span>
            <span className="material-symbols-outlined text-sm">{seeAllSubjects ? 'expand_less' : 'expand_more'}</span>
          </button>
        </div>

        {/* Subjects Cards Grid */}
        <div className="space-y-4">
          {visibleSubjects.map((sub) => (
            <div 
              key={sub.code}
              onClick={() => handleCourseClick(sub.key)}
              className={`${sub.color} p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-[#231f5c] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{sub.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">{sub.code}</span>
                    <h3 className="font-headline font-bold text-lg text-slate-950">{sub.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{sub.desc}</p>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseClick(sub.key);
                }}
                className="px-5 py-2.5 bg-[#231f5c] hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap self-start md:self-auto flex items-center gap-1.5 group-hover:bg-purple-800"
              >
                <span>View Course Details</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="space-y-4">
        <div className="bg-[#231f5c] text-white px-4 py-1.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>Upcoming Deadlines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingDeadlines.map((dl) => (
            <div 
              key={dl.id}
              onClick={() => setCurrentView('subjects')}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-indigo-100 hover:border-purple-300 transition-all cursor-pointer shadow-sm hover:shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">{dl.subject}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    {dl.due}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">{dl.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{dl.text}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold">
                <span>View Requirement</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#1e1b4b] text-white p-8 md:p-12 rounded-3xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs border border-indigo-900/50 shadow-2xl">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3 font-headline">Support & Help</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Help Center & FAQ</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Report an Issue</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Feature Requests</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3 font-headline">Academic Tools</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentView('calendar')}>Academic Calendar</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">University Portal</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Digital Library</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3 font-headline">System Details</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Sync Active
          </p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentView('settings')}>Preferences</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors font-mono">v2.4.0 (Stitch Engine)</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-purple-300 mb-3 font-headline">Privacy & Rights</h4>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Data Export</p>
          <p className="text-purple-200/80 hover:text-white cursor-pointer transition-colors">Copyright © 2026 Assignify</p>
        </div>
      </footer>

    </div>
  );
}



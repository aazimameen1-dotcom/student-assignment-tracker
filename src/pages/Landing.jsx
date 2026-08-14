import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Landing() {
  const { user, setCurrentView } = useContext(AppContext);

  const handleAction = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const features = [
    {
      icon: 'checklist',
      title: 'Task & Milestone Engine',
      desc: 'Break down complex assignments into weighted milestones with real-time progress calculations.',
      tag: 'Productivity'
    },
    {
      icon: 'auto_stories',
      title: 'Course Curriculum Hub',
      desc: 'Centralize syllabus links, professor notes, credit points, and deliverable deadlines in one place.',
      tag: 'Academics'
    },
    {
      icon: 'insights',
      title: 'SGPA & Performance Analytics',
      desc: 'Visualize academic growth with automated performance charts, study habit insights, and target tracking.',
      tag: 'Analytics'
    },
    {
      icon: 'calendar_month',
      title: 'Smart Academic Calendar',
      desc: 'Never miss an exam, assignment submission, or project review with interactive agenda scheduling.',
      tag: 'Scheduling'
    }
  ];

  const stats = [
    { label: 'Avg. Grade Improvement', value: '+14%', icon: 'trending_up' },
    { label: 'Deadlines Met On Time', value: '98.6%', icon: 'task_alt' },
    { label: 'Active Study Hours Saved', value: '4.5 hrs/wk', icon: 'schedule' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans select-none animate-fade-in">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-lg">school</span>
            </div>
            <span className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">Scholar</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('login')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={handleAction}
              className="app-btn-primary text-xs"
            >
              <span>{user ? 'Open Workspace' : 'Get Started'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-12 py-12 md:py-16 space-y-20">
        
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Academic Operating System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white leading-tight tracking-tight">
                Master Your Studies. <br />
                <span className="text-blue-400">Zero Overwhelm.</span>
              </h1>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                The modern student workspace designed to organize course deadlines, track milestone progress, and elevate your academic trajectory with clarity.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button 
                  onClick={handleAction}
                  className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span>{user ? 'Go to Dashboard' : 'Launch Workspace'}</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="px-5 py-3.5 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Right Dynamic Live Interactive Card Widget */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-5 text-left">
                
                {/* Live Header Pill */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                  <span className="text-slate-300">Live Academic Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                    Active Term
                  </span>
                </div>

                {/* Sample Live Task Card */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[10px] font-bold text-blue-300 uppercase">DIC107T • Web Design</span>
                    <span className="text-emerald-400 font-bold text-[11px]">Due Today</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white">Hi-Fi Prototype & Documentation</h4>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Milestones Completed</span>
                      <span className="font-bold">4 / 5 (80%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-700" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Quick Performance Strip */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Semester SGPA</span>
                    <span className="text-xl font-bold font-heading text-white mt-0.5 block">3.84</span>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Target Goal</span>
                    <span className="text-xl font-bold font-heading text-blue-300 mt-0.5 block">3.90</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Live Academic Stats Counter */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="app-card p-6 flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-heading text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Features & Capabilities</span>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900">Engineered for Academic Precision</h2>
            <p className="text-slate-500 text-xs">Everything you need to streamline coursework, stay ahead of deadlines, and maintain focus.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((f, idx) => (
              <div key={idx} className="app-card p-6 space-y-4 hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">{f.icon}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="app-card p-8 md:p-12 text-center bg-slate-900 text-white rounded-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading">Ready to Take Control of Your Academic Journey?</h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Join students and researchers using Scholar to eliminate deadline anxiety and achieve higher academic standing.
          </p>
          <div>
            <button 
              onClick={handleAction}
              className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <span className="material-symbols-outlined text-base">rocket_launch</span>
            </button>
          </div>
        </section>

      </main>

      {/* Modern Clean Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 text-xs text-slate-500 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-sm">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">S</span>
                <span>SCHOLAR</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Empowering university scholars through intelligent curriculum tracking.</p>
            </div>

            <div className="flex flex-wrap gap-6 font-medium text-xs">
              <button 
                type="button"
                onClick={() => setCurrentView('privacy-policy')}
                className="hover:text-slate-900 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('terms-of-service')}
                className="hover:text-slate-900 cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('data-rights')}
                className="hover:text-slate-900 cursor-pointer"
              >
                Privacy & Data Rights
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 Scholar. All rights reserved.</p>
            <p>
              Privacy & Support: <a href="mailto:privacy@scholar.app" className="text-slate-600 font-semibold underline">privacy@scholar.app</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

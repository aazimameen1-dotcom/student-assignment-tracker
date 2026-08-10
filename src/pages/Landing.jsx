import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Landing() {
  const { user, setCurrentView } = useContext(AppContext);

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleGetStartedClick = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans select-none animate-fade-in">
      
      {/* Top Navbar matching PDF Page 6 */}
      <header className="max-w-7xl mx-auto w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <span className="text-2xl font-bold font-headline text-[#231f5c] tracking-tight">Assignify</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLoginClick}
            className="px-5 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Login
          </button>
          <button 
            onClick={handleGetStartedClick}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-sm transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-12 py-6 space-y-16">
        
        {/* Hero Section matching PDF Page 6 */}
        <section className="bg-[#c7d2fe]/40 rounded-3xl p-8 md:p-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
          
          <div className="col-span-1 md:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-[#1e1b4b] leading-tight">
              Master Your <br />
              <span className="text-[#231f5c]">Academic Journey</span>
            </h1>
            
            <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-xl">
              Reduce stress, hit every deadline, and achieve academic excellence with an intelligent tracking system designed for serious students and researchers. Let the tool disappear so your work can shine.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button 
                onClick={handleGetStartedClick}
                className="px-6 py-3 bg-[#231f5c] hover:bg-purple-900 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Start Tracking Free</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Hero Graphic Graphic Card */}
          <div className="col-span-1 md:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-md bg-purple-100/60 p-6 rounded-3xl border border-purple-200/50 shadow-inner space-y-4">
              {/* Trend Line Graphic */}
              <div className="h-28 relative bg-white/70 rounded-2xl p-4 flex items-end justify-around overflow-hidden border border-purple-100">
                <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <path d="M 10,80 Q 50,20 90,60 T 180,20" fill="none" stroke="#8b5cf6" strokeWidth="4" />
                  <circle cx="10" cy="80" r="5" fill="#231f5c" />
                  <circle cx="90" cy="60" r="5" fill="#231f5c" />
                  <circle cx="180" cy="20" r="6" fill="#8b5cf6" />
                </svg>
              </div>

              {/* Book Stack Illustration Graphic */}
              <div className="flex justify-around items-end pt-2">
                <div className="space-y-1.5 w-1/2">
                  <div className="h-5 bg-cyan-400 rounded-lg shadow-sm w-full border border-cyan-500"></div>
                  <div className="h-5 bg-white rounded-lg shadow-sm w-4/5 border border-slate-300"></div>
                  <div className="h-5 bg-rose-500 rounded-lg shadow-sm w-full border border-rose-600"></div>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="w-4 h-16 bg-[#231f5c] rounded-t-lg"></div>
                  <div className="w-4 h-24 bg-[#8b5cf6] rounded-t-lg"></div>
                  <div className="w-4 h-20 bg-indigo-900 rounded-t-lg"></div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Tools for Deep Work Section matching PDF Page 6 */}
        <section className="space-y-10 text-center">
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold font-headline text-[#1e1b4b]">Tools for Deep Work</h2>
            <p className="text-slate-600 text-sm">
              Everything you need to maintain academic discipline without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            
            {/* Feature Card 1: Intelligent Assignment Tracker */}
            <div className="col-span-1 md:col-span-7 bg-[#eef2ff] p-8 rounded-3xl border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold font-headline text-[#1e1b4b]">Intelligent Assignment Tracker</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Break down massive research papers and complex projects into manageable, highly legible task lists. Our structured layout reduces cognitive load.
                </p>
                <div className="pt-4">
                  <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 mt-1 block text-right font-mono">67%</span>
                </div>
              </div>

              {/* Icon Graphic */}
              <div className="w-28 h-28 rounded-full border-4 border-[#8b5cf6] flex items-center justify-center bg-white shadow-md flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-[#8b5cf6]">task_alt</span>
              </div>
            </div>

            {/* Feature Card 2: Interactive Calendar */}
            <div className="col-span-1 md:col-span-5 bg-[#eef2ff] p-8 rounded-3xl border border-indigo-100/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline text-[#1e1b4b]">Interactive Calendar</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Visualize your semester at a glance. Fixed grid philosophy ensures deadlines never slip through the cracks.
                </p>
              </div>

              {/* August 2026 Mini Grid Preview */}
              <div className="bg-white/80 p-4 rounded-2xl border border-indigo-100 space-y-2 font-mono text-[10px]">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>August 2026</span>
                  <span>&lt; &gt;</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-slate-400 font-bold">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-700">
                  <span className="text-slate-300">30</span>
                  <span className="text-purple-700 font-extrabold relative">1<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
                  <span>2</span><span>3</span><span>4</span>
                  <span className="text-purple-700 font-extrabold relative">5<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
                  <span className="text-purple-700 font-extrabold relative">6<span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></span></span>
                </div>
              </div>
            </div>

            {/* Feature Card 3 (Wide): Daily Habit Logging */}
            <div className="col-span-1 md:col-span-12 bg-[#eef2ff] p-8 md:p-10 rounded-3xl border border-indigo-100/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="col-span-1 md:col-span-7 space-y-2">
                <h3 className="text-xl font-bold font-headline text-[#1e1b4b]">Daily Habit Logging</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Build momentum with minimal friction. Track study sessions, reading hours, and deep work intervals. Progress is highlighted in clear, actionable metrics.
                </p>
              </div>

              <div className="col-span-1 md:col-span-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-purple-900">
                    <span>Deep Work Velocity</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-indigo-200/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold text-purple-900">
                    <span>Reading Goal Progress</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-indigo-200/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Footer matching PDF Page 6 */}
      <footer className="bg-[#231f5c] text-white mt-16 py-12 px-6 md:px-12 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs leading-relaxed">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-purple-200">Support &amp; Feedback</h4>
            <ul className="space-y-1.5 opacity-80">
              <li className="hover:text-purple-300 cursor-pointer">Help &amp; FAQ</li>
              <li className="hover:text-purple-300 cursor-pointer">Report a Bug</li>
              <li className="hover:text-purple-300 cursor-pointer">Suggest a Feature</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-purple-200">Academic Utility</h4>
            <ul className="space-y-1.5 opacity-80">
              <li className="hover:text-purple-300 cursor-pointer">Academic Calendar</li>
              <li className="hover:text-purple-300 cursor-pointer">University Portal</li>
              <li className="hover:text-purple-300 cursor-pointer">Study Resources</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-purple-200">System &amp; Settings</h4>
            <ul className="space-y-1.5 opacity-80">
              <li className="hover:text-purple-300 cursor-pointer">Sync Status</li>
              <li className="hover:text-purple-300 cursor-pointer">Theme</li>
              <li className="hover:text-purple-300 cursor-pointer">Version</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-purple-200">Legal &amp; Privacy</h4>
            <ul className="space-y-1.5 opacity-80">
              <li className="hover:text-purple-300 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-purple-300 cursor-pointer">Export My Data</li>
              <li className="hover:text-purple-300 cursor-pointer">&copy; Assignify 2026</li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}

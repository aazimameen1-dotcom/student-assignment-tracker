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
      
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <span className="text-2xl font-extrabold font-headline text-slate-900 tracking-tight">Scholar Track</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLoginClick}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={handleGetStartedClick}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-12 py-6 space-y-16">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="col-span-1 md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Scholar Academic System
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-white leading-tight tracking-tight">
                Master Your <br />
                <span className="text-blue-400">Academic Journey</span>
              </h1>
              
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                Reduce cognitive load, never miss a deadline, and track course progress with precision. Designed for serious students and researchers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button 
                  onClick={handleGetStartedClick}
                  className="px-7 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Workspace</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="col-span-1 md:col-span-5 flex justify-center items-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>SGPA Trajectory</span>
                  <span className="text-emerald-400 font-bold">+0.51 Progress</span>
                </div>
                {/* Graph Graphic */}
                <div className="h-28 relative bg-black/20 rounded-2xl p-4 flex items-end justify-around overflow-hidden border border-white/10">
                  <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d="M 10,80 Q 50,20 90,60 T 180,20" fill="none" stroke="#60a5fa" strokeWidth="4" />
                    <circle cx="10" cy="80" r="5" fill="#38bdf8" />
                    <circle cx="90" cy="60" r="5" fill="#38bdf8" />
                    <circle cx="180" cy="20" r="6" fill="#60a5fa" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-2">
                  <span className="text-slate-300">18 Completed Tasks</span>
                  <span className="text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">72% Goal Met</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold font-headline text-[#1e1b4b]">Tools for Deep Work</h2>
            <p className="text-slate-600 text-xs">Everything you need to maintain academic discipline without clutter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="glass-panel p-8 rounded-3xl border border-indigo-100/80 hover:border-indigo-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-slate-900">Course Progress Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualize module completion rates, submission metrics, and professor requirements across all enrolled subjects.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-indigo-100/80 hover:border-indigo-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">assignment</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-slate-900">Tasks & Deliverables</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by urgency, track milestone sub-tasks, and toggle completion states seamlessly.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-indigo-100/80 hover:border-indigo-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-slate-900">Academic Calendar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full month agenda view with deadline highlights and exam schedule syncing.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>Copyright © 2026 Assignify. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-800 cursor-pointer">Support</span>
        </div>
      </footer>

    </div>
  );
}

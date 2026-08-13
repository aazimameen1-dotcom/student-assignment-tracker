import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Analytics() {
  const { setCurrentView } = useContext(AppContext);
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');

  return (
    <div className="animate-fade-in max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-left pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#0f172a] tracking-tight">Performance Analytics</h2>
          <p className="font-body text-sm text-slate-600 mt-1">Deep insights into your academic journey and grade trajectory.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none cursor-pointer shadow-sm"
          >
            <option>All Semesters</option>
            <option>Fall 2023</option>
            <option>Spring 2024</option>
            <option>Fall 2024</option>
          </select>
          <button 
            onClick={() => alert("Downloading academic analytics report...")}
            className="flex items-center gap-2 bg-[#0f172a] text-white rounded-lg px-4 py-1.5 font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-40 shadow-sm hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="font-headline text-sm font-semibold text-slate-600">Cumulative GPA</h3>
            <span className="material-symbols-outlined text-blue-600">trending_up</span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold text-[#0f172a]">3.92</div>
            <div className="font-mono text-xs text-emerald-600 font-bold mt-1">+0.05 from last semester</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-40 shadow-sm hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="font-headline text-sm font-semibold text-slate-600">Total Credits</h3>
            <span className="material-symbols-outlined text-slate-800">library_books</span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold text-[#0f172a]">84</div>
            <div className="font-mono text-xs text-slate-500 mt-1">out of 120 required</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-40 shadow-sm hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="font-headline text-sm font-semibold text-slate-600">Study Hours (Avg)</h3>
            <span className="material-symbols-outlined text-slate-800">schedule</span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold text-[#0f172a]">28 <span className="text-xs font-normal text-slate-500">hrs/wk</span></div>
            <div className="font-mono text-xs text-blue-600 font-bold mt-1">Consistent pattern</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-40 shadow-sm hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="font-headline text-sm font-semibold text-slate-600">Research Output</h3>
            <span className="material-symbols-outlined text-slate-800">science</span>
          </div>
          <div>
            <div className="font-headline text-4xl font-extrabold text-[#0f172a]">12</div>
            <div className="font-mono text-xs text-slate-500 mt-1">Papers & Projects</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GPA Trend Over Semesters */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col min-h-[340px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-lg font-bold text-[#0f172a]">GPA Trend Over Semesters</h3>
            <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md">Target: 3.90+</span>
          </div>

          <div className="flex-1 relative w-full min-h-[220px]">
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 200" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="800" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="200" x2="800" y2="200" stroke="#f1f5f9" strokeWidth="1" />
              <path d="M0,180 L100,150 L200,160 L300,120 L400,90 L500,110 L600,60 L700,40 L800,20 L800,200 L0,200 Z" fill="#0f172a" fillOpacity="0.06" />
              <path d="M0,180 L100,150 L200,160 L300,120 L400,90 L500,110 L600,60 L700,40 L800,20" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="150" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="200" cy="160" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="300" cy="120" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="400" cy="90" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="500" cy="110" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="600" cy="60" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="700" cy="40" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between mt-4 font-mono text-xs text-slate-500">
            <span>Fall '21</span>
            <span>Spring '22</span>
            <span>Fall '22</span>
            <span>Spring '23</span>
            <span>Fall '23</span>
            <span>Spring '24</span>
          </div>
        </div>

        {/* Credit Distribution Donut */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-between min-h-[340px] shadow-sm">
          <h3 className="font-headline text-lg font-bold text-[#0f172a] self-start mb-4">Credit Distribution</h3>
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className="text-[#0f172a]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeWidth="4" />
              <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-3xl font-extrabold text-[#0f172a]">84</span>
              <span className="font-mono text-[10px] uppercase text-slate-500 font-bold">Credits</span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0f172a]"></div><span>Major Core</span></div>
              <span className="font-mono font-bold text-slate-800">60%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Electives</span></div>
              <span className="font-mono font-bold text-slate-800">25%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200"></div><span>Gen Ed</span></div>
              <span className="font-mono font-bold text-slate-800">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

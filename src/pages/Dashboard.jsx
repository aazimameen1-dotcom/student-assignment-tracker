import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Dashboard() {
  const { user, tasks, subjects, setCurrentView, setSelectedTaskId, updateTaskMilestone } = useContext(AppContext);
  const [quickNote, setQuickNote] = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const overallProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 60;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-10 text-left p-4 md:p-8 pb-24">
      {/* Progress Header Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Overall Progress Gauge */}
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center xl:col-span-1 shadow-sm border border-slate-200 hover:border-blue-500 transition-all">
          <div className="text-center w-full">
            <h3 className="font-headline text-slate-700 mb-6 text-[15px] tracking-wide font-semibold">Overall Progress</h3>
            <div className="relative w-36 h-36 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle 
                  className="transition-all duration-1000 ease-out" 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="42" 
                  stroke="url(#progressGrad)" 
                  strokeDasharray="263.89" 
                  strokeDashoffset={263.89 - (263.89 * overallProgress) / 100} 
                  strokeLinecap="round" 
                  strokeWidth="8" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-headline text-3xl text-slate-800 font-extrabold tracking-tighter">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-2xl p-8 xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm border border-slate-200">
          {/* Current GPA */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-slate-600 text-xs font-bold tracking-wider uppercase">Current GPA</h3>
              <span className="font-mono text-blue-600 font-bold text-lg bg-blue-50 px-3 py-1 rounded-md">3.8</span>
            </div>
            <div className="h-28 rounded-xl flex items-end px-1 pb-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="fillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 C15,35 20,15 35,25 C50,35 55,5 70,10 C85,15 90,30 100,20 L100,40 L0,40 Z" fill="url(#fillGrad1)" />
                <path d="M0,35 C15,35 20,15 35,25 C50,35 55,5 70,10 C85,15 90,30 100,20" fill="none" stroke="url(#lineGrad1)" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-slate-600 text-xs font-bold tracking-wider uppercase">Tasks Completed</h3>
              <span className="font-mono text-slate-800 font-bold text-base">
                <span className="text-slate-900">{completedCount}</span> <span className="text-slate-400 font-normal">/ {tasks.length}</span>
              </span>
            </div>
            <div className="h-28 rounded-xl flex items-end px-1 pb-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/50 to-transparent"></div>
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="fillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,30 C20,35 30,25 45,20 C60,15 75,5 100,10 L100,40 L0,40 Z" fill="url(#fillGrad2)" />
                <path d="M0,30 C20,35 30,25 45,20 C60,15 75,5 100,10" fill="none" stroke="url(#lineGrad2)" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Course Performance */}
          <div className="flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-slate-600 text-xs font-bold tracking-wider uppercase">Course Performance</h3>
              <span className="font-mono text-blue-600 font-bold text-sm bg-blue-50 px-2.5 py-1 rounded-md">Top 15%</span>
            </div>
            <div className="h-28 rounded-xl flex items-end px-1 pb-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="fillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,25 C20,15 40,30 60,15 C80,0 90,10 100,5 L100,40 L0,40 Z" fill="url(#fillGrad3)" />
                <path d="M0,25 C20,15 40,30 60,15 C80,0 90,10 100,5" fill="none" stroke="url(#lineGrad3)" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Pending Scholarly Works Table */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-headline text-slate-800 text-lg font-bold">Pending Scholarly Works</h3>
                <p className="text-xs text-slate-500 mt-1">Upcoming assignments and active deliverables</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentView('tasks')}
                  className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>New Task</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 pl-6 font-mono text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-100">Assignment</th>
                    <th className="p-4 font-mono text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-100">Course</th>
                    <th className="p-4 font-mono text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-100">Due Date</th>
                    <th className="p-4 font-mono text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-100">Status</th>
                    <th className="p-4 font-mono text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                      <td 
                        onClick={() => { setSelectedTaskId(task.id); setCurrentView('assignment-details'); }}
                        className="p-4 pl-6 font-semibold text-slate-800 flex items-center gap-3 cursor-pointer group-hover:text-blue-600"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">description</span>
                        </div>
                        <span className="truncate max-w-[200px]">{task.title}</span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono font-medium">{task.subject}</td>
                      <td className="p-4 font-mono text-slate-600">{task.dueDate}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide uppercase ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {task.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => { setSelectedTaskId(task.id); setCurrentView('assignment-details'); }}
                          className="text-blue-600 hover:text-blue-800 font-mono font-bold text-xs"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-slate-800 text-base font-bold">October 2024</h3>
              <button 
                onClick={() => setCurrentView('calendar')}
                className="text-xs font-mono text-blue-600 font-bold hover:underline cursor-pointer"
              >
                View Full
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs">
              <div className="text-slate-400 font-mono text-[11px] mb-1">Su</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">Mo</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">Tu</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">We</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">Th</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">Fr</div>
              <div className="text-slate-400 font-mono text-[11px] mb-1">Sa</div>
              
              <div className="text-slate-300 py-1">29</div>
              <div className="text-slate-300 py-1">30</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">1</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">2</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">3</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">4</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">5</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">6</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">7</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">8</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">9</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">10</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer">11</div>
              <div className="bg-[#0f172a] text-white rounded-lg py-1 font-bold shadow-sm cursor-pointer">12</div>
              <div className="py-1 text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer relative">
                14<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline text-sm font-bold tracking-wide uppercase text-slate-200">Quill & Scroll</h3>
                <p className="text-slate-400 text-xs mt-0.5">Quick Academic Scratchpad</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-base">edit_document</span>
              </div>
            </div>
            
            <textarea 
              rows={3} 
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Type quick notes, research ideas, or lecture reminders..."
              className="w-full bg-white/10 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Task Prioritization Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-headline text-slate-800 text-base font-bold mb-4">Task Prioritization</h3>
            <ul className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <li 
                  key={task.id} 
                  onClick={() => { setSelectedTaskId(task.id); setCurrentView('assignment-details'); }}
                  className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 ring-4 ring-rose-50 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs group-hover:text-blue-600 transition-colors">{task.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{task.subject} • Due {task.dueDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

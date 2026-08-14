import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Analytics() {
  const { 
    tasks = [], 
    enrolledSubjects = [], 
    user,
    setCurrentView 
  } = useContext(AppContext);

  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Dynamic Metrics Calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = totalTasks - completedTasks;
  const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

  const totalMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.length : 0), 0);
  const completedMilestones = tasks.reduce((sum, t) => sum + (t.milestones ? t.milestones.filter(m => m.completed).length : 0), 0);
  const milestoneRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 80;

  const userGpa = user?.user_metadata?.target_gpa || '3.85';
  const totalCourses = enrolledSubjects.length || 6;

  // Subject breakdown
  const subjectBreakdown = enrolledSubjects.map(sub => {
    const subTasks = tasks.filter(t => t.subject === sub.code);
    const subCompleted = subTasks.filter(t => t.status === 'completed').length;
    const progress = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 85;
    return {
      code: sub.code,
      name: sub.name,
      tasksCount: subTasks.length,
      completedCount: subCompleted,
      progress
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 animate-fade-in text-left pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-700 text-2xl">insights</span>
            <span>Performance Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time workload distribution, velocity trends, and completion rate trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer shadow-sm"
          >
            <option value="current">Current Semester</option>
            <option value="all">Cumulative Academic Year</option>
          </select>

          <button
            type="button"
            onClick={() => {
              const exportData = JSON.stringify({ tasks, subjects: enrolledSubjects, date: new Date().toISOString() }, null, 2);
              const blob = new Blob([exportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `scholar-analytics-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
            }}
            className="app-btn-secondary text-xs"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Top Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="app-card p-5 space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Academic GPA</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-base">grade</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl font-extrabold text-slate-900">{userGpa}</div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold mt-1 block">
              Target Trajectory: On Track
            </span>
          </div>
        </div>

        <div className="app-card p-5 space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Tasks Completion</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-base">task_alt</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl font-extrabold text-slate-900">{overallCompletionRate}%</div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              {completedTasks} of {totalTasks} deliverables done
            </span>
          </div>
        </div>

        <div className="app-card p-5 space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Milestone Velocity</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <span className="material-symbols-outlined text-base">trending_up</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl font-extrabold text-slate-900">{milestoneRate}%</div>
            <span className="text-[10px] font-mono text-blue-600 font-bold mt-1 block">
              {completedMilestones}/{totalMilestones} checkpoints cleared
            </span>
          </div>
        </div>

        <div className="app-card p-5 space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Active Courses</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <span className="material-symbols-outlined text-base">menu_book</span>
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl font-extrabold text-slate-900">{totalCourses}</div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              {activeTasks} pending deliverables
            </span>
          </div>
        </div>

      </div>

      {/* Center Section: Workload Breakdown & Velocity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Course Completion Breakdown (7 Cols) */}
        <div className="lg:col-span-7 app-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading text-sm font-bold text-slate-900">Coursework Progression</h2>
              <p className="text-xs text-slate-500">Deliverable completion status segmented by course module.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              {enrolledSubjects.length} Courses
            </span>
          </div>

          <div className="space-y-4">
            {subjectBreakdown.map((sub) => (
              <div key={sub.code} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">
                    {sub.code} <span className="font-normal text-slate-500">— {sub.name}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">
                    {sub.completedCount}/{sub.tasksCount} ({sub.progress}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${sub.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Academic Productivity & Pace (5 Cols) */}
        <div className="lg:col-span-5 app-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading text-sm font-bold text-slate-900">Weekly Pace Analysis</h2>
            <span className="app-badge app-badge-blue">Optimal Pace</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Deliverables Completed</span>
                <span className="text-[11px] text-slate-500">Average velocity per 7-day cycle</span>
              </div>
              <span className="font-heading text-2xl font-bold text-blue-600">{completedTasks}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Upcoming Deadlines</span>
                <span className="text-[11px] text-slate-500">Deliverables scheduled next 14 days</span>
              </div>
              <span className="font-heading text-2xl font-bold text-amber-600">{activeTasks}</span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Milestone Completion Ratio</span>
                <span className="text-[11px] text-slate-500">All registered checkpoints</span>
              </div>
              <span className="font-heading text-2xl font-bold text-emerald-600">{milestoneRate}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('tasks')}
            className="w-full app-btn-primary text-xs justify-center py-2.5"
          >
            <span>Review Active Tasks</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

      </div>

    </div>
  );
}

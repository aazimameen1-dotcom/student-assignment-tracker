import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Subjects() {
  const { subjects, addSubject, setSelectedSubjectKey, setCurrentView } = useContext(AppContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!code || !name) return;
    addSubject({ code, name, desc, color: 'blue' });
    setCode('');
    setName('');
    setDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-left pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#0f172a] tracking-tight">Courses Overview</h2>
          <p className="font-body text-sm text-slate-600 mt-1">Manage and track your academic progress across active subjects.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0f172a] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Join New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div 
            key={sub.code} 
            onClick={() => { setSelectedSubjectKey(sub.code); setCurrentView('tasks'); }}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between h-full shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm">
                  {sub.code.substring(0, 3)}
                </div>
                <span className="font-mono text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase">
                  {sub.code}
                </span>
              </div>
              
              <h3 className="font-headline text-lg font-bold text-[#0f172a] mb-1 group-hover:text-blue-600 transition-colors">
                {sub.name}
              </h3>
              <p className="font-body text-xs text-slate-500 mb-6 line-clamp-2">
                {sub.desc || 'Comprehensive coursework covering core modules, research assignments, and lab assessments.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="font-mono text-[11px] text-slate-400 font-bold uppercase">Pending Tasks</p>
                  <p className="font-headline text-sm font-bold text-[#0f172a]">{sub.pendingCount || 0} Deliverables</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[11px] text-slate-400 font-bold uppercase">Syllabus</p>
                  <p className="font-mono text-xs font-bold text-blue-600">{sub.progress || 65}%</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${sub.progress || 65}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-headline text-lg font-bold text-[#0f172a]">Join / Enroll New Course</h3>
            <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-mono mb-1 font-bold">Course Code</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  placeholder="e.g. DIC108X"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-mono mb-1 font-bold">Course Title</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Artificial Intelligence Ethics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-mono mb-1 font-bold">Description</label>
                <textarea 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="Course overview and syllabus notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-slate-800"
                >
                  Enroll Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

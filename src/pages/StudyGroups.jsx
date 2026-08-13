import { useState } from 'react';

export default function StudyGroups() {
  const [activeTab, setActiveTab] = useState('active');

  const groups = [
    {
      id: 1,
      title: 'Web Systems & Architecture',
      course: 'DIC107T',
      members: 5,
      activeSession: 'Live Discussion on REST APIs',
      nextMeeting: 'Today at 4:00 PM',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      tagColor: 'bg-blue-600 text-white'
    },
    {
      id: 2,
      title: 'Python Data Structures Team',
      course: 'DIC102C',
      members: 4,
      activeSession: 'Binary Search Tree Code Review',
      nextMeeting: 'Tomorrow at 10:00 AM',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      tagColor: 'bg-blue-600 text-white'
    },
    {
      id: 3,
      title: 'Disaster Emergency Taskforce',
      course: 'DIC105E',
      members: 6,
      activeSession: 'Field Survey Plan Finalization',
      nextMeeting: 'Fri, Oct 25 at 2:00 PM',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      tagColor: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-left pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#0f172a] tracking-tight">Study Groups</h2>
          <p className="font-body text-sm text-slate-600 mt-1">Collaborate with peers, share resources, and study together.</p>
        </div>
        <button 
          onClick={() => alert("Group creation modal opened!")}
          className="bg-[#0f172a] text-white rounded-xl px-5 py-2.5 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">group_add</span>
          <span>Create Study Group</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-slate-200 text-xs font-bold font-mono">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'active' ? 'border-[#0f172a] text-[#0f172a]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          Active Groups ({groups.length})
        </button>
        <button 
          onClick={() => setActiveTab('my-groups')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'my-groups' ? 'border-[#0f172a] text-[#0f172a]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          My Enrolled Groups
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold ${g.tagColor}`}>
                  {g.course}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-slate-500 font-bold">
                  <span className="material-symbols-outlined text-sm">group</span>
                  {g.members} Members
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold text-[#0f172a]">{g.title}</h3>
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${g.color}`}>
                <span className="font-bold block mb-0.5">Active Topic:</span>
                {g.activeSession}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <span className="material-symbols-outlined text-sm text-blue-600">event</span>
                <span>{g.nextMeeting}</span>
              </div>
              <button 
                onClick={() => alert(`Joined ${g.title} live session!`)}
                className="px-3.5 py-1.5 bg-[#0f172a] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
              >
                Join Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

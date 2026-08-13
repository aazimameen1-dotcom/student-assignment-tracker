import { useState } from 'react';

export default function ResearchDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');

  const papers = [
    {
      id: 1,
      title: 'Modern Architecture in Distributed Systems & Web Frameworks',
      authors: 'S. Jenkins, A. Morgan et al.',
      journal: 'IEEE Software Engineering Trans, 2024',
      citations: 142,
      tag: 'Web Systems',
      doi: '10.1109/TSE.2024.10293'
    },
    {
      id: 2,
      title: 'Algorithmic Optimization of Binary Search Trees in Python 3.12',
      authors: 'Prof Asif Ali Banka, M. Farooq',
      journal: 'Journal of Computer Science & Data Structures',
      citations: 89,
      tag: 'Algorithms',
      doi: '10.1016/j.jcs.2024.08.012'
    },
    {
      id: 3,
      title: 'Community Response & Early Warning Risk Assessment Guidelines',
      authors: 'Dr. Afshana Sultan, E. Mgmt Group',
      journal: 'Global Environmental Risk Studies, 2023',
      citations: 215,
      tag: 'Disaster Management',
      doi: '10.1007/s11069-023-05981'
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-left pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#0f172a] tracking-tight">Research Discovery</h2>
          <p className="font-body text-sm text-slate-600 mt-1">Search literature, bookmark citations, and organize academic papers.</p>
        </div>
        <button 
          onClick={() => alert("Add Paper Modal Opened!")}
          className="bg-[#0f172a] text-white rounded-xl px-5 py-2.5 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">bookmark_add</span>
          <span>Add Paper</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-lg">search</span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search papers, DOI, authors, or topics..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        {papers.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {p.tag}
                </span>
                <span className="font-mono text-[11px] text-slate-400">DOI: {p.doi}</span>
              </div>
              <h3 className="font-headline text-base font-bold text-[#0f172a] hover:text-blue-600 transition-colors cursor-pointer">
                {p.title}
              </h3>
              <p className="font-body text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{p.authors}</span> • {p.journal}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                {p.citations} Citations
              </span>
              <button 
                onClick={() => alert(`Saved paper "${p.title}" to reading list!`)}
                className="p-2 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500 rounded-lg transition-all cursor-pointer"
                title="Bookmark paper"
              >
                <span className="material-symbols-outlined text-base">bookmark</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

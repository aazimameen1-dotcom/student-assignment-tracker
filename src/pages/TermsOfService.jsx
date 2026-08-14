import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function TermsOfService() {
  const { setCurrentView } = useContext(AppContext);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in text-left pb-32">
      
      {/* Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Workspace</span>
        </button>

        <span className="app-badge app-badge-blue">
          Terms & Data Protection
        </span>
      </div>

      {/* Legal Review Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold uppercase font-mono tracking-wider">
          <span className="material-symbols-outlined text-sm">gavel</span>
          <span>Draft for Legal Counsel Review</span>
        </div>
        <p className="text-amber-800 text-[11px] leading-relaxed">
          These Terms of Service incorporate statutory Data Fiduciary covenants under the Digital Personal Data Protection Act, 2023 (Republic of India).
        </p>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Data Protection Agreement
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Revised: August 14, 2026 • Version: 2.0-DPDP
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* Clause 1: Acceptance */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            By accessing or using Scholar ("Service"), you agree to be bound by these Terms of Service. You affirm that you are a university or higher-education student of at least eighteen (18) years of age, or have the requisite legal capacity under applicable laws of India to enter into binding agreements.
          </p>
        </section>

        {/* Clause 2: Data Protection & Statutory DPDP Covenants */}
        <section className="app-card p-6 space-y-4 border-l-4 border-l-blue-600">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            2. Data Protection & Fiduciary Obligations (DPDP Act, 2023)
          </h2>
          <p>
            <strong>2.1 Fiduciary Standards:</strong> Scholar shall act as a <strong>Data Fiduciary</strong> in respect of digital personal data provided by users ("Data Principals") and warrants compliance with all obligations under Section 8 of the DPDP Act 2023, including implementing reasonable technical safeguards and security practices.
          </p>
          <p>
            <strong>2.2 Purpose Limitation:</strong> Scholar covenants that personal data shall only be processed for specified, lawful purposes to which you have explicitly consented or as necessary for contractual service delivery.
          </p>
          <p>
            <strong>2.3 Data Accuracy & Completeness:</strong> Users agree to provide true, accurate academic records. Users may update or correct records at any time through the Profile and Settings portals.
          </p>
          <p>
            <strong>2.4 Breach Intimation:</strong> In the unlikely event of a personal data breach, Scholar shall notify the Data Protection Board of India and affected Data Principals in accordance with Section 8(6) of the DPDP Act.
          </p>
        </section>

        {/* Clause 3: Acceptable Use & Account Security */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            3. Acceptable Use and Intellectual Property
          </h2>
          <p>
            You retain all intellectual property rights in your uploaded notes, research briefs, and assignment deliverables. You agree not to use Scholar for academic dishonesty, unauthorized automated scraping, or uploading malicious code.
          </p>
        </section>

        {/* Clause 4: Grievance Escalation to Data Protection Board */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            4. Dispute Resolution & Grievance Redressal
          </h2>
          <p>
            Any dispute or privacy concern shall first be referred to our Grievance Redressal Officer at <a href="mailto:grievance-officer@scholar.app" className="text-blue-600 font-bold underline">grievance-officer@scholar.app</a>. If a privacy grievance remains unresolved after thirty (30) days, the Data Principal may file a formal complaint with the <strong>Data Protection Board of India (DPBI)</strong> pursuant to Section 13(3) and Section 27 of the DPDP Act 2023.
          </p>
        </section>

      </div>

    </div>
  );
}

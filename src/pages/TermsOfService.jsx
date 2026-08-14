import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function TermsOfService() {
  const { setCurrentView } = useContext(AppContext);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in text-left pb-32">
      
      {/* Top Breadcrumb */}
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
          Terms & Agreement
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Revised: August 2026 • Version 2.1
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* Section 1: Acceptance */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            By accessing or using Scholar ("Service"), you agree to be bound by these Terms of Service. Scholar is designed for university and higher-education students to manage academic deliverables, curriculum schedules, and milestone planning.
          </p>
        </section>

        {/* Section 2: Data Protection & Privacy */}
        <section className="app-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            2. Data Protection & Privacy Standards
          </h2>
          <p>
            <strong>2.1 Data Responsibility:</strong> Scholar implements strict technical safeguards, encryption, and row-level access controls to protect your student records and personal data.
          </p>
          <p>
            <strong>2.2 Purpose Limitation:</strong> Your data is strictly processed to provide academic tracking and project management features. We do not sell your personal data or profile information to third parties.
          </p>
          <p>
            <strong>2.3 Accuracy & Portability:</strong> You maintain full control over your academic data and can export, update, or delete your records at any time.
          </p>
        </section>

        {/* Section 3: Intellectual Property & Acceptable Use */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            3. Intellectual Property & Acceptable Use
          </h2>
          <p>
            You retain 100% ownership and copyright of all notes, research summaries, and assignment deliverables created or uploaded in Scholar. You agree to use the platform in compliance with all applicable laws and academic honor codes.
          </p>
        </section>

        {/* Section 4: Privacy Inquiries & Support */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            4. Inquiries & Support
          </h2>
          <p>
            If you have questions regarding these terms or your account privacy, please contact our team at <a href="mailto:privacy@scholar.app" className="text-blue-600 font-bold underline">privacy@scholar.app</a>.
          </p>
        </section>

      </div>

    </div>
  );
}

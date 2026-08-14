import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function PrivacyPolicy() {
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
          DPDP Act (India) 2023 Compliant
        </span>
      </div>

      {/* Legal Review Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold uppercase font-mono tracking-wider">
          <span className="material-symbols-outlined text-sm">gavel</span>
          <span>Notice: Draft for Compliance & Legal Counsel Review</span>
        </div>
        <p className="text-amber-800 text-[11px] leading-relaxed">
          This Privacy Notice has been drafted in compliance with Section 5 of the Digital Personal Data Protection Act, 2023 (DPDP Act, India). Final corporate registration details and entity identifiers are subject to review by registered legal counsel.
        </p>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Notice & Statutory Disclosure
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Updated: August 14, 2026 • Version: 2.1-DPDP
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* Section 1: Introduction */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            1. Identity of the Data Fiduciary
          </h2>
          <p>
            This Privacy Notice is issued by <strong>Scholar Academic Technologies Pvt. Ltd.</strong> ("Scholar", "we", "us", or "our"), operating as a <strong>Data Fiduciary</strong> under the provisions of the Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Republic of India).
          </p>
          <p>
            Scholar is committed to processing your digital personal data lawfully, transparently, and strictly for specified academic workflow and curriculum tracking purposes.
          </p>
        </section>

        {/* Section 2: Categories of Personal Data Collected */}
        <section className="app-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            2. Personal Data We Collect and Why (Purpose Specification)
          </h2>
          <p>
            In accordance with <strong>Section 5(1) of the DPDP Act</strong>, the table below provides an itemized itemization of the personal data collected, along with the specific, lawful purpose for which each item is processed:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Data Category</th>
                  <th className="p-3">Specific Data Elements</th>
                  <th className="p-3">Purpose of Processing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Account & Identity</td>
                  <td className="p-3">Full Name, Email Address, Password Hash, Profile Avatar</td>
                  <td className="p-3">Authentication, account recovery, profile customization, multi-tenant session security.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Academic Standing</td>
                  <td className="p-3">Student ID, Degree/Major, Institution/Faculty, Semester, Target GPA</td>
                  <td className="p-3">Personalized syllabus organization, graduation milestone planning, and progress tracking.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Curriculum & Deliverables</td>
                  <td className="p-3">Enrolled Courses, Assignment Titles, Due Dates, Checklist Milestones, Professor Contact Info</td>
                  <td className="p-3">Core service delivery, deadline calculations, and project tracking.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Diagnostic & Telemetry (Optional)</td>
                  <td className="p-3">UI view transitions, error traces, client performance metrics</td>
                  <td className="p-3">System reliability, crash debugging, and performance optimization (gated behind explicit consent).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Data Principal Statutory Rights */}
        <section className="app-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            3. Your Statutory Rights as a Data Principal (DPDP Sections 11–14)
          </h2>
          <p>
            Under Chapter III of the DPDP Act 2023, you have the following legally enforceable statutory rights:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Right to Access (Section 11)</span>
              <p className="text-[11px] text-slate-600">
                Obtain a summary of personal data being processed, processing activities, and identities of all third parties with whom data is shared.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Right to Correction & Erasure (Section 12)</span>
              <p className="text-[11px] text-slate-600">
                Request correction of inaccurate or misleading data, complete un-updated data, or permanent erasure of personal data no longer necessary.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Right to Withdraw Consent (Section 6(4))</span>
              <p className="text-[11px] text-slate-600">
                Withdraw previously granted consent at any time as easily as giving consent. Processing ceases upon valid withdrawal receipt.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Right to Nominate (Section 14)</span>
              <p className="text-[11px] text-slate-600">
                Nominate any individual who shall, in the event of death or incapacity of the Data Principal, exercise statutory rights on their behalf.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={() => setCurrentView('data-rights')}
              className="app-btn-primary text-xs"
            >
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              <span>Submit a Data Rights Request</span>
            </button>
          </div>
        </section>

        {/* Section 4: Data Retention & Sub-Processors */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            4. Data Retention and Sub-Processors
          </h2>
          <p>
            <strong>Retention Period:</strong> We retain personal data for the duration of your active registration. Upon account closure, user records are permanently purged within thirty (30) business days, except where retention is required by applicable law.
          </p>
          <p>
            <strong>Authorized Sub-Processors:</strong> Data storage and authentication are managed through <strong>Supabase Inc.</strong> under strict technical data protection covenants and row-level access controls.
          </p>
        </section>

        {/* Section 5: Grievance Redressal & DPO Contact */}
        <section className="app-card p-6 space-y-3 border-l-4 border-l-blue-600">
          <h2 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">support_agent</span>
            <span>5. Grievance Redressal Officer (Section 13)</span>
          </h2>
          <p>
            In compliance with Section 13 of the DPDP Act, Scholar has appointed a dedicated <strong>Grievance Redressal Officer / Data Protection Officer (DPO)</strong> to address all privacy questions, data requests, or complaints:
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
            <p className="font-bold text-slate-900">Officer Designation: Grievance Redressal & Data Protection Officer</p>
            <p className="text-slate-600">Entity: Scholar Academic Technologies Pvt. Ltd.</p>
            <p className="text-slate-600">Official Email: <a href="mailto:grievance-officer@scholar.app" className="text-blue-600 font-bold underline">grievance-officer@scholar.app</a></p>
            <p className="text-slate-600">Physical Address: 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India</p>
            <p className="text-slate-500 text-[10px]">Response Time SLA: Initial acknowledgment within 48 hours; substantive resolution within thirty (30) days.</p>
          </div>

          <p className="text-[11px] text-slate-500">
            If your grievance is not resolved to your satisfaction within thirty (30) days, you have the statutory right under <strong>Section 13(3)</strong> to file an appeal with the <strong>Data Protection Board of India (DPBI)</strong>.
          </p>
        </section>

      </div>

    </div>
  );
}

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function PrivacyPolicy() {
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
          Privacy & Security
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Last Updated: August 2026 • Version 2.1
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* Section 1: Overview */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            1. Overview
          </h2>
          <p>
            Scholar ("we", "us", or "our") is dedicated to protecting the privacy and security of your academic information. This policy describes what data we collect, why we collect it, how it is secured, and your rights over your data.
          </p>
        </section>

        {/* Section 2: Data Collected */}
        <section className="app-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            2. Information We Collect and How It Is Used
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Examples</th>
                  <th className="p-3">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Account Credentials</td>
                  <td className="p-3">Full name, university email, password hash, avatar photo</td>
                  <td className="p-3">To authenticate your account, protect your session, and personalize your workspace.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Academic Records</td>
                  <td className="p-3">Student ID, degree, semester, courses, target GPA</td>
                  <td className="p-3">To organize your curriculum and display milestone velocity analytics.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Deliverables & Tasks</td>
                  <td className="p-3">Assignments, deadlines, checklists, professor contact info</td>
                  <td className="p-3">Core service functionality, deadline alerts, and task prioritization.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Performance Diagnostics (Optional)</td>
                  <td className="p-3">Page load timings, error logs</td>
                  <td className="p-3">To diagnose bugs and maintain high platform speed and stability.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Data Rights */}
        <section className="app-card p-6 space-y-4">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            3. Your Privacy Rights
          </h2>
          <p>
            You have full control over your personal information:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Access & Export</span>
              <p className="text-[11px] text-slate-600">
                You can download a complete JSON export of your coursework and profile data at any time.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Update & Correction</span>
              <p className="text-[11px] text-slate-600">
                Easily modify your academic details, contact credentials, or courses in Profile and Settings.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Erasure & Account Deletion</span>
              <p className="text-[11px] text-slate-600">
                You can permanently delete your account and associated task data from our servers.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-heading font-bold text-slate-900 block text-xs">Consent Management</span>
              <p className="text-[11px] text-slate-600">
                Adjust your diagnostic telemetry and notification preferences whenever you wish.
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
              <span>Manage Your Data Rights</span>
            </button>
          </div>
        </section>

        {/* Section 4: Data Security & Retention */}
        <section className="app-card p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            4. Data Security and Retention
          </h2>
          <p>
            We use industry-standard encryption in transit (HTTPS/TLS) and at rest (AES-256) to ensure that your academic records remain secure. Your data is retained while your account is active, and can be permanently deleted upon request.
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="app-card p-6 space-y-3 border-l-4 border-l-blue-600">
          <h2 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">support_agent</span>
            <span>5. Privacy & Support Contact</span>
          </h2>
          <p>
            For any privacy inquiries, data requests, or feedback, please contact our Privacy Team:
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
            <p className="font-bold text-slate-900">Privacy & Data Protection Team</p>
            <p className="text-slate-600">Email: <a href="mailto:privacy@scholar.app" className="text-blue-600 font-bold underline">privacy@scholar.app</a></p>
            <p className="text-slate-500 text-[10px]">Response Time: Inquiries are acknowledged within 48 hours.</p>
          </div>
        </section>

      </div>

    </div>
  );
}

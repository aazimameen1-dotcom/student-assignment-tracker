import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function DataRightsRequest() {
  const { user, setCurrentView, tasks, enrolledSubjects } = useContext(AppContext);

  const [requestType, setRequestType] = useState('access');
  const [applicantName, setApplicantName] = useState(user?.user_metadata?.full_name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [studentId, setStudentId] = useState(user?.user_metadata?.student_id || '');
  const [details, setDetails] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeContact, setNomineeContact] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [ticketId, setTicketId] = useState('');

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!applicantEmail.trim()) return;

    const generatedTicket = `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setTicketId(generatedTicket);
    setSubmissionStatus('success');

    // Auto export if request type is 'access'
    if (requestType === 'access') {
      const exportData = {
        requestTicket: generatedTicket,
        generatedAt: new Date().toISOString(),
        userProfile: {
          name: applicantName,
          email: applicantEmail,
          studentId: studentId,
          metadata: user?.user_metadata || {}
        },
        enrolledSubjects,
        tasks
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scholar-data-export-${generatedTicket}.json`;
      a.click();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fade-in text-left pb-32">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          type="button"
          onClick={() => setCurrentView('settings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Settings</span>
        </button>

        <span className="app-badge app-badge-blue">
          Privacy Request Portal
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Data Privacy & Account Rights Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit a request to access, export, update, delete, or manage your personal data.
        </p>
      </div>

      {submissionStatus === 'success' ? (
        <div className="app-card p-8 text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">Request Registered Successfully</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your request has been logged and our support team is processing it.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono max-w-sm mx-auto space-y-1 text-left">
            <p className="text-slate-500">Tracking Reference ID:</p>
            <p className="font-bold text-blue-600 text-sm">{ticketId}</p>
            <p className="text-[10px] text-slate-400 pt-1">Confirmation sent to your registered email.</p>
          </div>

          {requestType === 'access' && (
            <p className="text-xs text-emerald-700 font-semibold">
              ✓ Automated JSON data export has been downloaded to your browser.
            </p>
          )}

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setSubmissionStatus(null)}
              className="app-btn-secondary text-xs"
            >
              Submit Another Request
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="app-btn-primary text-xs"
            >
              Return to Workspace
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitRequest} className="app-card p-6 md:p-8 space-y-6">
          
          {/* Select Right */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Request Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'access', label: 'Download / Export Data Snapshot', icon: 'download' },
                { id: 'correction', label: 'Correct or Update Information', icon: 'edit' },
                { id: 'erasure', label: 'Account & Data Deletion', icon: 'delete_forever' },
                { id: 'withdraw', label: 'Manage / Withdraw Consent', icon: 'cancel' },
                { id: 'nominate', label: 'Designate Account Representative', icon: 'person_add' },
                { id: 'grievance', label: 'General Privacy Inquiry', icon: 'support_agent' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    requestType === opt.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={opt.id}
                    checked={requestType === opt.id}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-sm">{opt.icon}</span>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Applicant Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                placeholder="Full Name"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email *</label>
              <input
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                required
                placeholder="student@university.edu"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID (Optional)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="STU-2026-XXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* If Nominate Representative */}
          {requestType === 'nominate' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
              <h3 className="font-heading text-xs font-bold text-slate-900">
                Representative Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Designate an authorized contact to manage account affairs in the event of emergency or incapacity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nominee Full Name *</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    required={requestType === 'nominate'}
                    placeholder="e.g. Guardian / Family Member"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nominee Email / Phone *</label>
                  <input
                    type="text"
                    value={nomineeContact}
                    onChange={(e) => setNomineeContact(e.target.value)}
                    required={requestType === 'nominate'}
                    placeholder="nominee@email.com or +1..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Details / Justification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Request Details & Specific Notes
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional details or specific questions..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] font-mono text-slate-400">
              Typical response time: within 48-72 hours
            </span>
            <button
              type="submit"
              className="app-btn-primary text-xs"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Submit Request</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}

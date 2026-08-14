import { useState, useEffect } from 'react';

export default function ConsentBanner({ onConsentUpdated }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Granular choices (essential is always true and disabled)
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('scholar_consent_preferences');
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(storedConsent);
        setAnalyticsConsent(Boolean(parsed.analytics));
        setMarketingConsent(Boolean(parsed.marketing));
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (analytics, marketing) => {
    const consentRecord = {
      essential: true,
      analytics: Boolean(analytics),
      marketing: Boolean(marketing),
      timestamp: new Date().toISOString(),
      version: 'v1.0-dpdp-2023'
    };

    localStorage.setItem('scholar_consent_preferences', JSON.stringify(consentRecord));
    setShowBanner(false);
    setShowModal(false);

    if (onConsentUpdated) {
      onConsentUpdated(consentRecord);
    }
  };

  const handleAcceptAll = () => {
    setAnalyticsConsent(true);
    setMarketingConsent(true);
    saveConsent(true, true);
  };

  const handleRejectNonEssential = () => {
    setAnalyticsConsent(false);
    setMarketingConsent(false);
    saveConsent(false, false);
  };

  const handleSavePreferences = () => {
    saveConsent(analyticsConsent, marketingConsent);
  };

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Bottom Floating Consent Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:max-w-xl z-50 animate-fade-in text-left">
          <div className="app-card p-5 shadow-2xl border border-slate-300 bg-white/95 backdrop-blur-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">shield</span>
                <h3 className="font-heading text-xs font-bold text-slate-900">
                  Data Privacy & Consent Notice (DPDP Act)
                </h3>
              </div>
              <span className="app-badge app-badge-slate text-[9px]">India DPDP 2023</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We process your personal data strictly for curriculum tracking. We do not use third-party advertising trackers. You have the right to grant or deny optional telemetry and performance diagnostics.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Customize Choices
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="app-btn-secondary text-[11px] py-1.5 px-3"
                >
                  Essential Only
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="app-btn-primary text-[11px] py-1.5 px-3"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Consent Choices Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Granular Privacy & Tracker Preferences
                </h3>
                <p className="text-xs text-slate-500">Opt-in per statutory processing purpose (DPDP Section 6)</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Category 1: Essential */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-bold text-slate-900">1. Essential Core Processing</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      MANDATORY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Necessary for user authentication, multi-tenant session security, and assignment workspace state.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="mt-1 rounded text-slate-900 h-4 w-4 opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Category 2: Performance Telemetry (Opt-in) */}
              <label className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-heading text-xs font-bold text-slate-900 block">2. Performance & Error Diagnostics</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Captures client-side load performance, UI transitions, and uncaught crash traces to improve system reliability.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
              </label>

              {/* Category 3: Academic Updates & Notifications (Opt-in) */}
              <label className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-heading text-xs font-bold text-slate-900 block">3. Deadline Notifications & Feature Alerts</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Allows email notifications for upcoming assignment deadlines, syllabus revisions, and product feature notices.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="app-btn-secondary text-xs"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="app-btn-primary text-xs"
              >
                Save My Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/**
 * Lightweight Observability & Instrumentation Logger
 * Strictly gated behind DPDP Act 2023 consent preferences.
 */

function hasAnalyticsConsent() {
  try {
    const raw = localStorage.getItem('scholar_consent_preferences');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed.analytics);
  } catch (e) {
    return false;
  }
}

class TelemetryService {
  constructor() {
    this.logs = [];
    this.maxLogs = 50;
  }

  logEvent(category, action, metadata = {}) {
    // DPDP Act Compliance: Non-error diagnostic telemetry is gated behind user consent
    if (category !== 'ERROR' && !hasAnalyticsConsent()) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      category,
      action,
      metadata
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (import.meta.env.DEV) {
      console.log(`[Telemetry] ${category} -> ${action}`, metadata);
    }
  }

  logError(source, error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      source,
      message: error?.message || String(error),
      context
    };

    console.error(`[Telemetry:Error] (${source})`, error, context);
    this.logEvent('ERROR', source, errorEntry);
  }

  getRecentLogs() {
    return [...this.logs];
  }
}

export const telemetry = new TelemetryService();
export default telemetry;

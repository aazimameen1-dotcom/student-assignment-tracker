/**
 * Lightweight Observability & Instrumentation Logger
 * Logs view transitions, user actions, and error events for debugging and auditability.
 */

class TelemetryService {
  constructor() {
    this.logs = [];
    this.maxLogs = 50;
  }

  logEvent(category, action, metadata = {}) {
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

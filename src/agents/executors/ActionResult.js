/**
 * Standardized result object for all Action Executions.
 */
export class ActionResult {
  constructor({ success, reason = null, data = null, preview = null, auditId = null }) {
    this.success = success;
    this.reason = reason;
    this.data = data;
    this.preview = preview; // For dry-runs
    this.auditId = auditId;
    this.timestamp = new Date().toISOString();
  }

  static Success(data, auditId = null) {
    return new ActionResult({ success: true, data, auditId });
  }

  static Failure(reason, auditId = null) {
    return new ActionResult({ success: false, reason, auditId });
  }

  static Preview(previewData) {
    return new ActionResult({ success: true, preview: previewData });
  }
}

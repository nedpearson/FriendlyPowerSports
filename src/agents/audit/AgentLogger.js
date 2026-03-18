/**
 * Global audit log purely for Agent interactions.
 * Helps with compliance (Phase 1 goal).
 */
export const AgentLogger = {
  _logs: [],

  logEvent({ agentId, eventType, details, userId = 'SYSTEM' }) {
    const logEntry = {
      eventId: `E-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      eventType,
      timestamp: new Date().toISOString(),
      details,
      userId
    };
    this._logs.push(logEntry);
    
    // In production, this dispatches to an immutable log table
    console.log(`[AUDIT] ${eventType} by ${agentId}:`, details);
  },

  getRecentLogs(limit = 50) {
    return this._logs.slice(-limit).reverse();
  }
};

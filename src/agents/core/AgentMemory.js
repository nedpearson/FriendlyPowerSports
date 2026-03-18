/**
 * Safe, structured storage for agent insights. 
 * Prevents black-box freeform memory leaks.
 */

// Simulated persistent storage for the demo phase.
const _memoryStore = {
  recommendations: [],
  history: []
};

export const AgentMemory = {
  /**
   * Save a generated recommendation securely, ensuring it follows the schema.
   */
  saveRecommendation(rec) {
    if (!rec.id || !rec.agentId) throw new Error("Invalid recommendation structure");
    _memoryStore.recommendations.push({ ...rec, storedAt: new Date().toISOString() });
    return rec;
  },

  /**
   * Updates state of a recommendation (e.g., user clicked Dismiss)
   */
  updateRecommendationStatus(recId, status, userId) {
    const rec = _memoryStore.recommendations.find(r => r.id === recId);
    if (rec) {
      rec.status = status;
      rec.resolvedBy = userId;
      rec.resolvedAt = new Date().toISOString();
      _memoryStore.history.push({ type: 'STATUS_CHANGE', recId, status, userId });
    }
  },

  /**
   * Fetch active recommendations for a given context
   */
  getPendingRecommendations(context) {
    return _memoryStore.recommendations.filter(r => r.status === 'PENDING').reverse();
  }
};

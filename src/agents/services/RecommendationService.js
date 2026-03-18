import { AGENT_RECOMMENDATIONS, AGENT_ACTIONS, AGENT_AUDIT_LOGS } from '../../data/mockDatabase';

/**
 * Persistence wrapper for AI Recommendations using the Mock Database Layer.
 */
export const RecommendationService = {
  
  /**
   * Insert a newly drafted recommendation into the database.
   */
  create(recDetails) {
    const newRec = {
      ...recDetails,
      id: recDetails.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    AGENT_RECOMMENDATIONS.push(newRec);
    return newRec;
  },

  /**
   * Fetch all active recommendations (optionally filter by user/role/agent).
   */
  getAll() {
    return AGENT_RECOMMENDATIONS;
  },

  fetchPending(context = {}) {
    let results = AGENT_RECOMMENDATIONS.filter(r => r.status === 'PENDING');
    
    if (context.agentId) {
       results = results.filter(r => r.agentId === context.agentId);
    }
    
    // Sort logic: Urgent first, then High, Med, Low
    const priorityWeights = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    return results.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority] || b.confidenceScore - a.confidenceScore);
  },

  /**
   * Fetch all snoozed recommendations.
   */
  fetchSnoozed(context = {}) {
    let results = AGENT_RECOMMENDATIONS.filter(r => r.status === 'SNOOZED');
    
    if (context.agentId) {
       results = results.filter(r => r.agentId === context.agentId);
    }
    
    const priorityWeights = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    return results.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority] || b.confidenceScore - a.confidenceScore);
  },

  /**
   * Fetch by a related business record (e.g. Lead ID).
   */
  fetchByEntity(entityType, entityId) {
    return AGENT_RECOMMENDATIONS.filter(rec => 
      rec.relatedEntities?.some(e => e.entityType === entityType && e.entityId === entityId)
    );
  },

  /**
   * Change resolution state and update timestamps.
   */
  updateStatus(recId, status, userId, explanation = '') {
    const idx = AGENT_RECOMMENDATIONS.findIndex(r => r.id === recId);
    if (idx === -1) throw new Error("Recommendation not found.");

    const rec = AGENT_RECOMMENDATIONS[idx];
    rec.status = status;
    rec.updatedAt = new Date().toISOString();
    
    if (status === 'DISMISSED') {
       rec.dismissedAt = rec.updatedAt;
       rec.resolutionExplanation = explanation;
    } else if (status === 'APPROVED' || status === 'ACTIONED') {
       rec.approvedAt = rec.updatedAt;
    }

    // Persist Auditing
    AGENT_AUDIT_LOGS.push({
       id: `AUD-REC-${Date.now()}`,
       agentId: rec.agentId,
       eventType: `RECOMMENDATION_STATUS_CHANGE`,
       details: { recId, oldStatus: rec.status, newStatus: status, explanation },
       userId,
       timestamp: rec.updatedAt
    });

    return rec;
  },

  /**
   * Temporarily hides an insight until a specific date.
   */
  snooze(recId, snoozeUntilIso, userId) {
    const idx = AGENT_RECOMMENDATIONS.findIndex(r => r.id === recId);
    if (idx === -1) throw new Error("Recommendation not found.");
    
    const rec = AGENT_RECOMMENDATIONS[idx];
    rec.status = 'SNOOZED';
    rec.snoozedUntil = snoozeUntilIso;
    rec.updatedAt = new Date().toISOString();

    AGENT_AUDIT_LOGS.push({
      id: `AUD-REC-${Date.now()}`,
      agentId: rec.agentId,
      eventType: `RECOMMENDATION_SNOOZED`,
      details: { recId, snoozedUntil: snoozeUntilIso },
      userId,
      timestamp: rec.updatedAt
    });
    
    return rec;
  }
};

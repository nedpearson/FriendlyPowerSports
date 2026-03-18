import { AgentLogger } from '../audit/AgentLogger';
import { RecommendationService } from '../services/RecommendationService';
import { AgentMetrics } from '../audit/AgentMetrics';

/**
 * Engine dedicated to generating structured, human-readable insight payloads 
 * without modifying any operational state.
 */
export const RecommendationEngine = {
  /**
   * Safely formats and saves a recommendation
   */
  generateRecommendation(agent, proposal, context) {
    const rec = {
      id: `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      agentId: agent.id,
      title: proposal.title,
      description: proposal.description,
      relatedEntities: proposal.relatedEntities || [],
      confidenceScore: proposal.confidenceScore || 80,
      priority: proposal.priority || 'MEDIUM',
      proposedActions: proposal.proposedActions || [],
      status: 'PENDING'
    };

    const saved = RecommendationService.create(rec);
    AgentMetrics.trackCreation();

    AgentLogger.logEvent({
      agentId: agent.id,
      eventType: 'RECOMMENDATION_GENERATED',
      details: { recId: saved.id, priority: saved.priority },
      userId: context.userId
    });

    return saved;
  },

  /**
   * Called when humans interact with a recommendation
   */
  resolveRecommendation(recId, status, context) {
    const rec = RecommendationService.updateStatus(recId, status, context.userId);
    
    if(rec) {
       AgentLogger.logEvent({
         agentId: rec.agentId,
         eventType: `RECOMMENDATION_${status.toUpperCase()}`,
         details: { recId },
         userId: context.userId
       });
    }
  }
};

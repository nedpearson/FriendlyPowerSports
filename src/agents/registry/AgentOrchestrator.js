import { RecommendationService } from '../services/RecommendationService';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';

export const AgentOrchestrator = {
  /**
   * Scans pending recommendations for entity overlaps.
   * If two agents flag the same entity, it merges them into a Multi-Department Strategy.
   */
  async synthesize(context) {
    const pending = RecommendationService.fetchPending();
    
    // Group by entityType + entityId
    const entityGroups = {};

    pending.forEach(rec => {
       if (!rec.relatedEntities) return;
       rec.relatedEntities.forEach(ent => {
          const key = `${ent.entityType}_${ent.entityId}`;
          if (!entityGroups[key]) entityGroups[key] = [];
          
          // Avoid pushing same recommendation twice for an entity
          if (!entityGroups[key].find(r => r.id === rec.id)) {
             entityGroups[key].push(rec);
          }
       });
    });

    // Find synergies
    for (const [key, groupRecs] of Object.entries(entityGroups)) {
       // Only synthesize if multiple discrete agents are involved
       const uniqueAgents = new Set(groupRecs.map(r => r.agentId));
       
       if (uniqueAgents.size >= 2) {
          // Identify the base entity
          const entityLabel = groupRecs[0].relatedEntities.find(e => `${e.entityType}_${e.entityId}` === key)?.label || key;

          // Merge Actions
          const mergedActions = [];
          groupRecs.forEach(r => {
             if (r.proposedActions) mergedActions.push(...r.proposedActions);
          });

          // Create the Super Prompt / Multi-Department Strategy
          const strategyRec = {
             title: `Multi-Department Strategy: ${entityLabel}`,
             description: `[SYNTHESIZED] Multiple agents flagged this entity. Combined insights: ` + groupRecs.map(r => `(${r.agentId.split('_')[0].toUpperCase()}): ${r.title}`).join(' | '),
             confidenceScore: 99,
             priority: 'URGENT',
             relatedEntities: groupRecs[0].relatedEntities, // Keep the same entity links
             proposedActions: mergedActions
          };

          // Generate the meta-recommendation (Assume a generic Orchestrator Agent context)
          const orchestratorAgent = { id: 'super_orchestrator', name: 'Global Engine' };
          RecommendationEngine.generateRecommendation(orchestratorAgent, strategyRec, context);

          // Auto-Dismiss the individual isolated recommendations
          groupRecs.forEach(r => {
             RecommendationService.updateStatus(r.id, 'DISMISSED', 'SYSTEM_ORCHESTRATOR', 'Replaced by Multi-Department Strategy');
          });
       }
    }
  }
};

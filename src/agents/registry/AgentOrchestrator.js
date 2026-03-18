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

          // Merge Actions and Notes
          const mergedActions = [];
          const mergedNotes = [];
          const seenActions = new Set();

          groupRecs.forEach(r => {
             if (r.proposedActions) {
                 r.proposedActions.forEach(a => {
                     const hash = `${a.actionType}_${JSON.stringify(a.payload)}`;
                     if (!seenActions.has(hash)) {
                         seenActions.add(hash);
                         mergedActions.push(a);
                     }
                 });
             }
             if (r.strategyNotes) mergedNotes.push(...r.strategyNotes.map(n => `[${r.agentId.split('_')[1]?.toUpperCase() || 'SYSTEM'}] ${n}`));
          });

          // Natural Language Formatter
          const uniqueInsights = new Map();
          groupRecs.forEach(r => {
             const agentName = r.agentId.split('_')[0].toUpperCase();
             const cleanTitle = r.title.replace('Multi-Department Strategy: ', '').trim();
             if (!uniqueInsights.has(cleanTitle)) {
                 uniqueInsights.set(cleanTitle, agentName);
             }
          });

          let nlpDesc = "Cross-departmental intelligence has evaluated this entity. ";
          const bulletPoints = [];
          uniqueInsights.forEach((agentName, message) => {
             bulletPoints.push(`the ${agentName} agent flagged "${message}"`);
          });

          if (bulletPoints.length === 1) {
             nlpDesc += bulletPoints[0].charAt(0).toUpperCase() + bulletPoints[0].slice(1) + ".";
          } else if (bulletPoints.length === 2) {
             nlpDesc += bulletPoints[0].charAt(0).toUpperCase() + bulletPoints[0].slice(1) + " while " + bulletPoints[1] + ".";
          } else if (bulletPoints.length > 2) {
             const last = bulletPoints.pop();
             nlpDesc += bulletPoints[0].charAt(0).toUpperCase() + bulletPoints[0].slice(1);
             if (bulletPoints.length > 1) {
               nlpDesc += ", " + bulletPoints.slice(1).join(", ");
             }
             nlpDesc += ", and " + last + ".";
          }
          nlpDesc += " Please review the operational deep-dive below for immediate deployment strategies.";

          // Create the Super Prompt / Multi-Department Strategy
          const strategyRec = {
             title: `Multi-Department Strategy: ${entityLabel}`,
             description: nlpDesc,
             confidenceScore: 99,
             priority: 'URGENT',
             relatedEntities: groupRecs[0].relatedEntities, // Keep the same entity links
             proposedActions: mergedActions,
             strategyNotes: mergedNotes.length > 0 ? mergedNotes : ["Multi-vector AI synthesis indicates immediate action required."]
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

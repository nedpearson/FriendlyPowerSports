import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';

import './ExecutiveCommandAgent.js';
import './LeadIntelligenceAgent.js';
import './BDCFollowupAgent.js';
import './InventoryMatchmakingAgent.js';
import './SalesDeskAgent.js';
import './FIReadinessAgent.js';
import './ServiceRetentionAgent.js';
import './PartsProfitAgent.js';
import './CustomerLTVAgent.js';
import './AuditComplianceAgent.js';
import { ActionExecutionService } from './ActionExecutionService.js';

/**
 * Base template for registering an Agent.
 */
function createDummyAgent(id, name, description, priority, actionTypeName, defaultEntity) {
  AgentRegistry.register({
    id,
    name,
    description,
    supportedRoles: ['Owner', 'General Manager', 'Sales Associate'],
    supportedTriggers: ['MANUAL', 'SCHEDULED'],
    
    async evaluate(trigger, context) {
      console.log(`[${id}] Evaluating context...`);
      // Generates a mock recommendation
      return RecommendationEngine.generateRecommendation(this, {
        title: `${name} Insight`,
        description: `Analysis complete. Recommending structural adjustment based on current metrics.`,
        confidenceScore: Math.floor(Math.random() * 20) + 80,
        priority: priority,
        relatedEntities: [ EntityLinker.createLink(defaultEntity.type, defaultEntity.id, defaultEntity.label) ],
        proposedActions: [
          {
             id: `ACT-${Date.now()}`,
             actionType: actionTypeName,
             payload: { target: 'system' },
             requiresApproval: true,
             requiredScopes: ['ADMIN_WRITE']
          }
        ]
      }, context);
    }
  });
}

// Real agents imported and auto-registered above.

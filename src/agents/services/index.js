import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';

import './ExecutiveCommandAgent.js';
import './LeadIntelligenceAgent.js';
import './BDCFollowupAgent.js';
import './InventoryMatchmakingAgent.js';

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

// 5. Sales Desk Agent
createDummyAgent('sales_desk_agent', 'Sales Desk Agent', 'Active deal structuring', 'HIGH', 'ADJUST_GROSS', {type: 'Deal', id: 'DL-881', label: 'Pending Sale'});

// 6. F&I Readiness Agent
createDummyAgent('fi_readiness_agent', 'F&I Readiness Agent', 'Stipulation & approval checks', 'URGENT', 'SUBMIT_TO_LENDER', {type: 'Prequal', id: 'PQ-99', label: 'Prequal App'});

// 7. Service Retention Agent
createDummyAgent('service_retention_agent', 'Service Retention Agent', 'Recapture defecting service clients', 'MEDIUM', 'SEND_COUPON', {type: 'ServiceOrder', id: 'RO-112', label: 'RO #112'});

// 8. Parts Profit Agent
createDummyAgent('parts_profit_agent', 'Parts Profit Agent', 'Accessory upselling routing', 'LOW', 'ORDER_PARTS', {type: 'Part', id: 'PT-1', label: 'Slip-on Exhaust'});

// 9. Customer LTV Agent
createDummyAgent('customer_ltv_agent', 'Customer LTV Agent', 'Lifetime value cohort analysis', 'MEDIUM', 'UPGRADE_TIER', {type: 'Customer', id: 'CUST-1', label: 'John Davis'});

// 10. Audit Compliance Agent
createDummyAgent('audit_compliance_agent', 'Audit & Compliance Agent', 'Reg Z / Red Flags checking', 'URGENT', 'FREEZE_DEAL', {type: 'Deal', id: 'DL-444', label: 'Flagged Deal'});

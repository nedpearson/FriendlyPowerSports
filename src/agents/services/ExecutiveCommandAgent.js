import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { LEADS, CUSTOMERS, INVENTORY, DEALS, SERVICE_ORDERS, CRM_COMMUNICATIONS, CRM_APPOINTMENTS } from '../../data/mockDatabase';

export const ExecutiveCommandAgent = {
  id: 'executive_command_agent',
  name: 'Executive Command Agent',
  description: 'Global ops oversight scanning the entire dealership pipeline for systemic risk and high-value opportunities.',
  supportedRoles: ['Owner', 'General Manager'],
  supportedTriggers: ['APP_BOOT', 'DAILY_CRON', 'MANUAL'],

  async evaluate(trigger, context) {
    const recommendations = [];

    // 1. Aging Inventory Detection (Aging > 90 Days)
    const agedUnits = INVENTORY.filter(u => u.ageDays > 90 && (u.status === 'Active' || u.status === 'Recon'));
    if (agedUnits.length > 0) {
      // Find one specifically to flag
      const targetUnit = agedUnits.sort((a,b) => b.ageDays - a.ageDays)[0];
      const fpTotal = targetUnit.ageDays * targetUnit.fpCostPerDay;
      
      recommendations.push(
        RecommendationEngine.generateRecommendation(this, {
          title: `Aging Inventory Flag: ${targetUnit.year} ${targetUnit.model}`,
          description: `Unit ${targetUnit.stock} has aged ${targetUnit.ageDays} days. Floorplan carry cost is approximately $${fpTotal}. Recommend adjusting price or prioritizing BDC push.`,
          confidenceScore: 98,
          priority: 'HIGH',
          relatedEntities: [ EntityLinker.createLink('Inventory', targetUnit.id, `${targetUnit.year} ${targetUnit.model}`) ],
          proposedActions: [
            { id: `ACT-EXEC-${Date.now()}-1`, actionType: 'APPLY_DISCOUNT', payload: { unitId: targetUnit.id, discountAmount: 500 }, requiresApproval: true, requiredScopes: ['WRITE_INVENTORY'] },
            { id: `ACT-EXEC-${Date.now()}-2`, actionType: 'CREATE_BDC_CAMPAIGN', payload: { unitId: targetUnit.id, targetSegment: 'Aged Unit Push' }, requiresApproval: true, requiredScopes: ['WRITE_MARKETING'] }
          ]
        }, context)
      );
    }

    // 2. Stalled Deal Attention (Pending Stips)
    const stalledDeals = DEALS.filter(d => d.status === 'Pending Stips');
    stalledDeals.forEach(deal => {
      recommendations.push(
        RecommendationEngine.generateRecommendation(this, {
          title: `Stalled Deal Alert: F&I Blocker`,
          description: `Deal ${deal.id} is pending stipulations. Front gross is $${deal.frontGross}. Immediate manager intervention recommended to secure funding.`,
          confidenceScore: 95,
          priority: 'URGENT',
          relatedEntities: [ EntityLinker.createLink('Deal', deal.id, `Deal ${deal.id}`), EntityLinker.createLink('Customer', deal.customerId, `Customer Rec`) ],
          proposedActions: [
             { id: `ACT-EXEC-${Date.now()}-3`, actionType: 'ESCALATE_TO_FI_DIRECTOR', payload: { dealId: deal.id }, requiresApproval: false, requiredScopes: [] }
          ]
        }, context)
      );
    });

    // 3. Neglected Hot Leads
    const neglectedLeads = LEADS.filter(l => l.status === 'Unresponded' && l.stage === 'New');
    if (neglectedLeads.length > 0) {
       recommendations.push(
        RecommendationEngine.generateRecommendation(this, {
          title: `Manager Attention: ${neglectedLeads.length} Unresponded Leads`,
          description: `There are ${neglectedLeads.length} net new leads currently unresponded across the sales floor. SLA is severely breached.`,
          confidenceScore: 100,
          priority: 'URGENT',
          relatedEntities: neglectedLeads.map(l => EntityLinker.createLink('Lead', l.id, `Lead ID: ${l.id}`)),
          proposedActions: [
             { id: `ACT-EXEC-${Date.now()}-4`, actionType: 'REASSIGN_LEADS_ROUND_ROBIN', payload: { leads: neglectedLeads.map(l=>l.id) }, requiresApproval: true, requiredScopes: ['WRITE_LEADS'] }
          ]
        }, context)
      );
    }

    return recommendations;
  }
};

// Auto-register upon import
AgentRegistry.register(ExecutiveCommandAgent);

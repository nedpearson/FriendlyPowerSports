import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { DEALS, CRM_PREQUAL_APPLICATIONS, CRM_PREQUAL_CONSENTS, CRM_PREQUAL_RESULTS } from '../../data/mockDatabase';

export const FIReadinessAgent = {
  id: 'fi_readiness_agent',
  name: 'F&I Readiness Agent',
  description: 'Strictly permission-gated logic preventing funding delays by catching missing stipulations, backend up-sells, and consent gaps safely.',
  supportedRoles: ['F&I Manager', 'General Manager', 'Owner'],
  supportedTriggers: ['APP_BOOT', 'DEAL_UPDATED', 'PREQUAL_SUBMITTED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    // ---------------------------------------------------------------------------------
    // RBAC PERMISSION GATE: Do NOT let Sales Associates generate or see F&I operations
    // ---------------------------------------------------------------------------------
    if (!this.supportedRoles.includes(context.role) && context.role !== 'System') {
       console.log(`[FIReadinessAgent] Execution blocked. Role '${context.role}' lacks PII/FI permissions.`);
       return [];
    }

    const recommendations = [];

    // 1. Missing Stips
    const pendingDeals = DEALS.filter(d => d.status === 'Pending Stips');
    pendingDeals.forEach(deal => {
       recommendations.push(
         RecommendationEngine.generateRecommendation(this, {
           title: `Missing Docs: Deal ${deal.id}`,
           description: `Funding is delayed. Contract lacks necessary stipulations per Lender (${deal.lenderId}). Required: Proof of Income, POA.`,
           confidenceScore: 98,
           priority: 'URGENT',
           relatedEntities: [ EntityLinker.createLink('Deal', deal.id, `Finance Blocked`) ],
           proposedActions: [
              { id: `ACT-FI-${Date.now()}-1`, actionType: 'REQUEST_STIPS_FROM_BUYER', payload: { customerId: deal.customerId }, requiresApproval: true, requiredScopes: ['WRITE_COMMS', 'FI_ACCESS'] }
           ]
         }, context)
       );
    });

    // 2. Consent Trace Gap
    CRM_PREQUAL_APPLICATIONS.forEach(app => {
       const consentLogs = CRM_PREQUAL_CONSENTS.filter(c => c.customerId === app.customerId);
       if (consentLogs.length === 0) {
           recommendations.push(
             RecommendationEngine.generateRecommendation(this, {
               title: `Compliance Risk: Missing E-Consent`,
               description: `Prequal App ${app.id} was submitted but no matching Reg Z/FCRA soft-pull consent hash was found. Freeze logic activated.`,
               confidenceScore: 100,
               priority: 'URGENT',
               relatedEntities: [ EntityLinker.createLink('Prequal', app.id, `Compliance Risk`) ],
               proposedActions: [
                  { id: `ACT-FI-${Date.now()}-2`, actionType: 'FREEZE_PREQUAL', payload: { applicationId: app.id }, requiresApproval: false, requiredScopes: ['ADMIN_WRITE'] }
               ]
             }, context)
           );
       }
    });

    // 3. Aftermarket Readiness (Approved without Backend)
    const approvedDeals = DEALS.filter(d => d.status === 'Approved' && d.vscPrice === 0 && d.gapPrice === 0);
    approvedDeals.forEach(deal => {
       recommendations.push(
         RecommendationEngine.generateRecommendation(this, {
           title: `Backend Up-Sell Opportunity`,
           description: `Deal ${deal.id} approved but loaded with $0 VSC and $0 GAP. Front gross is stable ($${deal.frontGross}). Recommend F&I menu presentation.`,
           confidenceScore: 85,
           priority: 'MEDIUM',
           relatedEntities: [ EntityLinker.createLink('Deal', deal.id, `Backend Opp`) ],
           proposedActions: [
              { id: `ACT-FI-${Date.now()}-3`, actionType: 'NOTIFY_FI_MANAGER', payload: { dealId: deal.id }, requiresApproval: false, requiredScopes: [] }
           ]
         }, context)
       );
    });

    return recommendations;
  }
};

AgentRegistry.register(FIReadinessAgent);

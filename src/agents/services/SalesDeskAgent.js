import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { CRM_OPPORTUNITIES, LEADS, APPRAISALS } from '../../data/mockDatabase';

export const SalesDeskAgent = {
  id: 'sales_desk_agent',
  name: 'Sales Desk Agent',
  description: 'Proactively identifies stalled opportunities, enforces deal-flow continuity, and commands next-best-action execution for the sales floor.',
  supportedRoles: ['General Manager', 'Owner', 'Sales Associate'],
  supportedTriggers: ['APP_BOOT', 'OPPORTUNITY_UPDATED', 'DEAL_CREATED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    const recommendations = [];

    const activeOpps = CRM_OPPORTUNITIES.filter(o => o.status === 'Active');

    activeOpps.forEach(opp => {
       const lead = LEADS.find(l => l.id === opp.leadId);
       if (!lead) return;

       // 1. Stalled Opportunity (High probability, low activity)
       if (opp.probPct >= 60) {
          // If the lead was created > 3 days ago and no appointment
          const ageMs = Date.now() - new Date(lead.createdAt).getTime();
          if (ageMs > 3 * 86400000 && lead.stage !== 'Sold' && !lead.appointmentId) {
             recommendations.push(
               RecommendationEngine.generateRecommendation(this, {
                 title: `Stalled Deal Alert: ${opp.probPct}% Probability`,
                 description: `Opportunity ${opp.id} has a high estimated close rate but hasn't progressed to an appointment in over 3 days. Total gross risk: $${opp.estimatedFrontGross + opp.estimatedBackGross}.`,
                 confidenceScore: 92,
                 priority: 'HIGH',
                 relatedEntities: [ EntityLinker.createLink('Opportunity', opp.id, `Active Opp`) ],
                 proposedActions: [
                    { id: `ACT-DESK-${Date.now()}-1`, actionType: 'MANAGER_T_O', payload: { opportunityId: opp.id }, requiresApproval: false, requiredScopes: [] },
                    { id: `ACT-DESK-${Date.now()}-2`, actionType: 'SEND_SMS', payload: { customerId: opp.customerId, message: "We want your business. Can we beat your best quote?" }, requiresApproval: true, requiredScopes: ['WRITE_COMMS'] }
                 ]
               }, context)
             );
          }
       }

       // 2. Unowned Opportunity
       if (!lead.empId) {
          recommendations.push(
               RecommendationEngine.generateRecommendation(this, {
                 title: `Unowned Opportunity Risk`,
                 description: `Active working opportunity ${opp.id} currently lacks a dedicated Sales Associate assignment.`,
                 confidenceScore: 100,
                 priority: 'URGENT',
                 relatedEntities: [ EntityLinker.createLink('Opportunity', opp.id, `Unassigned Opp`) ],
                 proposedActions: [
                    { id: `ACT-DESK-${Date.now()}-3`, actionType: 'ASSIGN_ROUND_ROBIN', payload: { opportunityId: opp.id }, requiresApproval: true, requiredScopes: ['WRITE_LEADS'] }
                 ]
               }, context)
             );
       }
    });

    // 3. Trade Follow-up Needed
    const pendingAppraisals = APPRAISALS.filter(a => a.status === 'Pending Customer Approval');
    pendingAppraisals.forEach(appraisal => {
         recommendations.push(
            RecommendationEngine.generateRecommendation(this, {
              title: `Trade Action Needed: ${appraisal.year} ${appraisal.model}`,
              description: `A ${appraisal.expectedACV} appraisal on ${appraisal.make} is pending customer approval. Next step: Finalize trade allowance to close the deal.`,
              confidenceScore: 85,
              priority: 'MEDIUM',
              relatedEntities: [ EntityLinker.createLink('Appraisal', appraisal.id, `Pending Trade`) ],
              proposedActions: [
                 { id: `ACT-DESK-${Date.now()}-4`, actionType: 'SCHEDULE_CALL', payload: { customerId: appraisal.customerId }, requiresApproval: false, requiredScopes: [] }
              ]
            }, context)
          );
    });

    return recommendations;
  }
};

AgentRegistry.register(SalesDeskAgent);

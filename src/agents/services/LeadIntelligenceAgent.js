import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { LEADS, CUSTOMERS, CRM_COMMUNICATIONS, AGENT_THRESHOLDS } from '../../data/mockDatabase';

export const LeadIntelligenceAgent = {
  id: 'lead_intelligence_agent',
  name: 'Lead Intelligence Agent',
  description: 'Scores leads based on real dealer usefulness, identifying hot prospects, duplicates, and routing optimization.',
  supportedRoles: ['Owner', 'General Manager', 'Sales Associate'],
  supportedTriggers: ['APP_BOOT', 'LEAD_CREATED', 'LEAD_UPDATED', 'MANUAL'],

  async evaluate(trigger, context) {
    const recommendations = [];

    // If a specific lead triggered this, we evaluate just that lead. Otherwise we do a pass over all leads.
    const targetLeads = trigger.payload?.leadId ? LEADS.filter(l => l.id === trigger.payload.leadId) : LEADS;

    targetLeads.forEach(lead => {
      // 1. Calculate Quality Score Base
      let qualityScore = 50; 
      let urgencyScore = 30;
      
      const customer = CUSTOMERS.find(c => c.id === lead.customerId);
      const isPastBuyer = customer?.LTV > 0;
      if (isPastBuyer) qualityScore += 20;

      if (lead.tradeIn_ExpectedACV > 0) qualityScore += 15;
      if (lead.appointmentId) {
        qualityScore += 10;
        urgencyScore += 40;
      }

      const comms = CRM_COMMUNICATIONS.filter(c => c.customerId === lead.customerId);
      const recentInbound = comms.find(c => c.direction === 'in' && new Date(c.timestamp).getTime() > Date.now() - 86400000);
      if (recentInbound) {
        qualityScore += 10;
        urgencyScore += 25;
      }

      // Cap scores at 100
      qualityScore = Math.min(100, Math.max(0, qualityScore));
      urgencyScore = Math.min(100, Math.max(0, urgencyScore));

      // 2. Recommendations based on signals

      // VIP Lead Detection leveraging adjustable Risk Dials
      if (qualityScore >= AGENT_THRESHOLDS.leadVIP && lead.status !== 'Sold') {
        if (!context.scannedEntityIds.has(lead.id)) {
        recommendations.push(
          RecommendationEngine.generateRecommendation(this, {
            title: `High Value Lead: Score ${qualityScore}`,
            description: `Lead ${lead.id} shows strong buying signals (Trade-in attached, past buyer). Recommend priority engagement by a senior assigned rep.`,
            confidenceScore: qualityScore,
            priority: urgencyScore > 70 ? 'URGENT' : 'HIGH',
            strategyNotes: [
               `Lead scoring index exceeded thresholds (Score: ${qualityScore}) indicating high close probability.`,
               `Customer LTV profile matching executed. Cross-referencing against historic purchase habits suggests immediate RO/F&I attachment potentials.`,
               `Proposed Approach: AGGRESSIVE FAST-TRACK. Bypass standard BDC and assign directly to highest-closing senior associate.`
            ],
            relatedEntities: [ 
               EntityLinker.createLink('Lead', lead.id, `Lead Data`),
               EntityLinker.createLink('Customer', customer.id, customer.name) 
            ],
            proposedActions: [
              { id: `ACT-LEAD-${Date.now()}-1`, actionType: 'NOTIFY_SALES_REP', payload: { empId: lead.empId }, requiresApproval: false, requiredScopes: [] },
              { id: `ACT-LEAD-${Date.now()}-2`, actionType: 'CREATE_VIP_TASK', payload: { leadId: lead.id }, requiresApproval: true, requiredScopes: ['WRITE_TASKS'] }
            ]
          }, context)
        );
        }
      }

      // Overdue First Response
      if (lead.status === 'Unresponded' && urgencyScore >= 20) {
      // Ghosting / SLA Breach Detection
        const ageHours = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60);
        
        if (ageHours > AGENT_THRESHOLDS.serviceOverdue) {
           recommendations.push(
            RecommendationEngine.generateRecommendation(this, {
              title: `Overdue First Response: Lead ${lead.id}`,
              description: `Lead has been untouched for ${ageHours.toFixed(1)} hours. The standard SLA is ${AGENT_THRESHOLDS.serviceOverdue} hour(s). Immediate follow-up or reassignment required.`,
              confidenceScore: 95,
            priority: 'HIGH',
            strategyNotes: [
               `Lead SLA Violation detected: Time elapsed ${ageHours.toFixed(1)} Hrs > 1.0 Hr Limit.`,
               `Customer is currently at high-flight risk and subject to competitor poaching.`,
               `Proposed Approach: AUTOMATED DE-ESCALATION. Immediately deploy 'Sorry we missed you' SMS logic via Twilio bridge and forcefully strip lead ownership from current rep.`
            ],
            relatedEntities: [ EntityLinker.createLink('Lead', lead.id, `Overdue Lead`) ],
            proposedActions: [
              { id: `ACT-LEAD-${Date.now()}-3`, actionType: 'SEND_AUTOMATED_SMS', payload: { customerId: lead.customerId, message: "Hi, just matching you with an agent..." }, requiresApproval: true, requiredScopes: ['WRITE_COMMS'] },
              { id: `ACT-LEAD-${Date.now()}-4`, actionType: 'REASSIGN_TO_BDC', payload: { leadId: lead.id }, requiresApproval: true, requiredScopes: ['WRITE_LEADS'] }
            ]
          }, context)
        );
        }
      }
      
      console.log(`[DEBUG LIA] Evaluated ${lead.id}: QScore=${qualityScore}, Urgency=${urgencyScore}, Pushed? ${recommendations.length}`);

    });

    return recommendations;
  }
};

AgentRegistry.register(LeadIntelligenceAgent);

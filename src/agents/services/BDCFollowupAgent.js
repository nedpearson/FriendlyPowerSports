import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { LEADS, CUSTOMERS, CRM_COMMUNICATIONS } from '../../data/mockDatabase';

export const BDCFollowupAgent = {
  id: 'bdc_followup_agent',
  name: 'BDC Follow-Up Agent',
  description: 'Monitors lead SLAs, prevents leakage, and reactivates stale opportunities via automated cadences.',
  supportedRoles: ['BDC Agent', 'Sales Associate', 'General Manager'],
  supportedTriggers: ['APP_BOOT', 'LEAD_UPDATED', 'COMMUNICATION_RECEIVED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    const recommendations = [];
    
    // We scan all actively tracked leads
    const activeLeads = LEADS.filter(l => l.status !== 'Sold');

    activeLeads.forEach(lead => {
      const comms = CRM_COMMUNICATIONS.filter(c => c.customerId === lead.customerId);
      const outboundComms = comms.filter(c => c.direction === 'out');
      const inboundComms = comms.filter(c => c.direction === 'in');
      
      const lastOutbound = outboundComms.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      const lastInbound = inboundComms.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      // 1. Hot Lead - No Recent Touch
      // Meaning: They replied to us recently, but we haven't replied back, or we haven't touched them in 24h despite being hot.
      if (lead.stage === 'Working' && !lead.appointmentId) {
        const timeSinceLastOutbound = lastOutbound ? (Date.now() - new Date(lastOutbound.timestamp).getTime()) : Infinity;
        
        if (timeSinceLastOutbound > 86400000) { // 24 hours
           recommendations.push(
              RecommendationEngine.generateRecommendation(this, {
              title: `Hot Lead Needs Contact: ${lead.id}`,
              description: `Lead is actively in the 'Working' stage without an appointment, but hasn't been contacted in over 24 hours. Keep the momentum going.`,
              confidenceScore: 85,
              priority: 'HIGH',
              relatedEntities: [ EntityLinker.createLink('Lead', lead.id, `Lead Profile`) ],
              proposedActions: [
                 { id: `ACT-BDC-${Date.now()}-1`, actionType: 'SCHEDULE_CALL', payload: { customerId: lead.customerId }, requiresApproval: false, requiredScopes: [] },
                 { id: `ACT-BDC-${Date.now()}-2`, actionType: 'SEND_SMS', payload: { customerId: lead.customerId, message: "Hi! Are you still looking to come in this week?" }, requiresApproval: true, requiredScopes: ['WRITE_COMMS'] }
              ]
            }, context)
           );
        }
      }

      // 2. Overdue First Response (Different from the manager view; this is for the worker)
      if (lead.status === 'Unresponded') {
         const ageMs = Date.now() - new Date(lead.createdAt).getTime();
         const ageHours = ageMs / (1000 * 60 * 60);

         if (ageHours > 1) { // 1 Hour SLA for BDC specifically
            recommendations.push(
              RecommendationEngine.generateRecommendation(this, {
              title: `SLA Breach: Overdue Followup`,
              description: `Lead ${lead.id} is >1 hour old. Immediately touch this lead via Phone or SMS.`,
              confidenceScore: 95,
              priority: 'URGENT',
              relatedEntities: [ EntityLinker.createLink('Lead', lead.id, `Overdue Lead`) ],
              proposedActions: [
                 { id: `ACT-BDC-${Date.now()}-3`, actionType: 'START_CALL_DIALER', payload: { customerId: lead.customerId }, requiresApproval: false, requiredScopes: [] }
              ]
            }, context)
           );
         }
      }

      // 3. Stale Lead Reactivation / Lost Reactivation
      // If a lead was lost > 60 days ago
      if (lead.status === 'Lost') {
         const ageSinceLost = Date.now() - new Date(lead.updatedAt || lead.createdAt).getTime();
         if (ageSinceLost > (60 * 86400000)) {
           recommendations.push(
              RecommendationEngine.generateRecommendation(this, {
              title: `Reactivation Opportunity: 60-Day Dead Lead`,
              description: `Lead ${lead.id} was lost 60 days ago. Recommend dropping into the 60-day reactivation SMS drip sequence.`,
              confidenceScore: 70,
              priority: 'MEDIUM',
              relatedEntities: [ EntityLinker.createLink('Lead', lead.id, `Lost Lead`) ],
              proposedActions: [
                 { id: `ACT-BDC-${Date.now()}-4`, actionType: 'ADD_TO_CAMPAIGN', payload: { leadId: lead.id, campaignId: 'CAMP-REACTIVATE' }, requiresApproval: true, requiredScopes: ['WRITE_MARKETING'] }
              ]
            }, context)
           );
         }
      }
    });

    return recommendations;
  }
};

AgentRegistry.register(BDCFollowupAgent);

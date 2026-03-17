import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { CUSTOMERS, SERVICE_ORDERS, DEALS } from '../../data/mockDatabase';

export const CustomerLTVAgent = {
  id: 'customer_ltv_agent',
  name: 'Customer LTV Agent',
  description: 'Calculates Lifetime Value, generates repurchase windows, and flags high-value churn risks.',
  supportedRoles: ['General Manager', 'Owner', 'Sales Associate'],
  supportedTriggers: ['APP_BOOT', 'CUSTOMER_UPDATED', 'DEAL_FINALIZED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    const recommendations = [];

    CUSTOMERS.forEach(customer => {
        // 1. High LTV Churn Risk
        if (customer.LTV > 10000) {
            const msSinceContact = customer.lastContacted ? (Date.now() - new Date(customer.lastContacted).getTime()) : Infinity;
            const daysSinceContact = msSinceContact / (1000 * 60 * 60 * 24);

            if (daysSinceContact > 90) { // 90 days no contact for a VIP/High LTV
               recommendations.push(
                 RecommendationEngine.generateRecommendation(this, {
                   title: `VIP Churn Risk: ${customer.name}`,
                   description: `Customer has a Lifetime Value of $${customer.LTV.toLocaleString()} but hasn't been engaged in over 90 days. Recommend a VIP pulse check.`,
                   confidenceScore: 89,
                   priority: 'HIGH',
                   relatedEntities: [ EntityLinker.createLink('Customer', customer.id, `VIP Profile`) ],
                   proposedActions: [
                      { id: `ACT-LTV-${Date.now()}-1`, actionType: 'SCHEDULE_CALL', payload: { customerId: customer.id, note: 'VIP Pulse Check' }, requiresApproval: false, requiredScopes: [] }
                   ]
                 }, context)
               );
            }
        }

        // 2. Repurchase Window / Upgrade Cycle
        // Find their last deal
        const pastDeals = DEALS.filter(d => d.customerId === customer.id && d.status === 'Funded');
        if (pastDeals.length > 0) {
            // Sort to latest
            pastDeals.sort((a,b) => new Date(b.date) - new Date(a.date));
            const latestDeal = pastDeals[0];

            const dealAgeMs = Date.now() - new Date(latestDeal.date).getTime();
            const dealAgeYears = dealAgeMs / (1000 * 60 * 60 * 24 * 365);

            if (dealAgeYears > 3) { // Passed the 3 year mark, prime upgrade territory
                recommendations.push(
                 RecommendationEngine.generateRecommendation(this, {
                   title: `Upgrade Opportunity: ${customer.name}`,
                   description: `Customer bought their last unit > 3 years ago (Deal ${latestDeal.id}). They are entering prime equity-upgrade territory. Request automated trade appraisal link.`,
                   confidenceScore: 92,
                   priority: 'MEDIUM',
                   relatedEntities: [ EntityLinker.createLink('Customer', customer.id, `Equity Upgrade`) ],
                   proposedActions: [
                      { id: `ACT-LTV-${Date.now()}-2`, actionType: 'SEND_SMS', payload: { customerId: customer.id, message: "We want to buy back your unit. Click here for an instant quote." }, requiresApproval: true, requiredScopes: ['WRITE_COMMS'] }
                   ]
                 }, context)
               );
            }
        }

        // 3. Cross-Sell Candidate (Sales but no Service)
        if (pastDeals.length > 0) {
            const hasService = SERVICE_ORDERS.some(ro => ro.customerId === customer.id);
            if (!hasService) {
                // Bought from us, never serviced with us
                 recommendations.push(
                 RecommendationEngine.generateRecommendation(this, {
                   title: `Cross-Sell Target: Missing Service Revenue`,
                   description: `Customer ${customer.id} has purchased units but has $0 in Service ROI. Introduce them to the Service Drive.`,
                   confidenceScore: 78,
                   priority: 'LOW',
                   relatedEntities: [ EntityLinker.createLink('Customer', customer.id, `No-Service Buyer`) ],
                   proposedActions: [
                      { id: `ACT-LTV-${Date.now()}-3`, actionType: 'ADD_TO_CAMPAIGN', payload: { customerId: customer.id, campaign: 'Service Introduction' }, requiresApproval: true, requiredScopes: ['WRITE_MARKETING'] }
                   ]
                 }, context)
               );
            }
        }
    });

    return recommendations;
  }
};

AgentRegistry.register(CustomerLTVAgent);

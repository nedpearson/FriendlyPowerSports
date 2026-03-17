import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { SERVICE_ORDERS, CUSTOMERS } from '../../data/mockDatabase';

export const ServiceRetentionAgent = {
  id: 'service_retention_agent',
  name: 'Service Retention Agent',
  description: 'Monitors the fixed ops pipeline to identify overdue maintenance, capture defecting customers, and enforce post-service satisfaction tracking.',
  supportedRoles: ['General Manager', 'Owner', 'Service Tech', 'Sales Associate'],
  supportedTriggers: ['APP_BOOT', 'SERVICE_ORDER_UPDATED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    const recommendations = [];

    // 1. Inactive Service Customer Outreach (Defectors & Aged)
    const inactiveCustomers = CUSTOMERS.filter(c => 
       c.tags.includes('Service Defector') || 
       (c.lastContacted && (Date.now() - new Date(c.lastContacted).getTime() > 365 * 86400000))
    );

    inactiveCustomers.forEach(customer => {
       recommendations.push(
         RecommendationEngine.generateRecommendation(this, {
           title: `Retention Opportunity: ${customer.name}`,
           description: `Customer is tagged as a defector or hasn't had service contact in > 1 year. LTV: $${customer.LTV}. Recommend a "We Miss You" service discount SMS.`,
           confidenceScore: 88,
           priority: 'MEDIUM',
           relatedEntities: [ EntityLinker.createLink('Customer', customer.id, `Inactive Profile`) ],
           proposedActions: [
              { id: `ACT-SRV-${Date.now()}-1`, actionType: 'SEND_COUPON', payload: { customerId: customer.id, discountScope: 'Oil Change' }, requiresApproval: false, requiredScopes: [] },
              { id: `ACT-SRV-${Date.now()}-2`, actionType: 'SCHEDULE_CALL', payload: { customerId: customer.id }, requiresApproval: false, requiredScopes: [] }
           ]
         }, context)
       );
    });

    // 2. Advisor Follow-up Needed
    // Look at recently completed ROs (In reality we'd have a 'Completed' status, here we'll flag 'Quality Check' as our post-service surrogate)
    const recentService = SERVICE_ORDERS.filter(ro => ro.status === 'Quality Check');
    recentService.forEach(ro => {
        recommendations.push(
         RecommendationEngine.generateRecommendation(this, {
           title: `Post-Service CSI Follow-Up: RO ${ro.id}`,
           description: `Service Order for ${ro.unitDesc} is in Quality Check. Prompting Service Advisor to execute the 48-hour satisfaction follow-up call.`,
           confidenceScore: 95,
           priority: 'HIGH',
           relatedEntities: [ EntityLinker.createLink('ServiceOrder', ro.id, `Pending RO`) ],
           proposedActions: [
              { id: `ACT-SRV-${Date.now()}-3`, actionType: 'CREATE_TASK', payload: { assignedTo: ro.advisorId, taskType: 'CSI Call' }, requiresApproval: false, requiredScopes: [] }
           ]
         }, context)
       );
    });

    // 3. Declined Work Recovery (We mock this by looking for Customer Pay ROs that had no actual labor sold)
    const declinedWork = SERVICE_ORDERS.filter(ro => ro.type === 'Customer Pay' && ro.laborHoursActual === 0 && ro.laborHoursSold > 0 && ro.status !== 'In Progress');
    declinedWork.forEach(ro => {
        recommendations.push(
         RecommendationEngine.generateRecommendation(this, {
           title: `Declined Work Recovery: RO ${ro.id}`,
           description: `Customer declined ${ro.laborHoursSold} hours of quoted labor for ${ro.unitDesc}. Recommend dripping a 15% discount offer in 30 days.`,
           confidenceScore: 82,
           priority: 'LOW',
           relatedEntities: [ EntityLinker.createLink('ServiceOrder', ro.id, `Declined Labor`) ],
           proposedActions: [
              { id: `ACT-SRV-${Date.now()}-4`, actionType: 'ADD_TO_CAMPAIGN', payload: { customerId: ro.customerId, campaign: 'Declined Work Drip' }, requiresApproval: true, requiredScopes: ['WRITE_MARKETING'] }
           ]
         }, context)
       );
    });

    return recommendations;
  }
};

AgentRegistry.register(ServiceRetentionAgent);

import { ActionResult } from './ActionResult';
import { AgentLogger } from '../audit/AgentLogger';
import { setAgentRecommendationStatus } from '../../data/selectors';

/**
 * Registry mapping action types to actual execution logic and scope requirements.
 */
export const ActionRegistry = {
  ACTIONS: {
    'SNOOZE_RECOMMENDATION': {
      requiresApproval: false,
      requiredScopes: ['SNOOZE_REC'],
      isRisky: false,
      description: 'Temporarily hide a recommendation for a specified duration.',
      async execute(actionData, context) {
        const { recommendationId, durationDays = 1 } = actionData;
        const success = setAgentRecommendationStatus(recommendationId, 'Snoozed', `Snoozed for ${durationDays} days`);
        if (success) {
          return ActionResult.Success({ status: 'Snoozed', recommendationId });
        }
        return ActionResult.Failure('Failed to snooze recommendation');
      },
      preview(actionData) { return `Will snooze recommendation ${actionData.recommendationId} for ${actionData.durationDays || 1} days.`; }
    },
    'REASSIGN_OWNER': {
      requiresApproval: true,
      requiredScopes: ['REASSIGN_OWNER'],
      isRisky: false,
      description: 'Transfer ownership of an entity or recommendation.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'Reassigned', newOwnerId: actionData.newOwnerId, entityId: actionData.entityId });
      },
      preview(actionData) { return `Will reassign ${actionData.entityId} to user ${actionData.newOwnerId}.`; }
    },
    'CREATE_TASK': {
      requiresApproval: false,
      requiredScopes: ['CREATE_TASK'],
      isRisky: false,
      description: 'Generate a follow-up task mapped to an action or recommendation.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'Task Created', taskId: `TSK-${Math.floor(Math.random() * 10000)}`, title: actionData.title });
      },
      preview(actionData) { return `Will create a task: "${actionData.title}" assigned to you.`; }
    },
    'FINANCE_RATE_MATCH': {
      requiresApproval: true,
      requiredScopes: ['FINANCE_EXECUTE'],
      isRisky: true,
      description: 'Submit an automated rate match request to lending partners.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'Rate Match Submitted', dealId: actionData.dealId });
      },
      preview(actionData) { return `Will submit structured rate match request for Deal ${actionData.dealId}.`; }
    },
    'REASSIGN_LEADS_ROUND_ROBIN': {
      requiresApproval: true,
      requiredScopes: ['REASSIGN_LEADS'],
      isRisky: true,
      description: 'Reassign orphaned or misrouted leads using standard round-robin distribution rules.',
      async execute(actionData, context) {
         const targetId = actionData.manualOverrideEmployeeId || actionData.targetEmployeeId || 'ROUND_ROBIN_POOL';
         const assignedLocation = actionData.manualOverrideLocationId || actionData.targetLocationId || 'GLOBAL';
         return ActionResult.Success({ status: 'Leads Reassigned', target: targetId, location: assignedLocation, count: actionData.leadCount || 1 });
      },
      preview(actionData) { return `Will reassign ${actionData.leadCount || 1} leads to ${actionData.manualOverrideEmployeeId || actionData.targetEmployeeId || 'Round Robin Pool'} at ${actionData.manualOverrideLocationId || actionData.targetLocationId || 'all locations'}.`; }
    },
    'REASSIGN_TO_BDC': {
      requiresApproval: true,
      requiredScopes: ['WRITE_LEADS'],
      isRisky: false,
      description: 'Forcefully strip lead ownership and route to standard BDC triage.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'Assigned to BDC', leadId: actionData.leadId });
      },
      preview(actionData) { return `Will enforce SLA rules and strip lead ${actionData.leadId} to the BDC pool.`; }
    },
    'SEND_AUTOMATED_SMS': {
      requiresApproval: true,
      requiredScopes: ['WRITE_COMMS'],
      isRisky: true,
      description: 'Dispatch automated SMS via external gateway.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'SMS Dispatched', customerId: actionData.customerId });
      },
      preview(actionData) { return `Will dispatch automated SMS to customer ${actionData.customerId}: "${actionData.message}"`; }
    },
    'NOTIFY_SALES_REP': {
      requiresApproval: false,
      requiredScopes: [],
      isRisky: false,
      description: 'Push immediate alert notification to assigned sales associate.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'Notification Pushed', empId: actionData.empId });
      },
      preview(actionData) { return `Will ping internal notification to employee ${actionData.empId}.`; }
    },
    'CREATE_VIP_TASK': {
      requiresApproval: true,
      requiredScopes: ['WRITE_TASKS'],
      isRisky: false,
      description: 'Generate high-urgency VIP task for management review.',
      async execute(actionData, context) {
         return ActionResult.Success({ status: 'VIP Task Created', leadId: actionData.leadId });
      },
      preview(actionData) { return `Will generate a High-Priority VIP Task for lead ${actionData.leadId}.`; }
    }
  },

  /**
   * Fetch action configuration by type
   */
  getActionDefinition(actionType) {
    return this.ACTIONS[actionType];
  },

  /**
   * Determine if an action is known
   */
  isValidAction(actionType) {
    return !!this.ACTIONS[actionType];
  }
};

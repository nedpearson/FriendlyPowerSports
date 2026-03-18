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

import { AgentLogger } from '../audit/AgentLogger';
import { ActionRegistry } from './ActionRegistry';
import { PermissionValidator } from './PermissionValidator';
import { ActionResult } from './ActionResult';
import { AgentMetrics } from '../audit/AgentMetrics';

/**
 * Isolated Action Layer that protects against unsafe or unapproved mutations.
 */
export const ActionLayer = {
  /**
   * Primary entry point for executing an AgentAction safely.
   */
  async execute(actionType, actionData, context, agentId = 'SYSTEM') {
    if (!ActionRegistry.isValidAction(actionType)) {
      return ActionResult.Failure(`Unknown action type: ${actionType}`);
    }

    const definition = ActionRegistry.getActionDefinition(actionType);
    const actionId = `ACT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    AgentLogger.logEvent({
      agentId,
      eventType: 'ACTION_REQUESTED',
      details: { actionId, actionType, requiresApproval: definition.requiresApproval },
      userId: context.userId
    });

    // Enforcement: Blocks execution if it requires human approval but context lacks it
    if (definition.requiresApproval && !context.isApproved) {
      AgentLogger.logEvent({
        agentId,
        eventType: 'ACTION_BLOCKED',
        details: { actionId, reason: "Missing human authorization for risky action" },
        userId: context.userId
      });
      return ActionResult.Failure("Awaiting human approval", actionId);
    }

    // Checking permission scopes 
    if (!PermissionValidator.hasPermission(context.userRole, definition.requiredScopes)) {
      AgentLogger.logEvent({
        agentId,
        eventType: 'PERMISSION_DENIED',
        details: { actionId, required: definition.requiredScopes, roleProvided: context.userRole },
        userId: context.userId
      });
      return ActionResult.Failure("Insufficient permissions", actionId);
    }

    // Support dryRun previews
    if (context.dryRun) {
      return ActionResult.Preview(definition.preview(actionData));
    }

    try {
      const result = await definition.execute(actionData, context);

      if (result.success) {
         AgentLogger.logEvent({
           agentId,
           eventType: 'ACTION_EXECUTED',
           details: { actionId, actionType, outcome: result.data },
           userId: context.userId
         });
      } else {
         AgentLogger.logEvent({
           agentId,
           eventType: 'ACTION_FAILED',
           details: { actionId, actionType, errorMessage: result.reason },
           userId: context.userId
         });
      }

      AgentMetrics.trackActionExecution(actionType, result.success, actionData);

      result.auditId = actionId;
      return result;

    } catch (error) {
       AgentLogger.logEvent({
        agentId,
        eventType: 'ACTION_FAILED_EXCEPTION',
        details: { actionId, actionType, errorMessage: error.message },
        userId: context.userId
      });
      return ActionResult.Failure(error.message, actionId);
    }
  }
};

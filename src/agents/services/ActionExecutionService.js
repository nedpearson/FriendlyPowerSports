import { AGENT_ACTIONS, AGENT_AUDIT_LOGS } from '../../data/mockDatabase';

/**
 * Refactored Phase 2 Execution Service that persists action statuses 
 * and strictly honors execution requirements into the Data Layer.
 */
export const ActionExecutionService = {

  createDraft(actionPayload, recId) {
    const newAction = {
       ...actionPayload,
       id: actionPayload.id || `ACT-${Date.now()}`,
       recommendationId: recId,
       executionStatus: 'DRAFT',
       createdAt: new Date().toISOString()
    };
    AGENT_ACTIONS.push(newAction);
    return newAction;
  },
  
  async execute(actionId, context) {
    const action = AGENT_ACTIONS.find(a => a.id === actionId);
    if (!action) throw new Error("Action reference not found in database.");

    // Initial audit trace for the execution attempt
    this._logAudit(action, 'ACTION_ATTEMPTED', context, { requiresApproval: action.requiresApproval });

    // Authorization evaluation logic 
    if (action.requiresApproval && action.executionStatus !== 'APPROVED_PENDING_RUN') {
       this._logAudit(action, 'ACTION_BLOCKED', context, { reason: "Requires manager authorization" });
       action.failureReason = "Draft action cannot be executed without explicit UI approval flag.";
       action.executionStatus = 'FAILED';
       return { success: false, reason: action.failureReason };
    }

    try {
      // Execute the underlying operational dispatch
      const outcome = await this._dispatch(action);

      // Mutate database record to reflect success
      action.executionStatus = 'EXECUTED';
      action.executedAt = new Date().toISOString();
      action.executedBy = context.userId;

      this._logAudit(action, 'ACTION_EXECUTED', context, { outcome });
      return { success: true, outcome };

    } catch(err) {
      action.executionStatus = 'FAILED';
      action.failureReason = err.message || "Unknown error occurred";
      
      this._logAudit(action, 'ACTION_FAILED', context, { error: action.failureReason });
      return { success: false, reason: action.failureReason };
    }
  },

  approveDraftForRun(actionId, userId) {
     const action = AGENT_ACTIONS.find(a => a.id === actionId);
     if(action) {
        action.executionStatus = 'APPROVED_PENDING_RUN';
        action.approvedBy = userId;
        action.approvedAt = new Date().toISOString();
     }
     return action;
  },

  _logAudit(action, eventType, context, details = {}) {
     AGENT_AUDIT_LOGS.push({
       id: `AUD-ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
       eventType,
       agentId: action.agentId || 'SYSTEM_WRAPPER',
       userId: context.userId,
       timestamp: new Date().toISOString(),
       details: { actionId: action.id, actionType: action.actionType, ...details }
     });
  },

  async _dispatch(action) {
     // Mock operation: In reality this would call out to your CRM/Inventory specific endpoints
     console.log(`[ActionExecutionService] Payload dispatched to subsystem:`, action.payload);
     return { resolved: true, rowsAffected: 1 };
  }
};

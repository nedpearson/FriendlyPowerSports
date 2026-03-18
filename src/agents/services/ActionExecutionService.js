import { ActionLayer } from '../executors/ActionLayer';

/**
 * Service Layer for triggering, previewing, and managing actionable intelligence execution.
 */
export const ActionExecutionService = {
  
  /**
   * Safe dry-run to preview what an action will do before committing.
   * Useful for showing confirmation modals in the UI.
   * 
   * @param {string} actionType - The type of action (e.g., 'SNOOZE_RECOMMENDATION')
   * @param {object} actionData - The payload
   * @param {object} context - User context (userId, userRole)
   */
  async previewAction(actionType, actionData, context) {
    const previewContext = { ...context, dryRun: true };
    return await ActionLayer.execute(actionType, actionData, previewContext, 'Service_ActionExecution');
  },

  /**
   * Commits the actual execution of an agent action.
   * 
   * @param {string} actionType - The type of action
   * @param {object} actionData - The payload
   * @param {object} context - User context (userId, userRole, isApproved boolean)
   */
  async executeAction(actionType, actionData, context) {
    return await ActionLayer.execute(actionType, actionData, context, 'Service_ActionExecution');
  }
};

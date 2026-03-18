/**
 * @typedef {Object} AgentContext
 * @property {string} userId - The ID of the authenticated user
 * @property {string} role - The user's role (e.g., Owner, Manager, Employee)
 * @property {string} locationId - The current location context
 * @property {string} company - The selected multi-tenant company
 */

/**
 * @typedef {Object} AgentTrigger
 * @property {string} type - SCHEDULED, MANUAL, EVENT_DRIVEN, RECORD_UPDATE
 * @property {string} [sourceId] - ID of the record that triggered it, if applicable
 * @property {string} timestamp - ISO timestamp of the trigger
 */

/**
 * @typedef {Object} AgentEntityLink
 * @property {string} entityType - e.g., 'Lead', 'Customer', 'Inventory', 'Opportunity'
 * @property {string} entityId - The unique ID of the linked record
 * @property {string} label - Human-readable label (e.g., 'John Davis Lead')
 */

/**
 * @typedef {Object} AgentRecommendation
 * @property {string} id - Unique recommendation ID
 * @property {string} agentId - Source agent
 * @property {string} title - Short summary
 * @property {string} description - Detailed rationale
 * @property {AgentEntityLink[]} relatedEntities - Safely linked data
 * @property {number} confidenceScore - 0 to 100
 * @property {string} priority - LOW, MEDIUM, HIGH, URGENT
 * @property {AgentAction[]} proposedActions - Actions the user can execute
 * @property {string} status - PENDING, APPROVED, DISMISSED, ACTIONED
 */

/**
 * @typedef {Object} AgentAction
 * @property {string} id - Unique action ID
 * @property {string} actionType - E.g., SEND_EMAIL, UPDATE_PRICE, CREATE_TASK
 * @property {Object} payload - Data needed to execute
 * @property {boolean} requiresApproval - If true, human must click 'Approve'
 * @property {AgentPermissionScope[]} requiredScopes - Required permissions
 */

/**
 * @typedef {Object} AgentAuditEvent
 * @property {string} eventId
 * @property {string} agentId
 * @property {string} eventType - e.g., RECOMMENDATION_GENERATED, ACTION_EXECUTED
 * @property {string} timestamp
 * @property {Object} details
 * @property {string} [userId] - Who triggered/approved
 */

/**
 * @typedef {string} AgentPermissionScope
 * Enum for scopes like 'READ_LEADS', 'WRITE_INVENTORY', 'APPROVE_DEALS'
 */

export const Types = {}; // Dummy export to make it a module

/**
 * Standardizes how AI outputs link safely to system entities.
 */
export const EntityLinker = {
  /**
   * Creates a standardized link object recognized by the app.
   */
  createLink(entityType, entityId, label) {
    return {
      entityType, // Lead, Customer, Inventory, Deal, Staff
      entityId,
      label,
      _linkHash: btoa(`${entityType}:${entityId}`) // For fast duplicate checking/indexing
    };
  },

  /**
   * Simulates resolving a link against the primary database.
   */
  async resolveLink(link) {
    // In a real app this would query the specific table identified by entityType
    console.log(`[EntityLinker] Resolving ${link.entityType} ID: ${link.entityId}`);
    return { id: link.entityId, _mockResolved: true, type: link.entityType };
  }
};

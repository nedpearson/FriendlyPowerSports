/**
 * Lightweight, generic internal Event Publisher/Subscriber designed to prevent tight coupling 
 * between the Phase 1 UI/DB interactions and the AI Agents.
 */
export const EventBus = {
  _listeners: {},

  /**
   * Subscribe an agent (or any class) to a specific system topic.
   * e.g. EventBus.subscribe('LEAD_CREATED', LeadAgent.evaluate)
   */
  subscribe(topic, callback) {
    if (!this._listeners[topic]) {
      this._listeners[topic] = [];
    }
    this._listeners[topic].push(callback);
    
    // Return an unsubscribe function
    return () => {
      this._listeners[topic] = this._listeners[topic].filter(cb => cb !== callback);
    };
  },

  /**
   * Fire a generic event across the system. Agents listening will wake up.
   * e.g., EventBus.dispatch('LEAD_CREATED', { leadId: 'L-10' })
   */
  async dispatch(topic, payload) {
    console.log(`[EventBus] Dispatched Topic: ${topic}`, payload);
    const callbacks = this._listeners[topic] || [];
    
    // Asynchronously resolve all callbacks to avoid blocking the main thread
    const results = await Promise.allSettled(
      callbacks.map(cb => cb({ topic, payload, timestamp: new Date().toISOString() }))
    );
    
    return results;
  }
};

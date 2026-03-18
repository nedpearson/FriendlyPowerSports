import { isAgentEnabled } from '../config/features.js';
import { EventBus } from '../core/EventBus.js';
import { AgentOrchestrator } from './AgentOrchestrator.js';

export const AgentRegistry = {
  _agents: new Map(),
  _subscriptions: [],

  /**
   * Register a new Super Agent definition into the ecosystem.
   */
  register(agentDef) {
    if (!agentDef.id || !agentDef.name) {
      throw new Error("Agent definition must include 'id' and 'name'");
    }
    
    // Only register if the feature flag allows it
    if (!isAgentEnabled(agentDef.id)) {
      console.warn(`[AgentRegistry] Agent ${agentDef.id} is disabled by feature flags.`);
      return false;
    }

    this._agents.set(agentDef.id, {
      ...agentDef,
      status: 'ACTIVE',
      registeredAt: new Date().toISOString()
    });
    
    // Automatically bind the new agent to the EventBus for any supported triggers
    if (Array.isArray(agentDef.supportedTriggers)) {
       agentDef.supportedTriggers.forEach(triggerType => {
          const unsubscribe = EventBus.subscribe(triggerType, async (eventPayload) => {
             // Hardcode system mock context for automated events in Phase 2 Demo
             const systemContext = { userId: 'SYSTEM', role: 'System', locationId: 'GLOBAL' };
             await agentDef.evaluate(eventPayload, systemContext);
          });
          this._subscriptions.push(unsubscribe);
       });
    }
    
    console.log(`[AgentRegistry] Registered ${agentDef.id}`);
    return true;
  },

  getAgent(id) {
    return this._agents.get(id);
  },

  getAllActive() {
    return Array.from(this._agents.values()).filter(a => a.status === 'ACTIVE');
  },

  /**
   * Runs all agents that subscribe to a specific trigger.
   */
  async broadcastTrigger(trigger, context) {
    const results = [];
    const agents = this.getAllActive();
    
    // In Phase 1 we synchronously loop for simplicity
    for (const agent of agents) {
      if (agent.supportedTriggers?.includes(trigger.type) && typeof agent.evaluate === 'function') {
        const result = await agent.evaluate(trigger, context);
        if (result) results.push(result);
      }
    }

    // Phase 12: Cross-Agent Orchestration Pass
    try {
       await AgentOrchestrator.synthesize(context);
    } catch (e) {
       console.warn("[AgentRegistry] Orchestrator synthesis failed:", e.message);
    }

    return results;
  }
};

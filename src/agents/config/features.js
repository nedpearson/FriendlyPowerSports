// Feature flags for the Super Agent module
export const AgentFeatures = {
  enableSuperAgents: true, // Master switch
  
  // Specific Agent Switches
  enableExecutiveCommandAgent: true,
  enableLeadIntelligenceAgent: true,
  enableBDCFollowupAgent: true,
  enableInventoryMatchmakingAgent: true,
  enableSalesDeskAgent: true,
  enableFIReadinessAgent: true,
  enableServiceRetentionAgent: true,
  enablePartsProfitAgent: true,
  enableCustomerLTVAgent: true,
  enableAuditComplianceAgent: true
};

export const isAgentEnabled = (agentId) => {
  if (!AgentFeatures.enableSuperAgents) return false;
  
  const flagName = `enable${agentId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
  return AgentFeatures[flagName] !== false; // default true if master is true and specific isn't false
};

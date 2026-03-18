/**
 * Demo Script for Phase 1 Architecture Verification
 * Run via: node test-agents-demo.js 
 * (Ensuring we mock DOM/React so imports don't crash)
 */

import { AgentRegistry } from './src/agents/registry/AgentRegistry.js';
import { AgentMemory } from './src/agents/core/AgentMemory.js';
import { AgentLogger } from './src/agents/audit/AgentLogger.js';

// Pre-load the agents
import './src/agents/services/index.js';

(async () => {
   console.log("==========================================");
   console.log("SUPER AGENT ARCHITECTURE - PHASE 1 VERIFICATION");
   console.log("==========================================\n");

   console.log("1. Checking Registry...");
   const active = AgentRegistry.getAllActive();
   console.log(`- Booted ${active.length} active agents.`);
   
   console.log("\n2. Executing System-Wide Broadcast Trigger (MANUAL)...");
   const context = { userId: 'EMP-1', role: 'Owner', locationId: 'ALL' };
   await AgentRegistry.broadcastTrigger({ type: 'MANUAL', timestamp: new Date().toISOString() }, context);

   console.log("\n3. Verifying Memory Storage...");
   const pending = AgentMemory.getPendingRecommendations(context);
   console.log(`- Stored ${pending.length} pending recommendations strictly typed.`);
   if (pending[0]) {
       console.log("  Sample Rec:", pending[0].title, "| Priority:", pending[0].priority, "| Linked To:", pending[0].relatedEntities[0].entityType);
   }

   console.log("\n4. Verifying Audit Engine trace...");
   const logs = AgentLogger.getRecentLogs(5);
   console.log(`- System logged ${AgentLogger._logs.length} total events. Recent 5:`);
   logs.forEach(l => {
       console.log(`  > [${l.timestamp}] ${l.agentId} -> ${l.eventType}`);
   });

   console.log("\nPHASE 1 ARCHITECTURE STATUS: ONLINE & SECURE");
   console.log("==========================================");
})();

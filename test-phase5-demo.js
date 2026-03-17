import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';
import { AgentRegistry } from './src/agents/registry/AgentRegistry.js';

import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 5 VERIFICATION");
    console.log("Testing: Sales Desk Agent & F&I Readiness Agent (RBAC Enabled)");
    console.log("==========================================\n");

    console.log("1. Simulating System Initialization (Triggers Full Scan)...");
    
    // Test 1: Fire as an unauthorized Sales Associate
    console.log("   -> Firing event as a normal 'Sales Associate'...");
    await EventBus.dispatch('APP_BOOT', { role: 'Sales Associate' });
    
    await new Promise(r => setTimeout(r, 500));

    // Fetch specifically from our two new agents
    const allPending = RecommendationService.fetchPending();
    
    // We expect Sales Desk to generate insights, but FIReadiness should explicitly block itself inside its evaluate block
    const deskRecs = allPending.filter(r => r.agentId === 'sales_desk_agent');
    const fiRecsBlocked = allPending.filter(r => r.agentId === 'fi_readiness_agent');
    
    console.log(`\n- Generated Insights for Sales Associates:`);
    console.log(`  > Sales Desk Agent generated: ${deskRecs.length} items`);
    console.log(`  > F&I Readiness Agent generated: ${fiRecsBlocked.length} items (EXPECTED 0)`);
    
    if (fiRecsBlocked.length > 0) {
        console.error("FAIL: RBAC PERMISSION LEAK! F&I Agent executed for an unauthorized role.");
        process.exit(1);
    }

    console.log("\n2. Simulating Manager Escalation (Authorized Payload)...");
    RecommendationService.fetchPending().forEach(r => RecommendationService.updateStatus(r.id, 'DISMISSED', 'SYS')); // Clear memory
    
    await EventBus.dispatch('APP_BOOT', { role: 'F&I Manager' });
    await new Promise(r => setTimeout(r, 500));

    const finalPending = RecommendationService.fetchPending();
    const finalDesk = finalPending.filter(r => r.agentId === 'sales_desk_agent');
    const finalFI = finalPending.filter(r => r.agentId === 'fi_readiness_agent');

    console.log(`\n- Generated Insights for F&I Managers:`);
    console.log(`  > Sales Desk Agent generated: ${finalDesk.length} items`);
    console.log(`  > F&I Readiness Agent generated: ${finalFI.length} items`);

    if(finalFI.length === 0 || finalDesk.length === 0) {
        console.error("FAIL: Missing outputs for authorized data read.");
        process.exit(1);
    }

    console.log("\n--- Recommendation Payloads Generated ---");
    finalFI.concat(finalDesk).forEach(r => {
        console.log(`[${r.agentId.toUpperCase()}]`);
        console.log(`   Title      : ${r.title}`);
        console.log(`   Priority   : ${r.priority} | Confidence: ${r.confidenceScore}%`);
        console.log(`   Description: ${r.description.substring(0, 80)}...`);
        console.log(`--------------------------------------------------\n`);
    });

    console.log("PHASE 5 DESK AND FINANCE SECURE ROUTINES: ONLINE & VERIFIED");
    console.log("==========================================");
})();

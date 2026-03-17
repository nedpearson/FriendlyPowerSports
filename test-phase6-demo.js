import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';

import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 6 VERIFICATION");
    console.log("Testing: Service Retention Agent & Parts Profit Agent");
    console.log("==========================================\n");

    console.log("1. Simulating System Initialization (Triggers Full Scan)...");
    
    // Test 1: Fire as an allowed role
    await EventBus.dispatch('APP_BOOT', { role: 'General Manager' });
    
    await new Promise(r => setTimeout(r, 500));

    // Fetch specifically from our two new agents
    const allPending = RecommendationService.fetchPending();
    
    const serviceRecs = allPending.filter(r => r.agentId === 'service_retention_agent');
    const partsRecs = allPending.filter(r => r.agentId === 'parts_profit_agent');
    
    console.log(`\n- Generated Insights:`);
    console.log(`  > Service Retention Agent generated: ${serviceRecs.length} items`);
    console.log(`  > Parts Profit Agent generated: ${partsRecs.length} items`);
    
    if (serviceRecs.length === 0 || partsRecs.length === 0) {
        console.error("FAIL: One or both agents failed to generate operational insights!");
        process.exit(1);
    }

    console.log("\n--- Recommendation Payloads Generated ---");
    serviceRecs.concat(partsRecs).forEach(r => {
        console.log(`[${r.agentId.toUpperCase()}]`);
        console.log(`   Title      : ${r.title}`);
        console.log(`   Priority   : ${r.priority} | Confidence: ${r.confidenceScore}%`);
        console.log(`   Description: ${r.description.substring(0, 80)}...`);
        console.log(`--------------------------------------------------\n`);
    });

    console.log("PHASE 6 POST-SALE ROUTINES: ONLINE & VERIFIED");
    console.log("==========================================");
})();

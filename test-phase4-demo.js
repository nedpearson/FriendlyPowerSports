import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';
import { AgentRegistry } from './src/agents/registry/AgentRegistry.js';

import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 4 VERIFICATION");
    console.log("Testing: BDC Follow-Up Agent & Inventory Matchmaking Agent");
    console.log("==========================================\n");

    console.log("1. Simulating System Initialization (Triggers Full Scan)...");
    await EventBus.dispatch('APP_BOOT', {});
    
    // Let the event bus settle
    await new Promise(r => setTimeout(r, 500));

    console.log("\n2. Verifying Generated Insights in Database...");
    
    // Fetch specifically from our two new agents
    const allPending = RecommendationService.fetchPending();
    const phase4Recs = allPending.filter(r => 
        r.agentId === 'bdc_followup_agent' || 
        r.agentId === 'inventory_matchmaking_agent'
    );

    console.log(`- Native DB generated ${phase4Recs.length} highly targeted insights via Phase 4 logic.\n`);
    
    let bdcCount = 0;
    let invCount = 0;

    phase4Recs.forEach(r => {
        if (r.agentId === 'bdc_followup_agent') bdcCount++;
        if (r.agentId === 'inventory_matchmaking_agent') invCount++;

        console.log(`[${r.agentId.toUpperCase()}]`);
        console.log(`   Title      : ${r.title}`);
        console.log(`   Priority   : ${r.priority} | Confidence: ${r.confidenceScore}%`);
        console.log(`   Description: ${r.description.substring(0, 80)}...`);
        console.log(`--------------------------------------------------\n`);
    });

    if(bdcCount === 0 || invCount === 0) {
        console.error("FAIL: Missing outputs for one or both agents.");
        process.exit(1);
    }

    console.log("PHASE 4 BDC AND INVENTORY ROUTINES: ONLINE & VERIFIED");
    console.log("==========================================");
})();

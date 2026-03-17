import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';
import { AgentRegistry } from './src/agents/registry/AgentRegistry.js';

import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 3 VERIFICATION");
    console.log("Testing: Executive Command Agent & Lead Intelligence Agent");
    console.log("==========================================\n");

    const systemUser = { userId: 'SYSTEM', role: 'Owner' };

    console.log("1. Simulating App Boot (Triggers Executive Command Agent)...");
    await EventBus.dispatch('APP_BOOT', {});
    
    console.log("\n2. Simulating Lead Ingestion (Triggers Lead Intelligence Agent)...");
    // We send payload to trigger evaluation for LEAD-1 specifically
    await EventBus.dispatch('LEAD_CREATED', { leadId: 'LEAD-1' });

    // Let the event bus settle
    await new Promise(r => setTimeout(r, 500));

    console.log("\n3. Verifying Generated Insights in Database...");
    
    // Fetch specifically from our two new agents
    const allPending = RecommendationService.fetchPending();
    const phase3Recs = allPending.filter(r => 
        r.agentId === 'executive_command_agent' || 
        r.agentId === 'lead_intelligence_agent'
    );

    console.log(`- Native DB generated ${phase3Recs.length} highly targeted insights via Phase 3 logic.\n`);
    
    phase3Recs.forEach(r => {
        console.log(`[${r.agentId.toUpperCase()}]`);
        console.log(`   Title      : ${r.title}`);
        console.log(`   Priority   : ${r.priority} | Confidence: ${r.confidenceScore}%`);
        console.log(`   Link Entity: ${r.relatedEntities[0]?.entityType} (${r.relatedEntities[0]?.entityId})`);
        console.log(`   Description: ${r.description.substring(0, 70)}...`);
        console.log(`--------------------------------------------------\n`);
    });

    if(phase3Recs.length === 0) {
        console.error("FAIL: No intelligent recommendations generated.");
        process.exit(1);
    }

    console.log("PHASE 3 INTELLIGENCE ROUTINES: ONLINE & VERIFIED");
    console.log("==========================================");
})();

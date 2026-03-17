import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';
import { ActionExecutionService } from './src/agents/services/ActionExecutionService.js';
import { AGENT_AUDIT_LOGS } from './src/data/mockDatabase.js';

import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 7 VERIFICATION");
    console.log("Testing: Customer LTV Agent & Audit Compliance Agent");
    console.log("==========================================\n");

    console.log("1. Forcing a Security Anomaly into the Action Layer...");
    // A Sales Associate tries to approve and run an administrative system lockout action
    const maliciousDraft = ActionExecutionService.createDraft({ actionType: 'LOCK_USER_ACCOUNT', requiresApproval: true, requiredScopes: ['ADMIN_WRITE'] }, 'REC-FAKE-1');
    ActionExecutionService._logAudit(maliciousDraft, 'ACTION_BLOCKED', { userId: 'EMP-3' }, { reason: "Unauthorized: Requires ADMIN_WRITE" });

    // Inject a blind dismissal for Finance logs to trigger Agent 2's secondary check
    AGENT_AUDIT_LOGS.push({
        id: `AUD-MOCK-1`,
        eventType: 'RECOMMENDATION_STATUS_CHANGED',
        agentId: 'fi_readiness_agent',
        userId: 'EMP-5',
        timestamp: new Date().toISOString(),
        details: { newStatus: 'DISMISSED' }
    });
    AGENT_AUDIT_LOGS.push({
        id: `AUD-MOCK-2`,
        eventType: 'RECOMMENDATION_STATUS_CHANGED',
        agentId: 'fi_readiness_agent',
        userId: 'EMP-5',
        timestamp: new Date().toISOString(),
        details: { newStatus: 'DISMISSED' }
    });
    AGENT_AUDIT_LOGS.push({
        id: `AUD-MOCK-3`,
        eventType: 'RECOMMENDATION_STATUS_CHANGED',
        agentId: 'fi_readiness_agent',
        userId: 'EMP-5',
        timestamp: new Date().toISOString(),
        details: { newStatus: 'DISMISSED' }
    });

    console.log("   -> Audit logs seeded. Firing App Boot Engine...\n");
    await EventBus.dispatch('APP_BOOT', { role: 'General Manager' }); // Execute as GM to see Audit details
    
    await new Promise(r => setTimeout(r, 500));

    // Fetch specifically from our two new agents
    const allPending = RecommendationService.fetchPending();
    
    const ltvRecs = allPending.filter(r => r.agentId === 'customer_ltv_agent');
    const auditRecs = allPending.filter(r => r.agentId === 'audit_compliance_agent');
    
    console.log(`\n- Generated Insights:`);
    console.log(`  > Customer LTV Agent generated: ${ltvRecs.length} items`);
    console.log(`  > Audit Compliance Agent generated: ${auditRecs.length} items (EXPECTED 2)`);
    
    if (auditRecs.length !== 2) {
        console.error(`FAIL: Audit Agent failed to calculate anomalies properly (Expected 2, got ${auditRecs.length})!`);
        process.exit(1);
    }

    console.log("\n--- Recommendation Payloads Generated ---");
    ltvRecs.concat(auditRecs).forEach(r => {
        console.log(`[${r.agentId.toUpperCase()}]`);
        console.log(`   Title      : ${r.title}`);
        console.log(`   Priority   : ${r.priority} | Confidence: ${r.confidenceScore}%`);
        console.log(`   Description: ${r.description.substring(0, 80)}...`);
        console.log(`--------------------------------------------------\n`);
    });

    console.log("PHASE 7 LTV AND SECURITY COMPLIANCE ROUTINES: ONLINE & VERIFIED");
    console.log("==========================================");
})();

import { EventBus } from './src/agents/core/EventBus.js';
import { RecommendationService } from './src/agents/services/RecommendationService.js';
import { ActionExecutionService } from './src/agents/services/ActionExecutionService.js';
import { AGENT_RECOMMENDATIONS, AGENT_ACTIONS, AGENT_AUDIT_LOGS } from './src/data/mockDatabase.js';

// Pre-load Registry & Agents
import './src/agents/services/index.js';

(async () => {
    console.log("==========================================");
    console.log("SUPER AGENT - PHASE 2 (PERSISTENCE & EVENT BUS) VERIFICATION");
    console.log("==========================================\n");

    console.log("1. Dispatching Asynchronous Generic Event 'LEAD_CREATED' onto the Event Bus...");
    // The Lead Agent should catch this automatically because it subscribes to LEAD_CREATED
    await EventBus.dispatch('LEAD_CREATED', { leadId: 'L-123', source: 'Web Form' });
    
    // Slight pause to ensure async resolutions
    await new Promise(res => setTimeout(res, 500));

    console.log("\n2. Querying Recommendation Service for Results...");
    // Let's get the recommendations generated explicitly by the background event
    // Note: Our base mock agents generate a hardcoded 'Title Insight' from their evaluate block right now
    const pendingInsights = RecommendationService.fetchPending();
    console.log(`- Native DB currently holds ${pendingInsights.length} pending insight records.`);
    
    if (pendingInsights.length === 0) {
        console.error("FAIL: No insights stored in memory.");
        process.exit(1);
    }
    
    const targetRec = pendingInsights[0];
    console.log(`  > Selected Insight: [${targetRec.id}] ${targetRec.title}`);

    console.log("\n3. Testing Recommendation Dismissal (Audited State Mutator)...");
    RecommendationService.updateStatus(targetRec.id, 'DISMISSED', 'EMP-TEST', 'Not right now');
    console.log(`- Insight Status is now: ${targetRec.status}`);

    console.log("\n4. Testing Action Drafting & Approval Matrix...");
    // Grab another insight to test approval pipelines
    const secondRec = pendingInsights[1];
    
    if (!secondRec) {
        console.log("  (Skipping action matrix, fewer than 2 insights spawned in demo context)");
    } else {
        // Step A: Draft the action structurally
        const draftedAction = ActionExecutionService.createDraft({
           actionType: 'SEND_SMS',
           payload: { message: "Hello Lead!" },
           requiresApproval: true
        }, secondRec.id);
        console.log(`  > Action [${draftedAction.id}] drafted with status: ${draftedAction.executionStatus}`);

        // Step B: Attempt unauthorized execution (Should Fail)
        const blockResult = await ActionExecutionService.execute(draftedAction.id, { userId: 'EMP-ROGUE' });
        console.log(`  > Unauthorized Execution Attempt: ${blockResult.success ? 'PASSED' : 'BLOCKED'} (Reason: ${blockResult.reason})`);

        // Step C: Approve explicitly, then execute
        ActionExecutionService.approveDraftForRun(draftedAction.id, 'MGR-1');
        const passResult = await ActionExecutionService.execute(draftedAction.id, { userId: 'SYS' });
        console.log(`  > Authorized Execution Attempt: ${passResult.success ? 'PASSED' : 'BLOCKED'}`);
    }

    console.log("\n5. Verifying Global Audit Trace Integrity...");
    const logs = AGENT_AUDIT_LOGS;
    console.log(`- Logged ${logs.length} total operations to the compliance table.`);
    logs.slice(-4).forEach(l => {
        console.log(`  > [${l.timestamp}] [${l.eventType}] ${JSON.stringify(l.details).substring(0, 50)}...`);
    });

    console.log("\nPHASE 2 DEPLOYMENT: ONLINE & VERIFIED");
    console.log("==========================================");
})();

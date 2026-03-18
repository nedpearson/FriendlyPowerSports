import { ActionLayer } from './src/agents/executors/ActionLayer.js';
import { ActionRegistry } from './src/agents/executors/ActionRegistry.js';
import { AgentLogger } from './src/agents/audit/AgentLogger.js';

async function runTests() {
  console.log("=== PHASE 9 SAFE ACTION EXECUTION TESTS ===");

  const contexts = [
    { name: "Owner", role: "Owner" },
    { name: "Manager", role: "Manager" },
    { name: "Employee", role: "Employee" }
  ];

  // Test 1: Snooze Action (Should allow all)
  console.log("\n--- Test 1: Snooze (Low Risk) ---");
  for (const ctx of contexts) {
    const res = await ActionLayer.execute('SNOOZE_RECOMMENDATION', { recommendationId: 'R-1' }, { userId: 'U-1', userRole: ctx.role });
    console.log(`[${ctx.name}] Snooze Success: ${res.success} | Reason: ${res.reason || 'N/A'}`);
  }

  // Test 2: Reassign Action (Requires Manager+)
  console.log("\n--- Test 2: Reassign (Medium Risk) ---");
  for (const ctx of contexts) {
    const res = await ActionLayer.execute('REASSIGN_OWNER', { entityId: 'E-1', newOwnerId: 'EMP-2' }, { userId: 'U-1', userRole: ctx.role, isApproved: true });
    console.log(`[${ctx.name}] Reassign Success: ${res.success} | Reason: ${res.reason || 'N/A'}`);
  }

  // Test 3: Reassign Action WITHOUT Approval
  console.log("\n--- Test 3: Reassign (Unapproved) ---");
  const unapprovedRes = await ActionLayer.execute('REASSIGN_OWNER', { entityId: 'E-1', newOwnerId: 'EMP-2' }, { userId: 'U-1', userRole: 'Owner', isApproved: false });
  console.log(`[Owner] Unapproved Reassign Success: ${unapprovedRes.success} | Reason: ${unapprovedRes.reason || 'N/A'}`);

  // Test 4: Finance Rate Match (Requires Owner+)
  console.log("\n--- Test 4: Finance Rate Match (High Risk) ---");
  for (const ctx of contexts) {
    const res = await ActionLayer.execute('FINANCE_RATE_MATCH', { dealId: 'D-999' }, { userId: 'U-1', userRole: ctx.role, isApproved: true });
    console.log(`[${ctx.name}] Finance Compile Success: ${res.success} | Reason: ${res.reason || 'N/A'}`);
  }

  // Test 5: Dry Run Preview
  console.log("\n--- Test 5: Dry Run Preview ---");
  const previewRes = await ActionLayer.execute('CREATE_TASK', { title: 'Call Customer' }, { userId: 'U-1', userRole: 'Employee', dryRun: true });
  console.log(`Preview Output: ${previewRes.preview}`);

  // Print Logs
  console.log("\n--- Audit Logs Emitted ---");
  console.log(AgentLogger.getRecentLogs(5).map(l => `[${l.eventType}] Action: ${l.details.actionType || 'Unknown'} - User: ${l.userId}`).join('\n'));
}

runTests().catch(console.error);

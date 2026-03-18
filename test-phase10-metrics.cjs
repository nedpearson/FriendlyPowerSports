// Temporary CJS wrapper for Phase 10 Metrics testing
(async () => {
    const { ActionLayer } = await import('./src/agents/executors/ActionLayer.js');
    const { RecommendationEngine } = await import('./src/agents/recommendations/RecommendationEngine.js');
    const { AgentMetrics } = await import('./src/agents/audit/AgentMetrics.js');
    
    console.log("=== PHASE 10 METRICS LIFECYCLE TESTS ===");
  
    // 1. Simulate Recommendations Generated
    console.log("\n--- Generating 5 Recommendations ---");
    for (let i=0; i<5; i++) {
        RecommendationEngine.generateRecommendation({id: 'TEST-AGENT'}, { title: 'Test Rec', description: 'desc', priority: 'HIGH' }, { userId: 'U-1' });
    }
    
    // 2. Simulate User Views
    console.log("--- Viewing 3 Recommendations ---");
    for (let i=0; i<3; i++) {
       AgentMetrics.trackView();
    }

    // 3. Simulate specific action paths (Attribution triggers)
    console.log("--- Simulating UI Actions & Attributions ---");
    await ActionLayer.execute('REASSIGN_OWNER', { entityId: 'E-1' }, { userId: 'U-1', userRole: 'Manager', isApproved: true });
    await ActionLayer.execute('CREATE_TASK', { reason: 'overdue' }, { userId: 'U-1', userRole: 'Employee', isApproved: true });
    await ActionLayer.execute('FINANCE_RATE_MATCH', { dealId: 'D-1' }, { userId: 'U-1', userRole: 'Owner', isApproved: true });
    
    // One failure (Insufficient permissions)
    await ActionLayer.execute('FINANCE_RATE_MATCH', { dealId: 'D-1' }, { userId: 'U-2', userRole: 'Employee', isApproved: true });
    
    // 4. Simulate Dismissal
    console.log("--- Simulating 1 Dismissal ---");
    AgentMetrics.trackDismissal();

    // 5. Output Final Metrics Dump
    console.log("\n=== FINAL AGENT METRICS ===");
    console.log(JSON.stringify(AgentMetrics.getMetricsSummary(), null, 2));

  })();

/**
 * Centralized tracking singleton for all Agent-driven metrics and attributions.
 * In a production environment, this would flush data to a time-series or analytics DB.
 */
export const AgentMetrics = {
  db: {
    recommendationCreatedCount: 0,
    recommendationViewedCount: 0,
    recommendationApprovedCount: 0,
    recommendationDismissedCount: 0,
    actionExecutionCount: 0,
    actionFailureCount: 0,

    // Specific Workflow Influences (Attribution)
    overdueFollowUpsRecovered: 0,
    hotLeadsSaved: 0,
    stalledOppsRecovered: 0,
    appointmentsSetInfluence: 0,
    serviceRetentionInfluence: 0,
    accessoryUpsellInfluence: 0,
    financeBlockersResolved: 0
  },

  trackCreation() {
    this.db.recommendationCreatedCount++;
  },

  trackView() {
    this.db.recommendationViewedCount++;
  },

  trackDismissal() {
    this.db.recommendationDismissedCount++;
  },

  trackActionExecution(actionType, success, contextData = {}) {
    this.db.actionExecutionCount++;
    if (!success) {
      this.db.actionFailureCount++;
      return;
    }

    // Attempt Attribution Mapping based on action type or context
    this._mapAttribution(actionType, contextData);
  },

  _mapAttribution(actionType, contextData) {
    if (actionType === 'CREATE_TASK' && contextData.reason === 'overdue') {
       this.db.overdueFollowUpsRecovered++;
    }
    if (actionType === 'SNOOZE_RECOMMENDATION' && contextData.source === 'stalled_opp') {
       // Snoozing a stalled opp might not count as a recovery, but reassigning might
    }
    if (actionType === 'REASSIGN_OWNER') {
       this.db.hotLeadsSaved++; 
    }
    if (actionType === 'FINANCE_RATE_MATCH' || actionType === 'CLEAR_FRAUD_HOLD') {
       this.db.financeBlockersResolved++;
    }
    // Generic approvals count towards the overarching approved rate
    this.db.recommendationApprovedCount++;
  },

  getMetricsSummary() {
    const totalEngaged = this.db.recommendationApprovedCount + this.db.recommendationDismissedCount;
    const approvalRate = totalEngaged > 0 ? (this.db.recommendationApprovedCount / totalEngaged) * 100 : 0;
    const viewRate = this.db.recommendationCreatedCount > 0 ? (this.db.recommendationViewedCount / this.db.recommendationCreatedCount) * 100 : 0;

    return {
      ...this.db,
      derived: {
        totalEngaged,
        approvalRate: approvalRate.toFixed(1) + '%',
        viewRate: viewRate.toFixed(1) + '%',
        systemHealth: this.db.actionFailureCount === 0 ? 'Optimal' : 'Degraded'
      }
    };
  }
};

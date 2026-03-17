import { AgentRegistry } from '../registry/AgentRegistry';
import { RecommendationEngine } from '../recommendations/RecommendationEngine';
import { EntityLinker } from '../core/EntityLinker';
import { AGENT_AUDIT_LOGS, AGENT_RECOMMENDATIONS } from '../../data/mockDatabase';

export const AuditComplianceAgent = {
  id: 'audit_compliance_agent',
  name: 'Audit Compliance Agent',
  description: 'Internally monitors system logs for permission violations, unresolved Finance vulnerabilities, and enforces agent accountability.',
  supportedRoles: ['General Manager', 'Owner', 'System'],
  supportedTriggers: ['APP_BOOT', 'AUDIT_EVENT_CREATED', 'DAILY_CRON'],

  async evaluate(trigger, context) {
    // ---------------------------------------------------------------------------------
    // RBAC PERMISSION GATE: Only GMs and Owners can see System Audit details
    // ---------------------------------------------------------------------------------
    if (!this.supportedRoles.includes(context.role) && context.role !== 'System') {
       return [];
    }

    const recommendations = [];

    // 1. Permission Violation Alert (Access Denied / Failed Executions)
    // We look for ACTION_BLOCKED or ACTION_FAILED within the recent logs
    const recentBlocks = AGENT_AUDIT_LOGS.filter(log => 
       (log.eventType === 'ACTION_BLOCKED' || log.eventType === 'ACTION_FAILED') &&
       (Date.now() - new Date(log.timestamp).getTime() < 24 * 3600000) // within last 24h
    );

    if (recentBlocks.length > 0) {
        // Just flag the most recent one for the demo
        const latestBlock = recentBlocks.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        recommendations.push(
            RecommendationEngine.generateRecommendation(this, {
              title: `Security Anomaly: Unauthorized Interaction`,
              description: `System detected a blocked execution attempt (${latestBlock.details.actionType}) by User ID: ${latestBlock.userId}. Reason: ${latestBlock.details.reason || latestBlock.details.error}.`,
              confidenceScore: 100,
              priority: 'URGENT',
              relatedEntities: [ EntityLinker.createLink('Employee', latestBlock.userId || 'Unknown', `Executing User`) ],
              proposedActions: [
                 { id: `ACT-AUD-${Date.now()}-1`, actionType: 'LOCK_USER_ACCOUNT', payload: { userId: latestBlock.userId }, requiresApproval: true, requiredScopes: ['ADMIN_WRITE'] }
              ]
            }, context)
        );
    }

    // 2. Unresolved Sensitive Item (F&I Stagnation)
    // Find active recommendations from the FI Readiness Agent that have been pending for > 48 hours
    const activeFIRecs = AGENT_RECOMMENDATIONS.filter(r => 
        r.agentId === 'fi_readiness_agent' && 
        r.status === 'PENDING'
    );

    activeFIRecs.forEach(rec => {
        const ageMs = Date.now() - new Date(rec.createdAt).getTime();
        const ageHours = ageMs / (1000 * 60 * 60);

        if (ageHours > 48) {
            recommendations.push(
               RecommendationEngine.generateRecommendation(this, {
                 title: `Compliance Escalation: Unresolved F&I Risk`,
                 description: `A critical Finance or Compliance recommendation ("${rec.title}") has been pending for over 48 hours without resolution or dismissal by the F&I Manager.`,
                 confidenceScore: 98,
                 priority: 'HIGH',
                 relatedEntities: [ EntityLinker.createLink('Agent', 'fi_readiness_agent', `F&I Agent`) ],
                 proposedActions: [
                    { id: `ACT-AUD-${Date.now()}-2`, actionType: 'ESCALATE_TO_DEALER_PRINCIPAL', payload: { recommendationId: rec.id }, requiresApproval: false, requiredScopes: [] }
                 ]
               }, context)
           );
        }
    });

    // 3. Finance Access Review (Snoozed or Dismissed without context)
    // Look at Audit logs for DISMISSED/SNOOZED events related to FI Agent without 'reason' payload
    const sketchyDismissals = AGENT_AUDIT_LOGS.filter(log => 
       log.eventType === 'RECOMMENDATION_STATUS_CHANGED' && 
       log.details && 
       log.details.newStatus === 'DISMISSED' &&
       !log.details.reason && 
       (Date.now() - new Date(log.timestamp).getTime() < 7 * 24 * 3600000) // within last 7 days
    );

    if (sketchyDismissals.length > 2) {
         recommendations.push(
               RecommendationEngine.generateRecommendation(this, {
                 title: `Audit Warning: Blind Dismissals`,
                 description: `Detected ${sketchyDismissals.length} recommendations dismissed in the last 7 days without contextual reason codes. Enforce required dismissal notes.`,
                 confidenceScore: 85,
                 priority: 'MEDIUM',
                 relatedEntities: [ EntityLinker.createLink('System', 'AuditModule', `System Settings`) ],
                 proposedActions: [
                    { id: `ACT-AUD-${Date.now()}-3`, actionType: 'TOGGLE_FEATURE_FLAG', payload: { flag: 'REQUIRE_DISMISSAL_REASON', value: true }, requiresApproval: true, requiredScopes: ['ADMIN_WRITE'] }
                 ]
               }, context)
         );
    }

    return recommendations;
  }
};

AgentRegistry.register(AuditComplianceAgent);

// src/data/crmAdapters.js
// Provides the service abstractions and mocked data layer wrappers for the CRM
// These enforce Role-Based Access Control (RBAC) and Audit Logging.

import { CRM_AUDIT_LOGS } from './mockDatabase';

export const FeatureFlags = {
  ENABLE_EXTERNAL_CREDIT_BUREAU: false, // forces mock mode adapters
  ENABLE_TWILIO_SMS: false,
  ENABLE_FRAUD_SERVICE: false
};

// --- RBAC & PERMISSION GUARDS --- //

export const Permissions = {
  VIEW_CRM: ['Owner', 'General Manager', 'Sales Associate', 'F&I Manager'],
  VIEW_FINANCE_SECURE: ['Owner', 'General Manager', 'F&I Manager'],
  OVERRIDE_QUOTE: ['Owner', 'General Manager', 'F&I Manager'],
  EXPORT_SENSITIVE: ['Owner', 'General Manager'],
  VIEW_AUDIT_LOGS: ['Owner', 'General Manager']
};

export const hasPermission = (user, permissionSet) => {
  if (!user || (!user.role && !user.systemRole)) return false;
  const roleToCheck = user.systemRole || user.role;
  return permissionSet.includes(roleToCheck);
};

// --- AUDIT LOGGING --- //

export const AuditLogger = {
  logAction: (user, action, targetId, description) => {
    const newLog = {
      id: `AUD-${Date.now()}`,
      userId: user.id,
      action,
      targetId,
      timestamp: new Date().toISOString(),
      description
    };
    CRM_AUDIT_LOGS.push(newLog);
    console.log(`[AUDIT] User ${user.name} (${user.role}) performed ${action} on ${targetId}`);
  }
};

// --- SERVICE ABSTRACTIONS --- //

export const CreditPrequalAdapter = {
  submitApplication: async (user, customerId, prequalData, consentRecord) => {
    AuditLogger.logAction(user, 'CREDIT_SUBMISSION_ATTEMPT', customerId, 'Initiated credit pre-qualification pull');
    
    if (!consentRecord || !consentRecord.ipAddress) {
       AuditLogger.logAction(user, 'COMPLIANCE_ERROR', customerId, 'Missing consent record or IP');
       return { success: false, error: 'Missing explicit consent capture.' };
    }

    // Fraud checkpoint
    const fraudCheck = FraudFlaggingService.evaluateCustomer(customerId, consentRecord.ipAddress, prequalData.ssnRaw);
    if (fraudCheck.flag === 'Red') {
       AuditLogger.logAction(user, 'FRAUD_BLOCK', customerId, `Submission blocked: ${fraudCheck.reason}`);
       return { success: false, error: `Fraud Check Failed: ${fraudCheck.reason}`, needsAdverseAction: true };
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!FeatureFlags.ENABLE_EXTERNAL_CREDIT_BUREAU) {
      // Mock logic for score bands requested: 720+, 680-719, 620-679, 580-619, under 580
      let decision = 'Pre-Approved';
      let tier = 'Prime';
      let maxAmount = 25000;
      let assignedAPR = 6.99;
      let scoreBand = '720+';
      let needsAdverseAction = false;
      let stipulations = ['Proof of income'];

      const est = prequalData.creditEstimate?.toLowerCase() || 'good';
      if (est.includes('excellent')) { scoreBand = '720+'; tier = 'Super Prime'; assignedAPR = 4.99; maxAmount = 35000; }
      else if (est.includes('good')) { scoreBand = '680-719'; tier = 'Prime'; assignedAPR = 6.99; maxAmount = 25000; }
      else if (est.includes('fair')) { scoreBand = '620-679'; tier = 'Near Prime'; assignedAPR = 11.99; maxAmount = 15000; stipulations.push('Proof of residence'); }
      else if (est.includes('poor')) { scoreBand = '580-619'; tier = 'Subprime'; assignedAPR = 18.99; maxAmount = 10000; stipulations.push('Reference check'); }
      else if (est.includes('bad')) { scoreBand = 'under 580'; decision = 'Declined'; tier = 'Deep Subprime'; maxAmount = 0; needsAdverseAction = true; }

      return {
        success: decision === 'Pre-Approved',
        provider: 'Mock_SoftPull_API',
        decision,
        tier,
        scoreBand,
        maxAmount,
        assignedAPR,
        stipulationList: stipulations,
        needsAdverseAction,
        secureNotes: `Soft pull completed via Mock API. ***-**-${prequalData.ssnRaw?.slice(-4) || 'XXXX'}`
      };
    } else {
      throw new Error("External bureaus not configured.");
    }
  }
};

export const FraudFlaggingService = {
  evaluateCustomer: (customerId, ipAddress, ssn) => {
    if (!FeatureFlags.ENABLE_FRAUD_SERVICE) {
      // Mock basic fraud check
      const isRiskyIP = ipAddress && ipAddress.startsWith('10.');
      const isRiskySSN = ssn && ssn.startsWith('000'); // simple mock rule
      if (isRiskyIP || isRiskySSN) {
         return { flag: 'Red', reason: 'Identity verification failed (High-Risk IP or SSN formatting)' };
      }
      return { flag: 'Green', reason: 'Clear' };
    }
    return { flag: 'Unknown', reason: 'Service Disabled' };
  }
};

export const LeadScoringService = {
  calculateScore: (lead, customer, interactions, trades, appointments, prequals) => {
    // Composite Scoring Rules Engine
    let score = 50; // Base score
    
    // Engagement & Recency
    const ageDays = lead?.createdAt ? Math.floor((new Date() - new Date(lead.createdAt)) / 86400000) : 0;
    if (ageDays < 2) score += 15;
    if (ageDays > 14 && lead.status !== 'Sold') score -= 10;
    
    if (interactions && interactions.length > 3) score += 10;
    if (interactions && interactions.length > 7) score += 10;
    
    // Appointment Behavior
    const hasShowedAppt = appointments?.some(a => a.status === 'Showed');
    if (hasShowedAppt) score += 20;

    // Equity / Trade Presence
    if (trades && trades.length > 0) score += 15;

    // Finance Readiness
    const hasApprovedPrequal = prequals?.some(p => p.decision === 'Pre-Approved');
    if (hasApprovedPrequal) score += 25;

    // Repeat Buyer
    if (customer?.LTV > 5000) score += 15;

    return Math.min(Math.max(score, 0), 100);
  },

  getScoringReason: (score) => {
    if (score >= 85) return "Hot Lead: High Engagement & Finance Ready";
    if (score >= 70) return "Warm Lead: Active Interest & Verified Trade";
    if (score >= 50) return "Standard Lead: Exploring Options";
    return "Cold Lead: Stalled or Unresponsive";
  }
};

export const NextBestActionService = {
  determineAction: (lead, score, lastContactDaysAgo, hasAppt, hasPrequal, stage) => {
    if (stage === 'Sold' || stage === 'Lost') return { action: 'Log Activity', message: 'Review customer file.' };

    if (score >= 85 && !hasPrequal) {
       return { action: 'Push Finance', message: 'Send soft-pull prequal link via SMS', type: 'High Value' };
    }
    if (score >= 80 && !hasAppt) {
       return { action: 'Book Test Ride', message: 'Customer is hot but needs a V.I.P. showroom visit.', type: 'Action Required' };
    }
    if (lastContactDaysAgo > 4 && score > 60) {
       return { action: 'Re-engage', message: 'Send personalized video of unit or price-drop alert.', type: 'Warning' };
    }
    const ageDays = lead?.createdAt ? Math.floor((new Date() - new Date(lead.createdAt)) / 86400000) : 0;
    if (score < 40 && ageDays > 30) {
       return { action: 'Reactivation Campaign', message: 'Move to 60-day nurture sequence.', type: 'Nurture' };
    }

    return { action: 'Standard Follow-up', message: 'Continue standard cadences.', type: 'Routine' };
  },

  getFrictionDetector: (lead, opp) => {
     if (opp?.probPct < 20 && opp?.isStalled) return 'Price/Payment Mismatch';
     if (lead?.status === 'Unresponded') return 'Slow Initial Response';
     return 'None Detected';
  }
};

export const DuplicateResolutionUtility = {
  findPotentialDuplicates: (customerMap, newPhone, newEmail) => {
    return Object.values(customerMap).filter(c => 
      (c.phone && c.phone === newPhone) || 
      (c.email && c.email === newEmail)
    );
  }
};

// Helper for masking data securely within views that do not have MANAGER permissions
export const DataMasker = {
  maskSSN: (ssn) => `***-**-${ssn.slice(-4)}`,
  maskPhone: (phone) => `***-***-${phone.slice(-4)}`
};

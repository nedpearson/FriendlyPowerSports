import { 
  DEALS, LENDERS, INVENTORY, APPRAISALS, BRANDS, CAMPAIGNS,
  CUSTOMERS, DEPARTMENTS, EMPLOYEES, LEADS, LOCATIONS, SERVICE_ORDERS, TASKS_AND_ALERTS,
  CRM_ACTIVITIES, CRM_APPOINTMENTS, CRM_COMMUNICATIONS, CRM_HOUSEHOLDS, CRM_OPPORTUNITIES,
  CRM_QUOTES, CRM_QUOTE_SCENARIOS, CRM_TAGS, CRM_TRADE_INS, CRM_PREQUAL_APPLICATIONS, CRM_PREQUAL_RESULTS, CRM_PREQUAL_CONSENTS
} from './mockDatabase';
import { LeadScoringService, NextBestActionService } from './crmAdapters';

// MTD Data Aggregators and Selectors
// In a real app, these would take a date range, but we are simulating MTD.

export const selectTotalGrossMTD = () => {
  return DEALS.reduce((acc, deal) => acc + deal.frontGross + deal.reserve + deal.vscPrice - deal.vscCost + deal.gapPrice - deal.gapCost, 0);
};

export const selectUnitSalesMTD = () => {
  return DEALS.length; // Basic count
};

export const selectFIPerUnit = () => {
  const units = selectUnitSalesMTD();
  if (units === 0) return 0;
  const fiTotal = DEALS.reduce((acc, deal) => acc + deal.reserve + deal.vscPrice - deal.vscCost + deal.gapPrice - deal.gapCost, 0);
  return fiTotal / units;
};

export const selectFrontEndGrossAvg = () => {
  const units = selectUnitSalesMTD();
  if (units === 0) return 0;
  const feTotal = DEALS.reduce((acc, deal) => acc + deal.frontGross, 0);
  return feTotal / units;
};

// Returns transformed arrays exactly matching what App.jsx needs

export const getKpiStats = () => {
  const totalGross = 487240; // Override with static for demo impact, or use compute: selectTotalGrossMTD();
  
  return [
    { label: "TOTAL GROSS MTD", value: "$487,240", delta: "↑ 12.4%", color: "text-green" },
    { label: "UNITS RETAILED MTD", value: "84", delta: "↑ 8.2%", color: "text-green" },
    { label: "F&I BACKEND / UNIT", value: "$1,247", delta: "↑ 6.1%", color: "text-green" },
    { label: "AVG FRONT-END GROSS", value: "$892", delta: "↓ 3.2%", color: "text-red" },
    { label: "OEM BONUS PROJECTED", value: "$74,000", delta: "→ On Track", color: "text-amber" },
    { label: "LEADS TODAY", value: "23", delta: "↑ 4 vs avg", color: "text-green" }
  ];
};

export const getAlerts = () => {
  return TASKS_AND_ALERTS.map(t => ({
    id: t.id,
    type: t.type === 'critical' ? 'red' : t.type === 'warning' ? 'amber' : 'green',
    text: t.message
  }));
};

export const getLiveLeads = () => {
  return LEADS.map(l => {
    const cust = CUSTOMERS.find(c => c.id === l.customerId);
    const emp = EMPLOYEES.find(e => e.id === l.empId);
    let sourceName = l.sourceId;
    if (l.sourceId.startsWith('CAMP')) {
      sourceName = CAMPAIGNS.find(c => c.id === l.sourceId)?.name || 'Campaign';
    }
    
    // calc rough times
    const minsAgo = Math.floor((new Date() - new Date(l.createdAt)) / 60000);
    const timeStr = minsAgo > 60 ? `${Math.floor(minsAgo/60)}h ${minsAgo%60}m` : `${minsAgo}m`;
    
    return {
      name: cust?.name || 'Unknown',
      source: sourceName,
      rep: emp?.name || 'Unassigned',
      time: timeStr,
      status: l.status,
      urgent: l.status === 'Unresponded' && minsAgo > 60,
      stage: l.stage
    };
  });
};

export const getInventoryAging = () => {
  const buckets = {
    '0-30 days': { count: 0, color: 'bg-green-600', maxVal: 30, minVal: 0 },
    '31-60 days': { count: 0, color: 'bg-yellow-600', maxVal: 60, minVal: 31 },
    '61-90 days': { count: 0, color: 'bg-orange-500', maxVal: 90, minVal: 61 },
    '90+ days': { count: 0, color: 'bg-red-600', maxVal: 9999, minVal: 91 }
  };
  
  // Actually we have limited mock INVENTORY length right now. 
  // Let's seed it with the static high numbers to look impressive on the dashboard, 
  // but we can append the real mock database counts to ensure they render structurally correctly.
  
  return [
    { label: '0-30 days', count: 312, pct: '50%', color: 'bg-green-600' },
    { label: '31-60 days', count: 298, pct: '40%', color: 'bg-yellow-600' },
    { label: '61-90 days', count: 142, pct: '20%', color: 'bg-orange-500' },
    { label: '90+ days', count: 78 + INVENTORY.filter(i => i.ageDays >= 90).length, pct: '10%', color: 'bg-red-600' }
  ];
};

export const getReconPipeline = () => {
  const reconUnits = INVENTORY.filter(i => i.status === 'Recon' || i.status === 'Inspection');
  return reconUnits.map(u => ({
    id: u.id,
    unit: `${u.year} ${u.model}`,
    cost: u.cost,
    spend: u.reconSpend,
    days: u.ageDays,
    tech: EMPLOYEES.find(e => e.id === 'EMP-7').name, // Mock tech
    status: u.status === 'Inspection' ? 'Inspection' : 'Recon In Progress'
  }));
};

export const getROBoard = () => {
  return SERVICE_ORDERS.map(ro => {
    const cust = CUSTOMERS.find(c => c.id === ro.customerId);
    const tech = EMPLOYEES.find(e => e.id === ro.techId);
    
    const hrsAgo = Math.floor((new Date() - new Date(ro.openedAt)) / 3600000);
    const ageStr = hrsAgo > 24 ? `${Math.floor(hrsAgo/24)}d` : `${hrsAgo}h`;
    
    return {
      id: ro.id,
      tech: tech ? tech.name : 'Unassigned',
      age: ageStr,
      customer: cust?.name,
      unit: ro.unitDesc,
      status: ro.status,
      work: ro.type
    };
  });
};

export const getTopPerformers = () => {
  // Hardcoded for demo aesthetic density, but mapped to database employee IDs
  return [
    { id: 'EMP-3', name: 'Jake Fontenot', role: 'Sales', units: 24, gross: '$52,100', comm: '$8,400' },
    { id: 'EMP-4', name: 'Marcus Broussard', role: 'Sales', units: 19, gross: '$41,200', comm: '$6,800' },
    { id: 'EMP-8', name: 'Will Landry', role: 'Sales', units: 17, gross: '$38,400', comm: '$6,200' },
  ];
}

// --- NEW CRM SELECTORS --- //

export const getPipelineKanban = (userId, userRole) => {
  const columns = [
    { id: 'New', title: 'New Leads', count: 0, items: [] },
    { id: 'Engaged', title: 'Contacted / Engaged', count: 0, items: [] },
    { id: 'Appt', title: 'Appointment Set', count: 0, items: [] },
    { id: 'Quote', title: 'Quote / Desk', count: 0, items: [] },
    { id: 'Finance', title: 'Pending Finance', count: 0, items: [] },
    { id: 'Sold', title: 'Sold / Delivered', count: 0, items: [] },
    { id: 'Lost', title: 'Lost (Follow Up)', count: 0, items: [] }
  ];

  let filteredOpps = CRM_OPPORTUNITIES;
  
  if (userRole === 'Sales Associate') {
      const myLeads = LEADS.filter(l => l.empId === userId).map(l => l.id);
      filteredOpps = CRM_OPPORTUNITIES.filter(o => myLeads.includes(o.leadId));
  }

  filteredOpps.forEach(opp => {
      const cust = CUSTOMERS.find(c => c.id === opp.customerId);
      const lead = LEADS.find(l => l.id === opp.leadId);
      const rep = EMPLOYEES.find(e => e.id === lead?.empId);
      
      let stageId = 'New';
      if (opp.status === 'Lost') stageId = 'Lost';
      else if (opp.status === 'Sold') stageId = 'Sold';
      else {
         switch(lead?.stage) {
            case 'New': stageId = 'New'; break;
            case 'Working': stageId = 'Engaged'; break;
            case 'Appt': stageId = 'Appt'; break;
            case 'Demo': stageId = 'Quote'; break;
            case 'F&I': stageId = 'Finance'; break;
            default: stageId = 'Engaged';
         }
      }

      const col = columns.find(c => c.id === stageId);
      if (col) {
          col.count++;
          col.items.push({
             ...opp,
             customerName: cust?.name,
             repName: rep?.name,
             source: lead?.sourceId,
             ageDays: lead?.createdAt ? Math.floor((new Date() - new Date(lead.createdAt)) / 86400000) : 0,
             isStalled: lead?.stage === 'Working' && Math.floor((new Date() - new Date(lead.createdAt)) / 86400000) > 3
          });
      }
  });

  return columns;
};

export const getAppointmentsTimeline = () => {
   return CRM_APPOINTMENTS.map(a => {
      const cust = CUSTOMERS.find(c => c.id === a.customerId);
      const rep = EMPLOYEES.find(e => e.id === a.assignedTo);
      return {
         ...a,
         customerName: cust?.name,
         repName: rep?.name
      };
   }).sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
};

export const getInventoryMatches = (customerId) => {
   // A mock recommendation engine that looks at customer's leads/opps to suggest inventory
   const activeLeads = LEADS.filter(l => l.customerId === customerId);
   if (activeLeads.length === 0) return { exactMatches: [], nearMatches: [] };
   
   // For mock purposes, we'll extract keywords from the lead's "unit of interest" string
   // In our mock DB, 'unitOfInterest' is a free text string, or derived from source.
   // We will just match based on simple brand/category parsing.
   
   const allInventory = INVENTORY.filter(i => i.status === 'Active' || i.status === 'Pending');
   
   // Let's grab some random matches for demonstration if we can't do a perfect string match.
   const exactMatches = allInventory.slice(0, 2); // Pretend these are high confidence
   const nearMatches = allInventory.slice(2, 4);  // Pretend these are low confidence cross-sells
   
   return {
     exactMatches,
     nearMatches
   };
};

export const getQuoteWorkbenchData = (customerId) => {
   // Find the first active quote for this customer to load the workbench
   const quote = CRM_QUOTES.find(q => q.customerId === customerId) || {
      id: 'DRAFT_NEW',
      customerId: customerId,
      status: 'Draft',
      totalVehiclePrice: 0,
      cashDown: 0,
      tradeAllowance: 0,
      tradePayoff: 0,
      requestedTerm: 60
   };

   const scenarios = CRM_QUOTE_SCENARIOS.filter(s => s.quoteId === quote.id);
   const currentTrade = CRM_TRADE_INS.find(t => t.customerId === customerId);
   const customer = CUSTOMERS.find(c => c.id === customerId);

   return {
      quote,
      scenarios,
      currentTrade,
      customer
   };
};

export const getCRMInbox = (userId, userRole) => {
  // Inbox is sorted by SLA urgency
  let filteredLeads = LEADS;
  
  // Basic RBAC filtering for sales associates
  if (userRole === 'Sales Associate') {
    filteredLeads = LEADS.filter(l => l.empId === userId);
  }

  return filteredLeads.map(l => {
    const cust = CUSTOMERS.find(c => c.id === l.customerId);
    const emp = EMPLOYEES.find(e => e.id === l.empId);
    const nextAppt = CRM_APPOINTMENTS.find(a => a.leadId === l.id && a.status === 'Pending');
    const tags = cust?.tags?.map(t => CRM_TAGS.find(ct => ct.name === t)) || [];
    
    const minsAgo = Math.floor((new Date() - new Date(l.createdAt)) / 60000);
    const isUrgent = l.status === 'Unresponded' && minsAgo > 60;

    // AI Scoring
    const interactions = CRM_COMMUNICATIONS.filter(c => c.customerId === l.customerId);
    const trades = CRM_TRADE_INS.filter(t => t.customerId === l.customerId);
    const appts = CRM_APPOINTMENTS.filter(a => a.customerId === l.customerId);
    const prequals = CRM_PREQUAL_APPLICATIONS.filter(p => p.customerId === l.customerId);
    
    const aiScore = LeadScoringService.calculateScore(l, cust, interactions, trades, appts, prequals);
    const scoreReason = LeadScoringService.getScoringReason(aiScore);
    const nextAction = NextBestActionService.determineAction(l, aiScore, minsAgo/1440, appts.length>0, prequals.length>0, l.status);

    return {
      ...l,
      customerName: cust?.name || 'Unknown',
      customerTags: tags,
      assignedRep: emp?.name || 'Unassigned',
      isUrgent,
      timeSinceCreation: minsAgo,
      nextAppointment: nextAppt ? nextAppt.datetime : null,
      expectedTradeACV: l.tradeIn_ExpectedACV,
      aiScore,
      scoreReason,
      nextAction
    };
  }).sort((a, b) => {
    // Sort urgent unresponded first, then by recency
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return a.timeSinceCreation - b.timeSinceCreation;
  });
};

export const getCustomer360Data = (customerId) => {
  const customer = CUSTOMERS.find(c => c.id === customerId);
  const household = customer?.householdId ? CRM_HOUSEHOLDS.find(h => h.id === customer.householdId) : null;
  const opportunities = CRM_OPPORTUNITIES.filter(o => o.customerId === customerId);
  const communications = CRM_COMMUNICATIONS.filter(c => c.customerId === customerId).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  const trades = CRM_TRADE_INS.filter(t => t.customerId === customerId);
  const prequals = CRM_PREQUAL_APPLICATIONS.filter(p => p.customerId === customerId);

  return {
    customer,
    household,
    opportunities,
    communications,
    trades,
    prequals
  };
};

export const getPrequalQueue = (userRole) => {
   // Enforce RBAC: Sales Associates cannot see the full prequal queue metrics logically,
   // unless strictly limited. We will mask sensitive data if they hit this view.
   const isManager = userRole !== 'Sales Associate';

   return CRM_PREQUAL_APPLICATIONS.map(app => {
      const result = CRM_PREQUAL_RESULTS.find(r => r.applicationId === app.id);
      const customer = CUSTOMERS.find(c => c.id === app.customerId);
      const consent = CRM_PREQUAL_CONSENTS.find(c => c.id === app.consentId);
      
      return {
         ...app,
         customerName: customer?.name || 'Unknown',
         customerPhone: customer?.phone || 'Unknown',
         decision: result?.decision || 'Pending',
         scoreBand: isManager ? (result?.scoreBand || 'Unknown') : 'REDACTED',
         tier: isManager ? (result?.tier || 'Unknown') : 'REDACTED',
         maxAmount: isManager ? (result?.maxAmount || 0) : 0,
         assignedAPR: isManager ? (result?.assignedAPR || 0) : 0,
         stipulations: result?.stipulationList || [],
         hasConsent: !!consent,
         needsAdverseAction: !!result?.needsAdverseAction,
         isFraudFlagged: app.status === 'Fraud Review'
      };
   }).sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

export const getManagerOpportunityBoard = () => {
   // Extracts actionable intelligence for managers across leads & opportunities
   
   // 1. Neglected Hot Leads
   const neglected = LEADS.filter(l => {
      if (l.status === 'Sold' || l.status === 'Lost') return false;
      const interactions = CRM_COMMUNICATIONS.filter(c => c.customerId === l.customerId);
      const score = LeadScoringService.calculateScore(l, null, interactions, [], [], []);
      const ageDays = Math.floor((new Date() - new Date(l.createdAt)) / 86400000);
      return score > 70 && ageDays > 3 && interactions.length < 2;
   }).map(l => {
      const cust = CUSTOMERS.find(c => c.id === l.customerId);
      const rep = EMPLOYEES.find(e => e.id === l.empId);
      return { ...l, customerName: cust?.name, repName: rep?.name, friction: 'High Score, No Contact' };
   });

   // 2. Reactivation Candidates (Dead / Lost > 30 days)
   const reactivation = LEADS.filter(l => {
      if (l.status !== 'Lost') return false;
      const ageDays = Math.floor((new Date() - new Date(l.createdAt)) / 86400000);
      return ageDays > 30;
   }).map(l => {
      const cust = CUSTOMERS.find(c => c.id === l.customerId);
      return { ...l, customerName: cust?.name, reactivateReason: 'Aged Out - Retry with New Inventory' };
   });

   // 3. Stalled Deals (Opportunities stuck in Quote/Appt without movement)
   const stalled = CRM_OPPORTUNITIES.filter(o => o.isStalled && o.probPct > 10).map(o => {
      const cust = CUSTOMERS.find(c => c.id === o.customerId);
      const rep = EMPLOYEES.find(e => e.id === o.repId);
      return { ...o, customerName: cust?.name, repName: rep?.name, friction: 'Stalled Deal (Risk)' };
   });

   return { neglected, reactivation, stalled };
};

// --- PHASE 7 OPERATIONAL DASHBOARDS --- //

export const getSalesDashboardData = (filters) => {
   // In a real app, 'filters' would dynamically filter the SQL query.
   // Providing precise relational logs for deep-dive drilldowns.
   const newLeadsData = LEADS.filter(l => l.status === 'New').map(l => ({
      title: `${CUSTOMERS.find(c => c.id === l.customerId)?.name || 'Unknown'} - ${l.interestCategory}`,
      subtitle: `Source: ${l.source} | Lead ID: ${l.id}`,
      value: `Score: ${LeadScoringService.calculateScore(l, null, [], [], [], [])}`,
      type: 'Action',
      data: { name: 'Inspect Lead Timeline', leadId: l.id }
   }));

   const contactsData = CRM_COMMUNICATIONS.filter(c => c.type === 'Outbound Call').slice(0, 42).map(c => ({
      title: `${c.direction} ${c.method} - ${c.status}`,
      subtitle: `To: ${CUSTOMERS.find(cust => cust.id === c.customerId)?.name || 'Unknown'}`,
      value: new Date(c.timestamp).toLocaleDateString(),
      type: 'Report',
      data: { name: 'Communication Log' }
   }));

   return {
      newLeads: newLeadsData.length || 14,
      newLeadsData: newLeadsData,
      responseTimesAvg: "18m",
      contactsMade: contactsData.length || 42,
      contactsData: contactsData,
      appointmentsSet: CRM_APPOINTMENTS.length || 6,
      appointmentsData: CRM_APPOINTMENTS.map(a => ({ title: a.type, subtitle: `${a.date} at ${a.time}`, value: a.status })),
      showRate: "66%",
      quotesSent: 8,
      prequalsStarted: CRM_PREQUAL_APPLICATIONS.length || 4,
      prequalsData: CRM_PREQUAL_APPLICATIONS.map(p => ({ title: `App ${p.id}`, subtitle: `Status: ${p.status}`, value: p.scoreBand, type: 'Finance_Prequal', data: p })),
      soldCount: LEADS.filter(l => l.status === 'Sold').length || 3,
      lostCount: LEADS.filter(l => l.status === 'Lost').length || 2,
      closeRate: "18.5%",
      grossEstimate: "$8,400",
      overdueTasks: 2,
      overdueTasksData: [ { title: 'Call back Internet Lead', subtitle: 'Jake F. - SLA Breached', value: '45m overdue', type: 'Action', data: {name: 'Escalate'} }, { title: 'Submit Finance Stips', subtitle: 'Lender 700Credit', value: '1d overdue', type: 'Action', data: {name: 'Escalate'} } ]
   };
};

export const getManagerDashboardData = (filters) => {
   // Manager level rollups
   return {
      byRep: [
         { name: 'Jake Fontenot', units: 12, gross: 24000, closeRate: 22 },
         { name: 'Marcus Broussard', units: 8, gross: 18000, closeRate: 15 },
         { name: 'Will Landry', units: 11, gross: 19500, closeRate: 19 }
      ],
      bySource: [
         { source: 'Website Forms', leads: 45, sold: 8 },
         { source: 'Walk-ins', leads: 22, sold: 12 },
         { source: 'Facebook Lead Gen', leads: 88, sold: 2 }
      ],
      byStageAging: [
         { stage: 'Appt Set', count: 14, avgDays: 4 },
         { stage: 'Quote', count: 8, avgDays: 12 },
         { stage: 'Finance', count: 4, avgDays: 2 }
      ],
      scoreDistribution: { hot: 12, warm: 45, cold: 120 },
      hotData: LEADS.slice(0, 12).map(l => ({ title: `${CUSTOMERS.find(c=>c.id === l.customerId)?.name || 'Unknown'} - ${l.interestCategory}`, subtitle: `Score: 85+ (Assigned: ${EMPLOYEES.find(e=>e.id===l.empId)?.name})`, value: 'HOT', type: 'Action', data: {name: 'Inspect Lead Timeline', leadId: l.id} })),
      warmData: LEADS.slice(12, 57).map(l => ({ title: `${CUSTOMERS.find(c=>c.id === l.customerId)?.name || 'Unknown'} - ${l.interestCategory}`, subtitle: `Score: 50-84`, value: 'WARM', type: 'Action', data: {name: 'Inspect Lead Timeline', leadId: l.id} })),
      coldData: LEADS.slice(57, 177).map(l => ({ title: `${CUSTOMERS.find(c=>c.id === l.customerId)?.name || 'Unknown'} - ${l.interestCategory}`, subtitle: `Score: <50`, value: 'COLD', type: 'Action', data: {name: 'Inspect Lead Timeline', leadId: l.id} }))
   };
};

export const getFinanceDashboardData = (filters) => {
   const apps = CRM_PREQUAL_APPLICATIONS;
   const fraudApps = apps.filter(a => a.status === 'Fraud Review');
   return {
      startedVsCompleted: { started: apps.length + 12, completed: apps.length },
      prequalData: apps.map(a => ({ title: `App ID: ${a.id}`, subtitle: `Score Tier: ${a.scoreBand}`, value: a.status, type: 'Finance_Prequal', data: a })),
      fraudReviewFlags: fraudApps.length || 2,
      fraudData: fraudApps.map(a => ({ title: `Hold: ${a.id}`, subtitle: `Review Reason: IP Mismatch`, value: 'LOCKED', type: 'Action', data: {name: 'Clear Fraud Hold'} })).length > 0 ? fraudApps.map(a => ({ title: `Hold: ${a.id}`, subtitle: `Review Reason: IP Mismatch`, value: 'LOCKED', type: 'Action', data: {name: 'Clear Fraud Hold'} })) : [{ title: 'System Auto-Hold', subtitle: 'Potential synthetic identity', value: 'LOCKED' }, { title: 'Address Mismatch', subtitle: 'Bureau Warning Code 44', value: 'LOCKED' }],
      lenderReadyQueue: 8,
      bureauErrors: 1,
      bureauData: [{ title: 'Provider Timeout', subtitle: 'Experian Node unreachable', value: 'ERR_TIMEOUT' }],
      scoreBands: [
         { band: '720+', percent: 40 },
         { band: '680-719', percent: 35 },
         { band: '620-679', percent: 15 },
         { band: 'Sub 620', percent: 10 }
      ]
   };
};

export const getRetentionDashboardData = (filters) => {
   const reactivationList = getManagerOpportunityBoard().reactivation;
   return {
      unsoldReactivation: reactivationList.length,
      reactivationData: reactivationList.map(l => ({ title: l.customerName, subtitle: l.reactivateReason, value: `Lost: ${l.status}`, type: 'CRM_Customer360', data: { customerId: l.customerId } })),
      serviceToSales: 18,
      serviceData: [{ title: '2019 Yamaha R1', subtitle: 'Owner: Tim B. (In Service Bay 3)', value: 'Equity: $2.4k', type: 'Action', data: {name: 'Send Equity Text'} }, { title: '2021 Can-Am X3', subtitle: 'Owner: Mark R. (RO #4199)', value: 'Equity: $4.1k', type: 'Action', data: {name: 'Print Pitch Sheet'} }],
      repeatCandidates: 42,
      lapsedCustomers: 155
   };
};

export const getAutomationEngineRules = () => {
   return window.CRM_AUTOMATION_RULES || []; // For dynamic updates later if we mutate global mock
};

import { 
  DEALS, LENDERS, INVENTORY, APPRAISALS, BRANDS, CAMPAIGNS,
  CUSTOMERS, DEPARTMENTS, EMPLOYEES, LEADS, LOCATIONS, SERVICE_ORDERS, TASKS_AND_ALERTS
} from './mockDatabase';

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

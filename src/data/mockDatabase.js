// Mock Database mapping the core domain models for DealerCommand™

export const LOCATIONS = [
  { id: 'LOC-1', name: 'Baton Rouge', type: 'Full Line', gm: 'Mike Thibodaux' },
  { id: 'LOC-2', name: 'Slidell', type: 'Full Line', gm: 'Sarah Miller' },
  { id: 'LOC-3', name: 'Used Bikes Direct', type: 'Used Only', gm: 'Dave Smith' }
];

export const DEPARTMENTS = [
  { id: 'DEPT-1', name: 'Sales' },
  { id: 'DEPT-2', name: 'F&I' },
  { id: 'DEPT-3', name: 'Service' },
  { id: 'DEPT-4', name: 'Parts' },
  { id: 'DEPT-5', name: 'Acquisition' }
];

export const EMPLOYEES = [
  { id: 'EMP-1', name: "Gerald Pearson", role: "Owner", locationId: 'ALL', avatar: "G", active: true },
  { id: 'EMP-2', name: "Mike Thibodaux", role: "General Manager", locationId: 'LOC-1', avatar: "M", active: true },
  { id: 'EMP-3', name: "Jake Fontenot", role: "Sales Associate", deptId: 'DEPT-1', locationId: 'LOC-1', avatar: "J", active: true, commRate: 0.20 },
  { id: 'EMP-4', name: "Marcus Broussard", role: "Sales Associate", deptId: 'DEPT-1', locationId: 'LOC-1', avatar: "MB", active: true, commRate: 0.20 },
  { id: 'EMP-5', name: "Rachel Tran", role: "F&I Manager", deptId: 'DEPT-2', locationId: 'LOC-1', avatar: "R", active: true, commRate: 0.12 },
  { id: 'EMP-6', name: "Tony Guillory", role: "Service Tech", deptId: 'DEPT-3', locationId: 'LOC-1', avatar: "T", active: true, hourly: 25 },
  { id: 'EMP-7', name: "Sam LeBlanc", role: "Service Tech", deptId: 'DEPT-3', locationId: 'LOC-1', avatar: "S", active: true, hourly: 22 },
  { id: 'EMP-8', name: "Will Landry", role: "Sales Associate", deptId: 'DEPT-1', locationId: 'LOC-2', avatar: "W", active: true, commRate: 0.20 },
  { id: 'EMP-9', name: "Devon Arceneaux", role: "Sales Associate", deptId: 'DEPT-1', locationId: 'LOC-1', avatar: "D", active: true, commRate: 0.20 }
];

export const BRANDS = [
  { id: 'BR-1', name: 'Yamaha', type: 'OEM' },
  { id: 'BR-2', name: 'Honda', type: 'OEM' },
  { id: 'BR-3', name: 'Polaris', type: 'OEM' },
  { id: 'BR-4', name: 'Kawasaki', type: 'OEM' }
];

// Rich relational inventory targeting realistic problems (aging, high floorplan)
export const INVENTORY = [
  { id: 'INV-1001', stock: 'H8842', vin: 'JHM123456789', brandId: 'BR-2', model: 'Talon 1000R', year: 2024, category: 'SxS', condition: 'New', locationId: 'LOC-1', cost: 21500, price: 23699, ageDays: 14, fpCostPerDay: 4, status: 'Active' },
  { id: 'INV-1002', stock: 'Y1102', vin: 'JYAA123456789', brandId: 'BR-1', model: 'YZF-R7', year: 2023, category: 'Motorcycle', condition: 'New', locationId: 'LOC-2', cost: 7800, price: 8999, ageDays: 92, fpCostPerDay: 2, status: 'Active' },
  { id: 'INV-1003', stock: 'P9921', vin: '3A1123456789', brandId: 'BR-3', model: 'RZR Pro R', year: 2024, category: 'SxS', condition: 'New', locationId: 'LOC-1', cost: 32000, price: 37499, ageDays: 4, fpCostPerDay: 6, status: 'Pending' },
  { id: 'INV-1004', stock: 'U8831', vin: 'JKAA123456789', brandId: 'BR-4', model: 'Ninja 400', year: 2021, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 3800, price: 5499, reconSpend: 340, ageDays: 104, fpCostPerDay: 0, status: 'Active' },
  { id: 'INV-1005', stock: 'U8845', vin: 'JYAB123456789', brandId: 'BR-1', model: 'MT-07', year: 2021, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 5100, price: null, reconSpend: 340, ageDays: 8, fpCostPerDay: 0, status: 'Recon' },
  { id: 'INV-1006', stock: 'U8846', vin: 'JHMB123456789', brandId: 'BR-2', model: 'Rebel 500', year: 2019, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 3200, price: null, reconSpend: 0, ageDays: 2, fpCostPerDay: 0, status: 'Inspection' }
];

export const CUSTOMERS = [
  { id: 'CUST-1', householdId: 'HH-1', name: 'John Davis', phone: '225-555-0192', email: 'john.davis@mock.com', LTV: 14500, tags: ['VIP'], lastContacted: new Date(Date.now() - 3600000).toISOString() },
  { id: 'CUST-2', householdId: null, name: 'Sarah Miller', phone: '985-555-0188', email: 'smiller@mock.com', LTV: 0, tags: ['Bad Credit'], lastContacted: null },
  { id: 'CUST-3', householdId: 'HH-2', name: 'Robert King', phone: '225-555-0177', email: 'rking@mock.com', LTV: 32000, tags: ['Cash Buyer'], lastContacted: new Date(Date.now() - 86400000).toISOString() },
  { id: 'CUST-4', householdId: null, name: 'Emily White', phone: '985-555-0166', email: 'emily.w@mock.com', LTV: 0, tags: [], lastContacted: null },
  { id: 'CUST-5', householdId: 'HH-1', name: 'Mark Allen', phone: '225-555-0155', email: 'm.allen@mock.com', LTV: 8000, tags: ['Service Defector'], lastContacted: new Date(Date.now() - 172800000).toISOString() }
];

export const CAMPAIGNS = [
  { id: 'CAMP-1', name: 'Fall Yamaha Push', type: 'Social', spendMTD: 2400 },
  { id: 'CAMP-2', name: 'Retargeting (General)', type: 'Display', spendMTD: 800 },
  { id: 'CAMP-3', name: 'Facebook Used Inventory', type: 'Social', spendMTD: 1200 },
  { id: 'CAMP-4', name: 'Organic SEO', type: 'Organic', spendMTD: 187 },
  { id: 'CAMP-5', name: 'Google Paid Search', type: 'Search', spendMTD: 394 }
];

export const LEADS = [
  { id: 'LEAD-1', customerId: 'CUST-1', sourceId: 'CAMP-4', empId: 'EMP-3', createdAt: new Date(Date.now() - 4000*60), status: 'Responded', stage: 'Working', tradeIn_ExpectedACV: 4500, appointmentId: 'APT-1' },
  { id: 'LEAD-2', customerId: 'CUST-2', sourceId: 'CAMP-5', empId: 'EMP-4', createdAt: new Date(Date.now() - 82000*60), status: 'Unresponded', stage: 'New', tradeIn_ExpectedACV: null, appointmentId: null },
  { id: 'LEAD-3', customerId: 'CUST-3', sourceId: 'Walk-in', empId: 'EMP-8', createdAt: new Date(Date.now() - 20000*60), status: 'In Progress', stage: 'Demo', tradeIn_ExpectedACV: null, appointmentId: null },
  { id: 'LEAD-4', customerId: 'CUST-4', sourceId: 'CAMP-3', empId: 'EMP-8', createdAt: new Date(Date.now() - 120000*60), status: 'Unresponded', stage: 'New', tradeIn_ExpectedACV: 2000, appointmentId: null },
  { id: 'LEAD-5', customerId: 'CUST-5', sourceId: 'Referral', empId: 'EMP-3', createdAt: new Date(Date.now() - 180000*60), status: 'Responded', stage: 'Sold', tradeIn_ExpectedACV: null, appointmentId: null }
];

export const LENDERS = [
  { id: 'LEND-1', name: 'Sheffield Financial', type: 'Prime' },
  { id: 'LEND-2', name: 'Synchrony', type: 'Prime' },
  { id: 'LEND-3', name: 'Octane', type: 'Near Prime' },
  { id: 'LEND-4', name: 'Roadrunner', type: 'Subprime' }
];

export const DEALS = [
  { id: 'DEAL-1', leadId: 'LEAD-5', inventoryId: 'INV-1001', customerId: 'CUST-5', empId: 'EMP-3', fiManagerId: 'EMP-5', lenderId: 'LEND-1', status: 'Funded', salePrice: 23699, cost: 21500, frontGross: 2199, reserve: 450, vscPrice: 1500, vscCost: 700, gapPrice: 0, gapCost: 0, date: new Date().toISOString() },
  { id: 'DEAL-2', inventoryId: 'INV-1002', customerId: 'CUST-4', empId: 'EMP-8', fiManagerId: 'EMP-5', lenderId: 'LEND-3', status: 'Approved', salePrice: 8999, cost: 7800, frontGross: 1199, reserve: 320, vscPrice: 1100, vscCost: 500, gapPrice: 800, gapCost: 400, date: new Date().toISOString() },
  { id: 'DEAL-3', inventoryId: 'INV-1003', customerId: 'CUST-1', empId: 'EMP-4', fiManagerId: 'EMP-5', lenderId: 'LEND-2', status: 'Pending Stips', salePrice: 37499, cost: 32000, frontGross: 5499, reserve: 800, vscPrice: 0, vscCost: 0, gapPrice: 0, gapCost: 0, date: new Date().toISOString() }
];

export const SERVICE_ORDERS = [
  { id: 'RO-1842', customerId: 'CUST-1', unitDesc: '2024 Honda Talon', techId: 'EMP-6', advisorId: 'EMP-4', status: 'In Progress', type: 'Customer Pay', laborHoursSold: 4.0, laborHoursActual: 2.5, partsSale: 120, partsCost: 65, openedAt: new Date(Date.now() - 4*3600000).toISOString() },
  { id: 'RO-1843', customerId: 'CUST-2', unitDesc: '2022 Yamaha Waverunner', techId: null, advisorId: 'EMP-4', status: 'Waiting Parts', type: 'Warranty', laborHoursSold: 2.0, laborHoursActual: 0, partsSale: 0, partsCost: 0, openedAt: new Date(Date.now() - 24*3600000).toISOString() },
  { id: 'RO-1844', customerId: 'CUST-3', unitDesc: '2023 Polaris Rzr', techId: 'EMP-7', advisorId: 'EMP-8', status: 'Quality Check', type: 'Internal', laborHoursSold: 3.5, laborHoursActual: 3.5, partsSale: 850, partsCost: 400, openedAt: new Date(Date.now() - 2*3600000).toISOString() },
  { id: 'RO-1845', customerId: 'CUST-5', unitDesc: '2020 Kawasaki Z900', techId: 'EMP-6', advisorId: 'EMP-8', status: 'Ready for Pickup', type: 'Customer Pay', laborHoursSold: 1.5, laborHoursActual: 1.2, partsSale: 45, partsCost: 20, openedAt: new Date(Date.now() - 48*3600000).toISOString() },
  { id: 'RO-1846', customerId: 'CUST-4', unitDesc: '2021 Yamaha MT-07', techId: 'EMP-7', advisorId: 'EMP-4', status: 'In Bay', type: 'Customer Pay', laborHoursSold: 6.0, laborHoursActual: 5.5, partsSale: 420, partsCost: 190, openedAt: new Date(Date.now() - 6*3600000).toISOString() }
];

export const TASKS_AND_ALERTS = [
  { id: 'TASK-1', type: 'critical', entityType: 'Inventory', entityId: 'INV-1002', message: "Unit Y1102 — 92 days on floor plan. Markdown required.", assignedTo: 'EMP-2' },
  { id: 'TASK-2', type: 'critical', entityType: 'Lead', entityId: 'LEAD-2', message: "Sarah Miller lead unresponded 1h 22m.", assignedTo: 'EMP-4' },
  { id: 'TASK-3', type: 'warning', entityType: 'OEM', entityId: 'BR-1', message: "Yamaha Q3 tier: 4 units from $74K bonus — 9 days left", assignedTo: 'EMP-2' },
  { id: 'TASK-4', type: 'warning', entityType: 'Service', entityId: null, message: "Recon backlog: 2 units waiting tech assignment", assignedTo: 'EMP-6' },
  { id: 'TASK-5', type: 'success', entityType: 'Finance', entityId: null, message: "F&I backend PVR tracking +18% vs prior month", assignedTo: 'EMP-5' }
];

export const APPRAISALS = [
  { id: 'APP-1', customerId: 'CUST-1', evaluatorId: 'EMP-3', make: 'Kawasaki', model: 'Z900', year: 2020, expectedACV: 4500, status: 'Pending Customer Approval' }
];

/* --- NEW CRM DATA STRUCTURES (PHASE 1) --- */

export const CRM_HOUSEHOLDS = [
  { id: 'HH-1', name: 'Davis-Allen Household', mainContactId: 'CUST-1', address: '123 Powersports Way, Baton Rouge, LA', totalLTV: 22500 },
  { id: 'HH-2', name: 'King Household', mainContactId: 'CUST-3', address: '456 Mud Bayou Rd, Slidell, LA', totalLTV: 32000 }
];

export const CRM_OPPORTUNITIES = [
  { id: 'OPP-1', leadId: 'LEAD-1', customerId: 'CUST-1', status: 'Active', probPct: 80, estimatedFrontGross: 1200, estimatedBackGross: 800 },
  { id: 'OPP-2', leadId: 'LEAD-2', customerId: 'CUST-2', status: 'Active', probPct: 15, estimatedFrontGross: 600, estimatedBackGross: 400 },
  { id: 'OPP-3', leadId: 'LEAD-3', customerId: 'CUST-3', status: 'Active', probPct: 40, estimatedFrontGross: 2500, estimatedBackGross: 1500 }
];

export const CRM_ACTIVITIES = [
  { id: 'ACT-1', type: 'System', description: 'Lead score increased to 85 due to third website visit', timestamp: new Date(Date.now() - 3600000).toISOString(), customerId: 'CUST-1' }
];

export const CRM_TASKS = [
  { id: 'TSK-1', assignedTo: 'EMP-3', customerId: 'CUST-1', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'Pending', type: 'Follow Up Call' }
];

export const CRM_APPOINTMENTS = [
  { id: 'APT-1', leadId: 'LEAD-1', customerId: 'CUST-1', assignedTo: 'EMP-3', datetime: new Date(Date.now() + (2 * 86400000)).toISOString(), status: 'Pending', type: 'Sales Demo' }
];

export const CRM_COMMUNICATIONS = [
  { id: 'COM-1', customerId: 'CUST-1', type: 'SMS', direction: 'out', body: 'Hey John, your Z900 appraisal looks solid! When can you bring it by?', timestamp: new Date(Date.now() - 7200000).toISOString(), authorId: 'EMP-3' },
  { id: 'COM-2', customerId: 'CUST-1', type: 'SMS', direction: 'in', body: 'I can probably swing by Tuesday afternoon. Do you have the new Talon assembled?', timestamp: new Date(Date.now() - 3600000).toISOString(), authorId: null },
  { id: 'COM-3', customerId: 'CUST-2', type: 'Email', direction: 'out', body: 'Hi Sarah, are you still interested in the Honda Talon?', timestamp: new Date(Date.now() - 82000*60).toISOString(), authorId: 'EMP-4' }
];

export const CRM_QUOTES = [
  { id: 'QTE-1', opportunityId: 'OPP-1', customerId: 'CUST-1', status: 'Draft', totalVehiclePrice: 23699, cashDown: 2000, tradeAllowance: 4500, tradePayoff: 0, requestedTerm: 60 }
];

export const CRM_QUOTE_SCENARIOS = [
  { id: 'QS-1', quoteId: 'QTE-1', name: 'Standard Payment', apr: 6.99, termLength: 60, monthlyPayment: 342.15, isSelected: true },
  { id: 'QS-2', quoteId: 'QTE-1', name: 'Aggressive APR (Zero Down)', apr: 3.99, termLength: 48, monthlyPayment: 421.10, isSelected: false }
];

export const CRM_TRADE_INS = [
  { id: 'TRD-1', customerId: 'CUST-1', vin: 'JKAZ900XX12345', make: 'Kawasaki', model: 'Z900', year: 2020, mileage: 4200, payOffAmount: 0, actualCashValue: 4500 }
];

export const CRM_PREQUAL_APPLICATIONS = [
  { id: 'PQ-1', customerId: 'CUST-1', status: 'Submitted', consentId: 'CON-1', submittedAt: new Date(Date.now() - 86400000).toISOString(), secureNotes: 'Equifax pull returned clean history. ***-**-1234' }
];

export const CRM_PREQUAL_CONSENTS = [
  { id: 'CON-1', customerId: 'CUST-1', ipAddress: '192.168.1.44', capturedAt: new Date(Date.now() - 86500000).toISOString(), method: 'SMS Link' }
];

export const CRM_PREQUAL_RESULTS = [
  { id: 'PQR-1', applicationId: 'PQ-1', provider: 'Octane', decision: 'Pre-Approved', maxAmount: 28000, tier: 'Prime', assignedAPR: 6.99, stipulationList: ['Proof of income'] }
];

export const CRM_SCORE_EVENTS = [
  { id: 'SE-1', customerId: 'CUST-1', newScore: 85, delta: 15, trigger: 'Website Inventory View (Talon)', timestamp: new Date().toISOString() }
];

export const CRM_LOST_REASONS = [
  { id: 'LR-1', reason: 'Price too high' },
  { id: 'LR-2', reason: 'Bought elsewhere' },
  { id: 'LR-3', reason: 'Credit declined' },
  { id: 'LR-4', reason: 'Lost contact' }
];

export const CRM_TAGS = [
  { id: 'TAG-1', name: 'VIP', color: 'bg-gold text-black' },
  { id: 'TAG-2', name: 'Bad Credit', color: 'bg-red-500 text-white' },
  { id: 'TAG-3', name: 'Cash Buyer', color: 'bg-green-500 text-white' },
  { id: 'TAG-4', name: 'Service Defector', color: 'bg-purple-500 text-white' }
];

export const CRM_AUTOMATION_RULES = [
  { id: 'AR-1', name: 'Auto-Assign Internet Leads', trigger: 'New Lead Created', condition: 'Lead Source = Website OR Chat', action: 'Round Robin assigned to Sales Associate', owner: 'EMP-2', active: true },
  { id: 'AR-2', name: 'Uncontacted Lead Alert (SLA)', trigger: 'Lead Age > 12h', condition: 'Status = New AND Contact Count = 0', action: 'Send SMS Alert to Assigned Rep', owner: 'EMP-2', active: true },
  { id: 'AR-3', name: 'Manager Escalation: Neglected Hot Lead', trigger: 'Lead Age > 48h', condition: 'Lead Score >= 80 AND Status = Unresponded', action: 'Reassign to GM & Create Priority Task', owner: 'EMP-1', active: true },
  { id: 'AR-4', name: 'No-Show Follow-Up', trigger: 'Appointment Time Passed', condition: 'Status = NoShow', action: 'Send "Sorry we missed you" Email Sequence', owner: 'EMP-2', active: true },
  { id: 'AR-5', name: 'Quote Follow-Up (Day 3)', trigger: 'Quote Created', condition: 'Age = 3 Days AND Status = Draft', action: 'Create Follow-up Call Task for Rep', owner: 'EMP-3', active: true },
  { id: 'AR-6', name: 'Missing Trade Photos Reminder', trigger: 'Trade Captured', condition: 'Missing Photos AND Age > 24h', action: 'Send SMS with Secure Upload Link', owner: 'EMP-2', active: false },
  { id: 'AR-7', name: 'Prequal Incomplete Chase', trigger: 'Soft-Pull Consent Sent', condition: 'Age > 24h AND No Result', action: 'Send SMS Reminder: "Finish your application"', owner: 'EMP-5', active: true },
  { id: 'AR-8', name: 'AI Inventory Match Alert', trigger: 'New Unit Added to Floorplan', condition: 'Matches > 85% with any Working Lead', action: 'Email Lead: "We found your perfect match!"', owner: 'System', active: false },
  { id: 'AR-9', name: 'Price Drop Blast', trigger: 'Unit Price Reduced > $500', condition: 'Unit is on Lead Watchlist', action: 'Send SMS Price Drop Alert', owner: 'EMP-2', active: true },
  { id: 'AR-10', name: 'Lost Deal Reactivation (60 Day)', trigger: 'Lead Status Changed to Lost', condition: 'Time Since Lost = 60 Days', action: 'Add to "60-Day Resurrection" Marketing List', owner: 'EMP-2', active: true },
  { id: 'AR-11', name: 'Post-Sale Gratitude Sequence', trigger: 'Deal Status Changed to Funded', condition: 'None', action: 'Queue 3-Day Check-in Email & 30-Day Call', owner: 'EMP-2', active: true },
  { id: 'AR-12', name: 'First Service Reminder (Break-In)', trigger: 'Deal Status Changed to Funded', condition: 'Category = Vehicle', action: 'Create Service Appointment Task +60 Days', owner: 'EMP-6', active: true }
];

export const CRM_AUDIT_LOGS = [
  { id: 'AUD-1', userId: 'EMP-3', action: 'READ_PII', targetId: 'CUST-1', timestamp: new Date().toISOString(), description: 'Accessed secured identity info.' },
  { id: 'AUD-2', userId: 'EMP-5', action: 'OVERRIDE_RATE', targetId: 'QS-1', timestamp: new Date().toISOString(), description: 'F&I Manager overrode buy rate.' }
];

/* --- SUPER AGENT PERSISTENCE LAYER --- */

export const AGENT_RECOMMENDATIONS = [];
export const AGENT_ACTIONS = [];
export const AGENT_AUDIT_LOGS = [];

export const CAPACITY_METRICS = {
  'LOC-1': {
    'DEPT-1': { type: 'Sales', showroomTraffic: 12, activeReps: 4, waitingForFI: 2, avgWaitTimeMins: 18 },
    'DEPT-3': { type: 'Service', activeBays: 8, occupiedBays: 6, idleTechs: 1, wipDollarAmount: 14500 }
  },
  'LOC-2': {
    'DEPT-1': { type: 'Sales', showroomTraffic: 4, activeReps: 2, waitingForFI: 0, avgWaitTimeMins: 0 },
    'DEPT-3': { type: 'Service', activeBays: 4, occupiedBays: 4, idleTechs: 0, wipDollarAmount: 8200 }
  }
};

export const AGENT_THRESHOLDS = {
  leadVIP: 80,
  inventoryAged: 60,
  slingshotDiscount: 15,
  serviceOverdue: 24
};

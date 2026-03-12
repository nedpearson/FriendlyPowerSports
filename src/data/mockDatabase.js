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
  { id: 'INV-1004', stock: 'U8831', vin: 'JKAA123456789', brandId: 'BR-4', model: 'Ninja 400', year: 2021, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 3800, price: 5499, reconSpend: 340, ageDays: 41, fpCostPerDay: 0, status: 'Active' },
  { id: 'INV-1005', stock: 'U8845', vin: 'JYAB123456789', brandId: 'BR-1', model: 'MT-07', year: 2021, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 5100, price: null, reconSpend: 340, ageDays: 8, fpCostPerDay: 0, status: 'Recon' },
  { id: 'INV-1006', stock: 'U8846', vin: 'JHMB123456789', brandId: 'BR-2', model: 'Rebel 500', year: 2019, category: 'Motorcycle', condition: 'Used', locationId: 'LOC-3', cost: 3200, price: null, reconSpend: 0, ageDays: 2, fpCostPerDay: 0, status: 'Inspection' }
];

export const CUSTOMERS = [
  { id: 'CUST-1', name: 'John Davis', phone: '225-555-0192', email: 'john.davis@mock.com', LTV: 14500 },
  { id: 'CUST-2', name: 'Sarah Miller', phone: '985-555-0188', email: 'smiller@mock.com', LTV: 0 },
  { id: 'CUST-3', name: 'Robert King', phone: '225-555-0177', email: 'rking@mock.com', LTV: 32000 },
  { id: 'CUST-4', name: 'Emily White', phone: '985-555-0166', email: 'emily.w@mock.com', LTV: 0 },
  { id: 'CUST-5', name: 'Mark Allen', phone: '225-555-0155', email: 'm.allen@mock.com', LTV: 8000 }
];

export const CAMPAIGNS = [
  { id: 'CAMP-1', name: 'Fall Yamaha Push', type: 'Social', spendMTD: 2400 },
  { id: 'CAMP-2', name: 'Retargeting (General)', type: 'Display', spendMTD: 800 },
  { id: 'CAMP-3', name: 'Facebook Used Inventory', type: 'Social', spendMTD: 1200 },
  { id: 'CAMP-4', name: 'Organic SEO', type: 'Organic', spendMTD: 187 },
  { id: 'CAMP-5', name: 'Google Paid Search', type: 'Search', spendMTD: 394 }
];

export const LEADS = [
  { id: 'LEAD-1', customerId: 'CUST-1', sourceId: 'CAMP-4', empId: 'EMP-3', createdAt: new Date(Date.now() - 4000*60), status: 'Responded', stage: 'Working' },
  { id: 'LEAD-2', customerId: 'CUST-2', sourceId: 'CAMP-5', empId: 'EMP-4', createdAt: new Date(Date.now() - 82000*60), status: 'Unresponded', stage: 'New' }, // 1h 22m old
  { id: 'LEAD-3', customerId: 'CUST-3', sourceId: 'Walk-in', empId: 'EMP-8', createdAt: new Date(Date.now() - 20000*60), status: 'In Progress', stage: 'Demo' },
  { id: 'LEAD-4', customerId: 'CUST-4', sourceId: 'CAMP-1', empId: 'EMP-8', createdAt: new Date(Date.now() - 120000*60), status: 'Unresponded', stage: 'New' }, // 2h old
  { id: 'LEAD-5', customerId: 'CUST-5', sourceId: 'Referral', empId: 'EMP-3', createdAt: new Date(Date.now() - 180000*60), status: 'Responded', stage: 'Sold' }
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
  { id: 'RO-1842', customerId: 'CUST-1', unitDesc: '2024 Honda Talon', techId: 'EMP-6', advisorId: 'EMP-4', status: 'In Progress', type: 'Customer Pay', laborHoursSold: 4.0, laborHoursActual: 2.5, partsSale: 120, partsCost: 65, openedAt: new Date(Date.now() - 4*3600000) },
  { id: 'RO-1843', customerId: 'CUST-2', unitDesc: '2022 Yamaha Waverunner', techId: null, advisorId: 'EMP-4', status: 'Waiting Parts', type: 'Warranty', laborHoursSold: 2.0, laborHoursActual: 0, partsSale: 0, partsCost: 0, openedAt: new Date(Date.now() - 24*3600000) },
  { id: 'RO-1844', customerId: 'CUST-3', unitDesc: '2023 Polaris Rzr', techId: 'EMP-7', advisorId: 'EMP-8', status: 'Quality Check', type: 'Internal', laborHoursSold: 3.5, laborHoursActual: 3.5, partsSale: 850, partsCost: 400, openedAt: new Date(Date.now() - 2*3600000) }
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

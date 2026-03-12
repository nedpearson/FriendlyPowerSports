export const USERS = [
  { id: 1, name: "Gerald Pearson", role: "Owner", location: "All", avatar: "G" },
  { id: 2, name: "Mike Thibodaux", role: "Manager", location: "Baton Rouge", avatar: "M" },
  { id: 3, name: "Jake Fontenot", role: "Employee", location: "Baton Rouge", avatar: "J", title: "Sales Associate" },
  { id: 4, name: "Marcus Broussard", role: "Employee", location: "Baton Rouge", avatar: "M", title: "Sales Associate" },
  { id: 5, name: "Rachel Tran", role: "Employee", location: "Baton Rouge", avatar: "R", title: "F&I Manager" },
  { id: 6, name: "Tony Guillory", role: "Employee", location: "Baton Rouge", avatar: "T", title: "Service Tech" }
];

export const KPIS = {
  totalGrossMTD: { value: "$487,240", delta: "12.4%", trend: "up" },
  unitsRetailedMTD: { value: "84", delta: "8.2%", trend: "up" },
  fiBackendPerUnit: { value: "$1,247", delta: "6.1%", trend: "up" },
  avgFrontEndGross: { value: "$892", delta: "3.2%", trend: "down" },
  oemBonusProjected: { value: "$74,000", delta: "On Track", trend: "neutral" },
  leadsToday: { value: "23", delta: "4 vs avg", trend: "up" }
};

export const ALERTS = [
  { id: 1, type: "critical", message: "Unit #B2241 — 84 days on floor plan. Action required." },
  { id: 2, type: "critical", message: "3 leads unresponded 2h+ — Sales team" },
  { id: 3, type: "warning", message: "Yamaha Q3 tier: 4 units from $74K bonus — 9 days left" },
  { id: 4, type: "warning", message: "Recon backlog: 6 units awaiting tech assignment" },
  { id: 5, type: "success", message: "F&I backend up 18% MTD vs last month" }
];

export const GROSS_MIX_DATA = [
  { name: 'Front End', value: 187400, fill: '#c9a84c' },
  { name: 'F&I Backend', value: 104748, fill: '#e8c96a' },
  { name: 'Service', value: 89200, fill: '#8a6d2f' },
  { name: 'Parts', value: 43100, fill: '#5a5550' },
  { name: 'Accessories', value: 62800, fill: '#3a3a3a' },
];

export const WEEKLY_GROSS_DATA = [
  { week: 'W1', batonRouge: 85000, slidell: 42000 },
  { week: 'W2', batonRouge: 91000, slidell: 44000 },
  { week: 'W3', batonRouge: 88000, slidell: 46000 },
  { week: 'W4', batonRouge: 94000, slidell: 41000 },
  { week: 'W5', batonRouge: 99000, slidell: 48000 },
  { week: 'W6', batonRouge: 102000, slidell: 50000 },
  { week: 'W7', batonRouge: 95000, slidell: 47000 },
  { week: 'W8', batonRouge: 110000, slidell: 53000 },
  { week: 'W9', batonRouge: 115000, slidell: 55000 },
  { week: 'W10', batonRouge: 112000, slidell: 52000 },
  { week: 'W11', batonRouge: 118000, slidell: 56000 },
  { week: 'W12', batonRouge: 125000, slidell: 59000 }
];

export const OEM_TIERS = [
  { brand: 'Yamaha Q3', units: 48, target: 52, bonus: "$74K", status: 'warning', percentage: 92 },
  { brand: 'Honda Q3', units: 31, target: 35, bonus: "$42K", status: 'warning', percentage: 89 },
  { brand: 'Polaris Q2', units: 28, target: 28, bonus: "$38K", status: 'success', percentage: 100 },
  { brand: 'Kawasaki Q4', units: 12, target: 30, bonus: "$28K", status: 'critical', percentage: 40 }
];

export const SCORECARDS = [
  { dept: 'Sales', metrics: '$187,400 gross | 84 units', goal: '74% to goal', trend: 'up' },
  { dept: 'F&I', metrics: '$104,748 backend | $1,247/unit', goal: '88% to goal', trend: 'up' },
  { dept: 'Service', metrics: '$89,200 labor', goal: '94% tech efficiency', trend: 'up' },
  { dept: 'Parts', metrics: '$43,100 gross', goal: '71% accessories attach', trend: 'down' },
  { dept: 'Used/UBD', metrics: '$62,800 gross | 44 units', goal: '18 days avg age', trend: 'neutral' }
];

export const INVENTORY_AGING = [
  { bucket: '0-30 days', units: 312, color: 'var(--green)' },
  { bucket: '31-60 days', units: 298, color: 'var(--gold)' },
  { bucket: '61-90 days', units: 142, color: 'var(--amber)' },
  { bucket: '90+ days', units: 78, color: 'var(--red)' }
];

export const LIVE_LEADS = [
  { name: 'John Davis', source: 'Web', rep: 'Jake Fontenot', time: '4m', status: 'Responded', stage: 'New', color: 'green' },
  { name: 'Sarah Miller', source: 'Phone', rep: 'Marcus Broussard', time: '1h 22m', status: 'Unresponded', stage: 'New', color: 'red' },
  { name: 'Robert King', source: 'Walk-in', rep: 'Tiffany Hebert', time: '20m', status: 'In Progress', stage: 'Demo', color: 'gold' },
  { name: 'Emily White', source: 'Web', rep: 'Will Landry', time: '2h', status: 'Unresponded', stage: 'New', color: 'red' },
  { name: 'Mark Allen', source: 'Referral', rep: 'Kristy Dugas', time: '3h', status: 'Responded', stage: 'Sold', color: 'green' },
];

export const TOP_PERFORMERS = [
  { rank: 1, name: 'Jake Fontenot', role: 'Sales', units: 24, gross: '$52,100', comm: '$8,400' },
  { rank: 2, name: 'Marcus Broussard', role: 'Sales', units: 19, gross: '$41,200', comm: '$6,800' },
  { rank: 3, name: 'Will Landry', role: 'Sales', units: 17, gross: '$38,400', comm: '$6,200' },
];

export const WATCH_LIST = [
  { name: 'Devon Arceneaux', role: 'Sales', issue: 'Close rate dropped 12% MTD' },
  { name: 'Sam LeBlanc', role: 'Tech', issue: 'Efficiency < 75% for 2 weeks' }
];

export const INVENTORY_DATA = [
  { id: '1001', stock: 'H8842', year: 2024, make: 'Honda', model: 'Talon 1000R', category: 'SxS', location: 'Baton Rouge', condition: 'New', age: 14, cost: 21500, price: 23699, status: 'Active' },
  { id: '1002', stock: 'Y1102', year: 2023, make: 'Yamaha', model: 'YZF-R7', category: 'Motorcycle', location: 'Slidell', condition: 'New', age: 92, cost: 7800, price: 8999, status: 'Active' },
  { id: '1003', stock: 'P9921', year: 2024, make: 'Polaris', model: 'RZR Pro R', category: 'SxS', location: 'Baton Rouge', condition: 'New', age: 4, cost: 32000, price: 37499, status: 'Pending' },
  { id: '1004', stock: 'U8831', year: 2021, make: 'Kawasaki', model: 'Ninja 400', category: 'Motorcycle', location: 'Used Bikes Direct', condition: 'Used', age: 41, cost: 3800, price: 5499, status: 'Active' },
];

export const RECON_PIPELINE = [
  { id: 'R1', unit: '2019 Honda Rebel 500', cost: 3200, spend: 150, days: 3, tech: 'Tony Guillory', status: 'Inspection' },
  { id: 'R2', unit: '2021 Yamaha MT-07', cost: 5100, spend: 340, days: 8, tech: 'Sam LeBlanc', status: 'Recon In Progress' },
  { id: 'R3', unit: '2020 Polaris Rzr 1000', cost: 12000, spend: 850, days: 12, tech: 'Chris Fontenot', status: 'Detail' }
];

export const RO_BOARD = [
  { id: 'RO-1842', tech: 'Tony Guillory', age: '4h', customer: 'David Smith', unit: '2024 Honda Talon', status: 'In Progress', work: '10k Service' },
  { id: 'RO-1843', tech: 'Unassigned', age: '1d', customer: 'Sandra Clark', unit: '2022 Yamaha Waverunner', status: 'Waiting Parts', work: 'Impeller Replace' },
  { id: 'RO-1844', tech: 'Sam LeBlanc', age: '2h', customer: 'Brian Adams', unit: '2023 Polaris Rzr', status: 'Quality Check', work: 'Accessory Install' }
];

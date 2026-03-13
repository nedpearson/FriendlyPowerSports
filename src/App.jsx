import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, CreditCard, Package, Bike, Wrench,
  Clock, DollarSign, Megaphone, Award, FileBarChart, Users as UsersIcon, Settings,
  Bell, Search, ChevronRight, CheckCircle2, ChevronDown, User, Play, Calendar, AlertCircle, Command
} from 'lucide-react';

import { KPICard } from './components/ui/KPICard';
import { SectionHeader } from './components/ui/SectionHeader';
import { StatusChip } from './components/ui/StatusChip';
import { TrendBadge } from './components/ui/TrendBadge';
import { AutomatedInsights } from './components/ui/AutomatedInsights';
import { DrillDownValue } from './components/ui/DrillDownValue';

import { EMPLOYEES } from './data/mockDatabase';
import { 
  getKpiStats, getLiveLeads, getTopPerformers, getInventoryAging,
  getAlerts, getReconPipeline, getROBoard 
} from './data/selectors';

/* --- MOCK DATA FOR CHARTS/GRAPHS --- */
const WEEKLY_GROSS = [
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

const GROSS_MIX = [
  { name: 'Front End', value: 187400, color: '#c9a84c' },
  { name: 'F&I Backend', value: 104748, color: '#e8c96a' },
  { name: 'Service', value: 89200, color: '#8a6d2f' },
  { name: 'Parts', value: 43100, color: '#5a5550' },
  { name: 'Accessories', value: 62800, color: '#3a3a3a' },
];

const OEM_TIERS = [
  { brand: 'Yamaha Q3', units: 48, target: 52, bonus: "$74K", pct: 92, color: "bg-amber" },
  { brand: 'Honda Q3', units: 31, target: 35, bonus: "$42K", pct: 89, color: "bg-amber" },
  { brand: 'Polaris Q2', units: 28, target: 28, bonus: "$38K", pct: 100, color: "bg-green" },
  { brand: 'Kawasaki Q4', units: 12, target: 30, bonus: "$28K", pct: 40, color: "bg-red" }
];

const SCORECARDS = [
  { dept: 'Sales', v1: '$187,400 gross', v2: '84 units', goal: '74% to goal', tColor: 'text-amber' },
  { dept: 'F&I', v1: '$104,748 backend', v2: '$1,247/unit', goal: '88% to goal', tColor: 'text-green' },
  { dept: 'Service', v1: '$89,200 labor', v2: '94% tech eff.', goal: '94% eff', tColor: 'text-green' },
  { dept: 'Parts', v1: '$43,100 gross', v2: '71% acc attach', goal: '71% attach', tColor: 'text-red' },
  { dept: 'Used/UBD', v1: '$62,800 gross', v2: '44 units', goal: '18d avg age', tColor: 'text-gold' }
];

/* --- COMPONENTS --- */

const AuthGate = ({ onLogin }) => {
  const [role, setRole] = useState("Owner");
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-charcoal p-8 rounded border border-border">
        <div className="flex justify-center mb-6">
          <img src="https://friendlyyamaha.com/wp-content/uploads/2025/10/new-logo.png" alt="Logo" className="h-12 object-contain" onError={(e) => { e.target.style.display='none'; }}/>
        </div>
        <h1 className="text-3xl font-playfair text-gold text-center mb-1">DealerCommand™</h1>
        <p className="text-text-muted text-center text-sm mb-8">Profit Intelligence · Operational Command</p>

        <div className="space-y-4">
          <input type="text" placeholder="Username" className="w-full bg-panel border border-border rounded p-3 text-text focus:outline-none focus:border-gold" />
          <input type="password" placeholder="Password" className="w-full bg-panel border border-border rounded p-3 text-text focus:outline-none focus:border-gold" />
          
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-panel border border-border rounded p-3 text-text focus:outline-none focus:border-gold"
          >
            <option value="Owner">Owner (All Locations)</option>
            <option value="Manager">Manager (Baton Rouge)</option>
            <option value="Employee">Employee (Sales)</option>
          </select>

          <button 
            onClick={() => {
              const exactRole = role === "Manager" ? "General Manager" : role === "Employee" ? "Sales Associate" : role;
              const u = EMPLOYEES.find(x => x.role === exactRole);
              onLogin(u);
            }}
            className="w-full bg-gold hover:bg-gold-light text-black font-bold py-3 rounded transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN MODULES --- */

const DashboardModule = ({ onNavigate, onDrillDown, company, location }) => {
  return (
    <div className="space-y-6">
      {/* Location Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-charcoal p-4 rounded border border-border">
        <div className="flex space-x-2 items-center">
           <span className="text-white font-bold">{company || "Friendly Powersports"}</span>
           <span className="text-text-muted px-2">/</span>
           <span className="text-gold">{location || "All Locations"}</span>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <span className="text-text-dim text-sm">MTD: Sep 1 - Sep 18, 2025</span>
          <button className="text-gold text-sm border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition-colors">Export Report</button>
        </div>
      </div>

      <AutomatedInsights insights={[
        { type: "warning", message: "Yamaha Q3 Volume Tier: You are 4 units away from unlocking the $74,000 retroactive bonus. Tier expires in 6 days.", actionText: "View Eligible Pipeline" },
        { type: "opportunity", message: "Baton Rouge F&I backend is pacing $315 per unit higher than Slidell MTD. Reviewing Rachel Tran's pitch structure with the Slidell team is recommended.", actionText: "Compare F&I Scorecards" },
        { type: "action", message: "There are exactly 8 units across both locations aging past 120 days. Current floorplan carry cost for these units is $640/week.", actionText: "Review Aged Inventory" }
      ]} />

      {/* KPI Mega Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {getKpiStats().map((kpi, i) => (
          <KPICard 
            key={i} 
            label={kpi.label} 
            value={kpi.value} 
            delta={kpi.delta} 
            color={kpi.color} 
            onClick={() => onDrillDown('KPI', kpi)} 
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-charcoal p-4 rounded border border-border">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Total Gross by Week</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_GROSS} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSlidell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a6d2f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8a6d2f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#2e2e2e', color: '#e8e4da' }} />
                <Area type="monotone" dataKey="batonRouge" stroke="#c9a84c" fillOpacity={1} fill="url(#colorBR)" />
                <Area type="monotone" dataKey="slidell" stroke="#8a6d2f" fillOpacity={1} fill="url(#colorSlidell)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-center mt-2 text-xs text-text-muted hover:text-gold cursor-pointer transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Total Gross Details', action: 'View all historical transaction strips' })}>
              View Detailed Ledger
            </div>
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded border border-border">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Gross Mix</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GROSS_MIX} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {GROSS_MIX.map((entry, index) => <Cell onClick={() => onDrillDown('Report', { category: 'Gross Mix Sector', name: entry.name, value: entry.value })} key={`cell-${index}`} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#2e2e2e', color: '#e8e4da' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded border border-border flex flex-col">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">OEM Tier Progress</h3>
          <div className="flex-1 flex flex-col justify-between">
            {OEM_TIERS.map((tier, i) => (
              <div key={i} className="mb-2 cursor-pointer hover:bg-panel p-1 rounded" onClick={() => onNavigate('OEM Incentives')}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text">{tier.brand}</span>
                  <span className="text-white font-bold">{tier.units}/{tier.target} ({tier.bonus})</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${tier.color === 'bg-amber' ? 'bg-amber-500' : tier.color === 'bg-green' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${tier.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dept Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SCORECARDS.map((sc, i) => (
          <div key={i} className="bg-charcoal p-3 rounded border border-border hover:border-gold cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); onDrillDown('Report', { category: 'Department Performance', name: sc.dept, summary: `${sc.v1} | ${sc.v2}`, goalTrend: sc.goal }); }}>
            <h4 className="text-white font-bold mb-1">{sc.dept}</h4>
            <div className="text-sm text-text-muted">
               <DrillDownValue value={sc.v1} label={`${sc.dept} Metric 1`} type="Report" onDrillDown={onDrillDown} />
            </div>
            <div className="text-sm text-text-muted">
               <DrillDownValue value={sc.v2} label={`${sc.dept} Metric 2`} type="Report" onDrillDown={onDrillDown} />
            </div>
            <div className={`text-xs font-bold mt-2 ${sc.tColor}`}>
               <DrillDownValue value={sc.goal} label={`${sc.dept} Goal Tracker`} type="Report" onDrillDown={onDrillDown} color={sc.tColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Two-Column: Inventory / Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-charcoal p-4 rounded border border-border cursor-pointer" onClick={() => onNavigate("Inventory")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase">Inventory Aging</h3>
            <span className="text-xs text-gold">View All →</span>
          </div>
          <div className="space-y-3">
            {[
              { label: '0-30 days', count: 312, pct: '50%', color: 'bg-green-600' },
              { label: '31-60 days', count: 298, pct: '40%', color: 'bg-yellow-600' },
              { label: '61-90 days', count: 142, pct: '20%', color: 'bg-orange-500' },
              { label: '90+ days', count: 78, pct: '10%', color: 'bg-red-600' }
            ].map(b => (
              <div key={b.label} className="relative cursor-pointer hover:opacity-80 transition-opacity" onClick={(e) => { e.stopPropagation(); onDrillDown('Inventory', { view: 'Aging Bucket', bucket: b.label, count: b.count }); }}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text">{b.label}</span>
                  <span className="text-text-muted">
                     <DrillDownValue value={`${b.count} units`} label={`Aging: ${b.label}`} type="Inventory" onDrillDown={onDrillDown} />
                  </span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color}`} style={{ width: b.pct }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-red-400 font-mono bg-red-900/20 p-2 rounded">
            $4,840/day floorplan cost on 90+ aged units
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded border border-border cursor-pointer" onClick={() => onNavigate("Sales")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase">Live Lead Feed</h3>
            <span className="text-xs text-gold">View All →</span>
          </div>
          <div className="space-y-0">
            {getLiveLeads().map((l, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); onDrillDown('Lead', l); }} className="flex justify-between py-2 border-b border-border/50 last:border-0 hover:bg-panel p-2 -mx-2 rounded transition-colors cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {l.name}
                    {l.urgent && <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="text-xs text-text-dim">{l.source} · {l.rep}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${l.urgent ? 'text-red-500' : 'text-green-500'}`}>
                    {l.time} ({l.status})
                  </div>
                  <div className="text-xs text-text-muted">{l.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-charcoal p-4 rounded border border-border">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Top Performers MTD</h3>
          <div className="space-y-3">
            {getTopPerformers().map((p, i) => (
              <div key={i} onClick={() => onDrillDown('Employee', p)} className="flex items-center justify-between bg-panel p-3 rounded cursor-pointer hover:border-gold border border-transparent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center font-bold text-black border border-gold">
                    {i+1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{p.name}</div>
                    <div className="text-xs text-text-dim">{p.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gold">
                     <DrillDownValue value={`${p.units} units`} label={`${p.name} Units Sold MTD`} type="Employee" onDrillDown={onDrillDown} color="text-gold" />
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                     <DrillDownValue value={`${p.comm} comm`} label={`${p.name} Commission MTD`} type="Employee" onDrillDown={onDrillDown} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded border border-border">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Watch List</h3>
          <div className="space-y-3">
              <div className="flex items-center justify-between bg-black p-3 rounded border-l-2 border-red-500 cursor-pointer hover:bg-panel transition-colors" onClick={() => onDrillDown('Employee', {name: 'Devon Arceneaux', role: 'Sales', alert: 'Close rate dropped 12% MTD'})}>
                <div>
                  <div className="text-sm font-bold text-white">Devon Arceneaux</div>
                  <div className="text-xs text-text-dim">Sales · Close rate dropped 12% MTD</div>
                </div>
                <button className="text-xs bg-panel border border-border px-2 py-1 rounded text-white hover:text-gold transition-colors">Review</button>
              </div>
              <div className="flex items-center justify-between bg-black p-3 rounded border-l-2 border-red-500 cursor-pointer hover:bg-panel transition-colors" onClick={() => onDrillDown('Employee', {name: 'Sam LeBlanc', role: 'Service Tech', alert: 'Efficiency < 75% for 2 weeks'})}>
                <div>
                  <div className="text-sm font-bold text-white">Sam LeBlanc</div>
                  <div className="text-xs text-text-dim">Service Tech · Efficiency &lt; 75% for 2 weeks</div>
                </div>
                <button className="text-xs bg-panel border border-border px-2 py-1 rounded text-white hover:text-gold transition-colors">Review</button>
              </div>
          </div>
        </div>
      </div>

      {/* Financial Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Working Capital', value: '$1,240,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide">WORKING CAPITAL</div>
          <div className="text-lg font-bold text-white mt-1">$1,240,000</div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Floorplan Balance', value: '$3,847,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide">FLOORPLAN BAL</div>
          <div className="text-lg font-bold text-white mt-1">$3,847,000</div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Daily FP Cost', value: '$740/day' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide">DAILY FP COST</div>
          <div className="text-lg font-bold text-red-400 mt-1">$740/day</div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center border-b-2 border-b-gold cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Proj M-E Gross', value: '$562,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide">PROJ M-E GROSS</div>
          <div className="text-lg font-bold text-gold mt-1">$562,000</div>
        </div>
      </div>
    </div>
  );
};

const SalesModule = ({ onDrillDown }) => {
  const [dealDeskUnit, setDealDeskUnit] = useState("V1");
  const [salePrice, setSalePrice] = useState(23500);
  const cost = 21000;
  const pack = 300;
  const recon = 0;
  const holdback = 420;
  const dealerCash = 0;
  const backend = 1200;
  const fpCost = 150;

  const frontEnd = salePrice - cost - pack - recon;
  const totalEcoProfit = frontEnd + holdback + dealerCash - fpCost + backend;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-white">Sales & Deal Pipeline</h2>
        <div className="flex gap-2">
          <button className="bg-charcoal border border-border px-3 py-1 rounded text-sm text-text-muted hover:text-white">Filter</button>
          <button className="bg-gold text-black px-4 py-1 rounded text-sm font-bold shadow-[0_0_10px_rgba(201,168,76,0.2)]">Write New Deal</button>
        </div>
      </div>

      <AutomatedInsights insights={[
        { type: "warning", message: "Alex in Baton Rouge has a 12% closing ratio on web leads this week (Benchmark: 25%). 8 leads went unresponsive.", actionText: "Review Lost Leads" },
        { type: "opportunity", message: "A deal penciled by Jake for a 2024 MT-07 has $0 back-end gross. Adding GAP and Tire/Wheel brings this deal to standard profitability.", actionText: "Review Deal Structure" }
      ]} />

      {/* Deal Desk Calculator */}
      <div className="bg-charcoal border border-border rounded p-6">
        <h2 className="text-gold font-playfair text-xl mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5"/> Deal Desk — Total Economic Profit Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-muted font-mono mb-1">UNIT</label>
              <select className="w-full bg-black border border-border rounded p-2 text-white outline-none" value={dealDeskUnit} onChange={e=>setDealDeskUnit(e.target.value)}>
                <option value="V1">2024 Honda Talon 1000R (#H8842)</option>
                <option value="V2">2023 Yamaha YZF-R7 (#Y1102)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">SALE PRICE ($)</label>
                <input type="number" className="w-full bg-panel border border-border rounded p-2 text-white" value={salePrice} onChange={e=>setSalePrice(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">INVOICE/COST ($)</label>
                <input type="number" className="w-full bg-black border border-border rounded p-2 text-text-muted" value={cost} disabled />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">F&I EST ($)</label>
                <input type="number" className="w-full bg-black border border-border rounded p-2 text-text-muted" value={backend} disabled />
              </div>
              <div>
                <label className="block text-xs text-text-muted font-mono mb-1">FLOORPLAN COST ($)</label>
                <input type="number" className="w-full bg-black border border-border rounded p-2 text-text-muted" value={fpCost} disabled />
              </div>
            </div>
          </div>
          <div className="bg-black border border-border rounded p-6 flex flex-col justify-between cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Deal', { unit: dealDeskUnit, salePrice, cost, pack, recon, holdback, backend, fpCost, totalEcoProfit })}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Front-End Gross:</span> 
                <span className="text-white"><DrillDownValue value={`$${frontEnd.toLocaleString()}`} label="Front-End Gross" type="Deal" onDrillDown={onDrillDown} /></span>
              </div>
              <div className="flex justify-between"><span className="text-text-muted">OEM Holdback:</span> 
                <span className="text-green-500"><DrillDownValue value={`+$${holdback.toLocaleString()}`} label="OEM Holdback" type="Deal" onDrillDown={onDrillDown} color="text-green-500" /></span>
              </div>
              <div className="flex justify-between"><span className="text-text-muted">Floorplan Cost:</span> 
                <span className="text-red-400"><DrillDownValue value={`-$${fpCost.toLocaleString()}`} label="Floorplan Cost" type="Deal" onDrillDown={onDrillDown} color="text-red-400" /></span>
              </div>
              <div className="flex justify-between"><span className="text-text-muted">Est F&I Backend:</span> 
                <span className="text-gold"><DrillDownValue value={`+$${backend.toLocaleString()}`} label="Estimated F&I Backend" type="Deal" onDrillDown={onDrillDown} color="text-gold" /></span>
              </div>
              <div className="border-t border-border my-2"></div>
            </div>
            <div>
              <div className="text-xs text-text-muted font-mono mb-1">TOTAL ECONOMIC PROFIT</div>
              <div className="text-4xl font-playfair text-gold mb-4">
                 <DrillDownValue value={`$${totalEcoProfit.toLocaleString()}`} label="Total Economic Profit" type="Deal" onDrillDown={onDrillDown} color="text-gold" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded font-bold border border-green-800">EXCELLENT RANK</span>
                <span className="text-xs bg-amber-900/40 text-amber-400 px-2 py-1 rounded border border-amber-800">+1 Yamaha $74K Tier</span>
              </div>
              <div className="text-sm border-l-2 border-gold pl-3 py-1 bg-panel text-white">
                <span className="font-bold text-gold">Recommendation:</span> PUSH (Finance Maximize)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FIModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">F&I & Business Office</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
           <CreditCard className="w-4 h-4" /> Run Credit
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Backend/Unit MTD", value: "$1,247", delta: "+$42 vs BM", color: "text-green-500" },
          { label: "VSC Penetration", value: "62%", delta: "+4% vs Last Mo", color: "text-green-500" },
          { label: "GAP Penetration", value: "48%", delta: "-2% vs Last Mo", color: "text-amber-500" },
          { label: "Total Reserve MTD", value: "$18,450", delta: "+$2,100", color: "text-gold" }
        ].map((m,i) => (
          <div key={i} className="bg-charcoal p-4 rounded border border-border">
            <div className="text-xs text-text-muted font-mono mb-1 uppercase tracking-wider">{m.label}</div>
            <div className={`text-2xl font-bold ${m.label.includes('Reserve') ? 'text-white' : 'text-gold'}`}>
               <DrillDownValue value={m.value} label={m.label} type="Financials" onDrillDown={onDrillDown} />
            </div>
            <div className={`text-xs mt-1 ${m.color} bg-black inline-block px-1 rounded`}>
               <DrillDownValue value={m.delta} label={`${m.label} Trend`} type="Financials" onDrillDown={onDrillDown} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-charcoal border border-border rounded p-4">
        <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Deal-by-Deal Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text">
            <thead className="text-xs text-text-muted bg-black font-mono">
              <tr>
                <th className="px-4 py-3 rounded-tl">Customer</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Lender</th>
                <th className="px-4 py-3">Reserve</th>
                <th className="px-4 py-3">VSC</th>
                <th className="px-4 py-3">GAP</th>
                <th className="px-4 py-3 rounded-tr text-right">Total Backend</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => onDrillDown('Deal', {customer: 'John Davis', unit: '2024 Talon 1000R', lender: 'Sheffield', reserve: '$450', vsc: '$800', gap: 'No', total: '$1,250'})} className="border-b border-border/50 hover:bg-panel transition-colors cursor-pointer">
                <td className="px-4 py-3 text-white font-bold">John Davis</td>
                <td className="px-4 py-3">2024 Talon 1000R</td>
                <td className="px-4 py-3">Sheffield</td>
                <td className="px-4 py-3">$450</td>
                <td className="px-4 py-3"><span className="text-green-500 font-bold">Yes ($800)</span></td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3 text-right font-bold text-gold">$1,250</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-panel transition-colors">
                <td className="px-4 py-3 text-white font-bold">Emily White</td>
                <td className="px-4 py-3">2023 YZF-R7</td>
                <td className="px-4 py-3">Octane</td>
                <td className="px-4 py-3">$320</td>
                <td className="px-4 py-3"><span className="text-green-500 font-bold">Yes ($600)</span></td>
                <td className="px-4 py-3"><span className="text-green-500 font-bold">Yes ($400)</span></td>
                <td className="px-4 py-3 text-right font-bold text-gold">$1,320</td>
              </tr>
              <tr onClick={() => onDrillDown('Deal', {customer: 'Mark Allen', unit: '2024 Rzr Pro R', lender: 'Synchrony', reserve: '$800', vsc: 'No', gap: 'No', total: '$800'})} className="hover:bg-panel transition-colors cursor-pointer">
                <td className="px-4 py-3 text-white font-bold">Mark Allen</td>
                <td className="px-4 py-3">2024 Rzr Pro R</td>
                <td className="px-4 py-3">Synchrony</td>
                <td className="px-4 py-3">$800</td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3 text-right font-bold text-gold">$800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InventoryModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-playfair text-white">Inventory Intelligence</h2>
        <div className="flex space-x-2">
          <button className="bg-charcoal border border-border text-text px-4 py-2 rounded text-sm">Add Unit</button>
          <button className="bg-gold text-black px-4 py-2 rounded text-sm font-bold shadow-lg shadow-gold/20">Print Labels</button>
        </div>
      </div>

      <AutomatedInsights insights={[
        { type: "action", message: "3 Polaris RZRs in Slidell have been in stock for 115 days. Baton Rouge has turned the same model 4 times in the last 60 days.", actionText: "Initiate Transfer" },
        { type: "negative", message: "Floorplan interest for 'Used Bikes Direct' inventory is currently pacing 14% higher than last month due to aged Harley-Davidson units.", actionText: "View Markdown Recommendations" }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-charcoal p-4 rounded border border-border flex flex-col items-center justify-center">
          <div className="font-playfair text-5xl text-gold">
             <DrillDownValue value="830" label="Total Active Units" type="Inventory" onDrillDown={onDrillDown} />
          </div>
          <div className="text-text-muted font-mono mt-2">TOTAL UNITS</div>
          <div className="flex gap-4 mt-4 text-sm">
             <div className="text-green-500 font-bold">
               <DrillDownValue value="520 New" label="New Inventory" type="Inventory" onDrillDown={onDrillDown} color="text-green-500" />
             </div>
             <div className="text-white">
               <DrillDownValue value="310 Used" label="Used Inventory" type="Inventory" onDrillDown={onDrillDown} />
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-charcoal p-4 rounded border border-border">
           <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Brand Mix</h3>
           <div className="flex gap-2 h-12 w-full mt-8 rounded overflow-hidden">
             <div className="bg-red-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '22%'}}>Honda (187)</div>
             <div className="bg-blue-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '20%'}}>Yamaha (164)</div>
             <div className="bg-gray-200 text-black flex items-center justify-center text-xs font-bold transition-all hover:opacity-80 cursor-pointer" style={{width: '17%'}}>Polaris (142)</div>
             <div className="bg-green-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '11%'}}>Kawasaki (89)</div>
             <div className="bg-panel flex items-center justify-center text-xs font-bold text-white border border-border" style={{width: '30%'}}>Used (220)</div>
           </div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded p-4">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase">Live Inventory Ledger</h3>
           <div className="flex gap-2">
             <button className="bg-black border border-border text-xs px-3 py-1 rounded hover:text-white">Filter</button>
             <button className="bg-black border border-border text-xs px-3 py-1 rounded hover:text-white">Export</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text">
            <thead className="text-xs text-text-muted bg-black font-mono">
              <tr>
                <th className="px-4 py-3 rounded-tl">Stock#</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Loc</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">List Price</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3 rounded-tr text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => onDrillDown('Inventory', {stock: 'Y1102', unit: '2023 YZF-R7', category: 'Motorcycle', loc: 'Slidell', cost: '$7,800', price: '$8,999', days: 92})} className="border-b border-border/50 hover:bg-panel transition-colors bg-red-900/10 cursor-pointer">
                <td className="px-4 py-3 text-red-500 font-bold">Y1102</td>
                <td className="px-4 py-3 text-white">2023 YZF-R7</td>
                <td className="px-4 py-3 text-text-muted">Motorcycle</td>
                <td className="px-4 py-3">Slidell</td>
                <td className="px-4 py-3">$7,800</td>
                <td className="px-4 py-3 font-bold">$8,999</td>
                <td className="px-4 py-3 text-red-400 font-bold">92</td>
                <td className="px-4 py-3 text-right"><button className="text-xs bg-red-900/40 text-red-300 border border-red-800 px-2 py-1 rounded hover:bg-red-800">MARKDOWN</button></td>
              </tr>
              <tr onClick={() => onDrillDown('Inventory', {stock: 'H8842', unit: '2024 Talon 1000R', category: 'SxS', loc: 'BTR', cost: '$21,500', price: '$23,699', days: 14})} className="border-b border-border/50 hover:bg-panel transition-colors cursor-pointer">
                <td className="px-4 py-3 font-mono text-text-dim">H8842</td>
                <td className="px-4 py-3 text-white">2024 Talon 1000R</td>
                <td className="px-4 py-3 text-text-muted">SxS</td>
                <td className="px-4 py-3">BTR</td>
                <td className="px-4 py-3">$21,500</td>
                <td className="px-4 py-3 font-bold">$23,699</td>
                <td className="px-4 py-3 text-green-500">14</td>
                <td className="px-4 py-3 text-right"><button className="text-xs bg-panel border border-border px-2 py-1 rounded hover:text-white">VIEW</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsedBikesModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">Used Bikes Direct</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
           <Bike className="w-4 h-4" /> New Appraisal
         </button>
      </div>

      <div className="bg-charcoal border border-border rounded p-6">
         <h2 className="text-gold font-playfair text-xl mb-6">Recon Pipeline</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {['Acquired / Insp.', 'Recon In Progress', 'Detail & Photos', 'Frontline Ready'].map((stage, i) => (
             <div key={i} className="bg-black border border-border rounded p-3 min-h-[400px]">
                <h3 className="text-xs text-text-muted font-mono mb-4 text-center border-b border-border pb-2">{stage}</h3>
                {i === 1 && (
                  <div onClick={() => onDrillDown('Inventory', {unit: '2021 Yamaha MT-07', cost: '$5,100', spend: '$340', days: 8, tech: 'Sam L.', stage: 'Recon In Progress'})} className="bg-panel rounded border-l-4 border-amber-500 p-3 shadow text-sm mb-3 cursor-pointer hover:border-gold transition-colors">
                    <div className="font-bold text-white mb-1">2021 Yamaha MT-07</div>
                    <div className="flex justify-between text-xs text-text-muted"><span>Cost: $5,100</span> <span>Spend: $340</span></div>
                    <div className="mt-2 text-xs flex justify-between"><span className="text-amber-500">Day 8</span> <span>Sam L.</span></div>
                  </div>
                )}
                {i === 0 && (
                  <div onClick={() => onDrillDown('Inventory', {unit: '2019 Honda Rebel 500', cost: '$3,200', spend: '$0', days: 2, tech: 'Tony G.', stage: 'Acquired / Insp.'})} className="bg-panel rounded border-l-4 border-green-500 p-3 shadow text-sm mb-3 cursor-pointer hover:border-gold transition-colors">
                    <div className="font-bold text-white mb-1">2019 Honda Rebel 500</div>
                    <div className="flex justify-between text-xs text-text-muted"><span>Cost: $3,200</span> <span>Spend: $0</span></div>
                    <div className="mt-2 text-xs flex justify-between"><span className="text-green-500">Day 2</span> <span>Tony G.</span></div>
                  </div>
                )}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

const ServicePartsModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">Service & Parts</h1>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-charcoal border border-border rounded p-6">
          <h2 className="text-gold font-playfair text-xl mb-6">Technician Efficiency</h2>
          <div className="space-y-4">
             {[
               { name: 'Tony Guillory', eff: 104, flagged: 42, actual: 40, status: 'text-green-500' },
               { name: 'Chris Fontenot', eff: 92, flagged: 35, actual: 38, status: 'text-gold' },
               { name: 'Sam LeBlanc', eff: 71, flagged: 27, actual: 38, status: 'text-red-500' },
             ].map(t => (
               <div key={t.name} className="flex justify-between items-center pb-2 border-b border-border/50">
                 <div>
                   <div className="text-white font-bold">{t.name}</div>
                   <div className="text-xs text-text-muted">{t.flagged} flagged hrs / {t.actual} clock hrs</div>
                 </div>
                 <div className={`text-xl font-bold ${t.status}`}>
                    <DrillDownValue value={`${t.eff}%`} label={`${t.name} Efficiency`} type="Employee" onDrillDown={onDrillDown} color={t.status} />
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-6">
          <h2 className="text-gold font-playfair text-xl mb-6">RO Board</h2>
          <div className="space-y-3">
             {[
               { id: '1842', unit: '2024 Honda Talon', status: 'In Progress', tech: 'Tony G.' },
               { id: '1843', unit: '2022 Waverunner', status: 'Waiting Parts', tech: 'Unassigned' },
               { id: '1844', unit: '2023 Polaris Rzr', status: 'Quality Check', tech: 'Sam L.' }
             ].map(ro => (
                <div key={ro.id} onClick={() => onDrillDown('RO', ro)} className="bg-black border border-border rounded p-3 flex justify-between cursor-pointer hover:border-gold transition-colors">
                  <div>
                    <div className="text-xs text-text-dim font-mono">RO #{ro.id}</div>
                    <div className="font-bold text-white text-sm">{ro.unit}</div>
                  </div>
                  <div className="text-right">
                     <div className={`text-xs font-bold ${ro.status === 'In Progress' ? 'text-green-500' : 'text-amber-500'}`}>{ro.status}</div>
                     <div className="text-xs text-text-muted">{ro.tech}</div>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PayrollModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">Payroll & Commission</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold">
           Approve Payroll
         </button>
      </div>

       <div className="bg-charcoal p-4 rounded border border-border flex justify-between items-center mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-xs text-text-muted font-mono tracking-wide">CURRENT PERIOD</div>
            <div className="text-white font-bold mt-1">Sept 1 - Sept 15, 2025</div>
          </div>
          <div className="text-center px-8 border-x border-border">
            <div className="text-xs text-text-muted font-mono tracking-wide">TOTAL LIABILITY</div>
            <div className="text-3xl font-playfair mt-1">
               <DrillDownValue value="$142,500" label="Total Payroll Liability" type="Financials" onDrillDown={onDrillDown} color="text-gold" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-muted font-mono tracking-wide">STATUS</div>
            <div className="text-amber-500 font-bold mt-1">Pending Approval</div>
          </div>
       </div>

      <div className="bg-charcoal border border-border rounded p-4">
        <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase">Payroll Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text">
            <thead className="text-xs text-text-muted bg-black font-mono">
              <tr>
                <th className="px-4 py-3 rounded-tl">Employee</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Regular Hrs</th>
                <th className="px-4 py-3 text-right">OT Hrs</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3 rounded-tr text-right">Total Net</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data Loop */}
              {[['Jake Fontenot', 'Sales', 'BTR', '80.0', '2.5', '$4,200', '$5,450'],
                ['Marcus Broussard', 'Sales', 'BTR', '80.0', '0.0', '$3,400', '$4,600'],
                ['Rachel Tran', 'F&I', 'BTR', '80.0', '0.0', '$6,100', '$7,300'],
                ['Tony Guillory', 'Service', 'BTR', '80.0', '12.0', '$0', '$3,250']].map((row, i) => (
                <tr key={i} onClick={() => onDrillDown('Employee', {name: row[0], role: row[1], loc: row[2], regularHrs: row[3], otHrs: row[4], commission: row[5], totalNet: row[6]})} className="border-b border-border/50 hover:bg-panel transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-white font-bold">{row[0]}</td>
                  <td className="px-4 py-3 text-text-muted">{row[1]}</td>
                  <td className="px-4 py-3">{row[2]}</td>
                  <td className="px-4 py-3 text-right">{row[3]}</td>
                  <td className="px-4 py-3 text-right text-red-500">{row[4]}</td>
                  <td className="px-4 py-3 text-right text-green-500">{row[5]}</td>
                  <td className="px-4 py-3 text-right font-bold text-gold">{row[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OEMIncentivesModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">OEM Incentives & Rewards</h1>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ brand: 'Yamaha (Q3)', target: '52 Units', current: '48', bonus: '$74,000', days: 9, status: 'AT RISK', stColor: 'text-amber-500', barBtn: 'bg-amber-500', pct: 92 },
          { brand: 'Honda (Q3)', target: '35 Units', current: '31', bonus: '$42,000', days: 9, status: 'WATCH', stColor: 'text-gold', barBtn: 'bg-gold', pct: 89 },
          { brand: 'Polaris (Q2)', target: '28 Units', current: '28', bonus: '$38,000', days: 0, status: 'ACHIEVED', stColor: 'text-green-500', barBtn: 'bg-green-500', pct: 100 },
          { brand: 'Kawasaki (Q4)', target: '30 Units', current: '12', bonus: '$28,000', days: 41, status: 'BEHIND', stColor: 'text-red-500', barBtn: 'bg-red-500', pct: 40 },
        ].map((oem,i) => (
          <div key={i} onClick={() => onDrillDown('OEM', oem)} className="bg-charcoal border border-border rounded p-6 cursor-pointer hover:border-border-light transition-colors">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h2 className="text-xl font-bold text-white">{oem.brand}</h2>
                   <div className="text-sm text-text-muted mt-1">{oem.days > 0 ? `${oem.days} days remaining` : 'Program ended'}</div>
                </div>
                <div className={`text-xs font-bold border rounded px-2 py-1 ${oem.stColor} border-current`}>
                   {oem.status}
                </div>
             </div>
             
             <div className="mb-2 flex justify-between text-sm">
                <span className="text-white">{oem.current} / {oem.target}</span>
                <span className="font-bold text-gold text-xl">{oem.bonus}</span>
             </div>
             
             <div className="w-full bg-black rounded-full h-2 mb-4 overflow-hidden border border-border">
                <div className={`h-2 ${oem.barBtn}`} style={{ width: `${oem.pct}%`}}></div>
             </div>
             
             {oem.pct < 100 && (
                <div className="bg-panel border border-border rounded p-3 text-xs">
                   <strong className="text-white">Push List:</strong> 5 aging units identified that count towards this tier. <span className="text-gold cursor-pointer">View units →</span>
                </div>
             )}
          </div>
        ))}
       </div>
    </div>
  );
};

const MarketingModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
        <div className="bg-charcoal border border-border rounded p-6">
           <h2 className="text-gold font-playfair text-xl mb-6">Cost Per Sold Unit (MTD)</h2>
           <div className="space-y-3">
             {[{ chan: 'Organic SEO', cost: 187, color: 'text-green-500', bg: 'bg-green-500', width: '20%' },
               { chan: 'Referral', cost: 42, color: 'text-green-500', bg: 'bg-green-500', width: '5%' },
               { chan: 'Google Paid', cost: 394, color: 'text-gold', bg: 'bg-gold', width: '40%' },
               { chan: 'Facebook Ads', cost: 521, color: 'text-amber-500', bg: 'bg-amber-500', width: '60%' },
               { chan: 'Lead Aggregators', cost: 1240, color: 'text-red-500', bg: 'bg-red-500', width: '90%' }
             ].map(m => (
               <div key={m.chan} className="relative">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-white">{m.chan}</span>
                   <span className={`font-bold ${m.color}`}>
                      <DrillDownValue value={`$${m.cost}/sold`} label={`${m.chan} Acquisition Cost`} type="Financials" onDrillDown={onDrillDown} color={m.color} />
                   </span>
                 </div>
                 <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                   <div className={`h-full ${m.bg}`} style={{width: m.width}}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-6">
           <h2 className="text-gold font-playfair text-xl mb-6">Campaign Performance</h2>
           <div className="space-y-3">
              {[
               { name: 'Fall Yamaha Push', spend: '$2,400', leads: 42, sold: 4, roas: '2.8x', status: 'Good' },
               { name: 'Retargeting (General)', spend: '$800', leads: 15, sold: 1, roas: '1.2x', status: 'Watch' },
               { name: 'Facebook Used Inventory', spend: '$1,200', leads: 88, sold: 12, roas: '8.4x', status: 'Excellent' }
             ].map(c => (
               <div key={c.name} onClick={() => onDrillDown('Campaign', c)} className="bg-black border border-border p-3 rounded text-sm cursor-pointer hover:border-gold transition-colors">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-bold text-white">{c.name}</span>
                   <span className={`text-xs px-2 py-1 rounded border border-current font-bold ${c.roas === '8.4x' ? 'text-green-500' : c.roas === '1.2x' ? 'text-amber-500' : 'text-gold'}`}>{c.roas} ROAS</span>
                 </div>
                 <div className="text-xs text-text-muted flex justify-between">
                   <span>Spend: {c.spend}</span>
                   <span>Leads: {c.leads}</span>
                   <span>Sold: {c.sold}</span>
                 </div>
               </div>
              ))}
            </div>
         </div>
    </div>
  );
};

const EmployeeHubModule = ({ user, onDrillDown }) => {
  const leaderboard = [
    { name: "Jake Fontenot", units: 24, target: 30, gross: "$104k", curTier: "Gold", nextTier: "Platinum" },
    { name: user?.name || "CurrentUser", units: 18, target: 20, gross: "$82k", curTier: "Silver", nextTier: "Gold", isMe: true },
    { name: "Marcus Broussard", units: 14, target: 20, gross: "$61k", curTier: "Bronze", nextTier: "Silver" },
    { name: "Tony Guillory", units: 9, target: 15, gross: "$38k", curTier: "Base", nextTier: "Bronze" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-charcoal p-6 rounded border border-border">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-panel border-4 border-gold-dim flex items-center justify-center text-3xl font-bold text-gold">
              {user?.avatar || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-playfair text-white mb-1">{user?.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-text-muted uppercase tracking-wider">{user?.role} · {user?.location}</span>
                <span className="bg-black border border-border px-2 py-0.5 rounded text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-black p-4 rounded border border-border text-center min-w-[120px]">
               <div className="text-3xl font-bold text-white mb-1">#2</div>
               <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Store Rank</div>
             </div>
             <div className="bg-black p-4 rounded border border-border border-b-2 border-b-gold text-center min-w-[120px]">
               <div className="text-3xl font-bold text-gold mb-1">18</div>
               <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Units MTD</div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
           <div className="bg-charcoal border border-border rounded p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-gold font-playfair text-xl flex items-center gap-2"><Award className="w-5 h-5"/> Regional Leaderboard</h2>
               <div className="text-xs border border-border px-2 py-1 rounded text-text-muted">MTD: Sep 1 - Sep 18</div>
             </div>
             
             <div className="space-y-4">
                {leaderboard.map((rep, idx) => (
                   <div key={idx} className={`bg-black p-4 rounded border ${rep.isMe ? 'border-gold shadow-[0_0_15px_rgba(201,168,76,0.15)]' : 'border-border'} flex flex-col gap-3 relative overflow-hidden hover:border-gold-dim transition-colors cursor-pointer`} onClick={() => onDrillDown('Employee', {name: rep.name, role: 'Sales', location: 'Baton Rouge'})}>
                      {rep.isMe && <div className="absolute top-0 right-0 bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-bl">YOU</div>}
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-panel text-white'}`}>
                              #{idx + 1}
                            </div>
                            <span className="font-bold text-white text-lg">{rep.name}</span>
                         </div>
                         <div className="text-right">
                            <div className="font-bold text-white text-xl">{rep.units} <span className="text-sm font-normal text-text-muted">Units</span></div>
                         </div>
                      </div>
                      
                      <div>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-text-muted">Current: <span className="text-white">{rep.curTier}</span></span>
                            <span className="text-gold font-bold">{rep.target - rep.units} units to {rep.nextTier} Bonus</span>
                         </div>
                         <div className="w-full bg-panel h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-gold-dim to-gold h-full rounded-full" style={{ width: `${(rep.units / rep.target) * 100}%`}}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           </div>
         </div>
         
         <div className="space-y-6">
           <div className="bg-charcoal border border-border rounded p-6">
             <h2 className="text-gold font-playfair text-xl mb-4 text-center">Commission Pacing</h2>
             <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                   <DrillDownValue value="$8,400" label="Projected Commission" type="Employee" onDrillDown={onDrillDown} />
                </div>
                <div className="text-sm text-green-500 flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4"/> 
                   <DrillDownValue value="+$1,200 vs Last Month" label="Commission Delta" type="Employee" onDrillDown={onDrillDown} color="text-green-500" />
                </div>
             </div>
             <button className="w-full bg-panel border border-border hover:bg-black hover:border-gold transition-colors text-white py-2 rounded text-sm font-bold">View Commission Statement</button>
           </div>
         </div>
       </div>
    </div>
  );
};

const DrillDownModal = ({ item, onClose }) => {
  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case 'KPI':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-playfair text-gold border-b border-border pb-2">{item.data.label} Full Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black p-4 rounded border border-border">
                <div className="text-xs text-text-muted">Current MTD</div>
                <div className="text-2xl font-bold text-white">{item.data.value}</div>
              </div>
              <div className="bg-black p-4 rounded border border-border">
                <div className="text-xs text-text-muted">Delta vs Prior Period</div>
                <div className="text-2xl font-bold text-green-500">{item.data.delta}</div>
              </div>
            </div>
            <div className="h-64 bg-black rounded border border-border flex items-center justify-center">
              <span className="text-text-muted italic">[Extensive Historical Chart for {item.data.label}]</span>
            </div>
          </div>
        );
      case 'Lead':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-2xl font-playfair text-white">{item.data.name}</h3>
                <div className="text-text-muted uppercase text-xs">{item.data.source} Lead · Assigned to {item.data.rep}</div>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-bold ${item.data.urgent ? 'bg-red-900/40 text-red-500 border border-red-500' : 'bg-green-900/40 text-green-500 border border-green-500'}`}>
                {item.data.status} ({item.data.time})
              </div>
            </div>
            <div className="flex gap-2">
               <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex-1">Start Comms Hub (SMS/Email)</button>
               <button className="bg-panel hover:bg-border text-white px-4 py-2 rounded text-sm font-bold border border-border flex-1">Reassign Lead</button>
            </div>
            <div className="bg-black p-4 rounded border border-border min-h-[200px]">
               <div className="text-sm font-bold text-white mb-2">Communication History</div>
               <div className="space-y-2 border-l-2 border-border pl-4 ml-2">
                 <div className="text-xs text-text-muted">No comms log available for mock lead.</div>
               </div>
            </div>
          </div>
        );
      case 'Financials':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2">{item.data.metric} Analysis</h3>
            <div className="bg-black p-6 rounded border border-border flex items-center justify-between">
              <div className="text-sm text-text-muted">Current Assessment</div>
              <div className="text-3xl font-bold text-white">{item.data.value}</div>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-lg font-bold text-white">General Ledger Distribution</h4>
               <div className="bg-panel rounded border border-border overflow-hidden">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-black text-text-muted text-xs uppercase font-mono border-b border-border">
                       <tr><th className="px-4 py-2">Acct Code</th><th className="px-4 py-2">Account Name</th><th className="px-4 py-2 text-right">Balance</th></tr>
                     </thead>
                     <tbody className="text-text">
                       <tr className="border-b border-border/50"><td className="px-4 py-2">10100</td><td className="px-4 py-2">Operating Cash (BTR)</td><td className="px-4 py-2 text-right">$842,000</td></tr>
                       <tr className="border-b border-border/50"><td className="px-4 py-2">10200</td><td className="px-4 py-2">Operating Cash (SLD)</td><td className="px-4 py-2 text-right">$198,000</td></tr>
                       <tr className="border-b border-border/50"><td className="px-4 py-2">11500</td><td className="px-4 py-2">Contracts in Transit (CIT)</td><td className="px-4 py-2 text-right text-amber-500">$200,000</td></tr>
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        );
      case 'Deal':
         return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2">Deal Folder: {item.data.unit || item.data.customer}</h3>
            
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
               <div>
                  <h4 className="text-xs uppercase text-text-muted tracking-wider mb-2">Deal Economics</h4>
                  <div className="bg-black p-4 rounded border border-border space-y-2 text-sm">
                    {Object.entries(item.data).map(([k,v]) => k !== 'unit' && k !== 'customer' && (
                       <div key={k} className="flex justify-between">
                         <span className="capitalize text-text-muted">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                         <span className="font-bold text-white">{v}</span>
                       </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-xs uppercase text-text-muted tracking-wider mb-2">Required Stips</h4>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Proof of Income (Verified)</div>
                     <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Driver's License (Verified)</div>
                     <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 border border-red-500 rounded bg-red-900/20"></div> Proof of Residence (Missing)</div>
                     <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 border border-red-500 rounded bg-red-900/20"></div> Full Coverage Insurance (Missing)</div>
                  </div>
                  <button className="mt-4 w-full bg-gold hover:bg-gold-light text-black py-2 rounded text-sm font-bold">Request Stips from Buyer</button>
               </div>
            </div>
            
            <div className="text-xs text-text-muted italic border-l-2 border-border pl-3">
               Compliance Note: This deal jacket is partially compiled. Ensure all signatures and missing stips are collected prior to deal finalization.
            </div>
          </div>
        );
      case 'Inventory':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2">{item.data.unit} (Stock #{item.data.stock || 'N/A'})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="col-span-1 bg-black rounded border border-border aspect-square flex items-center justify-center text-text-muted">
                  [Unit Photo]
               </div>
               <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-panel p-3 rounded border border-border">
                        <div className="text-xs text-text-dim uppercase">Status</div>
                        <div className="text-white font-bold">{item.data.stage || 'In Stock'}</div>
                     </div>
                     <div className="bg-panel p-3 rounded border border-border">
                        <div className="text-xs text-text-dim uppercase">Days in Inventory</div>
                        <div className={`font-bold ${item.data.days > 90 ? 'text-red-500' : 'text-green-500'}`}>{item.data.days} Days</div>
                     </div>
                     <div className="bg-panel p-3 rounded border border-border">
                        <div className="text-xs text-text-dim uppercase">Cost Basis</div>
                        <div className="text-white font-bold">{item.data.cost}</div>
                     </div>
                     <div className="bg-panel p-3 rounded border border-border border-b-2 border-b-gold">
                        <div className="text-xs text-text-dim uppercase">List Price</div>
                        <div className="text-gold font-bold text-xl">{item.data.price || 'TBD'}</div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div>
               <h4 className="text-sm font-bold text-white mb-3">Unit Lifecycle History</h4>
               <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-panel text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-panel p-4 rounded border border-border">
                          <div className="flex justify-between mb-1">
                             <div className="font-bold text-white text-sm">Unit Received</div>
                             <div className="text-xs text-text-muted">Oct 12</div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button className="bg-gold text-black px-4 py-2 rounded text-sm font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-colors">Approve $500 Markdown</button>
                <button className="bg-panel text-white border border-border px-4 py-2 rounded text-sm hover:bg-black transition-colors">Transfer to Slidell</button>
            </div>
          </div>
        );
      case 'RO':
      case 'Employee':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2">Employee Record: {item.data.name}</h3>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded bg-panel border-2 border-gold flex items-center justify-center text-4xl font-bold text-gold">
                {item.data.name ? item.data.name[0] : 'E'}
              </div>
              <div>
                <div className="text-sm text-text-muted uppercase tracking-wider">{item.data.role}</div>
                <div className="text-3xl font-bold text-white mb-1">{item.data.name}</div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active · {item.data.location || 'All Locations'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {Object.entries(item.data).filter(([k]) => !['name', 'role', 'avatar', 'location'].includes(k)).map(([k,v]) => (
                  <div key={k} className="bg-panel p-4 rounded border border-border">
                     <div className="text-xs text-text-dim uppercase tracking-wider mb-1">{k}</div>
                     <div className="text-lg font-bold text-white">{String(v)}</div>
                  </div>
               ))}
            </div>

            <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> Send Teams Message
                </button>
                <button className="bg-panel text-white border border-border px-4 py-2 rounded text-sm hover:bg-black transition-colors">
                  Review Timesheet
                </button>
            </div>
          </div>
        );
      case 'OEM':
      case 'Campaign':
      case 'Report':
      default:
        // Generic elaborate view for drill-downs that haven't been meticulously tailored yet
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2">{item.type} Deep Inspector Data View</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {Object.entries(item.data).map(([k,v]) => (
                  <div key={k} className="bg-panel p-4 rounded border border-border hover:border-gold transition-colors">
                     <div className="text-xs text-text-dim uppercase tracking-wider mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                     <div className="text-lg font-bold text-white">{String(v)}</div>
                  </div>
               ))}
            </div>
            
            <div className="mt-8 bg-black p-4 rounded border border-border font-mono text-sm text-text-muted whitespace-pre-wrap">
               <div className="text-gold mb-2">RAW PAYLOAD:</div>
               {JSON.stringify(item.data, null, 2)}
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-border">
                <button className="bg-gold text-black px-4 py-2 rounded text-sm font-bold">Edit Record</button>
                <button className="bg-panel text-white border border-border px-4 py-2 rounded text-sm hover:bg-black">View Audit Log</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col pt-16 sm:p-12 items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="w-full max-w-4xl bg-charcoal border border-border rounded-xl shadow-2xl flex flex-col max-h-full">
         <div className="flex justify-between items-center p-6 border-b border-border bg-panel/50 rounded-t-xl">
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-gold"></div>
             <h2 className="text-lg font-mono text-white tracking-wider uppercase">DealerCommand™ Deep Inspector</h2>
           </div>
           <button onClick={onClose} className="text-text-muted hover:text-white transition-colors bg-black px-3 py-1 rounded border border-border">
             CLOSE (ESC)
           </button>
         </div>
         <div className="p-6 overflow-y-auto flex-1 bg-charcoal">
           {renderContent()}
         </div>
      </div>
    </div>
  );
};

/* Provide simple placeholders for the other tabs, or robust ones when needed */
const PlaceholderModule = ({ title, desc }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center border border-dashed border-border rounded">
    <Wrench className="w-12 h-12 text-text-muted mb-4" />
    <h2 className="text-2xl font-playfair text-white mb-2">{title}</h2>
    <p className="text-text-muted max-w-md">{desc || "Module fully connected into navigation shell. Full data view will render here."}</p>
  </div>
);

const SettingsModule = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
         <h1 className="text-3xl font-playfair text-white flex items-center gap-3">
           <Settings className="w-8 h-8 text-gold" /> Enterprise Configuration & Rules
         </h1>
         <button className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-gold/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Save Global Policy
         </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal p-6 rounded border border-border">
             <h2 className="text-xl font-bold text-white mb-4 border-b border-border pb-2">Deal Approval Thresholds</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><TrendingDown className="w-4 h-4 text-amber-500"/> Margin Floor Override</div>
                      <div className="text-xs text-text-muted">Deals below this % require GM pin</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="number" defaultValue={12} className="bg-panel border border-border rounded text-center w-16 py-1 text-white focus:border-gold outline-none" />
                     <span className="text-text-muted text-sm">%</span>
                   </div>
                </div>
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-red-500"/> Max Allowed Discount ($)</div>
                      <div className="text-xs text-text-muted">Hard cap on rep discounting without approval</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-text-muted text-sm">$</span>
                     <input type="number" defaultValue={500} className="bg-panel border border-border rounded text-center w-20 py-1 text-white focus:border-gold outline-none" />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-charcoal p-6 rounded border border-border">
             <h2 className="text-xl font-bold text-white mb-4 border-b border-border pb-2">Inventory Aging Actions</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500"/> Warning Threshold</div>
                      <div className="text-xs text-text-muted">Triggers dashboard alerts and copilot suggestions</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="number" defaultValue={90} className="bg-panel border border-border rounded text-center w-16 py-1 text-white focus:border-gold outline-none" />
                     <span className="text-text-muted text-sm">Days</span>
                   </div>
                </div>
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500"/> Critical Flag</div>
                      <div className="text-xs text-text-muted">Pushes automated markdown request to GM</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="number" defaultValue={120} className="bg-panel border border-border rounded text-center w-16 py-1 text-white focus:border-gold outline-none" />
                     <span className="text-text-muted text-sm">Days</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-charcoal p-6 rounded border border-border md:col-span-2">
             <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
               <h2 className="text-xl font-bold text-white">Automated Copilot Escalations</h2>
               <div className="bg-panel text-gold border border-gold-dim px-2 py-0.5 rounded text-xs font-mono tracking-widest uppercase">Active Agents</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
               <div className="bg-black p-4 rounded border border-border relative overflow-hidden group hover:border-gold-dim transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-white text-wrap">Unanswered Web Lead</span>
                    <input type="checkbox" defaultChecked className="accent-gold w-4 h-4 cursor-pointer mt-1" />
                  </div>
                  <div className="text-xs text-text-muted mb-4 opacity-80">Trigger: No comms in 15+ mins</div>
                  <strong className="text-xs text-text-dim block mb-1">ACTION:</strong>
                  <select className="w-full bg-panel border border-border text-xs text-white p-2 text-wrap rounded outline-none focus:border-gold">
                    <option>SMS General Manager</option>
                    <option>Reassign to Next Round-Robin Rep</option>
                    <option>Fire Auto-Responder Bot</option>
                  </select>
               </div>
               
               <div className="bg-black p-4 rounded border border-border relative overflow-hidden group hover:border-gold-dim transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-white">F&I Penetration Drop</span>
                    <input type="checkbox" defaultChecked className="accent-gold w-4 h-4 cursor-pointer mt-1" />
                  </div>
                  <div className="text-xs text-text-muted mb-4 opacity-80">Trigger: WTD pacing {"<"} 40%</div>
                  <strong className="text-xs text-text-dim block mb-1">ACTION:</strong>
                  <select className="w-full bg-panel border border-border text-xs text-white p-2 rounded outline-none focus:border-gold">
                     <option>Alert Global F&I Director</option>
                     <option>Require Desk Review on Cash Deals</option>
                  </select>
               </div>

               <div className="bg-black p-4 rounded border border-border relative overflow-hidden group hover:border-gold-dim transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-white text-wrap">Service Bay Blockage</span>
                    <input type="checkbox" defaultChecked className="accent-gold w-4 h-4 cursor-pointer mt-1" />
                  </div>
                  <div className="text-xs text-text-muted mb-4 opacity-80">Trigger: 90% Bay Capacity</div>
                  <strong className="text-xs text-text-dim block mb-1">ACTION:</strong>
                  <select className="w-full bg-panel border border-border text-xs text-white p-2 rounded outline-none focus:border-gold text-wrap">
                    <option>Throttle Online Appointment Scheduler</option>
                    <option>Alert Service Manager to Block Walk-Ins</option>
                  </select>
               </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const ClockInModule = ({ user, onDrillDown }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-charcoal border border-border rounded p-8 text-center">
        <h1 className="text-4xl font-mono text-white mb-2 pb-6 border-b border-border">
          {time.toLocaleTimeString()}
        </h1>
        <div className="py-6">
          <div className="w-20 h-20 bg-panel border-2 border-gold rounded-full flex items-center justify-center text-2xl font-bold text-gold mx-auto mb-4">
            {user?.avatar}
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-text-muted text-sm">{user?.role} · {user?.location}</p>
        </div>
        
        <div className="bg-black rounded border border-border p-4 mb-6 text-sm">
          {clockedIn ? 
            <span className="text-green-500 font-bold flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Clocked In — 4h 12m Today</span> : 
            <span className="text-text-muted">Not clocked in</span>
          }
        </div>

        <button 
          onClick={() => setClockedIn(!clockedIn)}
          className={`w-full py-4 rounded text-xl font-bold transition-all ${clockedIn ? 'bg-panel border border-red-500 text-red-500 hover:bg-red-900/20' : 'bg-gold hover:bg-gold-light text-black'}`}
        >
          {clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
        </button>
        
        <div className="mt-8">
           <button onClick={() => onDrillDown('Employee', {name: user?.name, role: user?.role, action: 'Timesheet Audit'})} className="text-xs text-text-muted hover:text-gold uppercase font-bold tracking-widest border-b border-transparent hover:border-gold pb-1 transition-all">View Timesheet Deep-Dive →</button>
        </div>
      </div>
    </div>
  );
}

const ReportsModule = ({ onDrillDown }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
         <h1 className="text-3xl font-playfair text-white flex items-center gap-3">
           <FileBarChart className="w-8 h-8 text-gold" /> Dealership Analytics Hub
         </h1>
         <div className="flex gap-2">
            <button className="bg-charcoal hover:bg-black text-white font-bold py-2 px-4 rounded border border-border transition-colors">
               Schedule Report
            </button>
            <button className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-gold/20 flex items-center gap-2">
               + Create Custom Query
            </button>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
             <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Saved Views</div>
             <button className="w-full text-left p-3 rounded bg-panel border-l-2 border-gold text-white font-bold text-sm">Month-End Executive Summary</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm">Aged Inventory Liability (90+)</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm">F&I Penetration by Product</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm">Service Tech Efficiency YTD</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm">Lost Marketing Leads</button>
          </div>
          
          <div className="md:col-span-3 space-y-6">
             <div className="bg-charcoal border border-border rounded p-6">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-playfair text-white">Month-End Executive Summary</h2>
                    <div className="text-sm text-text-muted">Generated by Dealership OS AI Copilot • 2 mins ago</div>
                 </div>
                 <button className="text-gold text-sm border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition-colors">Export PDF</button>
               </div>
               
               <div className="p-4 bg-black border border-border rounded mb-6 text-sm text-text leading-relaxed">
                 <span className="font-bold text-white block mb-2 font-mono uppercase tracking-wider text-xs">AI Synthesis:</span>
                 Overall gross profitability is up <span className="text-green-500 font-bold">14.2%</span> compared to the same period last year, driven entirely by F&I back-end products attached to used non-current inventory. However, service department labor gross has dropped <span className="text-amber-500 font-bold">6%</span> due to an increase in unbilled warranty diagnosis time at the Slidell location. Immediate attention to service writing processes is recommended.
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                   <div className="bg-panel border border-border p-4 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', {metric: 'Front-End Gross'})}>
                      <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Front-End Gross</div>
                      <div className="text-2xl font-bold text-white">
                         <DrillDownValue value="$412,850" label="Front-End Gross" type="Report" onDrillDown={onDrillDown} />
                      </div>
                   </div>
                   <div className="bg-panel border border-border p-4 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', {metric: 'Back-End Gross'})}>
                      <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Back-End Gross</div>
                      <div className="text-2xl font-bold text-green-500">
                         <DrillDownValue value="$218,440" label="Back-End Gross" type="Report" onDrillDown={onDrillDown} color="text-green-500" />
                      </div>
                   </div>
                   <div className="bg-panel border border-border p-4 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', {metric: 'Fixed Operations'})}>
                      <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Fixed Ops Gross</div>
                      <div className="text-2xl font-bold text-red-500">
                         <DrillDownValue value="$188,200" label="Fixed Ops Gross" type="Report" onDrillDown={onDrillDown} color="text-red-500" />
                      </div>
                   </div>
                   <div className="bg-panel border border-border p-4 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', {metric: 'Total Net Dealership'})}>
                      <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Total Dealership Net</div>
                      <div className="text-2xl font-bold text-gold">$124,105</div>
                   </div>
               </div>
             </div>

             <div className="bg-charcoal border border-border rounded p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                   <div className="text-text-muted italic mb-2">[Interactive Business Intelligence Graph Rendered Here]</div>
                   <div className="text-xs text-text-dim">Using Live React/Recharts bindings to dynamic SQL views</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const CopilotModal = ({ isOpen, onClose, onDrillDown }) => {
  const [query, setQuery] = useState("");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/80 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-charcoal border border-border rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center border-b border-border px-4 py-3 bg-panel/50">
          <Search className="w-5 h-5 text-gold mr-3" />
          <input 
            autoFocus 
            type="text" 
            placeholder="Ask Copilot or search globally... (e.g. 'Show Yamaha aged over 90 days')" 
            className="w-full bg-transparent text-white text-lg focus:outline-none placeholder-text-muted"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs font-mono text-text-dim border border-border px-2 py-1 rounded ml-3">ESC</div>
        </div>
        
        {query.length > 2 ? (
          <div className="p-4 bg-charcoal">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">AI Copilot Analysis</h3>
            <div className="p-4 bg-panel border-l-4 border-gold rounded text-white text-sm leading-relaxed mb-4">
              <strong>Copilot:</strong> I found 4 Yamaha units currently on floorplan that have aged past 90 days. Their combined floorplan carry cost is currently $48/day. I recommend moving 2 of them to the Slidell location based on their faster turn rate for these specific models.
            </div>
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Matching Results</h3>
            <div className="space-y-2">
              <div onClick={() => {onClose(); onDrillDown('Inventory', {stock: 'H8842', make: 'Yamaha'});}} className="p-3 bg-panel hover:bg-black border border-border rounded cursor-pointer transition-colors flex justify-between items-center text-sm text-white">
                <div className="flex items-center gap-3"><Bike className="w-4 h-4 text-gold"/> <span>2024 Yamaha YZF-R1</span></div>
                <StatusChip status="Aged" color="text-red" />
              </div>
              <div onClick={() => {onClose(); onDrillDown('Inventory', {stock: 'T9021', make: 'Yamaha'});}} className="p-3 bg-panel hover:bg-black border border-border rounded cursor-pointer transition-colors flex justify-between items-center text-sm text-white">
                <div className="flex items-center gap-3"><Bike className="w-4 h-4 text-gold"/> <span>2024 Yamaha MT-09</span></div>
                <StatusChip status="Aged" color="text-red" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-charcoal">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Suggested Queries</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button onClick={() => setQuery("Units to hit next OEM tier")} className="text-left p-3 hover:bg-panel rounded border border-transparent hover:border-border text-sm text-text transition-colors">"Units to hit next OEM tier"</button>
              <button onClick={() => setQuery("Show unassigned internet leads")} className="text-left p-3 hover:bg-panel rounded border border-transparent hover:border-border text-sm text-text transition-colors">"Show unassigned internet leads"</button>
              <button onClick={() => setQuery("Who has lowest F&I penetration?")} className="text-left p-3 hover:bg-panel rounded border border-transparent hover:border-border text-sm text-text transition-colors">"Who has lowest F&I penetration?"</button>
              <button onClick={() => setQuery("Compare Baton Rouge vs Slidell")} className="text-left p-3 hover:bg-panel rounded border border-transparent hover:border-border text-sm text-text transition-colors">"Compare Baton Rouge vs Slidell"</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- APP SHELL --- */

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [drillDown, setDrillDown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState("Friendly Powersports");
  const [activeLocation, setActiveLocation] = useState("All Locations");

  const handleDrillDown = (type, data) => setDrillDown({ type, data });

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!currentUser) {
    return <AuthGate onLogin={setCurrentUser} />;
  }

  const NAV_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Sales", icon: TrendingUp },
    { name: "F&I / Finance", icon: CreditCard },
    { name: "Inventory", icon: Package },
    { name: "Used Bikes / UBD", icon: Bike },
    { name: "Service & Parts", icon: Wrench },
    { name: "Clock In / HR", icon: Clock },
    { name: "Payroll", icon: DollarSign },
    { name: "Marketing", icon: Megaphone },
    { name: "OEM Incentives", icon: Award },
    { name: "Reports", icon: FileBarChart },
    { name: "Employee Hub", icon: UsersIcon },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-charcoal border-r border-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border flex flex-col items-center py-6">
           <img src="https://friendlyyamaha.com/wp-content/uploads/2025/10/new-logo.png" alt="Logo" className="h-6 object-contain mb-2" onError={(e) => { e.target.style.display='none'; }}/>
           <div className="text-gold font-playfair font-bold text-xl tracking-wider">DealerCommand™</div>
           
           <div className="mt-4 w-full">
             <select 
               className="w-full bg-black border border-border rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-gold cursor-pointer"
               value={`${activeCompany}|${activeLocation}`}
               onChange={(e) => {
                 const [comp, loc] = e.target.value.split('|');
                 setActiveCompany(comp);
                 setActiveLocation(loc);
               }}
             >
               <optgroup label="Friendly Powersports">
                 <option value="Friendly Powersports|All Locations">All Locations</option>
                 <option value="Friendly Powersports|Baton Rouge, LA">Baton Rouge, LA</option>
                 <option value="Friendly Powersports|Slidell, LA">Slidell, LA</option>
               </optgroup>
               <optgroup label="Used Bikes Direct">
                 <option value="Used Bikes Direct|All Locations">All Locations</option>
                 <option value="Used Bikes Direct|Baton Rouge, LA">Baton Rouge, LA</option>
                 <option value="Used Bikes Direct|Slidell, LA">Slidell, LA</option>
                 <option value="Used Bikes Direct|Houston, TX">Houston, TX</option>
                 <option value="Used Bikes Direct|Dallas, TX">Dallas, TX</option>
               </optgroup>
             </select>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.name;
            return (
              <button 
                key={item.name} 
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${active ? "bg-panel text-gold border-r-2 border-gold" : "text-text-muted hover:bg-panel hover:text-white"}`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-gold" : "text-text-muted"}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-border bg-panel">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold font-bold border border-gold-dim">
              {currentUser.avatar}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate">{currentUser.name}</div>
              <div className="text-xs text-text-dim truncate">{currentUser.role}</div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("Clock In / HR")}
            className="w-full bg-gold hover:bg-gold-light text-black font-bold py-2 rounded text-sm transition-colors"
          >
            Quick Clock In
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="h-16 bg-charcoal border-b border-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center text-sm font-mono text-text-dim">
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Dashboard')}>Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gold">{activeTab}</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2" />
              <input type="text" placeholder="Search Copilot... (Cmd+K)" className="bg-black border border-border rounded-full py-1.5 pl-9 pr-4 text-sm w-64 focus:outline-none focus:border-gold text-white cursor-pointer" readOnly />
            </div>
            
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-text-muted hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-white border border-charcoal">
                7
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab('Clock In / HR')} className="text-xs bg-panel border border-border px-3 py-1.5 rounded hover:bg-white hover:text-black transition-colors font-bold">+ Clock In</button>
              <button onClick={() => setActiveTab('Sales')} className="text-xs bg-gold hover:bg-gold-light text-black px-3 py-1.5 rounded font-bold transition-colors">+ New Deal</button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE MODULE RENDERER */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "Dashboard" && <DashboardModule onNavigate={setActiveTab} onDrillDown={handleDrillDown} company={activeCompany} location={activeLocation} />}
            {activeTab === "Sales" && <SalesModule onNavigate={setActiveTab} onDrillDown={handleDrillDown} />}
            {activeTab === "F&I / Finance" && <FIModule onDrillDown={handleDrillDown} />}
            {activeTab === "Inventory" && <InventoryModule onDrillDown={handleDrillDown} />}
            {activeTab === "Used Bikes / UBD" && <UsedBikesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Service & Parts" && <ServicePartsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Payroll" && <PayrollModule onDrillDown={handleDrillDown} />}
            {activeTab === "OEM Incentives" && <OEMIncentivesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Marketing" && <MarketingModule onDrillDown={handleDrillDown} />}
            {activeTab === "Reports" && <ReportsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Employee Hub" && <EmployeeHubModule user={currentUser} onDrillDown={handleDrillDown} />}
            {activeTab === "Settings" && <SettingsModule />}
            {activeTab === "Clock In / HR" && <ClockInModule user={currentUser} onDrillDown={handleDrillDown} />}
            {![ "Dashboard", "Sales", "F&I / Finance", "Inventory", "Used Bikes / UBD", "Service & Parts", "Payroll", "OEM Incentives", "Marketing", "Reports", "Employee Hub", "Settings", "Clock In / HR" ].includes(activeTab) && (
              <PlaceholderModule title={`${activeTab} Module`} desc={`Select Dashboard, Sales, or Clock In to see full interactive builds. Or ask the agent to render ${activeTab} fully.`} />
            )}
            
            {/* Footer / simulation text */}
            <div className="mt-12 text-center pb-8">
               <div className="text-gold-dim font-playfair tracking-wide text-sm opacity-50">DealerCommand™ Enterprise</div>
               <div className="text-text-dim text-xs mt-1">Simulating live data feed... {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
      {drillDown && <DrillDownModal item={drillDown} onClose={() => setDrillDown(null)} />}
      <CopilotModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onDrillDown={handleDrillDown} />
    </div>
  );
};

export default App;

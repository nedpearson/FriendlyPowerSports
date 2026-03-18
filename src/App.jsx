import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, CreditCard, Package, Bike, Wrench,
  Clock, DollarSign, Megaphone, Award, FileBarChart, Users as UsersIcon, Settings,
  Bell, Search, ChevronRight, CheckCircle2, ChevronDown, User, Play, Calendar, AlertCircle, Command,
  Briefcase, Users, BrainCircuit, TrendingDown, Database, Filter, Zap, Layout, Grid3X3
} from 'lucide-react';

import {
  getSalesDashboardData, getManagerDashboardData, getFinanceDashboardData, getRetentionDashboardData
} from './data/selectors';

import { KPICard } from './components/ui/KPICard';
import { SectionHeader } from './components/ui/SectionHeader';
import { StatusChip } from './components/ui/StatusChip';
import { TrendBadge } from './components/ui/TrendBadge';
import { AutomatedInsights } from './components/ui/AutomatedInsights';
import { DrillDownValue } from './components/ui/DrillDownValue';
import { DrillDownModal } from './components/ui/DrillDownModal';
import { AgentWidget } from './components/ui/AgentWidget';
import dealerLogo from './assets/logo.png';

// Boot up Super Agent Phase 1 Registry
import './agents/services/index.js';
import { AgentRegistry } from './agents/registry/AgentRegistry';
import { RecommendationService } from './agents/services/RecommendationService';
import { AgentMetrics } from './agents/audit/AgentMetrics';
import { ActionExecutionService } from './agents/services/ActionExecutionService';

import { EMPLOYEES } from './data/mockDatabase';
import { 
  getKpiStats, getLiveLeads, getTopPerformers, getInventoryAging,
  getAlerts, getReconPipeline, getROBoard, getCRMInbox, getCustomer360Data, getPipelineKanban, getAppointmentsTimeline, getPrequalQueue, getManagerOpportunityBoard, getGlobalInventory
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
        <div className="flex justify-center items-center w-full mb-6">
          <img src={dealerLogo} alt="Logo" className="h-14 w-full object-contain mx-auto" onError={(e) => { e.target.style.display='none'; }}/>
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
              // Pass the raw selected role string (Owner, Manager, Employee) alongside the user object
              onLogin({ ...u, systemRole: role });
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
  const [dashboardInsights, setDashboardInsights] = useState([]);

  useEffect(() => {
    // Generate background insights via the Super Agent layer manually on boot
    const seedRecommendations = async () => {
      // Broadcast a manual trigger to awaken all Agents
      await AgentRegistry.broadcastTrigger({ type: 'MANUAL', timestamp: new Date().toISOString() }, { userId: 'EMP-1', role: 'Owner', locationId: 'ALL' });
      
      const rawRecommendations = RecommendationService.fetchPending({ userRole: 'Owner' }).slice(0, 3);
      
      if (rawRecommendations.length > 0) {
        setDashboardInsights(rawRecommendations.map(rec => ({
          type: rec.priority === 'URGENT' ? 'warning' : rec.priority === 'HIGH' ? 'opportunity' : 'action',
          message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
          actionText: "Review Intelligence",
          onAction: () => onDrillDown('AgentRecommendation', { ...rec })
        })));
      } else {
        setDashboardInsights([
          { type: "warning", message: <>Yamaha Q3 Volume Tier: You are <DrillDownValue value="4 units" label="Pipeline Need" type="Report" onDrillDown={onDrillDown} /> away from unlocking the $74,000 retroactive bonus. Tier expires in 6 days.</>, actionText: "View Eligible Pipeline" },
          { type: "opportunity", message: <>Baton Rouge F&I backend is pacing <DrillDownValue value="$315 per unit" label="F&I Margin Delta" type="Report" onDrillDown={onDrillDown} color="text-gold" /> higher than Slidell MTD. Reviewing Rachel Tran's pitch structure with the Slidell team is recommended.</>, actionText: "Compare F&I Scorecards" },
          { type: "action", message: <>There are exactly <DrillDownValue value="8 units" label="Aged Units" type="Inventory" onDrillDown={onDrillDown} /> across both locations aging past 120 days. Current floorplan carry cost for these units is $640/week.</>, actionText: "Review Aged Inventory" }
        ]);
      }
    };
    seedRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Location Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-charcoal p-4 rounded border border-border">
        <div className="flex space-x-2 items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onDrillDown('Report', { name: 'Multi-store Franchise Overview' })}>
           <span className="text-white font-bold"><DrillDownValue value={company || "Friendly Powersports"} label="Company Context" type="Report" onDrillDown={onDrillDown} color="text-white" /></span>
           <span className="text-text-muted px-2">/</span>
           <span className="text-gold"><DrillDownValue value={location || "All Locations"} label="Location Context" type="Report" onDrillDown={onDrillDown} color="text-gold" /></span>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <span className="text-text-dim text-sm flex items-center cursor-pointer hover:text-white transition-colors">
             <DrillDownValue value="MTD: Sep 1 - Sep 18, 2025" label="Date Parameters" type="Action" onDrillDown={onDrillDown} color="text-text-dim hover:text-white" />
          </span>
          <button className="text-gold text-sm border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition-colors" onClick={() => onDrillDown('Action', { name: 'Export Global OS State', message: 'Extracting comprehensive CSV data sheet...' })}>Export Report</button>
        </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={dashboardInsights} />

      <AgentWidget userContext={{ userId: 'EMP-1', role: 'Owner' }} />

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
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase"><DrillDownValue value="Total Gross by Week" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_GROSS} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} onClick={(e) => { if(e) onDrillDown('Report', { name: "Total Gross Details", action: 'View all historical transaction strips' }); }}>
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
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase"><DrillDownValue value="Gross Mix" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
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
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase"><DrillDownValue value="OEM Tier Progress" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
          <div className="flex-1 flex flex-col justify-between">
            {OEM_TIERS.map((tier, i) => (
              <div key={i} className="mb-2 cursor-pointer hover:bg-panel p-1 rounded" onClick={() => onNavigate('OEM Incentives')}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text">{tier.brand}</span>
                  <span className="text-white font-bold">
                    <DrillDownValue value={`${tier.units}/${tier.target} (${tier.bonus})`} label={`${tier.brand} Progress`} type="OEM" onDrillDown={onDrillDown} />
                  </span>
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
            <h4 className="text-white font-bold mb-1">
               <DrillDownValue value={sc.dept} label={`${sc.dept} Capacity`} type="Department" onDrillDown={onDrillDown} />
            </h4>
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
            <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase"><DrillDownValue value="Inventory Aging" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
            <span className="text-xs text-gold"><DrillDownValue value="View All →" label="All Inventory" type="Inventory" onDrillDown={onDrillDown} color="text-gold" /></span>
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
          <div className="mt-4 text-xs font-mono bg-red-900/20 p-2 rounded">
             <DrillDownValue value="$4,840/day floorplan cost on 90+ aged units" label="Floorplan Assessment" type="Financials" onDrillDown={onDrillDown} color="text-red-400" />
          </div>
        </div>

        <div className="bg-charcoal p-4 rounded border border-border cursor-pointer hover:border-gold-dim transition-colors group" onClick={() => onNavigate("Sales")}>
          <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
            <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase group-hover:text-gold transition-colors"><DrillDownValue value="Live Lead Feed" label="Lead Context" type="Report" onDrillDown={onDrillDown} color="inherit" /></h3>
            <span className="text-xs text-gold"><DrillDownValue value="View All →" label="All Leads" type="Lead" onDrillDown={onDrillDown} color="text-gold" /></span>
          </div>
          <div className="space-y-0">
            {getLiveLeads().map((l, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); onDrillDown('Lead', l); }} className="flex justify-between py-3 border-b border-border/50 last:border-0 hover:bg-black -mx-2 px-2 rounded transition-colors cursor-pointer group/lead">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2 group-hover/lead:text-gold transition-colors">
                    {l.name}
                    {l.urgent && <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="text-xs text-text-dim mt-1">
                     <DrillDownValue value={l.source} label={`${l.name} Lead Source`} type="Campaign" onDrillDown={onDrillDown} color="text-text-dim" />
                     <span className="mx-1">·</span> 
                     <DrillDownValue value={l.rep} label={`${l.name} Assigned Rep`} type="Employee" onDrillDown={onDrillDown} color="text-text-dim" />
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <div className={`text-xs font-bold ${l.urgent ? 'text-red-500' : 'text-green-500'}`}>
                    <DrillDownValue value={`${l.time} (${l.status})`} label={`${l.name} Status`} type="Lead" onDrillDown={onDrillDown} color={l.urgent ? 'text-red-500' : 'text-green-500'} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{l.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-charcoal p-4 rounded border border-border">
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase"><DrillDownValue value="Top Performers MTD" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
          <div className="space-y-3">
            {getTopPerformers().map((p, i) => (
              <div key={i} onClick={() => onDrillDown('Employee', p)} className="flex items-center justify-between bg-panel p-3 rounded cursor-pointer hover:border-gold border border-transparent transition-colors group/perf">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center font-bold text-black border border-gold group-hover/perf:bg-gold transition-colors">
                    {i+1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover/perf:text-gold transition-colors">{p.name}</div>
                    <div className="text-xs text-text-dim mt-1"><DrillDownValue value={p.role} label={`${p.name} Title`} type="Employee" onDrillDown={onDrillDown} color="text-text-dim" /></div>
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
          <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase"><DrillDownValue value="Watch List" label="Chart Context" type="Report" onDrillDown={onDrillDown} color="text-text-muted" /></h3>
          <div className="space-y-3">
              <div className="flex items-center justify-between bg-black p-3 rounded border-l-2 border-red-500 cursor-pointer hover:bg-panel transition-colors group/watch" onClick={() => onDrillDown('Employee', {name: 'Devon Arceneaux', role: 'Sales', alert: 'Close rate dropped 12% MTD'})}>
                <div>
                  <div className="text-sm font-bold text-white group-hover/watch:text-gold transition-colors">Devon Arceneaux</div>
                  <div className="text-xs text-text-dim mt-1 flex gap-1">
                     <DrillDownValue value="Sales" label="Devon Title" type="Employee" onDrillDown={onDrillDown} color="text-text-dim" />
                     <span>·</span>
                     <DrillDownValue value="Close rate dropped 12% MTD" label="Performance Alert" type="Employee" onDrillDown={onDrillDown} color="text-red-400" />
                  </div>
                </div>
                <button className="text-xs bg-panel border border-border px-2 py-1 rounded text-white hover:text-gold transition-colors">Review</button>
              </div>
              <div className="flex items-center justify-between bg-black p-3 rounded border-l-2 border-red-500 cursor-pointer hover:bg-panel transition-colors group/watch" onClick={() => onDrillDown('Employee', {name: 'Sam LeBlanc', role: 'Service Tech', alert: 'Efficiency < 75% for 2 weeks'})}>
                <div>
                  <div className="text-sm font-bold text-white group-hover/watch:text-gold transition-colors">Sam LeBlanc</div>
                  <div className="text-xs text-text-dim mt-1 flex gap-1">
                     <DrillDownValue value="Service Tech" label="Sam Title" type="Employee" onDrillDown={onDrillDown} color="text-text-dim" />
                     <span>·</span>
                     <DrillDownValue value="Efficiency < 75% for 2 weeks" label="Efficiency Alert" type="Employee" onDrillDown={onDrillDown} color="text-red-400" />
                  </div>
                </div>
                <button className="text-xs bg-panel border border-border px-2 py-1 rounded text-white hover:text-gold transition-colors">Review</button>
              </div>
          </div>
        </div>
      </div>

      {/* Financial Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Working Capital', value: '$1,240,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide"><DrillDownValue value="WORKING CAPITAL" label="Financial Metric" type="Financials" onDrillDown={onDrillDown} color="text-text-muted" /></div>
          <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$1,240,000" label="Working Capital" type="Financials" onDrillDown={onDrillDown} color="text-white" /></div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Floorplan Balance', value: '$3,847,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide"><DrillDownValue value="FLOORPLAN BAL" label="Financial Metric" type="Financials" onDrillDown={onDrillDown} color="text-text-muted" /></div>
          <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$3,847,000" label="Floorplan Balance" type="Financials" onDrillDown={onDrillDown} color="text-white" /></div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Daily FP Cost', value: '$740/day' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide"><DrillDownValue value="DAILY FP COST" label="Financial Metric" type="Financials" onDrillDown={onDrillDown} color="text-text-muted" /></div>
          <div className="text-lg font-bold text-red-400 mt-1"><DrillDownValue value="$740/day" label="Daily FP Cost" type="Financials" onDrillDown={onDrillDown} color="text-red-400" /></div>
        </div>
        <div className="bg-panel border border-border p-3 rounded text-center border-b-2 border-b-gold cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Proj M-E Gross', value: '$562,000' })}>
          <div className="text-xs text-text-muted font-mono tracking-wide"><DrillDownValue value="PROJ M-E GROSS" label="Financial Metric" type="Financials" onDrillDown={onDrillDown} color="text-text-muted" /></div>
          <div className="text-lg font-bold text-gold mt-1"><DrillDownValue value="$562,000" label="Proj M-E Gross" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></div>
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

  const salesRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_sales_desk').slice(0, 2);
  const salesInsights = salesRecs.length > 0 ? salesRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'opportunity',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "Review Deal",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [
    { type: "warning", message: <>Alex in Baton Rouge has a <DrillDownValue value="12% closing ratio" label="Alex Closing Ratio" type="Employee" onDrillDown={onDrillDown} color="text-red-400" /> on web leads this week (Benchmark: 25%). 8 leads went unresponsive.</>, actionText: "Review Lost Leads" },
    { type: "opportunity", message: <>A deal penciled by Jake for a 2024 MT-07 has <DrillDownValue value="$0 back-end gross" label="Jack Deal Margin" type="Deal" onDrillDown={onDrillDown} />. Adding GAP and Tire/Wheel brings this deal to standard profitability.</>, actionText: "Review Deal Structure" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-white">Sales & Deal Pipeline</h2>
        <div className="flex gap-2">
          <button className="bg-charcoal border border-border px-3 py-1 rounded text-sm text-text-muted hover:text-white" onClick={() => onDrillDown('Action', { name: 'Filter Deals', message: 'Opening advanced filtering modal.' })}>Filter</button>
          <button className="bg-panel border border-border px-4 py-1 rounded text-sm text-white hover:text-gold transition-colors font-bold flex items-center gap-2" onClick={() => onDrillDown('DealSimulator', { msrp: 18500, invoice: 16000, customer: "Pending Structure" })}>AI Simulator</button>
          <button className="bg-gold text-black px-4 py-1 rounded text-sm font-bold shadow-[0_0_10px_rgba(201,168,76,0.2)]" onClick={() => onDrillDown('Agent', { intent: 'Cross-Database Deal Synthesis' })}>Write New Deal</button>
        </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={salesInsights} />

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
                <span className="font-bold text-gold">Recommendation:</span> <DrillDownValue value="PUSH (Finance Maximize)" label="Finance Strategy" type="Deal" onDrillDown={onDrillDown} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FIModule = ({ onDrillDown }) => {
  const fiRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_fi_readiness').slice(0, 1);
  const fiInsights = fiRecs.length > 0 ? fiRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'opportunity',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "Review F&I Structure",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">F&I & Business Office</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2" onClick={() => onDrillDown('Action', { name: 'Run Credit', message: 'Opening secure credit portal...' })}>
           <CreditCard className="w-4 h-4" /> Run Credit
         </button>
      </div>

      {fiInsights.length > 0 && <AutomatedInsights onDrillDown={onDrillDown} insights={fiInsights} />}

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
              <tr onClick={() => onDrillDown('Deal', {customer: 'John Davis', unit: '2024 Talon 1000R', lender: 'Sheffield', reserve: '$450', vsc: '$800', gap: 'No', total: '$1,250'})} className="border-b border-border/50 hover:bg-panel transition-colors cursor-pointer group">
                <td className="px-4 py-3 text-white font-bold group-hover:text-gold transition-colors">John Davis</td>
                <td className="px-4 py-3">2024 Talon 1000R</td>
                <td className="px-4 py-3"><DrillDownValue value="Sheffield" label="Sheffield Bank Profile" type="Lender" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><DrillDownValue value="$450" label="Reserve Split (Sheffield)" type="Financials" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><DrillDownValue value="Yes ($800)" label="VSC Contract Details" type="Financials" onDrillDown={onDrillDown} color="text-green-500 font-bold" /></td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3 text-right font-bold text-gold"><DrillDownValue value="$1,250" label="John Davis Total Backend" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></td>
              </tr>
              <tr onClick={() => onDrillDown('Deal', {customer: 'Emily White', unit: '2023 YZF-R7', lender: 'Octane', reserve: '$320', vsc: '$600', gap: '$400', total: '$1,320'})} className="border-b border-border/50 hover:bg-panel transition-colors cursor-pointer group">
                <td className="px-4 py-3 text-white font-bold group-hover:text-gold transition-colors">Emily White</td>
                <td className="px-4 py-3">2023 YZF-R7</td>
                <td className="px-4 py-3"><DrillDownValue value="Octane" label="Octane Bank Profile" type="Lender" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><DrillDownValue value="$320" label="Reserve Split (Octane)" type="Financials" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><DrillDownValue value="Yes ($600)" label="VSC Contract Details" type="Financials" onDrillDown={onDrillDown} color="text-green-500 font-bold" /></td>
                <td className="px-4 py-3"><DrillDownValue value="Yes ($400)" label="GAP Contract Details" type="Financials" onDrillDown={onDrillDown} color="text-green-500 font-bold" /></td>
                <td className="px-4 py-3 text-right font-bold text-gold"><DrillDownValue value="$1,320" label="Emily White Total Backend" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></td>
              </tr>
              <tr onClick={() => onDrillDown('Deal', {customer: 'Mark Allen', unit: '2024 Rzr Pro R', lender: 'Synchrony', reserve: '$800', vsc: 'No', gap: 'No', total: '$800'})} className="hover:bg-panel transition-colors cursor-pointer group">
                <td className="px-4 py-3 text-white font-bold group-hover:text-gold transition-colors">Mark Allen</td>
                <td className="px-4 py-3">2024 Rzr Pro R</td>
                <td className="px-4 py-3"><DrillDownValue value="Synchrony" label="Synchrony Bank Profile" type="Lender" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><DrillDownValue value="$800" label="Reserve Split (Synchrony)" type="Financials" onDrillDown={onDrillDown} /></td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3"><span className="text-text-muted">No</span></td>
                <td className="px-4 py-3 text-right font-bold text-gold"><DrillDownValue value="$800" label="Mark Allen Total Backend" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InventoryModule = ({ onDrillDown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Active');

  const invRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_inventory_match').slice(0, 2);
  const invInsights = invRecs.length > 0 ? invRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'action',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "Review Match",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [
    { type: "action", message: <>3 Polaris RZRs in Slidell have been in stock for <DrillDownValue value="115 days" label="Slidell Aged RZRs" type="Inventory" onDrillDown={onDrillDown} color="text-amber-500" />. Baton Rouge has turned the same model 4 times in the last 60 days.</>, actionText: "Initiate Transfer" },
    { type: "negative", message: <>Floorplan interest for 'Used Bikes Direct' inventory is currently pacing <DrillDownValue value="14% higher" label="Floorplan Interest Variance" type="Financials" onDrillDown={onDrillDown} color="text-red-400" /> than last month due to aged Harley-Davidson units.</>, actionText: "View Markdown Recommendations" }
  ];

  const allInv = getGlobalInventory();
  
  const filteredInv = allInv.filter(inv => {
    if (filterBrand !== 'All' && inv.brandName !== filterBrand) return false;
    if (filterCondition !== 'All' && inv.condition !== filterCondition) return false;
    if (filterStatus !== 'All' && inv.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inv.stock.toLowerCase().includes(term) ||
        inv.vin.toLowerCase().includes(term) ||
        inv.model.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-playfair text-white">Inventory Intelligence</h2>
        <div className="flex space-x-2">
          <button className="bg-charcoal border border-border text-text px-4 py-2 rounded text-sm" onClick={() => onDrillDown('Action', { name: 'Add Unit', message: 'Opening new inventory intake form...' })}>Add Unit</button>
          <button className="bg-gold text-black px-4 py-2 rounded text-sm font-bold shadow-lg shadow-gold/20" onClick={() => onDrillDown('Action', { name: 'Print Labels', message: 'Generating QR code labels for current view...' })}>Print Labels</button>
        </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={invInsights} />

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
             <div onClick={() => onDrillDown('Report', { category: 'Inventory Brand Mix', brand: 'Honda', units: 187 })} className="bg-red-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '22%'}}>Honda (187)</div>
             <div onClick={() => onDrillDown('Report', { category: 'Inventory Brand Mix', brand: 'Yamaha', units: 164 })} className="bg-blue-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '20%'}}>Yamaha (164)</div>
             <div onClick={() => onDrillDown('Report', { category: 'Inventory Brand Mix', brand: 'Polaris', units: 142 })} className="bg-gray-200 text-black flex items-center justify-center text-xs font-bold transition-all hover:opacity-80 cursor-pointer" style={{width: '17%'}}>Polaris (142)</div>
             <div onClick={() => onDrillDown('Report', { category: 'Inventory Brand Mix', brand: 'Kawasaki', units: 89 })} className="bg-green-600 flex items-center justify-center text-xs font-bold text-white transition-all hover:opacity-80 cursor-pointer" style={{width: '11%'}}>Kawasaki (89)</div>
             <div onClick={() => onDrillDown('Report', { category: 'Inventory Brand Mix', brand: 'Used', units: 220 })} className="bg-panel flex items-center justify-center text-xs font-bold text-white border border-border cursor-pointer hover:opacity-80" style={{width: '30%'}}>Used (220)</div>
           </div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded p-4">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-mono text-text-muted tracking-wide uppercase">Live Inventory Ledger</h3>
           <div className="flex gap-2">
             <button className="bg-black border border-border text-xs px-3 py-1 rounded hover:text-white" onClick={() => onDrillDown('Action', { name: 'Export Inventory', message: 'Exporting ledger to CSV...' })}>Export</button>
           </div>
        </div>
        
        {/* Advanced Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-4 bg-black p-3 rounded border border-border">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search Stock, VIN, or Model..." 
              className="w-full bg-charcoal border border-border rounded pl-9 pr-3 py-1.5 text-sm text-text focus:outline-none focus:border-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-charcoal border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-gold"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="All">All Brands</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Honda">Honda</option>
            <option value="Polaris">Polaris</option>
            <option value="Kawasaki">Kawasaki</option>
          </select>
          <select 
            className="bg-charcoal border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-gold"
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
          >
            <option value="All">All Conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <select 
            className="bg-charcoal border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-gold"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending (Stalls/Deals)</option>
            <option value="Recon">In Recon</option>
            <option value="Inspection">Needs Inspection</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text">
            <thead className="text-xs text-text-muted bg-black font-mono">
              <tr>
                <th className="px-4 py-3 rounded-tl">Stock#</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Loc</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price / Cost</th>
                <th className="px-4 py-3 text-center">Open Deals</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3 rounded-tr text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInv.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-text-muted">No inventory matches these filters.</td>
                </tr>
              ) : (
                filteredInv.map((inv) => (
                  <tr 
                    key={inv.id}
                    onClick={() => onDrillDown('Inventory', { invId: inv.id, stock: inv.stock, unit: `${inv.year} ${inv.model}` })} 
                    className={`border-b border-border/50 hover:bg-panel transition-colors cursor-pointer ${inv.isAged ? 'bg-red-900/10' : ''}`}
                  >
                    <td className={`px-4 py-3 font-mono font-bold ${inv.isAged ? 'text-red-500' : 'text-text-dim'}`}>{inv.stock}</td>
                    <td className="px-4 py-3 text-white">
                      {inv.year} {inv.brandName} {inv.model}
                      <div className="text-xs text-text-muted">{inv.condition} • {inv.category}</div>
                    </td>
                    <td className="px-4 py-3">{inv.locationCode}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${inv.status === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-800' : inv.status === 'Pending' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold">{inv.price ? `$${inv.price.toLocaleString()}` : 'N/A'}</div>
                      <div className="text-xs text-text-muted text-red-400">Cost: ${inv.cost.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.activeDealCount > 0 || inv.activeOppCount > 0 ? (
                        <span className="text-amber-500 font-bold">{inv.activeDealCount + inv.activeOppCount}</span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-bold ${inv.isAged ? 'text-red-400' : 'text-green-500'}`}>{inv.ageDays}</td>
                    <td className="px-4 py-3 text-right">
                      {inv.isAged ? (
                        <button className="text-xs bg-red-900/40 text-red-300 border border-red-800 px-2 py-1 rounded hover:bg-red-800">MARKDOWN</button>
                      ) : (
                        <button className="text-xs bg-panel border border-border px-2 py-1 rounded hover:text-white">VIEW</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2" onClick={() => onDrillDown('Action', { name: 'New Appraisal', message: 'Launching standard UBD evaluation tool...' })}>
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
                  <div onClick={() => onDrillDown('Inventory', {unit: '2021 Yamaha MT-07', cost: '$5,100', spend: '$340', days: 8, tech: 'Sam L.', stage: 'Recon In Progress'})} className="bg-panel rounded border-l-4 border-amber-500 p-3 shadow text-sm mb-3 cursor-pointer hover:border-gold transition-colors group">
                    <div className="font-bold text-white mb-1 group-hover:text-gold transition-colors">2021 Yamaha MT-07</div>
                    <div className="flex justify-between text-xs text-text-muted"><span>Cost: <DrillDownValue value="$5,100" label="Recon Cost Basis" type="Inventory" onDrillDown={onDrillDown} /></span> <span>Spend: <DrillDownValue value="$340" label="Recon Spend" type="Financials" onDrillDown={onDrillDown} /></span></div>
                    <div className="mt-2 text-xs flex justify-between"><span className="text-amber-500"><DrillDownValue value="Day 8" label="Recon Days" type="Inventory" onDrillDown={onDrillDown} color="text-amber-500"/></span> <span><DrillDownValue value="Sam L." label="Tech: Sam L." type="Employee" onDrillDown={onDrillDown} color="text-text-muted group-hover:text-white" /></span></div>
                  </div>
                )}
                {i === 0 && (
                  <div onClick={() => onDrillDown('Inventory', {unit: '2019 Honda Rebel 500', cost: '$3,200', spend: '$0', days: 2, tech: 'Tony G.', stage: 'Acquired / Insp.'})} className="bg-panel rounded border-l-4 border-green-500 p-3 shadow text-sm mb-3 cursor-pointer hover:border-gold transition-colors group">
                    <div className="font-bold text-white mb-1 group-hover:text-gold transition-colors">2019 Honda Rebel 500</div>
                    <div className="flex justify-between text-xs text-text-muted"><span>Cost: <DrillDownValue value="$3,200" label="Recon Cost Basis" type="Inventory" onDrillDown={onDrillDown} /></span> <span>Spend: <DrillDownValue value="$0" label="Recon Spend" type="Financials" onDrillDown={onDrillDown} /></span></div>
                    <div className="mt-2 text-xs flex justify-between"><span className="text-green-500"><DrillDownValue value="Day 2" label="Recon Days" type="Inventory" onDrillDown={onDrillDown} color="text-green-500"/></span> <span><DrillDownValue value="Tony G." label="Tech: Tony G." type="Employee" onDrillDown={onDrillDown} color="text-text-muted group-hover:text-white" /></span></div>
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
  const serviceRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_service_advisor').slice(0, 1);
  const serviceInsights = serviceRecs.length > 0 ? serviceRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'opportunity',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "Review Service Plan",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [
    { type: "opportunity", message: <>Service to Sales AI has identified <DrillDownValue value="12 customers" label="Equity Candidates" type="Report" onDrillDown={onDrillDown} /> with positive equity currently in the active Service bay. Target them before ticket close.</>, actionText: "View Lane Conquests" }
  ];

  const roBoard = getROBoard();

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-blue-500 shadow-inner">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Fixed Operations Control</h1>
              <p className="text-text-muted text-sm border-l-2 border-blue-500 pl-2 ml-1">Service Bays & Parts Inventory Intelligence</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-blue-500 transition-colors" onClick={() => onDrillDown('Action', { name: 'Log Walk-In', message: 'Opening terminal...' })}>
              + Write Repair Order
            </button>
         </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={serviceInsights} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Retention Drilldown' })}>
           <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><UsersIcon className="w-4 h-4"/> Automated Retention</div>
           <div className="text-xl font-bold text-white mb-1"><DrillDownValue value="142 Defectors" label="Retention Risk" type="Report" onDrillDown={onDrillDown}/></div>
           <div className="text-xs text-text-muted mb-2">Saved MTD: <span className="text-green-500 font-bold">18 Customers</span></div>
           <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded">
              AI has queued 142 clients who missed their 12-month service window for automated Twilio outreach.
           </div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer flex flex-col" onClick={() => onDrillDown('Report', { name: 'Tech Efficiency' })}>
           <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Clock className="w-4 h-4"/> Technician Efficiency</div>
           <div className="flex-1 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center bg-black p-1.5 rounded border border-border/50">
                 <span className="text-white">Tony G.</span>
                 <span className="text-green-500 font-bold">104% (42h / 40h)</span>
              </div>
              <div className="flex justify-between items-center bg-black p-1.5 rounded border border-border/50">
                 <span className="text-white">Chris F.</span>
                 <span className="text-gold font-bold">92% (35h / 38h)</span>
              </div>
              <div className="flex justify-between items-center bg-black p-1.5 rounded border border-border/50">
                 <span className="text-white">Sam L.</span>
                 <span className="text-red-500 font-bold">71% (27h / 38h)</span>
              </div>
           </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner">
           <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> Fixed Ops Gross (MTD)</div>
           <div className="text-3xl font-playfair text-white text-center mt-2">
              <DrillDownValue value="$188,200" label="Fixed Ops Pacing" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="flex justify-between text-xs mt-4 px-2">
              <span className="text-text-muted">Labor: <span className="text-white">$89k</span></span>
              <span className="text-text-muted">Parts: <span className="text-white">$99k</span></span>
           </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner border-y-[3px] border-y-blue-500 relative flex flex-col justify-center items-center text-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
            <Package className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Parts Inventory</div>
            <div className="text-2xl font-mono text-gold mb-1"><DrillDownValue value="$412,500" label="Total Parts Value" type="Report" onDrillDown={onDrillDown} /></div>
            <div className="text-[10px] text-text-muted bg-black border border-border px-2 py-1 rounded mt-2">Obsolete (&gt;12mo): <span className="text-red-500">$18k</span></div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded overflow-hidden flex-1 flex flex-col min-h-[500px]">
         <div className="p-4 border-b border-border bg-black flex justify-between items-center">
            <div className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <Grid3X3 className="w-4 h-4 text-gold"/> Live Service Bay Tracker
            </div>
         </div>
         <div className="flex-1 overflow-x-auto overflow-y-hidden subtle-scrollbar p-4">
            <div className="flex gap-4 h-full min-w-max">
               {['Waiting / Write-Up', 'In Bay / Progress', 'Quality Check / Parts Hold', 'Ready for Delivery'].map((statusFilter, idx) => {
                  
                  // Map column names to our mock RO statuses
                  const statusMap = {
                     'Waiting / Write-Up': ['Waiting Parts', 'Scheduled'],
                     'In Bay / Progress': ['In Progress', 'In Bay'],
                     'Quality Check / Parts Hold': ['Quality Check'],
                     'Ready for Delivery': ['Ready for Pickup', 'Completed']
                  };
                  
                  const activeStatuses = statusMap[statusFilter] || [];
                  const colOrders = roBoard.filter(ro => activeStatuses.includes(ro.status));
                  
                  return (
                     <div key={statusFilter} className="w-80 flex flex-col bg-black border border-border rounded shadow-md shrink-0 h-full overflow-hidden">
                        <div className="p-3 border-b border-border bg-panel flex justify-between items-center">
                           <div className="font-bold text-white text-xs uppercase tracking-wide">{statusFilter}</div>
                           <div className="bg-charcoal px-2 py-0.5 rounded text-xs font-mono text-text-muted border border-border">{colOrders.length}</div>
                        </div>
                        <div className="p-3 flex-1 overflow-y-auto subtle-scrollbar space-y-3 bg-gradient-to-b from-transparent to-black/20">
                           {colOrders.map(ro => (
                              <div key={ro.id} className="bg-charcoal border border-border p-3 rounded shadow hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => onDrillDown('RO', ro)}>
                                 <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-1">{ro.unitDesc}</div>
                                 </div>
                                 <div className="text-xs text-text-muted mb-3 flex items-center justify-between">
                                    <span className="font-mono text-gold tracking-widest">{ro.id}</span>
                                    <span className="bg-panel px-1.5 py-0.5 rounded border border-border">{ro.type}</span>
                                 </div>
                                 <div className="flex justify-between items-center bg-black rounded p-2 mt-2 border border-border/50">
                                    <div className="text-[10px] text-text-dim flex items-center gap-1">
                                       <User className="w-3 h-3 text-blue-500" />
                                       {ro.techName}
                                    </div>
                                    <div className="text-[10px] font-mono font-bold text-green-500">
                                       ${((ro.partsSale||0) + ((ro.laborHoursSold||0) * 125)).toLocaleString()}
                                    </div>
                                 </div>
                              </div>
                           ))}
                           {colOrders.length === 0 && <div className="text-center text-text-muted mt-6 font-mono text-xs uppercase tracking-widest opacity-50">Empty Lane</div>}
                        </div>
                     </div>
                  );
               })}
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
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold" onClick={() => onDrillDown('Action', { name: 'Approve Payroll', message: 'Finalizing current period payroll register...' })}>
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
                  <td className="px-4 py-3 text-right"><DrillDownValue value={row[3]} label={`${row[0]} Regular Hrs`} type="Employee" onDrillDown={onDrillDown} /></td>
                  <td className="px-4 py-3 text-right text-red-500"><DrillDownValue value={row[4]} label={`${row[0]} OT Hrs`} type="Employee" onDrillDown={onDrillDown} color="text-red-500" /></td>
                  <td className="px-4 py-3 text-right text-green-500"><DrillDownValue value={row[5]} label={`${row[0]} Commission`} type="Employee" onDrillDown={onDrillDown} color="text-green-500" /></td>
                  <td className="px-4 py-3 text-right font-bold text-gold"><DrillDownValue value={row[6]} label={`${row[0]} Total Net`} type="Financials" onDrillDown={onDrillDown} color="text-gold" /></td>
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
                <DrillDownValue value={`${oem.current} / ${oem.target}`} label={`${oem.brand} Unit Progress`} type="OEM" onDrillDown={onDrillDown} color="text-white" />
                <DrillDownValue value={oem.bonus} label={`${oem.brand} Bonus Tier`} type="Financials" onDrillDown={onDrillDown} color="font-bold text-gold text-xl" />
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
                   <span>Spend: <DrillDownValue value={c.spend} label={`${c.name} Spend`} type="Financials" onDrillDown={onDrillDown} color="text-white" /></span>
                   <span>Leads: <DrillDownValue value={c.leads} label={`${c.name} Leads`} type="Campaign" onDrillDown={onDrillDown} color="text-white" /></span>
                   <span>Sold: <DrillDownValue value={c.sold} label={`${c.name} Sold Units`} type="Campaign" onDrillDown={onDrillDown} color="text-white" /></span>
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
               <div className="text-3xl font-bold text-white mb-1"><DrillDownValue value="#2" label="Store Rank" type="Employee" onDrillDown={onDrillDown} /></div>
               <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Store Rank</div>
             </div>
             <div className="bg-black p-4 rounded border border-border border-b-2 border-b-gold text-center min-w-[120px]">
               <div className="text-3xl font-bold text-gold mb-1"><DrillDownValue value="18" label="Units MTD" type="Employee" onDrillDown={onDrillDown} color="text-gold" /></div>
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
             <button className="w-full bg-panel border border-border hover:bg-black hover:border-gold transition-colors text-white py-2 rounded text-sm font-bold" onClick={() => onDrillDown('Action', { name: 'View Commission Statement', message: 'Pulling real-time commission payout records...' })}>View Commission Statement</button>
           </div>
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

const SettingsModule = ({ onDrillDown }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
         <h1 className="text-3xl font-playfair text-white flex items-center gap-3">
           <Settings className="w-8 h-8 text-gold" /> Enterprise Configuration & Rules
         </h1>
         <button className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-gold/20 flex items-center gap-2" onClick={() => onDrillDown('Action', { name: 'Save Global Policy', message: 'Applying enterprise configuration changes...' })}>
            <CheckCircle2 className="w-4 h-4" /> Save Global Policy
         </button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal p-6 rounded border border-border">
             <h2 className="text-xl font-bold text-white mb-4 border-b border-border pb-2">Deal Approval Thresholds</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><TrendingDown className="w-4 h-4 text-amber-500"/> <DrillDownValue value="Margin Floor Override" label="Enterprise Rule Audit" type="RuleAudit" onDrillDown={onDrillDown} color="text-white" /></div>
                      <div className="text-xs text-text-muted">Deals below this <DrillDownValue value="%" label="Margin Floor Explanation" type="Settings" onDrillDown={onDrillDown} color="text-text-muted hover:text-white" /> require GM pin</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <DrillDownValue value="12" label="Margin Override Threshold" type="Settings" onDrillDown={onDrillDown} color="text-white font-bold" />
                     <span className="text-text-muted text-sm">%</span>
                   </div>
                </div>
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-red-500"/> <DrillDownValue value="Max Allowed Discount ($)" label="Enterprise Rule Audit" type="RuleAudit" onDrillDown={onDrillDown} color="text-white" /></div>
                      <div className="text-xs text-text-muted">Hard cap on rep discounting without approval</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-text-muted text-sm">$</span>
                     <span className="text-white font-bold"><DrillDownValue value="500" label="Max Discount Cap" type="Settings" onDrillDown={onDrillDown} color="text-white" /></span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-charcoal p-6 rounded border border-border">
             <h2 className="text-xl font-bold text-white mb-4 border-b border-border pb-2">Inventory Aging Actions</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500"/> <DrillDownValue value="Warning Threshold" label="Enterprise Rule Audit" type="RuleAudit" onDrillDown={onDrillDown} color="text-white" /></div>
                      <div className="text-xs text-text-muted">Triggers dashboard alerts and copilot suggestions</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-white font-bold"><DrillDownValue value="90" label="Aging Warning Flag" type="Settings" onDrillDown={onDrillDown} color="text-white" /></span>
                     <span className="text-text-muted text-sm">Days</span>
                   </div>
                </div>
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500"/> <DrillDownValue value="Critical Flag" label="Enterprise Rule Audit" type="RuleAudit" onDrillDown={onDrillDown} color="text-white" /></div>
                      <div className="text-xs text-text-muted">Pushes automated markdown request to GM</div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-white font-bold"><DrillDownValue value="120" label="Aging Critical Flag" type="Settings" onDrillDown={onDrillDown} color="text-white" /></span>
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
            <button className="bg-charcoal hover:bg-black text-white font-bold py-2 px-4 rounded border border-border transition-colors" onClick={() => onDrillDown('Action', { name: 'Schedule Report', message: 'Opening report scheduler...' })}>
               Schedule Report
            </button>
            <button className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-gold/20 flex items-center gap-2" onClick={() => onDrillDown('Action', { name: 'Create Custom Query', message: 'Opening advanced query builder...' })}>
               + Create Custom Query
            </button>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
             <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Saved Views</div>
             <button className="w-full text-left p-3 rounded bg-panel border-l-2 border-gold text-white font-bold text-sm" onClick={() => onDrillDown('Report', { name: 'Month-End Executive Summary' })}>Month-End Executive Summary</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm" onClick={() => onDrillDown('Report', { name: 'Aged Inventory Liability (90+)' })}>Aged Inventory Liability (90+)</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm" onClick={() => onDrillDown('Report', { name: 'F&I Penetration by Product' })}>F&I Penetration by Product</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm" onClick={() => onDrillDown('Report', { name: 'Service Tech Efficiency YTD' })}>Service Tech Efficiency YTD</button>
             <button className="w-full text-left p-3 rounded hover:bg-charcoal text-text-muted hover:text-white transition-colors text-sm" onClick={() => onDrillDown('Report', { name: 'Lost Marketing Leads' })}>Lost Marketing Leads</button>
          </div>
          
          <div className="md:col-span-3 space-y-6">
             <div className="bg-charcoal border border-border rounded p-6">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-playfair text-white">Month-End Executive Summary</h2>
                    <div className="text-sm text-text-muted">Generated by Dealership OS AI Copilot • 2 mins ago</div>
                 </div>
                 <button className="text-gold text-sm border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition-colors" onClick={() => onDrillDown('Action', { name: 'Export PDF', message: 'Generating high-res PDF summary...' })}>Export PDF</button>
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

class CRMErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900 border border-red-500 rounded text-left">
           <h2 className="text-white font-bold text-xl mb-4">CRM Module Crashed</h2>
           <pre className="text-red-200 text-xs font-mono whitespace-pre-wrap">{this.state.error?.toString()}</pre>
           <pre className="text-red-300 text-[10px] font-mono whitespace-pre-wrap mt-4">{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const CustomerCRMModuleInner = ({ onDrillDown, user }) => {
  const [activeView, setActiveView] = useState('Inbox'); // 'Inbox', 'Pipeline', 'Appointments', 'Finance'
  const [filter, setFilter] = useState('All');
  
  const userRole = user?.role || user?.systemRole;
  const isManager = userRole !== 'Sales Associate';

  const inbox = getCRMInbox(user?.id, userRole);
  const pipeline = getPipelineKanban(user?.id, userRole);
  const appointments = getAppointmentsTimeline();
  const prequalQueue = isManager ? getPrequalQueue(userRole) : [];
  const oppBoard = isManager ? getManagerOpportunityBoard() : { neglected: [], reactivation: [], stalled: [] };

  const displayLeads = inbox.filter(l => filter === 'All' || l.status === filter);

  const crmRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_lead_response' || r.agentId === 'ag_sales_desk').slice(0, 2);
  const crmInsights = crmRecs.length > 0 ? crmRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'action',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "View CRM Action",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex gap-4">
            <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'Inbox' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('Inbox')}><UsersIcon className="w-5 h-5"/> Lead Inbox</button>
            <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'Pipeline' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('Pipeline')}><LayoutDashboard className="w-5 h-5"/> Deal Pipeline</button>
            <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'Appointments' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('Appointments')}><Calendar className="w-5 h-5"/> Showroom Tracker</button>
            {isManager && (
              <>
                 <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'Finance' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('Finance')}><Database className="w-5 h-5"/> Finance Desk (Manager)</button>
                 <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'OpportunityBoard' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('OpportunityBoard')}><Briefcase className="w-5 h-5"/> Opportunity Board</button>
              </>
            )}
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: 'Log Walk-In', message: 'Opening up terminal...' })}>
              + Log Walk-In
            </button>
            <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors" onClick={() => onDrillDown('Action', { name: 'Run Equity Scan', message: 'Scanning service appointments for trade targets...' })}>
              <Search className="w-4 h-4" /> Run AI Equity Scan
            </button>
         </div>
      </div>

      {crmInsights.length > 0 && <AutomatedInsights onDrillDown={onDrillDown} insights={crmInsights} />}

      {activeView === 'Inbox' && (
         <div className="bg-charcoal border border-border rounded overflow-hidden flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border bg-black">
               <div className="text-sm font-bold text-white uppercase tracking-widest"><Clock className="w-4 h-4 inline-block mr-2 text-gold"/> SLA Queue Management</div>
               <select className="bg-charcoal border border-border text-white px-3 py-1.5 rounded text-sm focus:border-gold outline-none cursor-pointer" value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="All">All Active Leads</option>
                  <option value="New">New / Unclaimed</option>
                  <option value="Unresponded">Unresponded (SLA Risk)</option>
                  <option value="In Progress">Working</option>
               </select>
            </div>
            
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-mono text-text-muted uppercase tracking-wider bg-panel">
               <div className="col-span-3">Customer</div>
               <div className="col-span-2">AI Score & NBA</div>
               <div className="col-span-2">Interest Context</div>
               <div className="col-span-2">Assigned Owner</div>
               <div className="col-span-2">Status & SLA Timer</div>
               <div className="col-span-1 text-right">Action</div>
            </div>
            
            <div className="divide-y divide-border overflow-y-auto subtle-scrollbar flex-1 relative min-h-[500px]">
               {displayLeads.length === 0 && (
                 <div className="p-8 text-center text-text-muted">No leads match the current filter.</div>
               )}
               {displayLeads.map((l, i) => (
                 <div key={i} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-panel transition-colors cursor-pointer ${l.isUrgent ? 'border-l-4 border-l-red-500 bg-red-900/10' : 'border-l-4 border-l-transparent hover:border-l-gold'}`} onClick={() => onDrillDown('CRM_Customer360', { customerId: l.customerId })}>
                    <div className="col-span-3">
                       <div className="font-bold text-white text-sm flex items-center gap-2">
                         {l.customerName}
                         {l.isUrgent && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">SLA Overdue</span>}
                       </div>
                       <div className="flex gap-1 mt-1 flex-wrap">
                         {l.customerTags.map(t => <span key={t.id} className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider ${t.color}`}>{t.name}</span>)}
                       </div>
                    </div>
                    <div className="col-span-2">
                       <div className="flex items-center gap-2 mb-1">
                          <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${l.aiScore > 75 ? 'bg-green-900/30 text-green-500' : l.aiScore > 50 ? 'bg-blue-900/30 text-blue-400' : 'bg-amber-900/30 text-amber-500'}`}>
                             <DrillDownValue value={l.aiScore} label="AI Confidence Scoring" type="AIScoreAnalysis" onDrillDown={onDrillDown} color={l.aiScore > 75 ? 'text-green-500' : l.aiScore > 50 ? 'text-blue-400' : 'text-amber-500'} />
                          </div>
                          <span className="text-[10px] text-text-muted truncate" title={l.scoreReason}>{l.scoreReason}</span>
                       </div>
                       <div className="text-[10px] text-gold truncate flex items-center gap-1" title={l.nextAction?.message}><BrainCircuit className="w-3 h-3"/> {l.nextAction?.action}</div>
                    </div>
                    <div className="col-span-2 text-sm text-text-muted">
                       <DrillDownValue value={l.expectedTradeACV ? "Trade-In Pending" : "Purchase Unit"} label="Interest Type" type="Inventory" onDrillDown={onDrillDown} /> 
                       <div className="text-[10px] text-text-dim mt-1">{l.sourceId}</div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-black border border-border flex items-center justify-center text-[10px] text-gold font-bold">
                          {l.assignedRep.charAt(0)}
                       </div>
                       <span className="text-sm text-white">{l.assignedRep}</span>
                    </div>
                    <div className="col-span-2">
                       <div className={`text-xs font-bold ${l.status === 'Unresponded' ? (l.isUrgent ? 'text-red-500' : 'text-amber-500') : 'text-green-500'}`}>
                          {l.status}
                       </div>
                       <div className="text-[10px] text-text-dim mt-0.5 font-mono">
                          {l.timeSinceCreation < 60 ? `${l.timeSinceCreation}m ago` : `${Math.floor(l.timeSinceCreation/60)}h ${l.timeSinceCreation%60}m ago`}
                       </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                       <button className="text-gold hover:text-white transition-colors bg-black p-2 rounded border border-border hover:border-gold group" onClick={(e) => { e.stopPropagation(); onDrillDown('CRM_Customer360', { customerId: l.customerId }); }}>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      )}

      {activeView === 'Pipeline' && (
         <div className="flex-1 overflow-x-auto overflow-y-hidden subtle-scrollbar pb-4 min-h-[600px]">
            <div className="flex gap-4 h-full min-w-max">
               {pipeline.map(col => (
                 <div key={col.id} className="w-80 flex flex-col bg-charcoal border border-border rounded shadow-md shrink-0 h-full overflow-hidden">
                    <div className="p-3 border-b border-border flex justify-between items-center bg-black/40">
                       <div className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                          {col.id === 'New' && <AlertCircle className="w-4 h-4 text-amber-500"/>}
                          {col.id === 'Appt' && <Calendar className="w-4 h-4 text-blue-500"/>}
                          {col.id === 'Finance' && <DollarSign className="w-4 h-4 text-green-500"/>}
                          {col.id === 'Sold' && <Award className="w-4 h-4 text-gold"/>}
                          <DrillDownValue value={col.title} label={`${col.title} Pipeline Velocity`} type="StageVelocity" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" />
                       </div>
                       <div className="bg-panel px-2 py-0.5 rounded text-xs font-mono text-text-muted border border-border">{col.count}</div>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto subtle-scrollbar space-y-3">
                       {col.items.map(opp => (
                         <div key={opp.id} className="bg-black border border-border p-3 rounded shadow hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('CRM_Customer360', { customerId: opp.customerId })}>
                            <div className="flex justify-between items-start mb-2">
                               <div className="font-bold text-white text-sm group-hover:text-gold transition-colors">{opp.customerName}</div>
                               {opp.probPct > 70 && <span className="bg-green-900/30 text-green-500 text-[9px] px-1.5 py-0.5 rounded font-bold">{opp.probPct}% P<span className="hidden sm:inline">rob</span></span>}
                            </div>
                            <div className="text-xs text-text-muted mb-2 line-clamp-1 truncate">{opp.source}</div>
                            
                            <div className="flex justify-between items-center bg-panel rounded p-2 mt-3">
                               <div className="flex -space-x-1">
                                  <div className="w-6 h-6 rounded-full bg-charcoal border border-border flex items-center justify-center text-[9px] text-white" title={opp.repName}>{opp.repName.charAt(0)}</div>
                               </div>
                               {opp.isStalled && <span className="text-[9px] uppercase tracking-widest text-red-500 font-bold bg-black px-1.5 py-0.5 rounded border border-red-500/30">Stalled</span>}
                            </div>
                         </div>
                       ))}
                       {col.items.length === 0 && (
                         <div className="h-24 border-2 border-dashed border-border rounded flex items-center justify-center text-xs text-text-muted font-mono uppercase tracking-widest">Drop here</div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      )}

      {activeView === 'Appointments' && (
         <div className="bg-charcoal border border-border rounded overflow-hidden flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border bg-black">
               <div className="text-sm font-bold text-white uppercase tracking-widest"><Calendar className="w-4 h-4 inline-block mr-2 text-blue-500"/> Today's Showroom Traffic Log</div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto subtle-scrollbar min-h-[500px]">
               {appointments.map(a => (
                  <div key={a.id} className="bg-black border-l-4 border-l-blue-500 border-y border-r border-y-border border-r-border p-4 rounded-r shadow-md hover:border-y-gold transition-colors cursor-pointer" onClick={() => onDrillDown('CRM_Customer360', { customerId: a.customerId })}>
                     <div className="flex justify-between items-start mb-4 border-b border-border pb-3">
                        <div>
                           <div className="font-bold text-white text-lg">{a.customerName}</div>
                           <div className="text-xs text-text-muted uppercase tracking-widest font-mono mt-1">{a.type}</div>
                        </div>
                        <div className="bg-panel px-3 py-1 rounded border border-border text-center">
                           <div className="text-[10px] text-text-muted uppercase">ETA</div>
                           <div className="text-gold font-bold text-sm">{new Date(a.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                           <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Assigned To</div>
                           <div className="text-sm text-white flex items-center gap-2"><User className="w-3 h-3"/> {a.repName}</div>
                        </div>
                        <div>
                           <StatusChip status={a.status} color={a.status === 'Pending' ? 'text-amber' : a.status === 'Showed' ? 'text-green' : 'text-red'} />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
      {activeView === 'Finance' && isManager && (
         <div className="bg-charcoal border border-border rounded overflow-hidden flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border bg-black">
               <div className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4 text-green-500"/> Active Prequalification Queue</div>
            </div>
            
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-mono text-text-muted uppercase tracking-wider bg-panel">
               <div className="col-span-3">Applicant</div>
               <div className="col-span-2">Status</div>
               <div className="col-span-2">Credit Tier</div>
               <div className="col-span-2">Approval Limit</div>
               <div className="col-span-3">Compliance & Audit</div>
            </div>
            
            <div className="divide-y divide-border overflow-y-auto subtle-scrollbar flex-1 relative min-h-[500px]">
               {prequalQueue.length === 0 && (
                 <div className="p-8 text-center text-text-muted">No applications in queue.</div>
               )}
               {prequalQueue.map(app => (
                 <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-panel transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-gold" onClick={() => onDrillDown('Finance_Prequal', { customerId: app.customerId })}>
                    <div className="col-span-3">
                       <div className="font-bold text-white text-sm">{app.customerName}</div>
                       <div className="text-xs text-text-muted mt-1">{app.customerPhone}</div>
                    </div>
                    <div className="col-span-2">
                       <div className={`text-xs font-bold uppercase tracking-wider ${app.decision === 'Pre-Approved' ? 'text-green-500' : app.decision === 'Declined' ? 'text-red-500' : 'text-amber-500'}`}>{app.decision}</div>
                    </div>
                    <div className="col-span-2">
                       <div className="text-white font-bold">{app.tier}</div>
                       <div className="text-[10px] text-text-muted font-mono bg-black px-1.5 py-0.5 rounded inline-block mt-1 border border-border">{app.scoreBand}</div>
                    </div>
                    <div className="col-span-2">
                       <div className="text-gold font-bold text-sm">${app.maxAmount.toLocaleString()}</div>
                       <div className="text-[10px] text-text-muted">Est APR: {app.assignedAPR}%</div>
                    </div>
                    <div className="col-span-3 space-y-1">
                       {app.isFraudFlagged && <div className="text-[9px] text-red-500 uppercase flex items-center gap-1 border border-red-500 bg-red-900/10 px-1 py-0.5 rounded w-max"><AlertCircle className="w-3 h-3"/> Fraud Review</div>}
                       {app.needsAdverseAction && <div className="text-[9px] text-amber-500 uppercase flex items-center gap-1 border border-amber-500 bg-amber-900/10 px-1 py-0.5 rounded w-max"><AlertCircle className="w-3 h-3"/> Adverse Action Req</div>}
                       {app.hasConsent ? (
                          <div className="text-[9px] text-green-500 uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Consent Captured</div>
                       ) : (
                          <div className="text-[9px] text-text-dim uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3"/> No Consent Record</div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      )}

      {activeView === 'OpportunityBoard' && isManager && (
         <div className="flex-1 overflow-x-auto overflow-y-hidden subtle-scrollbar pb-4 min-h-[600px]">
            <div className="flex gap-6 h-full min-w-max">
               
               {/* Neglected Leads Column */}
               <div className="w-96 flex flex-col bg-charcoal border border-border rounded shadow-md shrink-0 h-full overflow-hidden">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-black/40">
                     <div className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500"/> Neglected Hot Leads
                     </div>
                     <div className="bg-red-900/30 text-red-500 px-2 py-0.5 rounded text-xs font-mono font-bold">{oppBoard.neglected.length}</div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto subtle-scrollbar space-y-4">
                     {oppBoard.neglected.map(l => (
                        <div key={l.id} className="bg-black border border-red-900/50 p-4 rounded shadow hover:border-red-500 transition-colors cursor-pointer" onClick={() => onDrillDown('CRM_Customer360', { customerId: l.customerId })}>
                           <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-white text-md">{l.customerName}</div>
                              <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Uncontacted</span>
                           </div>
                           <div className="text-xs text-text-muted mb-3 flex items-center gap-2"><User className="w-3 h-3"/> Assigned to {l.repName}</div>
                           <div className="bg-red-900/10 border border-red-900/30 p-2 rounded text-xs text-red-400 font-mono">
                              <BrainCircuit className="w-3 h-3 inline mr-1"/> {l.friction}
                           </div>
                           <button className="w-full mt-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 py-1.5 rounded text-xs font-bold transition-colors">Reassign Lead</button>
                        </div>
                     ))}
                     {oppBoard.neglected.length === 0 && <div className="text-center text-text-muted mt-10">No neglected leads detected.</div>}
                  </div>
               </div>

               {/* Stalled Deals Column */}
               <div className="w-96 flex flex-col bg-charcoal border border-border rounded shadow-md shrink-0 h-full overflow-hidden">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-black/40">
                     <div className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500"/> Stalled Opportunities
                     </div>
                     <div className="bg-amber-900/30 text-amber-500 px-2 py-0.5 rounded text-xs font-mono font-bold">{oppBoard.stalled.length}</div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto subtle-scrollbar space-y-4">
                     {oppBoard.stalled.map(o => (
                        <div key={o.id} className="bg-black border border-amber-900/50 p-4 rounded shadow hover:border-amber-500 transition-colors cursor-pointer" onClick={() => onDrillDown('CRM_Customer360', { customerId: o.customerId })}>
                           <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-white text-md">{o.customerName}</div>
                              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold bg-amber-900/20 px-1 py-0.5 rounded">{o.probPct}% Prob</span>
                           </div>
                           <div className="text-xs text-text-muted mb-3 flex items-center gap-2"><User className="w-3 h-3"/> {o.repName}</div>
                           <div className="bg-amber-900/10 border border-amber-900/30 p-2 rounded text-xs text-amber-400 flex items-start gap-2">
                              <TrendingDown className="w-3 h-3 shrink-0 mt-0.5"/> 
                              <div>
                                 <div className="font-bold">{o.friction}</div>
                                 <div className="text-[10px] mt-0.5 text-amber-500/70">Probability dropping due to inactivity.</div>
                              </div>
                           </div>
                        </div>
                     ))}
                     {oppBoard.stalled.length === 0 && <div className="text-center text-text-muted mt-10">No stalled deals detected.</div>}
                  </div>
               </div>

               {/* Reactivation Column */}
               <div className="w-96 flex flex-col bg-charcoal border border-border rounded shadow-md shrink-0 h-full overflow-hidden">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-black/40">
                     <div className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500"/> Lost/Aged Reactivation
                     </div>
                     <div className="bg-green-900/30 text-green-500 px-2 py-0.5 rounded text-xs font-mono font-bold">{oppBoard.reactivation.length}</div>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto subtle-scrollbar space-y-4">
                     {oppBoard.reactivation.map(l => (
                        <div key={l.id} className="bg-black border border-green-900/50 p-4 rounded shadow hover:border-green-500 transition-colors cursor-pointer" onClick={() => onDrillDown('CRM_Customer360', { customerId: l.customerId })}>
                           <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-white text-md">{l.customerName}</div>
                              <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono line-clamp-1 ml-2">{l.sourceId}</span>
                           </div>
                           <div className="bg-green-900/10 border border-green-900/30 p-2 rounded text-xs text-green-400 mt-3 flex items-start gap-2">
                              <Megaphone className="w-3 h-3 shrink-0 mt-0.5"/>
                              <div>
                                 <div className="font-bold">Suggested AI Campaign:</div>
                                 <div className="text-[10px] mt-0.5">{l.reactivateReason}</div>
                              </div>
                           </div>
                           <button className="w-full mt-3 bg-green-900/20 hover:bg-green-900/40 text-green-400 py-1.5 rounded text-xs font-bold transition-colors">Queue Nurture Sequence</button>
                        </div>
                     ))}
                     {oppBoard.reactivation.length === 0 && <div className="text-center text-text-muted mt-10">No reactivation targets found.</div>}
                  </div>
               </div>

            </div>
         </div>
      )}
    </div>
  );
};

const CustomerCRMModule = (props) => (
  <CRMErrorBoundary>
     <CustomerCRMModuleInner {...props} />
  </CRMErrorBoundary>
);

const GlobalFilterBar = () => {
  return (
    <div className="bg-charcoal border border-border p-4 rounded mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 text-text-muted font-bold tracking-widest text-xs uppercase mr-4">
        <Filter className="w-4 h-4 text-gold"/> Global Filters
      </div>
      <select className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"><option>All Locations</option><option>Baton Rouge</option><option>Slidell</option></select>
      <select className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"><option>All Reps</option><option>Jake Fontenot</option><option>Marcus Broussard</option></select>
      <select className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"><option>MTD (Month to Date)</option><option>Today</option><option>Last 7 Days</option></select>
      <select className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"><option>All Sources</option><option>Website Forms</option><option>Walk-ins</option></select>
      <button className="text-xs text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded transition-colors ml-auto">+ Add Filter</button>
    </div>
  );
};

/* --- MOCK DATA FOR OPERATIONAL DASHBOARDS --- */
const SALES_FUNNEL_DATA = [
  { name: 'Leads', value: 412, fill: '#3a3a3a' },
  { name: 'Contacted', value: 308, fill: '#5a5550' },
  { name: 'Appts Set', value: 145, fill: '#c9a84c' },
  { name: 'Shows', value: 98, fill: '#e8c96a' },
  { name: 'Sold', value: 42, fill: '#22c55e' }
];

const FINANCE_MIX = [
  { name: 'Approved', value: 65, color: '#22c55e' },
  { name: 'Conditions', value: 20, color: '#eab308' },
  { name: 'Declined', value: 15, color: '#ef4444' }
];

const RETENTION_TREND = [
  { month: 'W1', reactivation: 12, loyalty: 5 },
  { month: 'W2', reactivation: 15, loyalty: 8 },
  { month: 'W3', reactivation: 10, loyalty: 12 },
  { month: 'W4', reactivation: 22, loyalty: 15 }
];

const OperationalDashboardsModule = ({ onDrillDown, onNavigate, userRole, company, location }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const renderContent = () => {
    if (activeTab === 'Overview') {
       return (
         <div className="space-y-6">
           <div className="flex gap-4 overflow-x-auto subtle-scrollbar pb-2">
             <div className="bg-charcoal border-l-4 border-l-red-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-red-500 transition-colors cursor-pointer group" onClick={() => onNavigate('AI Command Center')}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-red-500 transition-colors"><span>Urgent Items</span> <Command className="w-3 h-3 text-red-500"/></div>
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-[10px] text-text-dim">Action Required Now</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-amber-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-amber-500 transition-colors cursor-pointer group" onClick={() => onNavigate('AI Command Center')}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-amber-500 transition-colors"><span>Stalled Opps</span> <TrendingDown className="w-3 h-3 text-amber-500"/></div>
                <div className="text-2xl font-bold text-white mb-1">24</div>
                <div className="text-[10px] text-text-dim">Pipeline Risk</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-green-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-green-500 transition-colors cursor-pointer group" onClick={() => onNavigate('AI Command Center')}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-green-500 transition-colors"><span>Hot Leads</span> <TrendingUp className="w-3 h-3 text-green-500"/></div>
                <div className="text-2xl font-bold text-white mb-1">8</div>
                <div className="text-[10px] text-text-dim">Assign & Call</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-blue-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-blue-500 transition-colors cursor-pointer group" onClick={() => onNavigate('AI Command Center')}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-blue-500 transition-colors"><span>F&I Blockers</span> <CreditCard className="w-3 h-3 text-blue-500"/></div>
                <div className="text-2xl font-bold text-white mb-1">5</div>
                <div className="text-[10px] text-text-dim">Pending Docs/Stips</div>
             </div>
           </div>
           <DashboardModule onDrillDown={onDrillDown} company={company} location={location} />
         </div>
       );
    }
    if (activeTab === 'Sales') {
      const db = getSalesDashboardData();
      return (
        <div className="space-y-6">
          <AutomatedInsights onDrillDown={onDrillDown} insights={[
             { type: "opportunity", message: <>Internet lead conversion is trending <span className="text-green-500 font-bold">12% higher</span> than the rolling 30-day average. Sales velocity is excellent.</>, actionText: "View Conversion Funnel", data: { name: 'Lead Conversion Records', records: db.newLeadsData } },
             { type: "warning", message: <>There are exactly <DrillDownValue value={db.overdueTasks.toString()} label="Overdue SLA Tasks" type="Report" onDrillDown={onDrillDown} data={{ name: 'SLA Exceptions', records: db.overdueTasksData }} color="text-red-500" /> overdue tasks in the Global Inbox. SLAs are breached.</>, actionText: "Go to Inbox", data: { name: 'Escalation Records', records: db.overdueTasksData } }
          ]} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <KPICard title="Total Prequals" value={db.prequalsStarted.toString()} onDrillDown={() => onDrillDown('Report', { name: "Finance Activity", records: db.prequalsData })} type="Report" />
             <KPICard title="Quotes Desked" value={db.quotesSent.toString()} onDrillDown={() => onDrillDown('Report', { name: "Desking Log" })} type="Report" />
             <KPICard title="Closing Ratio" value={db.closeRate} onDrillDown={() => onDrillDown('Report', { name: "Closing Performance" })} type="Report" />
             <KPICard title="Est. Front Gross" value={db.grossEstimate} isCurrency={false} onDrillDown={() => onDrillDown('Report', { name: "Margin Detail" })} type="Report" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-charcoal p-5 rounded border border-border">
                <h3 className="text-sm font-mono text-text-muted mb-4 tracking-wide uppercase flex justify-between">
                   <span>MTD Sales Conversion Funnel</span>
                   <span className="text-gold cursor-pointer hover:underline" onClick={() => onDrillDown('Report', { name: 'Full Funnel Detail' })}>Expand</span>
                </h3>
                <div className="h-48">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SALES_FUNNEL_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                         <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                         <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                         <Tooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}} />
                         <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="flex flex-col gap-4">
                <div className="bg-charcoal border border-border p-4 rounded flex-1 flex flex-col justify-center items-center text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Report', { name: "SLA Response Times", records: db.contactsData })}>
                   <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2 group-hover:text-gold transition-colors">Avg First Response</div>
                   <div className="text-4xl text-white font-playfair">{db.responseTimesAvg}</div>
                   <div className="text-xs text-green-500 mt-2 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30 w-fit mx-auto">-4m vs Last MTD</div>
                </div>
                <div className="bg-charcoal border border-border p-4 rounded flex-1 flex flex-col justify-center items-center text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Report', { name: "Lost Deal Matrix" })}>
                   <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2 group-hover:text-gold transition-colors">Total Lost Deals</div>
                   <div className="text-4xl text-white font-playfair">{db.lostCount}</div>
                   <div className="text-xs text-amber-500 mt-2 bg-amber-900/20 px-2 py-0.5 rounded border border-amber-500/30 w-fit mx-auto">Click to view resurrection targets</div>
                </div>
             </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'Manager') {
      const db = getManagerDashboardData();
      return (
        <div className="space-y-6">
           <AutomatedInsights onDrillDown={onDrillDown} insights={[
              { type: "action", message: <>Marcus Broussard has <DrillDownValue value="8 units" label="Pending Deals" type="Employee" /> in active deals this week but is pacing <span className="text-red-500 underline decoration-red-500/50">behind</span> the CSI target response average.</>, actionText: "View Employee Profile" }
           ]} />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-charcoal border border-border p-5 rounded shadow-inner">
                 <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center hover:text-gold-light cursor-pointer transition-colors" onClick={() => onDrillDown('Report', { name: 'Full Performance Grid' })}>
                    <span>Pipeline by Rep</span> <ChevronRight className="w-4 h-4" />
                 </h4>
                 <div className="space-y-1">
                    {db.byRep.map((r,i) => (
                      <div key={i} className="flex justify-between items-center text-sm cursor-pointer hover:bg-black p-3 rounded -mx-3 transition-colors border-b border-border/30 last:border-0 group" onClick={() => onDrillDown('Employee', r)}>
                        <div>
                           <span className="text-white font-bold group-hover:text-gold transition-colors block">{r.name}</span>
                           <span className="text-[10px] text-text-muted font-mono uppercase">Avg Margin: $2.4k</span>
                        </div>
                        <div className="text-right">
                          <span className="text-green-500 font-bold bg-green-900/20 border border-green-500/30 px-2 py-0.5 rounded mr-2">{r.units} Units</span>
                          <span className="text-gold font-mono text-sm block mt-1">${r.gross.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="bg-charcoal border border-border p-5 rounded shadow-inner">
                 <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center hover:text-gold-light cursor-pointer transition-colors" onClick={() => onDrillDown('Report', { name: 'Lead Velocity Timeline' })}>
                    <span>Stage Aging (Days)</span> <ChevronRight className="w-4 h-4" />
                 </h4>
                 <div className="space-y-4 pt-2">
                    {db.byStageAging.map((s,i) => (
                      <div key={i} className="flex flex-col cursor-pointer group" onClick={() => onDrillDown('Report', { name: `${s.stage} Aging Matrix` })}>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-white group-hover:text-gold transition-colors">{s.stage}</span>
                           <span className="text-amber-500 font-mono">{s.avgDays} days avg</span>
                        </div>
                        <div className="w-full bg-black h-2 rounded overflow-hidden">
                           <div className={`h-full rounded ${s.avgDays > 5 ? 'bg-red-500' : s.avgDays > 2 ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${Math.min((s.avgDays/14)*100, 100)}%`}}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-charcoal border border-border p-5 rounded shadow-inner">
                 <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center hover:text-gold-light cursor-pointer transition-colors" onClick={() => onDrillDown('Report', { name: 'AI Lead Confidence Report' })}>
                    <span>AI Lead Scoring Spread</span> <ChevronRight className="w-4 h-4" />
                 </h4>
                 <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center justify-between text-xs cursor-pointer group" onClick={() => onDrillDown('Report', { name: 'Hot Leads Queue', records: db.hotData })}>
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors">Hot</span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-green-500 h-full w-[12%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded">{db.scoreDistribution.hot}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs cursor-pointer group" onClick={() => onDrillDown('Report', { name: 'Warm Leads Queue', records: db.warmData })}>
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors">Warm</span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-amber-500 h-full w-[45%]"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded">{db.scoreDistribution.warm}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs cursor-pointer group" onClick={() => onDrillDown('Report', { name: 'Cold Leads Queue', records: db.coldData })}>
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors">Cold</span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-blue-500 h-full w-[80%] opacity-50"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded">{db.scoreDistribution.cold}</span>
                    </div>
                 </div>
                 <div className="mt-6 text-[10px] text-text-muted text-center italic border-t border-border/50 pt-3">Scores generated automatically based on recency, cadence, and website dwell-time algorithms.</div>
              </div>
           </div>
        </div>
      );
    }
    if (activeTab === 'Finance') {
      const db = getFinanceDashboardData();
      return (
        <div className="space-y-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard title="Compliance Review" value={`${db.startedVsCompleted.completed}/${db.startedVsCompleted.started}`} onDrillDown={() => onDrillDown('Report', { name: "Prequal Conversion", records: db.prequalData })} type="Report" />
              <KPICard title="Identity Fraud Flags" value={db.fraudReviewFlags.toString()} onDrillDown={() => onDrillDown('Report', { name: "Fraud Escalations", records: db.fraudData })} type="Report" />
              <KPICard title="Lender Ready" value={db.lenderReadyQueue.toString()} onDrillDown={() => onDrillDown('Report', { name: "Ready for Desking" })} type="Report" />
              <KPICard title="Provider Errors" value={db.bureauErrors.toString()} onDrillDown={() => onDrillDown('Report', { name: "API Error Log", records: db.bureauData })} type="Report" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-charcoal p-5 rounded border border-border flex flex-col items-center justify-center relative">
                 <h4 className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-2 absolute top-5 left-5">Decision Split MTD</h4>
                 <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie data={FINANCE_MIX} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                             {FINANCE_MIX.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333'}} itemStyle={{color: '#fff'}} />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex gap-4 justify-center w-full mt-2">
                    {FINANCE_MIX.map((m,i) => <div key={i} className="flex items-center gap-1 text-[10px] text-white"><div className="w-2 h-2 rounded-full" style={{backgroundColor: m.color}}></div>{m.name}</div>)}
                 </div>
              </div>

              <div className="md:col-span-2 bg-charcoal p-5 rounded border border-border">
                  <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center hover:text-gold-light cursor-pointer transition-colors" onClick={() => onDrillDown('Report', { name: 'Adverse Action & Review Queue' })}>
                    <span>Sensitive Document Queue</span> <ChevronRight className="w-4 h-4" />
                 </h4>
                 <div className="space-y-3">
                    {[
                       { type: "Adverse Action Notice Required", customer: "John D.", ago: "2 hours ago", status: "PENDING", color: "text-red-500", bg: "bg-red-900/20" },
                       { type: "Provide Stipulation: Pay Stub", customer: "Sarah K.", ago: "5 hours ago", status: "WAITING", color: "text-amber-500", bg: "bg-amber-900/20" },
                       { type: "Clear Out-of-State ID Override", customer: "Mark E.", ago: "1 day ago", status: "MANAGER_REV", color: "text-blue-500", bg: "bg-blue-900/20" }
                    ].map((row, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3 bg-black border border-border rounded cursor-pointer hover:border-gold-dim transition-colors group" onClick={() => onDrillDown('Action', { name: `Processing Queue: ${row.type}` })}>
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full ${row.bg} flex items-center justify-center`}><AlertCircle className={`w-4 h-4 ${row.color}`}/></div>
                             <div>
                                <div className="text-white text-sm font-bold group-hover:text-gold transition-colors">{row.type}</div>
                                <div className="text-[10px] text-text-muted uppercase font-mono tracking-wide">{row.customer} • {row.ago}</div>
                             </div>
                          </div>
                          <span className={`${row.color} border border-current px-2 py-0.5 rounded text-[10px] font-bold tracking-widest`}>{row.status}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      );
    }
    if (activeTab === 'Retention') {
      const db = getRetentionDashboardData();
      return (
        <div className="space-y-6">
           <AutomatedInsights onDrillDown={onDrillDown} insights={[
              { type: "opportunity", message: <>Service to Sales AI has identified <DrillDownValue value={`${db.serviceToSales} customers`} label="Equity Candidates" type="Report" data={{name: "Lane Conquests", records: db.serviceData}} /> with positive equity currently in the active Service bay. Target them before ticket close.</>, actionText: "View Lane Conquests", data: {name: "Lane Conquests", records: db.serviceData} }
           ]} />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard title="60d Unsold Reactivations" value={db.unsoldReactivation.toString()} onDrillDown={() => onDrillDown('Report', { name: "Reactivation Targets", records: db.reactivationData })} type="Report" />
              <div className="bg-charcoal border border-border rounded p-4 flex flex-col justify-center cursor-pointer hover:border-gold transition-colors group" onClick={() => onDrillDown('Report', { name: "Equity Pitch Queue", records: db.serviceData })}>
                 <div className="text-[10px] text-text-muted font-mono mb-1 uppercase tracking-wider group-hover:text-gold transition-colors">Svc to Sales Ops</div>
                 <div className="text-2xl font-bold text-white group-hover:text-gold drop-shadow-md">{db.serviceToSales.toString()}</div>
                 <div className="text-xs text-green-500 mt-1 bg-green-900/20 px-1 py-0.5 inline-block rounded overflow-hidden relative"><div className="w-full h-full bg-green-500/20 absolute inset-0 animate-pulse"></div>+12% Conquest Rate</div>
              </div>
              <KPICard title="Recent Repeat Buyers" value={db.repeatCandidates.toString()} onDrillDown={() => onDrillDown('Report', { name: "Loyalty Queue" })} type="Report" />
              <KPICard title="Lapsed Service Accounts" value={db.lapsedCustomers.toString()} onDrillDown={() => onDrillDown('Report', { name: "Defector Recovery" })} type="Report" />
           </div>

           <div className="bg-charcoal p-5 rounded border border-border mt-4">
               <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center hover:text-gold-light cursor-pointer transition-colors" onClick={() => onDrillDown('Report', { name: 'Full Retention Pipeline Graph' })}>
                 <span>30-Day Automated Retention Trend</span> <ChevronRight className="w-4 h-4" />
              </h4>
              <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={RETENTION_TREND} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                       <XAxis dataKey="month" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                       <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                       <Tooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor: '#000', borderColor: '#333', color: '#fff'}} />
                       <Line type="monotone" dataKey="reactivation" stroke="#c9a84c" strokeWidth={3} dot={{fill: '#c9a84c', r: 4}} />
                       <Line type="monotone" dataKey="loyalty" stroke="#22c55e" strokeWidth={3} dot={{fill: '#22c55e', r: 4}} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center w-full mt-2 text-xs">
                 <span className="text-gold font-bold">Unsold Lead Reactivation Base</span>
                 <span className="text-text-muted">|</span>
                 <span className="text-green-500 font-bold">Service/Loyalty Equity Base</span>
              </div>
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white flex items-center gap-3"><LayoutDashboard className="w-6 h-6 text-gold"/> Operational Dashboards</h1>
      </div>
      
      <GlobalFilterBar />

      <div className="flex gap-4 border-b border-border pb-2 mb-6 overflow-x-auto subtle-scrollbar">
        {['Overview', 'Sales', 'Manager', 'Finance', 'Retention'].map(tab => (
          <button key={tab} className={`text-sm font-bold px-4 py-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent hover:text-white'}`} onClick={() => setActiveTab(tab)}>
            {tab} Dash
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-500">
         {renderContent()}
      </div>
    </div>
  );
};

const AICommandCenterModule = ({ onDrillDown, userRole }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePriority, setActivePriority] = useState('All Priorities');
  const [activeTab, setActiveTab] = useState('Pending'); // Pending, Snoozed, Metrics
  const [recommendations, setRecommendations] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const syncRecommendations = () => {
      let data = activeTab === 'Snoozed' ? RecommendationService.fetchSnoozed() : RecommendationService.fetchPending();
      if (userRole !== 'Owner' && userRole !== 'General Manager') {
         data = data.filter(r => 
           !r.agentId.includes('audit') && !r.agentId.includes('fi_readiness')
         );
      }
      setRecommendations(data);
      setMetrics(AgentMetrics.getMetricsSummary());
    };

    syncRecommendations();
    const interval = setInterval(syncRecommendations, 3000);
    return () => clearInterval(interval);
  }, [userRole, activeTab]);

  const filtered = recommendations.filter(r => {
    if (activeFilter !== 'All') {
       if (activeFilter === 'Sales/BDC' && !r.agentId.includes('sales') && !r.agentId.includes('lead')) return false;
       if (activeFilter === 'F&I' && !r.agentId.includes('fi_')) return false;
       if (activeFilter === 'Service' && !r.agentId.includes('service') && !r.agentId.includes('parts')) return false;
    }
    if (activePriority !== 'All Priorities') {
       if (r.priority !== activePriority) return false;
    }
    return true;
  });

  const handleBulkApprove = async () => {
     for (const rec of filtered) {
        // Simple auto-assign simulation for bulk approve
        RecommendationService.updateStatus(rec.id, 'APPROVED', 'EMP-1', 'Bulk Approved via Command Center');
     }
     // Re-sync happens on interval or we can trigger it
     setActivePriority('All Priorities'); // Just to tickle a render, interval will catch it
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white flex items-center gap-3"><Command className="w-6 h-6 text-gold"/> AI Command Center</h1>
         <div className="flex gap-2 text-xs font-mono text-text-dim">
           <span className="bg-charcoal px-2 py-1 border border-border rounded">TOTAL {activeTab.toUpperCase()}: {recommendations.length}</span>
           {activeTab === 'Pending' && <span className="bg-red-900/40 text-red-500 border border-red-500 px-2 py-1 rounded">URGENT: {recommendations.filter(r=>r.priority === 'URGENT').length}</span>}
         </div>
      </div>

      <div className="flex gap-4 border-b border-border pb-2 mb-2 overflow-x-auto subtle-scrollbar">
        {['Pending', 'Snoozed', 'Metrics'].map(tab => (
          <button key={tab} className={`text-sm font-bold px-4 py-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent hover:text-white'}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Pending' ? 'Active Insights' : tab === 'Snoozed' ? 'Snoozed' : 'Action Metrics'}
          </button>
        ))}
      </div>

      {activeTab === 'Metrics' ? (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="bg-charcoal p-6 border border-border rounded">
               <h3 className="text-gold font-playfair text-xl mb-4">Volume & Engagement</h3>
               <div className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-2"><span className="text-text-muted">Total Insights Spawned</span><span className="text-white font-bold">{metrics?.recommendationCreatedCount || 0}</span></div>
                  <div className="flex justify-between border-b border-border pb-2"><span className="text-text-muted">View Rate</span><span className="text-white font-bold">{metrics?.derived?.viewRate || '0%'}</span></div>
                  <div className="flex justify-between border-b border-border pb-2"><span className="text-text-muted">Approval Rate</span><span className="text-green-500 font-bold">{metrics?.derived?.approvalRate || '0%'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Action Failures</span><span className="text-red-500 font-bold">{metrics?.actionFailureCount || 0}</span></div>
               </div>
            </div>
            <div className="bg-charcoal p-6 border border-border rounded md:col-span-2">
               <h3 className="text-gold font-playfair text-xl mb-4">Attribution Drivers (Global OS)</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black p-3 border border-border rounded">
                     <div className="text-xs tracking-widest text-text-muted uppercase mb-1">Hot Leads Saved</div>
                     <div className="text-2xl font-bold text-white">
                       <DrillDownValue value={metrics?.hotLeadsSaved || 0} label="Hot Leads Saved Audit" type="ActionMetrics" onDrillDown={onDrillDown} color="text-white" />
                     </div>
                  </div>
                  <div className="bg-black p-3 border border-border rounded">
                     <div className="text-xs tracking-widest text-text-muted uppercase mb-1">Overdue Follow-ups Recovered</div>
                     <div className="text-2xl font-bold text-white">
                       <DrillDownValue value={metrics?.overdueFollowUpsRecovered || 0} label="Follow-ups Recovered Audit" type="ActionMetrics" onDrillDown={onDrillDown} color="text-white" />
                     </div>
                  </div>
                  <div className="bg-black p-3 border border-border rounded">
                     <div className="text-xs tracking-widest text-text-muted uppercase mb-1">F&I Blockers Resolved</div>
                     <div className="text-2xl font-bold text-white">
                       <DrillDownValue value={metrics?.financeBlockersResolved || 0} label="F&I Blockers Resolved Audit" type="ActionMetrics" onDrillDown={onDrillDown} color="text-white" />
                     </div>
                  </div>
                  <div className="bg-black p-3 border border-border rounded">
                     <div className="text-xs tracking-widest text-text-muted uppercase mb-1">System Health</div>
                     <div className="text-2xl font-bold text-green-500">
                       <DrillDownValue value={metrics?.derived?.systemHealth || 'Optimal'} label="System Health Audit" type="ActionMetrics" onDrillDown={onDrillDown} color="text-green-500" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      ) : (
        <>
          <div className="bg-charcoal border border-border p-4 rounded mb-6 flex flex-wrap gap-4 items-center animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-text-muted font-bold tracking-widest text-xs uppercase mr-4">
              <Filter className="w-4 h-4 text-gold"/> Filter Feed
            </div>
            <select 
              className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"
              value={activePriority}
              onChange={(e) => setActivePriority(e.target.value)}
            >
               <option value="All Priorities">All Priorities</option>
               <option value="URGENT">URGENT</option>
               <option value="High">High</option>
               <option value="Medium">Medium</option>
               <option value="Low">Low</option>
            </select>
            <select 
              className="bg-black border border-border text-white text-xs px-3 py-1.5 rounded outline-none focus:border-gold cursor-pointer"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
               <option value="All">All Departments</option>
               <option value="Sales/BDC">Sales/BDC</option>
               <option value="F&I">F&I</option>
               <option value="Service">Service</option>
            </select>
            {activeTab === 'Pending' && filtered.length > 0 && (
              <button onClick={handleBulkApprove} className="text-xs font-bold text-black border border-gold bg-gold hover:bg-gold-light px-4 py-1.5 rounded transition-colors ml-auto flex items-center gap-1">
                 <Zap className="w-3 h-3"/> Bulk Approve ({filtered.length})
              </button>
            )}
          </div>

      <div className="bg-charcoal border border-border rounded overflow-hidden">
         <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-black text-xs font-bold text-text-muted uppercase tracking-widest">
            <div className="col-span-1 text-center">Priority</div>
            <div className="col-span-3">Agent / Title</div>
            <div className="col-span-3">Insight / Reasoning</div>
            <div className="col-span-2">Assigned Owner</div>
            <div className="col-span-2">Suggested Actions</div>
            <div className="col-span-1 text-right">Confidence</div>
         </div>
         <div className="divide-y divide-border">
            {filtered.length === 0 && (
               <div className="p-8 text-center text-text-muted text-sm font-mono">No active recommendations map to the current filters.</div>
            )}
            {filtered.map(rec => (
              <div key={rec.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/40 transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-gold" onClick={() => onDrillDown('AgentRecommendation', rec)}>
                 <div className="col-span-1 flex justify-center">
                    {rec.priority === 'URGENT' ? (
                       <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                       </div>
                    ) : (
                       <div className="text-[10px] font-bold tracking-widest text-text-dim uppercase">{rec.priority}</div>
                    )}
                 </div>
                 <div className="col-span-3">
                    <div className="font-bold text-white text-sm truncate group-hover:text-gold transition-colors">{rec.title}</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-widest font-mono mt-1 w-fit bg-panel px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
                       <BrainCircuit className="w-2 h-2 text-gold"/> {rec.agentId.replace(/_/g, ' ')}
                    </div>
                 </div>
                 <div className="col-span-3">
                    <div className="text-xs text-text-muted line-clamp-2 leading-relaxed">{rec.description}</div>
                    {rec.relatedEntities?.length > 0 && (
                       <div className="flex gap-1 mt-1 flex-wrap">
                         {rec.relatedEntities.map(ent => (
                            <span key={ent.entityId} className="text-[9px] text-text-dim bg-black border border-border/50 px-1 rounded flex items-center gap-1 max-w-[120px] truncate">
                              <ChevronRight className="w-2 h-2 shrink-0"/> {ent.label}
                            </span>
                         ))}
                       </div>
                    )}
                 </div>
                 <div className="col-span-2">
                    <div className="text-xs font-bold text-white flex items-center gap-2"><User className="w-3 h-3 text-text-dim"/> {rec.assignedOwner || "BTR Pool"}</div>
                    {rec.priority === 'URGENT' && <div className="text-[10px] text-red-500 font-mono mt-1 font-bold">Due: Today</div>}
                    <div className="text-[9px] text-text-dim border border-border px-1.5 py-0.5 rounded uppercase font-bold mt-1.5 w-max bg-black">{rec.status || 'Unresolved'}</div>
                 </div>
                 <div className="col-span-2">
                    {rec.proposedActions?.slice(0, 1).map(act => (
                      <div key={act.id} className="text-[10px] font-bold text-green-400 bg-green-900/20 border border-green-900/50 px-1.5 py-1 rounded truncate pointer-events-none w-max">
                         {act.actionType}
                      </div>
                    ))}
                    {rec.proposedActions?.length > 1 && <div className="text-[9px] text-text-dim mt-0.5 ml-1">+{rec.proposedActions.length - 1} options</div>}
                 </div>
                 <div className="col-span-1 text-right flex flex-col items-end">
                     <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${rec.confidenceScore > 85 ? 'text-green-500 border-green-500/30 bg-green-900/10' : 'text-gold border-gold/30 bg-gold/10'}`}>
                       {rec.confidenceScore}%
                     </span>
                 </div>
              </div>
            ))}
         </div>
      </div>
      {/* End Table wrapper */}
        </>
      )}
    </div>
  );
};

const AccountingGLModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">Accounting & General Ledger</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors" onClick={() => onDrillDown('Action', { name: 'Run Month-End Close', message: 'Validating ledgers for close out...' })}>
           <CheckCircle2 className="w-4 h-4" /> Run Month-End Close
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Operating Cash", value: "$412,850", delta: "+$14k vs Mo", color: "text-green-500" },
          { label: "Total A/R", value: "$184,200", delta: "12% Aged >30d", color: "text-amber-500" },
          { label: "Total A/P", value: "$62,400", delta: "On Schedule", color: "text-green-500" },
          { label: "CIT (Contracts in Transit)", value: "$142,500", delta: "$82k Funding Today", color: "text-gold" }
        ].map((m,i) => (
          <div key={i} className="bg-charcoal p-4 rounded border border-border">
            <div className="text-xs text-text-muted font-mono mb-1 uppercase tracking-wider">{m.label}</div>
            <div className={`text-2xl font-bold ${m.label === 'Operating Cash' ? 'text-white' : 'text-gold'}`}>
               <DrillDownValue value={m.value} label={m.label} type="Financials" onDrillDown={onDrillDown} color={m.label === 'Operating Cash' ? 'text-white' : 'text-gold'} />
            </div>
            <div className={`text-xs mt-1 ${m.color} bg-black inline-block px-1 rounded`}>
               {m.delta}
            </div>
          </div>
        ))}
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal border border-border rounded p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-gold font-playfair text-xl">Accounts Receivable Aging</h2>
               <div className="text-xs border border-border px-2 py-1 rounded text-text-muted">As of Today</div>
             </div>
             
             <div className="space-y-4">
               {[
                  { label: "0-30 Days", amount: "$162,096", pct: 88, bg: "bg-green-500" },
                  { label: "31-60 Days", amount: "$14,736", pct: 8, bg: "bg-amber-500" },
                  { label: "61-90 Days", amount: "$5,526", pct: 3, bg: "bg-orange-500" },
                  { label: "90+ Days (Critical)", amount: "$1,842", pct: 1, bg: "bg-red-500" }
               ].map((a, i) => (
                 <div key={i} className="relative">
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-white">{a.label}</span>
                     <span className="font-bold text-white"><DrillDownValue value={a.amount} label={`A/R Aging: ${a.label}`} type="Financials" onDrillDown={onDrillDown} /></span>
                   </div>
                   <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-border">
                     <div className={`h-full ${a.bg}`} style={{width: `${a.pct}%`}}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="bg-charcoal border border-border rounded p-6">
             <h2 className="text-gold font-playfair text-xl mb-6">Bank Reconciliations</h2>
             <div className="space-y-3">
               {[
                 { acct: 'Chase Operating (...4492)', status: 'Reconciled', date: 'Yesterday' },
                 { acct: 'Wells Fargo Flooring (...1102)', status: 'Pending', date: '3 days ago' },
                 { acct: 'Capital One Payroll (...0093)', status: 'Reconciled', date: 'Today' }
               ].map((b, i) => (
                  <div key={i} className="bg-black border border-border p-3 rounded flex justify-between items-center hover:border-gold transition-colors cursor-pointer" onClick={() => onDrillDown('Financials', { account: b.acct })}>
                     <div>
                        <div className="font-bold text-white text-sm">{b.acct}</div>
                        <div className="text-xs text-text-muted mt-1">Last matched: {b.date}</div>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded font-bold border border-current ${b.status === 'Reconciled' ? 'text-green-500' : 'text-amber-500'}`}>
                        {b.status}
                     </span>
                  </div>
               ))}
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

const OmniCommandModule = ({ onDrillDown }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [view, setView] = useState("Review");

  useEffect(() => {
    // Generate trigger implicitly
    const fetchRecs = async () => {
       await AgentRegistry.broadcastTrigger({ type: 'MANUAL', timestamp: new Date().toISOString() }, { userId: 'EMP-1', role: 'Owner', locationId: 'ALL' });
       // Fetch everything
       setRecommendations(RecommendationService.fetchPending({ userRole: 'Owner' }));
    };
    fetchRecs();
  }, []);

  const executeAction = (recId) => {
    // Optimistically update
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Approved' } : r));
    const execution = ActionExecutionService.executeRecommendation(recId, { userId: 'EMP-1' });
    if (execution.status === 'ERROR') {
       alert("Error executing action: " + execution.error);
    }
  };

  const snoozeAction = (recId) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Snoozed' } : r));
  };

  const getFilteredRecs = (statusGroup) => {
     if (statusGroup === 'Review') return recommendations.filter(r => !r.status || r.status === 'Pending' || r.status === 'Unresolved');
     return recommendations.filter(r => r.status === statusGroup);
  };

  const renderCard = (rec) => (
    <div key={rec.id} className="bg-panel border border-border p-4 rounded-lg flex flex-col justify-between shadow">
       <div>
         <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${rec.priority === 'URGENT' ? 'bg-red-900/20 text-red-500 border-red-500/30' : rec.priority === 'HIGH' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-green-900/20 text-green-500 border-green-500/30'}`}>
              {rec.priority} PRIORITY
            </span>
            <span className="text-xs text-text-muted">{new Date(rec.generatedAt).toLocaleTimeString()}</span>
         </div>
         <h4 className="text-white font-bold text-sm mb-1 line-clamp-2" title={rec.title}>{rec.title}</h4>
         <p className="text-xs text-text-dim line-clamp-2">{rec.description}</p>
         
         <div className="mt-3 flex gap-2">
           {rec.agentId === 'super_orchestrator' ? (
              <span className="text-[10px] bg-electric border border-electric/50 text-white font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,195,255,0.4)]">MULTI-DEPARTMENT SYNERGY</span>
           ) : (
              <span className="text-[10px] bg-charcoal text-text-muted px-1.5 py-0.5 rounded border border-border">AGENT: {rec.agentId.replace('ag_','')}</span>
           )}
           <span className="text-[10px] bg-charcoal text-text-muted px-1.5 py-0.5 rounded border border-border">CONF: {rec.confidenceScore}%</span>
         </div>
       </div>
       
       <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-2">
          {view === "Review" ? (
             <>
               <button onClick={() => executeAction(rec.id)} className="flex-1 bg-gold text-black text-xs font-bold py-1.5 rounded hover:bg-gold-light transition-colors">Approve & Execute</button>
               <button onClick={() => snoozeAction(rec.id)} className="bg-black border border-border text-text hover:text-white text-xs px-3 py-1.5 rounded transition-colors">Snooze</button>
               <button onClick={() => onDrillDown('AgentRecommendation', rec)} className="bg-black border border-border text-text hover:text-white text-xs px-3 py-1.5 rounded transition-colors" title="Deep inspection"><Search className="w-3.5 h-3.5"/></button>
             </>
          ) : view === "Approved" ? (
             <div className="w-full text-center text-xs font-bold text-green-500 bg-green-900/20 py-1 rounded border border-green-500/20">Execution Logged</div>
          ) : (
             <button onClick={() => setRecommendations(prev => prev.map(r => r.id === rec.id ? { ...r, status: 'Pending' } : r))} className="w-full text-center text-xs font-bold text-amber-500 bg-amber-900/20 py-1 rounded border border-amber-500/20 hover:bg-amber-800 transition-colors">Wake from Snooze</button>
          )}
       </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-charcoal border border-border rounded flex items-center justify-center text-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]">
               <Zap className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl font-playfair text-white">Omni-Command Center</h1>
               <p className="text-text-muted text-sm border-l-2 border-gold pl-2 ml-1">Global Strategy & Execution Orchestration</p>
             </div>
          </div>
          
          <div className="flex bg-charcoal border border-border rounded overflow-hidden">
             {['Review', 'Approved', 'Snoozed'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${view === tab ? 'bg-gold text-black shadow-inner' : 'text-text-muted hover:bg-panel hover:text-white'}`}
                  onClick={() => setView(tab)}
                >
                  {tab} ({getFilteredRecs(tab).length})
                </button>
             ))}
          </div>
       </div>

       <div className="flex-1 bg-charcoal border border-border rounded-xl p-4 overflow-y-auto">
          {getFilteredRecs(view).length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-text-muted">
                <CheckCircle2 className="w-16 h-16 text-green-900/50 mb-4" />
                <p className="text-lg font-playfair text-white mb-1">{view === 'Review' ? "Inbox Zero." : `No ${view.toLowerCase()} actions.`}</p>
                <p className="text-sm">All agent recommendations have been processed.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max">
               {getFilteredRecs(view).map(renderCard)}
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
    { name: "Omni-Command", icon: Zap },
    { name: "Sales", icon: TrendingUp },
    { name: "Customer CRM", icon: Users },
    { name: "AI Command Center", icon: Command },
    { name: "F&I / Finance", icon: CreditCard },
    { name: "Inventory", icon: Package },
    { name: "Used Bikes / UBD", icon: Bike },
    { name: "Service & Parts", icon: Wrench },
    { name: "Clock In / HR", icon: Clock },
    { name: "Payroll", icon: DollarSign },
    { name: "Marketing", icon: Megaphone },
    { name: "OEM Incentives", icon: Award },
    { name: "Reports", icon: FileBarChart },
    { name: "Accounting & GL", icon: Briefcase },
    { name: "Employee Hub", icon: UsersIcon },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-charcoal border-r border-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border flex flex-col items-center py-6">
           <img 
             src={dealerLogo} 
             alt={`${activeCompany} Logo`} 
             className="h-10 w-full object-contain mb-2 mx-auto" 
             onError={(e) => { e.target.style.display='none'; }}
           />
           <div className="text-gold font-playfair font-bold text-xl tracking-wider mt-2">DealerCommand™</div>
           
           <div className="mt-4 w-full flex flex-col gap-2">
             <select 
               className="w-full bg-black border border-border rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-gold cursor-pointer"
               value={activeCompany}
               onChange={(e) => {
                 setActiveCompany(e.target.value);
                 setActiveLocation("All Locations");
               }}
             >
               <option value="Friendly Powersports">Friendly Powersports</option>
               <option value="Used Bikes Direct">Used Bikes Direct</option>
             </select>

             <select 
               className="w-full bg-black border border-border rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-gold cursor-pointer"
               value={activeLocation}
               onChange={(e) => {
                 setActiveLocation(e.target.value);
               }}
             >
               {activeCompany === "Friendly Powersports" ? (
                 <>
                   <option value="All Locations">All Locations</option>
                   <option value="Baton Rouge, LA">Baton Rouge, LA</option>
                   <option value="Slidell, LA">Slidell, LA</option>
                 </>
               ) : (
                 <>
                   <option value="All Locations">All Locations</option>
                   <option value="Baton Rouge, LA">Baton Rouge, LA</option>
                   <option value="Slidell, LA">Slidell, LA</option>
                   <option value="Houston, TX">Houston, TX</option>
                   <option value="Dallas, TX">Dallas, TX</option>
                 </>
               )}
             </select>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => {
            if (item.name === "AI Command Center" && currentUser.systemRole === "Employee") return null;
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
            {activeTab === "Dashboard" && <OperationalDashboardsModule onNavigate={setActiveTab} onDrillDown={handleDrillDown} userRole={currentUser?.role} company={activeCompany} location={activeLocation} />}
            {activeTab === "Sales" && <SalesModule onNavigate={setActiveTab} onDrillDown={handleDrillDown} />}
            {activeTab === "Omni-Command" && <OmniCommandModule onDrillDown={handleDrillDown} />}
            {activeTab === "Customer CRM" && <CustomerCRMModule onDrillDown={handleDrillDown} user={currentUser} />}
            {activeTab === "AI Command Center" && <AICommandCenterModule onDrillDown={handleDrillDown} userRole={currentUser?.role} />}
            {activeTab === "F&I / Finance" && <FIModule onDrillDown={handleDrillDown} />}
            {activeTab === "Inventory" && <InventoryModule onDrillDown={handleDrillDown} />}
            {activeTab === "Used Bikes / UBD" && <UsedBikesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Service & Parts" && <ServicePartsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Payroll" && <PayrollModule onDrillDown={handleDrillDown} />}
            {activeTab === "OEM Incentives" && <OEMIncentivesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Marketing" && <MarketingModule onDrillDown={handleDrillDown} />}
            {activeTab === "Reports" && <ReportsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Accounting & GL" && <AccountingGLModule onDrillDown={handleDrillDown} />}
            {activeTab === "Employee Hub" && <EmployeeHubModule user={currentUser} onDrillDown={handleDrillDown} />}
            {activeTab === "Settings" && <SettingsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Clock In / HR" && <ClockInModule user={currentUser} onDrillDown={handleDrillDown} />}
            {![ "Dashboard", "Omni-Command", "Sales", "Customer CRM", "AI Command Center", "F&I / Finance", "Inventory", "Used Bikes / UBD", "Service & Parts", "Payroll", "OEM Incentives", "Marketing", "Reports", "Accounting & GL", "Employee Hub", "Settings", "Clock In / HR" ].includes(activeTab) && (
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
      {drillDown && <DrillDownModal item={drillDown} userRole={currentUser?.systemRole || 'Owner'} onClose={() => setDrillDown(null)} onDrillDown={handleDrillDown} />}
      <CopilotModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onDrillDown={handleDrillDown} />
    </div>
  );
};

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("Caught by Error Boundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: '#ffdcd1' }}>
          <h2>Application Crashed!</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppWrapper = () => (
   <GlobalErrorBoundary>
      <App />
   </GlobalErrorBoundary>
);

export default AppWrapper;

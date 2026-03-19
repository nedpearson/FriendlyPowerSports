import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, CreditCard, Package, Bike, Wrench,
  Clock, DollarSign, Megaphone, Award, FileBarChart, Users as UsersIcon, Settings,
  Bell, Search, ChevronRight, CheckCircle2, ChevronDown, User, Play, Calendar, AlertCircle, Command,
  Briefcase, Users, BrainCircuit, TrendingDown, Database, Filter, Zap, Layout, Grid3X3, RefreshCw, Activity, X, MessageSquare, Terminal, Phone, PhoneCall, PhoneForwarded, MessageSquareText, Menu
} from 'lucide-react';

import {
  getSalesDashboardData, getManagerDashboardData, getFinanceDashboardData, getRetentionDashboardData
} from './data/selectors';
import { fetchMockData } from './api/mockClient';

import { KPICard } from './components/ui/KPICard';
import { SectionHeader } from './components/ui/SectionHeader';
import { StatusChip } from './components/ui/StatusChip';
import { TrendBadge } from './components/ui/TrendBadge';
import { AutomatedInsights } from './components/ui/AutomatedInsights';
import { DrillDownValue } from './components/ui/DrillDownValue';
import { DrillDownModal } from './components/ui/DrillDownModal';
import { DetailReportView } from './components/ui/DetailReportView';
import { AgentWidget } from './components/ui/AgentWidget';
import { ReportsModule } from './components/ui/ReportsModule';
import { FIModule } from './components/ui/FIModule';
import { SettingsModule } from './components/ui/SettingsModule';
import { AccountingGLModule } from './components/ui/AccountingGLModule';
import { OEMModule } from './components/ui/OEMModule';
import { MarketingModule } from './components/ui/MarketingModule';
import { InventoryModule } from './components/ui/InventoryModule';
import { ServicePartsModule } from './components/ui/ServicePartsModule';
import { PayrollModule } from './components/ui/PayrollModule';
import { ClockInModule } from './components/ui/ClockInModule';
import { DateRangePicker } from './components/ui/DateRangePicker';
import dealerLogo from './assets/logo.png';

// Boot up Super Agent Phase 1 Registry
import './agents/services/index.js';
import { AgentRegistry } from './agents/registry/AgentRegistry';
import { RecommendationService } from './agents/services/RecommendationService';
import { AgentMetrics } from './agents/audit/AgentMetrics';
import { ActionExecutionService } from './agents/services/ActionExecutionService';

import { INVENTORY, DEALS, CUSTOMERS, AGENT_RECOMMENDATIONS, AGENT_ACTIONS, AGENT_AUDIT_LOGS, EMPLOYEES, AGENT_THRESHOLDS, LEADS, CRM_OPPORTUNITIES, SERVICE_ORDERS } from './data/mockDatabase';
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
  const [kpiStats, setKpiStats] = useState([]);
  const [loadingKpis, setLoadingKpis] = useState(true);

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const data = await fetchMockData(getKpiStats);
        setKpiStats(data);
      } catch (error) {
        console.error("Failed to load KPIs", error);
      } finally {
        setLoadingKpis(false);
      }
    };
    loadKpis();

    // Generate background insights via the Super Agent layer manually on boot
    const seedRecommendations = async () => {
      // Broadcast an APP_BOOT trigger to awaken all Agents
      await AgentRegistry.broadcastTrigger({ type: 'APP_BOOT', timestamp: new Date().toISOString() }, { userId: 'EMP-1', role: 'Owner', locationId: 'ALL' });
      
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
          <DateRangePicker />
          <button className="text-gold text-sm border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition-colors" onClick={() => onDrillDown('Action', { name: 'Export Global OS State', message: 'Extracting comprehensive CSV data sheet...' })}>Export Report</button>
        </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={dashboardInsights} />

      <AgentWidget userContext={{ userId: 'EMP-1', role: 'Owner' }} />

      {/* KPI Mega Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loadingKpis ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-charcoal p-4 rounded border border-border h-28 flex flex-col justify-between">
               <div className="h-3 bg-panel rounded w-1/2"></div>
               <div className="h-8 bg-panel rounded w-3/4"></div>
               <div className="h-3 bg-panel rounded w-1/3"></div>
            </div>
          ))
        ) : (
          kpiStats.map((kpi, i) => (
            <KPICard 
              key={i} 
              label={kpi.label} 
              value={kpi.value} 
              delta={kpi.delta} 
              color={kpi.color} 
              onClick={() => onDrillDown('KPI', kpi)} 
            />
          ))
        )}
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

const PipelineKanban = ({ onDrillDown, onNavigate }) => {
  const stages = ['New', 'Working', 'Demo', 'Quote', 'Stipulations', 'Sold'];
  
  return (
     <div className="bg-charcoal border border-border rounded p-6">
       <h2 className="text-gold font-playfair text-xl mb-4 flex items-center gap-2">
         <Layout className="w-5 h-5"/> Active Deal Pipeline
       </h2>
       <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-black min-h-[500px]">
          {stages.map(stage => {
             const stageLeads = LEADS.filter(l => l.stage === stage);
             
             return (
                <div key={stage} className="bg-black border border-border rounded w-[320px] flex-shrink-0 flex flex-col">
                   <div className="p-3 border-b border-border/50 font-bold flex justify-between items-center text-sm sticky top-0 bg-black z-10">
                      <span className="text-white tracking-wide uppercase font-mono">{stage}</span>
                      <span className="text-text-muted text-xs bg-panel px-2 rounded-full border border-border/50">{stageLeads.length}</span>
                   </div>
                   <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-[100px]">
                      {stageLeads.length === 0 ? (
                         <div className="text-center text-text-dim text-xs mt-4 italic font-mono">No deals in {stage}</div>
                      ) : (
                         stageLeads.map((lead, idx) => {
                            const cust = CUSTOMERS.find(c => c.id === lead.customerId);
                            const opp = CRM_OPPORTUNITIES.find(o => o.leadId === lead.id);
                            const rep = EMPLOYEES.find(e => e.id === lead.empId);
                            const frontNet = opp ? opp.estimatedFrontGross || 0 : 0;
                            const backNet = opp ? opp.estimatedBackGross || 0 : 0;
                            const totalNet = frontNet + backNet;
                            
                            return (
                               <div key={lead.id} className="bg-charcoal border border-border/70 p-3 rounded cursor-pointer hover:border-gold shadow-md transition-all group" onClick={() => onDrillDown('Action', { name: "Inspect Lead", lead })}>
                                  <div className="flex justify-between items-start mb-2">
                                     <div className="font-bold text-white text-sm group-hover:text-gold transition-colors">{cust ? cust.name : 'Unknown Customer'}</div>
                                     <div className="text-[10px] text-text-muted bg-black px-1.5 rounded">{new Date(lead.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                                  </div>
                                  
                                  <div className="text-xs text-text-muted mb-2 font-mono flex items-center gap-2">
                                     <span className="text-green-500 font-bold bg-green-500/10 px-1.5 rounded border border-green-500/20">${totalNet.toLocaleString()} GP</span>
                                     {opp && opp.probPct && <span className="text-[10px]">{opp.probPct}% Ptw</span>}
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                                     <div className="text-[10px] text-text-muted font-mono flex items-center gap-1"><User className="w-3 h-3"/> {rep ? rep.name.split(' ')[0] : 'Unassigned'}</div>
                                     <div className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold ${lead.status === 'Unresponded' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-green-500/20 text-green-500 border border-green-500/50'}`}>
                                        {lead.status}
                                     </div>
                                  </div>
                               </div>
                            )
                         })
                      )}
                   </div>
                </div>
             )
          })}
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

  const [viewMode, setViewMode] = useState("Pipeline");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-white">Sales & Deal Pipeline</h2>
        <div className="flex gap-2 items-center">
          <div className="flex bg-charcoal border border-border rounded overflow-hidden mr-4">
             <button className={`px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 ${viewMode === 'Pipeline' ? 'bg-gold text-black' : 'text-text-muted hover:text-white'}`} onClick={() => setViewMode('Pipeline')}><Layout className="w-4 h-4"/> Pipeline</button>
             <button className={`px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 border-l border-border ${viewMode === 'Up Log' ? 'bg-gold text-black' : 'text-text-muted hover:text-white'}`} onClick={() => setViewMode('Up Log')}><UsersIcon className="w-4 h-4"/> Up Log</button>
             <button className={`px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 border-l border-border ${viewMode === 'Deal Desk' ? 'bg-gold text-black' : 'text-text-muted hover:text-white'}`} onClick={() => setViewMode('Deal Desk')}><Settings className="w-4 h-4"/> Deal Desk</button>
          </div>
          <button className="bg-charcoal border border-border px-3 py-1.5 rounded text-sm text-text-muted hover:text-white" onClick={() => onDrillDown('Action', { name: 'Filter Deals', message: 'Opening advanced filtering modal.' })}>Filter</button>
          <button className="bg-panel border border-border px-4 py-1.5 rounded text-sm text-white hover:text-gold transition-colors font-bold flex items-center gap-2" onClick={() => onDrillDown('DealSimulator', { msrp: 18500, invoice: 16000, customer: "Pending Structure" })}>AI Simulator</button>
          <button className="bg-gold text-black px-4 py-1.5 rounded text-sm font-bold shadow-[0_0_10px_rgba(201,168,76,0.2)]" onClick={() => onDrillDown('Agent', { intent: 'Cross-Database Deal Synthesis' })}>Write New Deal</button>
        </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={salesInsights} />

      {viewMode === "Pipeline" ? (
         <div className="animate-in fade-in duration-500"><PipelineKanban onDrillDown={onDrillDown} /></div>
      ) : viewMode === "Up Log" ? (
         <div className="animate-in fade-in duration-500 bg-charcoal border border-border rounded overflow-hidden p-6 text-sm">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-playfair text-gold"><UsersIcon className="w-5 h-5 inline-block mr-2 text-white" /> Live Showroom Up Log</h2>
               <button className="bg-gold text-black px-4 py-1.5 rounded text-xs font-bold transition-colors" onClick={() => onDrillDown('Action', { name: "Add Up", message: "Logging new walk-in traffic to exact timestamp."})}>+ Log Walk-In</button>
            </div>
            <table className="w-full text-left">
               <thead className="bg-black text-text-muted uppercase tracking-widest text-[10px]">
                  <tr>
                     <th className="px-4 py-3">Time In</th>
                     <th className="px-4 py-3">Customer</th>
                     <th className="px-4 py-3">Salesperson</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-right">T.O. / Desk</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-panel transition-colors cursor-pointer" onClick={() => onDrillDown('Action', {name: "View Up", message: "Opening up parameters for David"})}>
                     <td className="px-4 py-3 font-mono text-text-muted">08:15 AM</td>
                     <td className="px-4 py-3 text-white font-bold"><DrillDownValue value="David O." label="CRM Profile" type="CRM_Customer360" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></td>
                     <td className="px-4 py-3 text-gold"><DrillDownValue value="Jake F." label="Rep Profile" type="Employee" onDrillDown={onDrillDown} color="text-gold hover:text-white" /></td>
                     <td className="px-4 py-3"><span className="bg-amber-900/40 border border-amber-500/50 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Demo / Ride</span></td>
                     <td className="px-4 py-3 text-right">-</td>
                  </tr>
                  <tr className="hover:bg-panel transition-colors cursor-pointer" onClick={() => onDrillDown('Action', {name: "View Up", message: "Opening up parameters for Sarah"})}>
                     <td className="px-4 py-3 font-mono text-text-muted">09:10 AM</td>
                     <td className="px-4 py-3 text-white font-bold"><DrillDownValue value="Sarah M." label="CRM Profile" type="CRM_Customer360" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></td>
                     <td className="px-4 py-3 text-gold"><DrillDownValue value="Marcus B." label="Rep Profile" type="Employee" onDrillDown={onDrillDown} color="text-gold hover:text-white" /></td>
                     <td className="px-4 py-3"><span className="bg-blue-900/40 border border-blue-500/50 text-blue-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Write Up</span></td>
                     <td className="px-4 py-3 text-right"><span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Mgr Desking</span></td>
                  </tr>
                  <tr className="hover:bg-panel transition-colors cursor-pointer" onClick={() => onDrillDown('Action', {name: "View Up", message: "Opening up parameters for Unknown Phone"})}>
                     <td className="px-4 py-3 font-mono text-text-muted">09:42 AM</td>
                     <td className="px-4 py-3 text-white font-bold text-text-muted/50 italic"><DrillDownValue value="Unknown Phone-Up" label="Action Required" type="Action" onDrillDown={onDrillDown} color="text-text-muted/50 hover:text-gold" /></td>
                     <td className="px-4 py-3 text-gold"><DrillDownValue value="Tony G." label="Rep Profile" type="Employee" onDrillDown={onDrillDown} color="text-gold hover:text-white" /></td>
                     <td className="px-4 py-3"><span className="bg-green-900/40 border border-green-500/50 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Greeting</span></td>
                     <td className="px-4 py-3 text-right">-</td>
                  </tr>
               </tbody>
            </table>
         </div>
      ) : (
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
          <div className="bg-black border border-border rounded p-6 flex flex-col justify-between cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Deal', { unit: dealDeskUnit, salePrice, cost, pack, recon, holdback, backend, fpCost, totalEcoProfit, reportId: 'SALES_UNITS' })}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Front-End Gross:</span> 
                <span className="text-white"><DrillDownValue value={`$${frontEnd.toLocaleString()}`} label="Front-End Gross" type="Deal" onDrillDown={onDrillDown} reportId="SALES_UNITS" /></span>
              </div>
              <div className="flex justify-between"><span className="text-text-muted">OEM Holdback:</span> 
                <span className="text-green-500"><DrillDownValue value={`+$${holdback.toLocaleString()}`} label="OEM Holdback" type="Deal" onDrillDown={onDrillDown} color="text-green-500" reportId="SALES_UNITS" /></span>
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
              
              <button className="w-full mt-4 bg-red-900/40 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2" onClick={(e) => { e.stopPropagation(); onDrillDown('Action', { name: "Request T.O.", message: "Paging Sales Manager to Desk 4 for Turnover." }); }}>
                 <AlertCircle className="w-4 h-4" /> Request T.O.
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};




const UsedBikesModule = ({ onDrillDown }) => {
  const pipelineData = getReconPipeline();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Inspection': return 'border-green-500 text-green-500';
      case 'Recon In Progress': return 'border-amber-500 text-amber-500';
      case 'Detail & Photos': return 'border-blue-500 text-blue-500';
      default: return 'border-border text-white';
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white">Used Bikes Direct</h1>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shadow" onClick={() => onDrillDown('Appraisal', { type: 'New' })}>
           <Bike className="w-4 h-4" /> Driveway Appraisal
         </button>
      </div>

      <div className="bg-charcoal border border-border rounded p-6 shadow-inner">
         <h2 className="text-gold font-playfair text-xl mb-6 flex justify-between items-center">
            Recon Pipeline
            <span className="text-xs bg-black text-white px-3 py-1 rounded border border-border"><DrillDownValue value={`${pipelineData.length} Units`} label="Pipeline Ledger" type="Report" onDrillDown={onDrillDown} /></span>
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {['Inspection', 'Recon In Progress', 'Detail & Photos', 'Frontline Ready'].map((stage, i) => {
             const colItems = pipelineData.filter(item => item.status === stage);
             
             return (
               <div key={i} className="bg-black border border-border rounded p-3 min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
                     <h3 className="text-xs text-text-muted font-mono uppercase tracking-widest">{stage}</h3>
                     <span className="text-xs bg-charcoal px-2 py-0.5 rounded text-white border border-border"><DrillDownValue value={colItems.length} label={`${stage} Volume`} type="Report" onDrillDown={onDrillDown} color="hover:text-gold" /></span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                     {colItems.map(item => (
                       <div key={item.id} onClick={() => onDrillDown('Inventory', { unitId: item.id, ...item })} className={`bg-panel rounded border-l-4 p-3 shadow text-sm cursor-pointer hover:border-gold transition-colors group ${getStatusColor(item.status).split(' ')[0]}`}>
                         <div className="font-bold text-white mb-2 group-hover:text-gold transition-colors text-xs">{item.unit}</div>
                         <div className="flex justify-between text-[11px] text-text-muted mb-1">
                           <span>Cost: <DrillDownValue value={`$${item.cost.toLocaleString()}`} label="Recon Cost Basis" type="Inventory" onDrillDown={onDrillDown} /></span> 
                           <span>Spend: <DrillDownValue value={`$${item.spend.toLocaleString()}`} label="Recon Spend Tracking" type="Financials" onDrillDown={onDrillDown} color="text-red-400 group-hover:text-white" /></span>
                         </div>
                         <div className="mt-2 pt-2 border-t border-border/50 text-[10px] flex justify-between items-center">
                           <span className={`font-bold ${getStatusColor(item.status).split(' ')[1]}`}><DrillDownValue value={`Day ${item.days}`} label="Aging Warning" type="Report" onDrillDown={onDrillDown} color={`hover:text-white font-mono ${getStatusColor(item.status).split(' ')[1]}`}/></span> 
                           <span className="bg-black px-1.5 py-0.5 rounded border border-border uppercase tracking-widest"><DrillDownValue value={item.tech} label="Assigned Tech Profile" type="Employee" onDrillDown={onDrillDown} color="text-text-muted group-hover:text-white" /></span>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>
             );
           })}
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


const PlaceholderModule = ({ title, desc }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center border border-dashed border-border rounded">
    <Wrench className="w-12 h-12 text-text-muted mb-4" />
    <h2 className="text-2xl font-playfair text-white mb-2">{title}</h2>
    <p className="text-text-muted max-w-md">{desc || "Module fully connected into navigation shell. Full data view will render here."}</p>
  </div>
);






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
  const [activeView, setActiveView] = useState('Inbox'); // 'Inbox', 'Pipeline', 'Appointments', 'Finance', 'WorkPlan'
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
            <button className={`text-lg font-playfair flex items-center gap-2 px-4 py-2 hover:text-white transition-colors border-b-2 ${activeView === 'WorkPlan' ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent'}`} onClick={() => setActiveView('WorkPlan')}><CheckCircle2 className="w-5 h-5"/> Daily Work Plan</button>
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

      {activeView === 'WorkPlan' && (
         <div className="bg-charcoal border border-border rounded overflow-hidden flex-1 flex flex-col p-6">
            <h2 className="text-xl font-playfair text-gold mb-2"><CheckCircle2 className="w-6 h-6 inline-block mr-2" /> My Daily Work Plan</h2>
            <p className="text-sm text-text-muted mb-6">Complete these tasks to adhere to BDC follow-up requirements.</p>
            <div className="space-y-3">
               {[
                  { type: 'Phone Call', customer: 'David O.', reason: 'Day 1 Follow-up (New R1)', time: 'Overdue 2h', priority: 'High', action: 'Log Call' },
                  { type: 'Email', customer: 'Sarah M.', reason: 'Equity Alert Triggered', time: 'Due Today', priority: 'Medium', action: 'Send Email Tracking' },
                  { type: 'SMS Text', customer: 'Mike T.', reason: 'Finance App Approved', time: 'Due Today', priority: 'Medium', action: 'Text Customer' },
                  { type: 'Phone Call', customer: 'Jessica V.', reason: 'Missed Appointment', time: 'Due Tomorrow', priority: 'Low', action: 'Reschedule' }
               ].map((task, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 bg-black border ${task.priority === 'High' ? 'border-red-500/50' : 'border-border'} rounded cursor-pointer hover:border-gold transition-colors`} onClick={() => onDrillDown('Action', { name: task.action, message: `Opening execution modal for ${task.customer}` })}>
                     <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${task.type === 'Phone Call' ? 'bg-blue-900/30 text-blue-500' : task.type === 'Email' ? 'bg-amber-900/30 text-amber-500' : 'bg-green-900/30 text-green-500'}`}>
                           {task.type === 'Phone Call' ? <Phone className="w-5 h-5" /> : task.type === 'Email' ? <MessageSquare className="w-5 h-5" /> : <MessageSquareText className="w-5 h-5" />}
                        </div>
                        <div>
                           <div className="text-white font-bold">{task.customer}</div>
                           <div className="text-xs text-text-muted">{task.type} &middot; {task.reason}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className={`text-xs font-bold ${task.priority === 'High' ? 'text-red-500 animate-pulse' : 'text-text-muted'}`}>{task.time}</div>
                        <button className="bg-charcoal hover:bg-gold hover:text-black border border-border text-white px-4 py-1.5 rounded text-xs font-bold transition-colors">Start Task</button>
                     </div>
                  </div>
               ))}
               <div className="mt-8 text-center pt-4 border-t border-border">
                  <span className="text-xs font-mono text-green-500 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 inline-block mr-1" /> 14 Tasks Completed Today</span>
               </div>
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

const DashboardV2Module = ({ onDrillDown, onNavigate, userRole, company, location }) => {
  const [activeDepartment, setActiveDepartment] = useState('My Day');

  const renderContent = () => {
    // OWNER VIEW: High Level Risk & Trend Consolidation
    if (userRole === 'Owner' || userRole === 'General Manager') {
       const mgrDb = getManagerDashboardData();
       const retDb = getRetentionDashboardData();
       return (
         <div className="space-y-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-charcoal border-l-4 border-l-red-500 border border-border rounded p-4 flex-1 hover:border-r-red-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'URGENT' })}>
                 <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-red-500 transition-colors"><span>Urgent Items</span> <Command className="w-3 h-3 text-red-500"/></div>
                 <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="12" label="Urgent Items" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
              </div>
              <KPICard title="Total Units MTD" value="38" onDrillDown={() => onDrillDown('Report', { name: "Sales Log" })} type="Report" />
              <KPICard title="Projected Gross" value="1.2M" isCurrency={true} onDrillDown={() => onDrillDown('Report', { name: "Gross Margin Detail" })} type="Report" />
              <div className="bg-charcoal border-l-4 border-l-green-500 border border-border rounded p-4 flex flex-col justify-center cursor-pointer hover:border-gold transition-colors group" onClick={() => onDrillDown('Report', { name: "Equity Pitch Queue", records: retDb.serviceData })}>
                 <div className="text-[10px] text-text-muted font-mono mb-1 uppercase tracking-wider group-hover:text-gold transition-colors">Service Equity Op</div>
                 <div className="text-2xl font-bold text-white group-hover:text-gold drop-shadow-md"><DrillDownValue value={retDb.serviceToSales.toString()} label="Svc to Sales Ops" type="Report" onDrillDown={onDrillDown} color="text-white" /></div>
                 <div className="text-[10px] text-green-500">+12% Conquest Rate</div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-charcoal border border-border p-5 rounded">
                 <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4">Pipeline Risk By Stage</h4>
                 <div className="space-y-4 pt-2">
                    {mgrDb.byStageAging.map((s,i) => (
                      <div key={i} className="flex flex-col cursor-pointer group" onClick={() => onDrillDown('Report', { name: `${s.stage} Aging Matrix` })}>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-white group-hover:text-gold transition-colors"><DrillDownValue value={s.stage} label="Aging Stage" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></span>
                           <span className="text-amber-500 font-mono"><DrillDownValue value={`${s.avgDays} days avg`} label="Average Aging" type="Report" onDrillDown={onDrillDown} color="text-amber-500" /></span>
                        </div>
                        <div className="w-full bg-black h-2 rounded overflow-hidden">
                           <div className={`h-full rounded ${s.avgDays > 5 ? 'bg-red-500' : s.avgDays > 2 ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${Math.min((s.avgDays/14)*100, 100)}%`}}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-charcoal border border-border p-5 rounded">
                 <h4 className="text-gold text-sm font-bold border-b border-border/50 pb-2 mb-4 flex justify-between items-center cursor-pointer">
                    <span>Performance by Rep</span> <ChevronRight className="w-4 h-4" />
                 </h4>
                 <div className="space-y-1">
                    {mgrDb.byRep.slice(0, 4).map((r,i) => (
                      <div key={i} className="flex justify-between items-center text-sm cursor-pointer hover:bg-black p-3 rounded -mx-3 transition-colors border-b border-border/30 last:border-0 group" onClick={() => onDrillDown('Employee', r)}>
                        <div><span className="text-white font-bold block"><DrillDownValue value={r.name} label="Rep Profile" type="Employee" onDrillDown={onDrillDown} color="text-white" /></span></div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-green-500 font-bold bg-green-900/20 px-2 py-0.5 rounded mb-1"><DrillDownValue value={`${r.units} Units`} label="Total Units" type="Report" color="text-green-500" /></span>
                          <span className="text-gold font-mono text-[10px] block"><DrillDownValue value={`$${r.gross.toLocaleString()}`} label="Gross Profit" type="Report" color="text-gold" /></span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         </div>
       );
    }
    
    // SALES ASSOCIATE VIEW: Actionable Queue
    if (userRole === 'Sales Associate') {
       const salesDb = getSalesDashboardData();
       return (
         <div className="space-y-6">
           <AutomatedInsights onDrillDown={onDrillDown} insights={[
              { type: "opportunity", message: <>Internet lead conversion is trending <span className="text-green-500 font-bold">12% higher</span>. Keep the momentum.</>, actionText: "View My Funnel", data: { name: 'Lead Conversion Records' } },
           ]} />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-charcoal border-l-4 border-l-green-500 border border-border rounded p-4 flex-1 hover:border-r-green-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'HOT_LEADS' })}>
                 <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-green-500 transition-colors"><span>My Hot Leads</span> <TrendingUp className="w-3 h-3 text-green-500"/></div>
                 <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="8" label="Hot Leads" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
              </div>
              <KPICard title="My Quotes Sent" value={salesDb.quotesSent.toString()} onDrillDown={() => onDrillDown('Report', { name: "Desking Log" })} type="Report" />
              <KPICard title="My Close Ratio" value={salesDb.closeRate} onDrillDown={() => onDrillDown('Report', { name: "Closing Performance" })} type="Report" />
              <div className="bg-charcoal border-l-4 border-l-amber-500 border border-border rounded p-4 flex-1 hover:border-r-amber-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'STALLED_OPPS' })}>
                 <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-amber-500 transition-colors"><span>Stalled Opps</span> <TrendingDown className="w-3 h-3 text-amber-500"/></div>
                 <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="24" label="Stalled Opps" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
              </div>
           </div>
         </div>
       );
    }

    // Default Fallback
    return <DashboardModule onDrillDown={onDrillDown} company={company} location={location} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-playfair text-white flex items-center gap-3"><LayoutDashboard className="w-6 h-6 text-gold"/> My Dashboard <span className="text-[10px] bg-gold text-black font-mono font-bold px-2 py-0.5 rounded tracking-widest">ROLE-BASED V2</span></h1>
      </div>
      <div className="animate-in fade-in duration-500">
         {renderContent()}
      </div>
    </div>
  );
};

const OperationalDashboardsModule = ({ onDrillDown, onNavigate, userRole, company, location }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const renderContent = () => {
    if (activeTab === 'Overview') {
       return (
         <div className="space-y-6">
           <div className="flex gap-4 overflow-x-auto subtle-scrollbar pb-2">
             <div className="bg-charcoal border-l-4 border-l-red-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-red-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'URGENT' })}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-red-500 transition-colors"><span>Urgent Items</span> <Command className="w-3 h-3 text-red-500"/></div>
                <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="12" label="Urgent Items" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
                <div className="text-[10px] text-text-dim">Action Required Now</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-amber-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-amber-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'STALLED_OPPS' })}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-amber-500 transition-colors"><span>Stalled Opps</span> <TrendingDown className="w-3 h-3 text-amber-500"/></div>
                <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="24" label="Stalled Opps" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
                <div className="text-[10px] text-text-dim">Pipeline Risk</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-green-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-green-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'HOT_LEADS' })}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-green-500 transition-colors"><span>Hot Leads</span> <TrendingUp className="w-3 h-3 text-green-500"/></div>
                <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="8" label="Hot Leads" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
                <div className="text-[10px] text-text-dim">Assign & Call</div>
             </div>
             <div className="bg-charcoal border-l-4 border-l-blue-500 border border-border rounded p-4 flex-1 min-w-[200px] hover:border-r-blue-500 transition-colors cursor-pointer group" onClick={() => onNavigate('Omni-Command', { filter: 'FI_BLOCKERS' })}>
                <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1 flex justify-between items-center group-hover:text-blue-500 transition-colors"><span>F&I Blockers</span> <CreditCard className="w-3 h-3 text-blue-500"/></div>
                <div className="text-2xl font-bold text-white mb-1"><DrillDownValue value="5" label="F&I Blockers" type="Action" onDrillDown={onDrillDown} color="text-white" /></div>
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
                   <div className="text-4xl text-white font-playfair"><DrillDownValue value={db.responseTimesAvg} label="Avg First Response" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>
                   <div className="text-xs text-green-500 mt-2 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30 w-fit mx-auto">-4m vs Last MTD</div>
                </div>
                <div className="bg-charcoal border border-border p-4 rounded flex-1 flex flex-col justify-center items-center text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Report', { name: "Lost Deal Matrix" })}>
                   <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2 group-hover:text-gold transition-colors">Total Lost Deals</div>
                   <div className="text-4xl text-white font-playfair"><DrillDownValue value={db.lostCount} label="Lost Deals" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>
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
                           <span className="text-white font-bold group-hover:text-gold transition-colors block"><DrillDownValue value={r.name} label="Rep Profile" type="Employee" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors block" /></span>
                           <span className="text-[10px] text-text-muted font-mono uppercase">Avg Margin: <DrillDownValue value="$2.4k" label="Rep Margin" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white" /></span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-green-500 font-bold bg-green-900/20 border border-green-500/30 px-2 py-0.5 rounded mb-1"><DrillDownValue value={`${r.units} Units`} label="Total Units" type="Report" onDrillDown={onDrillDown} color="text-green-500" /></span>
                          <span className="text-gold font-mono text-sm block"><DrillDownValue value={`$${r.gross.toLocaleString()}`} label="Gross Profit" type="Report" onDrillDown={onDrillDown} color="text-gold" /></span>
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
                           <span className="text-white group-hover:text-gold transition-colors"><DrillDownValue value={s.stage} label="Aging Stage" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></span>
                           <span className="text-amber-500 font-mono"><DrillDownValue value={`${s.avgDays} days avg`} label="Average Aging" type="Report" onDrillDown={onDrillDown} color="text-amber-500" /></span>
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
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors"><DrillDownValue value="Hot" label="Hot Queue" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-green-500 h-full w-[12%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded"><DrillDownValue value={db.scoreDistribution.hot} label="Hot Leads Count" type="Report" onDrillDown={onDrillDown} color="text-gold" /></span>
                    </div>
                    <div className="flex items-center justify-between text-xs cursor-pointer group" onClick={() => onDrillDown('Report', { name: 'Warm Leads Queue', records: db.warmData })}>
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors"><DrillDownValue value="Warm" label="Warm Queue" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-amber-500 h-full w-[45%]"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded"><DrillDownValue value={db.scoreDistribution.warm} label="Warm Leads Count" type="Report" onDrillDown={onDrillDown} color="text-gold" /></span>
                    </div>
                    <div className="flex items-center justify-between text-xs cursor-pointer group" onClick={() => onDrillDown('Report', { name: 'Cold Leads Queue', records: db.coldData })}>
                       <span className="text-white font-bold w-12 group-hover:text-gold transition-colors"><DrillDownValue value="Cold" label="Cold Queue" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></span> 
                       <div className="flex-1 bg-black h-5 mx-3 rounded border border-border overflow-hidden"><div className="bg-blue-500 h-full w-[80%] opacity-50"></div></div> 
                       <span className="font-mono text-gold bg-gold/10 px-1.5 rounded"><DrillDownValue value={db.scoreDistribution.cold} label="Cold Leads Count" type="Report" onDrillDown={onDrillDown} color="text-gold" /></span>
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
                       <div key={idx} className="flex items-center justify-between p-3 bg-black border border-border rounded cursor-pointer hover:border-gold-dim transition-colors group" onClick={() => onDrillDown('Action', { name: `Processing Queue: $<DrillDownValue value={row.type} label="Context" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" />` })}>
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full ${row.bg} flex items-center justify-center`}><AlertCircle className={`w-4 h-4 ${row.color}`}/></div>
                             <div>
                                <div className="text-white text-sm font-bold group-hover:text-gold transition-colors"><DrillDownValue value={row.type} label="Context" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>
                                <div className="text-[10px] text-text-muted uppercase font-mono tracking-wide"><DrillDownValue value={`${row.customer} • ${row.ago}`} label="Customer Record" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" /></div>
                             </div>
                          </div>
                          <span className={`${row.color} border border-current px-2 py-0.5 rounded text-[10px] font-bold tracking-widest`}><DrillDownValue value={row.status} label="Review Status" type="Report" onDrillDown={onDrillDown} color={row.color} /></span>
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
                 <div className="text-2xl font-bold text-white group-hover:text-gold drop-shadow-md"><DrillDownValue value={db.serviceToSales.toString()} label="Svc to Sales Ops" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold drop-shadow-md" /></div>
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



const CopilotModal = ({ isOpen, onClose, onDrillDown }) => {
  const [query, setQuery] = useState("");
  
  const allInv = getGlobalInventory();
  
  const searchResults = useMemo(() => {
    if (query.length <= 2) return [];
    const q = query.toLowerCase();
    
    const custMatches = CUSTOMERS.filter(c => 
      c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
    ).map(c => ({
      id: c.id,
      title: c.name,
      subtitle: `${c.phone} • ${c.email}`,
      type: 'Customer',
      icon: User,
      action: () => onDrillDown('CRM_Customer360', { customerId: c.id, customerName: c.name })
    }));

    const invMatches = allInv.filter(i => 
      i.stock.toLowerCase().includes(q) || i.vin.toLowerCase().includes(q) || i.model.toLowerCase().includes(q) || (i.brandName && i.brandName.toLowerCase().includes(q))
    ).map(i => ({
      id: i.id,
      title: `${i.year} ${i.brandName} ${i.model}`,
      subtitle: `Stock: ${i.stock} • VIN: ${i.vin}`,
      type: 'Inventory',
      icon: Bike,
      badge: i.status === 'Active' ? null : i.status,
      action: () => onDrillDown('Inventory', { stock: i.stock, make: i.brandName, unit: `${i.year} ${i.model}` })
    }));

    const roMatches = SERVICE_ORDERS.filter(ro => 
      ro.id.toLowerCase().includes(q) || (ro.unitDesc && ro.unitDesc.toLowerCase().includes(q))
    ).map(ro => ({
      id: ro.id,
      title: `Repair Order: ${ro.id}`,
      subtitle: `Unit: ${ro.unitDesc} • Status: ${ro.status}`,
      type: 'Service RO',
      icon: Wrench,
      action: () => onDrillDown('Action', { name: "Inspect Service RO", message: `Opening Repair Order ${ro.id}` })
    }));

    // Limit to prevent huge DOM slowdowns on vague searches like "a"
    return [...custMatches, ...invMatches, ...roMatches].slice(0, 10);
  }, [query, allInv]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/80 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-charcoal border border-border rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center border-b border-border px-4 py-3 bg-panel/50">
          <Search className="w-5 h-5 text-gold mr-3" />
          <input 
            autoFocus 
            type="text" 
            placeholder="Search Customers, VINs, Stock#, or ask Copilot..." 
            className="w-full bg-transparent text-white text-lg focus:outline-none placeholder-text-muted"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs font-mono text-text-dim border border-border px-2 py-1 rounded ml-3">ESC</div>
        </div>
        
        {query.length > 2 ? (
          <div className="p-4 bg-charcoal max-h-[60vh] overflow-y-auto hidden-scrollbar">
            {query.toLowerCase().includes('aged') && query.toLowerCase().includes('yamaha') && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">AI Copilot Analysis</h3>
                <div className="p-4 bg-panel border-l-4 border-gold rounded text-white text-sm leading-relaxed">
                  <strong>Copilot:</strong> I found 4 Yamaha units currently on floorplan that have aged past 90 days. Their combined floorplan carry cost is currently $48/day. I recommend moving 2 of them to the Slidell location based on their faster turn rate for these specific models.
                </div>
              </div>
            )}
            
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Global Records ({searchResults.length})</h3>
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-sm text-text-muted italic p-4 text-center border border-dashed border-border rounded">No records match '{query}' across Dealership data.</div>
              ) : (
                searchResults.map(res => {
                  const Icon = res.icon;
                  return (
                    <div key={res.id} onClick={() => { onClose(); res.action(); }} className="p-3 bg-panel hover:bg-black border border-border rounded cursor-pointer transition-colors flex justify-between items-center text-white group">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="bg-charcoal p-1.5 rounded border border-border group-hover:border-gold transition-colors"><Icon className="w-4 h-4 text-gold"/></div>
                          <span className="font-bold text-sm tracking-wide">{res.title}</span>
                          <span className="text-[10px] uppercase font-mono bg-black text-text-muted px-2 py-0.5 border border-border rounded">{res.type}</span>
                        </div>
                        <div className="text-xs text-text-muted font-mono tracking-wide pl-[2.25rem]">{res.subtitle}</div>
                      </div>
                      {res.badge && <StatusChip status={res.badge} color="text-amber-500" />}
                    </div>
                  );
                })
              )}
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

const OmniCommandModule = ({ onDrillDown, initialContext }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [view, setView] = useState("Review");
  const [selectedRecs, setSelectedRecs] = useState(new Set());
  const [toasts, setToasts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(initialContext?.filter || 'ALL');

  useEffect(() => {
     if (initialContext?.filter) {
        setCategoryFilter(initialContext.filter);
        setView("Review");
     }
  }, [initialContext]);
  
  // Phase 15.5: AI Interrogation Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
     { sender: 'AI', text: 'I am the Omni-Command Orchestrator. Ask me to break down any active strategy or agent decision.' }
  ]);

  const fetchRecs = async () => {
     await AgentRegistry.broadcastTrigger({ type: 'APP_BOOT', timestamp: new Date().toISOString() }, { userId: 'EMP-1', role: 'Owner', locationId: 'ALL' });
     setRecommendations(RecommendationService.fetchPending({ userRole: 'Owner' }));
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  // Phase 15.4: Live Simulated Pulse Generator
  useEffect(() => {
    const TOAST_EVENTS = [
       { title: 'Neural Signal Intercepted', msg: 'Lead assigned via Fast-Track VIP lane.', agent: 'Lead Intel Agent' },
       { title: 'Price Floor Triggered', msg: 'Aged Unit 4125 identified. Slingshot queued.', agent: 'Inventory Matchmaker' },
       { title: 'Background Processing', msg: 'Re-evaluating 45 stalled leads. No anomalies.', agent: 'Sales Desk Copilot' },
       { title: 'SLA Breach Averted', msg: 'Ghosted Lead manually bumped to General Manager.', agent: 'Lead Intel Agent' }
    ];

    const generatePulse = () => {
       const ev = TOAST_EVENTS[Math.floor(Math.random() * TOAST_EVENTS.length)];
       const id = Date.now();
       setToasts(prev => [...prev.slice(-4), { id, ...ev }]);
       
       // Autodismiss
       setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);

       // Queue next pulse between 15s - 35s
       setTimeout(generatePulse, 15000 + Math.random() * 20000);
    };

    // Kickoff first pulse in 5 seconds
    const timer = setTimeout(generatePulse, 5000);
    return () => clearTimeout(timer);
  }, []);

  const executeAction = (recId) => {
    // Optimistically update
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'APPROVED' } : r));
    const execution = ActionExecutionService.executeRecommendation(recId, { userId: 'EMP-1' });
    if (execution.status === 'ERROR') {
       alert("Error executing action: " + execution.error);
    }
  };

  const snoozeAction = (recId) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'SNOOZED' } : r));
  };

  const dismissAction = (recId) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'DISMISSED' } : r));
  };

  const deleteAction = (recId) => {
    setRecommendations(prev => prev.filter(r => r.id !== recId));
  };

  const getFilteredRecs = (statusGroup) => {
     let filtered = [];
     if (statusGroup === 'Review') filtered = recommendations.filter(r => !r.status || r.status.toUpperCase() === 'PENDING' || r.status.toUpperCase() === 'UNRESOLVED');
     else filtered = recommendations.filter(r => r.status.toUpperCase() === statusGroup.toUpperCase());
     
     if (categoryFilter !== 'ALL') {
        if (categoryFilter === 'URGENT') filtered = filtered.filter(r => r.priority === 'URGENT');
        if (categoryFilter === 'STALLED_OPPS') filtered = filtered.filter(r => r.agentId === 'bdc_followup_agent' || r.agentId === 'sales_desk_agent');
        if (categoryFilter === 'HOT_LEADS') filtered = filtered.filter(r => r.agentId === 'lead_intelligence_agent');
        if (categoryFilter === 'FI_BLOCKERS') filtered = filtered.filter(r => r.agentId === 'fi_readiness_agent');
     }
     return filtered;
  };

  const renderCard = (rec) => {
    const isSelected = selectedRecs.has(rec.id);
    const toggleSelection = (e) => {
      e.stopPropagation();
      const newSet = new Set(selectedRecs);
      if (newSet.has(rec.id)) newSet.delete(rec.id);
      else newSet.add(rec.id);
      setSelectedRecs(newSet);
    };

    return (
      <div key={rec.id} className={`bg-panel border p-4 rounded-lg flex flex-col justify-between shadow hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all group relative ${isSelected ? 'border-gold shadow-[0_0_10px_rgba(201,168,76,0.2)] bg-gold/5' : 'border-border'}`}>
         
         {/* Checkbox for Batch Processing */}
         {view === "Review" && (
            <div className="absolute top-3 left-3 z-20">
               <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={toggleSelection} 
                  className="w-4 h-4 cursor-pointer accent-gold bg-black/50 border border-border"
                  title="Select for Batch Process"
               />
            </div>
         )}
         
         {/* Top Right Actions */}
       <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
           <button onClick={(e) => { e.stopPropagation(); deleteAction(rec.id); }} className="text-text-muted hover:text-red-500 p-1 bg-black rounded border border-border" title="Delete Insight">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
           </button>
           <button onClick={(e) => { e.stopPropagation(); dismissAction(rec.id); }} className="text-text-muted hover:text-amber-500 p-1 bg-black rounded border border-border" title="Dismiss Insight">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
           </button>
       </div>

       <div className="cursor-pointer" onClick={() => onDrillDown('AgentRecommendation', rec)}>
         <div className="flex justify-between items-start mb-2 pr-16" title="Click to Read Strategy Deep-Dive">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${rec.priority === 'URGENT' ? 'bg-red-900/20 text-red-500 border-red-500/30' : rec.priority === 'HIGH' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-green-900/20 text-green-500 border-green-500/30'}`}>
              {rec.priority} PRIORITY
            </span>
            <span className="text-xs text-text-muted">{new Date(rec.generatedAt).toLocaleTimeString()}</span>
         </div>
         <h4 className="text-white font-bold text-sm mb-1 line-clamp-2 hover:text-gold transition-colors">{rec.title}</h4>
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
       
       <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-2 relative z-10">
          {view === "Review" ? (
             <>
               <button onClick={(e) => { e.stopPropagation(); executeAction(rec.id); }} className="flex-1 bg-gold text-black text-xs font-bold py-1.5 rounded hover:bg-gold-light transition-colors">Approve & Execute</button>
               <button onClick={(e) => { e.stopPropagation(); snoozeAction(rec.id); }} className="bg-black border border-border text-text hover:text-white text-xs px-3 py-1.5 rounded transition-colors">Snooze</button>
             </>
          ) : view === "Approved" ? (
             <div className="w-full text-center text-xs font-bold text-green-500 bg-green-900/20 py-1 rounded border border-green-500/20">Execution Logged</div>
          ) : view === "Dismissed" ? (
             <button onClick={(e) => { e.stopPropagation(); setRecommendations(prev => prev.map(r => r.id === rec.id ? { ...r, status: 'PENDING' } : r)); }} className="w-full text-center text-xs font-bold text-amber-500 bg-amber-900/20 py-1 rounded border border-amber-500/20 hover:bg-amber-800 transition-colors">Restore to Inbox</button>
          ) : (
             <button onClick={(e) => { e.stopPropagation(); setRecommendations(prev => prev.map(r => r.id === rec.id ? { ...r, status: 'PENDING' } : r)); }} className="w-full text-center text-xs font-bold text-amber-500 bg-amber-900/20 py-1 rounded border border-amber-500/20 hover:bg-amber-800 transition-colors">Wake from Snooze</button>
          )}
       </div>
    </div>
  );
};

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-charcoal border border-border rounded flex items-center justify-center text-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]">
               <Zap className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl font-playfair text-white flex items-center gap-3">
                 Omni-Command Center
                 {categoryFilter !== 'ALL' && (
                    <span className="text-xs font-mono bg-panel border border-gold/50 text-gold px-2 py-1 flex items-center gap-2 rounded">
                       FILTER: {categoryFilter.replace('_', ' ')}
                       <button onClick={() => setCategoryFilter('ALL')} className="hover:text-white transition-colors" title="Clear Filter"><X className="w-3 h-3" /></button>
                    </span>
                 )}
               </h1>
               <p className="text-text-muted text-sm border-l-2 border-gold pl-2 ml-1">Global Strategy & Execution Orchestration</p>
             </div>
          </div>
          
          <div className="flex bg-charcoal border border-border rounded overflow-hidden">
             {['Review', 'Approved', 'Snoozed', 'Dismissed', 'Ledger', 'Settings'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 text-sm font-bold transition-colors ${view === tab ? 'bg-gold text-black shadow-inner' : 'text-text-muted hover:bg-panel hover:text-white'}`}
                  onClick={() => setView(tab)}
                >
                  {tab} {(tab !== 'Ledger' && tab !== 'Settings') && `(${getFilteredRecs(tab).length})`}
                </button>
             ))}
          </div>

          <div className="flex items-center gap-3 ml-4">
             {selectedRecs.size > 0 && (
                <div className="flex bg-panel border border-gold/50 rounded overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-200">
                   <div className="px-3 py-2 text-sm text-gold font-bold bg-gold/10 border-r border-gold/30">{selectedRecs.size} Selected</div>
                   <button onClick={() => {
                      [...selectedRecs].forEach(id => executeAction(id));
                      setSelectedRecs(new Set());
                   }} className="px-3 py-2 text-sm hover:bg-gold hover:text-black font-bold text-white transition-colors">Batch Approve</button>
                   <button onClick={() => {
                      [...selectedRecs].forEach(id => dismissAction(id));
                      setSelectedRecs(new Set());
                   }} className="px-3 py-2 text-sm hover:bg-black hover:text-white text-text-muted transition-colors border-l border-gold/30">Batch Dismiss</button>
                </div>
             )}
             
             <button onClick={() => {
                setRecommendations([]); 
                setSelectedRecs(new Set());
                fetchRecs();
             }} className="flex items-center gap-2 bg-black hover:bg-panel border border-border text-white px-4 py-2 rounded text-sm font-bold transition-colors shadow">
                <RefreshCw className="w-4 h-4 text-gold" /> Rescan Network
             </button>
          </div>
       </div>

       {view === 'Ledger' ? (
          <div className="flex-1 bg-charcoal border border-border rounded-xl hidden-scrollbar flex flex-col relative z-0 mt-4">
             <div className="p-4 border-b border-border bg-black/50 flex justify-between items-center rounded-t-xl shrink-0">
                <h3 className="text-white font-bold flex items-center gap-2 font-mono uppercase tracking-widest text-sm"><Database className="w-4 h-4 text-gold"/> Master Execution Ledger</h3>
                <span className="text-xs text-text-muted font-mono bg-panel px-2 py-1 rounded border border-border">{AGENT_AUDIT_LOGS.length} Recorded Operations</span>
             </div>
             <div className="flex-1 overflow-y-auto hidden-scrollbar p-6">
                <div className="space-y-3">
                   {[...AGENT_AUDIT_LOGS].reverse().map(log => (
                      <div key={log.id || Math.random()} className="bg-black border border-border p-4 rounded flex justify-between items-center shadow-sm hover:border-gold/30 transition-colors group">
                         <div className="flex items-start gap-4">
                            <div className="mt-1">
                               {log.eventType === 'ACTION_EXECUTED' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : log.eventType === 'ACTION_REQUESTED' ? <Clock className="w-5 h-5 text-blue-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                            </div>
                            <div>
                               <div className="text-white font-bold text-sm mb-1 font-mono">{log.eventType}</div>
                               <div className="text-xs text-text-muted font-mono bg-charcoal inline-block px-1.5 py-0.5 rounded border border-border">Agent: {log.agentId} | User: {log.userId}</div>
                               <div className="text-[10px] text-text-muted/50 font-mono mt-2 break-all group-hover:text-text-muted transition-colors">ID: {log.details?.actionId || 'N/A'} | Target: {log.details?.actionType || log.details?.reason || 'Unknown'}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] text-text-muted font-mono border border-border/50 px-2 py-1 rounded bg-charcoal">
                               {new Date(log.timestamp).toLocaleString()}
                            </div>
                         </div>
                      </div>
                   ))}
                   {AGENT_AUDIT_LOGS.length === 0 && (
                      <div className="text-center text-text-muted py-12 border border-dashed border-border/50 rounded flex flex-col items-center">
                         <Database className="w-8 h-8 opacity-20 mb-3" />
                         <span className="text-sm font-bold uppercase tracking-widest">No Execution History</span>
                         <span className="text-xs mt-1">Audit ledger is completely barren. Execute an action to begin immutable tracking.</span>
                      </div>
                   )}
                </div>
             </div>
          </div>
       ) : view === 'Settings' ? (
          <div className="flex-1 bg-charcoal border border-border rounded-xl hidden-scrollbar flex flex-col relative z-0 mt-4 overflow-y-auto p-6">
             <div className="mb-8">
                <h3 className="text-white font-playfair text-2xl mb-2 flex items-center gap-3"><Command className="w-6 h-6 text-gold"/> Autonomous Processing Thresholds</h3>
                <p className="text-text-muted text-sm border-l-2 border-gold pl-3">Manually throttle the routing sensitivity of the neural processing agents. Changes take effect on the next network rescan.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black border border-border p-5 rounded-lg shadow-inner">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="text-gold font-mono uppercase tracking-widest text-xs font-bold mb-1">Lead Intelligence Agent</h4>
                         <div className="text-white text-sm">VIP Fast-Track Score Threshold</div>
                      </div>
                      <div className="bg-charcoal border border-border px-3 py-1 rounded text-white font-bold font-mono">
                         {AGENT_THRESHOLDS.leadVIP}/100
                      </div>
                   </div>
                   <input type="range" min="50" max="99" defaultValue={AGENT_THRESHOLDS.leadVIP} onChange={(e) => AGENT_THRESHOLDS.leadVIP = Number(e.target.value)} className="w-full accent-gold bg-charcoal" />
                   <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono uppercase">
                      <span>Aggressive (50)</span>
                      <span>Conservative (99)</span>
                   </div>
                   <p className="text-xs text-text-muted mt-4">Lowering this threshold will cause the AI to immediately bump more baseline web-leads to Senior Sales Associates via the VIP queue.</p>
                </div>
                
                <div className="bg-black border border-border p-5 rounded-lg shadow-inner">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="text-gold font-mono uppercase tracking-widest text-xs font-bold mb-1">Inventory Operations</h4>
                         <div className="text-white text-sm">Aged Unit Distress Threshold</div>
                      </div>
                      <div className="bg-charcoal border border-border px-3 py-1 rounded text-white font-bold font-mono">
                         {AGENT_THRESHOLDS.inventoryAged} Days
                      </div>
                   </div>
                   <input type="range" min="30" max="180" step="15" defaultValue={AGENT_THRESHOLDS.inventoryAged} onChange={(e) => AGENT_THRESHOLDS.inventoryAged = Number(e.target.value)} className="w-full accent-gold bg-charcoal" />
                   <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono uppercase">
                      <span>Hyper-Active (30)</span>
                      <span>Passive (180)</span>
                   </div>
                   <p className="text-xs text-text-muted mt-4">Lowering this will force the AI to recommend aggressive Slingshot incentives on units much earlier in their lot-life.</p>
                </div>

             </div>
          </div>
       ) : (
          <div className="flex-1 bg-charcoal border border-border rounded-xl p-4 overflow-y-auto mt-4">
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
       )}

       {/* Phase 15.4: Live Pulse Toast Container */}
       <div className="fixed bottom-6 right-6 w-80 space-y-3 z-50 pointer-events-none">
          {toasts.map(toast => (
             <div key={toast.id} className="bg-black/90 backdrop-blur border border-gold/50 p-4 rounded-lg shadow-[0_0_20px_rgba(201,168,76,0.15)] animate-in slide-in-from-right fade-in duration-300 pointer-events-auto group">
                <div className="flex items-center gap-2 mb-1">
                   <Activity className="w-4 h-4 text-electric animate-pulse"/>
                   <span className="text-white font-bold text-sm tracking-wide">{toast.title}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{toast.msg}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50">
                   <span className="text-[10px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20">{toast.agent}</span>
                   <span className="text-[10px] text-text-dim">Just now</span>
                </div>
                
                {/* Dismiss button on hover */}
                <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="absolute top-2 right-2 text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <X className="w-4 h-4" />
                </button>
             </div>
          ))}
       </div>

       {/* Phase 15.5: Direct AI Chat Interrogation */}
       <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none">
          {isChatOpen && (
             <div className="bg-black border border-electric/50 w-96 rounded-t-lg rounded-br-lg shadow-[0_0_30px_rgba(0,195,255,0.15)] flex flex-col pointer-events-auto mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in">
                <div className="bg-electric/20 p-3 flex justify-between items-center border-b border-electric/30">
                   <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-electric" />
                      <span className="text-white font-mono text-xs font-bold uppercase tracking-widest">Orchestrator Terminal</span>
                   </div>
                   <button onClick={() => setIsChatOpen(false)} className="text-text-muted hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="h-64 p-4 overflow-y-auto space-y-4 hidden-scrollbar bg-charcoal/50">
                   {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.sender === 'USER' ? 'bg-gold text-black font-medium rounded-tr-none' : 'bg-panel border border-border text-white rounded-tl-none font-mono text-xs'}`}>
                            {msg.text}
                         </div>
                      </div>
                   ))}
                </div>
                <div className="p-3 bg-black border-t border-border flex items-center">
                   <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      placeholder="Interrogate neural models..." 
                      className="flex-1 bg-transparent border-none text-white text-sm outline-none px-2 font-mono"
                      onKeyDown={(e) => {
                         if (e.key === 'Enter' && chatInput.trim()) {
                            setChatHistory(prev => [...prev, { sender: 'USER', text: chatInput }]);
                            setChatInput("");
                            setTimeout(() => {
                               setChatHistory(prev => [...prev, { sender: 'AI', text: "Accessing strategy graph... All agent recommendations map strictly to LTV and current floorplan liabilities. What specific strategy array would you like me to unpack?" }]);
                            }, 800);
                         }
                      }}
                   />
                </div>
             </div>
          )}
          
          <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className={`w-14 h-14 rounded-full flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all ${isChatOpen ? 'bg-panel border border-border text-white' : 'bg-electric text-black hover:scale-105'}`}
          >
             {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
       </div>

    </div>
  );
};

const CommunicationFlyout = ({ isOpen, onClose, incomingCall, onDrillDown }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed top-16 right-0 bottom-0 w-80 bg-charcoal border-l border-border shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
       <div className="p-4 border-b border-border flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-2">
             <Phone className="w-5 h-5 text-gold" />
             <span className="font-bold text-white tracking-widest font-mono text-sm uppercase">Live Connect</span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white"><X className="w-5 h-5" /></button>
       </div>
       
       <div className="p-4 flex-1 overflow-y-auto">
          {incomingCall ? (
             <div className="bg-panel rounded-lg border border-green-500/50 p-4 mb-4 shadow-[0_0_15px_rgba(34,197,94,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                      <PhoneCall className="w-4 h-4 animate-bounce" /> INCOMING CALL
                   </div>
                   <span className="text-xs text-text-muted">00:14</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">{incomingCall.name}</div>
                <div className="text-sm font-mono text-text-muted mb-4">{incomingCall.phone}</div>
                
                <div className="grid grid-cols-2 gap-2">
                   <button className="bg-green-600 hover:bg-green-500 text-white py-2 rounded text-xs font-bold transition-colors" onClick={() => onDrillDown('Action', { name: "Answer Call", message: "Connecting SIP trunk to agent..." })}>Answer</button>
                   <button className="bg-red-900/40 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded text-xs font-bold transition-colors" onClick={() => { onClose(); }}>Decline</button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                   <button className="w-full bg-black hover:bg-gold/10 hover:text-gold border border-border text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors" onClick={() => { onClose(); onDrillDown('CRM_Customer360', { customerId: incomingCall.id || 'CUST-2' }); }}>
                      <User className="w-4 h-4" /> Open CRM Profile
                   </button>
                </div>
             </div>
          ) : (
             <div className="text-center py-8 text-text-muted">
                <Phone className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <div className="text-sm font-mono uppercase tracking-widest">No Active Calls</div>
             </div>
          )}
          
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 mt-6">Recent Activity</h3>
          <div className="space-y-2">
             <div className="bg-black p-3 rounded border border-border cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Action', {name: "View SMS", message: "Opening SMS thread with Mike T."})}>
                <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-2 text-white text-sm font-bold"><MessageSquareText className="w-3 h-3 text-gold" /> Mike T.</div>
                   <div className="text-[10px] text-text-muted">10m ago</div>
                </div>
                <div className="text-xs text-text-muted truncate">"Is that R1 still available at Slidell?"</div>
             </div>
             <div className="bg-black p-3 rounded border border-border cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Action', {name: "View Call", message: "Opening Call log for 504-555-8821"})}>
                <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-2 text-white text-sm font-bold"><PhoneForwarded className="w-3 h-3 text-gold" /> Outbound Call</div>
                   <div className="text-[10px] text-text-muted">1h ago</div>
                </div>
                <div className="text-xs text-text-muted truncate">Follow-up with Finance on Honda deal</div>
             </div>
          </div>
       </div>
    </div>
  );
};

/* --- APP SHELL --- */
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeTabContext, setActiveTabContext] = useState(null);
  const [drillDown, setDrillDown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState("Friendly Powersports");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [activeReportContext, setActiveReportContext] = useState(null);
  const [enableDashboardV2, setEnableDashboardV2] = useState(false);
  const [isCommsOpen, setIsCommsOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingCall({
        name: "Sarah Miller",
        phone: "(504) 555-0192",
        status: "Ringing...",
        type: "Sales Inquiry",
        id: "CUST-2"
      });
      setIsCommsOpen(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (tabName, context = null) => {
     setActiveTabContext(context);
     setActiveTab(tabName);
     setIsMobileMenuOpen(false); // Auto-close mobile menu on navigation
  };

  const handleDrillDown = (type, data) => {
     let contextData = { ...data };
     const typeUpper = (type || '').toUpperCase();
     
     // Phase 10: Automatic Schema Mapping for Orphaned UI triggers
     if (!contextData.reportId) {
         if (typeUpper === 'OEM') {
             contextData.reportId = 'OEM_INCENTIVES';
             contextData.searchTerm = contextData.brand || '';
         }
         else if (typeUpper === 'FINANCIALS') contextData.reportId = 'FINANCIAL_LEDGER';
         else if (typeUpper === 'EMPLOYEE') contextData.reportId = 'EMPLOYEE_PERFORMANCE';
         else if (typeUpper === 'INVENTORY') {
             contextData.reportId = 'INV_AGING';
             contextData.searchTerm = contextData.make || contextData.unit || contextData.stock || '';
         }
     }

     // If the router matched a dataset, load full-screen Grid
     if (contextData?.reportId) {
        setActiveReportContext(contextData);
        setActiveTab("ReportDetail");
        return;
     }

     setDrillDown({ type, data: contextData });
  };

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
    { name: "Payroll", icon: DollarSign },
    { name: "Marketing", icon: Megaphone },
    { name: "OEM Incentives", icon: Award },
    { name: "Reports", icon: FileBarChart },
    { name: "Accounting & GL", icon: Briefcase },
    { name: "Employee Hub", icon: UsersIcon },
    { name: "Settings", icon: Settings },
    { name: "Clock In / HR", icon: Clock },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`w-64 bg-charcoal border-r border-border flex flex-col fixed md:relative z-50 h-full transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
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
        <div className="h-16 bg-charcoal border-b border-border flex items-center justify-between px-4 md:px-6 z-10">
          <div className="flex items-center text-sm font-mono text-text-dim">
            <button 
              className="md:hidden mr-3 text-white hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="hover:text-white cursor-pointer hidden sm:inline" onClick={() => setActiveTab('Dashboard')}>Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-2 hidden sm:inline" />
            <span className="text-gold">{activeTab}</span>
            {activeTab === 'Dashboard' && (
               <button 
                  onClick={() => setEnableDashboardV2(!enableDashboardV2)}
                  className="ml-4 text-[10px] bg-panel hover:bg-black border border-border text-text-muted hover:text-white px-2 py-1 rounded transition-colors uppercase tracking-widest"
               >
                  {enableDashboardV2 ? 'Switch to V1 (Legacy Tabs)' : 'Try Dashboard V2'}
               </button>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2" />
              <input type="text" placeholder="Search Copilot... (Cmd+K)" className="bg-black border border-border rounded-full py-1.5 pl-9 pr-4 text-sm w-64 focus:outline-none focus:border-gold text-white cursor-pointer" readOnly />
            </div>
            
            <div className="relative cursor-pointer group" onClick={() => setIsCommsOpen(true)}>
              <Phone className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
              {incomingCall && (
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-white border border-charcoal animate-pulse">
                   1
                 </div>
              )}
            </div>
            
            <div className="relative cursor-pointer group" onClick={() => handleDrillDown('Notification', { 
              name: "System Notifications", 
              items: [
                 { id: 1, title: "New Web Lead", desc: "John Doe interested in 2024 YZF-R7.", time: "2 min ago", unread: true, priority: "High", icon: "user" },
                 { id: 2, title: "Margin Alert", desc: "Unit #40552 priced below floorplan threshold.", time: "14 min ago", unread: true, priority: "Action", icon: "alert" },
                 { id: 3, title: "Approval Granted", desc: "Manager approved trade-in override for Deal #492.", time: "1 hr ago", unread: true, priority: "Normal", icon: "check" },
                 { id: 4, title: "AI Strategy Inject", desc: "New budget reallocation strategy generated.", time: "2 hrs ago", unread: false, priority: "Normal", icon: "brain" },
                 { id: 5, title: "Payroll Exception", desc: "Lars Ulrich missed clock-out.", time: "4 hrs ago", unread: false, priority: "Action", icon: "clock" },
                 { id: 6, title: "Part Arrived", desc: "Special order stator received for RO# 4402.", time: "1 day ago", unread: false, priority: "Normal", icon: "wrench" },
                 { id: 7, title: "Global Sync", desc: "CycleTrader inventory synchronized.", time: "1 day ago", unread: false, priority: "Low", icon: "sync" }
              ] 
            })}>
              <Bell className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-white border border-charcoal">
                7
              </div>
            </div>

            <div className="flex items-center gap-4 ml-2 border-l border-border pl-4">
              <button onClick={() => setActiveTab('Clock In / HR')} className="text-text-muted hover:text-gold transition-colors flex items-center gap-1" title="Clock In / HR">
                 <Clock className="w-5 h-5" />
              </button>
              <button onClick={() => setActiveTab('Sales')} className="text-xs bg-gold hover:bg-gold-light text-black px-4 py-1.5 rounded font-bold transition-colors shadow-sm">+ New Deal</button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE MODULE RENDERER */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "Dashboard" && enableDashboardV2 && <DashboardV2Module onNavigate={handleNavigate} onDrillDown={handleDrillDown} userRole={currentUser?.role} company={activeCompany} location={activeLocation} />}
            {activeTab === "Dashboard" && !enableDashboardV2 && <OperationalDashboardsModule onNavigate={handleNavigate} onDrillDown={handleDrillDown} userRole={currentUser?.role} company={activeCompany} location={activeLocation} />}
            {activeTab === "Sales" && <SalesModule onNavigate={handleNavigate} onDrillDown={handleDrillDown} />}
            {activeTab === "Omni-Command" && <OmniCommandModule onDrillDown={handleDrillDown} initialContext={activeTabContext} />}
            {activeTab === "Customer CRM" && <CustomerCRMModule onDrillDown={handleDrillDown} user={currentUser} />}
            {activeTab === "AI Command Center" && <AICommandCenterModule onDrillDown={handleDrillDown} userRole={currentUser?.role} initialContext={activeTabContext} />}
            {activeTab === "F&I / Finance" && <FIModule onDrillDown={handleDrillDown} />}
            {activeTab === "Inventory" && <InventoryModule onDrillDown={handleDrillDown} />}
            {activeTab === "Used Bikes / UBD" && <UsedBikesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Service & Parts" && <ServicePartsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Payroll" && <PayrollModule onDrillDown={handleDrillDown} />}
            {activeTab === "OEM Incentives" && <OEMIncentivesModule onDrillDown={handleDrillDown} />}
            {activeTab === "Marketing" && <MarketingModule onDrillDown={handleDrillDown} />}
            {activeTab === "Reports" && <ReportsModule onDrillDown={handleDrillDown} />}
            {activeTab === "ReportDetail" && <DetailReportView reportPayload={activeReportContext} onNavigate={setActiveTab} onDrillDown={handleDrillDown} />}
            {activeTab === "Accounting & GL" && <AccountingGLModule onDrillDown={handleDrillDown} />}
            {activeTab === "Employee Hub" && <EmployeeHubModule user={currentUser} onDrillDown={handleDrillDown} />}
            {activeTab === "Settings" && <SettingsModule onDrillDown={handleDrillDown} />}
            {activeTab === "Clock In / HR" && <ClockInModule user={currentUser} onDrillDown={handleDrillDown} />}
            {![ "Dashboard", "Omni-Command", "Sales", "Customer CRM", "AI Command Center", "F&I / Finance", "Inventory", "Used Bikes / UBD", "Service & Parts", "Payroll", "OEM Incentives", "Marketing", "Reports", "ReportDetail", "Accounting & GL", "Employee Hub", "Settings", "Clock In / HR" ].includes(activeTab) && (
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
      <CommunicationFlyout isOpen={isCommsOpen} onClose={() => setIsCommsOpen(false)} incomingCall={incomingCall} onDrillDown={handleDrillDown} />
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

import { EmployeeHubModule } from './components/ui/EmployeeHubModule';
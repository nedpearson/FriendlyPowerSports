import React, { useState, useMemo } from 'react';
import { 
  Settings, Users, Building2, Briefcase, DollarSign, Activity, 
  ShieldCheck, Wrench, Search, Plus, Save, Bell, CheckCircle2,
  XCircle, Filter, FileText, ChevronRight, Lock, Trash2, BrainCircuit
} from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';

// Import the existing mock data purely for reads so we don't break existing App state
import { 
  LOCATIONS, EMPLOYEES, DEPARTMENTS, LENDERS, BRANDS, CRM_AUTOMATION_RULES, AGENT_THRESHOLDS
} from '../../data/mockDatabase';

const SETTINGS_SECTIONS = [
  { id: 'org', label: 'Organization & Locations', icon: Building2 },
  { id: 'users', label: 'User & Role Management', icon: Users },
  { id: 'finance', label: 'Lender & Finance Config', icon: DollarSign },
  { id: 'rules', label: 'Lead & CRM Engine', icon: Activity },
  { id: 'departments', label: 'Department Settings', icon: Briefcase },
  { id: 'ai_engine', label: 'AI Rules Engine', icon: BrainCircuit },
  { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck },
  { id: 'system', label: 'System & Integrations', icon: Wrench },
];

export const SettingsModule = ({ onDrillDown }) => {
  const [activeSection, setActiveSection] = useState('org');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [tick, setTick] = useState(0);

  // --- SAFE MUTATION HANDLERS (Simulated Database Operations) ---
  const handleAddLocation = () => {
    const name = window.prompt("Enter new Dealership/Location name:");
    if (name) {
      LOCATIONS.push({ id: `LOC-${Date.now()}`, name, type: 'Full Line', gm: 'Pending Assignment' });
      setTick(t => t + 1);
    }
  };
  const handleDeleteLocation = (id) => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to deactivate and remove this location? This will orphan its inventory and deals!")) {
      const idx = LOCATIONS.findIndex(l => l.id === id);
      if (idx > -1) { LOCATIONS.splice(idx, 1); setTick(t => t + 1); }
    }
  };

  const handleAddUser = () => {
    const name = window.prompt("Enter new User/Employee full name:");
    if (name) {
      EMPLOYEES.push({ id: `EMP-${Date.now()}`, name, role: 'Employee', locationId: 'ALL', avatar: name.charAt(0), active: true, commRate: 0.10 });
      setTick(t => t + 1);
    }
  };
  const handleDeleteUser = (id) => {
    if (window.confirm("WARNING: Revoking this access will permanently delete the user from Active Directory. Proceed?")) {
      const idx = EMPLOYEES.findIndex(e => e.id === id);
      if (idx > -1) { EMPLOYEES.splice(idx, 1); setTick(t => t + 1); }
    }
  };

  const handleAddLender = () => {
    const name = window.prompt("Enter new Financial Institution / Lender Name:");
    if (name) {
      LENDERS.push({ id: `LEND-${Date.now()}`, name, type: 'Manual' });
      setTick(t => t + 1);
    }
  };
  const handleDeleteLender = (id) => {
    if (window.confirm("WARNING: Deleting this lender will sever its active API link. Deals in transit will fail to fund. Proceed?")) {
      const idx = LENDERS.findIndex(l => l.id === id);
      if (idx > -1) { LENDERS.splice(idx, 1); setTick(t => t + 1); }
    }
  };

  const handleAddRule = () => {
    const name = window.prompt("Enter name for new CRM Automation Rule Node:");
    if (name) {
      CRM_AUTOMATION_RULES.push({ id: `AR-${Date.now()}`, name, trigger: 'Manual Trigger Event', condition: 'No filter', action: 'Draft Action', owner: 'System', active: false });
      setTick(t => t + 1);
    }
  };
  const handleDeleteRule = (id) => {
    if (window.confirm("Are you sure you want to delete this Copilot Automation Rule?")) {
      const idx = CRM_AUTOMATION_RULES.findIndex(r => r.id === id);
      if (idx > -1) { CRM_AUTOMATION_RULES.splice(idx, 1); setTick(t => t + 1); }
    }
  };

  // Simulated Global Save Event
  const handleGlobalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onDrillDown('Action', { name: 'Configuration Saved', message: 'All Dealership rules and routing settings have been flushed to the multi-tenant database.' });
    }, 800);
  };

  // 1. Organization & Locations View
  const renderOrgSettings = () => (
    <div className="space-y-6 fade-in">
      <div className="bg-charcoal p-6 rounded border border-border/50">
         <h2 className="text-xl font-bold text-white mb-4 border-b border-border/50 pb-2">Dealership Legal Hierarchy</h2>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs text-text-muted font-mono uppercase tracking-wider block mb-1">Business DBA Name</label>
               <input type="text" defaultValue="Friendly PowerSports" className="w-full bg-black border border-border rounded p-2 text-white focus:border-gold outline-none" />
            </div>
            <div>
               <label className="text-xs text-text-muted font-mono uppercase tracking-wider block mb-1">Corporate Tax ID</label>
               <input type="password" defaultValue="XX-XXXXXXX" className="w-full bg-black border border-border rounded p-2 text-white focus:border-gold outline-none" />
            </div>
            <div>
               <label className="text-xs text-text-muted font-mono uppercase tracking-wider block mb-1">Global Timezone</label>
               <select className="w-full bg-black border border-border rounded p-2 text-white outline-none">
                 <option>America/Chicago (CST)</option>
                 <option>America/New_York (EST)</option>
               </select>
            </div>
         </div>
      </div>
      
      <div className="bg-charcoal p-6 rounded border border-border/50">
        <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
           <h2 className="text-xl font-bold text-white">Rooftops & Locations</h2>
           <button onClick={handleAddLocation} className="flex items-center gap-1 text-xs bg-panel border border-border px-3 py-1 rounded text-white hover:border-gold transition-colors"><Plus className="w-3 h-3"/> Add Store</button>
        </div>
        <table className="w-full text-sm text-left">
           <thead className="text-xs text-text-muted bg-black font-mono">
             <tr>
               <th className="px-4 py-2 rounded-tl">Location UID</th>
               <th className="px-4 py-2">Store Name</th>
               <th className="px-4 py-2">Type</th>
               <th className="px-4 py-2">General Manager</th>
               <th className="px-4 py-2 rounded-tr text-right">Status</th>
             </tr>
           </thead>
           <tbody>
             {LOCATIONS.map(loc => (
               <tr key={loc.id} className="border-b border-border/30 hover:bg-black/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs opacity-50">{loc.id}</td>
                  <td className="px-4 py-3 font-bold text-gold"><DrillDownValue value={loc.name} label="Location Config" type="Settings" onDrillDown={onDrillDown} /></td>
                  <td className="px-4 py-3 text-text-muted">{loc.type}</td>
                  <td className="px-4 py-3"><DrillDownValue value={loc.gm} label="GM Profile" type="Employee" onDrillDown={onDrillDown} /></td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-bold mr-3">Active</span>
                    <button onClick={() => handleDeleteLocation(loc.id)} className="text-red-500 hover:text-red-400 align-middle"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );

  // 2. User & Role Management
  const renderUserManagement = () => (
    <div className="space-y-6 fade-in">
       <div className="flex gap-4 mb-4">
         <div className="flex-1 bg-black border border-border p-4 rounded flex items-center justify-between shadow-inner">
            <div>
               <div className="text-text-muted text-xs font-mono tracking-widest uppercase">Total Active Users</div>
               <div className="text-3xl font-bold text-white mt-1">{EMPLOYEES.filter(e => e.active).length}</div>
            </div>
            <Users className="w-8 h-8 text-gold opacity-20" />
         </div>
         <div className="flex-1 bg-black border border-border p-4 rounded flex items-center justify-between shadow-inner">
            <div>
               <div className="text-text-muted text-xs font-mono tracking-widest uppercase">Admin Roles</div>
               <div className="text-3xl font-bold text-blue-400 mt-1">{EMPLOYEES.filter(e => e.role.includes('Manager') || e.role === 'Owner').length}</div>
            </div>
            <ShieldCheck className="w-8 h-8 text-blue-400 opacity-20" />
         </div>
       </div>

       <div className="bg-charcoal p-6 rounded border border-border/50">
        <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
           <h2 className="text-xl font-bold text-white">Employee Roster & Roles</h2>
           <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2 text-text-muted" />
                <input type="text" placeholder="Search Users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-black border border-border rounded pl-8 pr-2 py-1.5 text-xs text-white focus:border-gold outline-none w-48" />
             </div>
             <button onClick={handleAddUser} className="flex items-center gap-1 text-xs bg-gold text-black font-bold border border-gold px-3 py-1.5 rounded hover:bg-gold-light transition-colors"><Plus className="w-3 h-3"/> Invite User</button>
           </div>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] hidden-scrollbar">
          <table className="w-full text-sm text-left">
             <thead className="text-[10px] uppercase tracking-widest text-text-muted bg-black font-mono sticky top-0 z-10">
               <tr>
                 <th className="px-4 py-3 rounded-tl">Employee</th>
                 <th className="px-4 py-3">Role Template</th>
                 <th className="px-4 py-3">Location Auth</th>
                 <th className="px-4 py-3">Data Visibility</th>
                 <th className="px-4 py-3 text-right">Actions</th>
               </tr>
             </thead>
             <tbody>
               {EMPLOYEES.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                 <tr key={emp.id} className="border-b border-border/30 hover:bg-black/30 transition-colors group">
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-panel border-border border flex items-center justify-center text-xs font-bold text-gold">{emp.avatar}</div>
                          <span className="font-bold text-white"><DrillDownValue value={emp.name} label="Edit Employee" type="Employee" onDrillDown={onDrillDown} /></span>
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`px-2 py-1 rounded text-xs border ${emp.role === 'Owner' || emp.role.includes('Manager') ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold' : 'bg-panel text-text-muted border-border'}`}>
                         {emp.role}
                       </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs opacity-70">{emp.locationId}</td>
                    <td className="px-4 py-3">
                       <span className="text-xs text-text-muted">{emp.role === 'Owner' ? 'Unrestricted' : 'Department/Assigned Only'}</span>
                    </td>
                    <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-xs text-text-muted hover:text-white underline mr-3" onClick={() => onDrillDown('Settings', {action: 'EditPermissions', emp})}>Permissions</button>
                       <button className="text-xs text-red-500 hover:text-red-400 underline" onClick={() => handleDeleteUser(emp.id)}>Revoke</button>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 3. Lender & Finance Configuration
  const renderFinanceConfig = () => (
    <div className="space-y-6 fade-in">
       <div className="bg-charcoal p-6 rounded border border-border/50">
        <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
           <h2 className="text-xl font-bold text-white">Lender Registry & Routing</h2>
           <button onClick={handleAddLender} className="bg-panel border border-border text-white px-3 py-1 rounded text-xs hover:border-gold transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> Add Lender</button>
        </div>
        <p className="text-xs text-text-muted mb-4 leading-relaxed max-w-2xl">
           Configure subvention priority, maximum markup vectors, and Automated Deal-Desk routing rules per financial institution.
        </p>
        <div className="grid gap-3">
           {LENDERS.map(lender => (
             <div key={lender.id} className="bg-black border border-border rounded p-4 flex items-center justify-between hover:border-gold-dim transition-all cursor-pointer" onClick={() => onDrillDown('Lender', lender)}>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-charcoal rounded flex items-center justify-center border border-border">
                      <DollarSign className="w-5 h-5 text-gold opacity-80" />
                   </div>
                   <div>
                      <div className="font-bold text-white text-lg">{lender.name}</div>
                      <div className="text-xs font-mono text-text-muted uppercase tracking-wider">Tier: {lender.type} | Integration: <span className="text-green-500">Active</span></div>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-2 md:mt-0">
                  <div className="flex items-center gap-4">
                     <span className="text-xs text-text-muted">Max Markup:</span>
                     <span className="text-sm font-bold text-white bg-panel px-2 py-1 rounded border border-border">2.00%</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs text-blue-400 underline" onClick={(e) => { e.stopPropagation(); onDrillDown('Settings', { action: 'ConfigureLender', lender }); }}>Configure Matrix</span>
                     <button onClick={(e) => { e.stopPropagation(); handleDeleteLender(lender.id); }} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4 cursor-pointer" /></button>
                  </div>
                </div>
             </div>
           ))}
        </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal p-6 rounded border border-border/50">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-border/50 pb-2">F&I Guardrails</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm text-white font-bold">Max Allowed Discount (VSC)</div>
                      <div className="text-xs text-text-muted">Agent override threshold limit</div>
                   </div>
                   <input type="text" defaultValue="$500" className="bg-panel border border-border w-24 text-right p-1.5 rounded text-white text-sm outline-none focus:border-gold" />
                </div>
                <div className="flex justify-between items-center bg-black p-3 rounded border border-border">
                   <div>
                      <div className="text-sm text-white font-bold">Compliance Disclosure Mode</div>
                      <div className="text-xs text-text-muted">Enforce adverse action checklist prep</div>
                   </div>
                   <input type="checkbox" defaultChecked className="accent-gold w-4 h-4 cursor-pointer" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  // 3.5 AI Engine Settings Configurator
  const renderAIEngine = () => (
    <div className="space-y-6 fade-in">
       <div className="bg-charcoal p-6 rounded border border-border/50">
         <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><BrainCircuit className="text-gold w-6 h-6"/> AI Copilot Threshold Settings</h2>
         </div>
         <p className="text-xs text-text-muted mb-6">Global operating parameters dictating when the AI RecommendationService triggers multi-departmental Action tasks.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black p-4 rounded border border-border flex flex-col justify-between">
               <div>
                  <div className="text-sm font-bold text-white mb-1">VIP Lead Score Threshold</div>
                  <div className="text-[10px] text-text-muted mb-3 leading-relaxed">Agent auto-assigns priority and alerts the GM if an unresponded lead has a score above this limit.</div>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <input type="range" min="50" max="99" defaultValue={AGENT_THRESHOLDS.leadVIP} onChange={(e) => { AGENT_THRESHOLDS.leadVIP = Number(e.target.value); setTick(t=>t+1); }} className="w-2/3 accent-gold" />
                  <span className="text-xl font-bold text-white bg-charcoal px-3 py-1 rounded border border-border">{AGENT_THRESHOLDS.leadVIP}</span>
               </div>
            </div>

            <div className="bg-black p-4 rounded border border-border flex flex-col justify-between">
               <div>
                  <div className="text-sm font-bold text-white mb-1">Aged Inventory Trigger (Days)</div>
                  <div className="text-[10px] text-text-muted mb-3 leading-relaxed">Agent detects distressed capital and generates cross-store transfer logic or manager markdown alerts after this many days on ground.</div>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <input type="range" min="30" max="180" defaultValue={AGENT_THRESHOLDS.inventoryAged} onChange={(e) => { AGENT_THRESHOLDS.inventoryAged = Number(e.target.value); setTick(t=>t+1); }} className="w-2/3 accent-gold" />
                  <span className="text-xl font-bold text-white bg-charcoal px-3 py-1 rounded border border-border">{AGENT_THRESHOLDS.inventoryAged} d</span>
               </div>
            </div>

            <div className="bg-black p-4 rounded border border-border flex flex-col justify-between">
               <div>
                  <div className="text-sm font-bold text-white mb-1">Service Overdue Trigger (Months)</div>
                  <div className="text-[10px] text-text-muted mb-3 leading-relaxed">Agent scans CRM metrics for sold units without service ROs and pushes retention campaign tasks.</div>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <input type="range" min="6" max="36" defaultValue={AGENT_THRESHOLDS.serviceOverdue} onChange={(e) => { AGENT_THRESHOLDS.serviceOverdue = Number(e.target.value); setTick(t=>t+1); }} className="w-2/3 accent-gold" />
                  <span className="text-xl font-bold text-white bg-charcoal px-3 py-1 rounded border border-border">{AGENT_THRESHOLDS.serviceOverdue} m</span>
               </div>
            </div>

            <div className="bg-black p-4 rounded border border-border flex flex-col justify-between">
               <div>
                  <div className="text-sm font-bold text-white mb-1">Slingshot Discount Max (%)</div>
                  <div className="text-[10px] text-text-muted mb-3 leading-relaxed">The maximum variance from MSRP allowed by Deal Desk Simulator before requiring Finance Director override.</div>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <input type="range" min="0" max="30" defaultValue={AGENT_THRESHOLDS.slingshotDiscount} onChange={(e) => { AGENT_THRESHOLDS.slingshotDiscount = Number(e.target.value); setTick(t=>t+1); }} className="w-2/3 accent-gold" />
                  <span className="text-xl font-bold text-white bg-charcoal px-3 py-1 rounded border border-border">{AGENT_THRESHOLDS.slingshotDiscount}%</span>
               </div>
            </div>
         </div>
       </div>
    </div>
  );

  // 4. Lead & CRM Engine Settings
  const renderLeadEngine = () => (
    <div className="space-y-6 fade-in">
       <div className="bg-charcoal p-6 rounded border border-border/50">
        <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
           <h2 className="text-xl font-bold text-white">CRM Automated Routing Rules</h2>
           <button onClick={handleAddRule} className="flex items-center gap-1 text-xs bg-gold text-black font-bold border border-gold px-3 py-1.5 rounded hover:bg-gold-light transition-colors"><Plus className="w-3 h-3"/> New Node</button>
        </div>
        
        <div className="space-y-3">
           {CRM_AUTOMATION_RULES.map(rule => (
             <div key={rule.id} className="bg-black border border-border rounded p-4 group">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                     <span className="font-bold text-white text-sm"><DrillDownValue value={rule.name} label="Edit Rule Flow" type="Settings" onDrillDown={onDrillDown} /></span>
                  </div>
                  <div className="flex items-center gap-3">
                     <input type="checkbox" checked={rule.active} onChange={() => { rule.active = !rule.active; setTick(t=>t+1); }} className="accent-gold w-4 h-4 cursor-pointer" />
                     <button onClick={() => handleDeleteRule(rule.id)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><Trash2 className="w-4 h-4 cursor-pointer" /></button>
                  </div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-3 p-3 bg-charcoal rounded border border-border/30 text-xs font-mono">
                  <div>
                    <span className="text-gold-dim block mb-1">IF TRIGGER:</span>
                    <span className="text-white opacity-90 block truncate">{rule.trigger}</span>
                  </div>
                  <div className="lg:border-l lg:border-border/50 lg:pl-3">
                    <span className="text-blue-400 block mb-1">AND CONDITION:</span>
                    <span className="text-white opacity-90 block truncate">{rule.condition}</span>
                  </div>
                  <div className="lg:border-l lg:border-border/50 lg:pl-3">
                    <span className="text-green-500 block mb-1">THEN ACTION:</span>
                    <span className="text-white font-bold opacity-100 block truncate">{rule.action}</span>
                  </div>
               </div>
             </div>
           ))}
        </div>
       </div>
    </div>
  );

  // Global Settings Routing Switch
  const renderContent = () => {
    switch(activeSection) {
      case 'org': return renderOrgSettings();
      case 'users': return renderUserManagement();
      case 'finance': return renderFinanceConfig();
      case 'rules': return renderLeadEngine();
      case 'ai_engine': return renderAIEngine();
      case 'audit': return (
         <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-border rounded bg-charcoal">
            <Lock className="w-12 h-12 text-blue-500/50 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Immutable Audit Ledger</h2>
            <p className="text-text-muted max-w-md text-sm">HIPAA/GLBA compliant ledger isolating destructive write actions, PII decrypts, and Deal Override signatures.</p>
            <button className="mt-4 bg-panel border border-border text-white text-xs px-4 py-2 rounded font-bold hover:bg-black transition-colors" onClick={() => onDrillDown('Action', {name: 'Export 90x Log'})}>Export CSV Data</button>
         </div>
      );
      default: return (
         <div className="flex flex-col items-center justify-center p-20 text-center bg-charcoal rounded border border-border">
            <Wrench className="w-12 h-12 text-text-muted mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{SETTINGS_SECTIONS.find(s => s.id === activeSection)?.label}</h2>
            <p className="text-text-muted text-sm">Configuration sub-module actively loading into memory footprint...</p>
         </div>
      )
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex shadow-2xl">
      {/* Left Settings Sidebar */}
      <div className="w-64 bg-charcoal border border-border flex flex-col rounded-l-lg shadow-inner z-10">
         <div className="p-4 border-b border-border bg-black rounded-tl-lg">
            <div className="text-[10px] font-mono tracking-widest text-text-muted uppercase mb-1">Master Control</div>
            <h2 className="text-lg font-bold text-white tracking-wide">Settings Hub</h2>
         </div>
         <div className="p-2 overflow-y-auto hidden-scrollbar flex-1 space-y-1">
            {SETTINGS_SECTIONS.map(section => {
               const Icon = section.icon;
               const isActive = activeSection === section.id;
               return (
                 <button
                   key={section.id}
                   onClick={() => setActiveSection(section.id)}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-all text-left group
                     ${isActive ? 'bg-panel border-l-2 border-gold text-gold shadow-md' : 'text-text-muted hover:bg-black hover:text-white border-l-2 border-transparent'}`
                   }
                 >
                   <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-text-muted group-hover:text-white'}`} />
                   <span className="font-medium tracking-wide">{section.label}</span>
                 </button>
               )
            })}
         </div>
      </div>

      {/* Main Settings Canvas */}
      <div className="flex-1 bg-black border-y border-r border-border rounded-r-lg flex flex-col relative overflow-hidden">
         {/* Top ActionBar */}
         <div className="h-16 flex items-center justify-between px-6 bg-charcoal border-b border-border">
            <div className="flex items-center gap-2">
               <span className="text-text-muted text-sm">Settings /</span>
               <span className="text-gold font-bold text-sm">{SETTINGS_SECTIONS.find(s => s.id === activeSection)?.label}</span>
            </div>
            <button 
              disabled={isSaving}
              onClick={handleGlobalSave}
              className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded transition-all shadow-md
               ${isSaving ? 'bg-panel text-text-muted border border-border cursor-normal' : 'bg-gold hover:bg-gold-light text-black border border-transparent'}`}
            >
               {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               {isSaving ? 'Synchronizing...' : 'Save Configuration'}
            </button>
         </div>

         {/* Content Viewport */}
         <div className="flex-1 overflow-y-auto p-8 hidden-scrollbar relative bg-black">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Award, Target, TrendingUp, DollarSign, Database, ChevronRight, AlertCircle, BarChart2 } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';

export const OEMModule = ({ onDrillDown }) => {
  const [activeTab, setActiveTab] = useState('Volume Bonuses');

  const tabs = ['Volume Bonuses', 'Co-Op Advertising', 'Retail Registrations', 'Floorplan Credits'];

  const programs = [
    { brand: 'Yamaha', name: 'Q3 Outboard & ATV Push', target: 45, current: 41, bonus: 74000, daysLeft: 9, status: 'warning' },
    { brand: 'Honda', name: 'Fall Ride Red Event', target: 30, current: 32, bonus: 45000, daysLeft: 14, status: 'success' },
    { brand: 'Polaris', name: 'Off-Road Domination Q4', target: 80, current: 50, bonus: 110000, daysLeft: 42, status: 'danger' },
    { brand: 'Kawasaki', name: 'Green Season Kickoff', target: 20, current: 18, bonus: 15000, daysLeft: 5, status: 'warning' }
  ];

  const coopFunds = [
    { brand: 'Yamaha', accrued: 12500, spent: 8400, pending: 2100, expiring: 0 },
    { brand: 'Honda', accrued: 9200, spent: 9200, pending: 0, expiring: 0 },
    { brand: 'Polaris', accrued: 18400, spent: 12000, pending: 4500, expiring: 1900 }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-purple-500 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">OEM Incentives & Rebates</h1>
              <p className="text-text-muted text-sm border-l-2 border-purple-500 pl-2 ml-1">Volume Targets, Co-Op Funds & Punch Tracking</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-purple-500 transition-colors" onClick={() => onDrillDown('Action', { name: 'Download Compliance Packet' })}>
              <Database className="w-4 h-4" /> Export OEM Packet
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner">
           <div className="flex items-center gap-2 text-purple-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Target className="w-4 h-4"/> Total Bonus Pipeline</div>
           <div className="text-3xl font-playfair text-white mt-2">
              <DrillDownValue value="$244,000" label="Active Pipeline" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2">Locked: <span className="text-green-500 font-bold"><DrillDownValue value="$45,000" label="Locked Bonuses" type="Financials" onDrillDown={onDrillDown} color="text-green-500 hover:text-white" /></span></div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner">
           <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> Co-Op Unclaimed</div>
           <div className="text-3xl font-playfair text-white mt-2">
              <DrillDownValue value="$1,900" label="Expiring Co-Op" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded mt-2 border border-border/50">
              Polaris funds expire in <span className="text-red-500 font-bold">14 days</span>. <DrillDownValue value="Submit missing claims." label="Claim Portal" type="Action" onDrillDown={onDrillDown} color="text-gold cursor-pointer" />
           </div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner">
           <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><BarChart2 className="w-4 h-4"/> Penetration</div>
           <div className="text-3xl font-playfair text-white mt-2">
              <DrillDownValue value="24.5%" label="Market Share" type="Report" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2">Vs District: <span className="text-green-500 font-bold"><DrillDownValue value="+2.1%" label="District Comparison" type="Report" onDrillDown={onDrillDown} color="text-green-500 hover:text-white" /></span></div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner border-y-[3px] border-y-red-500 relative flex flex-col justify-center items-center text-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">Audit Risk</div>
            <div className="text-2xl font-mono text-red-500 mb-1"><DrillDownValue value="3 Units" label="Punch Audits" type="Report" onDrillDown={onDrillDown} color="text-red-500 hover:text-white"/></div>
            <div className="text-[10px] text-text-muted bg-black border border-border px-2 py-1 rounded mt-2">Late Registrations: <DrillDownValue value="View List" label="Late Punches" type="Inventory" onDrillDown={onDrillDown} color="text-gold cursor-pointer hover:underline" /></div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="flex border-b border-border bg-black px-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'border-purple-500 text-purple-500' : 'border-transparent text-text-muted hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto subtle-scrollbar">
          {activeTab === 'Volume Bonuses' && (
            <div className="space-y-4">
              {programs.map(prog => (
                <div key={prog.name} className="bg-black border border-border p-4 rounded shadow-inner flex items-center justify-between hover:border-purple-500 transition-colors group">
                   <div className="w-1/4">
                      <div className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mb-1"><DrillDownValue value={prog.brand} label={`${prog.brand} Brand Page`} type="OEM" brand={prog.brand} onDrillDown={onDrillDown} color="text-purple-500 cursor-pointer hover:text-white" /></div>
                      <div className="text-lg font-bold text-white group-hover:text-gold transition-colors"><DrillDownValue value={prog.name} label="Program Terms" type="OEM" program={prog.name} onDrillDown={onDrillDown} /></div>
                   </div>
                   
                   <div className="w-2/5 px-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted">Pacing: <strong className="text-white"><DrillDownValue value={`${prog.current} / ${prog.target} Units`} label="Pacing Ledger" type="Report" onDrillDown={onDrillDown} /></strong></span>
                        <span className="text-text-muted">
                           <DrillDownValue value={`${prog.daysLeft} Days Left`} label="Timeline" type="Report" onDrillDown={onDrillDown} color={prog.daysLeft < 10 ? 'text-red-500' : 'text-text-muted'} />
                        </span>
                      </div>
                      <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden border border-border">
                        <div className={`h-full ${prog.status === 'success' ? 'bg-green-500' : prog.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'} relative`} style={{width: `${Math.min(100, (prog.current/prog.target)*100)}%`}}>
                           <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="w-1/4 text-right">
                      <div className="text-xs text-text-muted mb-1">Potential Payout</div>
                      <div className="text-2xl font-playfair text-green-500"><DrillDownValue value={`$${prog.bonus.toLocaleString()}`} label="Gross Payout" type="Financials" onDrillDown={onDrillDown} color="text-green-500 hover:text-white" /></div>
                   </div>
                   
                   <div className="w-auto pl-4">
                      <button className="bg-charcoal border border-border p-2 rounded text-text-muted hover:text-white hover:border-purple-500 transition-colors" onClick={() => onDrillDown('Action', { name: `View ${prog.brand} Eligible Inventory` })}>
                         <ChevronRight className="w-5 h-5"/>
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'Co-Op Advertising' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 mb-4 text-xs font-mono text-text-muted uppercase tracking-widest border-b border-border pb-2 px-2">
                 <div>Brand</div>
                 <div className="text-right">Accrued YTD</div>
                 <div className="text-right">Spent / Submitted</div>
                 <div className="text-right">Available Balance</div>
              </div>
              {coopFunds.map(fund => (
                <div key={fund.brand} className="grid grid-cols-4 gap-4 bg-black border border-border p-3 rounded items-center hover:border-gold transition-colors">
                   <div className="font-bold text-white"><DrillDownValue value={fund.brand} label={`${fund.brand} Co-Op Policy`} type="OEM" brand={fund.brand} onDrillDown={onDrillDown} /></div>
                   <div className="text-right text-text-muted"><DrillDownValue value={`$${fund.accrued.toLocaleString()}`} label="Accrual Ledger" type="Financials" onDrillDown={onDrillDown} /></div>
                   <div className="text-right text-text-muted"><DrillDownValue value={`$${fund.spent.toLocaleString()}`} label="Ad Spend LEDGER" type="Financials" onDrillDown={onDrillDown} /></div>
                   <div className="text-right font-bold text-green-500"><DrillDownValue value={`$${(fund.accrued - fund.spent).toLocaleString()}`} label="Available Balance" type="Financials" onDrillDown={onDrillDown} color="text-green-500 hover:text-white"/></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Retail Registrations' && (
             <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded opacity-60">
                <Database className="w-12 h-12 text-text-muted mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Punch Sync Offline</h3>
                <p className="text-sm text-text-muted max-w-md">Our direct API sync with standard OEM portals (Yamaha, Polaris, Honda) is currently disabled in this demo environment. <DrillDownValue value="Authorize DMS Sync" label="Settings" type="Action" onDrillDown={onDrillDown} color="text-purple-500 cursor-pointer hover:underline" /> to restore live retail registration statuses.</p>
             </div>
          )}

          {activeTab === 'Floorplan Credits' && (
             <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded opacity-60">
                <DollarSign className="w-12 h-12 text-text-muted mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Floorplan Reconciliation</h3>
                <p className="text-sm text-text-muted max-w-md">Interest credit statements are actively reconciling against Wells Fargo / Northpoint data feeds. <DrillDownValue value="View Preliminary Ledger" label="GL Viewer" type="Report" onDrillDown={onDrillDown} color="text-purple-500 cursor-pointer hover:underline" /></p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

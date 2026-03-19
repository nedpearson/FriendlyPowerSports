import React, { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle2, AlertCircle, ChevronRight, Briefcase, Award, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';

export const PayrollModule = ({ onDrillDown }) => {
  const [activeTab, setActiveTab] = useState('Commission');

  const employees = [
    { id: 'EMP-1', name: 'Jake F.', role: 'Sales rep', draw: 1200, earned: 4500, status: 'Positive', nextTier: '$1,500 to +2% retro', hours: 42.5 },
    { id: 'EMP-2', name: 'Marcus B.', role: 'Sales rep', draw: 1600, earned: 1450, status: 'In Hole', nextTier: 'Missed Tier 1', hours: 40.0 },
    { id: 'EMP-3', name: 'Tom H.', role: 'Service Adv', draw: 800, earned: 2100, status: 'Positive', nextTier: '+12 ROs for Tier 2', hours: 45.2 },
    { id: 'EMP-4', name: 'Alex M.', role: 'Internet Sales', draw: 1200, earned: 850, status: 'In Hole', nextTier: 'Missed Target', hours: 38.0 },
    { id: 'EMP-5', name: 'Sam L.', role: 'A-Tech', type: 'Flag Hours', rate: '$35/hr', flagged: 52.4, actual: 40.1, efficiency: 130 }
  ];

  const totalCommissions = employees.filter(e => e.earned).reduce((acc, e) => acc + e.earned, 0);
  const totalInHole = employees.filter(e => e.earned && e.earned < e.draw).reduce((acc, e) => acc + (e.draw - e.earned), 0);

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-green-500 shadow-inner">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Payroll & Commission</h1>
              <p className="text-text-muted text-sm border-l-2 border-green-500 pl-2 ml-1">Draw Tracking, Tier Retro-Spiffs, & Time Clocks</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: 'Batch Export to ADP' })}>
              <Printer className="w-4 h-4" /> Export ADP
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-green-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Total Unpaid Commission Accrual' })}>
           <div className="flex items-center gap-2 text-green-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Award className="w-4 h-4"/> <DrillDownValue value="Total Earned Period" label="Commission Pool" type="Report" onDrillDown={onDrillDown} color="text-green-500 group-hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-1 group-hover:text-gold transition-colors">
              <DrillDownValue value={`$${totalCommissions.toLocaleString()}`} label="Sales Accrual" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2">Before Draw Deductions</div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner border-y-[3px] border-y-red-500 hover:border-red-500 transition-colors group flex flex-col justify-center cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Negative Draw Ledger Risk' })}>
           <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Washout Risk</div>
           <div className="text-2xl font-mono text-white mb-1 drop-shadow-md"><DrillDownValue value={`-$${totalInHole.toLocaleString()}`} label="Draw Liability" type="Financials" onDrillDown={onDrillDown} color="group-hover:text-red-500" /></div>
           <div className="text-xs text-text-muted">Total Negative Draw Carryover</div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-blue-500 transition-colors group flex flex-col justify-center cursor-pointer" onClick={() => onDrillDown('Action', { name: 'View Unapproved Punches' })}>
           <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending Approvals</div>
           <div className="text-2xl font-mono text-white mb-1"><DrillDownValue value="8 Punches" label="Clock Edits" type="Action" onDrillDown={onDrillDown} color="group-hover:text-gold" /></div>
           <div className="text-xs text-text-muted">Requires Mgr Override</div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded flex flex-col flex-1 shadow-inner relative overflow-hidden min-h-[400px]">
         <div className="p-4 border-b border-border bg-black flex justify-between items-center relative z-10">
           <div className="font-bold text-white flex items-center gap-2 uppercase tracking-wide"><Briefcase className="w-5 h-5 text-gold" /> Period 12 Ledger (Dec 1 - Dec 15)</div>
         </div>
         
         <div className="flex-1 overflow-x-auto overflow-y-auto subtle-scrollbar">
           <table className="w-full text-left text-sm whitespace-nowrap relative z-10">
              <thead className="bg-black/80 border-b border-border sticky top-0 backdrop-blur-md">
                 <tr>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Employee" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Role" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="Earned / Flagged" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="Base / Draw" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="Net Check" type="Report" onDrillDown={onDrillDown} /></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                  {employees.map((e) => (
                    <tr key={e.id} className="hover:bg-black/60 transition-colors group cursor-pointer" onClick={() => onDrillDown('Employee', { name: e.name })}>
                       <td className="px-4 py-4">
                          <div className="font-bold text-white group-hover:text-gold transition-colors"><DrillDownValue value={e.name} label="Employee Profile" type="Employee" onDrillDown={onDrillDown} /></div>
                          <div className="text-[10px] text-text-muted font-mono"><DrillDownValue value={e.id} label="HR ID" type="Report" onDrillDown={onDrillDown} color="hover:text-white" /></div>
                       </td>
                       <td className="px-4 py-4 text-xs text-text-muted">
                          <DrillDownValue value={e.role} label="Pay Plan Rules" type="Report" onDrillDown={onDrillDown} color="hover:text-white" />
                       </td>
                       <td className="px-4 py-4 text-right">
                          {e.type === 'Flag Hours' ? (
                             <div className="font-bold text-white">{e.flagged} hr</div>
                          ) : (
                             <div className="font-bold text-white"><DrillDownValue value={`$${e.earned.toLocaleString()}`} label="Earned Commissions" type="Financials" onDrillDown={onDrillDown} color="hover:text-gold" /></div>
                          )}
                          <div className={`text-[9px] uppercase tracking-widest font-mono mt-1 ${e.status === 'In Hole' ? 'text-red-500' : 'text-green-500'}`}>
                             {e.type !== 'Flag Hours' && e.nextTier}
                             {e.type === 'Flag Hours' && `Eff: ${e.efficiency}%`}
                          </div>
                       </td>
                       <td className="px-4 py-4 text-right font-mono text-xs text-text-muted">
                          {e.type === 'Flag Hours' ? e.rate : `$${e.draw.toLocaleString()}`}
                       </td>
                       <td className="px-4 py-4 text-right">
                          {e.type === 'Flag Hours' ? (
                             <span className="font-bold text-green-500 text-lg"><DrillDownValue value={`$${(e.flagged * 35).toLocaleString()}`} label="Net Payout" type="Financials" onDrillDown={onDrillDown} /></span>
                          ) : (
                             <span className={`font-bold text-lg ${e.earned > e.draw ? 'text-green-500' : 'text-red-500'}`}>
                                <DrillDownValue value={`$${Math.max(0, e.earned - e.draw).toLocaleString()}`} label="Net Commission Check" type="Financials" onDrillDown={onDrillDown} color="hover:text-white" />
                             </span>
                          )}
                       </td>
                    </tr>
                  ))}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

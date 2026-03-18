import React from 'react';
import { DrillDownValue } from './DrillDownValue';
import { Briefcase, DollarSign, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, FileText, Activity, ArrowRightLeft } from 'lucide-react';

export const AccountingGLModule = ({ onDrillDown }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
               <Briefcase className="w-5 h-5 text-gold" />
            </div>
            <div>
               <h1 className="text-2xl font-playfair text-white">Accounting & General Ledger</h1>
               <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Live Financial Nexus</p>
            </div>
         </div>
         <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors" onClick={() => onDrillDown('Action', { name: 'Run Month-End Close', message: 'Validating ledgers for close out...' })}>
           <CheckCircle2 className="w-4 h-4" /> Run Month-End Close
         </button>
      </div>

      {/* Expanded KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Operating Cash", value: "$412,850", delta: "+$14k vs Mo", color: "text-green-500", icon: DollarSign },
          { label: "Total Revenue", value: "$2.4M", delta: "112% to Target", color: "text-blue-500", icon: TrendingUp },
          { label: "Total Gross Profit", value: "$614,000", delta: "+8% YOY", color: "text-gold", icon: Activity },
          { label: "YTD Net Income", value: "$288,500", delta: "14% Margin", color: "text-green-500", icon: TrendingUp },
          { label: "Total A/R", value: "$184,200", delta: "12% Aged >30d", color: "text-amber-500", icon: ArrowRightLeft },
          { label: "Total A/P", value: "$62,400", delta: "On Schedule", color: "text-text-muted", icon: ArrowRightLeft }
        ].map((m,i) => (
          <div key={i} className="bg-charcoal p-4 rounded border border-border hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Financials', { name: m.label })}>
            <div className="flex items-center gap-2 text-xs text-text-muted font-mono mb-2 uppercase tracking-wider">
               <m.icon className="w-3 h-3 group-hover:text-gold transition-colors" /> {m.label}
            </div>
            <div className={`text-2xl font-bold ${m.color}`}>
               <DrillDownValue value={m.value} label={m.label} type="Financials" onDrillDown={onDrillDown} color={m.color} />
            </div>
            <div className="mt-2 text-[10px] inline-block">
               <DrillDownValue value={m.delta} label={`${m.label} Delta`} type="Financials" onDrillDown={onDrillDown} color="text-text-dim hover:text-white" />
            </div>
          </div>
        ))}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* A/R Aging Matrix */}
          <div className="bg-charcoal border border-border rounded p-6 shadow-inner">
             <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
               <h2 className="text-gold font-playfair text-xl">Accounts Receivable Aging</h2>
             </div>
             <div className="space-y-4">
               {[
                  { label: "0-30 Days", amount: "$162,096", pct: 88, bg: "bg-green-500" },
                  { label: "31-60 Days", amount: "$14,736", pct: 8, bg: "bg-amber-500" },
                  { label: "61-90 Days", amount: "$5,526", pct: 3, bg: "bg-orange-500" },
                  { label: "90+ Days (Critical)", amount: "$1,842", pct: 1, bg: "bg-red-500" }
               ].map((a, i) => (
                 <div key={i} className="relative group p-2 hover:bg-black rounded transition-colors cursor-pointer" onClick={() => onDrillDown('Financials', { name: `A/R Bracket: ${a.label}` })}>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-white"><DrillDownValue value={a.label} label="Bucket" type="Financials" onDrillDown={onDrillDown} color="text-text-muted group-hover:text-white" /></span>
                     <span className="font-bold text-white"><DrillDownValue value={a.amount} label={`A/R Aging: ${a.label}`} type="Financials" onDrillDown={onDrillDown} /></span>
                   </div>
                   <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-border">
                     <div className={`h-full ${a.bg}`} style={{width: `${a.pct}%`}}></div>
                   </div>
                   <div className="text-[10px] text-right mt-1 text-text-dim font-mono tracking-widest"><DrillDownValue value={`${a.pct}% of Total`} label="% Breakdown" type="Financials" onDrillDown={onDrillDown} color="text-text-dim hover:text-white" /></div>
                 </div>
               ))}
             </div>
             <div className="mt-4 pt-4 border-t border-border flex justify-center">
                 <button className="text-xs text-text-muted hover:text-gold uppercase tracking-widest font-mono transition-colors" onClick={(e) => { e.stopPropagation(); onDrillDown('Financials', {name: "Full A/R Ledger"}); }}>View A/R Ledger →</button>
             </div>
          </div>

          {/* A/P Aging Matrix */}
          <div className="bg-charcoal border border-border rounded p-6 shadow-inner">
             <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
               <h2 className="text-gold font-playfair text-xl">Accounts Payable Aging</h2>
             </div>
             <div className="space-y-4">
               {[
                  { label: "0-30 Days", amount: "$58,100", pct: 93, bg: "bg-green-500" },
                  { label: "31-60 Days", amount: "$4,300", pct: 7, bg: "bg-amber-500" },
                  { label: "61-90 Days", amount: "$0", pct: 0, bg: "bg-text-muted" },
                  { label: "90+ Days", amount: "$0", pct: 0, bg: "bg-text-muted" }
               ].map((a, i) => (
                 <div key={i} className="relative group p-2 hover:bg-black rounded transition-colors cursor-pointer" onClick={() => onDrillDown('Financials', { name: `A/P Bracket: ${a.label}` })}>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-white"><DrillDownValue value={a.label} label="Bucket" type="Financials" onDrillDown={onDrillDown} color="text-text-muted group-hover:text-white" /></span>
                     <span className="font-bold text-white"><DrillDownValue value={a.amount} label={`A/P Aging: ${a.label}`} type="Financials" onDrillDown={onDrillDown} /></span>
                   </div>
                   <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-border">
                     <div className={`h-full ${a.bg}`} style={{width: `${a.pct}%`}}></div>
                   </div>
                   <div className="text-[10px] text-right mt-1 text-text-dim font-mono tracking-widest"><DrillDownValue value={`${a.pct}% of Total`} label="% Breakdown" type="Financials" onDrillDown={onDrillDown} color="text-text-dim hover:text-white" /></div>
                 </div>
               ))}
             </div>
             <div className="mt-4 pt-4 border-t border-border flex justify-center">
                 <button className="text-xs text-text-muted hover:text-gold uppercase tracking-widest font-mono transition-colors" onClick={(e) => { e.stopPropagation(); onDrillDown('Financials', {name: "Full A/P Ledger"});}}>View A/P Ledger →</button>
             </div>
          </div>

          {/* Bank Reconciliations */}
          <div className="bg-charcoal border border-border rounded p-6 shadow-inner flex flex-col">
             <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                <h2 className="text-gold font-playfair text-xl">Bank Reconciliations</h2>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto subtle-scrollbar">
               {[
                 { acct: 'Chase Operating (...4492)', balance: "$412,850.50", status: 'Reconciled', date: 'Yesterday' },
                 { acct: 'Wells Fargo Floorplan (...1102)', balance: "$3,142,000.00", status: 'Pending', date: '3 days ago' },
                 { acct: 'Capital One Payroll (...0093)', balance: "$85,400.00", status: 'Reconciled', date: 'Today' },
                 { acct: 'Ally Financial Reserves (...2281)', balance: "$114,000.00", status: 'Action Required', date: '12 days ago' }
               ].map((b, i) => (
                  <div key={i} className="bg-black border border-border p-3 rounded flex flex-col hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Financials', { account: b.acct })}>
                     <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-white text-sm group-hover:text-gold transition-colors line-clamp-1"><DrillDownValue value={b.acct} label="Bank Account" type="Financials" onDrillDown={onDrillDown} color="text-white group-hover:text-gold" /></div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-current ${b.status === 'Reconciled' ? 'text-green-500' : b.status === 'Pending' ? 'text-amber-500' : 'text-red-500'}`}>
                           <DrillDownValue value={b.status} label="Reconciliation Status" type="Report" onDrillDown={onDrillDown} color="inherit" />
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-text-muted font-mono"><DrillDownValue value={b.balance} label="Statement Balance" type="Financials" onDrillDown={onDrillDown} color="text-text-muted hover:text-white" /></span>
                        <span className="text-[10px] text-text-dim border border-border bg-panel px-1.5 py-0.5 rounded"><DrillDownValue value={`Matched: ${b.date}`} label="Last Matched" type="Report" onDrillDown={onDrillDown} color="text-text-dim hover:text-white" /></span>
                     </div>
                  </div>
               ))}
             </div>
          </div>

       </div>

       {/* General Ledger Live Feed */}
       <div className="bg-charcoal border border-border rounded overflow-hidden shadow-xl">
         <div className="p-4 border-b border-border bg-black flex justify-between items-center">
            <h2 className="text-gold font-playfair text-xl flex items-center gap-2"><FileText className="w-5 h-5"/> Live General Ledger Feed</h2>
            <div className="text-xs bg-panel border border-border px-2 py-1 rounded text-text-muted font-mono tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               REAL-TIME
            </div>
         </div>
         <div className="overflow-x-auto subtle-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-panel border-b border-border text-[10px] uppercase tracking-widest text-text-muted font-mono">
                     <th className="p-3 font-medium">Time / User</th>
                     <th className="p-3 font-medium">Account Code</th>
                     <th className="p-3 font-medium">Description</th>
                     <th className="p-3 font-medium text-right">Debit</th>
                     <th className="p-3 font-medium text-right">Credit</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {[
                     { time: "11:42 AM", user: "SYSTEM", code: "4010 - New Unit Sales", desc: "Deal Funding: DE-1842 (Ally)", debit: "$0.00", credit: "$14,500.00" },
                     { time: "11:42 AM", user: "SYSTEM", code: "1120 - Contracts in Transit", desc: "Deal Funding: DE-1842 (Ally)", debit: "$14,500.00", credit: "$0.00" },
                     { time: "11:15 AM", user: "Tony G.", code: "6100 - Warranty Claims", desc: "RO-1992 Labor Submission (Yamaha)", debit: "$380.00", credit: "$0.00" },
                     { time: "10:55 AM", user: "AutoPay", code: "2010 - Accounts Payable", desc: "Vendor Payout: Parts Unlimited", debit: "$4,200.00", credit: "$0.00" },
                     { time: "10:55 AM", user: "AutoPay", code: "1010 - Operating Cash", desc: "Vendor Payout: Parts Unlimited", debit: "$0.00", credit: "$4,200.00" },
                     { time: "09:30 AM", user: "Rebecca M.", code: "4110 - F&I Warranty Revenue", desc: "Deal Cap: VSC Sale (DE-1840)", debit: "$0.00", credit: "$1,200.00" }
                  ].map((row, idx) => (
                     <tr key={idx} className="border-b border-border/50 hover:bg-black transition-colors group cursor-pointer" onClick={() => onDrillDown('Financials', { je: row.desc })}>
                        <td className="p-3">
                           <div className="text-white"><DrillDownValue value={row.time} label="Timestamp" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>
                           <div className="text-[10px] text-text-muted font-mono mt-0.5"><DrillDownValue value={row.user} label="User Alias" type="Employee" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" /></div>
                        </td>
                        <td className="p-3 font-mono text-gold text-xs">
                           <DrillDownValue value={row.code} label="GL Account Code" type="Financials" onDrillDown={onDrillDown} color="text-gold hover:text-white transition-colors" />
                        </td>
                        <td className="p-3 text-text-dim text-xs">
                           <DrillDownValue value={row.desc} label="JE Context" type="Financials" onDrillDown={onDrillDown} color="text-text-dim hover:text-white transition-colors" />
                        </td>
                        <td className="p-3 text-right font-mono text-white tracking-wider text-xs">
                           {row.debit !== "$0.00" ? <DrillDownValue value={row.debit} label="Debit Amount" type="Financials" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" /> : <span className="text-border">{row.debit}</span>}
                        </td>
                        <td className="p-3 text-right font-mono text-green-500 tracking-wider text-xs">
                           {row.credit !== "$0.00" ? <DrillDownValue value={row.credit} label="Credit Amount" type="Financials" onDrillDown={onDrillDown} color="text-green-500 hover:text-white transition-colors" /> : <span className="text-border">{row.credit}</span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <div className="p-3 text-center border-t border-border bg-black">
                <button className="text-xs text-text-muted hover:text-gold font-mono tracking-widest uppercase transition-colors" onClick={(e) => { e.stopPropagation(); onDrillDown('Financials', { name: "Full Trial Balance" }); }}>Expand Trial Balance →</button>
            </div>
         </div>
       </div>

    </div>
  );
};

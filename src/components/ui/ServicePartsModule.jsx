import React, { useState } from 'react';
import { Wrench, Clock, PenTool, Database, Monitor, AlertCircle, Box, Users, ChevronRight, Calculator, FileText } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';
import { AutomatedInsights } from './AutomatedInsights';

export const ServicePartsModule = ({ onDrillDown }) => {
  const [activeTab, setActiveTab] = useState('Service');
  
  const techLog = [
    { name: 'Mike H.', status: 'Clocked In', ro: 'RO-10291', efficiency: 112, next: '10k Service' },
    { name: 'Sarah B.', status: 'Clocked In', ro: 'RO-10295', efficiency: 98, next: 'Tire Change' },
    { name: 'David W.', status: 'Break', ro: null, efficiency: 86, next: 'Diagnostics' },
  ];

  const roLog = [
    { id: 'RO-10288', customer: 'John Miller', unit: '2022 Polaris Ranger', status: 'Waiting on Parts', total: 850, hours: 0, advisor: 'Tom' },
    { id: 'RO-10291', customer: 'Emily Chen', unit: '2024 Honda CBR600', status: 'In Bay', total: 420, hours: 2.5, tech: 'Mike H.', advisor: 'Jess' },
    { id: 'RO-10294', customer: 'Alan Ford', unit: '2019 HD Road Glide', status: 'Complete/Unpaid', total: 1150, hours: 4.8, tech: 'Sarah B.', advisor: 'Tom' },
  ];

  const insights = [
    { type: "warning", message: <>There are 3 completed Repair Orders totaling <DrillDownValue value="$2,450" label="Unpaid ROs" type="Financials" onDrillDown={onDrillDown} color="text-red-500 hover:text-white" /> awaiting customer pickup. Dispatch BDC for pickup scheduling.</>, actionText: "View Unpaid RO Log", data: { name: 'Unpaid Complete ROs' } },
    { type: "opportunity", message: <>Service lane traffic is up 18%. 2 customers have <DrillDownValue value="positive equity" label="Equity List" type="Report" onDrillDown={onDrillDown} />. A trigger has been sent to the Sales Desk.</>, actionText: "Review Conquest Targets", data: { name: 'Lane Conquest Queue' } }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-orange-500 shadow-inner">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Fixed Operations</h1>
              <p className="text-text-muted text-sm border-l-2 border-orange-500 pl-2 ml-1">Service Dispatch, RO Metrics, & Parts Inventory</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: 'Write New RO' })}>
              <FileText className="w-4 h-4" /> New RO
            </button>
         </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={insights} />

      <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto subtle-scrollbar mt-4">
        {['Service Dispatch', 'Parts Logistics'].map(tab => (
           <button key={tab} className={`text-sm font-bold px-4 py-2 transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.split(' ')[0] ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent hover:text-white'}`} onClick={() => setActiveTab(tab.split(' ')[0])}>
             {tab}
           </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
         
         {/* Left Col - Team / Orders */}
         <div className="md:col-span-1 bg-charcoal border border-border rounded shadow-inner p-4 flex flex-col">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-border/50 pb-2"><Clock className="w-4 h-4 text-gold" /> Active Technicians</h4>
            <div className="space-y-3 mb-6">
                {techLog.map((t, idx) => (
                   <div key={idx} className="bg-black border border-border rounded p-3 cursor-pointer hover:border-orange-500 transition-colors group" onClick={() => onDrillDown('Employee', { name: t.name })}>
                      <div className="flex justify-between items-center mb-2">
                         <div className="text-white font-bold text-sm"><DrillDownValue value={t.name} label="Tech Profile" type="Employee" onDrillDown={onDrillDown} color="group-hover:text-gold" /></div>
                         <div className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${t.status === 'Clocked In' ? 'text-green-500 border-green-500/30 bg-green-900/10' : 'text-amber-500 border-amber-500/30 bg-amber-900/10'}`}>{t.status}</div>
                      </div>
                      <div className="flex justify-between text-xs text-text-muted mt-2">
                         <span>Efficiency: <strong className={t.efficiency >= 100 ? "text-green-400" : "text-amber-400"}><DrillDownValue value={`${t.efficiency}%`} label="Efficiency Metrics" type="Report" onDrillDown={onDrillDown} /></strong></span>
                         <span>RO: <strong className="text-white font-mono"><DrillDownValue value={t.ro || 'None'} label="Active RO" type="Action" onDrillDown={onDrillDown} color="text-orange-400" /></strong></span>
                      </div>
                   </div>
                ))}
            </div>

            <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-border/50 pb-2"><Calculator className="w-4 h-4 text-blue-500" /> Daily Financials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="bg-black border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', { name: 'Customer Paid Labor' })}>
                  <div className="text-[10px] text-text-muted font-mono uppercase">CP Labor</div>
                  <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$1,840" type="Financials" onDrillDown={onDrillDown} /></div>
               </div>
               <div className="bg-black border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', { name: 'Internal Recon Labor' })}>
                  <div className="text-[10px] text-text-muted font-mono uppercase">Internal Labor</div>
                  <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$450" type="Financials" onDrillDown={onDrillDown} /></div>
               </div>
               <div className="bg-black border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', { name: 'Total Parts Revenue' })}>
                  <div className="text-[10px] text-text-muted font-mono uppercase">Parts Sales</div>
                  <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$2,120" type="Financials" onDrillDown={onDrillDown} /></div>
               </div>
               <div className="bg-black border border-border p-3 rounded text-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', { name: 'Warranty Claim Log' })}>
                  <div className="text-[10px] text-text-muted font-mono uppercase">Warranty</div>
                  <div className="text-lg font-bold text-white mt-1"><DrillDownValue value="$890" type="Financials" onDrillDown={onDrillDown} /></div>
               </div>
            </div>
         </div>

         {/* Right Col - RO Pipeline */}
         <div className="md:col-span-2 bg-charcoal border border-border rounded shadow-inner flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-black flex justify-between items-center">
              <div className="font-bold text-white flex items-center gap-2 uppercase tracking-wide"><PenTool className="w-4 h-4 text-orange-500" /> Active Repair Orders</div>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-auto subtle-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-black/80 border-b border-border sticky top-0 backdrop-blur-md">
                    <tr>
                       <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">Order ID</th>
                       <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">Customer & Unit</th>
                       <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">Current Status</th>
                       <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right">Job Total</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                     {roLog.map((ro) => (
                       <tr key={ro.id} className="hover:bg-black/60 transition-colors group cursor-pointer" onClick={() => onDrillDown('Action', { name: `View RO ${ro.id}` })}>
                          <td className="px-4 py-4 text-white font-mono font-bold text-xs">
                             <DrillDownValue value={ro.id} label="RO Detail Viewer" type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold" />
                             <div className="text-[9px] text-text-muted tracking-widest mt-1">ADV: {ro.advisor}</div>
                          </td>
                          <td className="px-4 py-4">
                             <div className="font-bold text-white group-hover:text-gold transition-colors"><DrillDownValue value={ro.customer} label="Customer Profile" type="CRM_Customer360" onDrillDown={onDrillDown} color="group-hover:text-gold" /></div>
                             <div className="text-xs text-text-muted mt-1"><DrillDownValue value={ro.unit} label="Asset Record" type="Report" onDrillDown={onDrillDown} /></div>
                          </td>
                          <td className="px-4 py-4">
                             <div className={`text-[10px] font-bold uppercase tracking-wider ${ro.status.includes('Waiting') ? 'text-amber-500' : ro.status.includes('Bay') ? 'text-blue-500' : 'text-green-500'}`}>
                                <DrillDownValue value={ro.status} type="Action" onDrillDown={onDrillDown} />
                             </div>
                             {ro.tech && <div className="text-xs text-text-muted font-mono mt-1">Tech: {ro.tech} ({ro.hours}h)</div>}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-white text-md">
                             <DrillDownValue value={`$${ro.total.toLocaleString()}`} label="Invoice Matrix" type="Financials" onDrillDown={onDrillDown} color="text-gold" />
                          </td>
                       </tr>
                     ))}
                 </tbody>
              </table>
            </div>
         </div>

      </div>
    </div>
  );
};

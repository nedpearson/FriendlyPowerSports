import React from 'react';
import { DrillDownValue } from './DrillDownValue';
import {
  CheckCircle2, TrendingUp, User, Bike, AlertCircle, Command,
  DollarSign, Megaphone, Search, FileBarChart, ChevronRight, TrendingDown, Users as UsersIcon, Clock
} from 'lucide-react';

export const DrillDownModal = ({ item, onClose, onDrillDown }) => {
  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case 'Action':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex items-center gap-3"><Command className="w-6 h-6"/> System Action: {item.data.name}</h3>
            <div className="bg-black p-8 rounded border border-border flex items-center justify-center min-h-[150px]">
               <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-900/20 border-2 border-green-500 text-green-500 flex items-center justify-center mx-auto mb-4 scale-110">
                     <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-xl text-white font-bold mb-2">{item.data.message || 'Processing Request...'}</div>
                  <div className="text-sm text-text-muted">This action is routing through the DealerCommand core API network.</div>
               </div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-border mt-4">
                <button className="bg-panel hover:bg-black text-white px-6 py-3 rounded text-sm transition-colors flex-1 shadow font-bold border border-border" onClick={onClose}>Acknowledge & Close</button>
                <button className="bg-gold hover:bg-gold-light text-black px-6 py-3 rounded text-sm font-bold flex-1 shadow" onClick={() => onDrillDown('Report', { name: 'Action Audit Log', actionId: item.data.name })}>View System Log Data</button>
            </div>
          </div>
        );
      case 'KPI':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex items-center gap-2"><TrendingUp/> {item.data.label} Deep Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black p-5 rounded border border-border">
                <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Current MTD</div>
                <div className="text-3xl font-bold text-white"><DrillDownValue value={item.data.value} label={`${item.data.label} MTD`} type="Financials" onDrillDown={onDrillDown} /></div>
              </div>
              <div className="bg-black p-5 rounded border border-border">
                <div className="text-xs text-text-muted uppercase tracking-widest mb-1">vs Prior Period</div>
                <div className="text-3xl font-bold text-green-500"><DrillDownValue value={item.data.delta} label={`${item.data.label} Delta`} type="Report" onDrillDown={onDrillDown} color="text-green-500"/></div>
              </div>
              <div className="bg-black p-5 rounded border border-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gold -rotate-45 translate-x-4 -translate-y-4 shadow-lg"></div>
                <div className="text-xs text-text-muted uppercase tracking-widest mb-1">EOM Projection</div>
                <div className="text-3xl font-bold text-gold"><DrillDownValue value="Trending +8%" label={`${item.data.label} Projection`} type="Action" onDrillDown={onDrillDown} color="text-gold"/></div>
              </div>
            </div>
            <div className="bg-charcoal p-5 rounded border border-border text-sm leading-relaxed border-l-4 border-l-gold shadow">
               <strong className="text-gold uppercase tracking-wider text-xs mb-2 block border-b border-border/50 pb-2">DealerCommand AI Copilot</strong>
               Based on real-time ingestion, this metric is outperforming baseline projections by <span className="text-green-500 font-bold">4.2%</span>. Strong conversion in unassigned leads generated from aggressive paid search marketing is compensating for lighter floor traffic. Recommend reviewing <span className="text-gold cursor-pointer hover:underline font-bold" onClick={() => onDrillDown('Report', { name: 'Regional Performance breakdown' })}>Regional Lead Allocations</span> to balance the funnel.
            </div>
            <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button className="bg-gold hover:bg-gold-light text-black px-6 py-3 rounded text-sm font-bold shadow transition-colors flex-1" onClick={() => onDrillDown('Action', { name: 'Export to Excel', message: 'Generating extensive CSV export of raw KPI data...' })}>Export Source Data</button>
                <button className="bg-panel hover:bg-black text-white px-6 py-3 rounded text-sm font-bold border border-border transition-colors shadow flex-1" onClick={() => onDrillDown('Action', { name: 'Share Snapshot', message: 'Routing comprehensive analytics thread to GM...' })}>Share with Leadership</button>
            </div>
          </div>
        );
      case 'Lead':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-3xl font-playfair text-white mb-2">{item.data.name}</h3>
                <div className="text-text-muted uppercase text-[11px] font-mono tracking-widest flex items-center gap-2">
                   <span className="bg-panel border border-border px-3 py-1 rounded text-white">{item.data.source}</span> 
                   <span>·</span> 
                   <span>Assigned to <DrillDownValue value={item.data.rep || 'Internet Dept'} label={`Rep: ${item.data.rep}`} type="Employee" onDrillDown={onDrillDown} /></span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded text-[10px] uppercase font-bold tracking-widest border border-current flex items-center gap-2 ${item.data.urgent ? 'bg-red-900/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-green-900/40 text-green-500'}`}>
                <div className={`w-2 h-2 rounded-full ${item.data.urgent ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                {item.data.status} ({item.data.time})
              </div>
            </div>
            <div className="flex gap-3">
               <button className="bg-gold hover:bg-gold-light text-black px-4 py-3 rounded text-sm font-bold flex-[2] shadow-lg shadow-gold/20 flex flex-col items-center justify-center gap-1" onClick={() => onDrillDown('Action', { name: 'Send Quick SMS', message: 'Opening omni-channel communication thread...' })}><Megaphone className="w-5 h-5"/> Initiate Comms</button>
               <button className="bg-panel hover:bg-black text-white px-4 py-3 rounded text-sm flex-1 border border-border font-bold text-center" onClick={() => onDrillDown('Action', { name: 'Reassign Lead', message: 'Fetching round-robin availability list...' })}>Reassign</button>
               <button className="bg-panel hover:bg-black text-white px-4 py-3 rounded text-sm flex-[1.5] border border-border font-bold text-center" onClick={() => onDrillDown('Action', { name: 'Convert to Deal', message: 'Creating fresh Deal Jacket for customer...' })}>Convert Drop-In</button>
            </div>
            <div className="bg-black p-5 rounded border border-border min-h-[250px] relative overflow-hidden">
               <div className="absolute right-0 top-0 text-[200px] text-border/20 -translate-y-12 translate-x-12"><User /></div>
               <div className="flex justify-between items-center border-b border-border/50 pb-3 mb-5 relative z-10">
                  <span className="text-[11px] font-bold text-gold uppercase tracking-widest">Digital Engagement History</span>
                  <span className="text-[10px] text-text-dim uppercase font-mono tracking-widest">Last ping: <DrillDownValue value="2 mins ago" label="Activity Timestamp" type="Action" onDrillDown={onDrillDown} color="text-text-muted"/></span>
               </div>
               <div className="space-y-6 border-l-2 border-border pl-6 relative z-10 before:absolute before:w-3 before:h-3 before:bg-gold before:rounded-full before:-left-[7px] before:top-1 after:absolute after:w-3 after:h-3 after:bg-panel after:border-[3px] after:border-border after:rounded-full after:-left-[7px] after:top-[85px]">
                 <div>
                    <div className="text-sm text-white font-bold mb-1">Incoming Web Inquiry via OEM Portal</div>
                    <div className="text-xs text-text-muted leading-relaxed">Customer submitted high-priority lead form reviewing 2024 Yamaha MT-07 listing page at 10:42am.</div>
                 </div>
                 <div className="pt-2">
                    <div className="text-sm text-white font-bold mb-1">Automated BDC Response</div>
                    <div className="text-[11px] font-mono text-blue-300 bg-panel border-l-2 border-blue-500 p-3 rounded mt-2">"Thanks for checking out the MT-07! I'll connect you directly with our specialized street bike manager to lock in today's best price."</div>
                 </div>
               </div>
            </div>
          </div>
        );
      case 'Financials':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex items-center gap-3"><DollarSign className="w-6 h-6"/> {item.data.metric} Assessment</h3>
            <div className="bg-charcoal p-8 rounded border border-border flex items-center justify-between overflow-hidden relative group">
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                 <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Reconciled Core Balance</div>
                 <div className="text-5xl font-playfair text-white"><DrillDownValue value={item.data.value} label={item.data.metric} type="Report" onDrillDown={onDrillDown} /></div>
              </div>
              <div className="text-right relative z-10">
                 <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Corporate Target YTD</div>
                 <div className="text-2xl font-mono tracking-tighter text-text-dim line-through"><DrillDownValue value="$1,500,000" label="YTD Quota Goal" type="Report" onDrillDown={onDrillDown} color="text-text-dim"/></div>
              </div>
            </div>
            
            <div className="space-y-4">
               <div className="text-[11px] font-bold text-white uppercase tracking-widest flex justify-between items-center border-b border-border pb-2">
                  <span>General Ledger Matrix Spread</span>
               </div>
               <div className="bg-black rounded border border-border shadow-inner">
                  <table className="w-full text-sm text-left">
                     <thead className="text-text-muted text-[10px] uppercase font-mono bg-panel border-b border-border">
                       <tr><th className="px-5 py-3 tracking-widest font-normal">Account Code</th><th className="px-5 py-3 tracking-widest font-normal">Journal Identity</th><th className="px-5 py-3 text-right tracking-widest font-normal">Posting Value</th></tr>
                     </thead>
                     <tbody className="text-text divide-y divide-border/30">
                       <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 10100' })}>
                          <td className="px-5 py-4 font-mono text-text-dim group-hover:text-gold transition-colors">10100</td>
                          <td className="px-5 py-4 text-white font-medium">Operating Cash Accounts (BTR)</td>
                          <td className="px-5 py-4 text-right font-bold"><DrillDownValue value="$842,000" label="Operating Cash (BTR)" type="Financials" onDrillDown={onDrillDown} /></td>
                       </tr>
                       <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 10200' })}>
                          <td className="px-5 py-4 font-mono text-text-dim group-hover:text-gold transition-colors">10200</td>
                          <td className="px-5 py-4 text-white font-medium">Operating Cash Accounts (SLD)</td>
                          <td className="px-5 py-4 text-right font-bold"><DrillDownValue value="$198,000" label="Operating Cash (SLD)" type="Financials" onDrillDown={onDrillDown} /></td>
                       </tr>
                       <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 11500' })}>
                          <td className="px-5 py-4 font-mono text-text-dim group-hover:text-gold transition-colors">11500</td>
                          <td className="px-5 py-4 text-white font-medium flex items-center gap-2">Contracts in Transit (CIT) <AlertCircle className="w-3 h-3 text-red-500" /></td>
                          <td className="px-5 py-4 text-right font-bold text-amber-500"><DrillDownValue value="$200,000" label="Funding Hold CIT" type="Report" color="text-amber-500" onDrillDown={onDrillDown} /></td>
                       </tr>
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="flex gap-4 pt-2 mt-4">
                <button className="bg-panel font-bold border border-border text-white px-6 py-3 rounded text-sm hover:bg-black hover:border-gold transition-all w-full flex justify-center items-center gap-2" onClick={() => onDrillDown('Action', { name: 'Generate Financial Audit export', message: 'Pulling 90-day GL reconciliation block...' })}>Extract Certified GL Export</button>
            </div>
          </div>
        );
      case 'Deal':
         return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex justify-between items-center">
               <span>Deal Desk Jacket: <DrillDownValue value={item.data.unit || item.data.customer} label={`${item.data.customer} Profile`} type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></span>
               <div className="text-[10px] text-black bg-gold font-bold px-3 py-1 rounded tracking-widest font-mono uppercase">Sales Log Validated</div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
               <div>
                  <h4 className="text-[10px] uppercase text-text-muted tracking-wide mb-3 flex items-center justify-between">
                     <span>Deal Structure Metrics</span>
                     <span className="text-text-dim tracking-normal">Status: DESKING</span>
                  </h4>
                  <div className="bg-black p-5 rounded border border-border space-y-4 text-sm font-medium">
                    {Object.entries(item.data).map(([k,v]) => k !== 'unit' && k !== 'customer' && (
                       <div key={k} className="flex justify-between items-center border-b border-border/30 pb-3 last:border-0 last:pb-0 group">
                         <span className="capitalize text-text-muted text-xs group-hover:text-white transition-colors">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                         <span className="font-bold text-white text-base"><DrillDownValue value={v} label={`${k} detail`} type="Financials" onDrillDown={onDrillDown} /></span>
                       </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase text-text-muted tracking-widest mb-3">Required Stips & Documentation</h4>
                  <div className="space-y-3 bg-charcoal p-5 rounded border border-border h-full box-border pt-6 shadow-inner">
                     <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3">
                        <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> <span className="text-white">Proof of Income</span></div>
                        <span className="text-[10px] text-green-500 font-mono tracking-widest border border-green-500/30 bg-green-900/10 px-2 py-0.5 rounded">VERIFIED</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3">
                        <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> <span className="text-white">Driver's License (State ID)</span></div>
                        <span className="text-[10px] text-green-500 font-mono tracking-widest border border-green-500/30 bg-green-900/10 px-2 py-0.5 rounded">VERIFIED</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3 cursor-pointer hover:bg-panel p-2 -mx-2 rounded transition-colors group" onClick={() => onDrillDown('Action', { name: 'Upload Residence Stip', message: 'Opening document optical reader...' })}>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-red-500/50 rounded flex-shrink-0 animate-pulse bg-red-900/10"></div> <span className="text-text-muted group-hover:text-white transition-colors">Proof of Local Residence</span></div>
                        <span className="text-[10px] text-red-500 font-mono tracking-widest border border-red-500/30 bg-red-900/10 px-2 py-0.5 rounded">PENDING UPLOAD</span>
                     </div>
                     <div className="flex justify-between items-center text-sm cursor-pointer hover:bg-panel p-2 -mx-2 rounded transition-colors group" onClick={() => onDrillDown('Action', { name: 'Upload Insurance Stip', message: 'Opening document optical reader...' })}>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-red-500/50 rounded flex-shrink-0 animate-pulse bg-red-900/10"></div> <span className="text-text-muted group-hover:text-white transition-colors">Full Coverage Ins. Binder</span></div>
                        <span className="text-[10px] text-red-500 font-mono tracking-widest border border-red-500/30 bg-red-900/10 px-2 py-0.5 rounded">PENDING UPLOAD</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-2">
                <div className="text-xs text-amber-500 leading-relaxed border-l-4 border-amber-500 pl-4 py-1 flex-[1.5] bg-amber-900/10 p-3 rounded-r font-mono">
                   <AlertCircle className="inline w-4 h-4 mr-1 text-amber-500" /> COMPLIANCE HOLD: Ensure signatures and outstanding documentation are indexed into cloud vault prior to final F&I approval routing.
                </div>
                <button className="w-full md:w-auto bg-gold hover:bg-gold-light text-black px-6 py-4 rounded font-bold shadow-lg shadow-gold/20 flex-1 text-sm border-2 border-gold uppercase tracking-wider transition-all" onClick={() => onDrillDown('Action', { name: 'Request e-Documents Securely', message: 'Dispatching Twilio tracking link to buyer...' })}>Trigger Secure Stip Link</button>
            </div>
          </div>
        );
      case 'Inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
               <h3 className="text-3xl font-playfair text-white">{item.data.unit || 'Inventory Deep Dive'}</h3>
               <div className="text-xs font-mono text-text-muted bg-panel px-4 py-2 border border-border rounded flex flex-col items-center">
                  <span className="text-[10px] text-gold tracking-widest uppercase mb-1">Stock Ledger</span>
                  <span className="text-white text-base">#{item.data.stock || Math.floor(Math.random() * 90000) + 10000}</span>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="col-span-1 bg-black rounded border border-border aspect-square flex flex-col items-center justify-center text-text-muted group relative overflow-hidden cursor-pointer" onClick={() => onDrillDown('Action', { name: 'Full Photo Gallery Overlay', message: 'Spawning media viewer...' })}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="text-white text-xs font-bold bg-panel border border-border px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2"><Search className="w-4 h-4 text-gold"/> Analyze 18 Assets</span>
                  </div>
                  <Bike className="w-20 h-20 text-border group-hover:scale-[1.15] transition-transform duration-500 mb-2" />
                  <span className="text-[10px] uppercase font-mono tracking-widest mt-2">No Visual File Mapped</span>
               </div>
               <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4 h-full">
                     <div className="bg-panel p-5 rounded border border-border hover:border-gold-dim transition-colors flex flex-col justify-between">
                        <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">Unit Status Log</div>
                        <div className="text-white font-bold text-xl mt-3"><DrillDownValue value={item.data.stage || 'Available Pipeline'} label="Status Matrix" type="Report" onDrillDown={onDrillDown} /></div>
                     </div>
                     <div className="bg-panel p-5 rounded border border-border hover:border-gold-dim transition-colors flex flex-col justify-between">
                        <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">Aging Liability</div>
                        <div className={`font-bold text-2xl mt-3 ${item.data.days > 90 ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-900/5 -mx-2 -mb-2 p-2 rounded' : 'text-green-500'}`}><DrillDownValue value={`${item.data.days || 14} Full Days`} label="Holding Time" type="Report" onDrillDown={onDrillDown} color={item.data.days > 90 ? 'text-red-500' : 'text-green-500'} /></div>
                     </div>
                     <div className="bg-panel p-5 rounded border border-border hover:border-gold-dim transition-colors flex flex-col justify-between">
                        <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">Base Cost Asset</div>
                        <div className="text-white font-bold text-2xl mt-3"><DrillDownValue value={item.data.cost || '$0 NMS'} label="Invoice / Recon Net" type="Financials" onDrillDown={onDrillDown} /></div>
                     </div>
                     <div className="bg-panel p-5 rounded border border-gold-dim border-b-[3px] border-b-gold relative overflow-hidden group flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-gold -rotate-45 translate-x-6 -translate-y-6 shadow-xl"></div>
                        <div className="text-[10px] text-gold uppercase tracking-widest border-b border-gold/20 pb-2 z-10">Internet List Price</div>
                        <div className="text-gold font-bold text-3xl mt-3 z-10 relative drop-shadow-md"><DrillDownValue value={item.data.price || 'Market TBD'} label="Published Price" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-charcoal border border-border rounded p-6 shadow-inner">
               <h4 className="text-[10px] text-text-muted font-bold tracking-widest border-b border-border pb-2 mb-5 uppercase flex justify-between items-center">
                  <span>Unit Ledger Timeline</span>
                  <span className="text-text-dim lowercase tracking-normal font-mono cursor-pointer hover:text-white transition-colors" onClick={() => onDrillDown('Report', { name: 'Full Unit Audit' })}>Expand entire history...</span>
               </h4>
               <div className="flex flex-col space-y-5 relative before:absolute before:inset-0 before:ml-[1.12rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-gold before:via-border before:to-transparent pt-2">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group flex-row-reverse md:even:flex-row">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-black text-gold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(201,168,76,0.4)] z-10 transition-transform hover:scale-110 cursor-pointer">
                          <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-panel p-5 rounded-lg border border-border hover:border-gold-dim transition-colors cursor-pointer group-hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]" onClick={() => onDrillDown('Action', { name: 'Inspect Receiving Manifest' })}>
                          <div className="flex justify-between items-center mb-2">
                             <div className="font-bold text-white text-sm">Unit Received at Dealership (Floorplan Open)</div>
                             <div className="text-[10px] font-mono text-gold bg-gold/5 border border-gold/20 px-2 py-1 rounded">Oct 12, 09:14 AM</div>
                          </div>
                          <div className="text-xs text-text-muted mt-2 border-t border-border/30 pt-2">Bill of lading captured digitally. Initial curtailment mapped to CDF funding source.</div>
                      </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border mt-2">
                <button className="bg-gold text-black px-6 py-3 rounded text-sm font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-all flex-[1.5] flex items-center justify-center gap-2 uppercase tracking-wide" onClick={() => onDrillDown('Action', { name: 'Force Immediate Markdown Approvals', message: 'Bypassing basic checks for Global Administrator protocol...' })}><TrendingDown className="w-4 h-4"/> Request GM Markdown</button>
                <button className="bg-panel text-white border border-border px-6 py-3 rounded text-sm hover:bg-black hover:border-text-muted transition-all flex-1 shadow font-bold" onClick={() => onDrillDown('Action', { name: 'Store Ledger Transfer', message: 'Moving unit metadata to alternate branch...' })}>Transfer Store</button>
                <button className="bg-panel text-white border border-border px-4 py-2 rounded text-sm hover:bg-text-muted transition-colors shadow" onClick={() => onDrillDown('Action', { name: 'Print Monroney Label', message: 'Sending label PDF to default local printer...' })}>Print Label</button>
            </div>
          </div>
        );
      case 'Employee':
      case 'RO':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-4 flex items-center justify-between">
               <span>Staff Dossier & Execution Profile</span>
               <span className="text-[10px] font-mono text-green-500 border border-green-500 rounded bg-green-900/10 px-3 py-1.5 tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.2)]"><DrillDownValue value="PERSONNEL ACTIVE" label="HR Status" type="Action" color="text-green-500" onDrillDown={onDrillDown} /></span>
            </h3>
            
            <div className="flex items-center gap-6 mb-6 bg-black p-6 rounded-xl border border-border hover:border-gold-dim transition-all cursor-pointer shadow-inner relative overflow-hidden" onClick={() => onDrillDown('Report', { name: 'KPI and Performance Breakdown Grid' })}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
              <div className="w-24 h-24 rounded-full bg-panel border-[3px] border-gold flex items-center justify-center text-5xl font-playfair text-gold shadow-[0_0_25px_rgba(201,168,76,0.25)] relative z-10">
                {item.data.name ? item.data.name[0] : 'U'}
              </div>
              <div className="flex-1 relative z-10 pb-1">
                <div className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-mono mb-1">{item.data.role || 'Sales Consultant'}</div>
                <div className="text-4xl font-playfair text-white mb-2 leading-none">{item.data.name || 'Universal Employee'}</div>
                <div className="flex items-center gap-3 text-sm text-text-muted bg-charcoal/50 w-max px-3 py-1.5 rounded-md border border-border/50">
                  <span className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-green-500"/> Clocked In</span> 
                  <span className="text-border">|</span>
                  <span className="cursor-pointer hover:text-white transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); onDrillDown('Action', { name: 'Reassign Store Anchor' }); }}><Clock className="w-3.5 h-3.5"/> {item.data.location || 'BTR Corporate'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {Object.entries(item.data).filter(([k]) => !['name', 'role', 'avatar', 'location'].includes(k)).map(([k,v]) => (
                  <div key={k} className="bg-panel p-5 rounded border border-border flex flex-col justify-center hover:bg-black transition-colors group">
                     <div className="text-[10px] text-text-dim uppercase tracking-widest mb-2 border-b border-border/50 pb-2 group-hover:text-gold-dim transition-colors">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                     <div className="text-xl font-bold text-white"><DrillDownValue value={String(v)} label={`${item.data.name} Metric: ${k}`} type="Report" onDrillDown={onDrillDown} /></div>
                  </div>
               ))}
            </div>

            <div className="bg-charcoal border border-border rounded p-6 text-sm leading-relaxed mt-4 shadow-inner">
               <strong className="text-gold text-[10px] uppercase tracking-[0.2em] mb-3 block border-b border-border/50 pb-2 font-mono">Automated Management AI Copilot Summary</strong>
               <DrillDownValue value={item.data.name || 'Resource'} label="Employee Identity" type="Employee" onDrillDown={onDrillDown} /> is pacing <span className="text-green-500 font-bold px-1 bg-green-900/20 rounded border border-green-500/20">ahead of baseline parameters</span> for the current commission period. Lead conversion velocity is extremely high this week. 
               <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                  <span className="text-gold text-xs font-bold cursor-pointer hover:underline uppercase tracking-wide flex items-center gap-1" onClick={() => onDrillDown('Action', { name: 'Construct Disciplinary/Praise HR Ticket' })}>Draft Personnel File Note <ChevronRight className="w-3 h-3"/></span>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-border mt-4">
                <button className="bg-blue-600 hover:bg-blue-500 border border-blue-400/50 text-white px-6 py-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] flex-1 shadow-[0_0_15px_rgba(37,99,235,0.4)]" onClick={() => onDrillDown('Action', { name: 'Ping employee asynchronously', message: 'Opening secure internal communications bridge...' })}>
                  <UsersIcon className="w-4 h-4" /> Message Direct to App
                </button>
                <button className="bg-black text-white hover:text-gold border border-border hover:border-gold-dim px-6 py-4 rounded text-sm transition-colors flex-1 shadow font-bold tracking-wide" onClick={() => onDrillDown('Report', { name: 'Chronological timesheet event logs' })}>
                  Audit Time & Punch Records
                </button>
            </div>
          </div>
        );
      case 'OEM':
      case 'Campaign':
      case 'Report':
      default:
        // Absolute premium generic view ensuring unmapped data still looks incredible.
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center gap-3">
               <FileBarChart className="w-7 h-7" /> {item.type} Inspector Grid
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
               {Object.entries(item.data).map(([k,v], idx) => (
                  <div key={k} className={`bg-charcoal p-5 rounded border hover:border-border transition-all shadow-inner group ${idx === 0 ? 'border-gold shadow-[0_0_20px_rgba(201,168,76,0.1)] before:absolute before:inset-0 before:bg-gold/5 overflow-hidden relative' : 'border-border/50'}`}>
                     <div className="text-[10px] text-text-dim uppercase tracking-[0.15em] mb-2 border-b border-border/50 pb-2 flex justify-between group-hover:text-white transition-colors relative z-10">
                        <span>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                     </div>
                     <div className={`font-bold relative z-10 ${idx === 0 ? 'text-3xl text-gold drop-shadow-md' : 'text-xl text-white'}`}><DrillDownValue value={String(v)} label={`Inspector Data: ${k}`} type="Report" onDrillDown={onDrillDown} color={idx === 0 ? 'text-gold' : 'text-white'} /></div>
                  </div>
               ))}
            </div>
            
            <div className="mt-6 bg-black p-6 rounded-lg border border-border text-sm shadow-inner overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
               <div className="text-gold mb-4 font-mono tracking-[0.2em] text-[10px] uppercase border-b border-border/50 pb-2 flex justify-between">
                  <span>Structured Payload Capture</span>
                  <span className="text-blue-400 bg-blue-900/10 px-2 rounded border border-blue-500/20">OS VALIDATED ✓</span>
               </div>
               <pre className="whitespace-pre-wrap font-mono text-xs leading-[1.8] text-blue-200/80 overflow-x-auto">
                  {JSON.stringify(item.data, null, 2)}
               </pre>
            </div>
            
            <div className="flex gap-4 pt-5 border-t border-border mt-4">
                <button className="bg-gold text-black px-6 py-3 rounded text-sm font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-transform hover:-translate-y-0.5" onClick={() => onDrillDown('Action', { name: `Execute write operation on backend object`, message: `Authorizing remote edit lock for ${item.type} structure...` })}>Edit Platform Record</button>
                <button className="bg-charcoal text-white hover:text-white border border-border hover:border-text-muted px-6 py-3 rounded text-sm transition-all shadow flex items-center justify-center gap-2" onClick={() => onDrillDown('Report', { name: `Global Event Audit Hash Table` })}><Search className="w-4 h-4"/> Trace Forensic Log</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pt-16 sm:p-12 items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] bg-charcoal border border-border rounded-xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] flex flex-col animate-in zoom-in-[0.98] duration-300" onClick={(e) => e.stopPropagation()}>
         <div className="flex justify-between items-center p-5 border-b border-border bg-black/40 rounded-t-xl">
           <div className="flex items-center gap-4">
             <div className="w-2 h-8 bg-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.6)]"></div>
             <div>
                <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase mb-1">DealerCommand OS™ Context Matrix</h2>
                <div className="text-[10px] font-mono text-gold tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10 inline-block">DEEP INSPECTOR :: {item.type.toUpperCase()}</div>
             </div>
           </div>
           <button onClick={onClose} className="text-text-muted hover:text-white transition-all bg-black hover:bg-red-900/30 hover:border-red-500/50 px-4 py-2.5 rounded text-xs font-bold border border-border uppercase tracking-widest flex items-center gap-2">
             <span>Esc</span> <span className="opacity-50">|</span> Close Context
           </button>
         </div>
         <div className="p-8 overflow-y-auto flex-1 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-panel/40 via-charcoal to-charcoal rounded-b-xl subtle-scrollbar">
           {renderContent()}
         </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { DrillDownValue } from './DrillDownValue';
import { getCustomer360Data, getInventoryMatches, getQuoteWorkbenchData, getAuditLogs, getEmployeeData, getLenderData, getCampaignData, getDepartmentCapacity, getGlobalInventory } from '../../data/selectors';
import { CreditPrequalAdapter } from '../../data/crmAdapters';
import { ActionExecutionService } from '../../agents/services/ActionExecutionService';
import { AgentMetrics } from '../../agents/audit/AgentMetrics';
import {
  CheckCircle2, TrendingUp, User, Bike, AlertCircle, Command,
  DollarSign, Megaphone, Search, FileBarChart, ChevronRight, TrendingDown, Users as UsersIcon, Clock, Database, BrainCircuit, Wrench, Package, Calculator, Camera, Filter
} from 'lucide-react';

export const DrillDownModal = ({ item, userRole = 'Owner', onClose, onDrillDown }) => {
  const [agentSearching, setAgentSearching] = useState(true);
  const [searchStep, setSearchStep] = useState(0);
  
  // Finance Prequal States
  const [prequalStep, setPrequalStep] = useState('capture'); // 'capture', 'loading', 'result'
  const [prequalResult, setPrequalResult] = useState(null);
  const [prequalError, setPrequalError] = useState(null);
  
  // Action Processing States
  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionStep, setActionStep] = useState(0);
  const [actionPreview, setActionPreview] = useState(null);
  const [actionResult, setActionResult] = useState(null);

  // Deal Simulator States
  const [simMsrpDiscount, setSimMsrpDiscount] = useState(0);
  const [simAcv, setSimAcv] = useState(5000);
  const [simFiGross, setSimFiGross] = useState(800);
  const [simTerm, setSimTerm] = useState(60);

  useEffect(() => {
    if (item?.type === 'AgentRecommendation') {
       AgentMetrics.trackView();
    }

    if (item?.type === 'Agent') {
      setAgentSearching(true);
      setSearchStep(0);
      
      const intervals = [
        setTimeout(() => setSearchStep(1), 600),
        setTimeout(() => setSearchStep(2), 1200),
        setTimeout(() => setSearchStep(3), 1800),
        setTimeout(() => setSearchStep(4), 2400),
        setTimeout(() => {
          setAgentSearching(false);
        }, 3000)
      ];
      return () => intervals.forEach(clearTimeout);
    }
    
    if (item?.type === 'Action') {
       setActionProcessing(true);
       setActionStep(0);
       const actionIntervals = [
          setTimeout(() => setActionStep(1), 500),
          setTimeout(() => setActionStep(2), 1000),
          setTimeout(() => setActionStep(3), 1500),
          setTimeout(() => setActionProcessing(false), 2000)
       ];
       return () => actionIntervals.forEach(clearTimeout);
    }
  }, [item]);

  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case 'AgentRecommendation':
         const isProcessing = actionProcessing;
         return (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="flex justify-between items-start border-b border-border pb-4">
                  <div>
                     <div className="text-text-muted uppercase text-[10px] font-mono tracking-widest flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-3 h-3 text-gold"/> COMMAND CENTER AI 
                        {item.data.priority === 'URGENT' || item.data.urgency === 'High' ? <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] animate-pulse">URGENT</span> : <span className="bg-panel border border-border text-text-muted px-1.5 py-0.5 rounded text-[9px]">{item.data.priority || item.data.urgency || 'NORMAL'}</span>}
                     </div>
                     <h3 className="text-2xl font-playfair text-white flex items-center gap-3">
                        {item.data.title}
                     </h3>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-1">Confidence</div>
                     <div className={`text-2xl font-bold font-mono ${item.data.confidenceScore > 85 ? 'text-green-500' : 'text-gold'}`}>{item.data.confidenceScore || 92}%</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-charcoal border border-border rounded p-6">
                        <h4 className="text-gold text-sm font-bold mb-4 border-b border-border/50 pb-2">Analysis Context & Explanation</h4>
                        <div className="text-sm text-text-muted leading-relaxed font-mono whitespace-pre-wrap">
                           {item.data.description || item.data.context}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black border border-border rounded p-5 shadow-inner">
                           <h4 className="text-[10px] text-text-dim uppercase tracking-widest font-mono mb-3">Assignment</h4>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-charcoal border border-border flex items-center justify-center text-lg text-gold font-bold">
                                 {(item.data.assignedOwner || "BTR Pool").charAt(0)}
                              </div>
                              <div>
                                 <div className="text-white font-bold text-sm">{item.data.assignedOwner || "BTR Pool"}</div>
                                 <div className="text-[10px] text-text-dim uppercase flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Due: {item.data.dueDate || "Today"}</div>
                              </div>
                           </div>
                        </div>

                        {(item.data.relatedEntities?.length > 0 || (item.data.dataPayload && Object.keys(item.data.dataPayload).length > 0)) && (
                           <div className="bg-black border border-border rounded p-5 shadow-inner">
                              <h4 className="text-[10px] text-text-dim uppercase tracking-widest font-mono mb-3">Linked Entities</h4>
                              <div className="space-y-2">
                                 {item.data.relatedEntities?.map(ent => (
                                    <div key={ent.entityId} className="bg-charcoal p-2 rounded border border-border/50 flex justify-between items-center group cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: `Drill to: ${ent.label}` })}>
                                       <div className="text-white font-bold text-xs truncate">{ent.label}</div>
                                       <ChevronRight className="w-3 h-3 text-text-muted group-hover:text-gold transition-colors" />
                                    </div>
                                 ))}
                                 {item.data.dataPayload && Object.entries(item.data.dataPayload).map(([k, v]) => (
                                    <div key={k} className="bg-charcoal p-2 rounded border border-border/50 flex justify-between items-center group cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: `Drill to: ${k}` })}>
                                       <div className="text-white font-bold text-xs truncate"><span className="text-[9px] text-text-muted uppercase tracking-widest font-mono mr-2">{k}</span> {String(v)}</div>
                                       <ChevronRight className="w-3 h-3 text-text-muted group-hover:text-gold transition-colors" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-charcoal border border-border rounded p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10"><Command className="w-16 h-16 text-gold"/></div>
                        <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2 flex justify-between">
                           Resolution Path & Actions
                        </h4>
                        
                        {isProcessing ? (
                           <div className="space-y-4 animate-in fade-in duration-300">
                              <div className="bg-black border border-gold-dim p-4 rounded text-center">
                                 <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                 <div className="text-gold text-xs font-mono uppercase tracking-widest animate-pulse">Executing Action...</div>
                                 <div className="text-xs text-text-muted mt-2">Checking Permissions & Emitting Audit Event</div>
                              </div>
                           </div>
                        ) : actionResult ? (
                           <div className="space-y-4 animate-in zoom-in-95 duration-300">
                              <div className={`border p-4 rounded text-center ${actionResult.success ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                                 {actionResult.success ? <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2"/> : <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2"/>}
                                 <div className={`text-sm font-bold ${actionResult.success ? 'text-green-500' : 'text-red-500'}`}>{actionResult.success ? 'Action Successful' : 'Action Failed'}</div>
                                 <div className="text-xs text-text-muted mt-1">{actionResult.success ? actionResult.data?.status || 'Executed' : actionResult.reason}</div>
                                 
                                 {actionResult.auditId && (
                                   <div className="text-[9px] text-text-dim font-mono uppercase tracking-widest mt-4 pt-2 border-t border-border/50">
                                     Audit ID: {actionResult.auditId}
                                   </div>
                                 )}
                              </div>
                              <button 
                                 className="w-full bg-panel hover:bg-black border border-border transition-colors px-4 py-2 rounded text-xs text-text-muted hover:text-white font-bold"
                                 onClick={onClose}
                              >
                                 Dismiss
                              </button>
                           </div>
                        ) : actionPreview ? (
                           <div className="space-y-4 animate-in zoom-in duration-300">
                              <div className="bg-black border border-gold-dim p-4 rounded">
                                 <div className="text-[10px] text-gold uppercase tracking-widest font-mono mb-2">Preview Execution</div>
                                 <div className="text-sm text-text-muted font-mono whitespace-pre-wrap">{actionPreview.preview}</div>
                              </div>
                              <div className="flex gap-2">
                                 <button 
                                    className="flex-1 bg-gold hover:bg-gold-light text-black transition-colors px-4 py-2.5 rounded text-sm font-bold"
                                    onClick={async () => {
                                       setActionProcessing(true);
                                       const res = await ActionExecutionService.executeAction(actionPreview.actionType, actionPreview.actionData, { userId: 'U-100', userRole });
                                       setActionResult(res);
                                       setActionProcessing(false);
                                    }}
                                 >
                                    Confirm Execute
                                 </button>
                                 <button 
                                    className="flex-1 border border-border bg-black hover:bg-panel transition-colors px-4 py-2.5 rounded text-sm text-white font-bold"
                                    onClick={() => setActionPreview(null)}
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-3 relative z-10 hidden-scrollbar overflow-y-auto max-h-[300px]">
                              {item.data.proposedActions?.map(action => (
                                 <button 
                                    key={action.id}
                                    className="w-full bg-gold hover:bg-gold-light text-black transition-colors px-4 py-3 rounded text-sm font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)] flex items-center justify-center gap-2"
                                    onClick={async () => {
                                       setActionProcessing(true);
                                       const res = await ActionExecutionService.previewAction(action.actionType, action.payload, { userId: 'U-100', userRole });
                                       if (res.success && res.preview) {
                                          setActionPreview({ ...res, actionType: action.actionType, actionData: action.payload });
                                       } else {
                                          setActionResult(res); // Will show permission error immediately if block
                                       }
                                       setActionProcessing(false);
                                    }}
                                 >
                                    <CheckCircle2 className="w-4 h-4"/> {action.actionType.replace(/_/g, ' ')}
                                 </button>
                              ))}

                              {/* Fallback legacy execution behavior if no specific registered proposedActions exist */}
                              {(!item.data.proposedActions || item.data.proposedActions.length === 0) && (
                                <button 
                                   className="w-full bg-gold hover:bg-gold-light text-black transition-colors px-4 py-3 rounded text-sm font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)] flex items-center justify-center gap-2"
                                   onClick={() => {
                                      if (item.data.onExecute) item.data.onExecute();
                                      onDrillDown('Action', { name: `Execute: ${item.data.title}` });
                                   }}
                                >
                                   <CheckCircle2 className="w-4 h-4"/> Approve & Execute
                                </button>
                              )}

                              <button 
                                 className="w-full border border-border bg-black hover:bg-panel transition-colors px-4 py-2.5 rounded text-sm text-white font-bold flex items-center justify-center gap-2"
                                 onClick={async () => {
                                    setActionProcessing(true);
                                    const actionType = 'SNOOZE_RECOMMENDATION';
                                    const actionData = { recommendationId: item.data.id || item.data.title, durationDays: 1 };
                                    const res = await ActionExecutionService.executeAction(actionType, actionData, { userId: 'U-100', userRole });
                                    setActionResult(res);
                                    setActionProcessing(false);
                                 }}
                              >
                                 <Clock className="w-4 h-4 text-emerald-500"/> Snooze Action
                              </button>

                              <button 
                                 className="w-full border border-border bg-black hover:bg-panel transition-colors px-4 py-2.5 rounded text-sm text-white font-bold flex items-center justify-center gap-2"
                                 onClick={async () => {
                                    setActionProcessing(true);
                                    const actionType = 'REASSIGN_OWNER';
                                    const actionData = { entityId: item.data.id || item.data.title, newOwnerId: 'EMP-4' }; // Mock target
                                    const res = await ActionExecutionService.executeAction(actionType, actionData, { userId: 'U-100', userRole });
                                    setActionResult(res);
                                    setActionProcessing(false);
                                 }}
                              >
                                 <UsersIcon className="w-4 h-4 text-blue-500"/> Reassign Owner
                              </button>
                              
                              <button 
                                 className="w-full bg-panel hover:bg-black border border-border transition-colors px-4 py-2.5 rounded text-sm text-text-muted hover:text-white font-bold flex items-center justify-center gap-2 mt-4"
                                 onClick={() => {
                                    AgentMetrics.trackDismissal();
                                    if (item.data.onDismiss) item.data.onDismiss();
                                    onClose();
                                 }}
                              >
                                 Dismiss Suggestion
                              </button>
                           </div>
                        )}
                     </div>

                     <div className="bg-charcoal border border-border rounded p-5 opacity-70">
                        <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">Audit Subroutine</div>
                        <div className="text-[10px] text-text-dim font-mono space-y-1">
                           <div>Timestamp: {new Date(item.data.timestamp || Date.now()).toLocaleString()}</div>
                           <div>Category: {item.data.category || item.data.agentId}</div>
                           <div>Session ID: {item.data.id || Math.random().toString(36).substring(7).toUpperCase()}</div>
                           <div>Engine: SuperAgent_v2</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         );
      case 'Agent':
        if (agentSearching) {
           const steps = [
             "Initializing DealerCommand AI Synthesis...",
             "Querying CRM for Customer Identity graph...",
             "Routing cross-database check: Service ROs & Parts Invoices...",
             "Executing soft-pull credit telemetry...",
             "Compiling optimal inventory matrix & F&I structures..."
           ];
           return (
             <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-in fade-in duration-500">
                <div className="relative flex items-center justify-center">
                   <div className="w-32 h-32 border-4 border-gold/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
                   <div className="w-24 h-24 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-[spin_1s_linear_infinite] absolute"></div>
                   <BrainCircuit className="w-10 h-10 text-gold absolute animate-pulse" />
                </div>
                <div className="text-center space-y-2 relative">
                   <h3 className="text-2xl font-playfair text-white fade-in">Global Database Search Agent Active</h3>
                   <div className="h-6 overflow-hidden">
                      <div className="text-sm font-mono text-gold tracking-widest uppercase transition-all duration-300 transform">
                         {steps[searchStep]}
                      </div>
                   </div>
                   <div className="flex gap-2 justify-center mt-6">
                      {[0,1,2,3,4].map(s => (
                         <div key={s} className={`w-8 h-1 rounded-full ${s <= searchStep ? 'bg-gold shadow-[0_0_10px_rgba(201,168,76,0.8)]' : 'bg-border'}`}></div>
                      ))}
                   </div>
                </div>
             </div>
           );
        }
        return (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex justify-between items-end border-b border-border pb-4">
               <div>
                  <h3 className="text-3xl font-playfair text-white flex items-center gap-3"><BrainCircuit className="w-8 h-8 text-gold"/> {userRole === 'Employee' ? 'Tactical Action Hub' : userRole === 'Manager' ? 'Operational Synthesis' : 'Enterprise Intelligence'}</h3>
                  <p className="text-sm text-text-muted mt-2">
                    {userRole === 'Owner' && 'Global macro-trends, financial exposure, and cross-store performance.'}
                    {userRole === 'Manager' && 'Store-level bottlenecks, aged inventory risk, and deal desk metrics.'}
                    {userRole === 'Employee' && 'Live execution steps, hot leads, and pending customer stipulations.'}
                  </p>
               </div>
               <div className="bg-green-900/10 border border-green-500/30 px-4 py-2 rounded text-right">
                  <div className="text-[10px] tracking-widest text-green-500 font-mono uppercase">Role Context</div>
                  <div className="text-white font-bold text-sm uppercase">{userRole}</div>
               </div>
             </div>

             {/* OWNER VIEW: Macro Financials, Cross-Store AI */}
             {userRole === 'Owner' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Action', { name: 'Audit Global Financial Accounts' })}>
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> Enterprise Capital</div>
                    <div className="text-xl font-bold text-white mb-1"><DrillDownValue value="$5,087,000" label="Total Working Capital" type="Financials" onDrillDown={onDrillDown}/></div>
                    <div className="text-xs text-text-muted mb-2">Exposure vs Assets: <span className="text-green-500 font-bold">Healthy</span></div>
                    <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded">
                       Floorplan paydowns pace cleanly against CIT. Overall leverage ratio under 1.2.
                    </div>
                 </div>

                 <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Multi-store Franchise Overview' })}>
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Database className="w-4 h-4"/> Store Comparison</div>
                    <div className="text-xl font-bold text-white mb-1"><DrillDownValue value="BTR outperforming SLD" label="Net Profit Margin Delta" type="Report" onDrillDown={onDrillDown} /></div>
                    <div className="text-xs text-text-muted mb-2">Profit Delta: <span className="text-gold font-bold">+$18,400</span></div>
                    <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded">
                       Baton Rouge F&I backend is driving variance. Slidell leads in raw unit volume but lacks back-end depth.
                    </div>
                 </div>

                 <div className="bg-charcoal border border-border rounded-lg p-4 shadow-inner border-y-[3px] border-y-gold bg-gradient-to-b from-black to-charcoal relative lg:col-span-2">
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><BrainCircuit className="w-4 h-4"/> Owner Recommendation</div>
                    <div className="text-lg font-bold text-white leading-tight mb-2">Re-allocate marketing spend towards Slidell F&I promotions.</div>
                    <div className="text-xs text-text-dim leading-relaxed">
                       Slidell is moving units but sacrificing gross. Injecting $2,000 into targeted warranty promotions for past customers at the Slidell location yields a projected <span className="text-green-500 font-bold">ROI of 640%</span>.
                    </div>
                 </div>
               </div>
             )}

             {/* MANAGER VIEW: Store Bottlenecks, Deal Desk */}
             {userRole === 'Manager' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Action', { name: 'Review Aged Inventory' })}>
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><AlertCircle className="w-4 h-4"/> Floorplan Risk</div>
                    <div className="text-xl font-bold text-white mb-1"><DrillDownValue value="8 Units Aging > 120d" label="Aged Units Liability" type="Inventory" onDrillDown={onDrillDown}/></div>
                    <div className="text-xs text-text-muted mb-2">Monthly Carry Cost: <span className="text-red-500 font-bold">$2,560</span></div>
                    <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded">
                       Primarily heavyweight cruisers and off-brand trade-ins. Recommend aggressive markdown.
                    </div>
                 </div>

                 <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-gold-dim transition-colors group cursor-pointer" onClick={() => onDrillDown('Employee', { name: 'Alex' })}>
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><UsersIcon className="w-4 h-4"/> Team Performance</div>
                    <div className="text-xl font-bold text-white mb-1"><DrillDownValue value="Sales Closing Ratio: 18%" label="Store Target Delta" type="Employee" onDrillDown={onDrillDown} /></div>
                    <div className="text-xs text-text-muted mb-2">Lead Dropout: <span className="text-amber-500 font-bold">Needs Coaching</span></div>
                    <div className="text-[10px] text-text-dim leading-relaxed bg-black p-2 rounded">
                       Alex's internet lead closing ratio dropped 12% MTD. 8 untouched leads sitting in queue &gt; 24hrs.
                    </div>
                 </div>

                 <div className="bg-charcoal border border-border rounded-lg p-4 shadow-inner border-y-[3px] border-y-gold bg-gradient-to-b from-black to-charcoal relative">
                    <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><BrainCircuit className="w-4 h-4"/> Manager Recommendation</div>
                    <div className="text-lg font-bold text-white leading-tight mb-2">Initiate Flash Sale & Reassign Leads.</div>
                    <div className="text-[10px] text-text-dim leading-relaxed">
                       Drop 8 aged unit prices by $500 each and assign them via Twilio blast directly to the top 3 reps to quickly clear floorplan liability before month-end cutoff.
                    </div>
                 </div>
               </div>
             )}

             {/* EMPLOYEE VIEW: Actionable Tactical Steps */}
             {userRole === 'Employee' && (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <div className="bg-charcoal border border-border rounded p-4 shadow-inner lg:col-span-1 border-l-[3px] border-l-gold flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> My Pacing</div>
                      <div className="text-4xl font-playfair text-white mb-1"><DrillDownValue value="$4,200" label="Current Earned Commission" type="Employee" onDrillDown={onDrillDown}/></div>
                      <div className="text-xs text-text-muted mb-2">Projected EOM: <span className="text-green-500 font-bold">$7,450</span></div>
                    </div>
                    <div className="text-sm text-text-dim font-mono bg-black p-3 rounded border border-border">
                       2 Units away from next tier bump (+5% back-end share).
                    </div>
                 </div>

                 <div className="bg-black border border-border rounded-lg p-6 shadow-2xl relative overflow-hidden lg:col-span-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-border/50 pb-2"><Clock className="w-5 h-5 text-amber-500"/> Immediate Action Items</h4>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-center bg-panel border-l-4 border-amber-500 p-4 rounded-lg cursor-pointer hover:bg-charcoal transition-colors group">
                          <div>
                             <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-1">Missing Deal Stipulation</div>
                             <div className="text-lg font-bold text-white group-hover:text-gold transition-colors">Vance Deal - Needs Proof of Residence</div>
                             <div className="text-xs text-text-muted mt-1">Finance approval pending this final doc.</div>
                          </div>
                          <button className="bg-black border border-border px-4 py-2 rounded text-xs text-white" onClick={() => onDrillDown('Action', { name: "Send SMS Doc Link to Vance" })}>Send Upload Link</button>
                       </div>

                       <div className="flex justify-between items-center bg-panel border-l-4 border-green-500 p-4 rounded-lg cursor-pointer hover:bg-charcoal transition-colors group">
                          <div>
                             <div className="text-[10px] text-green-500 font-mono tracking-widest uppercase mb-1">Hot Internet Lead</div>
                             <div className="text-lg font-bold text-white group-hover:text-gold transition-colors">Emily White (2023 YZF-R7)</div>
                             <div className="text-xs text-text-muted mt-1">Submitted "Get Best Price" 5 mins ago.</div>
                          </div>
                          <button className="bg-green-900/40 border border-green-500 text-green-500 px-4 py-2 rounded text-xs" onClick={() => onDrillDown('Action', { name: "Call Emily now" })}>Call Now</button>
                       </div>
                    </div>
                 </div>
               </div>
             )}

             <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-border mt-6">
                 {userRole !== 'Employee' && (
                    <button className="bg-gold text-black px-8 py-4 rounded text-sm font-bold shadow-[0_0_20px_rgba(201,168,76,0.25)] hover:bg-gold-light hover:scale-[1.02] transition-all flex-[2] flex justify-center items-center gap-2 uppercase tracking-widest" onClick={() => onDrillDown('Action', { name: 'Generate AI Action Plan', message: 'Routing tailored execution strategy to team...' })}><CheckCircle2 className="w-5 h-5"/> Deploy Recommended Strategy</button>
                 )}
                 <button className="bg-panel text-white border border-border px-8 py-4 rounded text-sm hover:bg-black hover:border-gold-dim transition-all flex-1 shadow font-bold tracking-wide" onClick={onClose}>Acknowledge Briefing</button>
             </div>
          </div>
        );
      case 'CRM_Customer360': {
        const crmData = getCustomer360Data(item.data.customerId);
        if (!crmData.customer) return <div className="text-white p-8">Customer not found.</div>;
        const matches = getInventoryMatches(item.data.customerId);
        
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
             <div className="flex justify-between items-end border-b border-border pb-4">
               <div>
                  <div className="text-text-muted uppercase text-[10px] font-mono tracking-widest flex items-center gap-2 mb-2">
                     <UsersIcon className="w-3 h-3 text-gold"/> CUSTOMER 360 PROFILE
                  </div>
                  <h3 className="text-3xl font-playfair text-white flex items-center gap-3">
                    {crmData.customer.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><Command className="w-4 h-4"/> {crmData.customer.phone}</span>
                    <span className="flex items-center gap-1"><Search className="w-4 h-4"/> {crmData.customer.email}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                     {crmData.customer.tags?.map(t => (
                        <span key={t} className="bg-charcoal border border-border px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-white">{t}</span>
                     ))}
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] tracking-widest text-text-muted font-mono uppercase mb-1">Lifetime Value</div>
                  <div className="text-2xl font-bold text-green-500">${crmData.customer.LTV.toLocaleString()}</div>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="space-y-6">
                   <div className="bg-charcoal border border-border rounded p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit className="w-16 h-16 text-gold"/></div>
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2">Customer Memory Tiles</h4>
                      <div className="space-y-3">
                         <div className="bg-black border border-border p-3 rounded text-xs flex items-center justify-between">
                            <span className="text-text-muted">Rider Persona</span>
                            <span className="text-white font-bold bg-panel px-2 py-0.5 rounded border border-border">Weekend Cruiser</span>
                         </div>
                         <div className="bg-black border border-border p-3 rounded text-xs flex items-center justify-between">
                            <span className="text-text-muted">Skill Level</span>
                            <span className="text-white font-bold bg-panel px-2 py-0.5 rounded border border-border">Intermediate</span>
                         </div>
                         <div className="bg-black border border-border p-3 rounded text-xs flex flex-col gap-1">
                            <span className="text-text-muted">Use Case / Constraints</span>
                            <span className="text-white font-mono bg-panel px-2 py-1.5 rounded border border-border text-[10px] leading-relaxed">Needs passenger backrest, limited garage space. Prefers long-distance comfort over speed.</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-charcoal border border-border rounded p-5">
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2">Relationships</h4>
                      {crmData.household ? (
                        <div className="text-sm">
                           <div className="text-white font-bold mb-1">{crmData.household.name}</div>
                           <div className="text-xs text-text-muted mb-2">{crmData.household.address}</div>
                           <div className="text-[10px] bg-panel inline-block px-2 py-1 rounded text-text-muted">Household LTV: <span className="text-green-500 font-bold">${crmData.household.totalLTV.toLocaleString()}</span></div>
                        </div>
                      ) : (
                        <div className="text-xs text-text-muted">No household linkages found.</div>
                      )}
                   </div>

                   <div className="bg-charcoal border border-border rounded p-5">
                      <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                        <h4 className="text-gold text-xs uppercase tracking-widest font-mono">Recent Trade Appraisals</h4>
                        <button className="text-[10px] bg-panel text-white border border-border px-2 py-0.5 rounded hover:bg-black transition-colors" onClick={() => onDrillDown('Trade_Capture', {customerId: crmData.customer.id})}>+ ADD TRADE</button>
                      </div>
                      {crmData.trades.length > 0 ? (
                         <div className="space-y-3">
                           {crmData.trades.map(t => (
                             <div key={t.id} className="bg-black border border-border p-3 rounded text-sm cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Action', {name: 'View Trade Form'})}>
                               <div className="text-white font-bold">{t.year} {t.make} {t.model}</div>
                               <div className="flex justify-between items-center mt-2">
                                 <div className="text-[10px] text-text-muted">{t.mileage.toLocaleString()} mi.</div>
                                 <div className="text-green-500 font-bold text-xs">+${t.actualCashValue.toLocaleString()} ACV</div>
                               </div>
                             </div>
                           ))}
                         </div>
                      ) : (
                        <div className="text-xs text-text-muted">No trade-in history.</div>
                      )}
                   </div>

                   <div className="bg-charcoal border border-border rounded p-5 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-900/10 to-transparent">
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2 flex items-center gap-2"><Wrench className="w-3 h-3 text-blue-500"/> Service Loyalty Flywheel</h4>
                      <div className="text-sm">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-text-muted">RO Spend (12m)</span>
                            <span className="text-white font-bold">$1,480</span>
                         </div>
                         <div className="bg-blue-900/20 text-blue-400 text-[10px] p-2 rounded border border-blue-900/50 leading-relaxed font-mono">
                            <span className="font-bold uppercase tracking-widest block mb-1 text-blue-300">Upgrade Vector Detected</span>
                            Customer spent $800+ on repairs in last 6 months on a 5+ yr old unit. Highly likely to convert to new purchase if presented with equity rollover options.
                         </div>
                         <button className="w-full mt-3 bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 py-1.5 rounded text-xs font-bold transition-colors border border-blue-900/50" onClick={() => onDrillDown('Action', {name: "Build Equity Pitch"})}>Generate Equity Offer</button>
                      </div>
                   </div>
                   
                   <div className="bg-charcoal border border-border rounded p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit className="w-16 h-16 text-gold"/></div>
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2 flex items-center gap-2"><Package className="w-3 h-3"/> AI Inventory Matches</h4>
                      
                      <div className="space-y-4">
                         {matches.exactMatches.length > 0 && matches.exactMatches.map(m => (
                           <div key={m.id} className="bg-black border border-border p-3 rounded group cursor-pointer hover:border-gold transition-colors block" onClick={() => onDrillDown('Inventory', {stock: m.stock, make: m.brandId})}>
                              <div className="flex justify-between items-start">
                                 <div>
                                   <div className="text-xs text-green-500 font-bold mb-1 uppercase tracking-wider">Exact Match</div>
                                   <div className="text-white font-bold text-sm">{m.year} {m.model}</div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-gold font-bold text-sm">${m.price?.toLocaleString()}</div>
                                    <div className="text-[10px] text-text-muted">{m.stock}</div>
                                 </div>
                              </div>
                           </div>
                         ))}
                         {matches.nearMatches.length > 0 && matches.nearMatches.map(m => (
                           <div key={m.id} className="bg-black border border-border p-3 rounded group cursor-pointer hover:border-gold transition-colors opacity-80" onClick={() => onDrillDown('Inventory', {stock: m.stock, make: m.brandId})}>
                              <div className="flex justify-between items-start">
                                 <div>
                                   <div className="text-[10px] text-amber-500 font-bold mb-1 uppercase tracking-wider flex items-center gap-1"><TrendingDown className="w-3 h-3"/> Aged Alternative</div>
                                   <div className="text-white font-bold text-sm">{m.year} {m.model}</div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-gold font-bold text-sm">${m.price?.toLocaleString()}</div>
                                    <div className="text-[10px] text-text-muted">{m.ageDays} days old</div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="bg-charcoal border border-border rounded p-5">
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2 flex justify-between">
                         <span>Compliance Status</span>
                      </h4>
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs items-center bg-black border border-border p-2 rounded">
                            <span className="text-text-muted">Credit Application</span>
                            {crmData.prequals.length > 0 ? (
                               <span className="text-green-500 font-bold text-[10px] uppercase border border-green-500/30 px-1 rounded">{crmData.prequals[0].status}</span>
                            ) : (
                               <span className="text-text-dim text-[10px] uppercase">None on file</span>
                            )}
                         </div>
                         <div className="flex justify-between text-xs items-center bg-black border border-border p-2 rounded">
                            <span className="text-text-muted">Communication Consent</span>
                            <span className="text-green-500 font-bold text-[10px] uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Middle & Right Column - Timeline */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="flex gap-2 border-b border-border pb-4">
                     <button className="bg-gold text-black px-4 py-2 rounded text-xs font-bold shadow hover:bg-gold-light transition-colors" onClick={() => onDrillDown('Action', {name: 'Send SMS', message: 'Opening SMS composer...'})}>Send SMS / Email</button>
                     <button className="bg-panel border border-border text-white px-4 py-2 rounded text-xs font-bold hover:bg-black transition-colors" onClick={() => onDrillDown('Action', {name: 'Log Call', message: 'Opening call log overlay...'})}>Log Call</button>
                     <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-xs font-bold hover:border-gold transition-colors ml-auto flex items-center gap-1" onClick={() => onDrillDown('Quote_Workbench', {customerId: crmData.customer.id})}><FileBarChart className="w-3 h-3"/> Build Quote</button>
                   </div>

                   <div className="bg-charcoal border border-border rounded p-6 h-[400px] overflow-y-auto subtle-scrollbar relative">
                      <h4 className="text-white font-bold mb-6 flex items-center gap-2 sticky top-0 bg-charcoal pb-4 border-b border-border z-10"><Clock className="w-4 h-4 text-gold"/> Activity Timeline</h4>
                      
                      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                          {crmData.communications.map((c, i) => (
                             <div key={c.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-charcoal bg-panel text-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                                   {c.direction === 'in' ? <User className="w-4 h-4"/> : <Megaphone className="w-4 h-4"/>}
                                </div>
                                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-black border border-border p-4 rounded-xl shadow cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('TimelineEvent', c)}>
                                   <div className="flex flex-col mb-1">
                                      <div className="text-xs font-bold text-white mb-1 flex justify-between">
                                         <span>{c.type} {c.direction === 'in' ? 'Received' : 'Sent'}</span>
                                         <span className="text-[10px] text-text-dim font-normal">{new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      </div>
                                   </div>
                                   <div className="text-sm text-text-muted leading-relaxed">"{c.body}"</div>
                                </div>
                             </div>
                          ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      }
      case 'Quote_Workbench': {
        const wb = getQuoteWorkbenchData(item.data.customerId);
        if (!wb.customer) return <div className="text-white p-8">Quote system error.</div>;
        
        const standardScenario = wb.scenarios.find(s => s.name === 'Standard Payment') || wb.scenarios[0];
        const hasTrade = wb.currentTrade !== undefined;

        return (
           <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
             <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                   <div className="text-text-muted uppercase text-[10px] font-mono tracking-widest flex items-center gap-2 mb-2">
                     <Calculator className="w-3 h-3 text-gold"/> DESKING LITE & QUOTE WORKBENCH
                   </div>
                   <h3 className="text-2xl font-playfair text-white flex items-center gap-3">
                     Deal Worksheet: {wb.customer.name}
                   </h3>
                </div>
                <div className="flex gap-2">
                   <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-xs font-bold hover:border-gold transition-colors block"><FileBarChart className="w-4 h-4 inline-block mr-2"/> PDF Proposal</button>
                   <button className="bg-gold text-black px-4 py-2 rounded text-xs font-bold hover:bg-gold-light transition-colors shadow" onClick={() => onDrillDown('Action', {name: 'Send Quote', message: 'Dispatching via SMS & Email...'})}>Send to Customer</button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-charcoal border border-border rounded p-6">
                      <h4 className="text-gold text-sm font-bold mb-4 border-b border-border/50 pb-2 flex justify-between items-center">
                         Pricing Stack
                         <button className="text-[10px] bg-panel text-white px-2 py-1 rounded border border-border hover:bg-black uppercase">Edit Setup</button>
                      </h4>
                      <div className="space-y-2 font-mono text-sm">
                         <div className="flex justify-between text-text-muted">
                            <span>Vehicle MSRP (2024 Honda Talon 1000R)</span>
                            <span className="text-white">$23,699.00</span>
                         </div>
                         <div className="flex justify-between text-text-muted">
                            <span>ADM / Freight / Prep</span>
                            <span className="text-white">$1,195.00</span>
                         </div>
                         <div className="flex justify-between text-text-muted">
                            <span>Accessory Package (Roof, Winch)</span>
                            <span className="text-white">$2,450.00</span>
                         </div>
                         <div className="flex justify-between text-text-muted border-t border-border pt-2">
                            <span>Total Selling Price</span>
                            <span className="text-white font-bold">$27,344.00</span>
                         </div>
                         <div className="flex justify-between text-red-400">
                            <span>Trade-In Allowance (2020 Kawasaki Z900)</span>
                            <span>-${(wb.currentTrade?.actualCashValue || 4500).toLocaleString()}.00</span>
                         </div>
                         <div className="flex justify-between text-red-500">
                            <span>Trade Payoff Amount</span>
                            <span>+${(wb.currentTrade?.payOffAmount || 0).toLocaleString()}.00</span>
                         </div>
                         <div className="flex justify-between text-text-muted">
                            <span>Doc Fee & State Fees</span>
                            <span className="text-white">$325.00</span>
                         </div>
                         <div className="flex justify-between text-text-muted">
                            <span>Estimated Taxes (LA - 9.45%)</span>
                            <span className="text-white">$2,156.40</span>
                         </div>
                         <div className="flex justify-between items-center border-t border-gold mt-4 pt-4">
                            <span className="text-gold font-bold text-lg uppercase">Amount Financed</span>
                            <span className="text-2xl text-white font-bold">${(27344 - (wb.currentTrade?.actualCashValue||4500) + 325 + 2156.40).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      {wb.scenarios.map(sc => (
                         <div key={sc.id} className={`bg-black border p-4 rounded cursor-pointer transition-colors ${sc.isSelected ? 'border-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]' : 'border-border hover:border-gold-dim'}`}>
                            <div className="flex justify-between items-center mb-2">
                               <div className="font-bold text-white text-sm">{sc.name}</div>
                               {sc.isSelected && <CheckCircle2 className="w-4 h-4 text-gold"/>}
                            </div>
                            <div className="text-3xl text-gold font-bold mb-1">${sc.monthlyPayment.toFixed(2)}<span className="text-sm text-text-muted font-normal"> /mo</span></div>
                            <div className="text-xs text-text-muted font-mono">{sc.termLength} months @ {sc.apr}% APR</div>
                         </div>
                      ))}
                      <div className="bg-panel border border-dashed border-border p-4 rounded flex flex-col items-center justify-center text-text-muted hover:text-white hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', {name: 'Add Scenario'})}>
                         <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-2 group-hover:bg-gold group-hover:text-black transition-colors">+</div>
                         <div className="text-xs font-bold uppercase tracking-wider">Add Scenario</div>
                      </div>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="bg-charcoal border border-border rounded p-5">
                      <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2 flex justify-between">
                         Action Center
                      </h4>
                      <div className="space-y-3">
                         <button className="w-full bg-black border border-border text-white p-3 rounded text-sm text-left hover:border-gold transition-colors" onClick={() => onDrillDown('Finance_Prequal', {customerId: wb.customer.id})}>
                            <div className="font-bold mb-1 text-blue-400">Run Finance Prequal</div>
                            <div className="text-[10px] text-text-muted">Trigger soft-pull or push to Octane/Synchrony.</div>
                         </button>
                         <button className="w-full bg-black border border-border text-white p-3 rounded text-sm text-left hover:border-gold transition-colors" onClick={() => onDrillDown('Action', {name: 'Manager Override'})}>
                            <div className="font-bold mb-1 text-amber-500">Request Manager Override</div>
                            <div className="text-[10px] text-text-muted">Unlock price limits and desk reserve margins.</div>
                         </button>
                      </div>
                   </div>
                   
                   {!hasTrade && (
                      <div className="bg-charcoal border border-border rounded p-5 border-l-4 border-l-red-500">
                         <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0"/>
                            <div>
                               <div className="text-sm text-white font-bold mb-1">Missing Trade-In</div>
                               <div className="text-xs text-text-muted mb-3">AI Equity Scan indicates this customer likely owns a 2021 MT-07. Capture a trade appraisal to increase likelihood to close.</div>
                               <button className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold" onClick={() => onDrillDown('Trade_Capture', {customerId: wb.customer.id})}>Start Appraisal</button>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>
           </div>
        );
      }
      case 'Trade_Capture': {
         const customerId = item.data.customerId;
         return (
            <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
               <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Camera className="w-6 h-6 text-gold"/>
                  <h3 className="text-2xl font-playfair text-white">Capture Trade-In Details</h3>
               </div>
               
               <div className="bg-charcoal border border-border rounded p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">VIN (17 Digits)</label>
                        <input type="text" className="w-full bg-black border border-border rounded p-2 text-white focus:border-gold outline-none" placeholder="Scan or type VIN..." />
                     </div>
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Odometer / Hours</label>
                        <input type="number" className="w-full bg-black border border-border rounded p-2 text-white focus:border-gold outline-none" placeholder="e.g. 12500" />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Year</label>
                        <input type="text" className="w-full bg-black border border-border rounded p-2 text-white" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Make</label>
                        <input type="text" className="w-full bg-black border border-border rounded p-2 text-white" />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Model / Trim</label>
                        <input type="text" className="w-full bg-black border border-border rounded p-2 text-white" />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                     <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Condition Grading & Recon</label>
                     <div className="grid grid-cols-3 gap-3">
                        <button className="bg-panel border border-border rounded p-3 text-sm text-white hover:border-gold text-center active:bg-gold active:text-black">Excellent<div className="text-[10px] text-text-muted mt-1 font-mono">Clean, no recon</div></button>
                        <button className="bg-panel border border-border rounded p-3 text-sm text-white hover:border-gold text-center active:bg-gold active:text-black">Good<div className="text-[10px] text-text-muted mt-1 font-mono">Minor wear, &lt;$500 recon</div></button>
                        <button className="bg-panel border border-border rounded p-3 text-sm text-white hover:border-gold text-center active:bg-gold active:text-black">Rough<div className="text-[10px] text-text-muted mt-1 font-mono">Damage, &gt;$1000 recon</div></button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Estimated Lien Payoff</label>
                        <div className="relative">
                           <DollarSign className="w-4 h-4 text-text-muted absolute left-3 top-3"/>
                           <input type="number" className="w-full bg-black border border-border rounded p-2 pl-9 text-white focus:border-red-500 outline-none" placeholder="0.00" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Requested ACV (Appraisal Hold)</label>
                        <div className="relative">
                           <DollarSign className="w-4 h-4 text-text-muted absolute left-3 top-3"/>
                           <input type="number" className="w-full bg-black border border-border rounded p-2 pl-9 text-gold font-bold focus:border-gold outline-none" placeholder="0.00" />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                     <button className="px-6 py-2 rounded border border-border text-white hover:bg-panel transition-colors" onClick={onClose}>Cancel</button>
                     <button className="px-6 py-2 rounded bg-gold text-black font-bold hover:bg-gold-light transition-colors" onClick={() => onDrillDown('Action', {name: 'Submit Appraisal', message: 'Routing to Used Bike Manager desk for ACV approval...'})}>Submit for ACV Approval</button>
                  </div>
               </div>
            </div>
         );
      }
      case 'Finance_Prequal': {
         const isSales = userRole === 'Sales Associate';

         const handlePrequalSubmit = async (e) => {
            e.preventDefault();
            setPrequalStep('loading');
            setPrequalError(null);
            
            const formData = new FormData(e.target);
            const req = {
               ssnRaw: formData.get('ssn'),
               creditEstimate: formData.get('estimate'),
               income: formData.get('income')
            };

            // Mock an active consent record
            const mockConsent = formData.get('consent') === 'on' ? { ipAddress: '192.168.1.100' } : null;

            try {
               const res = await CreditPrequalAdapter.submitApplication({id: 'EMP-1', role: userRole, name: 'Active User'}, item.data.customerId, req, mockConsent);
               if (res.success) {
                  setPrequalResult(res);
                  setPrequalStep('result');
               } else {
                  setPrequalError(res.error);
                  if (res.needsAdverseAction) {
                     setPrequalResult(res); // allows us to render the Adverse block
                     setPrequalStep('result');
                  } else {
                     setPrequalStep('capture');
                  }
               }
            } catch (err) {
               setPrequalError(err.message);
               setPrequalStep('capture');
            }
         };

         return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
               <div className="flex justify-between items-center border-b border-border pb-4">
                 <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-blue-400"/>
                    <h3 className="text-2xl font-playfair text-white">Soft-Pull Prequalification</h3>
                 </div>
                 {isSales && (
                    <span className="bg-panel border border-blue-900 text-blue-400 px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Sales View Masking Active</span>
                 )}
               </div>

               {prequalStep === 'capture' && (
                  <form onSubmit={handlePrequalSubmit} className="bg-charcoal border border-border rounded p-6 space-y-6">
                     {prequalError && (
                        <div className="bg-red-900/20 border border-red-500 text-red-500 p-3 rounded text-sm flex items-center gap-2 mb-4">
                           <AlertCircle className="w-4 h-4 shrink-0"/> {prequalError}
                        </div>
                     )}

                     <div className="bg-black border border-border p-4 rounded mb-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                           <div className="pt-1"><input type="checkbox" name="consent" required className="w-4 h-4 accent-gold" /></div>
                           <div>
                              <div className="text-white font-bold text-sm mb-1 group-hover:text-gold transition-colors">Capture Verbal / Digital Consent</div>
                              <div className="text-[10px] text-text-muted leading-relaxed">By checking this box, the customer authorizes Friendly Powersports to pull a soft credit inquiry. This will not affect their credit score. IP address and timestamp will be logged for audit compliance.</div>
                           </div>
                        </label>
                     </div>

                     <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                           <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">SSN or ITIN (Required)</label>
                           <input type="text" name="ssn" required minLength="9" maxLength="11" placeholder="XXX-XX-XXXX" className="w-full bg-black border border-border rounded p-2 text-white font-mono tracking-widest focus:border-gold outline-none" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Gross Monthly Income</label>
                           <div className="relative">
                              <DollarSign className="w-4 h-4 text-text-muted absolute left-3 top-3"/>
                              <input type="number" name="income" required defaultValue="5000" className="w-full bg-black border border-border rounded p-2 pl-9 text-white focus:border-gold outline-none" />
                           </div>
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Self-Reported Credit Estimate</label>
                        <select name="estimate" className="w-full bg-black border border-border rounded p-2 text-white focus:border-gold outline-none cursor-pointer">
                           <option value="Excellent">Excellent (720+)</option>
                           <option value="Good">Good (680-719)</option>
                           <option value="Fair">Fair (620-679)</option>
                           <option value="Poor">Poor (580-619)</option>
                           <option value="Bad">Bad (Under 580)</option>
                        </select>
                     </div>

                     <div className="pt-4 flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-500 transition-colors shadow flex items-center gap-2">Execute Soft Pull <ChevronRight className="w-4 h-4"/></button>
                     </div>
                  </form>
               )}

               {prequalStep === 'loading' && (
                  <div className="bg-charcoal border border-border rounded p-12 flex flex-col items-center justify-center space-y-4">
                     <BrainCircuit className="w-12 h-12 text-blue-500 animate-pulse" />
                     <div className="text-white font-bold text-lg animate-pulse">Running Soft-Pull Decision Engine...</div>
                     <div className="text-xs text-text-muted font-mono uppercase tracking-widest">Querying Mock Provider • Verifying Identity • Hashing SSN</div>
                  </div>
               )}

               {prequalStep === 'result' && prequalResult && (
                  <div className="space-y-6">
                     {prequalResult.needsAdverseAction ? (
                        <div className="bg-charcoal border-l-4 border-l-red-500 rounded p-6">
                           <div className="flex items-start gap-4">
                              <AlertCircle className="w-8 h-8 text-red-500 shrink-0"/>
                              <div className="space-y-3">
                                 <h4 className="text-xl font-bold text-white">Application Declined</h4>
                                 <div className="text-sm text-text-muted">The soft pull could not match the applicant to a viable financing tier.</div>
                                 <div className="bg-black border border-border p-3 rounded mt-3">
                                    <div className="text-[10px] text-text-dim uppercase tracking-widest font-mono mb-2 border-b border-border/50 pb-2">Compliance Action Required</div>
                                    <div className="text-white text-sm">You must provide an Adverse Action Notice to the customer.</div>
                                    <button className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1.5 rounded text-xs font-bold mt-3 hover:bg-red-500 hover:text-white transition-colors">Generate Notice</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="bg-charcoal border border-border rounded p-6">
                           <div className="flex items-start justify-between mb-6">
                              <div>
                                 <div className="text-blue-400 font-bold mb-1 text-xl flex items-center gap-2"><CheckCircle2 className="w-6 h-6"/> {prequalResult.decision}</div>
                                 <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Via {prequalResult.provider}</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-1">Approval Limit</div>
                                 <div className="text-2xl text-gold font-bold">${prequalResult.maxAmount?.toLocaleString()}</div>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-black border border-border p-4 rounded">
                                 <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-1">Credit Tier / Band</div>
                                 <div className="text-lg text-white font-bold">{isSales ? 'REDACTED' : prequalResult.tier}</div>
                                 {!isSales && <div className="text-xs text-amber-500 mt-1">{prequalResult.scoreBand}</div>}
                              </div>
                              <div className="bg-black border border-border p-4 rounded">
                                 <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-1">Base Rate (Buy)</div>
                                 <div className="text-lg text-white font-bold">{isSales ? 'REDACTED' : `${prequalResult.assignedAPR}%`}</div>
                              </div>
                           </div>

                           <div className="bg-black border border-border p-4 rounded mb-6">
                              <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">Audit & Stipulations</div>
                              <ul className="list-disc list-inside text-sm text-text-dim space-y-1">
                                 {prequalResult.stipulationList?.map((s,i) => <li key={i}>{s}</li>)}
                                 {!isSales ? (
                                    <li className="text-amber-500">{prequalResult.secureNotes}</li>
                                 ) : (
                                    <li className="text-green-500">SSN Masked & Secured by RBAC.</li>
                                 )}
                              </ul>
                           </div>

                           <div className="flex justify-end">
                              <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-500 transition-colors shadow" onClick={() => onDrillDown('Action', {name: 'Push to Deal'})}>Push to Deal Workbench</button>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         );
      }
      case 'Action':
        const actionTitle = item.data.name || item.data.title || 'System Process';
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex items-center gap-3"><Command className="w-6 h-6"/> System Action: {actionTitle}</h3>
            
            <div className={`bg-black p-6 rounded border ${actionProcessing ? 'border-gold-dim animate-pulse shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]'} min-h-[150px] font-mono`}>
               {actionProcessing ? (
                 <div className="text-xs text-text-muted space-y-2">
                    <div className="text-gold">[{new Date().toISOString()}] INITIALIZING DEEP INSPECTOR: {item.data.name}</div>
                    {actionStep > 0 && <div>[{new Date().toISOString()}] AUTHORIZED: <span className="text-white">{userRole} Credentials Validated.</span></div>}
                    {actionStep > 1 && <div>[{new Date().toISOString()}] ROUTING: Core API Network... {item.data.message || 'Executing standard protocol.'}</div>}
                    {actionStep > 2 && <div className="text-gold mt-4">FETCHING CONTEXTUAL PAYLOAD...</div>}
                 </div>
               ) : (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-4">
                       <CheckCircle2 className="w-6 h-6 text-green-500" />
                       <div>
                          <div className="text-white font-bold text-sm">Action Successfully Processed</div>
                          <div className="text-[10px] text-text-muted">Network latency: ~142ms. 100% Data Integrity.</div>
                       </div>
                    </div>
                    
                    <div className="text-white text-sm mb-4">
                       {item.data.message || `EXECUTED PROTOCOL: ${(item.data.name || item.data.title || 'SYS_ACTION').toUpperCase()}`}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/30">
                       <div className="text-[10px] uppercase text-gold tracking-widest mb-3">Retrieved Context Payload:</div>
                       <div className="bg-charcoal border border-border rounded p-3 text-xs overflow-auto max-h-48 custom-scrollbar">
                          <pre className="text-text-muted font-mono leading-relaxed">
                             {JSON.stringify(
                                item.data.records && (Array.isArray(item.data.records) ? item.data.records.length > 0 : Object.keys(item.data.records).length > 0)
                                  ? (Array.isArray(item.data.records) ? item.data.records.slice(0, 15) : item.data.records)
                                  : {
                                      status: "200_OK",
                                      transactionId: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
                                      timestamp: new Date().toISOString(),
                                      action: item.data.name || item.data.title || "SYSTEM_DISPATCH",
                                      matrix_trace: "No additional payload properties supplied.",
                                      context_bind: "Anonymous parameters safely ignored."
                                    }, null, 2
                             )}
                          </pre>
                          {Array.isArray(item.data.records) && item.data.records.length > 15 && <div className="text-gold mt-2">...and {item.data.records.length - 15} more records hidden from console view.</div>}
                       </div>
                    </div>
                 </div>
               )}
            </div>
            <div className="flex gap-4 pt-4 border-t border-border mt-4">
                <button className="bg-panel hover:bg-black text-white px-6 py-3 rounded text-sm transition-colors flex-1 shadow font-bold border border-border" onClick={onClose}>Acknowledge & Close</button>
                {!actionProcessing && (
                  <button className="bg-gold hover:bg-gold-light text-black px-6 py-3 rounded text-sm font-bold flex-1 shadow animate-in fade-in" onClick={() => {
                     const logs = [
                        { title: 'AUTH_VERIFY', subtitle: `Validate ${userRole} token`, value: '200 OK' },
                        { title: 'API_DISPATCH', subtitle: `Route to ${String(item.data.name || item.data.title || 'SYS_ACTION').slice(0, 15)}...`, value: '202 ACCEPT' },
                        { title: 'DB_COMMIT', subtitle: 'Transaction row locked', value: '1 ROW' }
                     ];
                     if (item.data.records && Array.isArray(item.data.records) && item.data.records.length > 0) {
                        logs.push(...item.data.records.slice(0,5).map(r => ({ title: 'PAYLOAD_MAP', subtitle: r.title || r.name || 'Data Row', value: 'PARSED' })));
                     } else if (item.data.records && Object.keys(item.data.records).length > 0) {
                        logs.push(...Object.entries(item.data.records).slice(0,5).map(([k, v]) => ({ title: 'PAYLOAD_MAP', subtitle: `Object Key: ${k}`, value: 'PARSED' })));
                     } else {
                        logs.push({ title: 'PARAM_MAPPING', subtitle: 'Execution context validated', value: 'TRUE' });
                        logs.push({ title: 'STATE_MUTATION', subtitle: 'Applying matrix transformations', value: 'SUCCESS' });
                     }
                     
                     onDrillDown('Report', { 
                       name: 'Action Audit Log', 
                       actionId: item.data.name,
                       records: logs
                     });
                  }}>View System Log Data</button>
                )}
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
        const finMetric = item.data.metric || item.data.label || item.data.name || 'Financial';
        const finValue = item.data.value || '$0.00';
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex items-center justify-between">
               <span className="flex items-center gap-3"><DollarSign className="w-6 h-6"/> {finMetric} Assessment</span>
               <div className="flex gap-2">
                 <span className="text-[10px] font-mono bg-green-900/10 border border-green-500/30 px-3 py-1.5 rounded tracking-widest text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)] flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> GL RECONCILED</span>
               </div>
            </h3>
            
            {userRole === 'Employee' ? (
               <div className="bg-black p-8 rounded-lg border border-red-900/50 shadow-[0_0_30px_rgba(239,68,68,0.1)] text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl translate-x-12 -translate-y-12"></div>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 relative z-10" />
                  <h4 className="text-red-500 font-bold text-2xl mb-2 font-playfair relative z-10">Restricted Access</h4>
                  <p className="text-text-muted text-sm max-w-lg mx-auto relative z-10">You do not possess the necessary clearance to view unfiltered general ledger (GL) and macro-financial data matrices. All requests for temporary access must be authorized by a General Manager or higher.</p>
               </div>
            ) : (
              <>
                <div className="bg-charcoal p-8 rounded-lg border border-border flex items-center justify-between overflow-hidden relative group shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-charcoal"></div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] translate-x-20 -translate-y-20"></div>
                  
                  <div className="relative z-10 flex-1 border-r border-border/50 pr-8">
                     <div className="text-[10px] text-gold uppercase tracking-[0.2em] font-mono mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Certified Book Balance</div>
                     <div className="text-5xl font-playfair text-white drop-shadow-md"><DrillDownValue value={item.data.value} label={item.data.metric || 'Book Balance'} type="Report" onDrillDown={onDrillDown} /></div>
                  </div>
                  <div className="relative z-10 flex-1 pl-8 text-right">
                     <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-mono mb-2">{userRole === 'Owner' ? 'Corporate Target YTD' : 'Store Quota YTD'}</div>
                     <div className="text-3xl font-mono tracking-tighter text-text-dim"><DrillDownValue value={userRole === 'Owner' ? "$1,500,000" : "$840,000"} label="YTD Quota Goal" type="Report" onDrillDown={onDrillDown} color="text-text-dim"/></div>
                     <div className="mt-4 w-full bg-black h-2 rounded-full border border-border overflow-hidden">
                        <div className="bg-gold h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(201,168,76,0.8)] relative">
                           <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full blur-[2px]"></div>
                        </div>
                     </div>
                     <div className="text-xs text-gold mt-2 font-bold tracking-widest uppercase">65% to Quota</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                   <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] flex justify-between items-center border-b border-border/50 pb-2">
                      <span>General Ledger Extraction</span>
                   </div>
                   <div className="bg-black rounded-lg border border-border shadow-inner overflow-hidden">
                      <table className="w-full text-sm text-left">
                         <thead className="bg-panel border-b border-border/50 text-text-dim text-[10px] uppercase font-mono tracking-widest">
                           <tr><th className="px-6 py-4 font-medium">Account Code</th><th className="px-6 py-4 font-medium">Journal Identity</th><th className="px-6 py-4 text-right font-medium">Posting Value</th></tr>
                         </thead>
                         <tbody className="divide-y divide-border/30">
                           <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 10100' })}>
                              <td className="px-6 py-5 font-mono text-text-muted group-hover:text-gold transition-colors">10100</td>
                              <td className="px-6 py-5 text-white font-bold group-hover:text-gold transition-colors">Operating Cash Accounts (BTR)</td>
                              <td className="px-6 py-5 text-right font-mono font-bold text-lg"><DrillDownValue value="$842,000" label="Operating Cash (BTR)" type="Financials" onDrillDown={onDrillDown} /></td>
                           </tr>
                           {userRole === 'Owner' && (
                             <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 10200' })}>
                                <td className="px-6 py-5 font-mono text-text-muted group-hover:text-gold transition-colors">10200</td>
                                <td className="px-6 py-5 text-white font-bold group-hover:text-gold transition-colors">Operating Cash Accounts (SLD)</td>
                                <td className="px-6 py-5 text-right font-mono font-bold text-lg"><DrillDownValue value="$198,000" label="Operating Cash (SLD)" type="Financials" onDrillDown={onDrillDown} /></td>
                             </tr>
                           )}
                           <tr className="hover:bg-charcoal transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', { name: 'Audit GL Account 11500' })}>
                              <td className="px-6 py-5 font-mono text-text-muted group-hover:text-gold transition-colors">11500</td>
                              <td className="px-6 py-5 text-white font-bold flex items-center gap-2 mt-0.5 group-hover:text-amber-400 transition-colors">Contracts in Transit (CIT) <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" /></td>
                              <td className="px-6 py-5 text-right font-mono font-bold text-lg text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"><DrillDownValue value="$200,000" label="Funding Hold CIT" type="Report" color="text-amber-500" onDrillDown={onDrillDown} /></td>
                           </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-5 mt-4 border-t border-border">
                    <button className="bg-gold text-black px-6 py-4 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:bg-gold-light hover:scale-[1.02] transition-all flex-[2] flex justify-center items-center gap-2 uppercase tracking-wide" onClick={() => onDrillDown('Action', { name: 'Generate Financial Audit export', message: 'Pulling 90-day GL reconciliation block...' })}><TrendingUp className="w-4 h-4"/> Extract Certified GL Export</button>
                    <button className="bg-panel text-white hover:text-white border border-border hover:bg-black px-6 py-4 rounded-lg text-sm transition-colors font-bold shadow flex-1 items-center justify-center gap-2 uppercase tracking-wide" onClick={onClose}>Close Book</button>
                </div>
              </>
            )}
          </div>
        );
      case 'Deal':
         return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-2 flex justify-between items-center">
               <span>Deal Desk Jacket: <DrillDownValue value={item.data.unit || item.data.customer} label={`${item.data.customer} Profile`} type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></span>
               <div className="flex items-center gap-3">
                  <div className="text-[10px] text-green-500 bg-green-900/10 border border-green-500/30 font-bold px-3 py-1 rounded tracking-widest font-mono uppercase">Bank Approved</div>
                  <div className="text-[10px] text-black bg-gold font-bold px-3 py-1 rounded tracking-widest font-mono uppercase shadow-[0_0_10px_rgba(201,168,76,0.3)]">Status: DESKING</div>
               </div>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-border">
               <div>
                  <h4 className="text-[10px] uppercase text-text-muted tracking-wide mb-3 flex items-center justify-between">
                     <span>Deal Structure Metrics</span>
                     <span className="text-text-dim text-[10px] font-mono tracking-widest bg-panel px-2 py-0.5 rounded border border-border">AI VALIDATED</span>
                  </h4>
                  <div className="bg-charcoal p-5 rounded-lg border border-border shadow-inner space-y-4 text-sm font-medium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl translate-x-12 -translate-y-12"></div>
                    {/* OWNER sees full profit, Manager sees margins, Employee sees front gross */}
                    {Object.entries(item.data).map(([k,v]) => {
                      if (k === 'unit' || k === 'customer') return null;
                      if (userRole === 'Employee' && (k.toLowerCase().includes('profit') || k.toLowerCase().includes('backend') || k.toLowerCase().includes('holdback'))) return null;
                      
                      return (
                       <div key={k} className="flex justify-between items-center border-b border-border/30 pb-3 last:border-0 last:pb-0 group relative z-10">
                         <span className="capitalize text-text-muted text-xs group-hover:text-white transition-colors">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                         <span className={`font-bold text-base ${k.toLowerCase().includes('profit') ? 'text-gold' : 'text-white'}`}><DrillDownValue value={v} label={`${k} detail`} type="Financials" onDrillDown={onDrillDown} color={k.toLowerCase().includes('profit') ? 'text-gold' : 'text-white'} /></span>
                       </div>
                    )})}
                  </div>
               </div>
               
               <div className="flex flex-col gap-6">
                 {/* AI Deal Copilot Insight */}
                 <div className="bg-black border border-border rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                    <strong className="text-xs text-white font-bold tracking-widest uppercase mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-gold"/> Deal Optimizer Copilot</strong>
                    <div className="text-xs text-text-muted leading-relaxed">
                       Adding a 48-month extended service contract to this deal lowers the LTV below the lender's 115% threshold, unlocking a <strong className="text-green-500">1.2% rate buy-down</strong> for the customer while preserving <strong className="text-gold">$420</strong> in back-end reserve.
                    </div>
                    <button className="mt-3 text-[10px] text-black bg-gold hover:bg-gold-light transition-colors px-3 py-1.5 rounded font-bold uppercase tracking-widest" onClick={() => onDrillDown('Action', { name: "Apply Copilot Deal Structure" })}>Re-Pencil Deal</button>
                 </div>

                 {/* MANAGER and EMPLOYEE see Stipulations, OWNER skips */}
                 {userRole !== 'Owner' && (
                   <div>
                      <h4 className="text-[10px] uppercase text-text-muted tracking-widest mb-3">Required Stips & Documentation</h4>
                      <div className="space-y-3 bg-charcoal p-5 rounded-lg border border-border h-full box-border shadow-inner">
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
                      </div>
                   </div>
                 )}
               </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-2">
                <div className="text-xs text-amber-500 leading-relaxed border-l-4 border-amber-500 pl-4 py-3 flex-[1.5] bg-amber-900/10 p-3 rounded-r font-mono">
                   <AlertCircle className="inline w-4 h-4 mr-2 text-amber-500 -mt-0.5" /> COMPLIANCE HOLD: Ensure signatures and outstanding documentation are indexed into cloud vault prior to final F&I approval routing.
                </div>
                
                {userRole === 'Employee' ? (
                   <button className="w-full md:w-auto bg-gold hover:bg-gold-light text-black px-6 py-4 rounded-lg font-bold shadow-[0_0_20px_rgba(201,168,76,0.2)] flex-1 text-sm uppercase tracking-wider transition-all" onClick={() => onDrillDown('Action', { name: 'Request e-Documents Securely', message: 'Dispatching Twilio tracking link to buyer...' })}>Trigger Secure Stip Link</button>
                ) : userRole === 'Manager' ? (
                   <button className="w-full md:w-auto bg-panel hover:bg-green-900/40 text-green-500 border border-green-500/50 px-6 py-4 rounded-lg font-bold shadow-lg flex-1 text-sm uppercase tracking-wider transition-all" onClick={() => onDrillDown('Action', { name: 'Override Stipulation Requirement', message: 'Logging manager exception code for deal funding...' })}>Override Stips (GM Override)</button>
                ) : (
                   <button className="w-full md:w-auto bg-charcoal hover:bg-black text-white border border-border px-6 py-4 rounded-lg font-bold flex-1 text-sm transition-all" onClick={() => onDrillDown('Report', { name: 'View Desking Historical Spread' })}>View Desk History</button>
                )}
            </div>
          </div>
        );
      case 'Inventory':
        const fullInv = item.data.invId 
            ? getGlobalInventory().find(i => i.id === item.data.invId) 
            : null;
            
        // Fallbacks for generic clicks
        const invStock = fullInv?.stock || item.data.stock || 'TBD';
        const invUnit = fullInv ? `${fullInv.year} ${fullInv.brandName} ${fullInv.model}` : (item.data.unit || 'Inventory Deep Dive');
        const invVin = fullInv?.vin || 'JHM123456789' + Math.floor(Math.random()*8999)+1000;
        const invDays = fullInv?.ageDays || item.data.days || 0;
        const invStatus = fullInv?.status || item.data.stage || 'Available';
        const invCost = fullInv?.cost || item.data.cost || null;
        const invPrice = fullInv?.price || item.data.price || null;
        const isUsed = fullInv?.condition === 'Used';

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
               <h3 className="text-3xl font-playfair text-white">{invUnit}</h3>
               <div className="flex items-center gap-3">
                  <div className="text-[10px] font-mono font-bold tracking-widest border border-gold/50 bg-gold/10 text-gold px-3 py-1.5 rounded uppercase shadow-[0_0_10px_rgba(201,168,76,0.15)]">VIN: {invVin}</div>
                  <div className="text-xs font-mono text-text-muted bg-panel px-4 py-2 border border-border rounded flex flex-col items-center shadow-inner">
                     <span className="text-[10px] text-text-dim tracking-widest uppercase mb-1">Stock Ledger</span>
                     <span className="text-white text-base">#{invStock}</span>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1 bg-black rounded-lg border border-border aspect-square flex flex-col items-center justify-center text-text-muted group relative overflow-hidden cursor-pointer shadow-inner hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: 'Full Photo Gallery Overlay', message: 'Spawning media viewer...' })}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="text-white text-xs font-bold bg-gold text-black border border-gold-light px-4 py-2 rounded-full shadow-[0_0_15px_rgba(201,168,76,0.5)] flex items-center gap-2"><Search className="w-4 h-4"/> Analyze Visual Assets</span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">WEBSITE</span>
                    <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">CYCLETRADER</span>
                  </div>
                  <Bike className="w-24 h-24 text-border group-hover:scale-[1.10] group-hover:text-gold transition-all duration-500 mb-2" />
                  <span className="text-[10px] uppercase font-mono tracking-widest mt-2 z-10 opacity-60">18 Media Assets</span>
               </div>
               
               <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Status & CRM */}
                  <div className="bg-charcoal p-5 rounded-lg border border-border shadow-inner flex flex-col justify-between relative overflow-hidden">
                     <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">Pipeline Status</div>
                     <div className="text-white font-bold text-xl mt-3"><DrillDownValue value={invStatus} label="Status Matrix" type="Report" onDrillDown={onDrillDown} /></div>
                     <div className="mt-2 text-xs text-text-muted flex gap-2">
                       {fullInv?.activeOppCount > 0 ? (
                         <span className="bg-amber-900/40 text-amber-500 px-2 py-0.5 rounded border border-amber-800 cursor-pointer hover:bg-amber-800" onClick={() => onDrillDown('Report', { name: 'CRM Pipeline Filter' })}>★ {fullInv.activeOppCount} Active Opps</span>
                       ) : <span className="text-text-dim">0 Opps</span>}
                       {fullInv?.activeDealCount > 0 && <span className="bg-green-900/40 text-green-500 px-2 py-0.5 rounded border border-green-800 cursor-pointer hover:bg-green-800">★ {fullInv.activeDealCount} Working Deals</span>}
                     </div>
                  </div>
                  
                  {/* Aging & Floorplan */}
                  <div className={`bg-charcoal p-5 rounded-lg border shadow-inner flex flex-col justify-between relative overflow-hidden ${invDays > 90 ? 'border-red-900/50 bg-red-900/10' : 'border-border'}`}>
                     <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">Aging Liability</div>
                     <div className={`font-bold text-2xl mt-3 ${invDays > 90 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-green-500'}`}><DrillDownValue value={`${invDays} Days`} label="Holding Time" type="Report" onDrillDown={onDrillDown} /></div>
                     {fullInv && fullInv.totalFpCost > 0 && (
                        <div className="mt-2 text-xs text-text-muted">Total Floorplan Accrued: <strong className="text-red-400 font-mono">${fullInv.totalFpCost}</strong></div>
                     )}
                  </div>
                  
                  {/* Financials: Cost & Pack */}
                  <div className="bg-charcoal p-5 rounded-lg border border-border shadow-inner flex flex-col justify-between">
                     <div className="text-[10px] text-text-dim uppercase tracking-widest border-b border-border/50 pb-2">True Cost Asset</div>
                     <div className="text-white font-bold text-2xl mt-3"><DrillDownValue value={invCost ? `$${invCost.toLocaleString()}` : '$0'} label="Financial Basis" type="Financials" onDrillDown={onDrillDown} /></div>
                     {fullInv && (
                        <div className="mt-2 text-xs text-text-muted flex justify-between">
                           <span>MSRP Cost:</span>
                           <span className="font-mono">${fullInv.cost.toLocaleString()}</span>
                        </div>
                     )}
                     {fullInv && (
                        <div className="mt-0.5 text-[10px] text-amber-500/80 flex justify-between">
                           <span>Hard Pack:</span>
                           <span className="font-mono">+$400</span>
                        </div>
                     )}
                  </div>
                  
                  {/* Financials: Price */}
                  <div className="bg-charcoal p-5 rounded-lg border border-gold-dim border-b-[4px] border-b-gold relative overflow-hidden group flex flex-col justify-between shadow-[0_4px_20px_rgba(201,168,76,0.08)] cursor-pointer" onClick={() => onDrillDown('Action', { name: "Audit Competitor Market Parity" })}>
                     <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="absolute top-0 right-0 w-16 h-16 bg-gold -rotate-45 translate-x-8 -translate-y-8 shadow-[0_0_20px_rgba(201,168,76,0.6)]"></div>
                     <div className="text-[10px] text-gold uppercase tracking-widest border-b border-gold/20 pb-2 z-10 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Market Price</div>
                     <div className="text-gold font-bold text-3xl mt-3 z-10 relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"><DrillDownValue value={invPrice ? `$${invPrice.toLocaleString()}` : 'Call for Price'} label="Published Price" type="Financials" onDrillDown={onDrillDown} color="text-gold" /></div>
                     {fullInv && fullInv.price && (
                        <div className="mt-2 text-xs text-text-muted flex justify-between z-10 relative">
                           <span>Front Margin:</span>
                           <span className="font-mono text-green-500 font-bold">${fullInv.frontMargin.toLocaleString()}</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Used Inventory Recon Focus */}
            {isUsed && (
               <div className="bg-panel border-l-4 border-amber-500 p-5 rounded-r mt-6 flex justify-between items-center shadow-inner md:flex-row flex-col gap-4">
                 <div>
                    <h4 className="text-amber-500 font-bold mb-1 flex items-center gap-2"><Wrench className="w-4 h-4"/> Certified Pre-Owned Recon Metrics</h4>
                    <div className="text-sm text-text-muted">Currently tracking <strong className="text-white">${fullInv?.reconSpend || 340}</strong> against this stock number. (Oil, Brakes, Detail). Assigned to <strong>EMP-7 (Sam LeBlanc)</strong>.</div>
                 </div>
                 <button className="bg-charcoal border border-border px-4 py-2 hover:bg-black transition-colors rounded text-sm text-white whitespace-nowrap" onClick={() => onDrillDown('Action', { name: 'Inspect Internal Repair Order' })}>View Repair Order</button>
               </div>
            )}
            
            {userRole !== 'Employee' && (
              <div className="bg-charcoal border border-border rounded p-6 shadow-inner mt-6">
                 <h4 className="text-[10px] text-text-muted font-bold tracking-widest border-b border-border pb-2 mb-5 uppercase flex justify-between items-center">
                    <span>Forensic Lifecycle Timeline</span>
                    <span className="text-text-dim lowercase tracking-normal font-mono cursor-pointer hover:text-white transition-colors" onClick={() => onDrillDown('Report', { name: 'Full Unit Audit' })}>Expand entire history...</span>
                 </h4>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                       <div className="mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
                       <div className="flex-1 bg-black border border-border p-3 rounded text-sm">
                          <div className="flex justify-between mb-1">
                             <div className="text-white font-bold">Floorplan Interest Deduction Logged</div>
                             <div className="text-gold text-xs font-mono">Yesterday, 11:59 PM</div>
                          </div>
                          <div className="text-text-muted text-xs">A deduction of ${fullInv?.fpCostPerDay || 4}.00 was logged against the unit's profitability baseline.</div>
                       </div>
                    </div>
                    {invDays > 90 && (
                       <div className="flex gap-4 items-start">
                          <div className="mt-0.5 text-red-500"><AlertCircle className="w-4 h-4" /></div>
                          <div className="flex-1 bg-red-900/10 border border-red-900/50 p-3 rounded text-sm">
                             <div className="flex justify-between mb-1">
                                <div className="text-white font-bold text-red-400">Aging Threshold Flag (90+ Days)</div>
                                <div className="text-gold text-xs font-mono">{invDays - 90} Days Ago</div>
                             </div>
                             <div className="text-text-muted text-xs">Unit surpassed strict 90-day wholesale risk threshold. Immediate markdown or digital retargeting recommended.</div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border mt-6">
                {userRole !== 'Employee' && invDays > 90 && (
                  <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded text-sm font-bold shadow-lg transition-all flex-[1.5] flex items-center justify-center gap-2 uppercase tracking-wide" onClick={() => onDrillDown('Action', { name: 'Force Immediate Markdown Approvals' })}><TrendingDown className="w-4 h-4"/> Approve 10% Markdown</button>
                )}
                {userRole === 'Owner' && (
                  <button className="bg-gold text-black px-6 py-3 rounded text-sm font-bold shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide flex-[1]" onClick={() => onDrillDown('Action', { name: 'Store Ledger Transfer' })}><TrendingDown className="w-4 h-4"/> Transfer Store</button>
                )}
                {userRole === 'Employee' && (
                  <button className="bg-gold text-black px-6 py-3 rounded text-sm font-bold shadow-lg uppercase tracking-wide flex-1 flex items-center justify-center gap-2" onClick={() => onDrillDown('Action', { name: 'Dispatch Digital BDC Pitch' })}><Megaphone className="w-4 h-4"/> Pitch to Buyers</button>
                )}
                <button className="bg-panel text-white border border-border px-4 py-3 rounded text-sm hover:bg-text-muted transition-colors shadow flex-1 font-bold" onClick={() => onDrillDown('Action', { name: 'Print Monroney Label' })}>Print Label</button>
            </div>
          </div>
        );
      case 'Employee':
      case 'RO':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-4 flex items-center justify-between">
               <span>{userRole === 'Employee' ? 'My Performance Profile' : 'Staff Dossier & Execution Profile'}</span>
               {userRole !== 'Employee' && (
                 <span className="text-[10px] font-mono text-green-500 border border-green-500 rounded bg-green-900/10 px-3 py-1.5 tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.2)]"><DrillDownValue value="PERSONNEL ACTIVE" label="HR Status" type="Action" color="text-green-500" onDrillDown={onDrillDown} /></span>
               )}
            </h3>
            
            <div className={`flex items-center gap-6 mb-6 bg-black p-6 rounded-xl border border-border transition-all cursor-pointer shadow-inner relative overflow-hidden ${userRole === 'Owner' ? 'hover:border-gold-dim' : ''}`} onClick={() => { if (userRole !== 'Employee') onDrillDown('Report', { name: 'KPI and Performance Breakdown Grid' }); }}>
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
                  <span className="cursor-pointer hover:text-white transition-colors flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {item.data.location || 'BTR Corporate'}</span>
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

            {userRole === 'Manager' && (
              <div className="bg-charcoal border border-border rounded p-6 text-sm leading-relaxed mt-4 shadow-inner">
                 <strong className="text-gold text-[10px] uppercase tracking-[0.2em] mb-3 block border-b border-border/50 pb-2 font-mono">Automated Management AI Copilot Summary</strong>
                 <DrillDownValue value={item.data.name || 'Resource'} label="Employee Identity" type="Employee" onDrillDown={onDrillDown} /> is pacing <span className="text-green-500 font-bold px-1 bg-green-900/20 rounded border border-green-500/20">ahead of baseline parameters</span> for the current commission period. Lead conversion velocity is extremely high this week. 
                 <div className="mt-4 pt-3 border-t border-border/50 flex justify-end">
                    <span className="text-gold text-xs font-bold cursor-pointer hover:underline uppercase tracking-wide flex items-center gap-1" onClick={() => onDrillDown('Action', { name: 'Construct Disciplinary/Praise HR Ticket' })}>Draft Personnel File Note <ChevronRight className="w-3 h-3"/></span>
                 </div>
              </div>
            )}
            
            {userRole === 'Owner' && (
              <div className="bg-charcoal border border-border rounded p-6 text-sm leading-relaxed mt-4 shadow-inner">
                 <strong className="text-gold text-[10px] uppercase tracking-[0.2em] mb-3 block border-b border-border/50 pb-2 font-mono">Owner ROI Matrix</strong>
                 Total YTD Commission paid to {item.data.name || 'Resource'}: <strong className="text-white">$78,400</strong>. Front-end gross generated: <strong className="text-white">$312,000</strong>. 
                 <span className="block mt-2 text-green-500 font-bold px-1 bg-green-900/20 rounded border border-green-500/20 w-fit">4.0x Return on Capital</span> 
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-border mt-4">
                {userRole !== 'Employee' && (
                  <button className="bg-blue-600 hover:bg-blue-500 border border-blue-400/50 text-white px-6 py-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] flex-1 shadow-[0_0_15px_rgba(37,99,235,0.4)]" onClick={() => onDrillDown('Action', { name: 'Ping employee asynchronously', message: 'Opening secure internal communications bridge...' })}>
                    <UsersIcon className="w-4 h-4" /> Direct Message
                  </button>
                )}
                <button className="bg-black text-white hover:text-gold border border-border hover:border-gold-dim px-6 py-4 rounded text-sm transition-colors flex-1 shadow font-bold tracking-wide" onClick={() => onDrillDown('Report', { name: 'Chronological timesheet event logs' })}>
                  {userRole === 'Employee' ? 'View My Punches' : 'Audit Time & Punch Records'}
                </button>
            </div>
          </div>
        );
      case 'Report':
         // Render the Dashboard List drilldowns elegantly
         const reportName = item.data.name || item.data.label || 'Data Analysis';
         const isAuditLog = reportName.toLowerCase().includes('log') || reportName.toLowerCase().includes('audit');
         
         // Generate robust mock records for Audit logs that were passed without payload data
         const displayRecords = (item.data.records && item.data.records.length > 0) 
            ? item.data.records 
            : isAuditLog 
               ? getAuditLogs()
               : null;

         return (
           <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><FileBarChart className="w-7 h-7" /> Operational Report: {reportName}</div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">ID: REPORT-{Math.floor(Math.random() * 89999) + 10000}</span>
                </div>
             </h3>
             
             {item.data.value && (!item.data.records || item.data.records.length === 0) && (
               <div className="bg-charcoal border border-gold-dim p-6 rounded shadow-inner mb-6 text-center">
                  <div className="text-[10px] uppercase text-text-muted tracking-widest mb-2 font-mono">Isolated Metric Value</div>
                  <div className="text-5xl font-playfair text-white">{item.data.value}</div>
               </div>
             )}
             
             <div className="bg-charcoal border border-border p-6 rounded shadow-inner">
                <div className="flex items-center gap-3 mb-6 text-sm text-text-muted border-b border-border/50 pb-4">
                   <Filter className="w-4 h-4 text-gold"/> Active Filters: 
                   <span className="bg-black border border-border px-2 py-1 rounded text-white text-xs font-mono">Location: ALL</span>
                   <span className="bg-black border border-border px-2 py-1 rounded text-white text-xs font-mono">Date: MTD</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {displayRecords && displayRecords.length > 0 ? (
                      displayRecords.slice(0, 50).map((rec, idx) => (
                         <div key={idx} className="bg-black border border-border p-4 rounded hover:border-gold-dim transition-colors cursor-pointer group flex justify-between items-center" onClick={() => onDrillDown(rec.type || 'Action', rec)}>
                            <div className="flex-1 min-w-0 pr-4">
                               <div className="text-white font-bold mb-1 truncate">{rec.title || rec.name || `Record #${idx+1}`}</div>
                               <div className="text-[10px] text-text-muted font-mono uppercase truncate">{rec.subtitle || rec.status || 'Data Point'}</div>
                            </div>
                            <div className="flex items-center gap-3">
                               {rec.value && <span className="text-gold font-bold">{rec.value}</span>}
                               <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors flex-shrink-0"/>
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="col-span-1 md:col-span-2 text-center text-text-muted text-sm py-8 bg-black/50 border border-border/50 rounded border-dashed cursor-pointer hover:border-gold-dim transition-colors" onClick={() => onDrillDown('Action', { name: 'Querying external database...' })}>
                         No detailed granular records found in this context slice. Click to query the master index.
                      </div>
                   )}
                </div>
                
                <div className="mt-6 text-center text-xs text-text-dim">
                   Showing {displayRecords?.length > 50 ? '50+' : (displayRecords?.length || 0)} records for "{reportName}"
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t border-border mt-4">
                 <button className="bg-gold text-black px-6 py-4 rounded text-sm font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:bg-gold-light hover:scale-[1.02] transition-all flex-[2] flex justify-center items-center gap-2 uppercase tracking-wide" onClick={() => onDrillDown('Action', { name: `Export ${item.type} Bundle`, message: `Generating comprehensive CSV/PDF data package...` })}><TrendingUp className="w-4 h-4" /> Export Report</button>
             </div>
           </div>
         );
      case 'Employee': {
        const emp = getEmployeeData(item.data?.id || item.data?.name || item.data);
        if (!emp) return <div className="p-8 text-white">Employee details not found.</div>;
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><UsersIcon className="w-7 h-7" /> Employee 360: {emp.name}</div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">{emp.role}</span>
                  <span className="text-[10px] font-mono bg-green-900/10 border border-green-500/30 px-2 py-1 rounded text-green-500">ACTIVE</span>
                </div>
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Close Rate MTD</div>
                   <div className="text-3xl font-playfair text-white">{emp.performance?.closeRate || 0}%</div>
                </div>
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Avg Front Gross</div>
                   <div className="text-3xl font-playfair text-green-400">${emp.performance?.avgFrontGross || 0}</div>
                </div>
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Avg Back Gross</div>
                   <div className="text-3xl font-playfair text-gold">${emp.performance?.avgBackGross || 0}</div>
                </div>
                <div className="bg-charcoal p-4 border border-gold-dim rounded shadow-[0_0_15px_rgba(201,168,76,0.1)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-full blur-xl translate-x-4 -translate-y-4"></div>
                   <div className="text-[10px] uppercase text-gold tracking-widest font-mono mb-2 flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> AI Adoption Rate</div>
                   <div className="text-3xl font-playfair text-white relative z-10">{emp.performance?.aiAdoptionRate || 0}%</div>
                </div>
             </div>
             
             <div className="bg-black p-6 rounded-lg border border-border shadow-inner">
                 <strong className="text-white text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Active System Rules & Interventions
                 </strong>
                 <div className="space-y-2">
                    <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Action', { name: `View Active Task Queue for ${emp.name}`, message: `Fetching task execution queue...` })}>
                      <span>View Open Agent-Assigned Tasks</span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                    </button>
                    <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Action', { name: `Execute Training/Coaching Module`, message: `Triggering AI coaching module for ${emp.name}...` })}>
                      <span>Dispatch AI Coaching / Training Payload</span>
                      <BrainCircuit className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                    </button>
                 </div>
             </div>
          </div>
        );
      }
      
      case 'Lender': {
        const lender = getLenderData(item.data?.name || item.data);
        if (!lender) return <div className="p-8 text-white">Lender details not found.</div>;
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><DollarSign className="w-7 h-7" /> Bank Profile: {lender.name}</div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">{lender.type}</span>
                </div>
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Approval Ratio MTD</div>
                   <div className="text-3xl font-playfair text-white">{lender.metrics?.approvalRatio || 0}%</div>
                </div>
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Look-To-Book</div>
                   <div className="text-3xl font-playfair text-white">{lender.metrics?.lookToBook || 0}%</div>
                </div>
                <div className="bg-charcoal p-4 rounded border border-border">
                   <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">Avg Funding Speed</div>
                   <div className="text-3xl font-playfair text-white">{lender.metrics?.avgFundingTimeDays || 0} <span className="text-lg text-text-muted">Days</span></div>
                </div>
             </div>
             <div className="bg-black p-6 border border-gold-dim rounded shadow-[0_0_15px_rgba(201,168,76,0.1)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-100"></div>
                 <strong className="text-gold text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-gold" /> Advanced F&I Intelligence
                 </strong>
                 <p className="text-white text-sm leading-relaxed mb-4 relative z-10">
                    {lender.metrics?.aiInsight || "No specific insights at this time."}
                 </p>
                 <button className="text-[10px] text-gold uppercase tracking-widest border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded transition-all font-bold w-max relative z-10" onClick={() => onDrillDown('Action', { name: `View ${lender.name} Tier Sheets` })}>View Program Guidelines →</button>
             </div>
          </div>
        );
      }

      case 'Campaign': {
        const camp = getCampaignData(item.data?.name || item.data);
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Megaphone className="w-7 h-7" /> Campaign ROI: {camp.name}</div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">{camp.type}</span>
                </div>
             </h3>
             <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-6">
                <div className="bg-charcoal p-3 rounded border border-border text-center flex flex-col justify-center">
                   <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Spend</div>
                   <div className="text-lg font-bold text-red-400">${camp.funnel?.spend?.toLocaleString()}</div>
                </div>
                <div className="hidden lg:flex items-center justify-center"><ChevronRight className="text-border" /></div>
                
                <div className="bg-charcoal p-3 rounded border border-border text-center flex flex-col justify-center">
                   <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Leads</div>
                   <div className="text-lg font-bold text-white">{camp.funnel?.leads?.toLocaleString()}</div>
                </div>
                <div className="hidden lg:flex items-center justify-center"><ChevronRight className="text-border" /></div>

                <div className="bg-charcoal p-3 rounded border border-border text-center flex flex-col justify-center">
                   <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Shows</div>
                   <div className="text-lg font-bold text-white">{camp.funnel?.shows?.toLocaleString()}</div>
                </div>
                <div className="hidden lg:flex items-center justify-center"><ChevronRight className="text-border" /></div>

                <div className="bg-charcoal p-3 rounded border border-border text-center flex flex-col justify-center">
                   <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Sold</div>
                   <div className="text-lg font-bold text-white">{camp.funnel?.sold?.toLocaleString()}</div>
                </div>
                <div className="hidden lg:flex items-center justify-center"><ChevronRight className="text-border" /></div>

                <div className="bg-black p-3 rounded border border-gold shadow-[0_0_15px_rgba(201,168,76,0.15)] text-center flex flex-col justify-center">
                   <div className="text-[9px] uppercase text-gold tracking-widest font-mono mb-1">Gross Gen</div>
                   <div className="text-lg font-bold text-green-400">${camp.funnel?.grossGenerated?.toLocaleString()}</div>
                </div>
             </div>
             
             <div className="bg-charcoal border border-border p-6 rounded shadow-inner">
                <strong className="text-white text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                   <FileBarChart className="w-4 h-4 text-text-muted" /> Automated Campaign Actions
                </strong>
                <div className="space-y-2">
                   <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Action', { name: `Pause Campaign`, message: `Sending signals to ad managers to halt spend on ${camp.name}...` })}>
                     <span className="text-red-400">Halt Campaign Spend (Low ROI)</span>
                     <TrendingDown className="w-4 h-4 text-text-muted group-hover:text-red-400 transition-colors" />
                   </button>
                   <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Action', { name: `Reallocate Budget`, message: `Scaling budget up for ${camp.name}...` })}>
                     <span className="text-green-400">Scale Campaign Spend (High ROI)</span>
                     <TrendingUp className="w-4 h-4 text-text-muted group-hover:text-green-400 transition-colors" />
                   </button>
                </div>
             </div>
          </div>
        );
      }

      case 'Department': {
        const deptPayload = getDepartmentCapacity(item.data?.location || 'LOC-1', item.data?.department || item.data);
        if (!deptPayload) return <div className="p-8 text-white">Department capacity data not found.</div>;
        
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Database className="w-7 h-7" /> {deptPayload.location.name} : {deptPayload.department.name} Capacity</div>
             </h3>
             <div className="grid grid-cols-2 gap-4">
                {Object.entries(deptPayload.capacity).filter(([k]) => k !== 'type').map(([k,v]) => (
                   <div key={k} className="bg-charcoal p-4 rounded border border-border">
                      <div className="text-[10px] uppercase text-text-muted tracking-widest font-mono mb-2">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-3xl font-playfair text-white">{k.toLowerCase().includes('dollar') ? `$${v.toLocaleString()}` : v}</div>
                   </div>
                ))}
             </div>
          </div>
        );
      }

      case 'TimelineEvent': {
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Database className="w-7 h-7" /> Target Event Payload</div>
                <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">ID: {item.data?.id || `EVT-${Math.floor(Math.random() * 89999) + 10000}`}</span>
             </h3>
             <div className="bg-black p-4 rounded border border-border overflow-x-auto shadow-inner">
                <pre className="text-xs text-green-400 font-mono leading-relaxed">
                   {JSON.stringify(item.data, null, 2)}
                </pre>
             </div>
             <p className="text-xs text-text-muted italic border-l-2 border-gold/30 pl-3">This forensic view represents the exact payload executed at the time of the event. Immutability guaranteed.</p>
          </div>
        );
      }

      case 'DealSimulator': {
         const baseMsrp = item.data?.msrp || 15000;
         const baseInvoice = item.data?.invoice || 13500;
         const dealCustomer = item.data?.customer || "Walk-In Structuring";
         
         const curMsrpValue = baseMsrp - simMsrpDiscount;
         const frontGross = curMsrpValue - baseInvoice;
         const tradeGross = 6000 - simAcv; // Assume retail value is 6000
         const totalBackend = simFiGross + (simTerm * 10); // Fake reserve calculation based on term
         const totalEconomicProfit = frontGross + tradeGross + totalBackend;

         let aiStance = "OPTIMAL YIELD";
         let aiColor = "text-green-500";
         if (totalEconomicProfit < 1000) { aiStance = "MARGIN RISK - PUSH BACK"; aiColor = "text-red-500"; }
         else if (frontGross < 0) { aiStance = "BACKEND HEAVY - SECURE STIPS"; aiColor = "text-amber-500"; }

         return (
            <div className="space-y-6">
              <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                 <div className="flex items-center gap-3"><Calculator className="w-7 h-7" /> AI Deal Simulator</div>
                 <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">{dealCustomer}</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Controls */}
                 <div className="bg-charcoal p-6 border border-border rounded space-y-6 shadow-inner">
                    <strong className="text-white text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-text-muted" /> Live Variables
                    </strong>
                    
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between text-xs text-text-muted font-bold mb-2"><span>MSRP Discount</span><span className="text-white font-mono">${simMsrpDiscount}</span></div>
                          <input type="range" min="0" max="3000" step="100" value={simMsrpDiscount} onChange={(e) => setSimMsrpDiscount(Number(e.target.value))} className="w-full accent-gold cursor-pointer" />
                       </div>
                       <div>
                          <div className="flex justify-between text-xs text-text-muted font-bold mb-2"><span>Trade ACV Allowance</span><span className="text-white font-mono">${simAcv}</span></div>
                          <input type="range" min="2000" max="8000" step="500" value={simAcv} onChange={(e) => setSimAcv(Number(e.target.value))} className="w-full accent-gold cursor-pointer" />
                       </div>
                       <div>
                          <div className="flex justify-between text-xs text-text-muted font-bold mb-2"><span>F&I VSC/GAP Gross</span><span className="text-white font-mono">${simFiGross}</span></div>
                          <input type="range" min="0" max="2500" step="100" value={simFiGross} onChange={(e) => setSimFiGross(Number(e.target.value))} className="w-full accent-gold cursor-pointer" />
                       </div>
                       <div>
                          <div className="flex justify-between text-xs text-text-muted font-bold mb-2"><span>Term Length (Months)</span><span className="text-white font-mono">{simTerm} mos</span></div>
                          <input type="range" min="24" max="84" step="12" value={simTerm} onChange={(e) => setSimTerm(Number(e.target.value))} className="w-full accent-gold cursor-pointer" />
                       </div>
                    </div>
                 </div>

                 {/* Results */}
                 <div className="space-y-4">
                    <div className="bg-black p-6 border border-gold shadow-[0_0_15px_rgba(201,168,76,0.15)] rounded text-center relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-full blur-xl translate-x-4 -translate-y-4"></div>
                       <div className="text-[10px] uppercase text-gold tracking-widest font-mono mb-2">Total Economic Profit</div>
                       <div className="text-5xl font-playfair font-bold text-white relative z-10 drop-shadow-md">${totalEconomicProfit.toLocaleString()}</div>
                    </div>

                    <div className="bg-charcoal p-4 border border-border rounded grid grid-cols-2 gap-4 shadow-inner">
                       <div>
                          <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Front Gross</div>
                          <div className={`text-2xl font-playfair font-bold ${frontGross < 0 ? 'text-red-500' : 'text-white'}`}>${frontGross.toLocaleString()}</div>
                       </div>
                       <div>
                          <div className="text-[9px] uppercase text-text-muted tracking-widest font-mono mb-1">Back Gross (Inc Res)</div>
                          <div className="text-2xl font-playfair font-bold text-white">${totalBackend.toLocaleString()}</div>
                       </div>
                    </div>

                    <div className="bg-panel border border-border p-4 rounded shadow-inner relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-100"></div>
                       <strong className="text-white text-[10px] uppercase tracking-[0.15em] mb-2 block font-mono flex items-center gap-2 relative z-10">
                          <BrainCircuit className="w-4 h-4 text-gold" /> AI Agent Stance
                       </strong>
                       <div className={`text-lg font-bold tracking-wider relative z-10 ${aiColor}`}>{aiStance}</div>
                    </div>
                 </div>
              </div>
            </div>
         );
      }

      case 'ActionMetrics': {
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Command className="w-7 h-7" /> {item.label}</div>
                <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">Metric Count: {item.value}</span>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(Math.max(1, Math.min(6, Number(item.value) || 3)))].map((_, i) => (
                   <div key={i} className="bg-black p-4 rounded border border-border hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('TimelineEvent', { id: `EVT-ACT-${Math.floor(Math.random() * 9000) + 1000}` })}>
                      <div className="flex justify-between items-center mb-2 text-xs font-mono uppercase tracking-widest text-text-muted">
                        <span><Clock className="w-3 h-3 inline mr-1 text-gold"/> {Math.floor(Math.random() * 24) + 1} hours ago</span>
                        <span className="bg-green-900/20 border border-green-500/30 text-green-500 px-1 rounded font-bold">SUCCESS</span>
                      </div>
                      <div className="font-bold text-white text-sm mb-1 group-hover:text-gold transition-colors">{item.label?.replace(' Audit', '') || "Action Extracted"}</div>
                      <div className="text-xs text-text-dim truncate">Triggered by Agent Engine · Audit ID: {Math.floor(Math.random() * 90000) + 10000}</div>
                   </div>
                ))}
             </div>
          </div>
        );
      }

      case 'AIScoreAnalysis': {
        const score = Number(item.value);
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><BrainCircuit className="w-7 h-7" /> AI Confidence Scoring</div>
                <div className={`text-xl font-playfair font-bold px-3 py-1 rounded border shadow-inner ${score > 75 ? 'bg-green-900/20 text-green-500 border-green-500/30' : score > 50 ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' : 'bg-amber-900/20 text-amber-500 border-amber-500/30'}`}>{score} Score</div>
             </h3>
             <div className="bg-charcoal p-5 border border-border rounded shadow-inner">
                <h4 className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">Factor Breakdown Matrix</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center p-3 bg-black border border-border/50 rounded hover:border-gold/50 transition-colors">
                      <div className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Verified Trade-In Interest</div>
                      <div className="text-green-500 font-mono font-bold">+25 pts</div>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-black border border-border/50 rounded hover:border-gold/50 transition-colors">
                      <div className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Repeated Website Activity (Pricing)</div>
                      <div className="text-green-500 font-mono font-bold">+15 pts</div>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-black border border-border/50 rounded hover:border-gold/50 transition-colors">
                      <div className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> High FICO Demographics (Zip Code)</div>
                      <div className="text-green-500 font-mono font-bold">+10 pts</div>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-black border border-border/50 rounded hover:border-gold/50 transition-colors">
                      <div className="text-sm font-bold text-white flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500"/> Invalid Phone Number format</div>
                      <div className="text-amber-500 font-mono font-bold">-10 pts</div>
                   </div>
                </div>
             </div>
          </div>
        );
      }

      case 'RuleAudit': {
        const threshold = item.value;
        const ruleName = item.label || "Enterprise Rule";
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><AlertCircle className="w-7 h-7" /> {ruleName}</div>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black p-4 border border-border rounded text-center shadow-inner">
                   <div className="text-[10px] uppercase text-text-muted font-mono tracking-widest mb-1">Global Target</div>
                   <div className="text-2xl font-bold text-white">{threshold}</div>
                </div>
                <div className="bg-black p-4 border border-border rounded text-center shadow-inner">
                   <div className="text-[10px] uppercase text-text-muted font-mono tracking-widest mb-1">30-Day Triggers</div>
                   <div className="text-2xl font-bold text-gold">142</div>
                </div>
                <div className="bg-black p-4 border border-border rounded text-center shadow-inner">
                   <div className="text-[10px] uppercase text-text-muted font-mono tracking-widest mb-1">Trend</div>
                   <div className="text-2xl font-bold text-amber-500 flex items-center justify-center gap-1"><TrendingUp className="w-5 h-5"/> 12%</div>
                </div>
             </div>
             <div className="bg-charcoal border border-border rounded flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                   <thead className="text-xs text-text-muted font-mono uppercase tracking-widest bg-black border-b border-border">
                      <tr><th className="p-3">Trigger Instance</th><th className="p-3">Location</th><th className="p-3">Overriding Manager</th></tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      <tr className="hover:bg-panel cursor-pointer transition-colors" onClick={() => onDrillDown('Employee', { name: "Marcus Broussard" })}>
                         <td className="p-3 font-bold text-white flex items-center gap-2"><TrendingDown className="w-4 h-4 text-amber-500"/> Deal #84A92</td><td className="p-3 text-text-muted">Baton Rouge</td><td className="p-3 text-gold">Marcus Broussard</td>
                      </tr>
                      <tr className="hover:bg-panel cursor-pointer transition-colors" onClick={() => onDrillDown('Employee', { name: "Sarah Jenkins" })}>
                         <td className="p-3 font-bold text-white flex items-center gap-2"><TrendingDown className="w-4 h-4 text-amber-500"/> Deal #19V42</td><td className="p-3 text-text-muted">Slidell</td><td className="p-3 text-gold">Sarah Jenkins</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        );
      }

      case 'StageVelocity': {
        const stage = item.value || "Pipeline Stage";
        const avgDwell = stage === 'New' ? '45 mins' : stage === 'Appt' ? '2.4 days' : stage === 'Finance' ? '4.8 hours' : '1.2 days';
        const targetDwell = stage === 'New' ? '30 mins' : stage === 'Appt' ? '3.0 days' : stage === 'Finance' ? '2.0 hours' : '1.0 days';
        const isWarning = stage === 'Finance' || stage === 'New';
        return (
          <div className="space-y-6">
             <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><Clock className="w-7 h-7" /> Stage Velocity: {stage}</div>
                <div className={`text-sm font-bold font-mono px-3 py-1 rounded border ${isWarning ? 'bg-red-900/20 text-red-500 border-red-500/30' : 'bg-green-900/20 text-green-500 border-green-500/30'}`}>
                   Avg Dwell: {avgDwell}
                </div>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-charcoal p-5 border border-border rounded shadow-inner">
                   <h4 className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">Performance vs Target</h4>
                   <div className="space-y-4">
                      <div>
                         <div className="flex justify-between text-xs mb-1 font-bold">
                            <span className="text-white">Actual: {avgDwell}</span>
                            <span className="text-text-muted">Target: {targetDwell}</span>
                         </div>
                         <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-border">
                            <div className={`h-full ${isWarning ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: isWarning ? '95%' : '65%' }}></div>
                         </div>
                      </div>
                      <p className="text-sm text-text-muted italic border-l-2 border-gold/30 pl-3">
                         {isWarning ? `Attention: Deals are stalling in the ${stage} stage longer than the algorithmic target, creating pipeline friction.` : `Healthy Flow: Deals are advancing through the ${stage} stage matching or beating the target velocity.`}
                      </p>
                   </div>
                </div>
                <div className="bg-charcoal p-5 border border-border rounded shadow-inner">
                   <h4 className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">Slowest Aging Deals in {stage}</h4>
                   <div className="space-y-3">
                      <div className="bg-black p-3 border border-red-500/30 rounded flex justify-between items-center cursor-pointer hover:border-red-500 transition-colors" onClick={() => onDrillDown('CRM_Customer360', { customerId: 'C-001' })}>
                         <div>
                            <div className="text-white font-bold text-sm">John Davis</div>
                            <div className="text-xs text-text-muted flex items-center gap-1"><User className="w-3 h-3"/> Jake Fontenot</div>
                         </div>
                         <div className="text-red-500 font-bold font-mono bg-red-900/10 px-2 py-1 rounded border border-red-500/20">2.0x Target</div>
                      </div>
                      <div className="bg-black p-3 border border-amber-500/30 rounded flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors" onClick={() => onDrillDown('CRM_Customer360', { customerId: 'C-002' })}>
                         <div>
                            <div className="text-white font-bold text-sm flex items-center gap-2">Emily White</div>
                            <div className="text-xs text-text-muted flex items-center gap-1"><User className="w-3 h-3"/> Sarah Jenkins</div>
                         </div>
                         <div className="text-amber-500 font-bold font-mono bg-amber-900/10 px-2 py-1 rounded border border-amber-500/20">1.5x Target</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      }

      case 'OEM':
      default:
        // Enhanced robust default view for unmapped or generic data points
        const genericName = item.data.name || item.data.label || item.type;
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-playfair text-gold border-b border-border pb-3 flex items-center justify-between">
               <div className="flex items-center gap-3"><FileBarChart className="w-7 h-7" /> {genericName} Insight & Analysis</div>
               <div className="flex gap-2">
                 <span className="text-[10px] font-mono bg-panel border border-border px-2 py-1 rounded text-text-muted">ID: {Math.floor(Math.random() * 89999) + 10000}</span>
                 <span className="text-[10px] font-mono bg-green-900/10 border border-green-500/30 px-2 py-1 rounded text-green-500">SYNCED</span>
               </div>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Object.entries(item.data).map(([k,v], idx) => (
                  <div key={k} className={`bg-charcoal p-4 rounded-lg border hover:border-gold-dim transition-all shadow-inner group relative overflow-hidden ${idx === 0 ? 'border-gold shadow-[0_0_20px_rgba(201,168,76,0.1)] lg:col-span-2' : 'border-border/50'}`}>
                     {idx === 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-full blur-xl translate-x-4 -translate-y-4"></div>}
                     <div className="text-[10px] text-text-dim uppercase tracking-[0.1em] font-mono mb-2 border-b border-border/50 pb-2 group-hover:text-white transition-colors relative z-10 flex justify-between items-center">
                        <span>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {idx === 0 && <AlertCircle className="w-3 h-3 text-gold" />}
                     </div>
                     <div className={`font-bold relative z-10 break-words ${idx === 0 ? 'text-4xl text-gold font-playfair drop-shadow-md' : 'text-xl text-white'}`}><DrillDownValue value={String(v)} label={k} type="Generic" onDrillDown={onDrillDown} color={idx === 0 ? 'text-gold' : 'text-white'} /></div>
                  </div>
               ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-black p-6 rounded-lg border border-border shadow-inner relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <strong className="text-gold text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-gold" /> AI Contextual Synthesis
                 </strong>
                 <p className="text-text-muted text-sm leading-relaxed mb-4">
                    The data metrics supplied for this <strong className="text-white inline-block lowercase mx-1">{item.type}</strong> array indicate a variance from standard baseline models. The system recommends correlating this data set against previous 90-day structural trends to identify root anomalies or validate performance surges.
                 </p>
                 <button className="text-[10px] text-gold uppercase tracking-widest border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded transition-all font-bold w-max" onClick={() => onDrillDown('Action', { name: "Run Deep-Dive Anomaly Detection Analysis" })}>Run Variance Check →</button>
              </div>

              <div className="bg-charcoal p-6 rounded-lg border border-border shadow-inner">
                 <strong className="text-white text-[10px] uppercase tracking-[0.15em] mb-4 block border-b border-border/50 pb-2 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Administrative Controls
                 </strong>
                 <div className="space-y-2">
                    <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Action', { name: `Update Record Details`, message: `Opening secure edit form...` })}>
                      <span>Edit Source Record</span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                    </button>
                    <button className="w-full text-left bg-panel hover:bg-black border border-border px-4 py-3 rounded text-sm transition-colors text-white font-bold flex justify-between items-center group" onClick={() => onDrillDown('Report', { name: `Audit Log History for ${item.type}` })}>
                      <span>View Historical Audit Log</span>
                      <Clock className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t border-border mt-4">
                <button className="bg-gold text-black px-6 py-4 rounded text-sm font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:bg-gold-light hover:scale-[1.02] transition-all flex-[2] flex justify-center items-center gap-2 uppercase tracking-wide" onClick={() => onDrillDown('Action', { name: `Export ${item.type} Bundle`, message: `Generating comprehensive data package for external use...` })}><TrendingUp className="w-4 h-4" /> Export & Share Data Package</button>
                <button className="bg-panel text-white hover:text-white border border-border hover:bg-black px-6 py-4 rounded text-sm transition-colors font-bold shadow flex-1 items-center justify-center gap-2" onClick={onClose}>Close Context</button>
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

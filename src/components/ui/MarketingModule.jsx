import React, { useState, useMemo } from 'react';
import { Megaphone, Target, DollarSign, Users, Eye, Search, Filter, Play, CheckCircle2, AlertCircle, BarChart2, BrainCircuit, Globe, ArrowUpRight, ArrowDownRight, RefreshCw, Smartphone, Monitor, Briefcase, Plus, MessageSquare, TrendingUp } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';

export const MarketingModule = ({ onDrillDown }) => {
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // Mocked Marketing Data
  const campaigns = [
    { id: 'CMP-1', name: 'ATV Fall Blowout', platform: 'Google Ads', status: 'Active', spend: 4200, leads: 145, cpl: 28.96, roi: 3.2, roas: 4.5, intent: 'High (Bottom Funnel)' },
    { id: 'CMP-2', name: 'Used Harleys Retargeting', platform: 'Facebook', status: 'Active', spend: 1850, leads: 42, cpl: 44.04, roi: 1.8, roas: 2.1, intent: 'Medium (Mid Funnel)' },
    { id: 'CMP-3', name: 'Service Bay Winback', platform: 'Meta Leads', status: 'Paused', spend: 600, leads: 12, cpl: 50.00, roi: 0.9, roas: 0.8, intent: 'Low (Top Funnel)' },
    { id: 'CMP-4', name: 'Polaris RZR Pro Launch', platform: 'Google Maps', status: 'Active', spend: 950, leads: 68, cpl: 13.97, roi: 5.4, roas: 6.2, intent: 'High (Local Search)' },
    { id: 'CMP-5', name: 'Local Off-Road Community', platform: 'Instagram Reels', status: 'Active', spend: 1200, leads: 88, cpl: 13.63, roi: 2.1, roas: 2.3, intent: 'Awareness' }
  ];

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => 
      (filterPlatform === 'All' || c.platform.includes(filterPlatform)) &&
      (filterStatus === 'All' || c.status === filterStatus)
    );
  }, [filterPlatform, filterStatus]);

  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = filteredCampaigns.reduce((acc, c) => acc + c.leads, 0);

  const performAiSearch = () => {
    if (!aiQuery.trim()) return;
    setIsAiSearching(true);
    setAiResponse(null);

    // Simulated mock network latency for the AI tool
    setTimeout(() => {
      setAiResponse({
        query: aiQuery,
        insights: [
          "70-90% of powersports buyers start online. Shift 15% budget from Facebook Top Funnel to Google Maps Local Search.",
          "Used sport bikes are surging. Launch long-tail keywords like 'used Yamaha MT-07 for sale near me'.",
          "Facebook/Instagram requires 'Lifestyle Imagery'. Replace stock OEM photos with real dealership walkaround videos."
        ],
        competitorIntel: "Local competitor 'Cajun Rides' is bidding heavily on 'Side by side'. Recommend pivoting budget to 'UTV financing'.",
        actionable: "Enable Google Performance Max to intercept YouTube and Search queries simultaneously."
      });
      setIsAiSearching(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-pink-500 shadow-inner">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Marketing & Acquisition</h1>
              <p className="text-text-muted text-sm border-l-2 border-pink-500 pl-2 ml-1">Omnichannel Campaigns, CPL Analytics & Web Intelligence</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-pink-500 transition-colors" onClick={() => onDrillDown('Action', { name: 'Launch Performance Max Campaign' })}>
              <Plus className="w-4 h-4" /> New Campaign
            </button>
         </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-pink-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Ad Spend Ledger' })}>
           <div className="flex items-center gap-2 text-pink-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> <DrillDownValue value="Total Blended Spend" label="Report Configuration" type="Report" onDrillDown={onDrillDown} color="text-pink-500 hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-2 group-hover:text-gold transition-colors">
              <DrillDownValue value={`$${totalSpend.toLocaleString()}`} label="Blended Ad Spend" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2 flex justify-between">
              <span>Google: <strong className="text-white"><DrillDownValue value="$5,150" label="Google Ads Invoice" type="Financials" onDrillDown={onDrillDown} color="hover:text-gold"/></strong></span>
              <span>Meta: <strong className="text-white"><DrillDownValue value="$3,650" label="Meta Invoice" type="Financials" onDrillDown={onDrillDown} color="hover:text-gold"/></strong></span>
           </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-blue-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Lead Acquisition Velocity' })}>
           <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Users className="w-4 h-4"/> <DrillDownValue value="Generated Leads" label="Report Configuration" type="Report" onDrillDown={onDrillDown} color="text-blue-500 hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-2 group-hover:text-gold transition-colors">
              <DrillDownValue value={totalLeads.toLocaleString()} label="Total Conversion Volume" type="Report" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2">
              Valid Contact Rate: <span className="text-green-500 font-bold"><DrillDownValue value="81.4%" label="Contact Data Quality" type="Report" onDrillDown={onDrillDown} color="text-green-500 hover:text-white" /></span>
           </div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-amber-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Cost Per Acquisition' })}>
           <div className="flex items-center gap-2 text-amber-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><Target className="w-4 h-4"/> <DrillDownValue value="Blended CPL" label="Report Configuration" type="Report" onDrillDown={onDrillDown} color="text-amber-500 hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-2 group-hover:text-gold transition-colors">
              <DrillDownValue value={`$${(totalLeads > 0 ? totalSpend / totalLeads : 0).toFixed(2)}`} label="Blended Cost-Per-Lead" type="Report" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs mt-2 flex items-center justify-between">
              <span className="text-text-muted">Target CPL: <strong className="text-white"><DrillDownValue value="$28.00" label="Target Benchmark" type="Report" onDrillDown={onDrillDown} color="hover:text-gold"/></strong></span>
              <span className="text-red-400 flex items-center gap-1 font-bold"><ArrowUpRight className="w-3 h-3"/> <DrillDownValue value="6.8%" label="Deviation Matrix" type="Report" onDrillDown={onDrillDown} color="text-red-400 hover:text-white"/></span>
           </div>
        </div>
        
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner border-y-[3px] border-y-green-500 relative flex flex-col justify-center items-center text-center">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
            <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-sm font-bold text-white uppercase tracking-widest mb-1"><DrillDownValue value="Return on Ad Spend" label="Report Configuration" type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></div>
            <div className="text-2xl font-mono text-green-500 mb-1"><DrillDownValue value="4.8x ROAS" label="Gross Return on Spend" type="Financials" onDrillDown={onDrillDown} color="text-green-500 hover:text-white"/></div>
            <div className="text-[10px] text-text-muted bg-black border border-border px-2 py-1 rounded mt-2"><DrillDownValue value="Trailing 30 Days" label="Time Filter" type="Action" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        
        {/* Left Column: AI Internet Marketing Tool */}
        <div className="lg:col-span-1 bg-charcoal border border-border rounded flex flex-col shadow-inner">
           <div className="p-4 border-b border-border bg-black flex justify-between items-center">
             <div className="font-bold text-white flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-gold" /> AI Internet Search Intel</div>
           </div>
           <div className="p-4 flex flex-col gap-4 flex-1">
             <div className="bg-black border border-border rounded p-3 text-xs text-text-muted">
               Agent intercepts real-time SEO data, OEM guidelines, and competitor bidding structures using internet search to optimize campaigns.
             </div>
             
             <div className="space-y-2">
               <label className="text-xs text-text-muted uppercase tracking-widest font-bold">Query AI Optimizer</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={aiQuery}
                   onChange={e => setAiQuery(e.target.value)}
                   className="flex-1 bg-black border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                   placeholder="e.g., Optimize Polaris UTV Ads"
                   onKeyDown={e => e.key === 'Enter' && performAiSearch()}
                 />
                 <button onClick={performAiSearch} disabled={isAiSearching || !aiQuery.trim()} className="bg-gold text-black px-3 py-2 rounded border border-gold hover:bg-gold-light disabled:opacity-50 transition-colors">
                   {isAiSearching ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Globe className="w-4 h-4 text-black" />}
                 </button>
               </div>
             </div>

             <div className="flex-1 overflow-y-auto subtle-scrollbar">
                {isAiSearching ? (
                   <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4">
                     <Globe className="w-10 h-10 animate-pulse text-gold" />
                     <p className="text-sm font-mono tracking-widest text-center animate-pulse">Scraping web index...<br/>Analyzing Powersports SEO...</p>
                   </div>
                ) : aiResponse ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-blue-900/20 border border-blue-500/50 rounded p-3">
                        <h4 className="text-[10px] uppercase font-bold text-blue-400 mb-2 font-mono flex items-center gap-2"><Eye className="w-3 h-3"/> Competitor Intel</h4>
                        <p className="text-xs text-blue-100"><DrillDownValue value={aiResponse.competitorIntel} label="Local SEO Competitor Audit" type="Report" onDrillDown={onDrillDown} /></p>
                     </div>
                     <div className="bg-black border border-border rounded p-3">
                        <h4 className="text-[10px] uppercase font-bold text-gold mb-2 font-mono flex items-center gap-2"><Target className="w-3 h-3"/> Top Real-Time Best Practices</h4>
                        <ul className="space-y-2">
                           {aiResponse.insights.map((insight, idx) => (
                             <li key={idx} className="text-xs text-text-muted flex items-start gap-2">
                               <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                               <span><DrillDownValue value={insight} label="AI Strategy Guideline" type="Report" onDrillDown={onDrillDown} color="hover:text-white cursor-pointer" /></span>
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="bg-charcoal border border-gold rounded p-3 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                         <h4 className="text-[10px] uppercase font-bold text-gold mb-2 font-mono">Recommended Action</h4>
                         <p className="text-xs font-bold text-white mb-3">{aiResponse.actionable}</p>
                         <button className="w-full bg-black hover:bg-gold/20 hover:text-gold border border-border text-white px-3 py-2 rounded text-xs font-bold transition-colors" onClick={() => onDrillDown('Action', { name: "Execute AI Recommendation", payload: aiResponse.actionable })}>
                            Execute Playbook
                         </button>
                     </div>
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 space-y-3">
                      <MessageSquare className="w-8 h-8" />
                      <p className="text-xs text-center max-w-[200px]">Ask the agent to research market conditions, analyze competitors, or optimize budget allocation.</p>
                   </div>
                )}
             </div>
           </div>
        </div>

        {/* Right Column: Active Campaign Ledger */}
        <div className="lg:col-span-2 bg-charcoal border border-border rounded flex flex-col shadow-inner">
           <div className="p-4 border-b border-border bg-black flex justify-between items-center">
             <div className="font-bold text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-500" /> Campaign Ledger</div>
             <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-charcoal px-3 py-1.5 rounded border border-border">
                   <Filter className="w-4 h-4 text-text-muted" />
                   <select className="bg-transparent text-xs text-white focus:outline-none" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
                      <option value="All">All Platforms</option>
                      <option value="Google">Google</option>
                      <option value="Facebook">Line</option> 
                      <option value="Meta">Meta</option>
                      <option value="Instagram">Instagram</option>
                   </select>
                </div>
                <div className="flex items-center gap-2 bg-charcoal px-3 py-1.5 rounded border border-border">
                   <select className="bg-transparent text-xs text-white focus:outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                   </select>
                </div>
             </div>
           </div>
           
           <div className="flex-1 overflow-x-auto overflow-y-auto subtle-scrollbar">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/50 border-b border-border sticky top-0 z-10 backdrop-blur-md">
                   <tr>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Campaign Name" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Platform" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Status" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="Spend" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="Leads" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="CPL" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                      <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted text-right"><DrillDownValue value="ROAS" label="Sort Scope" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white cursor-pointer"/></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {filteredCampaigns.map(camp => (
                      <tr key={camp.id} className="hover:bg-black/30 transition-colors group cursor-pointer" onClick={() => onDrillDown('Campaign', camp)}>
                         <td className="px-4 py-4">
                            <div className="font-bold text-white group-hover:text-gold transition-colors cursor-pointer"><DrillDownValue value={camp.name} label="Campaign Configuration" type="Report" onDrillDown={onDrillDown} /></div>
                            <div className="text-[10px] text-text-muted font-mono"><DrillDownValue value={camp.intent} label="Targeting Intent" type="Report" onDrillDown={onDrillDown} color="hover:text-white" /></div>
                         </td>
                         <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                               {camp.platform.includes('Google') ? <Monitor className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4 text-blue-600" />}
                               <DrillDownValue value={camp.platform} label="Platform Metrics" type="Report" onDrillDown={onDrillDown} color="hover:text-white" />
                            </div>
                         </td>
                         <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${camp.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                               <DrillDownValue value={camp.status} label="Toggle Status" type="Action" onDrillDown={onDrillDown} />
                            </span>
                         </td>
                         <td className="px-4 py-4 text-right font-mono text-xs">
                            <DrillDownValue value={`$${camp.spend.toLocaleString()}`} label="Campaign Spend Ledger" type="Financials" onDrillDown={onDrillDown} color="text-red-400 hover:text-white cursor-pointer" />
                         </td>
                         <td className="px-4 py-4 text-right font-bold text-white">
                            <DrillDownValue value={camp.leads} label="Lead Funnel Pipeline" type="Report" onDrillDown={onDrillDown} color="hover:text-gold cursor-pointer" />
                         </td>
                         <td className="px-4 py-4 text-right">
                            <span className={`font-mono text-xs ${camp.cpl > 40 ? 'text-amber-500' : 'text-green-500'}`}>
                               <DrillDownValue value={`$${camp.cpl.toFixed(2)}`} label="CPA Metrics" type="Report" onDrillDown={onDrillDown} />
                            </span>
                         </td>
                         <td className="px-4 py-4 text-right font-bold text-white">
                            <DrillDownValue value={`${camp.roas}x`} label="ROAS Calculation" type="Financials" onDrillDown={onDrillDown} color="hover:text-gold cursor-pointer" />
                         </td>
                      </tr>
                    ))}
                    {filteredCampaigns.length === 0 && (
                       <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-text-muted text-sm border-b-none">
                             No campaigns match the active filters.
                          </td>
                       </tr>
                    )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

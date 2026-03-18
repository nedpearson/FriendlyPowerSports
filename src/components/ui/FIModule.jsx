import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell
} from 'recharts';
import {
  CreditCard, TrendingUp, Filter, BrainCircuit, Activity, Shield, PieChart as PieChartIcon, Target
} from 'lucide-react';

import { DrillDownValue } from './DrillDownValue';
import { AutomatedInsights } from './AutomatedInsights';
import { RecommendationService } from '../../agents/services/RecommendationService';

// Extensive Mock Data Collections
const RAW_DEALS = [
  { id: 'DL-8821', customer: 'John Davis', unit: '2024 Talon 1000R', manager: 'Sarah M.', lender: 'Sheffield', reserve: 450, vsc: 800, gap: 0, maint: 0, date: '2024-03-02' },
  { id: 'DL-8822', customer: 'Emily White', unit: '2023 YZF-R7', manager: 'John D.', lender: 'Octane', reserve: 320, vsc: 600, gap: 400, maint: 0, date: '2024-03-04' },
  { id: 'DL-8823', customer: 'Mark Allen', unit: '2024 Rzr Pro R', manager: 'Sarah M.', lender: 'Synchrony', reserve: 800, vsc: 0, gap: 0, maint: 0, date: '2024-03-05' },
  { id: 'DL-8824', customer: 'Lisa Tran', unit: '2024 MT-09', manager: 'John D.', lender: 'Cash', reserve: 0, vsc: 1200, gap: 0, maint: 499, date: '2024-03-08' },
  { id: 'DL-8825', customer: 'Robert Cole', unit: '2023 Outlander', manager: 'Mike T.', lender: 'Sheffield', reserve: 550, vsc: 800, gap: 400, maint: 499, date: '2024-03-12' },
  { id: 'DL-8826', customer: 'Dana Pierce', unit: '2024 Ninja 400', manager: 'Mike T.', lender: 'Octane', reserve: 280, vsc: 0, gap: 400, maint: 0, date: '2024-03-15' },
  { id: 'DL-8827', customer: 'Sam Rivera', unit: '2024 Waverunner FX', manager: 'Sarah M.', lender: 'Synchrony', reserve: 600, vsc: 1200, gap: 0, maint: 0, date: '2024-03-18' }
];

const PVR_PACING_DATA = [
  { day: '1st', pvr: 850, forecast: 1100 },
  { day: '5th', pvr: 1050, forecast: 1150 },
  { day: '10th', pvr: 1120, forecast: 1200 },
  { day: '15th', pvr: 1247, forecast: 1250 },
  { day: '20th', pvr: 1280, forecast: 1300 },
];

const PENETRATION_BY_MANAGER = [
  { name: 'John D.', VSC: 42, GAP: 55, Maint: 18, totalVolume: 24 },
  { name: 'Sarah M.', VSC: 58, GAP: 45, Maint: 22, totalVolume: 31 },
  { name: 'Mike T.', VSC: 35, GAP: 65, Maint: 8, totalVolume: 19 },
];

const LENDER_COLORS = { 'Sheffield': '#c9a84c', 'Octane': '#3b82f6', 'Synchrony': '#10b981', 'Cash': '#888888' };

export const FIModule = ({ onDrillDown }) => {
  // State-driven multi-dimensional filters
  const [dateFilter, setDateFilter] = useState('MTD');
  const [managerFilter, setManagerFilter] = useState('All Managers');
  const [lenderFilter, setLenderFilter] = useState('All Lenders');
  const [projectionScenario, setProjectionScenario] = useState('Expected');

  // Dynamic computation logic based on filters
  const filteredDeals = useMemo(() => {
    return RAW_DEALS.filter(deal => {
      const matchManager = managerFilter === 'All Managers' || deal.manager === managerFilter;
      const matchLender = lenderFilter === 'All Lenders' || deal.lender === lenderFilter;
      // Date stub: in reality this would parse dates against 'MTD' or 'YTD' range logic
      return matchManager && matchLender;
    });
  }, [managerFilter, lenderFilter, dateFilter]);

  // Aggregate stats from the filtered slice
  const stats = useMemo(() => {
    let totalReserve = 0;
    let totalProducts = 0;
    let vscCount = 0;
    let gapCount = 0;
    let maintCount = 0;

    filteredDeals.forEach(d => {
      totalReserve += d.reserve;
      totalProducts += (d.vsc + d.gap + d.maint);
      if (d.vsc > 0) vscCount++;
      if (d.gap > 0) gapCount++;
      if (d.maint > 0) maintCount++;
    });

    const totalGross = totalReserve + totalProducts;
    const dealCount = filteredDeals.length;
    const pvr = dealCount > 0 ? (totalGross / dealCount).toFixed(0) : 0;
    const vscPen = dealCount > 0 ? Math.round((vscCount / dealCount) * 100) : 0;
    const gapPen = dealCount > 0 ? Math.round((gapCount / dealCount) * 100) : 0;
    
    return { dealCount, totalReserve, totalProducts, totalGross, pvr, vscPen, gapPen };
  }, [filteredDeals]);

  // Dynamic lender mix computation for PieChart
  const lenderPieData = useMemo(() => {
    const acc = {};
    filteredDeals.forEach(d => {
      acc[d.lender] = (acc[d.lender] || 0) + 1;
    });
    return Object.keys(acc).map(key => ({ name: key, value: acc[key] }));
  }, [filteredDeals]);

  // Dynamic AI Text generation
  const renderAiSynthesis = () => {
    let projectionGross = stats.totalGross * 1.8; // Stub logic mimicking running out the month
    if (projectionScenario === 'Aggressive') projectionGross *= 1.15;
    if (projectionScenario === 'Conservative') projectionGross *= 0.85;

    let text = "";
    if (managerFilter !== 'All Managers') {
      text = `Analyzing portfolio for ${managerFilter}. Their PVR is trending strong at $${stats.pvr}, heavily anchored by VSC attachments (${stats.vscPen}%). If they sustain current execution trajectories, AI projects a month-end subtotal of $${projectionGross.toLocaleString(undefined, {maximumFractionDigits:0})} generated by this desk.`;
    } else if (lenderFilter !== 'All Lenders') {
      text = `Isolated lender profile: ${lenderFilter}. Penetration on this tier is yielding a $${stats.pvr} average PVR. AI notes that ${lenderFilter} approvals tend to see lower Maintenance attach rates compared to the total ledger. Recommend aggressive backend presentation early in the box.`;
    } else {
      text = `Based on MTD pacing of ${stats.vscPen}% VSC attach and $${stats.pvr} overall PVR, the central AI engine projects a month-end backend gross formulation of $${projectionGross.toLocaleString(undefined, {maximumFractionDigits:0})} [Scenario: ${projectionScenario}]. Sarah M. is currently carrying the highest VSC yield weight.`;
    }

    return text;
  };

  const fiRecs = RecommendationService.fetchPending().filter(r => r.agentId === 'ag_fi_readiness').slice(0, 1);
  const fiInsights = fiRecs.length > 0 ? fiRecs.map(rec => ({
    type: rec.priority === 'URGENT' ? 'warning' : 'opportunity',
    message: <>{rec.title} — <span className="text-text-muted">{rec.description}</span></>,
    actionText: "Review F&I Structure",
    onAction: () => onDrillDown('AgentRecommendation', { ...rec })
  })) : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Global Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-gold/30 rounded flex items-center justify-center text-gold shadow-[0_0_10px_rgba(201,168,76,0.1)]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">F&I & Business Office</h1>
              <span className="text-xs font-mono text-text-muted">Dynamic Ledger Analysis Hub</span>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-black border border-border rounded px-2 text-sm text-text-muted">
               <Filter className="w-3 h-3 mr-2 text-gold" /> Range
               <select className="bg-transparent border-none text-white p-2 focus:outline-none cursor-pointer" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                 <option value="MTD">MTD</option>
                 <option value="YTD">YTD</option>
                 <option value="Last Month">Last Month</option>
               </select>
            </div>
            <div className="flex items-center bg-black border border-border rounded px-2 text-sm text-text-muted">
               <Filter className="w-3 h-3 mr-2 text-gold" /> Desk
               <select className="bg-transparent border-none text-white p-2 focus:outline-none cursor-pointer" value={managerFilter} onChange={e => setManagerFilter(e.target.value)}>
                 <option value="All Managers">All Managers</option>
                 <option value="Sarah M.">Sarah M.</option>
                 <option value="John D.">John D.</option>
                 <option value="Mike T.">Mike T.</option>
               </select>
            </div>
            <div className="flex items-center bg-black border border-border rounded px-2 text-sm text-text-muted">
               <Filter className="w-3 h-3 mr-2 text-gold" /> Bank
               <select className="bg-transparent border-none text-white p-2 focus:outline-none cursor-pointer" value={lenderFilter} onChange={e => setLenderFilter(e.target.value)}>
                 <option value="All Lenders">All Lenders</option>
                 <option value="Sheffield">Sheffield</option>
                 <option value="Octane">Octane</option>
                 <option value="Synchrony">Synchrony</option>
                 <option value="Cash">Cash (Drafts)</option>
               </select>
            </div>
            <button className="bg-gold hover:bg-gold-light text-black px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors shadow-md" onClick={() => onDrillDown('Action', { name: 'Run Credit', message: 'Opening secure credit portal...' })}>
              Run App
            </button>
         </div>
      </div>

      {fiInsights.length > 0 && <AutomatedInsights onDrillDown={onDrillDown} insights={fiInsights} />}

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-charcoal p-5 rounded border border-border shadow-inner hover:border-gold/50 cursor-pointer transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Gross PVR', context: stats.pvr })}>
            <div className="text-xs text-text-muted font-mono mb-2 uppercase tracking-wider flex items-center gap-2"><Target className="w-3 h-3" /> Average PVR</div>
            <div className="text-3xl font-bold text-white mb-1">
               <DrillDownValue value={`$${stats.pvr}`} label={`PVR [${managerFilter}]`} type="Financials" onDrillDown={onDrillDown} />
            </div>
            <div className="text-xs text-green-500 bg-green-900/20 inline-block px-1 rounded font-bold tracking-wider">
               <DrillDownValue value="+$42 vs BM" label="PVR Trend" type="Financials" onDrillDown={onDrillDown} color="text-green-500" />
            </div>
          </div>
          <div className="bg-charcoal p-5 rounded border border-border shadow-inner hover:border-gold/50 cursor-pointer transition-colors" onClick={() => onDrillDown('Financials', { metric: 'VSC Penetration', context: stats.vscPen })}>
            <div className="text-xs text-text-muted font-mono mb-2 uppercase tracking-wider flex items-center gap-2"><Shield className="w-3 h-3" /> VSC Attach</div>
            <div className="text-3xl font-bold text-white mb-1">
               <DrillDownValue value={`${stats.vscPen}%`} label={`VSC [${managerFilter}]`} type="Report" onDrillDown={onDrillDown} />
            </div>
            <div className="text-xs text-green-500 bg-green-900/20 inline-block px-1 rounded font-bold tracking-wider">
               <DrillDownValue value="+4.0% MoM" label="VSC Trend" type="Financials" onDrillDown={onDrillDown} color="text-green-500" />
            </div>
          </div>
          <div className="bg-charcoal p-5 rounded border border-border shadow-inner hover:border-gold/50 cursor-pointer transition-colors" onClick={() => onDrillDown('Financials', { metric: 'GAP Penetration', context: stats.gapPen })}>
            <div className="text-xs text-text-muted font-mono mb-2 uppercase tracking-wider flex items-center gap-2"><Activity className="w-3 h-3" /> GAP Attach</div>
            <div className="text-3xl font-bold text-white mb-1">
               <DrillDownValue value={`${stats.gapPen}%`} label={`GAP [${managerFilter}]`} type="Report" onDrillDown={onDrillDown} />
            </div>
            <div className="text-xs text-amber-500 bg-amber-900/20 inline-block px-1 rounded font-bold tracking-wider">
               <DrillDownValue value="-2.1% MoM" label="GAP Trend" type="Financials" onDrillDown={onDrillDown} color="text-amber-500" />
            </div>
          </div>
          <div className="bg-charcoal p-5 rounded border border-gold/40 shadow-[0_0_15px_rgba(201,168,76,0.1)] relative overflow-hidden cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', { metric: 'Total Net Generated', context: stats.totalGross })}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl translate-x-12 -translate-y-8"></div>
            <div className="text-xs text-gold font-mono mb-2 uppercase tracking-wider flex items-center gap-2 relative z-10"><TrendingUp className="w-3 h-3" /> Generated Gross</div>
            <div className="text-3xl font-bold text-gold mb-1 relative z-10">
               <DrillDownValue value={`$${stats.totalGross.toLocaleString()}`} label="Generated Gross" type="Financials" onDrillDown={onDrillDown} color="text-gold" />
            </div>
            <div className="text-xs text-green-500 font-bold tracking-wider relative z-10">
               <DrillDownValue value={`${stats.dealCount} Total Units Over Margin`} label="Unit Count" type="Financials" onDrillDown={onDrillDown} color="text-green-500" />
            </div>
          </div>
      </div>

      {/* AI Projection Matrix */}
      <div className="bg-black border border-border rounded-lg p-5 flex flex-col xl:flex-row gap-6 shadow-inner">
         <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest font-mono flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-electric" /> Dynamic AI Scenario Modeling
            </h3>
            <p className="text-sm text-text-muted leading-relaxed min-h-[60px]">
               {renderAiSynthesis()}
            </p>
         </div>
         <div className="xl:border-l xl:border-border/50 xl:pl-6 flex flex-col justify-center min-w-[250px]">
            <div className="text-xs text-text-muted font-mono mb-2 uppercase tracking-widest">Adjust Projection Logic:</div>
            <div className="flex bg-charcoal rounded border border-border overflow-hidden">
               {['Conservative', 'Expected', 'Aggressive'].map(tier => (
                 <button 
                   key={tier}
                   className={`flex-1 text-xs py-2 font-bold transition-colors ${projectionScenario === tier ? 'bg-panel text-gold border-b-2 border-gold shadow-inner' : 'text-text-muted hover:bg-black hover:text-white border-b-2 border-transparent'}`}
                   onClick={() => setProjectionScenario(tier)}
                 >
                   {tier}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-charcoal border border-border rounded-lg p-5 flex flex-col shadow-inner col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-mono border-b border-border/50 pb-2 flex justify-between">
              <span>PVR & Profit Yield Pacing</span>
              <span className="text-text-muted cursor-pointer hover:text-gold transition-colors" onClick={() => onDrillDown('Action', {name: 'Expand Graph'})}>[ EXPAND ]</span>
            </h3>
            <div className="flex-1 min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={PVR_PACING_DATA} margin={{top:10, right:10, left:0, bottom:0}}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="day" stroke="#888" tick={{fill: '#888', fontSize: 11}} axisLine={false} tickLine={false} />
                   <YAxis stroke="#888" tick={{fill: '#888', fontSize: 11}} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                   <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} formatter={v => `$${v}`} />
                   <Legend wrapperStyle={{fontSize: '11px'}} />
                   <Line type="monotone" dataKey="pvr" name="Actual PVR" stroke="#c9a84c" strokeWidth={3} dot={{r:4, fill:'#c9a84c', strokeWidth:0}} activeDot={{r:6}} />
                   <Line type="monotone" dataKey="forecast" name="System Benchmark" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-charcoal border border-border rounded-lg p-5 flex flex-col shadow-inner">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-mono border-b border-border/50 pb-2 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-text-muted" /> Bank/Lender Mix
            </h3>
            <div className="flex-1 min-h-[200px] relative flex justify-center items-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={lenderPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                     {lenderPieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={LENDER_COLORS[entry.name] || '#888'} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333', borderRadius: '8px'}} itemStyle={{color: '#fff'}} formatter={(val, name) => [val, `${name} Contracts`]} />
                 </PieChart>
               </ResponsiveContainer>
               {lenderPieData.length === 0 && <div className="absolute text-text-muted text-xs font-mono">No Funding Data in Scope</div>}
            </div>
         </div>
      </div>

      {/* Advanced Extended Deal Log containing drilldowns on every cell */}
      <div className="bg-black border border-border rounded-lg p-5">
        <div className="flex justify-between items-end mb-4 border-b border-border/50 pb-2">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Deep Inspection: Deal Log</h3>
           <div className="text-xs text-text-muted font-mono">{filteredDeals.length} Isolated Records in View</div>
        </div>
        <div className="overflow-x-auto hidden-scrollbar pb-2">
          <table className="w-full text-sm text-left text-text whitespace-nowrap">
            <thead className="text-[10px] text-text-muted bg-charcoal font-mono uppercase tracking-widest border-y border-border">
              <tr>
                <th className="px-4 py-3 rounded-tl">Customer Name</th>
                <th className="px-4 py-3">Unit / VIN</th>
                <th className="px-4 py-3">Desk Mgr</th>
                <th className="px-4 py-3">Fund/Lender</th>
                <th className="px-4 py-3 text-right">Bank Reserve</th>
                <th className="px-4 py-3 text-right">VSC Contract</th>
                <th className="px-4 py-3 text-right">GAP Insurance</th>
                <th className="px-4 py-3 text-right">Prepaid Maint</th>
                <th className="px-4 py-3 rounded-tr text-right font-bold text-white">Net Backend</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map(d => {
                 const totalNet = d.reserve + d.vsc + d.gap + d.maint;
                 return (
                  <tr key={d.id} onClick={() => onDrillDown('Deal', {...d, total: totalNet})} className="border-b border-border/30 hover:bg-panel transition-colors cursor-pointer group">
                    <td className="px-4 py-3 text-white font-bold group-hover:text-gold transition-colors">
                       <DrillDownValue value={d.customer} label="Customer 360 Profile" type="CRM_Customer360" onDrillDown={onDrillDown} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                       <DrillDownValue value={d.unit} label="Asset Ledger" type="InventoryUnit" onDrillDown={onDrillDown} />
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">
                       <DrillDownValue value={d.manager} label="Employee Audit" type="Employee" onDrillDown={onDrillDown} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                       <div className="inline-block px-1.5 py-0.5 rounded border" style={{borderColor: `${LENDER_COLORS[d.lender] || '#888'}50`, color: LENDER_COLORS[d.lender] || '#bbb'}}>
                          <DrillDownValue value={d.lender} label="Bank/Issuer Underwriting" type="Lender" onDrillDown={onDrillDown} />
                       </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                       {d.reserve > 0 ? <DrillDownValue value={`$${d.reserve}`} label="Reserve Revenue" type="Financials" onDrillDown={onDrillDown} /> : <span className="text-text-muted opacity-30">--</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-green-500 font-bold">
                       {d.vsc > 0 ? <DrillDownValue value={`$${d.vsc}`} label="VSC Contract Ledger" type="Financials" onDrillDown={onDrillDown} color="text-green-500 font-bold" /> : <span className="text-text-muted opacity-30 font-normal">--</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-blue-400 font-bold">
                       {d.gap > 0 ? <DrillDownValue value={`$${d.gap}`} label="GAP Policy Link" type="Financials" onDrillDown={onDrillDown} color="text-blue-400 font-bold" /> : <span className="text-text-muted opacity-30 font-normal">--</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-amber-500 font-bold">
                       {d.maint > 0 ? <DrillDownValue value={`$${d.maint}`} label="Maintenance Escrow" type="Financials" onDrillDown={onDrillDown} color="text-amber-500 font-bold" /> : <span className="text-text-muted opacity-30 font-normal">--</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gold bg-gold/5 border-l border-gold/10">
                       <DrillDownValue value={`$${totalNet.toLocaleString()}`} label="Closed Backend Yield" type="Financials" onDrillDown={onDrillDown} color="text-gold" />
                    </td>
                  </tr>
                 );
              })}
              {filteredDeals.length === 0 && (
                 <tr><td colSpan="9" className="text-center py-10 text-text-muted italic bg-charcoal">No deals meet the strict criteria applied in the filter stack above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

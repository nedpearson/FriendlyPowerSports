import React, { useState } from 'react';
import { Package, TrendingDown, TrendingUp, Filter, AlertCircle, BarChart2, Wrench, Calendar, DollarSign, BrainCircuit, Search, Database } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';
import { KPICard } from './KPICard';
import { AutomatedInsights } from './AutomatedInsights';

export const InventoryModule = ({ onDrillDown }) => {
  const [filterType, setFilterType] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');

  // Hardcoded Mock Data for the ultimate drilldown experience
  const inventoryStock = [
    { stock: 'H8842', year: 2024, brand: 'Honda', model: 'Talon 1000R', condition: 'New', type: 'SXS', price: 23500, cost: 21000, days: 12, fpCost: 50 },
    { stock: 'Y1102', year: 2023, brand: 'Yamaha', model: 'YZF-R7', condition: 'Used', type: 'Motorcycle', price: 8200, cost: 6500, days: 45, fpCost: 180 },
    { stock: 'P9910', year: 2023, brand: 'Polaris', model: 'RZR Pro R Sport', condition: 'New', type: 'SXS', price: 38000, cost: 34500, days: 112, fpCost: 650 },
    { stock: 'K2291', year: 2024, brand: 'Kawasaki', model: 'Ninja ZX-6R', condition: 'New', type: 'Motorcycle', price: 11299, cost: 9800, days: 5, fpCost: 20 },
    { stock: 'H7721', year: 2018, brand: 'Harley-Davidson', model: 'Street Glide', condition: 'Used', type: 'Motorcycle', price: 15500, cost: 13000, days: 92, fpCost: 420 },
    { stock: 'C3345', year: 2024, brand: 'Can-Am', model: 'Maverick X3 X RS Turbo', condition: 'New', type: 'SXS', price: 29500, cost: 26000, days: 22, fpCost: 95 },
  ];

  const filteredStock = inventoryStock.filter(item => 
    (filterType === 'All' || item.type === filterType) &&
    (filterCondition === 'All' || item.condition === filterCondition)
  );

  const totalInvValue = filteredStock.reduce((acc, curr) => acc + curr.cost, 0);
  const agedRiskUnits = filteredStock.filter(u => u.days > 90);
  const totalFpRisk = agedRiskUnits.reduce((acc, curr) => acc + curr.fpCost, 0);

  const insights = [
    { type: "warning", message: <>There are <DrillDownValue value={`${agedRiskUnits.length} Heavyweight Units`} label="Aged Inventory Risk" type="Report" onDrillDown={onDrillDown} color="text-red-500" /> exceeding 90 days on floorplan. Immediate wholesale or digital markdown is recommended to curb FP drag.</>, actionText: "Run Markdown Campaign", data: { name: 'Aged Inventory Ledger' } },
    { type: "opportunity", message: <>Service to Sales correlation indicates <DrillDownValue value="Used Street Glides" label="Market Demand" type="Report" onDrillDown={onDrillDown} /> are in high demand in the BDC. Recommend targeted email blast pushing H7721.</>, actionText: "Generate Email Blast", data: { name: 'Demand Generation Tool' } }
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-blue-500 shadow-inner">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Inventory Management</h1>
              <p className="text-text-muted text-sm border-l-2 border-blue-500 pl-2 ml-1">Floorplan Agings, Valuation, & Digital Retailing Syndication</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:border-gold transition-colors" onClick={() => onDrillDown('Action', { name: 'Scan VIN via Mobile' })}>
              <Database className="w-4 h-4" /> Scan New Unit
            </button>
         </div>
      </div>

      <AutomatedInsights onDrillDown={onDrillDown} insights={insights} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-blue-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Enterprise Working Capital Ledger' })}>
           <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><DollarSign className="w-4 h-4"/> <DrillDownValue value="Total Asset Value" label="Capital Evaluation" type="Financials" onDrillDown={onDrillDown} color="text-blue-500 group-hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-1 group-hover:text-gold transition-colors">
              <DrillDownValue value={`$${totalInvValue.toLocaleString()}`} label="Inventory Valuation" type="Financials" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs text-text-muted mt-2">Filter Scope: <strong className="text-white"><DrillDownValue value={filterCondition} label="Scope Shift" type="Action" onDrillDown={onDrillDown} color="hover:text-gold"/></strong></div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-red-500 transition-colors group cursor-pointer" onClick={() => onDrillDown('Report', { name: 'Severe Aging 90+ Matrix' })}>
           <div className="flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest font-mono mb-3 border-b border-border/50 pb-2"><AlertCircle className="w-4 h-4"/> <DrillDownValue value="Aged Risk (90+ Days)" label="Risk Configuration" type="Report" onDrillDown={onDrillDown} color="text-red-500 group-hover:text-white" /></div>
           <div className="text-3xl font-playfair text-white mt-1 group-hover:text-gold transition-colors">
              <DrillDownValue value={agedRiskUnits.length} label="Units In Peril" type="Report" onDrillDown={onDrillDown} />
           </div>
           <div className="text-xs mt-2 text-text-muted flex justify-between">
              <span>Drag: <strong className="text-red-400 font-mono"><DrillDownValue value={`-$${totalFpRisk}`} label="Waste Expenditures" type="Financials" onDrillDown={onDrillDown} color="hover:text-white"/></strong></span>
           </div>
        </div>

        <div className="bg-charcoal border border-border rounded p-4 shadow-inner hover:border-green-500 transition-colors group flex flex-col justify-center text-center cursor-pointer" onClick={() => onDrillDown('Action', { name: 'Initiate Digital Syndication Sync' })}>
           <ActivityIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
           <div className="text-sm font-bold text-white uppercase tracking-widest mb-1"><DrillDownValue value="Syndicated Live" label="Web Syncer" type="Action" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></div>
           <div className="text-xs text-text-muted"><DrillDownValue value="100% Match to CycleTrader & Web" label="API Hook Status" type="Report" onDrillDown={onDrillDown} color="hover:text-white" /></div>
        </div>
      </div>

      <div className="bg-charcoal border border-border rounded flex flex-col flex-1 shadow-inner relative overflow-hidden min-h-[400px]">
         <div className="p-4 border-b border-border bg-black flex justify-between items-center relative z-10">
           <div className="font-bold text-white flex items-center gap-2 uppercase tracking-wide"><BarChart2 className="w-5 h-5 text-gold" /> Master Inventory Roster</div>
           <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-charcoal px-3 py-1.5 rounded border border-border">
                 <Filter className="w-4 h-4 text-text-muted" />
                 <select className="bg-transparent text-xs text-white focus:outline-none cursor-pointer" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
                    <option value="All">All Conditions</option>
                    <option value="New">New Units</option>
                    <option value="Used">Pre-Owned</option>
                 </select>
              </div>
           </div>
         </div>
         
         <div className="flex-1 overflow-x-auto overflow-y-auto subtle-scrollbar">
           <table className="w-full text-left text-sm whitespace-nowrap relative z-10">
              <thead className="bg-black/80 border-b border-border sticky top-0 backdrop-blur-md">
                 <tr>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Stock #" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Condition" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Year Make Model" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Aging" type="Report" onDrillDown={onDrillDown} /></th>
                    <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-text-muted"><DrillDownValue value="Listing Price" type="Financials" onDrillDown={onDrillDown} /></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                  {filteredStock.map((unit) => (
                    <tr key={unit.stock} className="hover:bg-black/60 transition-colors group cursor-pointer" onClick={() => onDrillDown('InventoryUnit', { stock: unit.stock, make: unit.brand })}>
                       <td className="px-4 py-4 text-white font-mono font-bold text-xs"><DrillDownValue value={unit.stock} label="DMS Profile" type="InventoryUnit" onDrillDown={onDrillDown} color="text-white hover:text-gold" /></td>
                       <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${unit.condition === 'New' ? 'text-blue-400 border-blue-500/30 bg-blue-900/10' : 'text-amber-500 border-amber-500/30 bg-amber-900/10'}`}>
                             <DrillDownValue value={unit.condition} label="Toggle Filters" type="Action" onDrillDown={onDrillDown} />
                          </span>
                       </td>
                       <td className="px-4 py-4">
                          <div className="font-bold text-white group-hover:text-gold transition-colors"><DrillDownValue value={`${unit.year} ${unit.brand} ${unit.model}`} label="Model Line Specs" type="Report" onDrillDown={onDrillDown} /></div>
                       </td>
                       <td className="px-4 py-4">
                          <div className={`font-mono text-xs flex items-center gap-1 ${unit.days > 90 ? 'text-red-500 font-bold' : 'text-green-500'}`}>
                              {unit.days > 90 && <AlertCircle className="w-3 h-3" />}
                             <DrillDownValue value={`${unit.days} Days`} label="Holding Costs" type="Financials" onDrillDown={onDrillDown} />
                          </div>
                          {unit.days > 90 && <div className="text-[9px] text-red-500/80 tracking-widest uppercase">Wholesale Risk</div>}
                       </td>
                       <td className="px-4 py-4 text-right font-bold text-white text-md">
                          <DrillDownValue value={`$${unit.price.toLocaleString()}`} label="MSRP / Retail Adjust" type="Financials" onDrillDown={onDrillDown} color="text-gold" />
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

// Extracted internal icon to prevent missing import
const ActivityIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

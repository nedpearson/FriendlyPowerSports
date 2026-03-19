const fs = require('fs');

let code = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8');

const newCases = `
      case 'Lender':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-end border-b border-border pb-4">
               <div>
                  <h3 className="text-3xl font-playfair text-white flex items-center gap-3"><DollarSign className="w-8 h-8 text-gold"/> Partner Lender Underwriting Profile</h3>
                  <p className="text-sm text-text-muted mt-2">Aggregated risk modeling, callback times, and active funding stipulations for {item.data?.name || item.value}.</p>
               </div>
               <div className="bg-panel border border-border px-4 py-2 rounded text-right">
                  <div className="text-[10px] tracking-widest text-text-muted font-mono uppercase">Portfolio Health</div>
                  <div className="text-green-500 font-bold text-sm uppercase">Excellent</div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Max LTV Ratio</div>
                   <div className="text-3xl font-bold text-white mb-1">115%</div>
                   <div className="text-xs text-green-500">+5% Promo Active</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Avg Callback Time</div>
                   <div className="text-3xl font-bold text-white mb-1">4.2m</div>
                   <div className="text-xs text-text-dim">Fully Automated Submissions</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center border-b-2 border-b-amber-500">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Stipulation Rate</div>
                   <div className="text-3xl font-bold text-white mb-1">28%</div>
                   <div className="text-xs text-amber-500">Requires POI frequently</div>
                </div>
             </div>

             <div className="bg-charcoal border border-border rounded p-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4 border-b border-border/50 pb-2">Active Approvals Queue</h4>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left text-text whitespace-nowrap">
                     <thead className="text-[10px] text-text-muted bg-black font-mono uppercase tracking-widest border-y border-border">
                        <tr>
                          <th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3 text-right">Amount Requested</th><th className="px-4 py-3 text-right">Decision</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="border-b border-border/30 hover:bg-panel cursor-pointer">
                          <td className="px-4 py-3 text-white font-bold">John Davis</td><td className="px-4 py-3 text-xs">2024 Talon 1000R</td><td className="px-4 py-3 text-right font-mono">$24,500</td><td className="px-4 py-3 text-right text-green-500 font-bold">Approved (Tier 1)</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-panel cursor-pointer">
                          <td className="px-4 py-3 text-white font-bold">Emily White</td><td className="px-4 py-3 text-xs">2023 YZF-R7</td><td className="px-4 py-3 text-right font-mono">$11,200</td><td className="px-4 py-3 text-right text-amber-500 font-bold">Cond. Approval (POI Required)</td>
                        </tr>
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'CRM_Customer360':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-start border-b border-border pb-4">
               <div>
                  <h3 className="text-3xl font-playfair text-white flex items-center gap-3"><UsersIcon className="w-8 h-8 text-gold"/> Customer 360 Lifetime Record</h3>
                  <div className="flex items-center gap-3 mt-3">
                     <span className="bg-panel border border-border px-3 py-1 rounded text-white tracking-widest text-xs uppercase font-bold">{item.data?.name || item.value}</span>
                     <span className="bg-green-900/30 border border-green-500/50 px-3 py-1 rounded text-green-500 tracking-widest text-[10px] uppercase font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">VIP Loyalty Member</span>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] tracking-widest text-text-muted font-mono uppercase mb-1">Lifetime Value (LTV)</div>
                  <div className="text-2xl font-bold text-gold">$42,880</div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Total Units Purchased</div>
                   <div className="text-3xl font-bold text-white mb-1">3</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Service RO Count</div>
                   <div className="text-3xl font-bold text-white mb-1">14</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">F&I Penetration</div>
                   <div className="text-3xl font-bold text-white mb-1">100%</div>
                   <div className="text-xs text-text-dim">Maint. Buyer</div>
                </div>
                <div className="bg-black border border-border rounded p-4 text-center cursor-pointer hover:border-gold transition-colors group">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-3 text-center w-full">Quick Action</div>
                   <div className="text-sm font-bold text-gold group-hover:text-white transition-colors">Start Soft Credit Pull</div>
                </div>
             </div>

             <div className="bg-charcoal border border-border rounded p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-6 border-b border-border/50 pb-2 relative z-10">Lifetime Value Engagement Timeline</h4>
                
                <div className="space-y-6 relative z-10 ml-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                   
                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-black text-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                         <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-panel p-4 rounded border border-border/50 shadow">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">Financed 2024 Talon 1000R</span>
                            <span className="font-mono text-[10px] text-gold align-top">2 DAYS AGO</span>
                         </div>
                         <div className="text-xs text-text-muted">Bought VSC and GAP. Financed via Sheffield. F&I generated $2,420 back-end gross.</div>
                      </div>
                   </div>

                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-black text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                         <Wrench className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-panel p-4 rounded border border-border/50 shadow">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-sm">Service RO #3392 closed</span>
                            <span className="font-mono text-[10px] text-text-muted align-top">3 WEEKS AGO</span>
                         </div>
                         <div className="text-xs text-text-muted">General maintenance on 2021 Foreman. Customer mentioned looking for side-by-side. Sent lead to Sales.</div>
                      </div>
                   </div>

                </div>
             </div>
          </div>
        );

      case 'InventoryUnit':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-start border-b border-border pb-4">
               <div>
                  <h3 className="text-3xl font-playfair text-white flex items-center gap-3"><Package className="w-8 h-8 text-gold"/> Asset Ledger & Pricing Analysis</h3>
                  <div className="flex items-center gap-3 mt-3">
                     <span className="bg-panel border border-border px-3 py-1 rounded text-white tracking-widest text-xs uppercase font-bold">{item.data?.name || item.value}</span>
                     <span className="bg-panel border border-border px-3 py-1 rounded text-text-dim tracking-widest text-[10px] uppercase font-mono">VIN: 1YVNGH82R9M0429</span>
                  </div>
               </div>
               <div className="bg-red-900/10 border border-red-500/30 px-4 py-2 rounded text-right">
                  <div className="text-[10px] tracking-widest text-red-500 font-mono uppercase">Floorplan Warning</div>
                  <div className="text-white font-bold text-sm uppercase">112 Days in Stock</div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-charcoal border border-border rounded p-4 text-center border-b-2 border-b-cyan-500">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">MSRP</div>
                   <div className="text-2xl font-bold text-white mb-1">$22,499</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Dealer Cost</div>
                   <div className="text-2xl font-bold text-white mb-1">$19,200</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center">
                   <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-1">Pack & Recon</div>
                   <div className="text-2xl font-bold text-white mb-1">$500</div>
                </div>
                <div className="bg-charcoal border border-border rounded p-4 text-center bg-gold/5 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                   <div className="text-[10px] text-gold font-mono tracking-widest uppercase mb-1">Max Front Gross</div>
                   <div className="text-2xl font-bold text-gold mb-1">$2,799</div>
                </div>
             </div>

             <div className="bg-black border border-border rounded-lg p-5 flex flex-col xl:flex-row gap-6 shadow-inner">
                 <div className="flex-1">
                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest font-mono flex items-center gap-2">
                       <BrainCircuit className="w-4 h-4 text-electric" /> Curtailment Algorithm Warning
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                       This unit hits the 120-Day Curtailment boundary in exactly 8 days. AI predicts a baseline unrecoverable floorplan interest penalty of $380 if the unit rolls into the next cycle. Action recommended: Apply $500 Manager Cash incentive and assign automatically to BDC leads matching UTV affinity profiles.
                    </p>
                    <button className="mt-4 bg-amber-900/20 text-amber-500 px-4 py-2 border border-amber-500/30 rounded text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors w-full lg:w-auto">Saturate BDC Leads with Incentive</button>
                 </div>
                 <div className="xl:border-l xl:border-border/50 xl:pl-6 flex flex-col justify-center min-w-[250px]">
                    <div className="w-full h-32 bg-panel rounded border border-border flex items-center justify-center text-text-dim text-xs font-mono uppercase tracking-widest">
                       4K Asset Image Stream
                    </div>
                 </div>
             </div>
          </div>
        );
`;

if (code.includes('default:') && !code.includes("case 'Lender':")) {
    code = code.replace(/\\s+default:/, '\\n' + newCases + '\\n      default:');
    fs.writeFileSync('src/components/ui/DrillDownModal.jsx', code);
    console.log("Successfully injected bespoke drilldowns!");
} else {
    console.log("Missing anchor or already patched.");
}

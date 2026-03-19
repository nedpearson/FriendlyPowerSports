import React, { useState } from 'react';
import { DrillDownValue } from './DrillDownValue';
import { DateRangePicker } from './DateRangePicker';
import { 
   Award, TrendingUp, CheckCircle2, ChevronRight, Zap, Trophy,
   Target, Briefcase, GraduationCap, AlertCircle, PlayCircle, Star, BrainCircuit, Activity
} from 'lucide-react';

export const EmployeeHubModule = ({ user, onDrillDown }) => {
  const leaderboard = [
    { name: "Jake Fontenot", units: 24, target: 30, gross: "$104k", curTier: "Gold", nextTier: "Platinum", avatar: "JF" },
    { name: user?.name || "CurrentUser", units: 18, target: 20, gross: "$82k", curTier: "Silver", nextTier: "Gold", isMe: true, avatar: user?.avatar || "U" },
    { name: "Marcus Broussard", units: 14, target: 20, gross: "$61k", curTier: "Bronze", nextTier: "Silver", avatar: "MB" },
    { name: "Tony Guillory", units: 9, target: 15, gross: "$38k", curTier: "Base", nextTier: "Bronze", avatar: "TG" },
    { name: "Sarah Jenkins", units: 6, target: 15, gross: "$21k", curTier: "Base", nextTier: "Bronze", avatar: "SJ" }
  ];

  const getTierColor = (tier) => {
     switch(tier) {
         case 'Platinum': return 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]';
         case 'Gold': return 'bg-gold text-black shadow-[0_0_10px_rgba(201,168,76,0.5)]';
         case 'Silver': return 'bg-slate-300 text-black shadow-[0_0_10px_rgba(203,213,225,0.3)]';
         case 'Bronze': return 'bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.3)]';
         default: return 'bg-panel text-white';
     }
  };

  const getTierIcon = (tier) => {
     switch(tier) {
         case 'Platinum': return <Zap className="w-3 h-3"/>;
         case 'Gold': return <Trophy className="w-3 h-3"/>;
         case 'Silver': return <Target className="w-3 h-3"/>;
         default: return <Star className="w-3 h-3"/>;
     }
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500">
       
       {/* Identity Header */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-charcoal p-6 rounded border border-border shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-bold shadow-2xl transition-all ${user?.role === 'Manager' ? 'border-amber-500 text-amber-500 bg-amber-900/20' : 'border-gold text-gold bg-gold/10'}`}>
              {user?.avatar || "U"}
            </div>
            <div>
              <div className="text-text-muted text-[10px] uppercase font-mono tracking-widest mb-1 flex items-center gap-2">
                 <CheckCircle2 className="w-3 h-3 text-green-500"/> Verified Identity
              </div>
              <h1 className="text-4xl font-playfair text-white mb-2">{user?.name}</h1>
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="bg-panel border border-border px-3 py-1 rounded text-white tracking-widest uppercase font-bold">{user?.role}</span>
                <span className="bg-panel border border-border px-3 py-1 rounded text-text-muted tracking-widest uppercase font-bold"><DrillDownValue value={user?.location || 'Baton Rouge'} label="Assigned Location" type="Report" onDrillDown={onDrillDown} /></span>
                <span className="bg-green-900/30 border border-green-500/50 px-3 py-1 rounded text-green-500 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">Clocked In</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 relative z-10">
             <div className="bg-black p-5 rounded border border-border text-center min-w-[140px] shadow-inner cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Employee', {name: user?.name})}>
               <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-2">Store Rank</div>
               <div className="text-4xl font-bold text-white mb-1">#2</div>
               <div className="text-xs text-green-500 font-bold tracking-widest">+1 Spot MoM</div>
             </div>
             <div className="bg-black p-5 rounded border border-border text-center min-w-[140px] shadow-inner cursor-pointer hover:border-gold transition-colors block border-b-2 border-b-gold" onClick={() => onDrillDown('Report', {name: 'Sales Ledger'})}>
               <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-2">Units MTD</div>
               <div className="text-4xl font-bold text-gold mb-1">18</div>
               <div className="text-xs text-text-dim tracking-widest uppercase">Target: 20</div>
             </div>
             <div className="bg-black p-5 rounded border border-border text-center min-w-[140px] shadow-inner cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Financials', {name: 'Commission Pacing'})}>
               <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-2">Gross Pacing</div>
               <div className="text-4xl font-bold text-white mb-1">$82k</div>
               <div className="text-xs text-green-500 font-bold tracking-widest">+14% vs YTD</div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* LEFT COLUMN: Gamification & Leaderboard */}
         <div className="lg:col-span-2 space-y-6">
           <div className="bg-charcoal border border-border rounded shadow-lg overflow-hidden relative">
             <div className="p-6 border-b border-border bg-black/50 flex justify-between items-center relative z-10">
               <h2 className="text-white font-playfair text-2xl flex items-center gap-3"><Trophy className="w-6 h-6 text-gold"/> Tier Progression & Gamification</h2>
               <DateRangePicker />
             </div>
             
             <div className="p-6 space-y-4 relative z-10">
                {leaderboard.map((rep, idx) => (
                   <div key={idx} className={`bg-black p-4 rounded border ${rep.isMe ? 'border-gold shadow-[0_0_15px_rgba(201,168,76,0.15)] scale-[1.02]' : 'border-border'} flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:border-gold cursor-pointer group`} onClick={() => onDrillDown('Employee', {name: rep.name, role: 'Sales'})}>
                      {rep.isMe && <div className="absolute top-0 right-0 bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-md tracking-widest">YOU</div>}
                      
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <div className="relative">
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${idx === 0 ? 'border-amber-500 text-amber-500 bg-amber-500/10' : idx === 1 ? 'border-slate-300 text-slate-300 bg-slate-100/10' : idx === 2 ? 'border-amber-700 text-amber-700 bg-amber-700/10' : 'border-border text-white bg-panel'}`}>
                                 {idx === 0 ? <Trophy className="w-5 h-5"/> : rep.avatar}
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-charcoal border border-border rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">#{idx + 1}</div>
                            </div>
                            <div>
                               <span className={`font-bold text-lg block group-hover:text-gold transition-colors ${rep.isMe ? 'text-gold' : 'text-white'}`}>{rep.name}</span>
                               <span className="text-[10px] uppercase tracking-widest font-mono text-text-dim">Pacing: {rep.gross} Backend</span>
                            </div>
                         </div>
                         <div className="text-right flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                               <div className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded flex items-center gap-1 ${getTierColor(rep.curTier)}`}>
                                  {getTierIcon(rep.curTier)} {rep.curTier} Tier
                               </div>
                            </div>
                            <div>
                               <div className="font-playfair font-bold text-white text-3xl group-hover:scale-110 transition-transform origin-right">{rep.units} <span className="text-sm font-sans font-normal text-text-muted">Units</span></div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-2 bg-panel p-3 rounded border border-border border-dashed">
                         <div className="flex justify-between text-xs mb-2 font-mono tracking-widest uppercase">
                            <span className="text-text-muted">Next Status: <span className="text-white font-bold">{rep.nextTier}</span></span>
                            <span className="text-gold font-bold">{rep.target - rep.units} units to unlock</span>
                         </div>
                         <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-border">
                            <div className={`h-full rounded-full transition-all duration-1000 ${rep.isMe ? 'bg-gradient-to-r from-gold-dim to-gold shadow-[0_0_10px_rgba(201,168,76,0.8)]' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (rep.units / rep.target) * 100)}%`}}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           </div>

           {/* Metrics & Performance Matrix */}
           <div className="bg-charcoal border border-border rounded shadow-lg overflow-hidden">
               <div className="p-5 border-b border-border bg-black/50 text-xs font-mono uppercase tracking-widest text-text-muted flex justify-between items-center">
                  <span><Activity className="w-4 h-4 inline mr-2"/> Copilot Deal Desk Analytics</span>
                  <button className="text-gold hover:text-white transition-colors" onClick={() => onDrillDown('Report', {name: "Full Pacing Ledger"})}>View Ledger</button>
               </div>
               <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black p-4 rounded border border-border text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', {name: "Deep Dive: F&I Penetration"})}>
                     <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">F&I Turnover</div>
                     <div className="text-2xl font-bold text-white group-hover:text-gold transition-colors">84%</div>
                     <div className="text-[9px] text-green-500 uppercase font-bold tracking-widest mt-1">+12% vs Store</div>
                  </div>
                  <div className="bg-black p-4 rounded border border-border text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', {name: "Deep Dive: Warranty Attach"})}>
                     <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">Warranty Attach</div>
                     <div className="text-2xl font-bold text-white group-hover:text-gold transition-colors">42%</div>
                     <div className="text-[9px] text-red-400 uppercase font-bold tracking-widest mt-1">-5% vs Store</div>
                  </div>
                  <div className="bg-black p-4 rounded border border-border text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', {name: "Deep Dive: Trade Capture"})}>
                     <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">Trade Capture</div>
                     <div className="text-2xl font-bold text-white group-hover:text-gold transition-colors">31%</div>
                     <div className="text-[9px] text-green-500 uppercase font-bold tracking-widest mt-1">Target: 25%</div>
                  </div>
                  <div className="bg-black p-4 rounded border border-border text-center hover:border-gold transition-colors cursor-pointer group" onClick={() => onDrillDown('Action', {name: "Deep Dive: Avg Gross"})}>
                     <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-2">Avg Gross / Unit</div>
                     <div className="text-2xl font-bold text-white group-hover:text-gold transition-colors">$2,140</div>
                     <div className="text-[9px] text-text-dim uppercase font-bold tracking-widest mt-1">Front & Back</div>
                  </div>
               </div>
           </div>
         </div>

         {/* RIGHT COLUMN: AI Coaching & Training */}
         <div className="space-y-6">
           
           {/* Copilot Coaching Hub */}
           <div className="bg-black border border-border rounded-lg p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all"></div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-border/50 pb-2 relative z-10"><BrainCircuit className="w-5 h-5 text-gold"/> Strategic Coaching</h4>
              
              <div className="space-y-4 relative z-10">
                 <div className="bg-panel border-l-4 border-amber-500 p-4 rounded-lg cursor-pointer hover:bg-charcoal transition-colors group/card" onClick={() => onDrillDown('AgentRecommendation', {name: "Warranty Pitch Training"})}>
                    <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Leak Detected</div>
                    <div className="text-sm font-bold text-white group-hover/card:text-gold transition-colors">Improve Extended Warranty Attach Rate</div>
                    <div className="text-xs text-text-muted mt-2 leading-relaxed">Your warranty penetration has dropped below store average. Missing $420 in back-end gross per deal.</div>
                    <button className="mt-3 text-[10px] bg-charcoal border border-border text-white px-3 py-1.5 rounded uppercase tracking-widest w-full hover:bg-gold hover:text-black transition-colors">View AI Recommended Talk Track</button>
                 </div>

                 <div className="bg-panel border-l-4 border-green-500 p-4 rounded-lg cursor-pointer hover:bg-charcoal transition-colors group/card" onClick={() => onDrillDown('Action', {name: "Claim Internet Lead Queue"})}>
                    <div className="text-[10px] text-green-500 font-mono tracking-widest uppercase mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Opportunity</div>
                    <div className="text-sm font-bold text-white group-hover/card:text-gold transition-colors">Claim High-Intent BDC Leads</div>
                    <div className="text-xs text-text-muted mt-2 leading-relaxed">Your closing ratio on UTVs is top tier. The BDC has 3 aging UTV leads routing to round-robin in 1 hour.</div>
                    <button className="mt-3 text-[10px] bg-green-900/40 border border-green-500/50 text-green-500 px-3 py-1.5 rounded uppercase tracking-widest w-full font-bold hover:bg-green-500 hover:text-black transition-colors">Claim Leads Now</button>
                 </div>
              </div>
           </div>

           {/* Micro-Learning & Certifications */}
           <div className="bg-charcoal border border-border rounded shadow-lg overflow-hidden">
             <div className="p-5 border-b border-border bg-black/50 flex justify-between items-center">
               <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-400"/> Micro-Certifications</h2>
             </div>
             <div className="p-5 space-y-3">
                 <div className="flex items-center justify-between p-3 bg-black border border-border rounded cursor-pointer hover:border-blue-500 transition-colors group" onClick={() => onDrillDown('Action', {name: "Launch Yamaha Product Video"})}>
                    <div className="flex items-center gap-3">
                       <PlayCircle className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform"/>
                       <div>
                          <div className="text-sm font-bold text-white">2025 Yamaha R1 Walkaround</div>
                          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">3 Mins ΓÇó Due Tomorrow</div>
                       </div>
                    </div>
                    <div className="text-xs font-bold text-gold">+10 Pts</div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-panel border border-border rounded opacity-60">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-8 h-8 text-green-500"/>
                       <div>
                          <div className="text-sm font-bold text-white line-through">Dealership Safety Protocol</div>
                          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Completed Jan 12th</div>
                       </div>
                    </div>
                    <div className="text-xs font-bold text-text-dim">Done</div>
                 </div>
                 
                 <div className="flex items-center justify-between p-3 bg-panel border border-border rounded opacity-60">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-8 h-8 text-green-500"/>
                       <div>
                          <div className="text-sm font-bold text-white line-through">Polaris Off-Road Sales Tactics</div>
                          <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Completed Feb 5th</div>
                       </div>
                    </div>
                    <div className="text-xs font-bold text-text-dim">Done</div>
                 </div>
             </div>
             
             <button className="w-full bg-black hover:bg-panel text-text-muted hover:text-white transition-colors p-3 text-xs font-bold uppercase tracking-widest border-t border-border" onClick={() => onDrillDown('Action', {name: "Open Learning Management Library"})}>
                 View Complete Library
             </button>
           </div>

         </div>
       </div>
    </div>
  );
};

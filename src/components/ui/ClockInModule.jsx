import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronRight, Calendar as CalendarIcon, FileBarChart, ShieldAlert, Award, AlertCircle, AlertTriangle, Fingerprint } from 'lucide-react';
import { DrillDownValue } from './DrillDownValue';

export const ClockInModule = ({ user, onDrillDown }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [time, setTime] = useState(new Date());
  const [pinEntry, setPinEntry] = useState('');
  const [showPinPad, setShowPinPad] = useState(false);
  const [activeTab, setActiveTab] = useState('Timecard');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePinAuth = () => {
    if (pinEntry.length === 4) {
       setClockedIn(!clockedIn);
       setShowPinPad(false);
       setPinEntry('');
    }
  };

  const schedule = [
    { day: 'Monday (Today)', shift: '9:00 AM - 6:00 PM', role: 'Sales Floor', status: 'On Shift' },
    { day: 'Tuesday', shift: '9:00 AM - 6:00 PM', role: 'Sales Floor', status: 'Scheduled' },
    { day: 'Wednesday', shift: '11:00 AM - 8:00 PM', role: 'Internet Lead Team', status: 'Scheduled' },
    { day: 'Thursday', shift: 'Off', role: '-', status: '-' },
    { day: 'Friday', shift: '9:00 AM - 6:00 PM', role: 'Sales Floor', status: 'Scheduled' },
    { day: 'Saturday', shift: '9:00 AM - 7:00 PM', role: 'Weekend Blast', status: 'Scheduled' },
  ];

  const recentPunches = [
    { date: 'Today, Mar 18', in: '8:55 AM', out: '-', meal: '-', total: '4h 12m', status: 'Active' },
    { date: 'Yesterday, Mar 17', in: '8:58 AM', out: '6:12 PM', meal: '45m', total: '8h 29m', status: 'Auto-Approved' },
    { date: 'Saturday, Mar 15', in: '8:50 AM', out: '7:15 PM', meal: '60m', total: '9h 25m', status: 'Auto-Approved' },
    { date: 'Friday, Mar 14', in: '8:45 AM', out: '6:02 PM', meal: '55m', total: '8h 22m', status: 'Auto-Approved' },
  ];

  const ptoBanks = [
    { type: 'Vacation', accrued: 48, requested: 16, remaining: 32 },
    { type: 'Sick Time', accrued: 24, requested: 0, remaining: 24 },
    { type: 'Floating Holiday', accrued: 8, requested: 0, remaining: 8 }
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center bg-charcoal p-4 rounded border border-border">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-border rounded flex items-center justify-center text-gold shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair text-white">Employee Portal & HR</h1>
              <p className="text-text-muted text-sm border-l-2 border-gold pl-2 ml-1">Time & Attendance, PTO, & Schedules</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
        
        {/* LEFT COLLUMN: TIMECLOCK WIDGET */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-charcoal border border-border rounded p-6 text-center shadow-inner relative flex flex-col justify-center min-h-[350px]">
              <div className="absolute top-4 right-4 cursor-pointer" onClick={() => onDrillDown('Action', { name: "Audit Trail", message: "Viewing IP / Geofence history for terminal..." })}>
                 <ShieldAlert className="w-4 h-4 text-text-muted hover:text-white transition-colors" />
              </div>
              <h1 className="text-4xl font-mono text-white mb-2 pb-6 border-b border-border">
                {time.toLocaleTimeString()}
              </h1>
              
              <div className="py-4">
                <div className="w-16 h-16 bg-panel border-2 border-gold rounded-full flex items-center justify-center text-xl font-bold text-gold mx-auto mb-3 cursor-pointer" onClick={() => onDrillDown('Employee', { name: user?.name, role: user?.role })}>
                  {user?.avatar}
                </div>
                <h2 className="text-lg font-bold text-white hover:text-gold cursor-pointer transition-colors" onClick={() => onDrillDown('Employee', { name: user?.name, role: user?.role })}>{user?.name}</h2>
                <p className="text-text-muted text-xs font-mono">{user?.role} · <DrillDownValue value="ID: EMP-1904" label="HR Profile" type="Report" onDrillDown={onDrillDown} color="hover:text-white" /></p>
              </div>
              
              <div className="bg-black rounded border border-border p-3 mb-6 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors group" onClick={() => onDrillDown('Report', { name: "Live Terminal Status" })}>
                {clockedIn ? 
                  <><span className="text-green-500 font-bold flex items-center gap-1 text-sm"><CheckCircle2 className="w-4 h-4"/> Clocked In</span><div className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-mono"><DrillDownValue value="Active Shift: 4h 12m" type="Report" onDrillDown={onDrillDown} color="group-hover:text-gold" /></div></> : 
                  <><span className="text-text-muted font-bold text-sm">Not Clocked In</span></>
                }
              </div>

              {!showPinPad ? (
                <button 
                  onClick={() => setShowPinPad(true)}
                  className={`w-full py-3 border border-border rounded text-sm font-bold transition-all flex items-center justify-center gap-2 ${clockedIn ? 'bg-red-900/40 text-red-500 hover:text-white hover:border-red-500 hover:bg-red-900 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-gold hover:bg-gold-light text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]'}`}
                >
                  <Fingerprint className="w-4 h-4" /> {clockedIn ? 'PUNCH OUT' : 'PUNCH IN'}
                </button>
              ) : (
                <div className="bg-black p-4 border border-border rounded animate-fade-in text-left">
                   <div className="text-xs text-text-muted font-mono uppercase tracking-widest mb-3 text-center">Verify Identity</div>
                   <input 
                      type="password" 
                      value={pinEntry}
                      onChange={(e) => setPinEntry(e.target.value)}
                      placeholder="Enter 4-Digit PIN" 
                      className="w-full bg-charcoal border border-border rounded text-center text-2xl font-mono text-white tracking-[0.5em] py-2 focus:border-gold focus:outline-none mb-3"
                      maxLength={4}
                      autoFocus
                   />
                   <div className="flex gap-2">
                     <button className="flex-1 bg-panel border border-border text-text-muted text-xs py-2 rounded hover:text-white" onClick={() => { setShowPinPad(false); setPinEntry(''); }}>Cancel</button>
                     <button className={`flex-1 text-black font-bold text-xs py-2 rounded ${pinEntry.length === 4 ? 'bg-gold hover:bg-gold-light' : 'bg-gold-dim opacity-50 cursor-not-allowed'}`} disabled={pinEntry.length !== 4} onClick={handlePinAuth}>Authorize</button>
                   </div>
                </div>
              )}
           </div>

           <div className="bg-charcoal border border-border rounded p-4 shadow-inner cursor-pointer hover:border-red-500 transition-colors group" onClick={() => onDrillDown('Report', { name: "Overtime Risk Ledger" })}>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Approaching OT</div>
              <div className="text-sm text-text-muted bg-black p-2 border border-border rounded text-center font-mono">
                <span className="text-amber-500"><DrillDownValue value="38.5 hrs" label="Current Week Pay Period" type="Financials" onDrillDown={onDrillDown} color="group-hover:text-red-500 transition-colors" /></span> / 40.0 hrs
              </div>
           </div>
        </div>

        {/* RIGHT COLLUMN: TABS AND DATA */}
        <div className="lg:col-span-3 bg-charcoal border border-border rounded shadow-inner flex flex-col overflow-hidden">
           
           <div className="flex gap-4 border-b border-border bg-black px-4 overflow-x-auto subtle-scrollbar">
             {['Timecard', 'My Schedule', 'PTO / Benefits'].map(tab => (
                <button key={tab} className={`text-sm font-bold py-4 transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-white border-b-gold' : 'text-text-muted border-b-transparent hover:text-white'}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
             ))}
           </div>

           <div className="flex-1 overflow-y-auto subtle-scrollbar p-6">
              
              {/* TIMECARD VIEW */}
              {activeTab === 'Timecard' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <h3 className="font-playfair text-xl text-gold">Current Pay Period </h3>
                       <div className="bg-black px-3 py-1 rounded border border-border text-text-muted text-xs font-mono">Mar 10 - Mar 24</div>
                    </div>
                    
                    <div className="overflow-x-auto rounded border border-border bg-black">
                       <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-black border-b border-border font-mono text-[10px] uppercase tracking-widest text-text-muted">
                             <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">In</th>
                                <th className="px-4 py-3">Out</th>
                                <th className="px-4 py-3">Meal Break</th>
                                <th className="px-4 py-3 font-bold text-white">Daily Total</th>
                                <th className="px-4 py-3 text-right">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                              {recentPunches.map((p, i) => (
                                <tr key={i} className="hover:bg-panel transition-colors cursor-pointer group" onClick={() => onDrillDown('Report', { name: "Raw Punch Metadata", date: p.date, total: p.total })}>
                                   <td className="px-4 py-4 text-white font-bold"><DrillDownValue value={p.date} type="Report" onDrillDown={onDrillDown} color="group-hover:text-gold" /></td>
                                   <td className="px-4 py-4 font-mono text-text-dim"><DrillDownValue value={p.in} label="IP Audit Log" type="Report" onDrillDown={onDrillDown} /></td>
                                   <td className="px-4 py-4 font-mono text-text-dim"><DrillDownValue value={p.out} label="IP Audit Log" type="Report" onDrillDown={onDrillDown} /></td>
                                   <td className="px-4 py-4 text-xs text-text-muted">{p.meal}</td>
                                   <td className="px-4 py-4 text-gold font-bold font-mono text-md"><DrillDownValue value={p.total} label="Daily Shift Calculation" type="Financials" onDrillDown={onDrillDown} /></td>
                                   <td className="px-4 py-4 text-right">
                                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${p.status === 'Active' ? 'text-green-500 border-green-500/30' : 'text-blue-400 border-blue-400/30'}`}>
                                        {p.status}
                                      </span>
                                   </td>
                                </tr>
                              ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {/* SCHEDULE VIEW */}
              {activeTab === 'My Schedule' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-playfair text-xl text-gold">Weekly Roster</h3>
                       <button className="text-xs bg-panel border border-border px-3 py-1.5 rounded hover:text-white transition-colors flex items-center gap-2" onClick={() => onDrillDown('Action', { name: 'Request Shift Coverage' })}>
                         Request Coverage <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                       {schedule.map((shift, i) => (
                          <div key={i} className={`bg-black border p-4 rounded cursor-pointer transition-colors group ${shift.status === 'On Shift' ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : shift.shift === 'Off' ? 'border-border/50 opacity-60' : 'border-border hover:border-gold'}`} onClick={() => onDrillDown('Report', { name: `Schedule Segment: ${shift.day}`})}>
                             <div className="flex justify-between items-center mb-3">
                                <div className={`font-bold text-sm ${shift.status === 'On Shift' ? 'text-green-500' : 'text-white'}`}>{shift.day}</div>
                                {shift.shift !== 'Off' && <div className="text-[10px] text-text-muted font-mono bg-panel px-2 py-0.5 rounded border border-border">SHIFT-{8100 + i}</div>}
                             </div>
                             <div className="text-lg font-playfair text-white mb-2 group-hover:text-gold transition-colors">
                                <DrillDownValue value={shift.shift} label="Shift Matrix" type="Report" onDrillDown={onDrillDown} color={shift.status === 'On Shift' ? 'text-green-400' : ''} />
                             </div>
                             <div className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center justify-between">
                               <span><DrillDownValue value={shift.role} label="Zone Assignment" type="Report" onDrillDown={onDrillDown} /></span>
                               {shift.shift !== 'Off' && (
                                   <span className={`w-2 h-2 rounded-full ${shift.status === 'On Shift' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                               )}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* PTO VIEW */}
              {activeTab === 'PTO / Benefits' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-playfair text-xl text-gold">Time Off Balances</h3>
                       <button className="text-xs bg-gold hover:bg-gold-light font-bold text-black border border-gold px-3 py-1.5 rounded transition-colors" onClick={() => onDrillDown('Action', { name: 'Submit Time Off Request' })}>
                         + Request Time Off
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                       {ptoBanks.map((pto, i) => (
                          <div key={i} className="bg-black border border-border rounded p-4 text-center cursor-pointer hover:border-blue-500 transition-colors group" onClick={() => onDrillDown('Report', { name: `${pto.type} Accrual Ledger` })}>
                             <div className="text-[10px] uppercase tracking-widest font-mono text-blue-500 mb-2">{pto.type}</div>
                             <div className="text-3xl font-playfair text-white mb-2 group-hover:text-blue-400 transition-colors">
                                <DrillDownValue value={`${pto.remaining} hrs`} label="Remaining Balance" type="Financials" onDrillDown={onDrillDown} />
                             </div>
                             <div className="flex justify-between text-xs text-text-muted border-t border-border/50 pt-2 px-2 mt-4">
                                <span>Accrued: <span className="text-white"><DrillDownValue value={pto.accrued} type="Report" onDrillDown={onDrillDown} /></span></span>
                                <span>Pending: <span className="text-amber-500"><DrillDownValue value={pto.requested} type="Report" onDrillDown={onDrillDown} /></span></span>
                             </div>
                          </div>
                       ))}
                    </div>

                    <h3 className="font-playfair text-xl text-gold mb-4 border-t border-border pt-6">HR Documents & Compliance</h3>
                    <div className="space-y-3">
                       <div className="bg-black border border-border p-3 rounded flex justify-between items-center cursor-pointer hover:border-gold transition-colors" onClick={() => onDrillDown('Report', { name: 'Employee Handbook v4' })}>
                          <div className="flex items-center gap-3">
                             <FileBarChart className="w-4 h-4 text-text-muted" />
                             <div>
                                <div className="text-sm font-bold text-white"><DrillDownValue value="2025 Associate Handbook" type="Report" onDrillDown={onDrillDown} /></div>
                                <div className="text-[10px] text-text-dim mt-0.5">Acknowledged: Jan 12, 2025</div>
                             </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                       </div>
                       
                       <div className="bg-black border border-amber-500/30 p-3 rounded flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors group" onClick={() => onDrillDown('Action', { name: 'Complete Cybsersecurity Training' })}>
                          <div className="flex items-center gap-3">
                             <ShieldAlert className="w-4 h-4 text-amber-500" />
                             <div>
                                <div className="text-sm font-bold text-white"><DrillDownValue value="Q1 Dealership Cybersecurity Module" type="Action" onDrillDown={onDrillDown} color="group-hover:text-amber-400" /></div>
                                <div className="text-[10px] text-amber-500 mt-0.5">Due in 4 days</div>
                             </div>
                          </div>
                          <button className="text-[10px] uppercase font-bold tracking-widest text-amber-500 border border-amber-500/50 px-2 py-1 rounded bg-amber-900/10">Start</button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

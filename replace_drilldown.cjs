const fs = require('fs');
const file = 'src/components/ui/DrillDownModal.jsx';
let content = fs.readFileSync(file, 'utf8');

const newForm = `
                    {/* CRM Quick-Log Form */}
                    <div className="bg-charcoal border border-border rounded p-5 shadow-inner relative overflow-hidden group mb-6">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-gold/10 transition-colors"></div>
                       <h4 className="text-gold text-xs uppercase tracking-widest font-mono mb-4 flex items-center gap-2 border-b border-border/50 pb-2"><CheckCircle2 className="w-4 h-4" /> Quick-Log Interaction</h4>
                       <div className="flex flex-col md:flex-row gap-3 relative z-10">
                          <select className="bg-black border border-border text-white px-3 py-2.5 rounded text-xs focus:border-gold outline-none w-full md:w-auto font-bold tracking-wide cursor-pointer text-center md:text-left">
                             <option>Outbound Call</option>
                             <option>Inbound Call</option>
                             <option>Sent Text Message</option>
                             <option>Showroom Visit (Walk-In)</option>
                             <option>Sent Email</option>
                          </select>
                          <input type="text" placeholder="Interaction notes..." className="flex-1 bg-black border border-border text-white px-3 py-2.5 rounded text-xs focus:border-gold outline-none placeholder:text-text-muted/50" />
                          <button className="bg-gold hover:bg-gold-light text-black font-bold px-6 py-2.5 rounded shadow-[0_0_15px_rgba(201,168,76,0.2)] text-xs uppercase tracking-wider transition-all whitespace-nowrap" onClick={(e) => { e.stopPropagation(); onDrillDown('Action', { name: "Save Activity Log", message: "Writing interaction strictly to Customer Timeline." }); }}>Log Activity</button>
                       </div>
                    </div>

                    <div className="flex gap-2 border-b border-border pb-4 mt-2">
                      <button className="bg-panel border border-border text-white px-4 py-2 rounded text-xs font-bold hover:bg-black transition-colors" onClick={() => onDrillDown('Action', {name: 'Send SMS', message: 'Opening SMS composer...'})}>Send SMS / Email</button>
                      <button className="bg-charcoal border border-border text-white px-4 py-2 rounded text-xs font-bold hover:border-gold transition-colors ml-auto flex items-center gap-1" onClick={() => onDrillDown('Quote_Workbench', {customerId: crmData.customer.id})}><FileBarChart className="w-3 h-3"/> Build Quote</button>
                    </div>`;

const searchStr = "onClick={() => onDrillDown('Action', {name: 'Send SMS', message: 'Opening SMS composer...'})}>Send SMS / Email</button>";
const pos1 = content.indexOf(searchStr);

if (pos1 !== -1) {
    const startDiv = '<div className="flex gap-2 border-b border-border pb-4">';
    const startPos = content.lastIndexOf(startDiv, pos1);
    const endDiv = '</div>';
    const endPos = content.indexOf(endDiv, pos1) + endDiv.length;

    if (startPos !== -1 && endPos !== -1 && startPos < pos1) {
        const toReplace = content.substring(startPos, endPos);
        content = content.replace(toReplace, newForm);
        fs.writeFileSync(file, content);
        console.log("Success");
    } else {
        console.log("Failed to find bounds of the div.");
    }
} else {
    console.log("Failed to find unique string.");
}

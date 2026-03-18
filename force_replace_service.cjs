const fs = require('fs');
const file = 'c:/dev/github/business/FriendlyPowerSports/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const isCRLF = content.includes('\r\n');
let lines = content.split(isCRLF ? '\r\n' : '\n');

for (let i = 780; i < 920; i++) {
    if (!lines[i]) continue;
    
    // Retention
    if (lines[i].includes('18 Customers')) {
        lines[i] = lines[i].replace('18 Customers', '<DrillDownValue value="18 Customers" label="Saved MTD" type="Report" onDrillDown={onDrillDown} color="text-green-500" />');
    }
    
    // Tech Efficiency block
    if (lines[i].includes('>Tony G.<')) lines[i] = lines[i].replace('>Tony G.<', '><DrillDownValue value="Tony G." label="Employee Profile" type="Employee" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" /><');
    if (lines[i].includes('>104% (42h / 40h)<')) lines[i] = lines[i].replace('>104% (42h / 40h)<', '><DrillDownValue value="104% (42h / 40h)" label="Labor Efficiency" type="Report" onDrillDown={onDrillDown} color="text-green-500" /><');
    
    if (lines[i].includes('>Chris F.<')) lines[i] = lines[i].replace('>Chris F.<', '><DrillDownValue value="Chris F." label="Employee Profile" type="Employee" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" /><');
    if (lines[i].includes('>92% (35h / 38h)<')) lines[i] = lines[i].replace('>92% (35h / 38h)<', '><DrillDownValue value="92% (35h / 38h)" label="Labor Efficiency" type="Report" onDrillDown={onDrillDown} color="text-gold" /><');
    
    if (lines[i].includes('>Sam L.<')) lines[i] = lines[i].replace('>Sam L.<', '><DrillDownValue value="Sam L." label="Employee Profile" type="Employee" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" /><');
    if (lines[i].includes('>71% (27h / 38h)<')) lines[i] = lines[i].replace('>71% (27h / 38h)<', '><DrillDownValue value="71% (27h / 38h)" label="Labor Efficiency" type="Report" onDrillDown={onDrillDown} color="text-red-500" /><');

    // Fixed Ops Gross
    if (lines[i].includes('Labor: <span className="text-white">$89k</span>')) {
        lines[i] = lines[i].replace('$89k', '<DrillDownValue value="$89k" label="Labor Ledger" type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" />');
    }
    if (lines[i].includes('Parts: <span className="text-white">$99k</span>')) {
        lines[i] = lines[i].replace('$99k', '<DrillDownValue value="$99k" label="Parts Ledger" type="Report" onDrillDown={onDrillDown} color="text-white hover:text-gold transition-colors" />');
    }
    
    // Inventory
    if (lines[i].includes('>Obsolete (&gt;12mo):')) {
        lines[i] = lines[i].replace('$18k', '<DrillDownValue value="$18k" label="Obsolete Inventory" type="Report" onDrillDown={onDrillDown} color="text-red-500 hover:text-white transition-colors" />');
    }

    // Live Service Bay Tracker
    if (lines[i].includes('>{colOrders.length}<')) {
        lines[i] = lines[i].replace('>{colOrders.length}<', '><DrillDownValue value={colOrders.length} label={`${statusFilter} Volume`} type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" /><');
    }
    
    if (lines[i].includes('>{ro.unitDesc}<')) {
        lines[i] = lines[i].replace('>{ro.unitDesc}<', '><DrillDownValue value={ro.unitDesc} label="Unit Details" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-blue-400 transition-colors line-clamp-1 block" /><');
    }
    
    if (lines[i].includes('{ro.techName}')) {
        lines[i] = lines[i].replace('{ro.techName}', '<DrillDownValue value={ro.techName} label="Technician Profile" type="Employee" onDrillDown={onDrillDown} color="text-text-dim hover:text-white transition-colors" />');
    }
    
    if (lines[i].includes('${((ro.partsSale||0) + ((ro.laborHoursSold||0) * 125)).toLocaleString()}')) {
        lines[i] = lines[i].replace(
            '${((ro.partsSale||0) + ((ro.laborHoursSold||0) * 125)).toLocaleString()}',
            '<DrillDownValue value={`$${((ro.partsSale||0) + ((ro.laborHoursSold||0) * 125)).toLocaleString()}`} label="RO Margin" type="Report" onDrillDown={onDrillDown} color="text-green-500 hover:text-white transition-colors" />'
        );
    }
}

fs.writeFileSync(file, lines.join(isCRLF ? '\r\n' : '\n'));
console.log('Service Extracted and Replaced Successfully!');

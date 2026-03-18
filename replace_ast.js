const fs = require('fs');
const file = 'c:/dev/github/business/FriendlyPowerSports/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Sales Dash
content = content.replace(
    '<div className="text-4xl text-white font-playfair">{db.responseTimesAvg}</div>',
    '<div className="text-4xl text-white font-playfair"><DrillDownValue value={db.responseTimesAvg} label="Avg First Response" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);

content = content.replace(
    '<div className="text-4xl text-white font-playfair">{db.lostCount}</div>',
    '<div className="text-4xl text-white font-playfair"><DrillDownValue value={db.lostCount} label="Lost Deals" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);

// Finance Dash
content = content.replace(
    /<div className="text-white text-sm font-bold group-hover:text-gold transition-colors">\{row\.type\}<\/div>/g,
    '<div className="text-white text-sm font-bold group-hover:text-gold transition-colors"><DrillDownValue value={row.type} label="Context" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);

content = content.replace(
    /<div className="text-\[10px\] text-text-muted uppercase font-mono tracking-wide">\{row\.customer\} • \{row\.ago\}<\/div>/g,
    '<div className="text-[10px] text-text-muted uppercase font-mono tracking-wide"><DrillDownValue value={`${row.customer} • ${row.ago}`} label="Customer Record" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" /></div>'
);

content = content.replace(
    /<span className={`\$\{row\.color\} border border-current px-2 py-0\.5 rounded text-\[10px\] font-bold tracking-widest`}>\{row\.status\}<\/span>/g,
    '<span className={`${row.color} border border-current px-2 py-0.5 rounded text-[10px] font-bold tracking-widest`}><DrillDownValue value={row.status} label="Review Status" type="Report" onDrillDown={onDrillDown} color={row.color} /></span>'
);

fs.writeFileSync(file, content);
console.log('App.jsx Replaced Successfully');

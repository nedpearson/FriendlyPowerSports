const fs = require('fs');
const file = 'c:/dev/github/business/FriendlyPowerSports/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

let count = 0;

content = content.replace(
    '{db.responseTimesAvg}</div>',
    '<DrillDownValue value={db.responseTimesAvg} label="Avg First Response" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);
content = content.replace(
    '{db.lostCount}</div>',
    '<DrillDownValue value={db.lostCount} label="Lost Deals" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);

content = content.replace(
    /\{row\.type\}<\/div>/g,
    '<DrillDownValue value={row.type} label="Context" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" /></div>'
);

content = content.replace(
    /\{row\.customer\} • \{row\.ago\}<\/div>/g,
    '<DrillDownValue value={`${row.customer} • ${row.ago}`} label="Customer Record" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" /></div>'
);

content = content.replace(
    /\{row\.status\}<\/span>/g,
    '<DrillDownValue value={row.status} label="Review Status" type="Report" onDrillDown={onDrillDown} color="text-white" /></span>'
);

fs.writeFileSync(file, content);
console.log('AST Replaced Successfully!');

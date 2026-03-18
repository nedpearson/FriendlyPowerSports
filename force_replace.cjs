const fs = require('fs');
const file = 'c:/dev/github/business/FriendlyPowerSports/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The file might use \r\n, so we normalize to \n for splitting, then join back with \n
const isCRLF = content.includes('\r\n');
let lines = content.split(isCRLF ? '\r\n' : '\n');

// Update Sales Dash Lines
for (let i = 1680; i < 1720; i++) {
    if (lines[i] && lines[i].includes('{db.responseTimesAvg}')) {
        lines[i] = lines[i].replace('{db.responseTimesAvg}', '<DrillDownValue value={db.responseTimesAvg} label="Avg First Response" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" />');
    }
    if (lines[i] && lines[i].includes('{db.lostCount}')) {
        lines[i] = lines[i].replace('{db.lostCount}', '<DrillDownValue value={db.lostCount} label="Lost Deals" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" />');
    }
}

// Update Finance Dash Lines
for (let i = 1810; i < 1850; i++) {
    if (lines[i] && lines[i].includes('{row.type}')) {
        lines[i] = lines[i].replace('{row.type}', '<DrillDownValue value={row.type} label="Context" type="Report" onDrillDown={onDrillDown} color="text-white group-hover:text-gold transition-colors" />');
    }
    if (lines[i] && lines[i].includes('{row.customer} • {row.ago}')) {
        lines[i] = lines[i].replace('{row.customer} • {row.ago}', '<DrillDownValue value={`${row.customer} • ${row.ago}`} label="Customer Record" type="Report" onDrillDown={onDrillDown} color="text-text-muted hover:text-white transition-colors" />');
    }
    if (lines[i] && lines[i].includes('{row.status}')) {
        lines[i] = lines[i].replace('{row.status}', '<DrillDownValue value={row.status} label="Review Status" type="Report" onDrillDown={onDrillDown} color={row.color} />');
    }
}

fs.writeFileSync(file, lines.join(isCRLF ? '\r\n' : '\n'));
console.log('App.jsx Surgically Replaced!');

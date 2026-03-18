const fs = require('fs');
const content = fs.readFileSync('./src/App.jsx', 'utf8');
const lines = content.split('\n');

const missing = [];

lines.forEach((line, index) => {
    if (line.includes('onDrillDown') && (line.includes('<DrillDownValue') || line.includes('onClick={() => onDrillDown'))) {
        if (!line.includes('reportId')) {
            missing.push(`Line ${index + 1}: ${line.trim()}`);
        }
    }
});

console.log(`Found ${missing.length} unmapped drilldowns in App.jsx:`);
missing.forEach(m => console.log(m));

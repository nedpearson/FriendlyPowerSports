const fs = require('fs');
let lines = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8').split('\\n');

// Remove any line starting with "Total matched lines:"
lines = lines.filter(l => !l.includes('Total matched lines:'));

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', lines.join('\\n'));
console.log("Cleanup script completed!");

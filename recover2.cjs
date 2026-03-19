const fs = require('fs');
let content = fs.readFileSync('diag2_output.txt', 'utf8');

if (content.startsWith('Line 0: ')) {
    content = content.substring('Line 0: '.length);
}

// Remove the Total matched lines: 1 from the very end.
content = content.replace("Total matched lines: 1", "");

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', content);
console.log("File reliably recovered and stripped of diagnostics!");

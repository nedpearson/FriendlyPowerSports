const fs = require('fs');
const lines = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8').split('\\n');
let count = 0;
lines.forEach((l, i) => {
    if (l.includes("Lender")) {
        console.log("Line " + i + ": " + l.trim());
        count++;
    }
});
console.log("Total matched lines: " + count);

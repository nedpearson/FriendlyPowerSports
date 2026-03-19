const fs = require('fs');
const lines = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8').split('\\n');
let count = 0;
lines.forEach((l, i) => {
    if (l.includes("case 'Lender':")) {
        console.log("Found at line " + i + ": " + l.trim());
        count++;
    }
});
console.log("Total cases: " + count);

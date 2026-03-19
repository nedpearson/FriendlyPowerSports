const fs = require('fs');

let code = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8');
let lines = code.split('\\n');

function obliterateDuplicateFirst(lines, caseStr) {
    let firstIdx = -1;
    let lastIdx = -1;
    let target = "case '" + caseStr + "':";
    
    for(let i=0; i<lines.length; i++) {
        if(lines[i].includes(target)) {
            if(firstIdx === -1) firstIdx = i;
            lastIdx = i;
        }
    }
    
    if (firstIdx !== -1 && firstIdx !== lastIdx) {
        let endIdx = -1;
        for(let i=firstIdx + 1; i<lines.length; i++) {
            if(lines[i].includes('case ') || lines[i].includes('default:')) {
                endIdx = i;
                break;
            }
        }
        if(endIdx !== -1) {
            lines.splice(firstIdx, endIdx - firstIdx);
        }
    }
    return lines;
}

lines = obliterateDuplicateFirst(lines, 'Lender');
lines = obliterateDuplicateFirst(lines, 'CRM_Customer360');
lines = obliterateDuplicateFirst(lines, 'InventoryUnit');

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', lines.join('\\n'));
console.log("Cleanup script completed natively!");

const fs = require('fs');

let lines = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8').split('\\n');

function deleteBlock(keyword) {
    let startIdx = -1;
    for(let i=0; i<lines.length; i++) {
        if(lines[i].includes("case '" + keyword + "'")) {
            startIdx = i;
            break;
        }
    }
    if (startIdx !== -1) {
        let endIdx = startIdx + 1;
        while(endIdx < lines.length) {
            if(lines[endIdx].includes("case '") || lines[endIdx].includes('default:')) {
                break;
            }
            endIdx++;
        }
        console.log("Deleting " + keyword + " from " + startIdx + " to " + (endIdx-1));
        lines.splice(startIdx, endIdx - startIdx);
    }
}

// Delete FIRST occurrences (the old ones)
deleteBlock('CRM_Customer360');
deleteBlock('Lender');
deleteBlock('InventoryUnit');

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', lines.join('\\n'));
console.log("Cleanup script completed natively!");

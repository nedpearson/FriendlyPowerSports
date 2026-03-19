const fs = require('fs');
let content = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8');

function cutBlock(keyword) {
    let target = "case '" + keyword + "':";
    let startIdx = content.indexOf(target);
    if (startIdx === -1) return;
    
    // Check if there is ANOTHER one later (meaning we only cut if it's duplicated)
    let lastIdx = content.lastIndexOf(target);
    if (startIdx === lastIdx) {
        console.log("Only one " + keyword + " found. Skipping.");
        return;
    }

    let endIdx1 = content.indexOf("case '", startIdx + 1);
    let endIdx2 = content.indexOf("default:", startIdx + 1);
    
    let endIdx = endIdx1;
    if (endIdx2 !== -1 && (endIdx1 === -1 || endIdx2 < endIdx1)) {
        endIdx = endIdx2;
    }
    
    if (endIdx !== -1) {
        console.log("Cutting " + keyword + " from " + startIdx + " to " + endIdx);
        content = content.substring(0, startIdx) + content.substring(endIdx);
    }
}

cutBlock('Lender');
cutBlock('CRM_Customer360');
cutBlock('InventoryUnit');

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', content);
console.log("Cleanup script completed!");

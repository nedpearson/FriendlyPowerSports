const fs = require('fs');
let content = fs.readFileSync('src/components/ui/DrillDownModal.jsx', 'utf8');

function renameOldBlock(keyword) {
    let target = "case '" + keyword + "':";
    let startIdx = content.indexOf(target);
    if (startIdx === -1) return;
    
    // Check if there is ANOTHER one later (meaning we only rename if duplicated)
    let lastIdx = content.lastIndexOf(target);
    if (startIdx === lastIdx) {
        console.log("Only one " + keyword + " found. Skipping.");
        return;
    }

    // Replace ONLY the first one with _RESTORED
    console.log("Renaming FIRST instance of " + keyword + " to prevent duplication.");
    content = content.substring(0, startIdx) + "case '" + keyword + "_LEGACY':" + content.substring(startIdx + target.length);
}

renameOldBlock('Lender');
renameOldBlock('CRM_Customer360');
renameOldBlock('InventoryUnit');

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', content);
console.log("Safely renamed duplicates!");

const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('c:/dev/github/business/FriendlyPowerSports/src', []);

const types = new Set();
const cases = new Set();

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Find all type="XYZ" inside DrillDownValue mappings
    const typeMatches = content.matchAll(/type=["']([^"']+)["']/g);
    for (const match of typeMatches) {
        // Simple heuristic: if it looks like a component instantiation
        if (content.includes('DrillDownValue') || content.includes(`onDrillDown(`)) {
            // Wait, to be safe, just look at explicitly named types in the file
            types.add(match[1]);
        }
    }

    // Find all cases in DrillDownModal
    if (file.includes('DrillDownModal')) {
        const caseMatches = content.matchAll(/case\s+["']([^"']+)["']:/g);
        for (const match of caseMatches) {
            cases.add(match[1]);
        }
    }
});

console.log("Found Types in App:", [...types]);
console.log("Mapped Cases in Modal:", [...cases]);

// We know some types like "button", "text", "checkbox", "email" etc will show up.
// Let's filter to capitalized types which are our domain models.
const domainTypes = [...types].filter(t => t[0] === t[0].toUpperCase() && !t.includes('text/') && !t.includes('application/'));

const missing = domainTypes.filter(t => !cases.has(t));
console.log("\nWARNING: Unmapped Domain Types (These will show the 'Unmapped' error screen if clicked):");
console.log(missing);

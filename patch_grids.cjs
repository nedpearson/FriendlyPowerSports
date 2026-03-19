const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

let changedFiles = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let newContent = content.replace(/className="([^"]*?)\bgrid-cols-([2-9])\b([^"]*?)"/g, (match, prefix, num, suffix) => {
     // If it already has grid-cols-1 or md:grid-cols or lg:grid-cols, we leave the original grid-cols-X alone to avoid conflicts.
     // Exception: "grid grid-cols-2 gap-4" which has no md: or lg:. We should make it grid-cols-1 md:grid-cols-2.
     
     if (prefix.includes('grid-cols-1') || suffix.includes('grid-cols-1')) return match;
     if (prefix.includes('md:grid-cols') || suffix.includes('md:grid-cols')) return match;
     if (prefix.includes('lg:grid-cols') || suffix.includes('lg:grid-cols')) return match;
     
     return `className="${prefix}grid-cols-1 md:grid-cols-${num}${suffix}"`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Processed all files. Changed ${changedFiles} files.`);

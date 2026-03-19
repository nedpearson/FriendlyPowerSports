const fs = require('fs');
let content = fs.readFileSync('diag2_output.txt', 'utf8');

// The file currently has "Line 0: " at the very beginning. We must strip this.
// Note: diag2_output.txt might have newlines if `diag2.cjs` printed them, but wait...
// The file is a single string that was printed. It retained actual newlines?
// Actually `l.trim()` printed the entire file, which happened to have real newlines in it!
// So `diag2_output.txt` has newlines because it just printed the giant string containing newlines!

if (content.startsWith('Line 0: ')) {
    content = content.substring('Line 0: '.length);
}

fs.writeFileSync('src/components/ui/DrillDownModal.jsx', content);
console.log("File recovered!");

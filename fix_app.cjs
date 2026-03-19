const fs = require('fs');
let text = fs.readFileSync('src/App.jsx', 'utf8');
text = text.replace(/\\n/g, '\n');
fs.writeFileSync('src/App.jsx', text);
console.log('Fixed newlines');

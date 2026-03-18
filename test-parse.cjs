const parser = require('@babel/parser');
const fs = require('fs');
try {
  parser.parse(fs.readFileSync('src/App.jsx', 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  console.log('SUCCESS: No JSX Syntax Errors');
} catch (e) {
  console.error('SYNTAX_ERROR:', e.message, 'Line:', e.loc.line, 'Col:', e.loc.column);
}

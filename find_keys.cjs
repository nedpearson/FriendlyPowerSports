const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

let out = '';
walk('src').forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    const lines = c.split('\n');
    lines.forEach((l, i) => {
        if (l.includes('.map(') && l.includes('<') && !l.includes('key={') && !l.includes('key=')) {
            out += `${f}:${i+1} => ${l.trim()}\n`;
        }
    });
});
fs.writeFileSync('missing_keys.txt', out);
console.log('Done scanning.');

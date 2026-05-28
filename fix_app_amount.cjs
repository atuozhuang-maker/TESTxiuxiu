const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/ma5/g, 'ma20');
code = code.replace(/近5日/g, '近20日');
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx!");

const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/secid=\\\$\{secid\}/g, 'secid=${secid}');
code = code.replace(/secid=\\\$\{etf\.id\}/g, 'secid=${etf.id}');

fs.writeFileSync('server.ts', code);
console.log("Fixed template variables in server.ts");

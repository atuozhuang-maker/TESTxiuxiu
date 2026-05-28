const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/\\`https:\/\/push2his/g, '`https://push2his');
code = code.replace(/250\\`/g, '250`');
code = code.replace(/30\\`/g, '30`');
code = code.replace(/20\\`/g, '20`');
fs.writeFileSync('server.ts', code);

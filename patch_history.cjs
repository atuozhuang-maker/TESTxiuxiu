const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/lmt=250/g, 'lmt=60');
code = code.replace(/for\s*\(let i=249;\s*i>=0;\s*i--\)/g, 'for(let i=59; i>=0; i--)');

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts history limit");

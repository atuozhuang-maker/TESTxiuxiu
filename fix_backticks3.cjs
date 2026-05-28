const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/klines\.push\(`\$\{d\.toISOString\(\)\.substring\(0,10\)\},\\?\$\{o\.toFixed\(2\)\},\\?\$\{c\.toFixed\(2\)\},\\?\$\{h\.toFixed\(2\)\},\\?\$\{l\.toFixed\(2\)\},200000,1000000\.0,1\.2,0\.5,10\.0,0\.8`\);/g, 
  "klines.push(`${d.toISOString().substring(0,10)},${o.toFixed(2)},${c.toFixed(2)},${h.toFixed(2)},${l.toFixed(2)},200000,1000000.0,1.2,0.5,10.0,0.8`);");

fs.writeFileSync('server.ts', code);

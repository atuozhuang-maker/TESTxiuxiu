const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/console\.log\("Mocking kline due to push2his failure:", e.message\);/g, '// console.log("Mocking kline due to push2his failure:", e.message);');
code = code.replace(/console\.log\("Mocking etf kline for", etf\.id\);/g, '// console.log("Mocking etf kline for", etf.id);');
code = code.replace(/console\.log\(`Failed to fetch historic kline for \$\{etf.name\}:`, e\);/g, '// console.log(`Failed to fetch historic kline for ${etf.name}:`, e);');
code = code.replace(/console\.log\("Mocking kline due to push2his failure:"\);/g, '');

fs.writeFileSync('server.ts', code);
console.log('Removed annoying mockup logs');

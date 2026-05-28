const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/console\.error\("Falling back to mock due to:", e\.message\);/g, '// suppressed');
code = code.replace(/console\.error\("Failed to fetch MA20 for", symbol, e\.message\);/g, '// suppressed');
code = code.replace(/console\.error\(`Failed to fetch historic kline for \$\{etf.name\}:`, e\);/g, '// suppressed');

fs.writeFileSync('server.ts', code);
console.log('Removed error logs');

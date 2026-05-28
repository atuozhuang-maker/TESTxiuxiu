const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'fields=f104,f105,f106"',
  'fields=f1,f2,f6,f104,f105,f106"'
);

code = code.replace(
  'const upRatio = total > 0 ? (upCount / total) : 0.5;',
  `const upRatio = total > 0 ? (upCount / total) : 0.5;
        
        let totalTurnover = 0;
        if (sh.f6 && sz.f6) {
          totalTurnover = Number(((sh.f6 + sz.f6) / 100000000).toFixed(0)); // Convert to 亿
        }`
);

// add to response
code = code.replace(
  'res.json({ success: true, data: { upCount, downCount, flatCount, upLimit, downLimit, index } });',
  'res.json({ success: true, data: { upCount, downCount, flatCount, upLimit, downLimit, index, totalTurnover } });'
);

fs.writeFileSync('server.ts', code);
console.log('Added totalTurnover to atmosphere API');

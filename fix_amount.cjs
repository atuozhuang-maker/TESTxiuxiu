const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const url = `https:\/\/push2his\.eastmoney\.com\/api\/qt\/stock\/kline\/get\?secid=\$\{secid\}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&end=20500101&lmt=5`;/g, 'const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&end=20500101&lmt=20`;');

code = code.replace(/\/\/ Mock 5 days klines\s+const klines = \[\];\s+let base = 3000;\s+if\(secid\.includes\('000300'\)\) base = 3500;\s+else if\(secid\.includes\('399006'\)\) base = 1800;\s+const now = new Date\(\);\s+for\(let i=4; i>=0; i--\) \{\s+let o = base \+ \(Math\.random\(\)-0\.5\)\*20;\s+let c = o \+ \(Math\.random\(\)-0\.1\)\*20;\s+let h = Math\.max\(o,c\) \+ Math\.random\(\)\*15;\s+let l = Math\.min\(o,c\) - Math\.random\(\)\*15;\s+const d = new Date\(now\.getTime\(\) - i\*24\*3600\*1000\);\s+klines\.push\(`\$\{d\.toISOString\(\)\.substring\(0,10\)\},\$\{o\.toFixed\(2\)\},\$\{c\.toFixed\(2\)\},\$\{h\.toFixed\(2\)\},\$\{l\.toFixed\(2\)\},200000,1000000\.0,1\.2,0\.5,10\.0,0\.8`\);\s+base = c;\s+\}/g,
`// Mock 20 days klines
                   const klines = [];
                   let base = parseFloat(data[3]) || 3000;
                   let baseAmount = parseFloat(data[9]) || 1500000000;
                   let baseVol = parseFloat(data[8]) || 5000000;
                   const now = new Date();
                   for(let i=19; i>=0; i--) {
                     let o = base + (Math.random()-0.5)*0.05;
                     let c = o + (Math.random()-0.1)*0.05;
                     let h = Math.max(o,c) + Math.random()*0.02;
                     let l = Math.min(o,c) - Math.random()*0.02;
                     let pseudoAmount = baseAmount * (0.8 + Math.random() * 0.4);
                     let pseudoVol = baseVol * (0.8 + Math.random() * 0.4);
                     // convert to volume string in terms of 手 (100 shares), actually EastMoney API volume is in hands
                     let pseudoHands = pseudoVol / 100;
                     const d = new Date(now.getTime() - i*24*3600*1000);
                     klines.push(\`\${d.toISOString().substring(0,10)},\${o.toFixed(3)},\${c.toFixed(3)},\${h.toFixed(3)},\${l.toFixed(3)},\${pseudoHands.toFixed(0)},\${pseudoAmount.toFixed(2)},1.2,0.5,10.0,0.8\`);
                     base = c;
                   }`);

code = code.replace(/ma5/g, 'ma20');
code = code.replace(/MA5/g, 'MA20');
fs.writeFileSync('server.ts', code);
console.log("Fixed amount mocked!");

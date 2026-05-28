const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ --- DYNAMIC SECTOR DATA \(MOCKED FOR DEMO\) ---[\s\S]*?\]\.sort\(\(a,\s*b\)\s*=>\s*b\.value\s*-\s*a\.value\);\s*\/\/\s*Sort descending for vertical bar chart to show lowest negative at top/;

const newCode = `  // --- DYNAMIC SECTOR DATA COMPUTED FROM ETFS ---
  const computedFlows = industryEtfs.map(q => {
    const change = q.price - q.prevClose;
    const isUp = change > 0;
    // rough heuristic: assume net flow correlates with volume & price diff
    const estimatedFlow = (isUp ? 1 : -1) * (q.amount * 0.15 * Math.abs(change/q.prevClose)) / 1000000;
    return { name: q.name.replace('ETF','').replace('联接',''), value: isNaN(estimatedFlow) ? 0 : Number(estimatedFlow.toFixed(2)) };
  }).sort((a,b) => b.value - a.value);

  let topInflowSectors = computedFlows.filter(s => s.value > 0).slice(0, 5).sort((a, b) => a.value - b.value);
  let topOutflowSectors = computedFlows.filter(s => s.value < 0).slice(-5).sort((a, b) => b.value - a.value);

  if (topInflowSectors.length === 0) topInflowSectors = [{ name: '暂无净流出数据', value: 0 }];
  if (topOutflowSectors.length === 0) topOutflowSectors = [{ name: '暂无净流入数据', value: 0 }];`;

if (code.match(regex)) {
  code = code.replace(regex, newCode);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx sector flows");
} else {
  console.log("Could not find mock data block to replace.");
}

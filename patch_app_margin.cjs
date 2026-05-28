const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// replace domain
app = app.replace(
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'dataMin - 15\', \'dataMax + 15\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />',
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'auto\', \'auto\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />'
);

// Format margin correctly since it is already in 亿 (around 15000), so we can format as w亿 or just 亿
// Example margin value: 15008 (亿) -> 1.50w亿
app = app.replace(
  '<YAxis yAxisId="margin" domain={[\'dataMin - 100\', \'dataMax + 100\']} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />',
  '<YAxis yAxisId="margin" domain={[\'auto\', \'auto\']} tickFormatter={(v) => `${(v/10000).toFixed(2)}万亿`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />'
);

fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx updated');

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetChart = `<ComposedChart data={orderFlowData.openClose.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />`;

const replacementChart = `<ComposedChart data={orderFlowData.openClose.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />`;

code = code.replace(targetChart, replacementChart);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed composed chart YAxis in App.tsx');

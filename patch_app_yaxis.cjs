const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The specific Line chart that has orderFlowData.orderSizes.history
// Target:
// <LineChart data={orderFlowData.orderSizes.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
//   <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
//   <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />

const targetChart = `<LineChart data={orderFlowData.orderSizes.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />`;
                             
const replacementChart = `<LineChart data={orderFlowData.orderSizes.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />`;

code = code.replace(targetChart, replacementChart);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed chart in App.tsx');

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change grid wrapper
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\n                 {/* Margin Data */}',
  '<div className="flex flex-col gap-6">\n                 {/* Margin Data */}'
);

// We should also remove lg:col-span-2 from Dragon Tiger List since it's no longer in a grid
code = code.replace(
  '<Card className="p-0 overflow-hidden flex flex-col lg:col-span-2 shadow-sm">',
  '<Card className="p-0 overflow-hidden flex flex-col shadow-sm">'
);

// Update YAxis for SH Index in margin data
code = code.replace(
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'dataMin - 100\', \'dataMax + 100\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />',
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'dataMin - 15\', \'dataMax + 15\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />'
);

// Remove strokeDasharray and make stroke width thicker for SH Index to make it clearer
code = code.replace(
  '<Line yAxisId="shIndex" type="monotone" dataKey="shIndex" name="上证指数(右轴)" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={2} dot={false} />',
  '<Line yAxisId="shIndex" type="monotone" dataKey="shIndex" name="上证指数(右轴)" stroke="#eab308" strokeWidth={3} dot={false} opacity={0.8} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Successfully updated App.tsx styles for margin chart and grid layout');

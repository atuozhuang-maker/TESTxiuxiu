const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<YAxis yAxisId="margin" domain=\{\['dataMin - 1000', 'dataMax \+ 1000'\]\} tickFormatter=\{\(v\) => `\$\{\(v\/10000\)\.toFixed\(2\)\}万亿`\} axisLine=\{false\} tickLine=\{false\} fontSize=\{10\} stroke="#ef4444" \/>/g,
  '<YAxis yAxisId="margin" domain={["auto", "auto"]} tickFormatter={(v) => `${(v/10000).toFixed(2)}万亿`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />'
);

code = code.replace(
  /<YAxis yAxisId="shIndex" orientation="right" domain=\{\['dataMin - 150', 'dataMax \+ 150'\]\} axisLine=\{false\} tickLine=\{false\} fontSize=\{10\} stroke="#f59e0b" \/>/g,
  '<YAxis yAxisId="shIndex" orientation="right" domain={["auto", "auto"]} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />'
);

code = code.replace(
  /<YAxis yAxisId="net" orientation="right" domain=\{\['dataMin - 50', 'dataMax \+ 100'\]\} hide \/>/g,
  '<YAxis yAxisId="net" orientation="right" domain={["auto", "auto"]} hide />'
);

code = code.replace(
  /<ComposedChart data=\{marginData\} margin=\{\{ top: 10, right: 10, left: 0, bottom: 0 \}\}>/g,
  '<ComposedChart data={marginData.slice(-30)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed margin chart domains');

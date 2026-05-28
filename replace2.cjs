const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<ComposedChart data=\{marginData\} margin=\{\{ top: 10, right: 10, left: 0, bottom: 0 \}\}>[\s\S]*?<\/ComposedChart>/s;

const repl = `<ComposedChart data={marginData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                          <YAxis yAxisId="left" tickFormatter={(v) => \`\${(v/1000).toFixed(1)}k\`} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={10} stroke="#8b5cf6" />
                          <YAxis yAxisId="shIndex" orientation="right" hide domain={['auto', 'auto']} />
                          <Tooltip 
                           contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                           formatter={(v, name) => {
                             if (name === "上证指数") return [Number(v).toFixed(2), name];
                             return [\`\${v} 亿\`, name];
                           }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                          <Bar yAxisId="right" dataKey="netBuy" name="两融净买入" fill="#8b5cf6" radius={[2, 2, 0, 0]} opacity={0.3} />
                          <Line yAxisId="left" type="monotone" dataKey="margin" name="融资余额" stroke="#ef4444" strokeWidth={3} dot={false} />
                          <Line yAxisId="left" type="monotone" dataKey="short" name="融券余额" stroke="#10b981" strokeWidth={2} dot={false} />
                          <Line yAxisId="shIndex" type="monotone" dataKey="shIndex" name="上证指数" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                          <Brush 
                            dataKey="date" 
                            height={25} 
                            stroke="#cbd5e1" 
                            fill="#f8fafc"
                            tickFormatter={() => ''}
                            startIndex={marginTimeRange?.startIndex} 
                            endIndex={marginTimeRange?.endIndex}
                            onChange={(e) => {
                              if (e.startIndex !== undefined && e.endIndex !== undefined) {
                                setMarginTimeRange({ startIndex: e.startIndex, endIndex: e.endIndex });
                              }
                            }}
                          />
                        </ComposedChart>`;

if (code.match(regex)) {
  code = code.replace(regex, repl);
  fs.writeFileSync('src/App.tsx', code);
  console.log('done via regex!');
} else {
  console.log('regex NOT match');
}

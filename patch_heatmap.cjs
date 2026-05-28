const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `const topOutflowSectors = computedFlows.filter(s => s.value < 0).slice(-5).sort((a, b) => b.value - a.value);`;
const replacement1 = `const topOutflowSectors = computedFlows.filter(s => s.value < 0).slice(-5).sort((a, b) => b.value - a.value);

  const scatterHeatmapData = industryEtfs.map(q => {
    const changePct = ((q.price - q.prevClose) / q.prevClose) * 100;
    const estimatedFlow = (changePct > 0 ? 1 : -1) * (q.amount * 0.15 * Math.abs(changePct/100)) / 1000000;
    return {
      name: q.name.replace('ETF','').replace('联接',''),
      change: isNaN(changePct) ? 0 : Number(changePct.toFixed(2)),
      flow: isNaN(estimatedFlow) ? 0 : Number(estimatedFlow.toFixed(2)),
      absFlow: Math.abs(isNaN(estimatedFlow) ? 0 : estimatedFlow)
    };
  });`;

// Replace 1
code = code.replace(target1, replacement1);


const target2 = `{/* CORRELATION CHART */}`;
const replacement2 = `{/* SCATTER HEATMAP MATRIX */}
                <Card className="p-6 relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>行业资金联动热力矩阵 (板块补涨/抱团识别)</span>
                    <div className="flex items-center gap-4 text-xs font-normal">
                       <span className="flex items-center gap-1 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div>主升抱团区</span>
                       <span className="flex items-center gap-1 text-purple-500"><div className="w-2 h-2 rounded-full bg-purple-500"></div>资金吸筹区</span>
                    </div>
                  </h3>
                  <div className="h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          dataKey="flow" 
                          name="资金净流向" 
                          unit="亿" 
                          tickFormatter={(v) => v > 0 ? \`+\${v}\` : v}
                          stroke="#64748b" 
                          fontSize={11}
                          domain={['auto', 'auto']}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="change" 
                          name="涨跌幅" 
                          unit="%" 
                          tickFormatter={(v) => \`\${v}%\`}
                          stroke="#64748b" 
                          fontSize={11}
                          domain={['auto', 'auto']}
                        />
                        <ZAxis type="number" dataKey="absFlow" range={[60, 400]} name="强度" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-sm">
                                  <div className="font-bold text-slate-800 mb-1">{data.name}</div>
                                  <div className="text-slate-600">资金净流向: <span className={data.flow > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{data.flow} 亿</span></div>
                                  <div className="text-slate-600">当日涨跌幅: <span className={data.change > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{data.change}%</span></div>
                                  <div className="mt-2 text-xs text-slate-400 font-mono">
                                    {data.flow > 0 && data.change > 0 ? '↗ 主力抱团 / 趋势主升' : 
                                     data.flow > 0 && data.change <= 0 ? '↘ 资金吸筹 / 埋伏补涨' :
                                     data.flow <= 0 && data.change > 0 ? '↖ 价格坚挺 / 主力派发' :
                                     '↙ 资金撤退 / 弱势回调'}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          name="行业ETF" 
                          data={scatterHeatmapData} 
                          shape={(props: any) => {
                            const { cx, cy, payload } = props;
                            // Color mapping by quadrant
                            let fill = "#94a3b8"; // default
                            if (payload.flow > 0 && payload.change > 0) fill = "#f43f5e"; // rose-500
                            else if (payload.flow > 0 && payload.change <= 0) fill = "#a855f7"; // purple-500
                            else if (payload.flow <= 0 && payload.change > 0) fill = "#eab308"; // yellow-500
                            else fill = "#10b981"; // emerald-500

                            return (
                              <g transform={\`translate(\${cx},\${cy})\`}>
                                <circle r={props.size ? Math.sqrt(props.size/Math.PI)*2 : 8} fill={fill} opacity={0.6} />
                                <text x={0} y={4} textAnchor="middle" fill="#1e293b" fontSize={10} fontWeight="bold" pointerEvents="none">
                                  {payload.name}
                                </text>
                              </g>
                            );
                          }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* CORRELATION CHART */}`;

code = code.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', code);
console.log('Done inserting Scatter Heatmap');

const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Ensure required Recharts imports are there
if (!app.includes('ScatterChart')) {
  app = app.replace(
    /ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Brush/,
    'ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Brush, ScatterChart, Scatter, ZAxis'
  );
}

// 2. We need to compute derived states inside the component, but calculating on the fly inside the render loop is fine for small data arrays.
const renderPatternStart = /\{ \/\* Margin Data \*\/\}/;
const renderPatternEnd = app.indexOf('</Card>', app.indexOf('{/* Margin Data */}')) + '</Card>'.length;

const derivedDataCode = `
                  {/* Derived Data for Margin-SH Index Correlation */}
                  {(() => {
                    if (marginData.length < 2) return null;
                    
                    // Process Cumulative & Scatter
                    let cumulativeNetBuy = 0;
                    const processed = marginData.map((d, i) => {
                      cumulativeNetBuy += d.netBuy;
                      const prevIndex = i > 0 ? marginData[i-1].shIndex : d.shIndex;
                      const idxChange = ((d.shIndex - prevIndex) / prevIndex) * 100;
                      return {
                        ...d,
                        idxChange: Number(idxChange.toFixed(2)),
                        cumulativeNetBuy: Number(cumulativeNetBuy.toFixed(1))
                      };
                    });
                    
                    // Simple Pearson Correlation
                    const n = processed.length - 1; // start from second element since first element has 0 change
                    if (n < 2) return null;
                    const validData = processed.slice(1);
                    const sumX = validData.reduce((acc, d) => acc + d.netBuy, 0);
                    const sumY = validData.reduce((acc, d) => acc + d.idxChange, 0);
                    const sumX2 = validData.reduce((acc, d) => acc + d.netBuy*d.netBuy, 0);
                    const sumY2 = validData.reduce((acc, d) => acc + d.idxChange*d.idxChange, 0);
                    const sumXY = validData.reduce((acc, d) => acc + d.netBuy*d.idxChange, 0);
                    
                    const num = n * sumXY - sumX * sumY;
                    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                    const correlation = den === 0 ? 0 : (num / den);
                    
                    const isPositiveCorr = correlation > 0.3;
                    const isNegativeCorr = correlation < -0.3;

                    return (
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Key Metric Card */}
                          <Card className="p-6 flex flex-col justify-center items-center text-center">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                               <Activity size={16} /> 两融与市场相关性
                            </h3>
                            <div className="flex flex-col items-center mt-4">
                               <span className={cn("text-5xl font-mono tracking-tighter leading-none mb-2", correlation > 0 ? "text-rose-500" : "text-emerald-500")}>
                                 {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
                               </span>
                               <span className="text-sm font-medium text-slate-700">
                                  {correlation > 0.6 ? '强正相关 (共振上涨)' : 
                                   correlation > 0.3 ? '弱正相关' : 
                                   correlation > -0.3 ? '无明显相关' : 
                                   correlation > -0.6 ? '弱负相关' : '强负相关 (背离)'}
                               </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-6 leading-relaxed max-w-[200px]">
                               代表两融净买入额与上证指数同期涨跌幅的皮尔逊相关系数。
                            </p>
                          </Card>

                          {/* Scatter Plot */}
                          <Card className="p-6 lg:col-span-2 flex flex-col min-h-[300px]">
                            <div className="mb-4">
                              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                                流向与涨跌分布阵列
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">X轴: 两融净买入(亿) / Y轴: 上证同日涨跌幅(%)</p>
                            </div>
                            <div className="flex-1 w-full h-[220px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                  <XAxis type="number" dataKey="netBuy" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => \`\${v}亿\`} dy={10} />
                                  <YAxis type="number" dataKey="idxChange" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => \`\${v}%\`} dx={-10} />
                                  <ZAxis type="number" range={[40, 40]} />
                                  <Tooltip 
                                    cursor={{strokeDasharray: '3 3'}}
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                                    formatter={(value, name) => [name === 'netBuy' ? \`\${value} 亿\` : \`\${value}%\`, name === 'netBuy' ? '当日两融净买入' : '同期上证涨跌幅']}
                                    labelFormatter={() => ''}
                                  />
                                  <Scatter name="资金流向阵列" data={validData} fill="#3b82f6" fillOpacity={0.6} />
                                </ScatterChart>
                              </ResponsiveContainer>
                            </div>
                          </Card>

                        </div>

                        {/* Cumulative Trend */}
                        <Card className="p-6 flex flex-col min-h-[350px]">
                          <div className="mb-4 flex justify-between items-end">
                            <div>
                              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span>
                                两融累计净买入与指数趋势同步监测
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">对比杠杆资金的长线蓄水趋势与市场实质高度的背离情况。</p>
                            </div>
                          </div>
                          <div className="flex-1 w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={processed} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                                <YAxis yAxisId="buy" domain={['dataMin - 100', 'dataMax + 100']} tickFormatter={v => \`\${v}亿\`} axisLine={false} tickLine={false} fontSize={10} stroke="#8b5cf6" />
                                <YAxis yAxisId="idx" orientation="right" domain={['auto', 'auto']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  formatter={(value, name) => [name === 'shIndex' ? Number(value).toFixed(2) : \`\${value} 亿\`, name === 'shIndex' ? '上证指数' : '累计两融净买入']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                                <Area yAxisId="buy" type="monotone" dataKey="cumulativeNetBuy" name="累计净买入(左轴)" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                <Line yAxisId="idx" type="monotone" dataKey="shIndex" name="上证指数(右轴)" stroke="#eab308" strokeWidth={3} dot={false} opacity={0.8} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                      </div>
                    );
                  })()}
`;

const originalCodeToReplace = app.substring(app.indexOf('{/* Margin Data */}'), renderPatternEnd);

if (originalCodeToReplace.includes('ComposedChart data={marginData.slice(-30)}')) {
  app = app.replace(originalCodeToReplace, derivedDataCode);
  fs.writeFileSync('src/App.tsx', app);
  console.log('App.tsx margin ui replaced successfully');
} else {
  console.log('Could not find original Margin Data Card block properly');
  // fallback finding
  const altStart = app.indexOf('{/* Margin Data */}');
  const fallbackMatch = app.indexOf('</Card>', altStart);
  console.log(fallbackMatch);
}


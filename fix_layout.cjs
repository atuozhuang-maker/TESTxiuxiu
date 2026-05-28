const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find the spot to cut
const startMarker = `                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">行业</span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">宽基</span>
                            )}
                          </td>`;

// find index
const startIndex = code.indexOf(startMarker) + startMarker.length;
// search for the end of the broken part, let's find the closing of Card we messed up
let rightPart = code.substring(startIndex);
// The broken part ends with `) : (` followed by loading div and the closing card
const nextCardIndex = rightPart.indexOf('                 {/* Dragon Tiger List */}');

const missingMiddle = `
                          <td className="py-4 px-6 font-mono font-bold text-slate-800">{sig.volume}</td>
                          <td className="py-4 px-6">
                            <span className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block border",
                              sig.type === 'buy' ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                            )}>
                              {sig.type === 'buy' ? '异动流入 (Buy)' : '异动抛售 (Sell)'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: 3 }).map((_, j) => (
                                <div 
                                  key={j} 
                                  className={cn(
                                    "w-1.5 h-3.5 rounded-[2px]",
                                    j < (sig.signal.includes('Strong') ? 3 : 2)
                                      ? (sig.type === 'buy' ? "bg-rose-500" : "bg-emerald-500")
                                      : "bg-slate-200"
                                  )}
                                />
                              ))}
                              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sig.signal}</span>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-500">当前无显著异动信号</td></tr>
                      )}
                    </tbody>
                  </table>
                </Card>
             </div>
           )}

           {activeTab === 'capital' && (
             <div className="flex flex-col gap-6">
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-bold tracking-tight text-slate-800">信贷与游资动态 <span className="text-slate-400 font-normal ml-2 text-lg">Capital & Hot Money</span></h1>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Margin Data */}
                 <Card className="p-6 flex flex-col min-h-[400px]">
                   <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                     <div>
                       <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span>
                         两融资金规模监控
                       </h3>
                       <p className="text-xs text-slate-500 mt-1">融资余额代表市场杠杆资金的做多意愿与风险偏好。</p>
                     </div>
                   </div>
                   <div className="flex-1 w-full min-h-[300px]">
                     {marginData.length > 0 ? (
                       <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={marginData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                          <YAxis yAxisId="margin" domain={['dataMin - 100', 'dataMax + 100']} tickFormatter={(v) => \`\${(v/1000).toFixed(1)}k\`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />
                          <YAxis yAxisId="shIndex" orientation="right" domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />
                          <YAxis yAxisId="net" orientation="right" hide />
                          <Tooltip 
                           contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           formatter={(v, name) => {
                             if (name === "上证指数" || name === "融券余额") return [Number(v).toFixed(2), name];
                             return [\`\${v} 亿\`, name];
                           }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                          <Bar yAxisId="net" dataKey="netBuy" name="两融净买入" fill="#8b5cf6" radius={[2, 2, 0, 0]} opacity={0.4} barSize={6} />
                          <Line yAxisId="margin" type="monotone" dataKey="margin" name="融资余额(左轴)" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                          <Line yAxisId="shIndex" type="monotone" dataKey="shIndex" name="上证指数(右轴)" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={2} dot={false} />
                        </ComposedChart>
                       </ResponsiveContainer>
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">加载行情中...</div>
                     )}
                   </div>
                 </Card>
`;

code = code.substring(0, startIndex) + missingMiddle + rightPart.substring(nextCardIndex);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed layout");

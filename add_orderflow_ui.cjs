const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        </div>
      </main>
    </div>`;

const newCode = `           {activeTab === 'orderflow' && (
             <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                     <Target size={20} />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold tracking-tight text-slate-800">微观订单流与主买资金</h1>
                     <p className="text-xs text-slate-500 mt-0.5">从大小单资金分化中寻找主力建仓意图，捕捉短期轮动先机</p>
                   </div>
                 </div>
               </div>

               {/* Guidelines reference */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="flex gap-0.5 h-4 items-end">
                     <div className="w-1.5 h-full rounded-sm bg-purple-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-pink-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-purple-500"></div>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">精细资金观测指南</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                       <tr>
                         <th className="py-3 px-6 font-medium">类别</th>
                         <th className="py-3 px-6 font-medium">核心指标</th>
                         <th className="py-3 px-6 font-medium">作用</th>
                         <th className="py-3 px-6 font-medium">关键细节</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-slate-700">
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">超大单/大单资金</td>
                         <td className="py-4 px-6 text-slate-600">经市值调整的净买入额</td>
                         <td className="py-4 px-6 text-slate-600">比总量资金流向更前瞻</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           反向观察<span className="font-bold text-rose-500">小单资金（散户行为）</span>，通常滞后，具反向参考价值
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">主买资金</td>
                         <td className="py-4 px-6 text-slate-600">大单主动性买入金额</td>
                         <td className="py-4 px-6 text-slate-600">剔除被动成交，真实反映主动建仓意图</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           <span className="font-bold text-teal-600">主买策略月度胜率达60.95%</span>
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">开盘/尾盘资金</td>
                         <td className="py-4 px-6 text-slate-600">早晚各30分钟资金净流入</td>
                         <td className="py-4 px-6 text-slate-600">尾盘资金对行业轮动有效性较高</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           多数机构在尾盘集中调仓，可作为短期判断依据
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </Card>

               {orderFlowData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Col 1 */}
                   <div className="flex flex-col gap-6">
                     <Card className="p-6 relative overflow-hidden h-[300px] flex flex-col">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-rose-500 before:rounded-full">分单级别资金净额 (日内)</h3>
                       <p className="text-xs text-slate-500 mb-4">通过超大单(机构)与小单(散户)的背离，捕捉关键反转信号。</p>
                       <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={orderFlowData.orderSizes.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                             />
                             <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                             <Line type="monotone" dataKey="superLarge" name="主力(超大单)" stroke="#ef4444" strokeWidth={3} dot={false} />
                             <Line type="monotone" dataKey="small" name="散户(小单)" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden flex-1 shadow-sm">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-500 before:rounded-full">主力主动建仓 (剔除被动成交)</h3>
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">月度胜率 {orderFlowData.activeBuy.winRate}%</div>
                       </div>
                       <table className="w-full text-left text-sm">
                         <thead className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider">
                           <tr>
                             <th className="py-3 px-5 font-semibold">标的</th>
                             <th className="py-3 px-5 font-semibold text-right">大单主动净额 (亿)</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {orderFlowData.activeBuy.topStocks.map((s: any, i: number) => (
                             <tr key={i} className="hover:bg-purple-50/40 transition-colors group">
                               <td className="py-3 px-5">
                                 <div className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{s.name}</div>
                                 <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.symbol}</div>
                               </td>
                               <td className="py-3 px-5 text-right font-bold text-rose-500">
                                 <div className="flex items-center justify-end gap-1">
                                   ¥ {s.activeNet.toFixed(1)} 
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </Card>
                   </div>

                   {/* Col 2 */}
                   <div className="flex flex-col gap-6">
                     <div className="grid grid-cols-2 gap-6">
                       <Card className="p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Clock size={64} className="text-rose-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">开盘30分钟情绪</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black tracking-tight text-slate-800">{orderFlowData.openClose.open.netFlow.toFixed(1)}</span>
                           <span className="text-sm font-bold text-slate-400">亿</span>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-100">
                           <div className="text-[10px] text-slate-400 mb-1.5">领头板块</div>
                           <div className="flex flex-wrap gap-1">
                             {orderFlowData.openClose.open.topSectors.map((s: string, i: number) => (
                               <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-medium rounded border border-rose-100">{s}</span>
                             ))}
                           </div>
                         </div>
                       </Card>

                       <Card className="p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Clock size={64} className="text-purple-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">尾盘30分钟伏击</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black tracking-tight text-slate-800">{orderFlowData.openClose.close.netFlow.toFixed(1)}</span>
                           <span className="text-sm font-bold text-slate-400">亿</span>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-100">
                           <div className="text-[10px] text-slate-400 mb-1.5">抢筹板块 (明日关注)</div>
                           <div className="flex flex-wrap gap-1">
                             {orderFlowData.openClose.close.topSectors.map((s: string, i: number) => (
                               <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-medium rounded border border-purple-100">{s}</span>
                             ))}
                           </div>
                         </div>
                       </Card>
                     </div>

                     <Card className="p-6 flex-1 flex flex-col min-h-[300px]">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">开盘与尾盘资金净额历史走势</h3>
                       <div className="flex-1 w-full min-h-[220px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={orderFlowData.openClose.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                             />
                             <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                             <Bar dataKey="openFlow" name="开盘30分钟" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={12} opacity={0.6} />
                             <Bar dataKey="closeFlow" name="尾盘30分钟" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={12} />
                           </ComposedChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>
                 </div>
               ) : (
                 <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                   <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">正在测算最新主动买盘与尾盘动向...</p>
                 </div>
               )}
             </div>
           )}
        </div>
      </main>
    </div>`;

if(true) {
  fs.writeFileSync('src/App.tsx', code.replace('</main>', newCode.substring(0, newCode.lastIndexOf('</div>')) + '</main>'));
  console.log('Appended orderflow tab UI');
} else {
  console.log('Could not find targetStr to replace');
}

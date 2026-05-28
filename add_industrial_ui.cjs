const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        </div>
      </main>
    </div>`;

const newCode = `           {activeTab === 'industrial' && (
             <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white shadow-lg shadow-slate-500/30">
                     <Factory size={20} />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold tracking-tight text-slate-800">产业资本行为</h1>
                     <p className="text-xs text-slate-500 mt-0.5">跟踪大股东、解禁、定增与回购，捕捉"聪明钱"的前瞻信号</p>
                   </div>
                 </div>
               </div>

               {/* Guidelines reference */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="flex gap-0.5 h-4 items-end">
                     <div className="w-1.5 h-full rounded-sm bg-slate-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-slate-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-slate-500"></div>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">产业资本行为指南</h3>
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
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">大股东增减持</td>
                         <td className="py-4 px-6 text-slate-600">公告增减持计划、实际增减持数据</td>
                         <td className="py-4 px-6 text-slate-600">"聪明钱"信号——产业资本最了解公司价值</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           大规模减持往往拖累行业表现
                           <div className="flex gap-1 ml-1">
                             <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors">3</span>
                             <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors">6</span>
                           </div>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">限售解禁</td>
                         <td className="py-4 px-6 text-slate-600">解禁规模、解禁市值占流通市值比例</td>
                         <td className="py-4 px-6 text-slate-600">提前预警潜在抛压</td>
                         <td className="py-4 px-6 text-slate-600">解禁比例偏高且估值不低的行业需谨慎对待</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">定向增发</td>
                         <td className="py-4 px-6 text-slate-600">定增规模、机构参与度</td>
                         <td className="py-4 px-6 text-slate-600">正向配置机会</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           折价认购反映机构对中长期价值的认可
                           <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors ml-1">6</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">回购</td>
                         <td className="py-4 px-6 text-slate-600">上市公司回购规模及频率</td>
                         <td className="py-4 px-6 text-slate-600">提振市场信心</td>
                         <td className="py-4 px-6 text-slate-600">尤其密集出现时对相关行业有正面信号意义</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </Card>

               {industrialData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Col 1 */}
                   <div className="flex flex-col gap-6">
                     <Card className="p-6 relative overflow-hidden flex flex-col min-h-[320px]">
                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <Activity size={80} className="text-emerald-600" />
                       </div>
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500 before:rounded-full">大股东增减持追踪</h3>
                       
                       <div className="flex items-center gap-4 mb-6">
                         <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="text-[11px] text-slate-500 mb-1">近期净增持规模</div>
                           <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-bold text-emerald-600">+{industrialData.shareholders.netIncrease}</span>
                             <span className="text-sm font-medium text-slate-400">亿</span>
                           </div>
                         </div>
                         <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="text-[11px] text-slate-500 mb-1">重点增持行业</div>
                           <div className="font-bold text-slate-700 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                             {industrialData.shareholders.topIncreaseSectors.join('、')}
                           </div>
                         </div>
                       </div>

                       <div className="flex-1 overflow-y-auto">
                         <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">近期核心异动库</h4>
                         <div className="space-y-3">
                           {industrialData.shareholders.recentEvents.map((evt: any, i: number) => (
                             <div key={i} className="flex gap-3 items-start border-l-2 border-slate-200 pl-3 py-1 hover:border-emerald-400 transition-colors">
                               <div className="min-w-[70px]">
                                 <div className="font-bold text-slate-800 text-sm">{evt.company}</div>
                                 <div className={cn("text-[10px] font-bold mt-0.5 inline-block px-1.5 rounded", evt.type === '增持' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{evt.type} {evt.amount}</div>
                               </div>
                               <div className="text-xs text-slate-600 leading-relaxed pt-0.5">{evt.implication}</div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </Card>

                     <Card className="p-6 relative overflow-hidden h-[300px] flex flex-col">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-rose-500 before:rounded-full">回购潮规模走势</h3>
                       <p className="text-xs text-slate-500 mb-4 ml-3">密集回购期往往是相关行业阶段性底部的标志</p>
                       <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={industrialData.buybacks.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                               formatter={(v: any) => [\`\${Number(v).toFixed(1)} 亿\`, '回购金额']}
                             />
                             <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} opacity={0.8}>
                                {industrialData.buybacks.history.map((entry: any, index: number) => (
                                  <Cell key={\`cell-\${index}\`} fill={index === industrialData.buybacks.history.length - 1 ? '#e11d48' : '#fda4af'} />
                                ))}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>

                   {/* Col 2 */}
                   <div className="flex flex-col gap-6">
                     <Card className="p-0 overflow-hidden shadow-sm flex flex-col">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-amber-500 before:rounded-full">限售解禁高危预警</h3>
                          <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <ShieldAlert size={12} />
                            本周解禁 {industrialData.unlocks.thisWeekTotal} 亿
                          </div>
                       </div>
                       <div className="p-5">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">高压板块: <span className="text-slate-700">{industrialData.unlocks.highRiskSectors.join('、')}</span></h4>
                          <div className="space-y-4">
                            {industrialData.unlocks.details.map((item: any, i: number) => (
                              <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center">
                                  <div className="font-bold text-slate-800">{item.company}</div>
                                  <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded", item.risk === 'High' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>
                                    风险: {item.risk}
                                  </div>
                                </div>
                                <div className="flex gap-4 text-xs">
                                  <div><span className="text-slate-500">规模:</span> <span className="font-bold text-slate-700">{item.unlockValue}亿</span></div>
                                  <div><span className="text-slate-500">占流通比:</span> <span className="font-bold text-slate-700">{item.ratio}</span></div>
                                </div>
                                <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-1">
                                  {item.notes}
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden shadow-sm flex flex-col flex-1">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">定向增发与机构配置</h3>
                          <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">折价反映价值</div>
                       </div>
                       <table className="w-full text-left text-sm whitespace-nowrap">
                         <thead className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider">
                           <tr>
                             <th className="py-3 px-5 font-semibold">标的</th>
                             <th className="py-3 px-5 font-semibold">规模/折价</th>
                             <th className="py-3 px-5 font-semibold text-right">机构动向</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {industrialData.placements.notable.map((p: any, i: number) => (
                             <tr key={i} className="hover:bg-blue-50/40 transition-colors group">
                               <td className="py-4 px-5 font-bold text-slate-800">{p.company}</td>
                               <td className="py-4 px-5">
                                 <div className="text-sm font-bold text-slate-700">{p.size}</div>
                                 <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50 inline-block px-1 rounded mt-0.5">折价 {p.discount}</div>
                               </td>
                               <td className="py-4 px-5 text-right w-1/2 whitespace-normal line-clamp-3">
                                 <div className="text-[11px] text-slate-600">{p.notes}</div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </Card>
                   </div>
                 </div>
               ) : (
                 <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                   <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">正在提炼产业资本底牌...</p>
                 </div>
               )}
             </div>
           )}
        </div>
      </main>
    </div>`;

if(true) {
  fs.writeFileSync('src/App.tsx', code.replace('</main>', newCode.substring(0, newCode.lastIndexOf('</div>')) + '</main>'));
  console.log('Appended industrial tab UI');
} else {
  console.log('Could not find targetStr to replace');
}

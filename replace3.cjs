const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{activeTab === 'institution' && \([\s\S]*?\)\}/;
const replacement = `{activeTab === 'institution' && (
             <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                     <Building size={20} />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold tracking-tight text-slate-800">机构调研与持仓</h1>
                     <p className="text-xs text-slate-500 mt-0.5">跟踪公募与顶尖机构动态，预判市场主线爆发的前奏</p>
                   </div>
                 </div>
               </div>
               
               {/* Documentation Card (from User Image) */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="flex gap-0.5 h-4 items-end">
                     <div className="w-1.5 h-full rounded-sm bg-indigo-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-rose-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-indigo-500"></div>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">机构核心观测逻辑速览</h3>
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
                       <tr className="hover:bg-blue-50/30 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">机构调研频率</td>
                         <td className="py-4 px-6 text-slate-600">特定行业、个股被调研次数</td>
                         <td className="py-4 px-6 text-slate-600">"调研热度"往往是机构建仓前奏</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           短期集中被调研的行业具备较高投资关注价值
                           <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">3</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-blue-50/30 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">公募基金仓位</td>
                         <td className="py-4 px-6 text-slate-600">主动偏股基金仓位变化、新发基金规模</td>
                         <td className="py-4 px-6 text-slate-600">公募作为重要边际资金力量</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           关注绩优型基金与轮动型基金的不同持仓偏好，可揭示风格切换趋势
                           <span className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center text-[10px] text-rose-600 font-bold">9</span>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </Card>

               {/* Data Visualization */}
               {institutionData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   
                   {/* Left Col: Research Activity */}
                   <div className="flex flex-col gap-6">
                     <Card className="p-6">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-500 before:rounded-full">机构调研频率 · 行业关注度</h3>
                         <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">近一个月</span>
                       </div>
                       <div className="h-[260px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={institutionData.research.sectors} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b" width={110} />
                             <Tooltip 
                                cursor={{fill: '#f8fafc', opacity: 0.6}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                formatter={(v: any, name: any, item: any) => [\`\${v}次 (环比\${item.payload.trend > 0 ? '+' : ''}\${item.payload.trend}%)\`, '调研次数']}
                             />
                             <Bar dataKey="count" fill="url(#colorIndi)" radius={[0, 4, 4, 0]} barSize={18}>
                               <defs>
                                 <linearGradient id="colorIndi" x1="0" y1="0" x2="1" y2="0">
                                   <stop offset="0%" stopColor="#818cf8" />
                                   <stop offset="100%" stopColor="#4f46e5" />
                                 </linearGradient>
                               </defs>
                               {institutionData.research.sectors.map((entry: any, index: number) => (
                                 <Cell key={\`cell-\${index}\`} fill={entry.trend > 15 ? '#ef4444' : 'url(#colorIndi)'} />
                               ))}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden flex-1 shadow-sm">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-rose-500 before:rounded-full">被调研个股热度 (建仓前奏)</h3>
                       </div>
                       <table className="w-full text-left text-sm">
                         <thead className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider">
                           <tr>
                             <th className="py-3 px-5 font-semibold">股票名称</th>
                             <th className="py-3 px-5 font-semibold">所属行业</th>
                             <th className="py-3 px-5 font-semibold text-right">调研次数</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {institutionData.research.stocks.map((s: any, i: number) => (
                             <tr key={i} className="hover:bg-blue-50/40 transition-colors group">
                               <td className="py-3 px-5">
                                 <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</div>
                                 <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.symbol}</div>
                               </td>
                               <td className="py-3 px-5">
                                 <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium whitespace-nowrap">{s.sector}</span>
                               </td>
                               <td className="py-3 px-5 text-right font-bold text-rose-500">
                                 <div className="flex items-center justify-end gap-1">
                                   <Activity size={12} className="text-rose-400 opacity-60" />
                                   {s.count}
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </Card>
                   </div>

                   {/* Right Col: Fund Positions */}
                   <div className="flex flex-col gap-6">
                     <div className="grid grid-cols-2 gap-6">
                       <Card className="p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <PieChart size={64} className="text-indigo-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">主动偏股基金仓位</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black tracking-tight text-slate-800">{institutionData.funds.activeEquity.toFixed(2)}%</span>
                           <span className={cn("text-sm font-bold flex items-center", institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                             {Math.abs(institutionData.funds.activeEquity - institutionData.funds.activeEquityPrev).toFixed(2)}%
                           </span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
                           <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full" style={{ width: \`\${institutionData.funds.activeEquity}%\` }}></div>
                         </div>
                       </Card>

                       <Card className="p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <TrendingUp size={64} className="text-emerald-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">本月新发基金规模</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black tracking-tight text-slate-800">{institutionData.funds.newFundScale.toFixed(0)}</span>
                           <span className="text-sm font-bold text-slate-400">亿</span>
                           <span className={cn("ml-1 text-sm font-bold flex items-center", institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                             {Math.abs(institutionData.funds.newFundScale - institutionData.funds.newFundScalePrev).toFixed(1)}
                           </span>
                         </div>
                         <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            新增源头活水，支撑市场底部
                         </div>
                       </Card>
                     </div>

                     <Card className="p-6 flex-1 flex flex-col min-h-[350px]">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-500 before:rounded-full">公募持仓偏好与发行规模趋势</h3>
                       </div>
                       
                       {/* Context summary of style preference */}
                       <div className="flex gap-4 mb-6">
                         {institutionData.funds.stylePreference.map((style: any, idx: number) => (
                           <div key={idx} className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col items-center justify-center">
                             <div className="text-[10px] text-slate-500 mb-1">{style.name}</div>
                             <div className="font-bold text-slate-800">{style.value}%</div>
                             <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                               <div className={cn("h-1 rounded-full", idx === 0 ? "bg-rose-400" : idx === 1 ? "bg-amber-400" : "bg-indigo-400")} style={{width: \`\${style.value}%\`}}></div>
                             </div>
                           </div>
                         ))}
                       </div>

                       <div className="flex-1 w-full min-h-[220px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={institutionData.funds.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis yAxisId="left" domain={['dataMin - 3', 'dataMax + 3']} tickFormatter={(v) => v.toFixed(0)+"%"} axisLine={false} tickLine={false} fontSize={10} stroke="#4f46e5" />
                             <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#0ea5e9" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                             />
                             <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                             <Line yAxisId="left" type="monotone" dataKey="position" name="主动偏股仓位" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                             <Line yAxisId="right" type="monotone" dataKey="newScale" name="新发规模(亿)" stroke="#0ea5e9" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>
                   
                 </div>
               ) : (
                 <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                   <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">正在深度挖掘机构与公募最新持仓数据...</p>
                 </div>
               )}
             </div>
           )}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Done replacement!');
} else {
  console.log('Regex did not match.');
}

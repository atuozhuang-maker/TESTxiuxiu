const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<\/main>/;

const repl = `           {activeTab === 'institution' && (
             <div className="flex flex-col gap-6 animate-in fade-in duration-500">
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-bold tracking-tight text-slate-800">机构调研与持仓 <span className="text-slate-400 font-normal ml-2 text-lg">Institution Activity</span></h1>
               </div>
               
               {/* Documentation Card (from User Image) */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                   <div className="flex gap-0.5 h-4 items-end mr-2">
                     <div className="w-1.5 h-full rounded-sm bg-blue-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-rose-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-blue-400"></div>
                   </div>
                   <h3 className="text-lg font-bold text-slate-800 tracking-tight">机构调研与持仓</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="text-slate-500 border-b border-slate-100">
                       <tr>
                         <th className="py-4 px-6 font-medium">类别</th>
                         <th className="py-4 px-6 font-medium">核心指标</th>
                         <th className="py-4 px-6 font-medium">作用</th>
                         <th className="py-4 px-6 font-medium">关键细节</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-slate-700">
                       <tr className="hover:bg-slate-50/50 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">机构调研频率</td>
                         <td className="py-4 px-6 text-slate-600">特定行业、个股被调研次数</td>
                         <td className="py-4 px-6 text-slate-600">"调研热度"往往是机构建仓前奏</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           短期集中被调研的行业具备较高投资关注价值
                           <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">3</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50/50 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">公募基金仓位</td>
                         <td className="py-4 px-6 text-slate-600">主动偏股基金仓位变化、新发基金规模</td>
                         <td className="py-4 px-6 text-slate-600">公募作为重要边际资金力量</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           关注绩优型基金与轮动型基金的不同持仓偏好，可揭示风格切换趋势
                           <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">9</span>
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
                       <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">机构调研频率 - 行业关注度</h3>
                       <div className="h-[250px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={institutionData.research.sectors} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b" width={80} />
                             <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             />
                             <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20}>
                               {institutionData.research.sectors.map((entry, index) => (
                                 <Cell key={\`cell-\${index}\`} fill={entry.trend > 0 ? '#ef4444' : '#3b82f6'} />
                               ))}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden flex-1">
                       <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">被调研个股热度 (建仓前奏)</h3>
                       </div>
                       <table className="w-full text-left text-sm">
                         <thead className="bg-slate-100/50 text-slate-500">
                           <tr>
                             <th className="py-2 px-6 font-semibold">股票名称</th>
                             <th className="py-2 px-6 font-semibold">所属行业</th>
                             <th className="py-2 px-6 font-semibold text-right">调研次数</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                           {institutionData.research.stocks.map((s, i) => (
                             <tr key={i} className="hover:bg-slate-50/50">
                               <td className="py-3 px-6">
                                 <div className="font-bold text-slate-800">{s.name}</div>
                                 <div className="text-[10px] text-slate-400 font-mono">{s.symbol}</div>
                               </td>
                               <td className="py-3 px-6 text-slate-600">{s.sector}</td>
                               <td className="py-3 px-6 text-right font-bold text-rose-500">{s.count}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </Card>
                   </div>

                   {/* Right Col: Fund Positions */}
                   <div className="flex flex-col gap-6">
                     <div className="grid grid-cols-2 gap-6">
                       <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200">
                         <div className="text-sm font-medium text-slate-500 mb-1">主动偏股基金仓位</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-bold tracking-tight text-slate-800">{institutionData.funds.activeEquity.toFixed(2)}%</span>
                           <span className={cn("text-sm font-bold", institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? "+" : ""}
                             {(institutionData.funds.activeEquity - institutionData.funds.activeEquityPrev).toFixed(2)}%
                           </span>
                         </div>
                       </Card>
                       <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200">
                         <div className="text-sm font-medium text-slate-500 mb-1">本月新发基金规模</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-bold tracking-tight text-slate-800">{institutionData.funds.newFundScale.toFixed(0)}</span>
                           <span className="text-sm text-slate-500">亿</span>
                           <span className={cn("ml-1 text-sm font-bold", institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? "+" : ""}
                             {(institutionData.funds.newFundScale - institutionData.funds.newFundScalePrev).toFixed(1)}
                           </span>
                         </div>
                       </Card>
                     </div>

                     <Card className="p-6 flex-1 flex flex-col">
                       <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">公募持仓偏好 (风格揭示)</h3>
                       <div className="flex-1 w-full min-h-[250px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={institutionData.funds.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(v) => v.toFixed(0)+"%"} axisLine={false} tickLine={false} fontSize={10} stroke="#4f46e5" />
                             <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#0ea5e9" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                             />
                             <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                             <Line yAxisId="left" type="monotone" dataKey="position" name="公募仓位" stroke="#4f46e5" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
                             <Line yAxisId="right" type="monotone" dataKey="newScale" name="新发规模" stroke="#0ea5e9" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>
                   
                 </div>
               ) : (
                 <div className="w-full py-12 flex items-center justify-center text-slate-400">加载中...</div>
               )}
             </div>
           )}

        </div>
      </main>`;

if (code.match(regex)) {
  code = code.replace(regex, repl);
  fs.writeFileSync('src/App.tsx', code);
  console.log('done tab insertion via regex!');
} else {
  console.log('regex NOT match');
}

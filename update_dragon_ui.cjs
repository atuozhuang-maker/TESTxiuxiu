const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = Buffer.from(`                 {/* Dragon Tiger List */}
                 <Card className="p-0 overflow-hidden flex flex-col lg:col-span-2 shadow-sm">
                   <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                     <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 block"></span>
                        龙虎榜席位动向 (活跃机构与一线游资)
                     </h3>
                     <p className="text-xs text-slate-500">重点跟踪顶级溢价席位与机构抱团，发掘主流资金的核心聚焦标的。</p>
                   </div>
                   
                   {/* Spotlight Section */}
                   <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5 text-rose-500" />
                       值得关注的异动个股 (Spotlight)
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {dragonData.filter((d: any) => d.focus).map((item: any, i: number) => (
                         <div key={"focus-"+i} className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <div className="font-bold text-slate-800 text-base">{item.name} <span className="text-xs font-mono text-slate-400 ml-1">{item.symbol}</span></div>
                               <div className="text-[10px] text-slate-500 mt-0.5">{item.type}</div>
                             </div>
                             <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", item.instNetBuy > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                               机构净 {item.instNetBuy > 0 ? '买' : '卖'}: {Math.abs(item.instNetBuy)}万
                             </span>
                           </div>
                           <p className="text-xs text-rose-600/90 font-medium leading-relaxed my-3 bg-rose-50/50 p-2 rounded-lg border border-rose-50/50">
                             {item.focusReason}
                           </p>
                           <div className="flex flex-wrap gap-1 mt-2">
                             {item.sectors?.slice(0, 3).map((sec: string, idx: number) => (
                               <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{sec}</span>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Full List */}
                   <div className="overflow-x-auto w-full">
                     <table className="w-full text-left border-collapse text-sm">
                       <thead className="bg-white text-slate-400 border-b border-slate-200">
                         <tr>
                           <th className="py-3 px-6 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">股票代码/简称</th>
                           <th className="py-3 px-6 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">异动类型</th>
                           <th className="py-3 px-6 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap text-right">资金力量 (万元)</th>
                           <th className="py-3 px-6 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">买方前排核心席位</th>
                           <th className="py-3 px-6 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">卖方前排核心席位</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {dragonData.length > 0 ? dragonData.map((item: any, i: number) => (
                            <tr key={item.id || i} className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-4 px-6 align-top min-w-[120px]">
                                <div className="font-bold text-slate-800">{item.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono mb-2">{item.symbol}</div>
                                <div className="flex flex-wrap gap-1">
                                  {item.sectors?.slice(0, 2).map((sec: string, idx: number) => (
                                    <span key={idx} className="text-[9px] px-1 bg-slate-100 text-slate-500 rounded">{sec}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-6 align-top max-w-[150px]">
                                <div className={cn("inline-flex px-2 py-0.5 rounded text-[10px] font-bold mb-1", item.type.includes('跌') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                                  {item.type}
                                </div>
                                <div className="text-[10px] text-slate-500 leading-tight" title={item.reason}>{item.reason.length > 18 ? item.reason.substring(0, 18) + '...' : item.reason}</div>
                              </td>
                              <td className="py-4 px-6 align-top text-right min-w-[140px]">
                                <div className="mb-2 flex justify-end items-center">
                                  <span className="text-[10px] text-slate-500 mr-2">机构净买</span>
                                  <span className={cn("font-mono font-bold text-xs inline-block w-16 text-right", item.instNetBuy > 0 ? "text-rose-500" : "text-emerald-500")}>
                                    {item.instNetBuy > 0 ? '+' : ''}{item.instNetBuy}
                                  </span>
                                </div>
                                <div className="flex justify-end items-center">
                                  <span className="text-[10px] text-slate-500 mr-2">游资净买</span>
                                  <span className={cn("font-mono font-bold text-xs inline-block w-16 text-right", item.hotMoneyNetBuy > 0 ? "text-rose-500" : "text-emerald-500")}>
                                    {item.hotMoneyNetBuy > 0 ? '+' : ''}{item.hotMoneyNetBuy}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 align-top max-w-[200px]">
                                <div className="flex flex-col gap-1.5">
                                  {item.buySeats?.slice(0, 3).map((seat: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px] group relative">
                                      <span className={cn("truncate mr-2", seat.name.includes('机构') ? 'text-indigo-600 font-medium' : 'text-slate-600')} title={seat.name}>{seat.name}</span>
                                      <span className="font-mono text-slate-400 group-hover:text-rose-500 transition-colors">{seat.amount}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-6 align-top max-w-[200px]">
                                <div className="flex flex-col gap-1.5">
                                  {item.sellSeats?.slice(0, 3).map((seat: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px] group relative">
                                      <span className={cn("truncate mr-2", seat.name.includes('机构') ? 'text-indigo-600 font-medium' : 'text-slate-600')} title={seat.name}>{seat.name}</span>
                                      <span className="font-mono text-slate-400 group-hover:text-emerald-500 transition-colors">{seat.amount}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                         )) : (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">暂无异动龙虎榜数据</td>
                            </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </Card>`, 'utf8').toString();

const dragonStart = '                 {/* Dragon Tiger List */}';
const targetString = "           {activeTab === 'macro' && (";

const startIndex = code.indexOf(dragonStart);
const macroHeaderIndex = code.indexOf(targetString);

let slicedCode = code.substring(startIndex, macroHeaderIndex);
const endIndexOffset = slicedCode.lastIndexOf('             </div>\n           )}\n');

code = code.substring(0, startIndex) + replacement + "\n" + code.substring(startIndex + endIndexOffset);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated dragon tiger UI!");

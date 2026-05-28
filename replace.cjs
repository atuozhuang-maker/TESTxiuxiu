const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{dragonData\.length > 0 \? dragonData\.map.*?<\/tbody>/s;

const repl2 = `{dragonData.length > 0 ? dragonData.map((item, i) => (
                            <tr key={item.id || i} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 align-top">
                                <div className="font-bold text-slate-800">{item.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono mb-1">{item.symbol}</div>
                                <span className="inline-block px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9.5px] font-medium whitespace-nowrap mb-1">{item.type}</span>
                                <div className="text-[9.5px] text-slate-400 max-w-[120px] leading-tight break-words" title={item.reason}>{item.reason}</div>
                              </td>
                              <td className="py-3 px-4 text-right align-top">
                                <div className="flex flex-col gap-2">
                                  <div>
                                    <div className="text-[10px] text-slate-400 mb-0.5">机构总净额</div>
                                    <span className={cn("font-bold text-sm", item.instNetBuy > 0 ? "text-rose-500" : "text-emerald-500")}>
                                      {item.instNetBuy > 0 ? "+" : ""}{item.instNetBuy.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-slate-400 mb-0.5">游资总净额</div>
                                    <span className={cn("font-bold text-sm", item.hotMoneyNetBuy > 0 ? "text-rose-500" : "text-emerald-500")}>
                                      {item.hotMoneyNetBuy > 0 ? "+" : ""}{item.hotMoneyNetBuy.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 align-top w-48">
                                {item.buySeats && item.buySeats.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {item.buySeats.map((seat, idx) => (
                                      <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                                        <div className="text-xs font-medium text-rose-700 w-32 leading-tight break-words" title={seat.name}>{seat.name}</div>
                                        <div className="text-[10px] text-rose-500 font-mono ml-2 shrink-0">{seat.amount.toLocaleString()}w</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="py-3 px-4 align-top w-48">
                                {item.sellSeats && item.sellSeats.length > 0 ? (
                                  <div className="flex flex-col gap-1.5">
                                    {item.sellSeats.map((seat, idx) => (
                                      <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                                        <div className="text-xs font-medium text-emerald-700 w-32 leading-tight break-words" title={seat.name}>{seat.name}</div>
                                        <div className="text-[10px] text-emerald-500 font-mono ml-2 shrink-0">-{seat.amount.toLocaleString()}w</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : <span className="text-slate-300">-</span>}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-400">加载中...</td>
                            </tr>
                          )}
                        </tbody>`;

if (code.match(regex)) {
  code = code.replace(regex, repl2);
  fs.writeFileSync('src/App.tsx', code);
  console.log('done via regex!');
} else {
  console.log('regex NOT match');
}

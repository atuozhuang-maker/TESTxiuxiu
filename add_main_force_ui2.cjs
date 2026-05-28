const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const marginSectionStart = app.indexOf('<Card className="p-6 flex flex-col min-h-[400px]">');
if (marginSectionStart !== -1) {
  const marginSectionEnd = app.indexOf('</Card>', marginSectionStart);
  if (marginSectionEnd !== -1) {
    const insertPos = marginSectionEnd + '</Card>'.length;
    
    const uiStr = `\n                {/* Main Force Capital Flow */}
                <Card className="p-6 mt-6">
                  <div className="mb-4 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                       今日主力资金流向极值 (Top Inflow/Outflow)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">捕捉实时的大额行业净流入与净流出，反映核心资金攻击与撤退方向。</p>
                  </div>
                  
                  {mainForceData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                         <h4 className="text-xs font-bold text-rose-500 mb-3 flex items-center gap-1">
                            <TrendingUp size={14} /> 主力爆买榜 (流入前五)
                         </h4>
                         <div className="flex flex-col gap-2">
                           {mainForceData.inflows.map((item, idx) => (
                             <div key={item.symbol} className="flex justify-between items-center p-2 rounded hover:bg-rose-50/50 transition-colors">
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold text-slate-300 w-3">{idx + 1}</span>
                                 <span className="text-sm font-bold text-slate-800">{item.name}</span>
                               </div>
                               <span className="text-sm font-mono font-bold text-rose-500">+{item.netBuy} 亿</span>
                             </div>
                           ))}
                         </div>
                       </div>
                       
                       <div>
                         <h4 className="text-xs font-bold text-emerald-500 mb-3 flex items-center gap-1">
                            <ArrowDownRight size={14} /> 主力抛售榜 (流出前五)
                         </h4>
                         <div className="flex flex-col gap-2">
                           {mainForceData.outflows.map((item, idx) => (
                             <div key={item.symbol} className="flex justify-between items-center p-2 rounded hover:bg-emerald-50/50 transition-colors">
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold text-slate-300 w-3">{idx + 1}</span>
                                 <span className="text-sm font-bold text-slate-800">{item.name}</span>
                               </div>
                               <span className="text-sm font-mono font-bold text-emerald-500">{item.netBuy} 亿</span>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="w-full py-8 flex items-center justify-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-xs">加载行情中...</span>
                    </div>
                  )}
                </Card>`;
                
    app = app.substring(0, insertPos) + uiStr + app.substring(insertPos);
    fs.writeFileSync('src/App.tsx', app);
    console.log("App.tsx UI inserted successfully");
  } else {
    console.log("Could not find </Card> after margin start");
  }
} else {
  console.log("Could not find Margin Data Card");
}

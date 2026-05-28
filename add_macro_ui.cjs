const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              {/* MARKET RISK APPETITE BANNER */}`;

const newCode = `              {/* MACRO LIQUIDITY BANNER */}
              <div className="bg-white rounded-xl p-0 border border-blue-100 shadow-sm overflow-hidden mb-6 relative">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
                <div className="p-4 md:p-5 border-b border-blue-50/50 bg-gradient-to-r from-blue-50/50 to-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-extrabold text-slate-800 flex items-center gap-2">
                      🌊 宏观流动性 <span className="text-slate-500 font-medium text-sm">(大Beta辅助参考)</span>
                    </h2>
                  </div>
                </div>
                
                {macroData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">1</span>
                         <h3 className="text-sm font-bold text-slate-700">央行公开市场操作</h3>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xl font-bold text-slate-800">{macroData.omo.netInjection > 0 ? \`+\${macroData.omo.netInjection}\` : macroData.omo.netInjection} 亿</span>
                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">净投放</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{macroData.omo.description}</p>
                    </div>

                    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">2</span>
                         <h3 className="text-sm font-bold text-slate-700">银行间市场利率 <span className="font-normal text-slate-500">(DR007等)</span></h3>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xl font-bold text-slate-800">{macroData.dr007.current.toFixed(2)}%</span>
                        <span className="text-xs text-slate-400">MA5: {macroData.dr007.ma5.toFixed(2)}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{macroData.dr007.description}</p>
                    </div>

                    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">3</span>
                         <h3 className="text-sm font-bold text-slate-700">中美利差与人民币汇率</h3>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xl font-bold text-slate-800">{macroData.spread.spreadBps} <span className="text-sm font-normal text-slate-500">bps</span></span>
                        <span className="text-xs font-medium text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">USD/CNY {macroData.spread.usdCny.toFixed(4)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{macroData.spread.description} <span className="inline-flex w-3 h-3 rounded-full bg-slate-200 items-center justify-center text-[8px] text-slate-500 font-bold ml-1">4</span></p>
                    </div>

                    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">4</span>
                         <h3 className="text-sm font-bold text-slate-700">信用利差</h3>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xl font-bold text-slate-800">{macroData.creditSpread.currentBps} <span className="text-sm font-normal text-slate-500">bps</span></span>
                        <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">持续收窄</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{macroData.creditSpread.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full py-8 flex items-center justify-center text-slate-400">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-xs">正在分析宏观流动性数据...</span>
                  </div>
                )}
              </div>

              {/* MARKET RISK APPETITE BANNER */}`;

if (true) {
  fs.writeFileSync('src/App.tsx', code.replace('              {/* MARKET RISK APPETITE BANNER */}', newCode));
  console.log('Appended Macro UI');
} else {
  console.log('Could not find targetStr to replace');
}

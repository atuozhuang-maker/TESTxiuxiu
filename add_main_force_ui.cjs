const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
const statePattern = /const \[marginData, setMarginData\] = useState<any\[\]>\(\[\]\);/;
const newState = `const [marginData, setMarginData] = useState<any[]>([]);\n  const [mainForceData, setMainForceData] = useState<{inflows: any[], outflows: any[]} | null>(null);`;
app = app.replace(statePattern, newState);

// 2. Add fetch function
const fetchPattern = /const fetchMargin = async \(\) => \{[\s\S]*?\} catch \(err\) \{\}\n    \};\n/;
const newFetch = `
    const fetchMainForce = async () => {
      try {
        const res = await fetch("/api/mainforce");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMainForceData(data.data);
          }
        }
      } catch (err) {}
    };

`;
// Insert after fetchMargin
app = app.replace(fetchPattern, match => match + newFetch);

// 3. Call fetch function
const callPattern = /fetchMargin\(\);\n/;
app = app.replace(callPattern, match => match + "    fetchMainForce();\n");

// 4. Update the chart Domain
app = app.replace(
  '<YAxis yAxisId="margin" domain={[\'auto\', \'auto\']} tickFormatter={(v) => `${(v/10000).toFixed(2)}万亿`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />',
  '<YAxis yAxisId="margin" domain={[\'dataMin - 1000\', \'dataMax + 1000\']} tickFormatter={(v) => `${(v/10000).toFixed(2)}万亿`} axisLine={false} tickLine={false} fontSize={10} stroke="#ef4444" />'
);
app = app.replace(
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'auto\', \'auto\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />',
  '<YAxis yAxisId="shIndex" orientation="right" domain={[\'dataMin - 150\', \'dataMax + 150\']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />'
);
app = app.replace(
  '<YAxis yAxisId="net" orientation="right" hide />',
  '<YAxis yAxisId="net" orientation="right" domain={[\'dataMin - 50\', \'dataMax + 100\']} hide />'
);

// 5. Add Main Force UI right after Margin Data Card
const marginEndPattern = /<\/Card>\n\s*?<\/div>\n\s*?<\/div>\n\s*?}\)/;
// Wait, margin ends like this:
//                     )}
//                   </div>
//                 </Card>
//               </div>
//             </div>
//           )}
//           {activeTab === 'institution' && (

// Let's do a replace based on finding the end of activeTab === 'capital'
const capitalContentMatch = app.indexOf('</Card>');
// Wait, I need an exact string literal to replace.
const exactLiteral = `                    )}
                  </div>
                </Card>`;

const uiStr = `                    )}
                  </div>
                </Card>

                {/* Main Force Capital Flow */}
                <Card className="p-6">
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

app = app.replace(exactLiteral, uiStr);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx UI updated");

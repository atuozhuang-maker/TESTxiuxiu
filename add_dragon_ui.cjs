const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
const statePattern = /const \[mainForceData, setMainForceData\] = useState[\s\S]*?;/;
app = app.replace(statePattern, match => match + '\\n  const [dragonData, setDragonData] = useState<any[]>([]);');

// 2. Add fetch function
const fetchPattern = /const fetchMainForce = async \(\) => \{[\s\S]*?\} catch \(err\) \{\}\n    \};\n/;
const fetchDragonLogic = `
    const fetchDragon = async () => {
      try {
        const res = await fetch("/api/dragon");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setDragonData(data.data);
          }
        }
      } catch (err) {}
    };
`;
app = app.replace(fetchPattern, match => match + fetchDragonLogic);

// 3. Call fetch
const callPattern = /fetchMainForce\(\);\n/;
app = app.replace(callPattern, match => match + "    fetchDragon();\\n");

// 4. Add UI section at the end of the capital tab
// Let's locate the end of activeTab === 'capital'. It's right before {activeTab === 'institution' && (

const insertIndex = app.indexOf("{activeTab === 'institution' &&");

const dragonUI = `
                {/* Dragon Tiger List */}
                <div className="mt-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="text-purple-500" size={20} />
                    游资打板揭秘 (今日实时龙虎榜)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dragonData.length > 0 ? dragonData.slice(0, 9).map(item => (
                      <Card key={item.symbol} className="overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", 
                              item.type.includes('涨') ? "bg-rose-100 text-rose-600" : 
                              item.type.includes('跌') ? "bg-emerald-100 text-emerald-600" : 
                              "bg-amber-100 text-amber-600")}>
                              {item.type}
                            </span>
                            <span className="font-bold text-slate-800">{item.name}</span>
                          </div>
                          <span className={cn("text-xs font-mono font-bold", item.change > 0 ? "text-rose-500" : "text-emerald-500")}>
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] text-slate-500">主力净额</span>
                            <span className={cn("text-sm font-mono font-bold", item.netBuy > 0 ? "text-rose-500" : "text-emerald-500")}>
                              {item.netBuy > 0 ? '+' : ''}{item.netBuy} 万
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2" title={item.reason}>
                            {item.reason}
                          </p>
                        </div>
                      </Card>
                    )) : (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 flex items-center justify-center text-slate-400">
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span className="text-xs">获取龙虎榜数据中...</span>
                      </div>
                    )}
                  </div>
                </div>

               </div>
             </div>
           )}
           `;

// Replace `           </div>\n             </div>\n           )}\n`
const uiReplaceRegex = / {15}<\/div>\n {13}<\/div>\n {11}\)}\n\s*\{activeTab === 'institution' &&/;

if (uiReplaceRegex.test(app)) {
  app = app.replace(uiReplaceRegex, dragonUI + "           {activeTab === 'institution' &&");
  fs.writeFileSync('src/App.tsx', app);
  console.log('App.tsx updated properly');
} else {
  // alternative location finding
  console.log('Could not find ui target to insert Dragon UI');
}

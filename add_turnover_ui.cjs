const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  'const [marketAtmosphere, setMarketAtmosphere] = useState({ upCount: 2600, downCount: 2400, upLimit: 30, downLimit: 10, nbFlow: 15.5, index: 55 });',
  'const [marketAtmosphere, setMarketAtmosphere] = useState({ upCount: 2600, downCount: 2400, upLimit: 30, downLimit: 10, nbFlow: 15.5, index: 55, totalTurnover: 0 });'
);

const turnoverUI = `
                  <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">A股总成交额</span>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold font-mono tracking-tighter leading-none text-slate-800">
                        {marketAtmosphere.totalTurnover > 0 ? (marketAtmosphere.totalTurnover / 10000).toFixed(2) : '--'}
                      </span>
                      <span className="text-xs text-slate-400 leading-normal">万亿</span>
                    </div>
                  </div>
`;

// Insert after the first divider
app = app.replace(
  '<div className="h-10 w-px bg-slate-100 hidden md:block"></div>',
  turnoverUI
);

fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx turnover UI updated');

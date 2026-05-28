const fs = require('fs');

const dynamicFlowChartCode = `import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const colors = [
  '#fafa6e', '#bdea75', '#86d780', '#54c28c', '#24ab95', '#009395', '#007b92', '#006288', '#004c7a',
  '#facc15', '#fb923c', '#fb7185', '#c084fc', '#818cf8', '#38bdf8', '#4ade80', '#e879f9', '#f87171',
  '#fbbf24', '#34d399'
];

export function DynamicFlowChart() {
  const [data, setData] = useState<any[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-05-27');

  const availableDates = ['2026-05-21', '2026-05-22', '2026-05-25', '2026-05-26', '2026-05-27'];

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(\`/api/dynamic?date=\${selectedDate}\`);
        const json = await res.json();
        if (active && json.success) {
          setData(json.data);
          setSectors(json.sectors);
          setCurrentIndex(0);
          setIsPlaying(true);
        }
      } catch(err) {
        console.error(err);
      } finally {
        if(active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [selectedDate]);

  // Speed logic
  useEffect(() => {
    if (!data || data.length === 0 || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < data.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [data, isPlaying]);

  if (loading || !data || data.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-slate-500 bg-[#0f1015] rounded-xl">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const width = 1200;
  const height = 700;
  const maxX = 240;

  let maxFlow = 200;
  let minFlow = -100;
  data.forEach(d => {
    sectors.forEach(s => {
      if (d[s] > maxFlow) maxFlow = d[s];
      if (d[s] < minFlow) minFlow = d[s];
    });
  });
  
  maxFlow = Math.ceil(maxFlow / 50) * 50;
  minFlow = Math.floor(minFlow / 50) * 50;
  if(maxFlow < 200) maxFlow = 200;
  if(minFlow > -100) minFlow = -100;

  const paddingLeft = 40;
  const paddingRight = 350; // generous space for labels safely inside SVG
  const paddingTop = 40;
  const paddingBottom = 40;

  const getX = (index: number) => paddingLeft + (index / maxX) * (width - paddingLeft - paddingRight);
  const getY = (flow: number) => paddingTop + height - paddingBottom - paddingTop - ((flow - minFlow) / (maxFlow - minFlow)) * (height - paddingTop - paddingBottom);

  const currentPoint = data[currentIndex] || data[0];
  
  // Sort sectors by current value to handle label collision 
  const rankedSectors = [...sectors].sort((a, b) => currentPoint[b] - currentPoint[a]);

  // Label positions with anti-collision
  const labelPositions: Record<string, number> = {};
  rankedSectors.forEach((s, i) => {
    let idealY = getY(currentPoint[s]);
    // simple anti-collision: check previous label
    if (i > 0) {
      const prevS = rankedSectors[i - 1];
      const prevY = labelPositions[prevS];
      if (idealY - prevY < 20) {
        idealY = prevY + 20; // push down
      }
    }
    labelPositions[s] = idealY;
  });

  return (
    <div className="w-full flex-1 flex flex-col min-h-[600px] h-full bg-[#0f1015] rounded-xl overflow-hidden shadow-2xl p-4 md:p-6 border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pl-2 gap-4">
        <h2 className="text-slate-100 font-bold text-xl tracking-wider flex items-center gap-3">
          板块主力资金流向动态 
          <div className="flex bg-slate-800/80 rounded-lg p-1">
            {availableDates.map(d => (
              <button 
                key={d}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                  selectedDate === d ? "bg-blue-600 text-white shadow-md shadow-blue-900/50" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                )}
              >
                {d.substring(5)}
              </button>
            ))}
          </div>
        </h2>
        <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">
           <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
             {currentPoint.time}
           </span>
           <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-700 text-slate-100 rounded hover:bg-slate-600 transition-colors shadow-sm">
             {isPlaying ? <Pause size={16} /> : <Play size={16} />}
           </button>
           <button onClick={() => { setCurrentIndex(0); setIsPlaying(true); }} className="p-2 bg-slate-700 text-slate-100 rounded hover:bg-slate-600 transition-colors shadow-sm">
             <RotateCcw size={16} />
           </button>
        </div>
      </div>
      
      {/* Scrubber slider */}
      <div className="w-full px-2 py-3 bg-slate-800/30 rounded-lg mb-4 flex items-center gap-4">
        <span className="text-xs font-mono text-slate-400">09:30</span>
        <input 
          type="range" 
          min="0" 
          max={data.length - 1} 
          value={currentIndex} 
          onChange={(e) => {
            setCurrentIndex(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-xs font-mono text-slate-400">15:00</span>
      </div>
      
      <div className="flex-1 w-full relative">
        <svg viewBox={\`0 0 \${width} \${height}\`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {/* Y Axis lines */}
          <g className="text-[#334155] text-[12px] font-mono">
            {[...Array(Math.floor((maxFlow-minFlow)/50) + 1)].map((_, i) => {
              const v = maxFlow - i * 50;
              const y = getY(v);
              return (
                <g key={i}>
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight + 20} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray={v === 0 ? "" : "4 4"} />
                  <text x={0} y={y} dy="4" fill={v === 0 ? "#94a3b8" : "#475569"}>{v}</text>
                </g>
              )
            })}
          </g>

          {/* X Axis Time markers */}
          <g className="text-[#475569] text-[12px] font-mono">
             {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((idx) => {
                const x = getX(idx);
                let hr = idx < 120 ? 9 + Math.floor((idx+30)/60) : 13 + Math.floor((idx-120)/60);
                let min = idx < 120 ? (idx+30)%60 : (idx-120)%60;
                let time = \`\${String(hr).padStart(2,'0')}:\${String(min).padStart(2,'0')}\`;
                return (
                  <g key={idx}>
                    <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#1e293b" strokeWidth="1" />
                    <text x={x} y={height - paddingBottom + 15} textAnchor="middle">{time}</text>
                  </g>
                )
             })}
          </g>

          {/* Trend Lines */}
          {sectors.map((s, idx) => {
            const points = data.slice(0, currentIndex + 1).map(d => \`\${getX(d.index)},\${getY(d[s])}\`).join(" ");
            const isTop = rankedSectors.indexOf(s) < 5;
            return (
              <polyline 
                 key={s} 
                 points={points} 
                 fill="none" 
                 stroke={colors[idx % colors.length]} 
                 strokeWidth={isTop ? "3" : "1.5"}
                 strokeLinejoin="round"
                 opacity={isTop ? 1 : 0.4}
                 className="transition-all duration-300"
              />
            )
          })}
          
          {/* Internal Labels */}
          {sectors.map((s, idx) => {
             const val = currentPoint[s];
             const xPos = getX(currentPoint.index);
             const yPos = labelPositions[s];
             const rank = rankedSectors.indexOf(s) + 1;
             const color = colors[idx % colors.length];
             
             return (
               <g key={\`label-\${s}\`} 
                  className="transition-all duration-150 ease-linear"
                  style={{
                    transform: \`translate(\${xPos + 8}px, \${yPos + 4}px)\`,
                    opacity: rank <= 15 ? 1 : 0.3
                  }}
               >
                 <text
                   fill={color}
                   fontSize="14"
                   fontWeight="bold"
                   style={{
                     textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)'
                   }}
                 >
                   {rank}. {s} {val > 0 ? '+' : ''}{val.toFixed(2)}(亿)
                 </text>
               </g>
             );
          })}
        </svg>
      </div>
    </div>
  )
}
`;

fs.writeFileSync('src/components/DynamicFlowChart.tsx', dynamicFlowChartCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/<DynamicFlowChart data=\{dynamicFlowData\.data\} sectors=\{dynamicFlowData\.sectors\} \/>/, '<DynamicFlowChart />');
fs.writeFileSync('src/App.tsx', appCode);

console.log('updated files');

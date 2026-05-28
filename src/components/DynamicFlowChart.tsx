import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const colors = [
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
  '#eab308', // yellow
  '#14b8a6', // teal
  '#84cc16'  // lime
];

const getSectorColor = (sector: string) => {
  let hash = 0;
  for (let i = 0; i < sector.length; i++) {
    hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

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
        const res = await fetch(`/api/dynamic?date=${selectedDate}`);
        const json = await res.json();
        if (active && json.success) {
          setData(json.data);
          setSectors(json.sectors);
          console.log(json.data.length, "points loaded");
          // If we are looking at today, and the market is open, start at the end or begin?
          // The user wanted to pause and look. Let's auto play from beginning.
          setCurrentIndex(0);
          setIsPlaying(true);
        }
      } catch(err) {
        console.error("Fetch error:", err);
      } finally {
        if(active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [selectedDate]);

  // Playback timer
  useEffect(() => {
    if (!data || data.length === 0 || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < data.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 250); // slower playback to avoid React Profiler memory issues
    return () => clearInterval(timer);
  }, [data, isPlaying]);

  if (loading || !data || data.length === 0) {
    return (
      <div className="w-full h-[650px] flex items-center justify-center text-slate-500 bg-[#0f1015] rounded-xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 border-r-amber-500 rounded-full animate-spin"></div>
          <span className="font-mono text-sm">正在加载全市场实时资金流数据 (Fetching from API)...</span>
        </div>
      </div>
    );
  }

  const width = 1200;
  const height = 650;
  const maxX = 240; // Full trading day minutes

  // Calculate dynamic scale
  let maxFlow = 50;
  let minFlow = -50;
  data.forEach(d => {
    sectors.forEach(s => {
      if (d[s] > maxFlow) maxFlow = d[s];
      if (d[s] < minFlow) minFlow = d[s];
    });
  });
  
  // Nice round numbers for Y axis
  const getStep = (span: number) => {
    if (span > 500) return 100;
    if (span > 200) return 50;
    if (span > 100) return 20;
    return 10;
  };
  
  const span = maxFlow - minFlow;
  const step = getStep(span);
  
  maxFlow = Math.ceil(maxFlow / step) * step;
  minFlow = Math.floor(minFlow / step) * step;

  const paddingLeft = 60;
  const paddingRight = 320; 
  const paddingTop = 40;
  const paddingBottom = 40;

  const getX = (index: number) => paddingLeft + (index / maxX) * (width - paddingLeft - paddingRight);
  const getY = (flow: number) => paddingTop + height - paddingBottom - paddingTop - ((flow - minFlow) / (maxFlow - minFlow)) * (height - paddingTop - paddingBottom);

  const currentPoint = data[currentIndex] || data[0];
  
  // Sort sectors by current value to handle leaderboard
  const rankedSectors = [...sectors].sort((a, b) => currentPoint[b] - currentPoint[a]);

  // Identify top sectors to highlight
  const hoveredSector = null; // optional: add interactivity later

  return (
    <div className="w-full flex-1 flex flex-col min-h-[650px] bg-[#0b0c10] rounded-xl overflow-hidden shadow-2xl p-4 md:p-6 border border-slate-800">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 pl-2 gap-4">
        <div>
          <h2 className="text-slate-100 font-bold text-xl tracking-wider flex items-center gap-2">
            <Activity className="text-amber-400" size={24} />
            板块主力净流入实时追踪 (EastMoney API)
          </h2>
          <p className="text-slate-400 text-sm mt-1">自动获取东方财富全行业板块真实实时流向</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700/50">
            {availableDates.map(d => (
              <button 
                key={d}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-300",
                  selectedDate === d ? "bg-amber-500 text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                )}
              >
                {d.substring(5)}
                {d === '2026-05-27' && <span className="ml-1 opacity-70">今日</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50">
           <span className="text-sm font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded border border-amber-400/20 font-bold min-w-[70px] text-center shadow-inner">
             {currentPoint?.time || '09:30'}
           </span>
           <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-700/80 text-slate-100 rounded hover:bg-slate-600 transition-colors shadow-sm">
             {isPlaying ? <Pause size={18} /> : <Play size={18} />}
           </button>
           <button onClick={() => { setCurrentIndex(0); setIsPlaying(true); }} className="p-2 bg-slate-700/80 text-slate-100 rounded hover:bg-slate-600 transition-colors shadow-sm">
             <RotateCcw size={18} />
           </button>
          </div>
        </div>
      </div>
      
      {/* Scrubber slider */}
      <div className="w-full px-2 py-3 bg-slate-900/50 rounded-lg mb-4 flex items-center gap-4 border border-slate-800/80">
        <span className="text-xs font-mono text-slate-500">09:30</span>
        <input 
          type="range" 
          min="0" 
          max={data.length - 1} 
          value={currentIndex} 
          onChange={(e) => {
            setCurrentIndex(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <span className="text-xs font-mono text-slate-500">{data.length < 240 && selectedDate === '2026-05-27' ? data[data.length-1]?.time : '15:00'}</span>
      </div>
      
      {/* Chart Canvas */}
      <div className="flex-1 w-full relative group">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {/* Background Gradient */}
          <defs>
             <linearGradient id="bgGrid" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8"/>
               <stop offset="100%" stopColor="#020617" stopOpacity="0.8"/>
             </linearGradient>
          </defs>
          <rect x={paddingLeft} y={paddingTop} width={width - paddingLeft - paddingRight} height={height - paddingTop - paddingBottom} fill="url(#bgGrid)" rx="8" />

          {/* Y Axis lines - zero line prominent */}
          <g className="text-[#64748b] text-[12px] font-mono">
            {[...Array(Math.floor((maxFlow-minFlow)/step) + 1)].map((_, i) => {
              const v = maxFlow - i * step;
              const y = getY(v);
              const isZero = v === 0;
              return (
                <g key={i}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke={isZero ? "#475569" : "#1e293b"} 
                    strokeWidth={isZero ? "1.5" : "1"} 
                    strokeDasharray={isZero ? "" : "4 4"} 
                  />
                  <text x={paddingLeft - 8} y={y} dy="4" fill={isZero ? "#e2e8f0" : "#64748b"} textAnchor="end">{v}</text>
                </g>
              )
            })}
          </g>

          {/* X Axis Time markers */}
          <g className="text-[#64748b] text-[12px] font-mono">
             {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((idx) => {
                if (idx > maxX) return null;
                const x = getX(idx);
                let hr = idx < 120 ? 9 + Math.floor((idx+30)/60) : 13 + Math.floor((idx-120)/60);
                let min = idx < 120 ? (idx+30)%60 : (idx-120)%60;
                let time = `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
                return (
                  <g key={idx}>
                    <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#1e293b" strokeWidth="1" />
                    <text x={x} y={height - paddingBottom + 20} textAnchor="middle">{time}</text>
                  </g>
                )
             })}
          </g>

          {/* Data Lines */}
          {sectors.map((s, idx) => {
            const points = data.slice(0, currentIndex + 1).map(d => `${getX(d.index || data.indexOf(d))},${getY(d[s])}`).join(" ");
            const rank = rankedSectors.indexOf(s);
            const isTop = rank < 4;
            const isBottom = rank >= sectors.length - 3;
            // Highlight top/bottom strongly
            const opacity = isTop || isBottom ? 1 : 0.25;
            const strokeWidth = isTop || isBottom ? "3" : "1.5";
            
            return (
              <polyline 
                 key={s} 
                 points={points} 
                 fill="none" 
                 stroke={getSectorColor(s)} 
                 strokeWidth={strokeWidth}
                 strokeLinejoin="round"
                 opacity={opacity}
                 className="transition-all duration-300"
              />
            )
          })}
          
          {/* Vertical Current Time Indicator Line */}
          {currentPoint && (
             <g>
                <line 
                  x1={getX(currentPoint.index || currentIndex)} 
                  y1={paddingTop} 
                  x2={getX(currentPoint.index || currentIndex)} 
                  y2={height - paddingBottom} 
                  stroke="#fbbf24" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                  opacity="0.5"
                />
             </g>
          )}
          
          {/* Right Side Leaderboard */}
          <g transform={`translate(${width - paddingRight + 20}, ${paddingTop})`}>
            {/* Header */}
            <text x="0" y="0" fill="#94a3b8" fontSize="13" fontWeight="bold">板块排行</text>
            <text x="170" y="0" fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="end">净流入(亿)</text>
            
            {rankedSectors.map((s, rankIdx) => {
               const val = currentPoint[s];
               const color = getSectorColor(s);
               const yPos = 25 + rankIdx * 25; // Compact vertical spacing
               
               // Background highlight for top
               const isTop = rankIdx < 3;
               
               return (
                 <g key={`label-${s}`} 
                    className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ transform: `translate(0px, ${yPos}px)` }}
                 >
                   {isTop && (
                     <rect x="-8" y="-12" width="190" height="20" fill={color} fillOpacity="0.1" rx="4" />
                   )}
                   <rect x="0" y="-8" width="6" height="12" fill={color} rx="2" />
                   <text
                     x="15"
                     fill="#f8fafc"
                     fontSize="14"
                     fontWeight={isTop ? "bold" : "normal"}
                     opacity={rankIdx > 14 ? 0.6 : 1}
                   >
                     {rankIdx + 1}. {s.substring(0, 8)}{s.length>8?'...':''}
                   </text>
                   <text
                     x="170"
                     fill={val >= 0 ? "#ef4444" : "#10b981"} // Red for positive, Green for negative in China
                     fontSize="14"
                     fontWeight="bold"
                     textAnchor="end"
                     opacity={rankIdx > 14 ? 0.6 : 1}
                   >
                     {val > 0 ? '+' : ''}{val.toFixed(2)}
                   </text>
                 </g>
               );
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}

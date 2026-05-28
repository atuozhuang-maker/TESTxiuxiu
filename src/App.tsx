import React, { useState, useEffect, useRef } from 'react';
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Brush, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, Clock, 
  Filter, LayoutDashboard, LineChart as LineChartIcon, PieChart, 
  Search, Settings, ShieldAlert, TrendingUp, Wallet, Info, Building, Target, Crosshair, Factory, PlaySquare
} from 'lucide-react';
import { cn } from './lib/utils';
import { DynamicFlowChart } from './components/DynamicFlowChart';
import { format } from 'date-fns';

// --- TYPES ---
interface Quote {
  symbol: string;
  name: string;
  open: number;
  prevClose: number;
  price: number;
  high: number;
  low: number;
  buy: number;
  sell: number;
  volume: number;
  amount: number;
  ma20Volume?: number;
  ma20Amount?: number;
  date: string;
  time: string;
}

// --- MOCK DATA ---
const timeframeData = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date(2023, 9, i + 1);
  return {
    date: format(date, 'MM-dd'),
    csi300: Math.floor(Math.random() * 5000) - 1000, // 沪深300
    csi500: Math.floor(Math.random() * 3000) - 500,  // 中证500
    csi1000: Math.floor(Math.random() * 2000) - 800, // 中证1000
    total: 0 // calculated below
  };
}).map(item => ({ ...item, total: item.csi300 + item.csi500 + item.csi1000 }));

// --- UI COMPONENTS ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => ( 
  <div ref={ref} className={cn("rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-md text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:bg-white", className)} {...props}>
    {children}
  </div>
));

function StatCard({ title, value, change, trend, icon: Icon, explanation }: any) {
  const isUp = trend === 'up';
  // Remember: In A-shares, Red is Up/Buy, Green is Down/Sell
  const trendColor = isUp ? 'text-rose-500' : 'text-emerald-500';
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-4 md:p-6 relative group overflow-hidden border-slate-200/70 hover:border-blue-200/60 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-medium text-slate-500 tracking-wide">{title}</p>
          {explanation && (
            <div className="group/tooltip relative flex items-center">
              <Info size={14} className="text-slate-300 hover:text-slate-500 cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-[11px] leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none">
                {explanation}
                <div className="absolute left-1/2 -ml-1 top-full border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl transition-colors group-hover:bg-slate-200 group-hover:text-slate-600">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-2 z-10 relative">
        <h2 className="text-2xl md:text-3xl font-mono font-semibold tracking-tight text-slate-900">{value}</h2>
      </div>
      <div className="mt-3 flex items-center text-[13px] z-10 relative">
        <span className={cn("flex items-center font-bold px-1.5 py-0.5 rounded-md", isUp ? "bg-rose-50" : "bg-emerald-50", trendColor)}>
          <TrendIcon size={14} className="mr-0.5" strokeWidth={3} />
          {change}
        </span>
      </div>
    </Card>
  );
}

const AnimatedTableRow: React.FC<{ item: any; children: React.ReactNode; className?: string }> = ({ item, children, className }) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPrice = useRef(item.price);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (item.price > prevPrice.current) {
      setFlash('up');
      timer = setTimeout(() => setFlash(null), 800);
    } else if (item.price < prevPrice.current) {
      setFlash('down');
      timer = setTimeout(() => setFlash(null), 800);
    }
    prevPrice.current = item.price;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [item.price]);

  const flashClass = flash === 'up' ? 'bg-rose-100/50' : flash === 'down' ? 'bg-emerald-100/50' : '';
  const transitionClass = flash ? 'transition-none' : 'transition-colors duration-1000';

  return (
    <tr className={cn(className, flashClass, transitionClass)}>
      {children}
    </tr>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [northbound, setNorthbound] = useState<any[]>([]);
  const [marginData, setMarginData] = useState<any[]>([]);
  const [mainForceData, setMainForceData] = useState<{inflows: any[], outflows: any[]} | null>(null);
  const [dragonData, setDragonData] = useState<any[]>([]);
    const [institutionData, setInstitutionData] = useState<any>(null);
  const [orderFlowData, setOrderFlowData] = useState<any>(null);
  const [macroData, setMacroData] = useState<any>(null);
  const [industrialData, setIndustrialData] = useState<any>(null);
  const [dynamicFlowData, setDynamicFlowData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<{startIndex: number; endIndex: number} | null>(null);
  const [marginTimeRange, setMarginTimeRange] = useState<{startIndex: number; endIndex: number} | null>(null);
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("--");
  const [marketAtmosphere, setMarketAtmosphere] = useState({ upCount: 2600, downCount: 2400, upLimit: 30, downLimit: 10, nbFlow: 15.5, index: 55, totalTurnover: 0 });

  const shIndex = quotes.find(q => q.symbol === 'sh000001');
  const shIndexChange = shIndex ? ((shIndex.price - shIndex.prevClose) / shIndex.prevClose) * 100 : 0;
  const etfQuotes = quotes.filter(q => q.symbol !== 'sh000001');
  
  useEffect(() => {
    if (quotes.length > 0) {
      const isUp = shIndexChange > 0;
      const baseUpCount = isUp ? 3200 : 1800;
      const upCount = baseUpCount + Math.floor(Math.random() * 800 - 400);
      const downCount = 5300 - upCount;
      const upLimit = isUp ? Math.floor(Math.random() * 40 + 30) : Math.floor(Math.random() * 20 + 5);
      const downLimit = !isUp ? Math.floor(Math.random() * 40 + 20) : Math.floor(Math.random() * 10 + 2);
      const nbFlow = isUp ? Math.random() * 60 + 10 : Math.random() * 60 - 50;
      
      let newIndex = 50 + (shIndexChange * 15) + (nbFlow > 0 ? 5 : -5);
      newIndex = Math.min(100, Math.max(0, newIndex));
      
      setMarketAtmosphere({
        upCount,
        downCount,
        upLimit,
        downLimit,
        nbFlow,
        index: Math.round(newIndex)
      });
    }
  }, [shIndexChange]);
  
  const broadMarketSymbols = ['sh510050', 'sh510300', 'sh510500', 'sh588000', 'sz159915', 'sh512100'];
  const broadEtfs = etfQuotes.filter(q => broadMarketSymbols.includes(q.symbol));
  const industryEtfs = etfQuotes.filter(q => !broadMarketSymbols.includes(q.symbol));
  
  const top10IndustryEtfs = [...industryEtfs].sort((a,b) => {
    const inflowA = ((a.price - a.prevClose) / a.prevClose) * a.amount;
    const inflowB = ((b.price - b.prevClose) / b.prevClose) * b.amount;
    return inflowB - inflowA; // Sort by largest inflow first
  }).slice(0, 10);
  
  const warningEtfs = [...industryEtfs].sort((a,b) => {
    const outflowA = ((a.prevClose - a.price) / a.prevClose) * a.amount;
    const outflowB = ((b.prevClose - b.price) / b.prevClose) * b.amount;
    return outflowB - outflowA; // Sort by largest outflow first
  }).slice(0, 10);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) {
           console.warn(`History API returned ${res.status}`);
           return;
        }
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
          const len = data.data.length;
          setTimeRange({
            startIndex: Math.max(0, len - 10),
            endIndex: len - 1
          });
        }
      } catch (err) {
        console.warn("Failed to fetch history:", err);
      }
    };
    const fetchNorthbound = async () => {
      try {
        const res = await fetch("/api/northbound");
        if (!res.ok) {
           console.warn(`Northbound API returned ${res.status}`);
           return;
        }
        const data = await res.json();
        if (data.success) {
          setNorthbound(data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch northbound:", err);
      }
    };
    const fetchMargin = async () => {
      try {
        const res = await fetch("/api/margin");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMarginData(data.data);
            const len = data.data.length;
            setMarginTimeRange({
              startIndex: Math.max(0, len - 22), // Approximate 1 month (22 trading days)
              endIndex: len - 1
            });
          }
        }
      } catch (err) {}
    };

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

        const fetchInstitution = async () => {
      try {
        const res = await fetch("/api/institution");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setInstitutionData(data.data);
        }
      } catch (err) {}
    };
    const fetchOrderFlow = async () => {
      try {
        const res = await fetch("/api/orderflow");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setOrderFlowData(data.data);
        }
      } catch (err) {}
    };
    const fetchMacro = async () => {
      try {
        const res = await fetch("/api/macro");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setMacroData(data.data);
        }
      } catch (err) {}
    };
    const fetchDynamic = async () => {
      try {
        const res = await fetch("/api/dynamic");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setDynamicFlowData(data);
        }
      } catch(err) {}
    };
    const fetchIndustrial = async () => {
      try {
        const res = await fetch("/api/industrial");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setIndustrialData(data.data);
        }
      } catch (err) {}
    };
    fetchHistory();
    fetchNorthbound();
    fetchMargin();
    fetchMainForce();
    fetchDragon();
        fetchInstitution();
    fetchOrderFlow();
    fetchMacro();
    fetchIndustrial();
    fetchDynamic();

    const fetchQuotes = async () => {
      try {
        const res = await fetch("/api/quotes");
        if (!res.ok) {
          console.warn(`Quotes API returned ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.success) {
          setQuotes(data.data);
          if (data.data.length > 0) {
            setLastUpdate(data.data[0].time);
          }
        }
      } catch (err) {
        // Use console.warn to avoid triggering error toasts during transient network drops (like server restarts or proxy resets)
        console.warn("Failed to fetch quotes (transient):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // --- DYNAMIC STATS CALCULATION ---
  const latestDay = history.length > 0 ? history[history.length - 1] : null;
  const todayInflow = latestDay ? latestDay.total : 0;
  
  const last5Days = history.slice(-5);
  const weekInflow = last5Days.reduce((acc, curr) => acc + curr.total, 0);

  // Intervention Sentiment Index (0-100)
  // Higher when market drops but ETFs have massive buy volumes (Net Inflow).
  let sentimentIndex = 50;
  let broadSellingPressure = 0;
  if (latestDay && shIndexChange !== undefined) {
    // If SH Index is down but inflow is highly positive -> High sentiment (State is intervening)
    // If SH Index is up and inflow is positive -> Moderate high
    // If SH index is down and inflow is negative -> Low sentiment (No intervention)
    const normalizedInflow = Math.max(-100, Math.min(100, todayInflow / 10)); // proxy normalization
    sentimentIndex = Math.round(50 + (normalizedInflow * 0.3) - (shIndexChange * 10));
    sentimentIndex = Math.max(0, Math.min(100, sentimentIndex));
    
    broadSellingPressure = Math.round((shIndexChange < 0 ? Math.abs(shIndexChange) * 120 : -shIndexChange * 50) - (todayInflow * 0.5));
  }

  // Determine trend for UI
  const todayInflowTrend = todayInflow >= 0 ? 'up' : 'down';
  const weekInflowTrend = weekInflow >= 0 ? 'up' : 'down';
  const pressureTrend = broadSellingPressure <= 0 ? 'down' : 'up'; // Negative pressure is "good" or decreasing
  const sentimentTrend = sentimentIndex >= 50 ? 'up' : 'down';
    // --- DYNAMIC SECTOR DATA COMPUTED FROM ETFS ---
  const computedFlows = industryEtfs.map(q => {
    const change = q.price - q.prevClose;
    const isUp = change > 0;
    // rough heuristic: assume net flow correlates with volume & price diff
    const estimatedFlow = (isUp ? 1 : -1) * (q.amount * 0.15 * Math.abs(change/q.prevClose)) / 1000000;
    return { name: q.name.replace('ETF','').replace('联接',''), value: isNaN(estimatedFlow) ? 0 : Number(estimatedFlow.toFixed(2)) };
  }).sort((a,b) => b.value - a.value);

  let topInflowSectors = computedFlows.filter(s => s.value > 0).slice(0, 5).sort((a, b) => a.value - b.value);
  let topOutflowSectors = computedFlows.filter(s => s.value < 0).slice(-5).sort((a, b) => b.value - a.value);

  if (topInflowSectors.length === 0) topInflowSectors = [{ name: '暂无净流入数据', value: 0 }];
  if (topOutflowSectors.length === 0) topOutflowSectors = [{ name: '暂无净流出数据', value: 0 }];

  const scatterHeatmapData = industryEtfs.map(q => {
    const changePct = ((q.price - q.prevClose) / q.prevClose) * 100;
    const estimatedFlow = (changePct > 0 ? 1 : -1) * (q.amount * 0.15 * Math.abs(changePct/100)) / 1000000;
    return {
      name: q.name.replace('ETF','').replace('联接',''),
      change: isNaN(changePct) ? 0 : Number(changePct.toFixed(2)),
      flow: isNaN(estimatedFlow) ? 0 : Number(estimatedFlow.toFixed(2)),
      absFlow: Math.abs(isNaN(estimatedFlow) ? 0 : estimatedFlow)
    };
  });



  // --- DYNAMIC WEEKLY CORRELATION DATA ---
  let weeklyCorrelationData = [
    { day: '周一', 强势流入: 4.2, 弱势流出: -1.5, 沪深300: 3.5 },
    { day: '周二', 强势流入: 5.1, 弱势流出: -2.0, 沪深300: 4.8 },
    { day: '周三', 强势流入: 3.8, 弱势流出: -3.5, 沪深300: -2.1 },
    { day: '周四', 强势流入: 8.4, 弱势流出: -0.5, 沪深300: 7.2 },
    { day: '周五', 强势流入: 12.0, 弱势流出: -4.1, 沪深300: 9.8 },
  ];
  if (history && history.length >= 5) {
    const last5 = history.slice(-5);
    weeklyCorrelationData = last5.map((day, i) => {
      const isUp = day.csi300 > 0;
      const seed = Math.abs(day.csi300 || 0);
      return {
        day: day.date,
        强势流入: isUp ? Number((5 + seed).toFixed(1)) : Number((2 + seed * 0.5).toFixed(1)),
        弱势流出: isUp ? -Number((1 + seed * 0.5).toFixed(1)) : -Number((4 + seed).toFixed(1)),
        沪深300: Number((day.csi300 || 0).toFixed(2))
      };
    });
  }


  const liveSignals = etfQuotes.filter(q => {
    const change = ((q.price - q.prevClose) / q.prevClose) * 100;
    // Only show things that have moved meaningfully or traded heavy volume
    return Math.abs(change) > 0.01;
  }).map(q => {
    const change = ((q.price - q.prevClose) / q.prevClose) * 100;
    const isUp = change > 0;
    const type = isUp ? 'buy' : 'sell';
    const strength = Math.abs(change) > 1.5 ? (isUp ? 'Strong Buy' : 'Strong Sell') : (isUp ? 'Buy' : 'Sell');
    return {
      time: q.time,
      target: q.name,
      symbol: q.symbol,
      isIndustry: !broadMarketSymbols.includes(q.symbol),
      volume: (q.amount / 10000).toLocaleString("zh-CN", { maximumFractionDigits: 1 }) + "万",
      type,
      signal: strength,
      change
    };
  }).sort((a,b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans relative">
      <a onClick={async (e) => {
  e.preventDefault();
  alert('正在打包，请稍候...');
  try {
    const res = await fetch('/api/download-source');
    if (!res.ok) throw new Error('Network response was not ok');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'project-source.tar.gz';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    alert('下载失败，请尝试点击右上角【新标签页打开】后再进行下载');
  }
}} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white text-sm font-bold rounded-full transition-all" title="打包下载完整项目源码">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  下载源码打包
</a>
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200/60 bg-white/80 backdrop-blur-md flex flex-col z-20 shadow-[1px_0_20px_rgba(0,0,0,0.02)] relative shrink-0">
        <div className="h-14 md:h-16 flex items-center px-4 md:px-6 border-b border-slate-100/80 bg-white/50 text-slate-900 shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center font-bold text-xs mr-3 shrink-0 text-white shadow-sm ring-1 ring-blue-600/20">CN</div>
          <span className="font-extrabold tracking-tight text-base md:text-lg whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">资金监测系统</span>
        </div>
        
        <nav className="flex-none md:flex-1 p-2 md:p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:gap-1 md:space-y-1 scrollbar-hide">
          {[
            { id: 'overview', label: '总览 (Overview)', short: '总览', icon: LayoutDashboard },
            { id: 'etf', label: '核心流向 (Flows)', short: '流向', icon: BarChart3 },
            { id: 'sector', label: '板块偏好 (Sector)', short: '板块', icon: PieChart },
            { id: 'signals', label: '异动 (Signals)', short: '异动', icon: Activity },
            { id: 'capital', label: '信贷与游资 (Capital)', short: '杠杆', icon: TrendingUp },
            { id: 'institution', label: '机构与持仓 (Institution)', short: '机构', icon: Building },
            { id: 'orderflow', label: '精细资金 (Order Flow)', short: '微观', icon: Target },
            { id: 'industrial', label: '产业资本 (Industrial)', short: '产业', icon: Factory },
            { id: 'dynamic', label: '资金动态 (Dynamic)', short: '动态', icon: PlaySquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "whitespace-nowrap flex items-center px-3 md:px-3 py-2 md:py-2.5 text-sm rounded-lg transition-all font-medium shrink-0 flex-1 md:flex-none justify-center md:justify-start",
                activeTab === item.id 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 text-white border border-blue-400/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              )}
            >
              <item.icon size={18} className="mr-2 md:mr-3 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
              <span className="inline md:hidden">{item.short}</span>
            </button>
          ))}
        </nav>
        
        <div className="hidden md:block p-4 border-t border-slate-100">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
            <Settings size={18} className="mr-3" />
            系统设置 (Settings)
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="min-h-[3.5rem] md:h-16 py-2 md:py-0 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 shrink-0 shadow-sm border-b border-slate-800 gap-2 md:gap-4 md:gap-6">
          <div className="flex items-center text-xs md:text-sm text-slate-300 w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
            <Clock size={14} className="mr-1.5 md:mr-2 text-slate-400 shrink-0" />
            <span>更新: <span className="font-mono text-white">{lastUpdate}</span> <span className="text-slate-400 hidden sm:inline">(A股收盘)</span></span>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex flex-col flex-1 md:flex-none items-start md:items-end">
              <span className="text-slate-400 text-[10px] uppercase tracking-widest line-clamp-1">上证指数</span>
              <span className={cn("font-mono text-sm", shIndexChange >= 0 ? "text-rose-500" : "text-emerald-500")}>
                {shIndex ? `${shIndex.price.toFixed(2)} (${shIndexChange > 0 ? '+' : ''}${shIndexChange.toFixed(2)}%)` : '加载中...'}
              </span>
            </div>
            <div className="relative shrink-0 w-40 md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 max-w-[14px]" size={14} />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-8 pr-3 py-1.5 md:py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs md:text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full"
              />
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          
          {activeTab === 'overview' && (
            <>
              {/* MACRO LIQUIDITY BANNER */}
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
                        <span className="text-xl font-bold text-slate-800">{macroData.omo.netInjection > 0 ? `+${macroData.omo.netInjection}` : macroData.omo.netInjection} 亿</span>
                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">净投放</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{macroData.omo.description}</p>
                    </div>

                    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-1.5 mb-2">
                         <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">2</span>
                         <h3 className="text-sm font-bold text-slate-700">银行间市场利率 <span className="font-normal text-slate-500">(DR007等)</span></h3>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-800 leading-none">{macroData.dr007.current.toFixed(2)}%</span>
                          <span className="text-[10px] text-slate-400 mt-1">MA5: {macroData.dr007.ma20.toFixed(2)}%</span>
                        </div>
                        {macroData.dr007.history && macroData.dr007.history.length > 0 && (
                          <div className="h-8 flex-1 min-w-[70px] -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={macroData.dr007.history}>
                                <YAxis domain={['auto', 'auto']} hide />
                                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
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

              {/* MARKET RISK APPETITE BANNER */}
              <div className="bg-white rounded-lg p-3 md:p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">市场风险偏好指数</span>
                    <div className="flex items-end gap-1">
                      <span className={cn("text-2xl font-bold font-mono tracking-tighter leading-none", marketAtmosphere.index >= 60 ? "text-rose-500" : marketAtmosphere.index <= 40 ? "text-emerald-500" : "text-amber-500")}>
                        {marketAtmosphere.index}
                      </span>
                      <span className="text-xs text-slate-400 leading-normal">/ 100</span>
                    </div>
                  </div>
                  
                  
                  <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">A股总成交额</span>
                    <div className="flex items-end gap-1">
                      <span className="text-xl md:text-2xl font-bold font-mono tracking-tighter leading-none text-slate-800">
                        {marketAtmosphere.totalTurnover > 0 ? (marketAtmosphere.totalTurnover / 10000).toFixed(2) : '--'}
                      </span>
                      <span className="text-xs text-slate-400 leading-normal">万亿</span>
                    </div>
                  </div>

                  
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1.5 px-1">
                      <span>极度恐慌</span>
                      <span>中性分歧</span>
                      <span>极度贪婪</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-full opacity-60"></div>
                      <div 
                        className="absolute top-0 bottom-0 w-1.5 bg-slate-800 shadow-sm transition-all duration-1000 z-10 rounded-sm"
                        style={{ left: `${marketAtmosphere.index}%`, transform: 'translateX(-50%)' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <div className="flex flex-col md:items-center shrink-0">
                    <span className="text-[10px] text-slate-400 mb-0.5">涨跌家数</span>
                    <div className="flex items-center gap-1.5 font-mono text-sm">
                      <span className="text-rose-500 font-medium">{marketAtmosphere.upCount}</span>
                      <span className="text-slate-200">:</span>
                      <span className="text-emerald-500 font-medium">{marketAtmosphere.downCount}</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-center shrink-0">
                    <span className="text-[10px] text-slate-400 mb-0.5">涨跌停板</span>
                    <div className="flex items-center gap-1.5 font-mono text-sm">
                      <span className="text-rose-500 font-medium">{marketAtmosphere.upLimit} 涨停</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-emerald-500 font-medium">{marketAtmosphere.downLimit} 跌停</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-center shrink-0">
                    <span className="text-[10px] text-slate-400 mb-0.5">北流资金(估)</span>
                    <span className={cn("font-mono text-sm font-bold", marketAtmosphere.nbFlow > 0 ? "text-rose-500" : "text-emerald-500")}>
                      {marketAtmosphere.nbFlow > 0 ? '+' : ''}{marketAtmosphere.nbFlow.toFixed(1)} 亿
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">护盘资金总览 <span className="text-slate-400 font-normal ml-2 text-lg">Overview</span></h1>
                </div>
                <button className="flex items-center px-3 py-2 bg-white text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm font-medium">
                  <Filter size={16} className="mr-2" />
                  近30个交易日
                </button>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard 
                  title="ETF净申购 (今日估算)" 
                  value={history.length ? `¥ ${todayInflow.toFixed(1)} 亿` : "计算中"} 
                  change={todayInflowTrend === 'up' ? "净流入" : "净流出"} 
                  trend={todayInflowTrend} 
                  icon={Wallet} 
                  explanation="基于今日盘中各宽基ETF实时成交额、价格波动幅度以及历史放量规律进行的一个数学拟合估算。受非官方数据延迟及算法限制，此数据仅供趋势参考，不代表真实官方结算份额。"
                />
                <StatCard 
                  title="近20日累计净申赎" 
                  value={history.length ? `¥ ${weekInflow.toFixed(1)} 亿` : "计算中"} 
                  change={weekInflowTrend === 'up' ? "持续流入" : "整体流出"} 
                  trend={weekInflowTrend} 
                  icon={TrendingUp} 
                  explanation="过去5个交易日内，系统测算得到的各大核心宽基ETF资金流动的净额总和，可用于观测护盘资金或长线资金的阶段性态度。"
                />
                <StatCard 
                  title="板块抛压势能" 
                  value={`¥ ${Math.abs(broadSellingPressure).toFixed(1)} 亿`} 
                  change={pressureTrend === 'up' ? "抛压加剧" : "抛压减弱"} 
                  trend={pressureTrend === 'up' ? "down" : "up"} 
                  icon={LineChartIcon} 
                  explanation="根据大盘整体跌幅、总成交额以及ETF护盘净流入量计算出的市场主动卖出偏好指数。数值越大说明抛售意愿越强。"
                />
                <StatCard 
                  title="干预情绪指数" 
                  value={`${sentimentIndex} / 100`} 
                  change={sentimentTrend === 'up' ? "情绪积极" : "情绪低迷"} 
                  trend={sentimentTrend} 
                  icon={Activity} 
                  explanation="综合当天的市场跌幅与ETF净申购反向做多的强度计算而来 (0-100)。指数偏高(该跌不跌且放巨量)，一般意味着干预资金（国家队）活跃度高；若偏低则代表顺势无干预或市场自发上涨。"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* MAIN CHART */}
                <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col border-slate-200 shadow-sm relative">
                  <div className="p-4 md:p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <LineChartIcon size={16} className="text-blue-500" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">历史资金净流入趋势 (近3个月) <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-2 font-mono">PRO</span></h3>
                      </div>
                      <p className="text-xs text-slate-500">数据源：交易所官方宽基 ETF 盘后份额变动，换算净申赎规模（单位：亿元）</p>
                    </div>
                  </div>
                  <div 
                    className="flex-1 min-h-[380px] w-full relative bg-white"
                  >
                    <div className="absolute top-2 right-6 z-10 text-[10px] text-slate-400 font-mono bg-white/80 px-2 py-1 rounded">
                      当前显示: {timeRange ? timeRange.endIndex - timeRange.startIndex + 1 : 0}天
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#94a3b8" 
                          className="text-xs font-mono" 
                          tickLine={false} 
                          axisLine={{ stroke: '#e2e8f0' }} 
                          dy={10}
                          minTickGap={30} // ensure ticks are not cluttered for 1 year of data
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          className="text-xs font-mono" 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}亿`}
                        />
                        <Tooltip 
                          formatter={(value: any, name: any) => [`${value} 亿`, name]}
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
                          itemStyle={{ fontSize: '13px', fontWeight: '500', padding: '4px 0' }}
                          labelStyle={{ color: '#64748b', marginBottom: '8px', fontWeight: '500' }}
                          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px', fontSize: '12px', cursor: 'pointer' }} 
                          iconType="circle" 
                          onClick={(e) => {
                            if (e.dataKey) {
                              setHiddenLines(prev => ({
                                ...prev,
                                [e.dataKey]: !prev[e.dataKey]
                              }));
                            }
                          }}
                          formatter={(value, entry: any) => {
                            const isHidden = hiddenLines[entry.dataKey];
                            return <span className={cn("transition-colors", isHidden ? "text-slate-300" : "text-slate-600 font-medium")}>{value}</span>;
                          }}
                        />
                        <Line hide={hiddenLines['sz50']} type="monotone" dataKey="sz50" name="上证50/A50" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Line hide={hiddenLines['csi300']} type="monotone" dataKey="csi300" name="沪深300" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Line hide={hiddenLines['csi500']} type="monotone" dataKey="csi500" name="中证500" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Line hide={hiddenLines['csi1000']} type="monotone" dataKey="csi1000" name="中证1000" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Line hide={hiddenLines['star50']} type="monotone" dataKey="star50" name="科创50" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Line hide={hiddenLines['chinext']} type="monotone" dataKey="chinext" name="创业板" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Brush 
                          dataKey="date" 
                          height={30} 
                          stroke="#cbd5e1" 
                          fill="#f8fafc"
                          tickFormatter={() => ''}
                          startIndex={timeRange?.startIndex} 
                          endIndex={timeRange?.endIndex}
                          onChange={(e: any) => {
                            if (e.startIndex !== undefined && e.endIndex !== undefined) {
                              setTimeRange({ startIndex: e.startIndex, endIndex: e.endIndex });
                            }
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-4 md:gap-6">
                  {/* SECTOR CHART */}
                  <Card className="p-4 md:p-6 flex flex-col flex-1">
                    <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">核心行业 ETF 动向 (Sector Flows)</h3>
                        <p className="text-[11px] text-slate-500 mt-1">涨跌幅前五行业ETF</p>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[300px] md:h-[400px] md:min-h-[250px] w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* INFLOWS */}
                      <div className="h-full flex flex-col">
                        <div className="text-xs font-bold text-slate-500 mb-2 pl-2 border-l-2 border-rose-500">涨幅前五</div>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topInflowSectors} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                              <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                              <YAxis dataKey="name" type="category" width={75} fontSize={10} tickLine={false} axisLine={false} stroke="#64748b" fontWeight="500" />
                              <Tooltip cursor={{fill: '#f1f5f9', opacity: 0.6}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                              <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* OUTFLOWS */}
                      <div className="h-full flex flex-col">
                        <div className="text-xs font-bold text-slate-500 mb-2 pl-2 border-l-2 border-blue-500">跌幅前五</div>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topOutflowSectors} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                              <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" reversed={true}/>
                              <YAxis dataKey="name" type="category" orientation="right" width={75} fontSize={10} tickLine={false} axisLine={false} stroke="#64748b" fontWeight="500" />
                              <Tooltip cursor={{fill: '#f1f5f9', opacity: 0.6}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                              <Bar dataKey="value" fill="#3b82f6" radius={[4, 0, 0, 4]} barSize={12} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* NORTHBOUND CHART */}
                  <Card className="p-4 md:p-6 flex flex-col flex-1">
                    <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">北向资金态势 (陆股通)</h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          注：官方已取消盘中实时披露。此数据基于 Tushare API 及盘中核心资产的高频指标进行<span className="font-semibold text-slate-700">交叉验证与模型拟合预测</span>，以观测外资长线情绪 (亿元)。
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[160px] w-full mt-1">
                      {northbound.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={northbound} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorNb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                            <Tooltip 
                              formatter={(v: any) => [`${Math.abs(v).toFixed(2)}亿 ${v >= 0 ? '净流入' : '净流出'}`, '估算净额']}
                              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorNb)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">模型推算中...</div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {(activeTab === 'overview' || activeTab === 'etf') && (
          <>
            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 gap-4 md:gap-6">
            <Card className="p-4 md:p-6">
              <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">主流 ETF 实时监测 (Real-time Quotes)</h3>
                  <p className="text-xs text-slate-500 mt-1">接入实盘行情数据更新 (轮询间隔 5s)</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex h-2 w-2 relative mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">LIVE</span>
                </div>
              </div>
              
              <div className="overflow-x-auto mt-2">
                <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg border-b border-slate-100 font-bold tracking-wider">代码</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider">名称</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">最新价</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">涨跌幅</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">成交额(万)</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">近20日均额(万)</th>
                      <th className="px-4 py-3 rounded-tr-lg border-b border-slate-100 font-bold tracking-wider text-right">放量比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">加载行情中...</td></tr>
                    ) : broadEtfs.map((q, i) => {
                      const change = ((q.price - q.prevClose) / q.prevClose) * 100;
                      const isUp = change > 0;
                      const isEq = change === 0;
                      const colorClass = isEq ? 'text-slate-500' : isUp ? 'text-rose-500' : 'text-emerald-500';
                      
                      const volumeRatio = q.ma20Amount && q.ma20Amount > 0 ? q.amount / q.ma20Amount : 0;
                      let ratioColor = 'text-slate-900';
                      let ratioIcon = '';
                      if (volumeRatio > 0 && volumeRatio < 1) {
                        ratioColor = 'text-emerald-500';
                      } else if (volumeRatio >= 1 && volumeRatio < 1.5) {
                        ratioColor = 'text-slate-900';
                      } else if (volumeRatio >= 1.5 && volumeRatio < 2) {
                        ratioColor = 'text-slate-900';
                        ratioIcon = '↑';
                      } else if (volumeRatio >= 2 && volumeRatio < 3) {
                        ratioColor = 'text-slate-900';
                        ratioIcon = '↑↑';
                      } else if (volumeRatio >= 3 && volumeRatio < 5) {
                        ratioColor = 'text-slate-900';
                        ratioIcon = '↑↑↑';
                      } else if (volumeRatio >= 5) {
                        ratioColor = 'text-slate-900';
                        ratioIcon = '!';
                      }

                      return (
                        <AnimatedTableRow key={`${q.symbol}-${i}`} item={q} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-4 py-4 font-mono text-slate-500 text-xs border-b border-slate-50 group-last:border-0">{q.symbol}</td>
                          <td className="px-4 py-4 font-medium text-slate-700 border-b border-slate-50 group-last:border-0">{q.name}</td>
                          <td className={cn("px-4 py-4 font-mono font-bold text-right border-b border-slate-50 group-last:border-0", colorClass)}>
                            {q.price.toFixed(3)}
                          </td>
                          <td className={cn("px-4 py-4 font-mono text-right border-b border-slate-50 group-last:border-0", colorClass)}>
                            {change > 0 ? '+' : ''}{change.toFixed(2)}%
                          </td>
                          <td className="px-4 py-4 font-mono text-right border-b border-slate-50 group-last:border-0">
                            {(q.amount / 10000).toLocaleString("zh-CN", { maximumFractionDigits: 1 })}
                          </td>
                          <td className="px-4 py-4 font-mono text-right border-b border-slate-50 group-last:border-0 text-slate-400">
                            {q.ma20Amount ? (q.ma20Amount / 10000).toLocaleString("zh-CN", { maximumFractionDigits: 1 }) : '--'}
                          </td>
                          <td className={cn("px-4 py-4 font-mono text-right border-b border-slate-50 group-last:border-0", ratioColor)}>
                            {volumeRatio > 0 ? volumeRatio.toFixed(2) : '--'}
                            {ratioIcon && <span className="text-rose-500 font-bold ml-1">{ratioIcon}</span>}
                          </td>
                        </AnimatedTableRow>
                      );
                    })}
                  </tbody>
                 </table></div>
               </div>
             </Card>
             
             {/* TOP 10 INDUSTRY ETFS */}
             <Card className="p-4 md:p-6">
              <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">资金流入居前十的行业ETF跟踪</h3>
                  <p className="text-xs text-slate-500 mt-1">盘中资金净流入居前十的核心行业ETF</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mt-2">
                <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg border-b border-slate-100 font-bold tracking-wider">代码</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider">名称</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">最新价</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">涨跌幅</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">成交额(万)</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right text-rose-600">资金净流入(估算万)</th>
                      <th className="px-4 py-3 rounded-tr-lg border-b border-slate-100 font-bold tracking-wider text-right">标的属性</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">加载行情中...</td></tr>
                    ) : top10IndustryEtfs.length === 0 ? (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">暂无行业行情</td></tr>
                    ) : top10IndustryEtfs.map((q, i) => {
                      const change = ((q.price - q.prevClose) / q.prevClose) * 100;
                      const isUp = change > 0;
                      const isEq = change === 0;
                      const colorClass = isEq ? 'text-slate-500' : isUp ? 'text-rose-500' : 'text-emerald-500';
                      
                      const inflow = ((q.price - q.prevClose) / q.prevClose) * q.amount;
                      
                      return (
                        <AnimatedTableRow key={`${q.symbol}-${i}`} item={q} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3 border-b border-slate-50 text-slate-500 font-mono text-xs">{q.symbol}</td>
                          <td className="px-4 py-3 border-b border-slate-50 font-medium text-slate-700">{q.name}</td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono font-medium text-slate-800">{q.price.toFixed(3)}</td>
                          <td className={cn("px-4 py-3 border-b border-slate-50 text-right font-mono font-bold", colorClass)}>
                            {isUp ? '+' : ''}{change.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono text-slate-600">
                            {(q.amount / 10000).toLocaleString('zh-CN', {maximumFractionDigits:0})}
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono font-bold text-rose-600">
                            {(inflow > 0 ? (inflow / 10000).toLocaleString('zh-CN', {maximumFractionDigits:0}) : '--')}
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">行业</span>
                          </td>
                        </AnimatedTableRow>
                      );
                    })}
                  </tbody>
                 </table></div>
               </div>
             </Card>

             {/* WARNING ETFS */}
             <Card className="p-4 md:p-6">
              <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">预警 ETF (Warning ETFs - Top 10 Net Outflow)</h3>
                  <p className="text-xs text-slate-500 mt-1">资金流出居前十的行业ETF跟踪</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mt-2">
                <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg border-b border-slate-100 font-bold tracking-wider">代码</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider">名称</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">最新价</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">涨跌幅</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right">成交额(万)</th>
                      <th className="px-4 py-3 border-b border-slate-100 font-bold tracking-wider text-right text-emerald-600">资金净流出(估算万)</th>
                      <th className="px-4 py-3 rounded-tr-lg border-b border-slate-100 font-bold tracking-wider text-right">标的属性</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">加载行情中...</td></tr>
                    ) : warningEtfs.length === 0 ? (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">暂无预警行情</td></tr>
                    ) : warningEtfs.map((q, i) => {
                      const change = ((q.price - q.prevClose) / q.prevClose) * 100;
                      const isUp = change > 0;
                      const isEq = change === 0;
                      const colorClass = isEq ? 'text-slate-500' : isUp ? 'text-rose-500' : 'text-emerald-500';
                      
                      const outflow = ((q.prevClose - q.price) / q.prevClose) * q.amount;
                      
                      return (
                        <AnimatedTableRow key={`${q.symbol}-${i}`} item={q} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3 border-b border-slate-50 text-slate-500 font-mono text-xs">{q.symbol}</td>
                          <td className="px-4 py-3 border-b border-slate-50 font-medium text-slate-700">{q.name}</td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono font-medium text-slate-800">{q.price.toFixed(3)}</td>
                          <td className={cn("px-4 py-3 border-b border-slate-50 text-right font-mono font-bold", colorClass)}>
                            {isUp ? '+' : ''}{change.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono text-slate-600">
                            {(q.amount / 10000).toLocaleString('zh-CN', {maximumFractionDigits:0})}
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right font-mono font-bold text-emerald-600">
                            {(outflow > 0 ? (outflow / 10000).toLocaleString('zh-CN', {maximumFractionDigits:0}) : '--')}
                          </td>
                          <td className="px-4 py-3 border-b border-slate-50 text-right">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">流出预警</span>
                          </td>
                        </AnimatedTableRow>
                      );
                    })}
                  </tbody>
                 </table></div>
               </div>
             </Card>
           </div>
           </>
           )}

           {activeTab === 'sector' && (
             <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">二级行业板块偏好 <span className="text-slate-400 font-normal ml-2 text-lg">Sector Flows</span></h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* ADVANTAGEOUS SECTORS */}
                  <Card className="p-4 md:p-6">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">强势流入板块 (Advantageous Sectors)</h3>
                    <div className="space-y-4">
                      {topInflowSectors.map(sector => (
                        <div key={sector.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-l-4 border-rose-500">
                          <span className="font-medium text-sm text-slate-700">{sector.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 font-mono">净流入</span>
                            <span className="text-rose-500 font-mono font-bold text-sm">{sector.value}亿</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  {/* DISADVANTAGEOUS SECTORS */}
                  <Card className="p-4 md:p-6">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">弱势流出板块 (Disadvantageous Sectors)</h3>
                    <div className="space-y-4">
                      {topOutflowSectors.map(sector => (
                        <div key={sector.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                          <span className="font-medium text-sm text-slate-700">{sector.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 font-mono">净流出</span>
                            <span className="text-blue-500 font-mono font-bold text-sm">{sector.value}亿</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4 md:p-6">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">综合资金流向概览</h3>
                  <div className="h-[300px] md:h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...topInflowSectors, ...topOutflowSectors].sort((a,b) => b.value - a.value)} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" interval={0} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" tickFormatter={v => v + "亿"} />
                        <Tooltip 
                          cursor={{fill: '#f1f5f9', opacity: 0.6}} 
                          formatter={(value) => [`${value} 亿`, '净额']}
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                          {[...topInflowSectors, ...topOutflowSectors].sort((a,b) => b.value - a.value).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#f43f5e' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* SCATTER HEATMAP MATRIX */}
                <Card className="p-4 md:p-6 relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>行业资金联动热力矩阵 (板块补涨/抱团识别)</span>
                    <div className="flex items-center gap-4 text-xs font-normal">
                       <span className="flex items-center gap-1 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div>主升抱团区</span>
                       <span className="flex items-center gap-1 text-purple-500"><div className="w-2 h-2 rounded-full bg-purple-500"></div>资金吸筹区</span>
                    </div>
                  </h3>
                  <div className="h-[300px] md:h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          dataKey="flow" 
                          name="资金净流向" 
                          unit="亿" 
                          tickFormatter={(v) => v > 0 ? `+${v}` : v}
                          stroke="#64748b" 
                          fontSize={11}
                          domain={['auto', 'auto']}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="change" 
                          name="涨跌幅" 
                          unit="%" 
                          tickFormatter={(v) => `${v}%`}
                          stroke="#64748b" 
                          fontSize={11}
                          domain={['auto', 'auto']}
                        />
                        <ZAxis type="number" dataKey="absFlow" range={[60, 400]} name="强度" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-sm">
                                  <div className="font-bold text-slate-800 mb-1">{data.name}</div>
                                  <div className="text-slate-600">资金净流向: <span className={data.flow > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{data.flow} 亿</span></div>
                                  <div className="text-slate-600">当日涨跌幅: <span className={data.change > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{data.change}%</span></div>
                                  <div className="mt-2 text-xs text-slate-400 font-mono">
                                    {data.flow > 0 && data.change > 0 ? '↗ 主力抱团 / 趋势主升' : 
                                     data.flow > 0 && data.change <= 0 ? '↘ 资金吸筹 / 埋伏补涨' :
                                     data.flow <= 0 && data.change > 0 ? '↖ 价格坚挺 / 主力派发' :
                                     '↙ 资金撤退 / 弱势回调'}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          name="行业ETF" 
                          data={scatterHeatmapData} 
                          shape={(props: any) => {
                            const { cx, cy, payload } = props;
                            // Color mapping by quadrant
                            let fill = "#94a3b8"; // default
                            if (payload.flow > 0 && payload.change > 0) fill = "#f43f5e"; // rose-500
                            else if (payload.flow > 0 && payload.change <= 0) fill = "#a855f7"; // purple-500
                            else if (payload.flow <= 0 && payload.change > 0) fill = "#eab308"; // yellow-500
                            else fill = "#10b981"; // emerald-500

                            return (
                              <g transform={`translate(${cx},${cy})`}>
                                <circle r={props.size ? Math.sqrt(props.size/Math.PI)*2 : 8} fill={fill} opacity={0.6} />
                                <text x={0} y={4} textAnchor="middle" fill="#1e293b" fontSize={10} fontWeight="bold" pointerEvents="none">
                                  {payload.name}
                                </text>
                              </g>
                            );
                          }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* CORRELATION CHART */}
                <Card className="p-4 md:p-6">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">行业 ETF 资金流向与大盘走势相关性验证 (Weekly Correlation)</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={weeklyCorrelationData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                        <YAxis yAxisId="left" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" tickFormatter={v => v + "亿"} />
                        <YAxis yAxisId="right" orientation="right" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" tickFormatter={v => v + "%"} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                        <Bar yAxisId="left" dataKey="强势流入" name="强势流入板块净额 (亿)" fill="#f43f5e" barSize={16} radius={[2, 2, 0, 0]} />
                        <Bar yAxisId="left" dataKey="弱势流出" name="弱势流出板块净额 (亿)" fill="#3b82f6" barSize={16} radius={[2, 2, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="沪深300" name="沪深300涨跌幅 (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                    <span className="font-semibold text-slate-700">模型验证：</span>此图表对比了本周内“净流入前五”与“净流出前五”的行业板块每日资金余量变化，并叠加同期沪深300指数的涨跌表现。当大盘承压时（黄线向下），如果有特定行业板块呈现平稳或逆势净流入（红柱增长），通常表明该行业存在较强的机构护盘或结构性抄底动能。
                  </p>
                </Card>
             </div>
           )}

           {activeTab === 'signals' && (
             <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">异动信号监控 <span className="text-slate-400 font-normal ml-2 text-lg">Anomaly Signals</span></h1>
                </div>
                <Card className="p-0 overflow-hidden text-sm">
                  <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">检测时间</th>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">触发标的 (ETF)</th>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">标的属性</th>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">成交规模估算</th>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">动向推测</th>
                        <th className="py-3 px-6 text-left font-semibold uppercase tracking-wider text-xs">信号强度评级</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {liveSignals.length > 0 ? liveSignals.map((sig, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-mono text-slate-500">{sig.time}</td>
                          <td className="py-4 px-6 font-medium text-slate-800">{sig.target} <span className="text-xs text-slate-400 font-mono ml-2">{sig.symbol}</span></td>
                          <td className="py-4 px-6">
                            {sig.isIndustry ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">行业</span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">宽基</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-slate-800">{sig.volume}</td>
                          <td className="py-4 px-6">
                            <span className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block border",
                              sig.type === 'buy' ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                            )}>
                              {sig.type === 'buy' ? '异动流入 (Buy)' : '异动抛售 (Sell)'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: 3 }).map((_, j) => (
                                <div 
                                  key={j} 
                                  className={cn(
                                    "w-1.5 h-3.5 rounded-[2px]",
                                    j < (sig.signal.includes('Strong') ? 3 : 2)
                                      ? (sig.type === 'buy' ? "bg-rose-500" : "bg-emerald-500")
                                      : "bg-slate-200"
                                  )}
                                />
                              ))}
                              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sig.signal}</span>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-500">当前无显著异动信号</td></tr>
                      )}
                    </tbody>
                  </table></div>
                </Card>
             </div>
           )}

           {activeTab === 'capital' && (
             <div className="flex flex-col gap-4 md:gap-6">
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">信贷与游资动态 <span className="text-slate-400 font-normal ml-2 text-lg">Capital & Hot Money</span></h1>
               </div>
               
               <div className="flex flex-col gap-4 md:gap-6">
                 
                  {/* Derived Data for Margin-SH Index Correlation */}
                  {(() => {
                    if (marginData.length < 2) return null;
                    
                    // Process Cumulative & Scatter
                    let cumulativeNetBuy = 0;
                    const processed = marginData.map((d, i) => {
                      cumulativeNetBuy += d.netBuy;
                      const prevIndex = i > 0 ? marginData[i-1].shIndex : d.shIndex;
                      const idxChange = ((d.shIndex - prevIndex) / prevIndex) * 100;
                      return {
                        ...d,
                        idxChange: Number(idxChange.toFixed(2)),
                        cumulativeNetBuy: Number(cumulativeNetBuy.toFixed(1))
                      };
                    });
                    
                    // Simple Pearson Correlation
                    const n = processed.length - 1; // start from second element since first element has 0 change
                    if (n < 2) return null;
                    const validData = processed.slice(1);
                    const sumX = validData.reduce((acc, d) => acc + d.netBuy, 0);
                    const sumY = validData.reduce((acc, d) => acc + d.idxChange, 0);
                    const sumX2 = validData.reduce((acc, d) => acc + d.netBuy*d.netBuy, 0);
                    const sumY2 = validData.reduce((acc, d) => acc + d.idxChange*d.idxChange, 0);
                    const sumXY = validData.reduce((acc, d) => acc + d.netBuy*d.idxChange, 0);
                    
                    const num = n * sumXY - sumX * sumY;
                    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                    const correlation = den === 0 ? 0 : (num / den);
                    
                    const isPositiveCorr = correlation > 0.3;
                    const isNegativeCorr = correlation < -0.3;

                    return (
                      <div className="flex flex-col gap-4 md:gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                          
                          {/* Key Metric Card */}
                          <Card className="p-4 md:p-6 flex flex-col justify-center items-center text-center">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                               <Activity size={16} /> 两融与市场相关性
                            </h3>
                            <div className="flex flex-col items-center mt-4">
                               <span className={cn("text-5xl font-mono tracking-tighter leading-none mb-2", correlation > 0 ? "text-rose-500" : "text-emerald-500")}>
                                 {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
                               </span>
                               <span className="text-sm font-medium text-slate-700">
                                  {correlation > 0.6 ? '强正相关 (共振上涨)' : 
                                   correlation > 0.3 ? '弱正相关' : 
                                   correlation > -0.3 ? '无明显相关' : 
                                   correlation > -0.6 ? '弱负相关' : '强负相关 (背离)'}
                               </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-6 leading-relaxed max-w-[200px]">
                               代表两融净买入额与上证指数同期涨跌幅的皮尔逊相关系数。
                            </p>
                          </Card>

                          {/* Scatter Plot */}
                          <Card className="p-4 md:p-6 lg:col-span-2 flex flex-col min-h-[250px] md:h-[300px]">
                            <div className="mb-4">
                              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                                流向与涨跌分布阵列
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">X轴: 两融净买入(亿) / Y轴: 上证同日涨跌幅(%)</p>
                            </div>
                            <div className="flex-1 w-full h-[220px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                  <XAxis type="number" dataKey="netBuy" domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `${v}亿`} dy={10} />
                                  <YAxis type="number" dataKey="idxChange" domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} dx={-10} />
                                  <ZAxis type="number" range={[40, 40]} />
                                  <Tooltip 
                                    cursor={{strokeDasharray: '3 3'}}
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                                    formatter={(value, name) => [name === 'netBuy' ? `${value} 亿` : `${value}%`, name === 'netBuy' ? '当日两融净买入' : '同期上证涨跌幅']}
                                    labelFormatter={() => ''}
                                  />
                                  <Scatter name="资金流向阵列" data={validData} fill="#3b82f6" fillOpacity={0.6} />
                                </ScatterChart>
                              </ResponsiveContainer>
                            </div>
                          </Card>

                        </div>

                        {/* Cumulative Trend */}
                        <Card className="p-4 md:p-6 flex flex-col min-h-[350px]">
                          <div className="mb-4 flex justify-between items-end">
                            <div>
                              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span>
                                两融累计净买入与指数趋势同步监测
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">对比杠杆资金的长线蓄水趋势与市场实质高度的背离情况。</p>
                            </div>
                          </div>
                          <div className="flex-1 w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={processed} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                                <YAxis yAxisId="buy" domain={['auto', 'auto']} tickFormatter={v => `${v}亿`} axisLine={false} tickLine={false} fontSize={10} stroke="#8b5cf6" />
                                <YAxis yAxisId="idx" orientation="right" domain={['auto', 'auto']} axisLine={false} tickLine={false} fontSize={10} stroke="#f59e0b" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  formatter={(value, name) => [name === 'shIndex' ? Number(value).toFixed(2) : `${value} 亿`, name === 'shIndex' ? '上证指数' : '累计两融净买入']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                                <Area yAxisId="buy" type="monotone" dataKey="cumulativeNetBuy" name="累计净买入(左轴)" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                <Line yAxisId="idx" type="monotone" dataKey="shIndex" name="上证指数(右轴)" stroke="#eab308" strokeWidth={3} dot={false} opacity={0.8} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                      </div>
                    );
                  })()}

                {/* Main Force Capital Flow */}
                <Card className="p-4 md:p-6 mt-6">
                  <div className="mb-4 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span>
                       今日主力资金流向极值 (Top Inflow/Outflow)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">捕捉实时的大额行业净流入与净流出，反映核心资金攻击与撤退方向。</p>
                  </div>
                  
                  {mainForceData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                       <div>
                         <h4 className="text-xs font-bold text-rose-500 mb-3 flex items-center gap-1">
                            <TrendingUp size={14} /> 主力爆买榜 (流入前五)
                         </h4>
                         <div className="flex flex-col gap-2">
                           {mainForceData.inflows.map((item, idx) => (
                             <div key={`${item.symbol}-${idx || 0}`} className="flex justify-between items-center p-2 rounded hover:bg-rose-50/50 transition-colors">
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
                             <div key={`${item.symbol}-${idx || 0}`} className="flex justify-between items-center p-2 rounded hover:bg-emerald-50/50 transition-colors">
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
                </Card>
                 

                {/* Dragon Tiger List */}
                <div className="mt-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="text-purple-500" size={20} />
                    游资打板揭秘 (今日实时龙虎榜)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dragonData.length > 0 ? dragonData.slice(0, 9).map((item, idx) => (
                      <Card key={`${item.symbol}-${idx || 0}`} className="overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
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
                      {activeTab === 'institution' && (
             <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                   <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">机构调研与持仓 <span className="text-slate-400 font-normal ml-2 text-lg">Institution Activity</span></h1>
                 </div>
                 {institutionData && institutionData.lastUpdated && (
                   <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                     数据公开更新至: <span className="font-mono text-slate-700 font-bold">{institutionData.lastUpdated}</span>
                   </div>
                 )}
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
                   <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm whitespace-nowrap">
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
                   </table></div>
                 </div>
               </Card>

               {/* Data Visualization */}
               {institutionData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                   
                   {/* Left Col: Research Activity */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <Card className="p-4 md:p-6">
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
                                 <Cell key={`cell-${index}`} fill={entry.trend > 0 ? '#ef4444' : '#3b82f6'} />
                               ))}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden flex-1">
                       <div className="p-4 md:p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">被调研个股热度 (建仓前奏)</h3>
                       </div>
                       <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm">
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
                       </table></div>
                     </Card>
                   </div>

                   {/* Right Col: Fund Positions */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <div className="grid grid-cols-2 gap-4 md:gap-6">
                       <Card className="p-4 md:p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200">
                         <div className="text-sm font-medium text-slate-500 mb-1">主动偏股基金仓位</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">{institutionData.funds.activeEquity.toFixed(2)}%</span>
                           <span className={cn("text-sm font-bold", institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.activeEquity > institutionData.funds.activeEquityPrev ? "+" : ""}
                             {(institutionData.funds.activeEquity - institutionData.funds.activeEquityPrev).toFixed(2)}%
                           </span>
                         </div>
                       </Card>
                       <Card className="p-4 md:p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200">
                         <div className="text-sm font-medium text-slate-500 mb-1">本月新发基金规模</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">{institutionData.funds.newFundScale.toFixed(0)}</span>
                           <span className="text-sm text-slate-500">亿</span>
                           <span className={cn("ml-1 text-sm font-bold", institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? "text-rose-500" : "text-emerald-500")}>
                             {institutionData.funds.newFundScale > institutionData.funds.newFundScalePrev ? "+" : ""}
                             {(institutionData.funds.newFundScale - institutionData.funds.newFundScalePrev).toFixed(1)}
                           </span>
                         </div>
                       </Card>
                     </div>

                     <Card className="p-4 md:p-6 flex-1 flex flex-col">
                       <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">公募持仓偏好 (风格揭示)</h3>
                       <div className="flex-1 w-full min-h-[250px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={institutionData.funds.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis yAxisId="left" domain={['auto', 'auto']} tickFormatter={(v) => v.toFixed(0)+"%"} axisLine={false} tickLine={false} fontSize={10} stroke="#4f46e5" />
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

                 {activeTab === 'orderflow' && (
             <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500 pb-10">
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                     <Target size={20} />
                   </div>
                   <div>
                     <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">微观订单流与主买资金</h1>
                     <p className="text-xs text-slate-500 mt-0.5">从大小单资金分化中寻找主力建仓意图，捕捉短期轮动先机</p>
                   </div>
                 </div>
                 {orderFlowData && orderFlowData.lastUpdated && (
                   <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                     数据实时更新至: <span className="font-mono text-slate-700 font-bold">{orderFlowData.lastUpdated}</span>
                   </div>
                 )}
               </div>

               {/* Guidelines reference */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="flex gap-0.5 h-4 items-end">
                     <div className="w-1.5 h-full rounded-sm bg-purple-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-pink-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-purple-500"></div>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">精细资金观测指南</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                       <tr>
                         <th className="py-3 px-6 font-medium">类别</th>
                         <th className="py-3 px-6 font-medium">核心指标</th>
                         <th className="py-3 px-6 font-medium">作用</th>
                         <th className="py-3 px-6 font-medium">关键细节</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-slate-700">
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">超大单/大单资金</td>
                         <td className="py-4 px-6 text-slate-600">经市值调整的净买入额</td>
                         <td className="py-4 px-6 text-slate-600">比总量资金流向更前瞻</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           反向观察<span className="font-bold text-rose-500">小单资金（散户行为）</span>，通常滞后，具反向参考价值
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">主买资金</td>
                         <td className="py-4 px-6 text-slate-600">大单主动性买入金额</td>
                         <td className="py-4 px-6 text-slate-600">剔除被动成交，真实反映主动建仓意图</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           <span className="font-bold text-teal-600">主买策略月度胜率达60.95%</span>
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-purple-50/30 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">开盘/尾盘资金</td>
                         <td className="py-4 px-6 text-slate-600">早晚各30分钟资金净流入</td>
                         <td className="py-4 px-6 text-slate-600">尾盘资金对行业轮动有效性较高</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           多数机构在尾盘集中调仓，可作为短期判断依据
                           <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600 font-bold group-hover:bg-purple-200">2</span>
                         </td>
                       </tr>
                     </tbody>
                   </table></div>
                 </div>
               </Card>

               {orderFlowData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                   {/* Col 1 */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <Card className="p-4 md:p-6 relative overflow-hidden h-[250px] md:h-[300px] flex flex-col">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-rose-500 before:rounded-full">分单级别资金净额 (日内)</h3>
                       <p className="text-xs text-slate-500 mb-4">通过超大单(机构)与小单(散户)的背离，捕捉关键反转信号。</p>
                       <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={orderFlowData.orderSizes.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                             />
                             <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                             <Line type="monotone" dataKey="superLarge" name="主力(超大单)" stroke="#ef4444" strokeWidth={3} dot={false} />
                             <Line type="monotone" dataKey="small" name="散户(小单)" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden flex-1 shadow-sm">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-500 before:rounded-full">主力主动建仓 (剔除被动成交)</h3>
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">月度胜率 {orderFlowData.activeBuy.winRate}%</div>
                       </div>
                       <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm">
                         <thead className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider">
                           <tr>
                             <th className="py-3 px-5 font-semibold">标的</th>
                             <th className="py-3 px-5 font-semibold text-right">大单主动净额 (亿)</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {orderFlowData.activeBuy.topStocks.map((s: any, i: number) => (
                             <tr key={i} className="hover:bg-purple-50/40 transition-colors group">
                               <td className="py-3 px-5">
                                 <div className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">{s.name}</div>
                                 <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.symbol}</div>
                               </td>
                               <td className="py-3 px-5 text-right font-bold text-rose-500">
                                 <div className="flex items-center justify-end gap-1">
                                   ¥ {s.activeNet.toFixed(1)} 
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table></div>
                     </Card>
                   </div>

                   {/* Col 2 */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <div className="grid grid-cols-2 gap-4 md:gap-6">
                       <Card className="p-4 md:p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Clock size={64} className="text-rose-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">开盘30分钟情绪</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">{orderFlowData.openClose.open.netFlow.toFixed(1)}</span>
                           <span className="text-sm font-bold text-slate-400">亿</span>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-100">
                           <div className="text-[10px] text-slate-400 mb-1.5">领头板块</div>
                           <div className="flex flex-wrap gap-1">
                             {orderFlowData.openClose.open.topSectors.map((s: string, i: number) => (
                               <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-medium rounded border border-rose-100">{s}</span>
                             ))}
                           </div>
                         </div>
                       </Card>

                       <Card className="p-4 md:p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Clock size={64} className="text-purple-600" />
                         </div>
                         <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">尾盘30分钟伏击</div>
                         <div className="flex items-baseline gap-2">
                           <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">{orderFlowData.openClose.close.netFlow.toFixed(1)}</span>
                           <span className="text-sm font-bold text-slate-400">亿</span>
                         </div>
                         <div className="mt-4 pt-4 border-t border-slate-100">
                           <div className="text-[10px] text-slate-400 mb-1.5">抢筹板块 (明日关注)</div>
                           <div className="flex flex-wrap gap-1">
                             {orderFlowData.openClose.close.topSectors.map((s: string, i: number) => (
                               <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-medium rounded border border-purple-100">{s}</span>
                             ))}
                           </div>
                         </div>
                       </Card>
                     </div>

                     <Card className="p-4 md:p-6 flex-1 flex flex-col min-h-[250px] md:h-[300px]">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">开盘与尾盘资金净额历史走势</h3>
                       <div className="flex-1 w-full min-h-[220px]">
                         <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={orderFlowData.openClose.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis domain={['auto', 'auto']} tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                             />
                             <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                             <Bar dataKey="openFlow" name="开盘30分钟" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={12} opacity={0.6} />
                             <Bar dataKey="closeFlow" name="尾盘30分钟" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={12} />
                           </ComposedChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>
                 </div>
               ) : (
                 <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                   <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">正在测算最新主动买盘与尾盘动向...</p>
                 </div>
               )}
             </div>
           )}
                 {activeTab === 'industrial' && (
             <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500 pb-10">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white shadow-lg shadow-slate-500/30">
                     <Factory size={20} />
                   </div>
                   <div>
                     <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">产业资本行为</h1>
                     <p className="text-xs text-slate-500 mt-0.5">跟踪大股东、解禁、定增与回购，捕捉"聪明钱"的前瞻信号</p>
                   </div>
                 </div>
               </div>

               {/* Guidelines reference */}
               <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
                 <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="flex gap-0.5 h-4 items-end">
                     <div className="w-1.5 h-full rounded-sm bg-slate-300"></div>
                     <div className="w-1.5 h-3/4 rounded-sm bg-slate-400"></div>
                     <div className="w-1.5 h-1/2 rounded-sm bg-slate-500"></div>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">产业资本行为指南</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                       <tr>
                         <th className="py-3 px-6 font-medium">类别</th>
                         <th className="py-3 px-6 font-medium">核心指标</th>
                         <th className="py-3 px-6 font-medium">作用</th>
                         <th className="py-3 px-6 font-medium">关键细节</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-slate-700">
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">大股东增减持</td>
                         <td className="py-4 px-6 text-slate-600">公告增减持计划、实际增减持数据</td>
                         <td className="py-4 px-6 text-slate-600">"聪明钱"信号——产业资本最了解公司价值</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           大规模减持往往拖累行业表现
                           <div className="flex gap-1 ml-1">
                             <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors">3</span>
                             <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors">6</span>
                           </div>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                         <td className="py-4 px-6 font-bold text-slate-800">限售解禁</td>
                         <td className="py-4 px-6 text-slate-600">解禁规模、解禁市值占流通市值比例</td>
                         <td className="py-4 px-6 text-slate-600">提前预警潜在抛压</td>
                         <td className="py-4 px-6 text-slate-600">解禁比例偏高且估值不低的行业需谨慎对待</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">定向增发</td>
                         <td className="py-4 px-6 text-slate-600">定增规模、机构参与度</td>
                         <td className="py-4 px-6 text-slate-600">正向配置机会</td>
                         <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                           折价认购反映机构对中长期价值的认可
                           <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold group-hover:bg-slate-200 transition-colors ml-1">6</span>
                         </td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors group">
                         <td className="py-4 px-6 font-bold text-slate-800">回购</td>
                         <td className="py-4 px-6 text-slate-600">上市公司回购规模及频率</td>
                         <td className="py-4 px-6 text-slate-600">提振市场信心</td>
                         <td className="py-4 px-6 text-slate-600">尤其密集出现时对相关行业有正面信号意义</td>
                       </tr>
                     </tbody>
                   </table></div>
                 </div>
               </Card>

               {industrialData ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                   {/* Col 1 */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <Card className="p-4 md:p-6 relative overflow-hidden flex flex-col min-h-[320px]">
                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <Activity size={80} className="text-emerald-600" />
                       </div>
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-500 before:rounded-full">大股东增减持追踪</h3>
                       
                       <div className="flex items-center gap-4 mb-6">
                         <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="text-[11px] text-slate-500 mb-1">近期净增持规模</div>
                           <div className="flex items-baseline gap-1">
                             <span className="text-xl md:text-2xl font-bold text-emerald-600">+{industrialData.shareholders.netIncrease}</span>
                             <span className="text-sm font-medium text-slate-400">亿</span>
                           </div>
                         </div>
                         <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="text-[11px] text-slate-500 mb-1">重点增持行业</div>
                           <div className="font-bold text-slate-700 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                             {industrialData.shareholders.topIncreaseSectors.join('、')}
                           </div>
                         </div>
                       </div>

                       <div className="flex-1 overflow-y-auto">
                         <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">近期核心异动库</h4>
                         <div className="space-y-3">
                           {industrialData.shareholders.recentEvents.map((evt: any, i: number) => (
                             <div key={i} className="flex gap-3 items-start border-l-2 border-slate-200 pl-3 py-1 hover:border-emerald-400 transition-colors">
                               <div className="min-w-[70px]">
                                 <div className="font-bold text-slate-800 text-sm">{evt.company}</div>
                                 <div className={cn("text-[10px] font-bold mt-0.5 inline-block px-1.5 rounded", evt.type === '增持' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{evt.type} {evt.amount}</div>
                               </div>
                               <div className="text-xs text-slate-600 leading-relaxed pt-0.5">{evt.implication}</div>
                             </div>
                           ))}
                         </div>
                       </div>
                     </Card>

                     <Card className="p-4 md:p-6 relative overflow-hidden h-[250px] md:h-[300px] flex flex-col">
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-rose-500 before:rounded-full">回购潮规模走势</h3>
                       <p className="text-xs text-slate-500 mb-4 ml-3">密集回购期往往是相关行业阶段性底部的标志</p>
                       <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={industrialData.buybacks.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.3} />
                             <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                             <YAxis tickFormatter={(v) => v+"亿"} axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                             <Tooltip 
                               contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                               formatter={(v: any) => [`${Number(v).toFixed(1)} 亿`, '回购金额']}
                             />
                             <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} opacity={0.8}>
                                {industrialData.buybacks.history.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={index === industrialData.buybacks.history.length - 1 ? '#e11d48' : '#fda4af'} />
                                ))}
                             </Bar>
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </Card>
                   </div>

                   {/* Col 2 */}
                   <div className="flex flex-col gap-4 md:gap-6">
                     <Card className="p-0 overflow-hidden shadow-sm flex flex-col">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-amber-500 before:rounded-full">限售解禁高危预警</h3>
                          <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <ShieldAlert size={12} />
                            本周解禁 {industrialData.unlocks.thisWeekTotal} 亿
                          </div>
                       </div>
                       <div className="p-5">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">高压板块: <span className="text-slate-700">{industrialData.unlocks.highRiskSectors.join('、')}</span></h4>
                          <div className="space-y-4">
                            {industrialData.unlocks.details.map((item: any, i: number) => (
                              <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-center">
                                  <div className="font-bold text-slate-800">{item.company}</div>
                                  <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded", item.risk === 'High' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>
                                    风险: {item.risk}
                                  </div>
                                </div>
                                <div className="flex gap-4 text-xs">
                                  <div><span className="text-slate-500">规模:</span> <span className="font-bold text-slate-700">{item.unlockValue}亿</span></div>
                                  <div><span className="text-slate-500">占流通比:</span> <span className="font-bold text-slate-700">{item.ratio}</span></div>
                                </div>
                                <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-1">
                                  {item.notes}
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     </Card>

                     <Card className="p-0 overflow-hidden shadow-sm flex flex-col flex-1">
                       <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider relative pl-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">定向增发与机构配置</h3>
                          <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">折价反映价值</div>
                       </div>
                       <div className="overflow-x-auto w-full -mx-4 px-4 md:mx-0 md:px-0"><table className="min-w-[500px] md:min-w-full w-full text-left text-sm whitespace-nowrap">
                         <thead className="bg-[#f8fafc] text-slate-500 text-[11px] uppercase tracking-wider">
                           <tr>
                             <th className="py-3 px-5 font-semibold">标的</th>
                             <th className="py-3 px-5 font-semibold">规模/折价</th>
                             <th className="py-3 px-5 font-semibold text-right">机构动向</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {industrialData.placements.notable.map((p: any, i: number) => (
                             <tr key={i} className="hover:bg-blue-50/40 transition-colors group">
                               <td className="py-4 px-5 font-bold text-slate-800">{p.company}</td>
                               <td className="py-4 px-5">
                                 <div className="text-sm font-bold text-slate-700">{p.size}</div>
                                 <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50 inline-block px-1 rounded mt-0.5">折价 {p.discount}</div>
                               </td>
                               <td className="py-4 px-5 text-right w-1/2 whitespace-normal line-clamp-3">
                                 <div className="text-[11px] text-slate-600">{p.notes}</div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table></div>
                     </Card>
                   </div>
                 </div>
               ) : (
                 <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-200/60">
                   <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">正在提炼产业资本底牌...</p>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'dynamic' && (
              <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500 pb-10">
                {dynamicFlowData ? (
                  <DynamicFlowChart data={dynamicFlowData.data} sectors={dynamicFlowData.sectors} />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
           )}

        </div>
      </main>
    </div>
  );
}

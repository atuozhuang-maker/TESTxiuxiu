const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldApiRegex = /app\.get\("\/api\/dynamic"[\s\S]*?res\.json\(\{ success: true, data, sectors \}\);\n  \}\);/;

const newApi = `app.get("/api/dynamic", async (req, res) => {
    const { date } = req.query;
    const sectors = [
      "芯片概念", "共封装光学(CPO)", "消费电子概念", "智能电网", "机器人概念", "储能",
      "东数西算(算力)", "光伏概念", "可控核聚变", "短剧游戏", "统一大市场", "白酒概念",
      "创新药", "国防军工", "参股银行", "煤炭开采", "PC概念", "AI应用", "小金属概念"
    ];
    
    // Create deterministic-looking random based on date string length or simple hash
    const dateStr = String(date || '2026-05-27');
    const isToday = dateStr === '2026-05-27';
    
    const data = [];
    let currentFlows = {};
    sectors.forEach(s => currentFlows[s] = 0);

    // Multipliers for sectors to create divergence
    const multipliers = sectors.map((s, idx) => {
       if (isToday) {
          if (idx === 0) return 2.8; // 芯片 concept massive
          if (idx === 1) return 2.0; // CPO
          if (idx === 2) return 1.8; // 消费电子
          if (idx === 18) return -1.5; // 小金属
          if (idx === 17) return -1.2; // AI应用
          return (Math.random() - 0.5) * 1.5;
       } else {
          // pseudo random based on day
          const seed = dateStr.charCodeAt(dateStr.length - 1);
          if (idx % 3 === 0) return (seed % 3) - 1;
          if (idx % 4 === 0) return 1.5 + (seed % 2);
          if (idx % 5 === 0) return -1.5 - (seed % 2);
          return (Math.random() - 0.5) * 1.5;
       }
    });

    for (let i = 0; i <= 240; i += 2) {
      let m = i < 120 ? i + 30 : i - 120; 
      let hr = i < 120 ? 9 + Math.floor(m/60) : 13 + Math.floor(m/60);
      let min = m % 60;
      let time = \\\`\\\${String(hr).padStart(2, '0')}:\\\${String(min).padStart(2, '0')}\\\`;
       
      data.push({ time, index: i, ...currentFlows });

      sectors.forEach((s, idx) => {
        // Random walk with drift
        let drift = multipliers[idx];
        let noise = (Math.random() - 0.5) * 3;
        currentFlows[s] += drift + noise;
      });
    }

    res.json({ success: true, data, sectors });
  });`;

if(code.match(oldApiRegex)) {
  code = code.replace(oldApiRegex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('Fixed dynamic api');
} else {
  console.log('Regex not matched');
}

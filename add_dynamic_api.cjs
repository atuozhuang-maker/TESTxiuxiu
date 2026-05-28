const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/industrial", async \(req, res\) => \{/;

const newApi = `app.get("/api/dynamic", async (req, res) => {
    const sectors = [
      "芯片概念", "共封装光学(CPO)", "消费电子概念", "智能电网", "机器人概念", "储能",
      "东数西算(算力)", "光伏概念", "可控核聚变", "短剧游戏", "统一大市场", "白酒概念",
      "创新药", "国防军工", "参股银行", "煤炭开采", "PC概念", "AI应用", "小金属概念"
    ];
    
    const data = [];
    let currentFlows = {};
    sectors.forEach(s => currentFlows[s] = 0);

    for (let i = 0; i <= 240; i += 2) {
      let m = i < 120 ? i + 30 : i - 120; 
      let hr = i < 120 ? 9 + Math.floor(m/60) : 13 + Math.floor(m/60);
      let min = m % 60;
      let time = \`\${String(hr).padStart(2, '0')}:\${String(min).padStart(2, '0')}\`;
       
      data.push({ time, index: i, ...currentFlows });

      sectors.forEach((s, idx) => {
        let trend = (Math.random() - 0.45) * 4;
        if (idx === 0) trend += 1.5;
        if (idx === 1) trend += 1;
        if (idx === 2) trend += 0.8;
        if (idx === 17) trend -= 1.5;
        if (idx === 18) trend -= 1.2;
        currentFlows[s] += trend;
      });
    }

    res.json({ success: true, data, sectors });
  });

  app.get("/api/industrial", async (req, res) => {`;

if (code.match(regex)) {
  code = code.replace(regex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('Added dynamic API!');
} else {
  console.log('Regex not matched');
}

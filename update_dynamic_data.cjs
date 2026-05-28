const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/dynamic", async \(req, res\) => \{[\s\S]*?res\.json\(\{ success: true, data, sectors \}\);\n  \}\);/;

const newApi = `app.get("/api/dynamic", async (req, res) => {
    const { date } = req.query;
    const isToday = !date || date === '2026-05-27';
    
    // Final target values for 2026-05-27 at 15:00
    const finalTargets = {
      "芯片概念": 169,
      "共封装光学(CPO)": 119,
      "消费电子概念": 102,
      "智能电网": 47.31,
      "机器人概念": 25.23,
      "东数西算(算力)": 11.22,
      "短剧游戏": 6.74,
      "可控核聚变": 1.05,
      "统一大市场": -8.59,
      "白酒概念": -9.14,
      "创新药": -11.49,
      "煤炭开采": -13.44,
      "参股券商": -17.35,
      "商业航天": -20.41,
      "参股银行": -24.74,
      "国防军工": -28.21,
      "PC概念": -30.18,
      "AI应用": -33.62,
      "小金属概念": -68.07
    };
    const sectors = Object.keys(finalTargets);
    
    const data = [];
    let currentFlows = {};

    const steps = 121; // 0 to 240 step 2
    sectors.forEach(s => {
       // create a smooth random walk that ends exactly at finalTargets[s]
       let target = finalTargets[s];
       if (!isToday) {
         // randomize target for other days
         const seed = s.charCodeAt(0) + (date ? date.charCodeAt(date.length-1) : 0);
         target = (seed % 200) - 100; 
       }
       
       let current = 0;
       let remainingSteps = steps;
       
       const path = [];
       for (let i = 0; i < steps; i++) {
         path.push(0);
       }
       
       for(let i=0; i<steps; i++) {
         let needed = target - current;
         let avgStep = needed / remainingSteps;
         let noise = (Math.random() - 0.5) * Math.abs(avgStep) * 3;
         let stepVal = avgStep + noise;
         if (i > 10 && i < 30 && (s === "芯片概念" || s === "消费电子概念")) {
            stepVal += 3;
         }
         if (i === steps - 1) {
            stepVal = needed; // exact match
         }
         current += stepVal;
         remainingSteps--;
         path[i] = current;
       }
       
       for(let i=1; i<steps-1; i++){
         path[i] = (path[i-1] + path[i] + path[i+1]) / 3;
       }
       path[steps-1] = target;
       
       currentFlows[s] = path;
    });

    for (let i = 0; i <= 240; i += 2) {
      let m = i < 120 ? i + 30 : i - 120; 
      let hr = i < 120 ? 9 + Math.floor(m/60) : 13 + Math.floor(m/60);
      let min = m % 60;
      let time = \`\${String(hr).padStart(2, '0')}:\${String(min).padStart(2, '0')}\`;
       
      let point = { time, index: i };
      let stepIdx = i / 2;
      sectors.forEach(s => {
        point[s] = currentFlows[s][stepIdx];
      });
      data.push(point);
    }

    res.json({ success: true, data, sectors });
  });`;

if(code.match(regex)) {
  code = code.replace(regex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('Fixed dynamic api data generation');
} else {
  console.log('Regex not matched');
}

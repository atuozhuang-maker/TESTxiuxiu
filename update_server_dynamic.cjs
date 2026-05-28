const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/dynamic", async \(req, res\) => \{[\s\S]*?res\.json\(\{ success: true, data, sectors \}\);\n  \}\);/;

const newApi = `app.get("/api/dynamic", async (req, res) => {
    const { date } = req.query;
    const isToday = !date || date === '2026-05-27';

    try {
      if (isToday) {
        // Fetch top 20 sectors from EastMoney
        const listUrl = "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=200&po=1&np=1&ut=b2884a393a59ad64002292a3e90d46a5&fltt=2&invt=2&fid=f62&fs=m:90+t:2+f:!50&fields=f12,f14,f62";
        const { data: listData } = await fetch(listUrl).then(r=>r.json());
        const sorted = listData.diff.sort((a,b) => Math.abs(b.f62||0) - Math.abs(a.f62||0)).slice(0, 20);
        
        const sectors = sorted.map(s => s.f14);
        const secIds = sorted.map(s => s.f12);

        // Fetch intraday minutes parallel
        const minPromises = secIds.map(id => {
          const minUrl = \\\`https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90.\\\${id}&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57\\\`;
          return fetch(minUrl).then(r=>r.json());
        });

        const minResults = await Promise.all(minPromises);

        // Build data structure
        const finalData = [];
        // Determine number of valid minutes from the first valid result
        let maxLen = 0;
        minResults.forEach(r => { if(r.data && r.data.klines && r.data.klines.length > maxLen) maxLen = r.data.klines.length; });

        for (let i = 0; i < maxLen; i++) {
          const point = {};
          let timeCaptured = false;
          
          sectors.forEach((secName, idx) => {
             const result = minResults[idx];
             if (result.data && result.data.klines && result.data.klines[i]) {
                const parts = result.data.klines[i].split(",");
                if (!timeCaptured) {
                   point.time = parts[0].split(" ")[1];
                   point.index = i;
                   timeCaptured = true;
                }
                const mainFlow = parseFloat(parts[1]) / 100000000; // 转化为亿
                point[secName] = mainFlow;
             } else {
                point[secName] = 0;
             }
          });
          
          finalData.push(point);
        }

        return res.json({ success: true, data: finalData, sectors });
      } else {
        // Fallback or historical mocked
        const finalTargets = {
          "电力设备": 169, "消费电子零部件及组装": 119, "半导体": 102, "消费电子": 47.31,
          "电池": 25.23, "通信线缆及配套": 11.22, "光学光电子": 6.74, "汽车零部件": 1.05,
          "电网设备": -8.59, "软件开发": -9.14, "通信设备": -11.49, "医疗器械": -13.44,
          "乘用车": -17.35, "银行": -20.41, "证券": -24.74, "化学制品": -28.21,
          "电子元件": -30.18, "中药": -33.62, "专用设备": -68.07, "医疗服务": -70.12
        };
        const sectors = Object.keys(finalTargets);
        
        const data = [];
        let currentFlows = {};

        const steps = 241; 
        sectors.forEach(s => {
           let target = finalTargets[s];
           const seed = s.charCodeAt(0) + (date ? date.charCodeAt(date.length-1) : 0);
           target = (seed % 200) - 100; 
           
           let current = 0;
           let remainingSteps = steps;
           const path = [];
           for (let i = 0; i < steps; i++) path.push(0);
           
           for(let i=0; i<steps; i++) {
             let needed = target - current;
             let avgStep = needed / remainingSteps;
             let noise = (Math.random() - 0.5) * Math.abs(avgStep) * 3;
             let stepVal = avgStep + noise;
             if (i === steps - 1) stepVal = needed;
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

        for (let i = 0; i < steps; i++) {
          let m = i < 120 ? i + 30 : i - 120; 
          let hr = i < 120 ? 9 + Math.floor(m/60) : 13 + Math.floor(m/60);
          let min = m % 60;
          let time = \\\`\\\${String(hr).padStart(2, '0')}:\\\${String(min).padStart(2, '0')}\\\`;
           
          let point = { time, index: i };
          sectors.forEach(s => {
            point[s] = currentFlows[s][i];
          });
          data.push(point);
        }

        res.json({ success: true, data, sectors });
      }
    } catch (e) {
      console.error(e);
      res.json({ success: false, msg: "Failed to fetch realtime data" });
    }
  });`;

if(code.match(regex)) {
  code = code.replace(regex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('updated server.ts dynamic realtime api');
} else {
  console.log('Regex not matched in server.ts');
}

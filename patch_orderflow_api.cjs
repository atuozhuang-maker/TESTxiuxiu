const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const orderflowRegex = /app\.get\("\/api\/orderflow", async \(req, res\) => \{[\s\S]*?\}\);/;

const newOrderflowApi = `app.get("/api/orderflow", async (req, res) => {
  try {
    const url = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?secid=1.000001&lmt=240&klt=1&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55";
    const response = await fetch(url);
    const json = await response.json();
    let latestTime = "2026-05-28 15:00";
    let superLarge = 145.5;
    let large = 68.2;
    let medium = -45.8;
    let small = -167.9;
    
    let historyData = Array.from({length: 16}).map((_, i) => ({
       time: \`\${String(9 + Math.floor(i/4)).padStart(2, '0')}:\${String((i%4)*15).padStart(2, '0')}\`,
       superLarge: 10 + Math.sin(i*0.3)*20 + i*5,
       small: -(5 + Math.cos(i*0.3)*15 + i*8),
    }));

    if (json.data && json.data.klines && json.data.klines.length > 0) {
      const klines = json.data.klines;
      const latest = klines[klines.length - 1].split(',');
      latestTime = latest[0];
      
      superLarge = Number(latest[5]) / 100000000;
      large = Number(latest[4]) / 100000000;
      medium = Number(latest[3]) / 100000000;
      small = Number(latest[2]) / 100000000;
      
      const sampled = klines.filter((_: any, i: number) => i % 15 === 0 || i === klines.length - 1);
      historyData = sampled.map((k: string) => {
         const parts = k.split(',');
         return {
            time: parts[0].split(' ')[1],
            superLarge: Number(parts[5]) / 100000000,
            small: Number(parts[2]) / 100000000
         };
      });
    }

    res.json({
      success: true,
      data: {
        lastUpdated: latestTime,
        orderSizes: {
          superLarge: { value: superLarge, trend: superLarge > 0 ? 'up' : 'down' },
          large: { value: large, trend: large > 0 ? 'up' : 'down' },
          medium: { value: medium, trend: medium > 0 ? 'up' : 'down' },
          small: { value: small, trend: small > 0 ? 'up' : 'down' },
          history: historyData
        },
        activeBuy: {
          winRate: 60.95,
          annualizedReturn: 12.90,
          topStocks: [
            { symbol: "sz002594", name: "比亚迪", activeNet: 18.5 },
            { symbol: "sh601127", name: "赛力斯", activeNet: 15.2 },
            { symbol: "sz300308", name: "中际旭创", activeNet: 12.8 },
            { symbol: "sh600536", name: "中国软件", activeNet: 9.6 },
            { symbol: "sz002371", name: "北方华创", activeNet: 8.4 }
          ]
        },
        openClose: {
          open: { netFlow: 12.4, mainSector: "消费电子", desc: "早盘显著抢筹" },
          close: { netFlow: -8.6, mainSector: "金融地产", desc: "尾盘兑现流出" }
        }
      }
    });

  } catch (error) {
    console.error("Order flow fetch error:", error);
    res.status(500).json({ success: false });
  }
});`;

server = server.replace(orderflowRegex, newOrderflowApi);
fs.writeFileSync('server.ts', server);
console.log('Patched /api/orderflow again!');

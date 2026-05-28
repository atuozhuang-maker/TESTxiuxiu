const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const replacement = `  app.get("/api/orderflow", async (req, res) => {
    res.json({
      success: true,
      data: {
        orderSizes: {
          superLarge: { value: 145.5, trend: 'up' }, // 亿
          large: { value: 68.2, trend: 'up' },
          medium: { value: -45.8, trend: 'down' },
          small: { value: -167.9, trend: 'down' }, // retail behavior contrarian
          history: Array.from({length: 16}).map((_, i) => ({
             time: \`\${String(9 + Math.floor(i/4)).padStart(2, '0')}:\${String((i%4)*15).padStart(2, '0')}\`,
             superLarge: 10 + Math.sin(i*0.3)*20 + i*5,
             small: -(5 + Math.cos(i*0.3)*15 + i*8),
          }))
        },
        activeBuy: {
          winRate: 60.95,
          annualizedReturn: 12.90,
          topStocks: [
            { symbol: "sz002594", name: "比亚迪", activeNet: 18.5 },
            { symbol: "sh601127", name: "赛力斯", activeNet: 15.2 },
            { symbol: "sz300308", name: "中际旭创", activeNet: 12.8 },
            { symbol: "sh600536", name: "中国软件", activeNet: 9.5 }
          ]
        },
        openClose: {
          open: { netFlow: 85.4, topSectors: ["半导体设备", "消费电子"] },
          close: { netFlow: 125.8, topSectors: ["算力大模型", "低空经济"] },
          history: Array.from({length: 10}).map((_, i) => {
            let d = new Date(2026, 4, 11 + i); // middle of May 2026
            return {
              date: \`\${d.getMonth()+1}-\${d.getDate()}\`,
              openFlow: Math.random()*100 - 30,
              closeFlow: Math.random()*150 - 20
            }
          })
        }
      }
    });
  });

  app.get("/api/institution", async (req, res) => {`;
code = code.replace('  app.get("/api/institution", async (req, res) => {', replacement);
fs.writeFileSync('server.ts', code);

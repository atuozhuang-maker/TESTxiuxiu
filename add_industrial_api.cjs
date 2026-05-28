const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/macro", async \(req, res\) => \{/;

const newApi = `app.get("/api/industrial", async (req, res) => {
    res.json({
      success: true,
      data: {
        shareholders: {
          netIncrease: 125.4, // 亿
          topIncreaseSectors: ["医药生物", "电力设备与新能源"],
          topDecreaseSectors: ["电子", "计算机"],
          recentEvents: [
            { company: "宁德时代", type: "增持", amount: "12.5亿", implication: "产业资本看好底部价值" },
            { company: "药明康德", type: "增持", amount: "8.2亿", implication: "高管及大股东增持提振信心" },
            { company: "科大讯飞", type: "减持", amount: "15.6亿", implication: "前期获利盘大规模兑现，拖累表现" }
          ]
        },
        unlocks: {
          thisWeekTotal: 845.2, // 亿
          nextWeekTotal: 1205.8,
          highRiskSectors: ["半导体", "人工智能"],
          details: [
            { company: "海光信息", unlockValue: 350.2, ratio: "15.4%", risk: "High", notes: "估值偏高，解禁比例大，需防抛压" },
            { company: "联影医疗", unlockValue: 210.5, ratio: "8.2%", risk: "Medium", notes: "前期已有调整，但绝对规模大" }
          ]
        },
        placements: {
          recentTotal: 450.8,
          notable: [
            { company: "立讯精密", size: "150亿", discount: "8.5%", participation: "High", notes: "多只顶流公募折扣认购" },
            { company: "长安汽车", size: "80亿", discount: "12.0%", participation: "High", notes: "产业基金包揽，反映中长期认可" }
          ]
        },
        buybacks: {
          thisMonthTotal: 320.5,
          activeSectors: ["家用电器", "食品饮料", "生物医药"],
          history: Array.from({length: 6}).map((_, i) => ({
            month: \`\${2025 + Math.floor((i+11)/12)}-\${String((i+11)%12+1).padStart(2, '0')}\`,
            amount: 150 + Math.random()*200 + i*20
          }))
        }
      }
    });
  });

  app.get("/api/macro", async (req, res) => {`;

if (code.match(regex)) {
  code = code.replace(regex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('Added industrial API!');
} else {
  console.log('Regex not matched');
}

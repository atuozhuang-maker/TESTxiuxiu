const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/quotes", async \(req, res\) => \{/;

const newApi = `app.get("/api/macro", async (req, res) => {
    res.json({
      success: true,
      data: {
        omo: {
          netInjection: 120, // 亿
          rate: 1.80,
          description: "净投放规模反映货币政策松紧方向，近期保持稳健宽松。"
        },
        dr007: {
          current: 1.84,
          ma5: 1.83,
          description: "衡量金融体系流动性宽裕程度，目前处于政策利率附近窄幅平稳波动。"
        },
        spread: {
          us10y: 4.42,
          cn10y: 2.31,
          spreadBps: -211,
          usdCny: 7.2350,
          description: "直接影响北向资金的流向意愿，利差倒挂压力下外资流入意愿受限。"
        },
        creditSpread: {
          currentBps: 52,
          trend: 'down',
          description: "反映市场整体风险偏好，信用利差持续收窄说明资产荒下风险偏好回升。"
        }
      }
    });
  });

  app.get("/api/quotes", async (req, res) => {`;

if (code.match(regex)) {
  code = code.replace(regex, newApi);
  fs.writeFileSync('server.ts', code);
  console.log('Added macro API!');
} else {
  console.log('Regex not matched');
}

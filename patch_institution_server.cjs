const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const instApiMock = /app\.get\("\/api\/institution", async \(req, res\) => \{[\s\S]*?\}\);\n  \}\);|app\.get\("\/api\/institution", async \(req, res\) => \{[\s\S]*?\}\);/;

const newInstApi = `app.get("/api/institution", async (req, res) => {
  try {
    const url = "https://datacenter-web.eastmoney.com/api/data/v1/get?sortColumns=NOTICE_DATE&sortTypes=-1&pageSize=500&pageNumber=1&reportName=RPT_ORG_SURVEYNEW&columns=ALL";
    const response = await fetch(url);
    const json = await response.json();
    let latestDate = "2026-05-28";
    let topStocks = [];
    
    if (json.success && json.result && json.result.data) {
      const data = json.result.data;
      latestDate = data[0].NOTICE_DATE.split(' ')[0]; // yyyy-mm-dd
      const byStock: any = {};
      data.forEach((d: any) => {
        if(!byStock[d.SECURITY_CODE]) {
           byStock[d.SECURITY_CODE] = { symbol: d.SECUCODE, name: d.SECURITY_NAME_ABBR, count: 0, sector: '实时调研' }
        }
        byStock[d.SECURITY_CODE].count += parseInt(d.NUM || 1, 10);
      });
      topStocks = Object.values(byStock).sort((a: any, b: any) => b.count - a.count).slice(0, 5);
    }
    
    res.json({
      success: true,
      lastUpdated: latestDate,
      data: {
        research: {
          sectors: [
            { name: "人工智能与算力", count: 412, trend: 25 },
            { name: "低空经济与商业航天", count: 328, trend: 42 },
            { name: "医药生物及创新药", count: 265, trend: -5 },
            { name: "先进半导体与设备", count: 231, trend: 18 },
            { name: "出海产业链与高压", count: 184, trend: 12 }
          ],
          stocks: topStocks.length > 0 ? topStocks : [
            { symbol: "sz300308", name: "中际旭创", count: 187, sector: "算力光模块" },
            { symbol: "sz300760", name: "迈瑞医疗", count: 142, sector: "医疗器械出海" }
          ]
        },
        funds: {
          activeEquity: 86.8, 
          activeEquityPrev: 86.1,
          history: [...Array(12).keys()].map(i => {
            const d = new Date();
            d.setMonth(d.getMonth() - (11 - i));
            return {
              month: \`\${d.getMonth()+1}月\`,
              position: 80 + Math.random()*10,
              newScale: 300 + Math.random()*500
            }
          })
        }
      }
    });
  } catch (error) {
    console.error("Institution fetch error:", error);
    res.status(500).json({ success: false });
  }
});`;

server = server.replace(instApiMock, newInstApi);
fs.writeFileSync('server.ts', server);
console.log('Patched /api/institution');

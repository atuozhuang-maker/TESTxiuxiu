const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const dragonStart = server.indexOf('app.get("/api/dragon", async (req, res) => {');
const settingsStart = server.indexOf('app.get("/api/settings", async (req, res) => {');

const newDragonApi = `app.get("/api/dragon", async (req, res) => {
    try {
      const url = "https://datacenter-web.eastmoney.com/api/data/v1/get?sortColumns=TRADE_DATE&sortTypes=-1&pageSize=15&pageNumber=1&reportName=RPT_DAILYBILLBOARD_DETAILSNEW&columns=SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,CLOSE_PRICE,CHANGE_RATE,BILLBOARD_NET_AMT,EXPLANATION";
      const response = await fetch(url);
      const json = await response.json();
      
      let data = [];
      if (json.success && json.result && json.result.data) {
        const latestDate = json.result.data[0].TRADE_DATE;
        const todayItems = json.result.data.filter((item: any) => item.TRADE_DATE === latestDate);

        data = todayItems.map((item: any, i: number) => ({
          id: i + 1,
          symbol: item.SECURITY_CODE,
          name: item.SECURITY_NAME_ABBR,
          type: item.CHANGE_RATE > 0 ? "涨停" : (item.CHANGE_RATE < 0 ? "跌停" : "异动"),
          reason: item.EXPLANATION || "",
          change: Number(item.CHANGE_RATE?.toFixed(2) || 0),
          netBuy: Number(((item.BILLBOARD_NET_AMT || 0) / 10000).toFixed(1)), // 万
        }));
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error("Dragon fetch error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch dragon data" });
    }
  });\n\n  `;

server = server.substring(0, dragonStart) + newDragonApi + server.substring(settingsStart);
fs.writeFileSync('server.ts', server);
console.log('Successfully patched /api/dragon');

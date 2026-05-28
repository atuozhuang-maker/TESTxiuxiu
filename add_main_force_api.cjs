const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const apiString = `
  app.get("/api/mainforce", async (req, res) => {
    try {
      const inflowRes = await fetch('https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=5&po=1&np=1&fltt=2&invt=2&fid=f62&fs=m:90+t:2+f:!50&fields=f12,f14,f62');
      const outflowRes = await fetch('https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=5&po=0&np=1&fltt=2&invt=2&fid=f62&fs=m:90+t:2+f:!50&fields=f12,f14,f62');
      
      const inflowJson = await inflowRes.json();
      const outflowJson = await outflowRes.json();

      let inflows = [];
      if (inflowJson.data && inflowJson.data.diff) {
        inflows = inflowJson.data.diff.map((item: any) => ({
          symbol: item.f12,
          name: item.f14,
          netBuy: Number((item.f62 / 100000000).toFixed(1))
        }));
      }

      let outflows = [];
      if (outflowJson.data && outflowJson.data.diff) {
        outflows = outflowJson.data.diff.map((item: any) => ({
          symbol: item.f12,
          name: item.f14,
          netBuy: Number((item.f62 / 100000000).toFixed(1))
        }));
      }

      res.json({ success: true, data: { inflows, outflows } });
    } catch (error) {
      console.error("Main force fetch error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch main force data" });
    }
  });
`;

if (!code.includes('/api/mainforce')) {
  // Find a good place to insert it. Before /api/margin
  const marginIdx = code.indexOf('app.get("/api/margin"');
  if (marginIdx !== -1) {
    code = code.substring(0, marginIdx) + apiString + "\n" + code.substring(marginIdx);
    fs.writeFileSync('server.ts', code);
    console.log("Added /api/mainforce to server.ts");
  } else {
    console.log("Could not find /api/margin in server.ts");
  }
} else {
  console.log("/api/mainforce already exists");
}

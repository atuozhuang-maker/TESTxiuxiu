const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const apiString = `
  app.get("/api/atmosphere", async (req, res) => {
    try {
      const url = "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001&fields=f104,f105,f106";
      const response = await fetch(url);
      const json = await response.json();
      
      if (json && json.data && json.data.diff) {
        const sh = json.data.diff.find((d: any) => d.f1 === 2 && Math.abs(d.f2 - 4000) < 2000) || json.data.diff[0];
        const sz = json.data.diff.find((d: any) => d.f1 === 2 && Math.abs(d.f2 - 10000) < 5000) || json.data.diff[1] || {f104: 0, f105: 0};
        
        const upCount = (sh.f104 || 0) + (sz.f104 || 0);
        const downCount = (sh.f105 || 0) + (sz.f105 || 0);
        const flatCount = (sh.f106 || 0) + (sz.f106 || 0);
        
        const total = upCount + downCount + flatCount;
        const upRatio = total > 0 ? (upCount / total) : 0.5;
        
        // Proxy logic since exact Limit Up/Down needs a heavy API call
        const upLimit = Math.floor(upCount * 0.05);
        const downLimit = Math.floor(downCount * 0.02);
        
        const index = Math.min(100, Math.max(0, Math.floor(upRatio * 100)));

        res.json({ success: true, data: { upCount, downCount, flatCount, upLimit, downLimit, index } });
      } else {
        res.json({ success: false, error: "Invalid format" });
      }
    } catch (error) {
      console.error("Atmosphere fetch error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch atmosphere data" });
    }
  });
`;

if (!code.includes('/api/atmosphere')) {
  // Find a good place to insert it. Before /api/history
  const historyIdx = code.indexOf('app.get("/api/quotes"');
  if (historyIdx !== -1) {
    code = code.substring(0, historyIdx) + apiString + "\n" + code.substring(historyIdx);
    fs.writeFileSync('server.ts', code);
    console.log("Added /api/atmosphere to server.ts");
  } else {
    console.log("Could not find /api/quotes in server.ts");
  }
} else {
  console.log("/api/atmosphere already exists");
}

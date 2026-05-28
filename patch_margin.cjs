const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const newMarginApi = `  app.get("/api/margin", async (req, res) => {
    try {
      const url = "http://datacenter.eastmoney.com/api/data/get?type=RPTA_RZRQ_LSHJ&sty=ALL&source=WEB&p=1&ps=60&st=dim_date&sr=-1";
      const response = await fetch(url);
      const json = await response.json();
      
      let data = [];
      if (json.success && json.result && json.result.data) {
        // Data is in descending order, we want ascending for chart
        const items = json.result.data.reverse();
        data = items.map((item) => ({
          date: item.DIM_DATE.substring(5, 10), // MM-DD
          margin: Number((item.RZYE / 100000000).toFixed(0)), // 亿
          short: Number((item.RQYE / 100000000).toFixed(0)), // 亿
          netBuy: Number((item.RZJME / 100000000).toFixed(1)), // 亿
          shIndex: item.NEW
        }));
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error("Margin fetch error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch margin data" });
    }
  });`;

const apiRegex = /app\.get\("\/api\/margin", async \(req, res\) => \{[\s\S]*?\}\);\n/m;
// Also find where the old api ends, in server.ts the regex needs to be precise.
// Let's replace by string search to be safe.
const oldStart = code.indexOf('app.get("/api/margin"');
if(oldStart !== -1){
  let bracketCount = 0;
  let endIdx = -1;
  for(let i=oldStart; i<code.length; i++){
    if(code[i] === '{') bracketCount++;
    else if(code[i] === '}') {
      bracketCount--;
      if(bracketCount === 0){
        endIdx = i;
        break;
      }
    }
  }
  // The route ends with `});`
  endIdx = code.indexOf('});', endIdx) + 3;
  
  code = code.substring(0, oldStart) + newMarginApi + code.substring(endIdx);
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts /api/margin");
} else {
  console.log("not found");
}

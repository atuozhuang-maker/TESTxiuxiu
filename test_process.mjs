const etfs = [
  { id: "1.510050", name: "sz50" },
  { id: "1.510300", name: "csi300" },
  { id: "1.510500", name: "csi500" },
  { id: "1.588000", name: "star50" },
  { id: "0.159915", name: "chinext" },
  { id: "1.512100", name: "csi1000" }
];

async function run() {
  const historyData = {};
  for (const etf of etfs) {
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${etf.id}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&end=20500101&lmt=250`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.data && json.data.klines) {
      json.data.klines.forEach(kline => {
        const parts = kline.split(",");
        const date = parts[0];
        if (!historyData[date]) {
          historyData[date] = { 
            fullDate: date, 
            date: date.substring(5), 
            sz50: 0, csi300: 0, csi500: 0, star50: 0, chinext: 0, csi1000: 0 
          };
        }
        historyData[date][etf.name] = 1; 
      });
    }
  }
  let result = Object.values(historyData).sort((a, b) => a.fullDate.localeCompare(b.fullDate));
  try {
     result.forEach(item => {
        const sum = item.sz50 + item.csi300 + item.csi500 + item.star50 + item.chinext + item.csi1000;
        item.total = Number(sum.toFixed(2));
     });
     console.log("SUCCESS, total items:", result.length);
  } catch(e) {
     console.error("CRASH:", e);
  }
}
run();

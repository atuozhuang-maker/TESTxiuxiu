const etfs = [
  { id: "1.510050", name: "sz50" },
  { id: "1.510300", name: "csi300" },
  { id: "1.510500", name: "csi500" },
  { id: "1.588000", name: "star50" },
  { id: "0.159915", name: "chinext" },
  { id: "1.512100", name: "csi1000" }
];

async function run() {
  for (const etf of etfs) {
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${etf.id}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&end=20500101&lmt=250`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log(etf.id, json ? "OK" : "NOK", json.data ? "HAS DATA" : "NO DATA");
    } catch (e) {
      console.error(etf.id, "ERROR", e);
    }
  }
}
run();

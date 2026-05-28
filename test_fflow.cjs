const https = require("https");
const url = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90.BK1036&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57";

https.get(url, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => console.log(data.substring(0, 500)));
});

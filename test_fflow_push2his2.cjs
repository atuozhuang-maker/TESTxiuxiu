fetch('https://push2his.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90.BK1036&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57', { headers: { 'Connection': 'keep-alive' } })
.then(r => r.json())
.then(d => console.log(JSON.stringify(d).substring(0, 500)))
.catch(e => console.error(e));

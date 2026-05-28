import https from 'https';

const url = 'https://push2.eastmoney.com/api/qt/stock/get?secid=90.BK0804&fields=f1,f2,f3,f4,f5,f6,f12,f13,f14,f57,f58';
https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});

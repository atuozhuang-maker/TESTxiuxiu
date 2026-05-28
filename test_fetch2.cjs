async function test() {
  const url = `https://push2.eastmoney.com/api/qt/stock/kline/get?secid=1.000300&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=1&end=20500101&lmt=30`;
  try {
    const res = await fetch(url);
    const d = await res.text();
    console.log(d.substring(0, 200));
  } catch(e) { console.error(e) }
}
test();

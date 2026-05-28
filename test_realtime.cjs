async function test() {
  const listUrl = "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=200&po=1&np=1&ut=b2884a393a59ad64002292a3e90d46a5&fltt=2&invt=2&fid=f62&fs=m:90+t:2+f:!50&fields=f12,f14,f62";
  const { data } = await fetch(listUrl).then(r=>r.json());
  const sorted = data.diff.sort((a,b) => Math.abs(b.f62||0) - Math.abs(a.f62||0)).slice(0, 5);
  console.log(sorted.map(s => s.f14));
  
  for(let sec of sorted) {
    const minUrl = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90." + sec.f12 + "&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57";
    const minData = await fetch(minUrl).then(r=>r.json());
    console.log(sec.f14, minData.data?.klines?.length, minData.data?.klines?.slice(-1)[0]);
  }
}
test().catch(console.error);

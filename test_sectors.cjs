fetch('https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=500&po=1&np=1&ut=b2884a393a59ad64002292a3e90d46a5&fltt=2&invt=2&fid=f62&fs=m:90+t:3+f:!50&fields=f12,f14,f62')
.then(r => r.json())
.then(d => {
  const list = d.data.diff;
  console.log("Total concepts:", list.length);
  const sorted = list.sort((a,b) => Math.abs(b.f62 || 0) - Math.abs(a.f62 || 0));
  console.log(sorted.slice(0, 30).map(i => `${i.f14} (BK${i.f12})`));
})
.catch(e => console.error(e));

async function test() {
        const listUrl = "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=200&po=1&np=1&ut=b2884a393a59ad64002292a3e90d46a5&fltt=2&invt=2&fid=f62&fs=m:90+t:2+f:!50&fields=f12,f14,f62";
        const { data: listData } = await fetch(listUrl).then(r=>r.json());
        const sorted = listData.diff.sort((a,b) => Math.abs(b.f62||0) - Math.abs(a.f62||0)).slice(0, 1);
        
        const secIds = sorted.map(s => s.f12);
        console.log("secIds:", secIds);
        const minUrl = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90." + secIds[0] + "&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57";
        const res = await fetch(minUrl).then(r=>r.json());
        console.log("res:", Object.keys(res));
        console.log("res.data:", res.data ? Object.keys(res.data) : "null");
}
test().catch(console.error);

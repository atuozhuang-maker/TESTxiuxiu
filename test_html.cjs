async function test() {
        const minUrl = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=90.BK1200&fields1=f1,f2,f3,f5&fields2=f51,f52,f53,f54,f55,f56,f57";
        const res = await fetch(minUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }).then(r=>r.text());
        console.log("res length:", res.length);
        console.log(res.substring(0, 500));
}
test().catch(console.error);

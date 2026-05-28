import http from 'http';

const symbols = [
  "sh000001", "sh510050", "sh510300", "sh510500", "sh588000", "sz159915", "sh512100"
].join(",");

const url = `http://hq.sinajs.cn/list=${symbols}`;

http.get(url, { headers: { "Referer": "https://finance.sina.com.cn" } }, (res) => {
  let chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    let data = Buffer.concat(chunks).toString('utf-8'); // Sina is GBK, but numbers will be readable
    
    const lines = data.split('\n').filter(Boolean);
    const quotes = [];
    for (const line of lines) {
        const match = line.match(/var hq_str_(.+)="(.+)";/);
        if (match) {
            const sym = match[1];
            const p = match[2].split(',');
            quotes.push({
                symbol: sym,
                price: parseFloat(p[3]),
                prevClose: parseFloat(p[2]),
                amount: parseFloat(p[9])
            });
        }
    }
    
    const sectorWeights = {
        '金融蓝筹 (Financials)': { 'sh510050': 0.6, 'sh510300': 0.3 },
        '大消费 (Consumer)': { 'sh510050': 0.2, 'sh510300': 0.15 },
        '新能源及设备 (New Energy)': { 'sz159915': 0.4, 'sh588000': 0.15 },
        '半导体及信创 (Tech/Semi)': { 'sh588000': 0.5, 'sh512100': 0.2, 'sh510500': 0.15 },
        '医药生物 (Healthcare)': { 'sz159915': 0.3, 'sh510500': 0.1, 'sh512100': 0.1 },
        '工业及周期 (Industrials)': { 'sh510500': 0.3, 'sh512100': 0.3, 'sh510300': 0.15 }
    };
    
    const dynamicSectorData = Object.entries(sectorWeights).map(([name, weights]) => {
        let score = 0;
        let weightSum = 0;
        Object.entries(weights).forEach(([symbol, weight]) => {
            const q = quotes.find(e => e.symbol === symbol);
            if (q) {
                const change = ((q.price - q.prevClose) / q.prevClose) * 100;
                score += change * weight;
                weightSum += weight;
            }
        });
        const avgChange = weightSum > 0 ? score / weightSum : 0;
        return { name, value: Number(avgChange.toFixed(2)) };
    }).sort((a,b) => b.value - a.value);
    
    console.log(JSON.stringify(dynamicSectorData, null, 2));
  });
});

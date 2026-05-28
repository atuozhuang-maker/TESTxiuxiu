import http from 'http';

http.get('http://fund.eastmoney.com/pingzhongdata/510300.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // try to find Data_fundShares
    const match = data.match(/var Data_fundShares = (\[.*?\]);/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      console.log('Got shares array, length:', parsed.length);
      console.log('Last item:', parsed[parsed.length - 1]);
    } else {
      console.log('Not found Data_fundShares. Keys:');
      const lines = data.split(';');
      for (let l of lines) {
        if (l.includes('var ')) console.log(l.substring(0, 50));
      }
    }
  });
});

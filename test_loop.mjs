import http from 'http';

function doFetch() {
  http.get('http://localhost:3000/api/quotes', (res) => {
    let chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      if (res.statusCode !== 200) {
        console.log(Buffer.concat(chunks).toString());
      }
    });
  }).on('error', console.error);
}

setInterval(doFetch, 1000);

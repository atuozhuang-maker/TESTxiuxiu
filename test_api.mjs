import http from 'http';

http.get('http://localhost:3000/api/quotes', (res) => {
  let chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => console.log(Buffer.concat(chunks).toString()));
}).on('error', console.error);

import http from 'http';

http.get('http://localhost:3000/api/history', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      if (parsed.success) {
        console.log('Length:', parsed.data.length);
        console.log('First:', parsed.data[0]);
      } else {
         console.log('Error:', parsed.error);
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log(data);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

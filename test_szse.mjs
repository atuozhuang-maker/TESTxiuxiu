import http from 'http';

const url = 'http://www.szse.cn/api/report/ShowReport/data?SHOWTYPE=JSON&CATALOGID=1945';

const options = {
  headers: {
    'Referer': 'http://www.szse.cn/',
    'User-Agent': 'Mozilla/5.0'
  }
};

http.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 500)));
});

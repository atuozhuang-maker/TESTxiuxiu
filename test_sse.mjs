import https from 'https';

const url = 'https://query.sse.com.cn/vp/commonQuery.do?isPagination=false&sqlId=COMMON_SSE_ZQPZ_ETFZL_XXPL_ETFGM_SEARCH_L';

const options = {
  headers: {
    'Referer': 'http://www.sse.com.cn/',
    'User-Agent': 'Mozilla/5.0'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 500)));
});

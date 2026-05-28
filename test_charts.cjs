const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<ResponsiveContainer[^>]*>[\s\S]*?<\/ResponsiveContainer>/g;
let match;
let i = 0;
while ((match = regex.exec(code)) !== null) {
  console.log('--- Chart match ' + i + ' ---');
  console.log(match[0].substring(0, 300));
  i++;
}


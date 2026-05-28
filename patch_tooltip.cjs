const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  'if (name === "上证指数" || name === "融券余额") return [Number(v).toFixed(2), name];\n                             return [`${v} 亿`, name];',
  'if (name === "上证指数" || name === "融券余额") { return name === "上证指数" ? [Number(v).toFixed(2), name] : [`${v} 亿`, name]; }\n                             return name === "融资余额(左轴)" ? [`${v} 亿`, name] : [`${v} 亿`, name];'
);

fs.writeFileSync('src/App.tsx', app);
console.log('Tooltip updated');

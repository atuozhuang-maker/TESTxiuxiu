const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

const target = `res.json({
      success: true,
      lastUpdated: latestDate,
      data: {`;

const replace = `res.json({
      success: true,
      data: {
        lastUpdated: latestDate,`;

server = server.replace(target, replace);
fs.writeFileSync('server.ts', server);
console.log('Fixed lastUpdated nesting in server.ts');

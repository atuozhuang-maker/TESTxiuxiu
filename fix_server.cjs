const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const lines = code.split('\\n');
const topHalf = lines.slice(0, 686).join('\\n');
const bottomRest = lines.slice(1391).join('\\n'); // starts from orderflow to end

fs.writeFileSync('server.ts', topHalf + '\\n\\n' + bottomRest);
console.log('Fixed server.ts properly');

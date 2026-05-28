const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The issue is I pushed \\\`\\\${d... into server.ts so it became \`\${d....
// I will just use regex to clean up all \` and \$ in the mocked data block.
code = code.replace(/\\\`\\\$/g, '`$');
code = code.replace(/\\\`\)/g, '`)');

fs.writeFileSync('server.ts', code);

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// deduplicate fetchDynamic
code = code.replace(/(    fetchDynamic\(\);\n)+/g, '    fetchDynamic();\n');

// deduplicate PlaySquare
code = code.replace(/(, PlaySquare)+/g, ', PlaySquare');

// deduplicate { id: 'dynamic', ... }
code = code.replace(/(\s*\{ id: 'dynamic', label: '资金动态 \(Dynamic\)', short: '动态', icon: PlaySquare \},)+/g, "\n            { id: 'dynamic', label: '资金动态 (Dynamic)', short: '动态', icon: PlaySquare },");

code = code.replace(/(\s*\{ id: 'industrial', label: '产业资本 \(Industrial\)', short: '产业', icon: Factory \},)+/g, "\n            { id: 'industrial', label: '产业资本 (Industrial)', short: '产业', icon: Factory },");

fs.writeFileSync('src/App.tsx', code);
console.log('Cleaned up duplicates');

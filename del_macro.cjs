const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const s1 = code.indexOf('{/* MACRO LIQUIDITY BANNER */}');
const s2 = code.indexOf('{/* MACRO LIQUIDITY BANNER */}', s1 + 1);

// We want to delete from the first one to just before the second one
if (s1 !== -1 && s2 !== -1 && s1 < s2) {
    code = code.substring(0, s1) + code.substring(s2);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Removed duplicate macro banner");
} else {
    console.log("Not found");
}

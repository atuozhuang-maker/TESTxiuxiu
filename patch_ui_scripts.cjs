const fs = require('fs');
let code = fs.readFileSync('add_orderflow_ui.cjs', 'utf8');
code = code.replace("if (code.includes(targetStr)) {\n  fs.writeFileSync('src/App.tsx', code.replace(targetStr, newCode));", "if (true) {\n  fs.writeFileSync('src/App.tsx', code.replace('<\\/main>', newCode + '<\\/main>'));");
fs.writeFileSync('add_orderflow_ui.cjs', code);

code = fs.readFileSync('add_industrial_ui.cjs', 'utf8');
code = code.replace("if (code.includes(targetStr)) {\n  fs.writeFileSync('src/App.tsx', code.replace(targetStr, newCode));", "if (true) {\n  fs.writeFileSync('src/App.tsx', code.replace('<\\/main>', newCode + '<\\/main>'));");
fs.writeFileSync('add_industrial_ui.cjs', code);

code = fs.readFileSync('add_dynamic_tab.cjs', 'utf8');
code = code.replace("if (code.includes(targetStr)) {\n  fs.writeFileSync('src/App.tsx', code.replace(targetStr, newCode));", "if (true) {\n  fs.writeFileSync('src/App.tsx', code.replace('<\\/main>', newCode + '<\\/main>'));");
fs.writeFileSync('add_dynamic_tab.cjs', code);

code = fs.readFileSync('add_macro_ui.cjs', 'utf8');
code = code.replace("if (code.includes(targetStr)) {\n  fs.writeFileSync('src/App.tsx', code.replace(targetStr, newCode));", "if (true) {\n  fs.writeFileSync('src/App.tsx', code.replace('              {/* MARKET RISK APPETITE BANNER */}', newCode));");
fs.writeFileSync('add_macro_ui.cjs', code);

console.log("Patched scripts");

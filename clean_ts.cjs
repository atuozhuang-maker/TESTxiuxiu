const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// deduplicate import
code = code.replace(/(import \{ DynamicFlowChart \} from '\.\/components\/DynamicFlowChart';\n)+/g, "import { DynamicFlowChart } from './components/DynamicFlowChart';\n");

// deduplicate dynamicFlowData
code = code.replace(/(  const \[dynamicFlowData, setDynamicFlowData\] = useState<any>\(null\);\n)+/g, "  const [dynamicFlowData, setDynamicFlowData] = useState<any>(null);\n");

// deduplicate fetchDynamic definition
const fetchDynamicStr = `const fetchDynamic = async () => {
      try {
        const res = await fetch("/api/dynamic");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setDynamicFlowData(data);
        }
      } catch(err) {}
    };`;

code = code.replace(/(const fetchDynamic = async \(\) => \{\n      try \{\n        const res = await fetch\("\/api\/dynamic"\);\n        if \(res\.ok\) \{\n          const data = await res\.json\(\);\n          if \(data\.success\) setDynamicFlowData\(data\);\n        \}\n      \} catch\(err\) \{\}\n    \};\n\s*)+/g, fetchDynamicStr + "\n    ");

fs.writeFileSync('src/App.tsx', code);
console.log('Cleaned TS duplicates');

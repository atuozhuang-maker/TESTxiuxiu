const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. imports
code = code.replace(
  "import { cn } from './lib/utils';",
  "import { cn } from './lib/utils';\nimport { DynamicFlowChart } from './components/DynamicFlowChart';"
);

// 2. icon import
const iconRegex = /Search, Settings, ShieldAlert, TrendingUp, Wallet, Info, Building, Target, Crosshair, Factory/;
code = code.replace(iconRegex, "Search, Settings, ShieldAlert, TrendingUp, Wallet, Info, Building, Target, Crosshair, Factory, PlaySquare");

// 3. state
code = code.replace(
  "const [industrialData, setIndustrialData] = useState<any>(null);",
  "const [industrialData, setIndustrialData] = useState<any>(null);\n  const [dynamicFlowData, setDynamicFlowData] = useState<any>(null);"
)

// 4. fetch
code = code.replace(
  "const fetchIndustrial = async () => {",
  `const fetchDynamic = async () => {
      try {
        const res = await fetch("/api/dynamic");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setDynamicFlowData(data);
        }
      } catch(err) {}
    };
    const fetchIndustrial = async () => {`
);

code = code.replace(
  "fetchIndustrial();",
  "fetchIndustrial();\n    fetchDynamic();"
);

// 5. tab definition
const tabRegex = /\{ id: 'industrial', label: '产业资本 \(Industrial\)', short: '产业', icon: Factory \},/;
code = code.replace(tabRegex, "{ id: 'industrial', label: '产业资本 (Industrial)', short: '产业', icon: Factory },\n            { id: 'dynamic', label: '资金动态 (Dynamic)', short: '动态', icon: PlaySquare },");

// 6. UI
const targetUiStr = `        </div>
      </main>
    </div>`;

const dynamicUi = `           {activeTab === 'dynamic' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
                {dynamicFlowData ? (
                  <DynamicFlowChart data={dynamicFlowData.data} sectors={dynamicFlowData.sectors} />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
           )}
        </div>
      </main>
    </div>`

code = code.replace(targetUiStr, dynamicUi);

fs.writeFileSync('src/App.tsx', code);

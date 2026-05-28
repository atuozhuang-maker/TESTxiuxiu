const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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
`;

code = code.replace('</main>', dynamicUi + '</main>');
fs.writeFileSync('src/App.tsx', code);
console.log('Appended dynamic');

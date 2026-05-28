const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-bold tracking-tight text-slate-800">机构调研与持仓 <span className="text-slate-400 font-normal ml-2 text-lg">Institution Activity</span></h1>
               </div>`;

const replace1 = `<div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                   <h1 className="text-2xl font-bold tracking-tight text-slate-800">机构调研与持仓 <span className="text-slate-400 font-normal ml-2 text-lg">Institution Activity</span></h1>
                 </div>
                 {institutionData && institutionData.lastUpdated && (
                   <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                     数据公开更新至: <span className="font-mono text-slate-700 font-bold">{institutionData.lastUpdated}</span>
                   </div>
                 )}
               </div>`;

code = code.replace(target1, replace1);

// Also need to update the tab text to explicitly mention it there?
// The user pointed to the sidebar navigation span.
// Let's modify the nav tab from "机构与持仓 (Institution)" to "机构与持仓 (实时)" or something similar,
// but actually the prompt was "这个板块的数据是到什么时候，请在页面中标明，并保持数据公开可查询的最新数据".
// The user selected those CSS targets. Usually we just need to add the date in the main container, maybe the user accidentally clicked the tab button too.

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');

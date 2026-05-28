const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                     <Target size={20} />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold tracking-tight text-slate-800">微观订单流与主买资金</h1>
                     <p className="text-xs text-slate-500 mt-0.5">从大小单资金分化中寻找主力建仓意图，捕捉短期轮动先机</p>
                   </div>
                 </div>
               </div>`;

const replace1 = `<div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                     <Target size={20} />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold tracking-tight text-slate-800">微观订单流与主买资金</h1>
                     <p className="text-xs text-slate-500 mt-0.5">从大小单资金分化中寻找主力建仓意图，捕捉短期轮动先机</p>
                   </div>
                 </div>
                 {orderFlowData && orderFlowData.lastUpdated && (
                   <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                     数据实时更新至: <span className="font-mono text-slate-700 font-bold">{orderFlowData.lastUpdated}</span>
                   </div>
                 )}
               </div>`;

// Check if exact match to prevent errors
if (code.includes(target1)) {
    code = code.replace(target1, replace1);
    fs.writeFileSync('src/App.tsx', code);
    console.log('App.tsx updated');
} else {
    // If exact match fails, do a regex replace
    console.log("Could not find exact match, attempting regex replacement...");
    const regex = /<div className="flex items-center justify-between mb-2">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500\/30">[\s\S]*?<Target size=\{20\} \/>[\s\S]*?<\/div>[\s\S]*?<div>[\s\S]*?<h1 className="text-2xl font-bold tracking-tight text-slate-800">微观订单流与主买资金<\/h1>[\s\S]*?<p className="text-xs text-slate-500 mt-0.5">从大小单资金分化中寻找主力建仓意图，捕捉短期轮动先机<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    
    if (regex.test(code)) {
        code = code.replace(regex, replace1);
        fs.writeFileSync('src/App.tsx', code);
        console.log('App.tsx updated with Regex');
    } else {
        console.log("Failed to match target code block in App.tsx.");
    }
}

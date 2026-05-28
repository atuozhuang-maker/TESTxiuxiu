const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<td className="py-3 px-4 align-top">\s*<div className="font-bold text-slate-800">\{item\.name\}<\/div>\s*<div className="text-\[11px\] text-slate-400 font-mono mb-1">\{item\.symbol\}<\/div>\s*<span className="inline-block px-1\.5 py-0\.5 bg-rose-50 text-rose-600 border border-rose-100 rounded text-\[9\.5px\] font-medium whitespace-nowrap mb-1">\{item\.type\}<\/span>\s*<div className="text-\[9\.5px\] text-slate-400 max-w-\[120px\] leading-tight break-words" title=\{item\.reason\}>\{item\.reason\}<\/div>\s*<\/td>/;

const repl = `<td className="py-3 px-4 align-top">
                                <div className="font-bold text-slate-800">{item.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono mb-1.5">{item.symbol}</div>
                                {item.sectors && (
                                  <div className="flex flex-wrap gap-1 mb-2 max-w-[180px]">
                                    {item.sectors.map((sec: string, sIdx: number) => (
                                      <span key={sIdx} className="inline-block px-1.5 py-[2px] bg-indigo-50 border border-indigo-100 text-indigo-600 rounded drop-shadow-sm text-[9.5px] font-medium whitespace-nowrap">
                                        {sec}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <span className="inline-block px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9.5px] font-bold whitespace-nowrap mb-1">{item.type}</span>
                                <div className="text-[9.5px] text-slate-500 max-w-[180px] leading-tight break-words line-clamp-2" title={item.reason}>{item.reason}</div>
                              </td>`;

if (code.match(regex)) {
  code = code.replace(regex, repl);
  fs.writeFileSync('src/App.tsx', code);
  console.log('done sectors via regex!');
} else {
  console.log('sectors regex NOT match, please check');
}

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{/* Dragon Tiger List */}');
if (startIdx !== -1) {
  const endSearchStr = '<td colSpan={5} className="py-12 text-center text-slate-400 text-sm">暂无异动龙虎榜数据</td>\n                            </tr>\n                         )}\n                       </tbody>\n                     </table>\n                   </div>\n                 </Card>';
  
  const endIdx = code.indexOf(endSearchStr, startIdx);
  if (endIdx !== -1) {
    const fullEndIdx = endIdx + endSearchStr.length;
    
    code = code.substring(0, startIdx) + code.substring(fullEndIdx);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Successfully stripped Dragon Tiger List');
  } else {
    console.log('Could not find end of Dragon Tiger List');
  }
} else {
  console.log('Could not find start of Dragon Tiger List');
}

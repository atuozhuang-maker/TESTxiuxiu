const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');

const endOfFile = lines.findIndex(l => l.includes('</main>'));

// the last valid </div>\n           )} should be right before </div>\n</main>
// I see in the previous output:
// 1411:            )}
// 1412:                               </Bar>

let targetBar = -1;
for (let i = endOfFile; i > endOfFile - 200; i--) {
  if (lines[i]?.includes('</Bar>')) {
    targetBar = i;
    break;
  }
}

if (targetBar !== -1) {
    // we want to delete from targetBar to the last `)}` before `</main>`
    let lastParen = -1;
    for (let i = endOfFile; i > targetBar; i--) {
        if (lines[i]?.includes(')}')) {
            lastParen = i;
            break;
        }
    }
    
    if (lastParen !== -1) {
        lines.splice(targetBar, lastParen - targetBar + 1);
        fs.writeFileSync('src/App.tsx', lines.join('\n'));
        console.log('Fixed from ', targetBar, 'to', lastParen);
    }
}

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const marker = '<div className="bg-white rounded-xl p-0 border border-blue-100 shadow-sm overflow-hidden mb-6 relative">';
const firstIndex = code.indexOf(marker);
if (firstIndex !== -1) {
    const secondIndex = code.indexOf(marker, firstIndex + 1);
    if (secondIndex !== -1) {
        // Find the boundary between the two. The block probably ends with `</div>` then a blank line.
        // Let's just remove everything from `secondIndex` to before the next major section:
        // Next major section is `{/* OVERVIEW GRID */}` or `<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">`
        const nextTarget = '{/* OVERVIEW GRID */}';
        const gridIndex = code.indexOf(nextTarget, secondIndex);
        if (gridIndex !== -1) {
            code = code.substring(0, secondIndex) + code.substring(gridIndex);
            fs.writeFileSync('src/App.tsx', code);
            console.log('Removed duplicate macro banner.');
        } else {
            console.log('next region not found');
        }
    }
}

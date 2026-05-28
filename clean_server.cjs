const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Find the first "import express from" other than the very beginning
const idx = code.indexOf('import express from "express";', 10);
if (idx !== -1) {
  const bottomHalfSettings = code.indexOf('app.get("/api/settings"', idx);
  if (bottomHalfSettings !== -1) {
    // take top half up to idx
    const topHalf = code.substring(0, idx);
    // take bottom half from settingsStart onwards
    const bottomRest = code.substring(bottomHalfSettings);
    fs.writeFileSync('server.ts', topHalf + bottomRest);
    console.log('Fixed server.ts');
  } else {
    console.log('Could not find /api/settings in bottom half');
  }
} else {
  console.log('Could not find duplicated import');
}

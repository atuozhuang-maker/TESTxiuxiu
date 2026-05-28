const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The file might contain "\n\n" from the previous bad split, let's just do an robust replace
const firstExpress = code.indexOf('import express from "express";');
const secondExpress = code.indexOf('import express from "express";', firstExpress + 10);

if (secondExpress !== -1) {
  const topHalf = code.substring(0, secondExpress);
  
  // Now we need to find the FIRST app.get("/api/orderflow") AFTER secondExpress!
  const orderflowStart = code.lastIndexOf('app.get("/api/orderflow"');
  if (orderflowStart > secondExpress) {
    const bottomHalf = code.substring(orderflowStart);
    fs.writeFileSync('server.ts', topHalf + bottomHalf);
    console.log('Fixed server.ts permanently!');
  } else {
    console.error('Cannot find orderflowStart properly');
  }
} else {
  console.log('No second express found');
}

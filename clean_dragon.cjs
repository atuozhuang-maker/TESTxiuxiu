const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove dragonData state
code = code.replace(/const \[dragonData, setDragonData\] = useState<any\[\]>\(\[\]\);\n/, '');

// remove fetchDragon function call and definition
code = code.replace(/const fetchDragon = async \(\) => \{[\s\S]*?\}\s*catch \(err\) \{\}\n\s*\};\n/, '');
code = code.replace(/await fetchDragon\(\);\n/, '');
code = code.replace(/fetchDragon\(\);\n/, ''); // inside setInterval just in case

fs.writeFileSync('src/App.tsx', code);
console.log('Successfully cleaned up dragonData logic');

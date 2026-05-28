const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the mock definition
// Instead of a simple manual mock update every 5 sec:
/*
  useEffect(() => {
    const interval = setInterval(() => {
       // ... mocking stuff
    });
*/
// Let's replace the whole interval logic with fetchAtmosphere!

const mockIntervalPattern = /useEffect\(\(\) => \{\n\s*const interval = setInterval\(\(\) => \{\n\s*if \(!shIndex\) return;\n[\s\S]*?\}, 5000\);\n\s*return \(\) => clearInterval\(interval\);\n\s*\}, \[shIndex, marketAtmosphere\]\);/m;

const newAtmosphereLogic = `  const fetchAtmosphere = async () => {
    try {
      const res = await fetch("/api/atmosphere");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMarketAtmosphere(prev => ({
            ...prev,
            ...data.data
          }));
        }
      }
    } catch(err) {}
  };

  useEffect(() => {
    fetchAtmosphere();
    const interval = setInterval(() => {
      fetchAtmosphere();
    }, 15000);
    return () => clearInterval(interval);
  }, []);`;

app = app.replace(mockIntervalPattern, newAtmosphereLogic);

fs.writeFileSync('src/App.tsx', app);
console.log('App.tsx Atmosphere UI updated');

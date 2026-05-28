const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The problematic lines:
// 1190:            )}
// 1191: 
// 1192:         </div>
// 1193:                  {activeTab === 'institution' && (

// Let's remove everything from 1193 down to the end of the file, and then correctly insert the tab before that last </div>

// We can just use string replacement if we extract exactly what we need, but regex might be safer.
// Let's cut out the wrongly inserted part entirely. 
// The wrongly inserted part begins with "                 {activeTab === 'institution' && ("
// and ends at the end of the file. Wait, in the end of the file we have:
// 1353:         </div>
// 1354:       </main>
// 1355:     </div>
// 1356:   );
// 1357: }

// We can replace the whole block starting from `                 {activeTab === 'institution' && (` to the end of the file with:
// `           {activeTab === 'institution' && (`
// ...
// `           )}`
// `        </div>`
// `      </main>`
// `    </div>`
// `  );`
// `}`

// Wait, looking at the code I injected, I literally injected the activeTab condition, and then at the bottom:
/*
           )}

        </div>
      </main>
*/

// So there is a `</div>\n      </main>` at the bottom of the injected code.
// AND there is already a `</div>` at line 1192. So that's the extra `</div>`.

// Let's just remove the `</div>` at 1192! Or, just replace the current state with the correctly formatted one.

const fixRegex = /<\/div>\s*\{activeTab === 'institution'/s;

if (code.match(fixRegex)) {
  code = code.replace(fixRegex, "{activeTab === 'institution'");
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed mismach tag!');
} else {
  console.log('Regex not matched for fix');
}

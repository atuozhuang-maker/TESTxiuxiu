const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// append the missing closing tags
const missingTags = `               </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', code + missingTags);
console.log('App.tsx syntactically fixed');

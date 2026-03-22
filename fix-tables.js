const fs = require('fs');

const filePath = 'c:/Users/Administrator/Documents/harmony/harmony-tauri/src/views/examples/Tables.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all <Media> with <div>
content = content.replace(/<Media([^>]*)>/g, '<div$1>');
// Replace all </Media> with </div> (in case some were missed)
content = content.replace(/<\/Media>/g, '</div>');

// Remove Media from imports if it's there
content = content.replace(/Media,?\s*/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Tables.jsx fixed!');

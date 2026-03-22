const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. form-inline -> d-flex align-items-center (BS5)
  if (content.includes('form-inline')) {
    content = content.replace(/form-inline/g, 'd-flex align-items-center');
    changed = true;
  }

  // 2. Table align-items-center -> align-middle (BS5 Tables)
  if (content.includes('<Table') && content.includes('align-items-center')) {
    content = content.replace(/<Table([^>]*)align-items-center([^>]*)>/g, '<Table$1align-middle$2>');
    changed = true;
  }
  
  // 3. sr-only -> visually-hidden (Double check)
  if (content.includes('sr-only')) {
    content = content.replace(/sr-only/g, 'visually-hidden');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Deep Polish: ${filePath}`);
  }
}

function walkDir(dir) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('build')) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(fullPath);
    }
  });
}

walkDir('c:/Users/Administrator/Documents/harmony/harmony-tauri/src');
console.log('Deep Polish complete!');

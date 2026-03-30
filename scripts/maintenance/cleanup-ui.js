const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. DropdownMenu right -> end
  if (content.includes('DropdownMenu') && content.includes('right')) {
    content = content.replace(/<DropdownMenu([^>]*)right([^>]*)>/g, '<DropdownMenu$1end$2>');
    changed = true;
  }

  // 2. Nav alignment ml-auto -> ms-auto, mr-auto -> me-auto
  if (content.includes('ml-') || content.includes('mr-')) {
    content = content.replace(/ml-([a-z0-9-]+)/g, 'ms-$1');
    content = content.replace(/mr-([a-z0-9-]+)/g, 'me-$1');
    changed = true;
  }
  
  // padding/margin pl->ps, pr->pe
  if (content.includes('pl-') || content.includes('pr-')) {
     content = content.replace(/pl-([a-z0-9-]+)/g, 'ps-$1');
     content = content.replace(/pr-([a-z0-9-]+)/g, 'pe-$1');
     changed = true;
  }

  // 3. Float right -> end
  if (content.includes('float-right') || content.includes('float-left')) {
    content = content.replace(/float-right/g, 'float-end');
    content = content.replace(/float-left/g, 'float-start');
    changed = true;
  }
  
  // text-right -> end
  if (content.includes('text-right') || content.includes('text-left')) {
     content = content.replace(/text-right/g, 'text-end');
     content = content.replace(/text-left/g, 'text-start');
     changed = true;
  }

  // 4. Sidebar fixed-left -> fixed-start
  if (content.includes('fixed-left')) {
    content = content.replace(/fixed-left/g, 'fixed-start');
    changed = true;
  }

  // 5. Table thead-light -> table-light
  if (content.includes('thead-light') || content.includes('thead-dark')) {
    content = content.replace(/thead-light/g, 'table-light');
    content = content.replace(/thead-dark/g, 'table-dark');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UI Cleanup: ${filePath}`);
  }
}

function walkDir(dir) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('build')) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.scss')) {
      processFile(fullPath);
    }
  });
}

walkDir('c:/Users/Administrator/Documents/harmony/harmony-tauri/src');
console.log('UI Cleanup complete!');

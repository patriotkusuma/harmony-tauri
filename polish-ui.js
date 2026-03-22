const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. sr-only -> visually-hidden
  if (content.includes('sr-only')) {
    content = content.replace(/sr-only/g, 'visually-hidden');
    changed = true;
  }

  // 2. Media component -> div with d-flex
  // This is tricky for regex but we can target common Argon patterns
  if (content.includes('Media')) {
     // Replace <Media ...> with <div ...> if it's used for alignment
     content = content.replace(/<Media([^>]*)className="([^"]*)align-items-center([^"]*)"([^>]*)>/g, '<div$1className="$2d-flex align-items-center$3"$4>');
     content = content.replace(/<\/Media>/g, '</div>');
     // Also replace imports if we removed all Media
     if (!content.includes('<Media')) {
        content = content.replace(/Media,?\s*/g, '');
     }
     changed = true;
  }

  // 3. Spacing/Padding cleanup (more aggressive)
  if (content.includes('ml-') || content.includes('mr-') || content.includes('pl-') || content.includes('pr-')) {
    content = content.replace(/\bml-([0-5]|auto)\b/g, 'ms-$1');
    content = content.replace(/\bmr-([0-5]|auto)\b/g, 'me-$1');
    content = content.replace(/\bpl-([0-5]|auto)\b/g, 'ps-$1');
    content = content.replace(/\bpr-([0-5]|auto)\b/g, 'pe-$1');
    changed = true;
  }

  // 4. Badges - badge-danger -> text-bg-danger (optional in BS5 but Argon likes its custom badges)
  // Actually Argon's custom SCSS handles badge-danger, so we keep it.

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`UI Polish: ${filePath}`);
  }
}

function walkDir(dir) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('build')) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

walkDir('c:/Users/Administrator/Documents/harmony/harmony-tauri/src');
console.log('UI Polish complete!');

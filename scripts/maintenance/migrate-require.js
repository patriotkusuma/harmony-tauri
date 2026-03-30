const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Find all require("...") for assets
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const matches = [...content.matchAll(requireRegex)];
  
  if (matches.length > 0) {
    const uniqueImports = new Set();
    const importStatements = [];
    
    matches.forEach((match, index) => {
      const assetPath = match[1];
      const variableName = `asset_${index}_${Math.random().toString(36).substring(7)}`;
      
      // Replace the require call with the variable name
      content = content.replace(match[0], variableName);
      
      // Create import statement
      importStatements.push(`import ${variableName} from "${assetPath}";`);
      changed = true;
    });

    // Add imports to the top of the file
    if (changed) {
      content = importStatements.join('\n') + '\n' + content;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated require() in: ${filePath}`);
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
console.log('Require migration complete!');

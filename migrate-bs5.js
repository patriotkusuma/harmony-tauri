const fs = require('fs');
const path = require('path');

const replacements = [
  // Spacing (Left/Right to Start/End)
  { regex: /\bml-([0-5]|auto)\b/g, replacement: 'ms-$1' },
  { regex: /\bmr-([0-5]|auto)\b/g, replacement: 'me-$1' },
  { regex: /\bpl-([0-5]|auto)\b/g, replacement: 'ps-$1' },
  { regex: /\bpr-([0-5]|auto)\b/g, replacement: 'pe-$1' },
  
  // Negative margins
  { regex: /\bnml-([0-5]|auto)\b/g, replacement: 'nms-$1' },
  { regex: /\bnmr-([0-5]|auto)\b/g, replacement: 'nme-$1' },

  // Floats
  { regex: /\bfloat-left\b/g, replacement: 'float-start' },
  { regex: /\bfloat-right\b/g, replacement: 'float-end' },
  
  // Text alignment
  { regex: /\btext-left\b/g, replacement: 'text-start' },
  { regex: /\btext-right\b/g, replacement: 'text-end' },
  { regex: /\btext-md-left\b/g, replacement: 'text-md-start' },
  { regex: /\btext-md-right\b/g, replacement: 'text-md-end' },
  { regex: /\btext-lg-left\b/g, replacement: 'text-lg-start' },
  { regex: /\btext-lg-right\b/g, replacement: 'text-lg-end' },

  // Custom forms to standard forms (some cases)
  { regex: /\bcustom-select\b/g, replacement: 'form-select' },
  { regex: /\bcustom-file\b/g, replacement: 'form-file' }, // Actually form-control in BS5 but let's see
  { regex: /\bcustom-control\b/g, replacement: 'form-check' },
  
  // Badge pill
  { regex: /\bbadge-pill\b/g, replacement: 'rounded-pill' },

  // No gutters
  { regex: /\bno-gutters\b/g, replacement: 'g-0' },
  
  // Close button
  { regex: /\bclose\b/g, replacement: 'btn-close' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
        walkDir(fullPath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.scss')) {
      processFile(fullPath);
    }
  });
}

walkDir(process.argv[2] || '.');
console.log('Class migration complete!');

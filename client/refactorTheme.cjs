const fs = require('fs');
const path = require('path');

const directories = ['src/components', 'src/pages'];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove all dark: variants
      content = content.replace(/\bdark:[a-zA-Z0-9\-\/:]+\b/g, '');
      
      // Backgrounds
      content = content.replace(/\bbg-white\b/g, 'bg-surface');
      content = content.replace(/\bbg-neutral-50\b/g, 'bg-background');
      content = content.replace(/\bbg-neutral-100\b/g, 'bg-surface-hover');
      content = content.replace(/\bbg-neutral-200\b/g, 'bg-surface-active');
      content = content.replace(/\bbg-neutral-800\b/g, 'bg-surface-elevated');
      content = content.replace(/\bbg-neutral-900\b/g, 'bg-surface');
      content = content.replace(/\bbg-neutral-950\b/g, 'bg-background');
      content = content.replace(/\bbg-black\b/g, 'bg-surface');
      
      // Texts
      content = content.replace(/\btext-neutral-900\b/g, 'text-text-primary');
      content = content.replace(/\btext-neutral-800\b/g, 'text-text-primary');
      content = content.replace(/\btext-neutral-700\b/g, 'text-text-secondary');
      content = content.replace(/\btext-neutral-600\b/g, 'text-text-secondary');
      content = content.replace(/\btext-neutral-500\b/g, 'text-text-muted');
      content = content.replace(/\btext-neutral-400\b/g, 'text-text-muted');
      content = content.replace(/\btext-gray-900\b/g, 'text-text-primary');
      content = content.replace(/\btext-gray-600\b/g, 'text-text-secondary');
      content = content.replace(/\btext-gray-500\b/g, 'text-text-muted');
      content = content.replace(/\btext-white\b/g, 'text-text-primary');
      
      // Borders
      content = content.replace(/\bborder-neutral-100\b/g, 'border-border');
      content = content.replace(/\bborder-neutral-200\b/g, 'border-border');
      content = content.replace(/\bborder-neutral-300\b/g, 'border-border');
      content = content.replace(/\bborder-neutral-700\b/g, 'border-border');
      content = content.replace(/\bborder-neutral-800\b/g, 'border-border');
      content = content.replace(/\bborder-gray-200\b/g, 'border-border');
      
      // Rings
      content = content.replace(/\bring-white\b/g, 'ring-surface');
      
      // Remove double spaces that might occur from removing dark: variants
      content = content.replace(/ \s+/g, ' ');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

directories.forEach(dir => {
  const fullDirPath = path.join(__dirname, dir);
  if (fs.existsSync(fullDirPath)) {
    processDirectory(fullDirPath);
  }
});

console.log('Refactor complete.');

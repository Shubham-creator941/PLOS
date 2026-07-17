const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'src/__tests__/integration');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

for (const file of files) {
  const fullPath = path.join(testDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/jest\.mock\('\.\.\/\.\.\/database\/query', \(\) => \(\{ query: jest\.fn\(\) \}\)\);/g, "jest.mock('../../database/query', () => ({ query: jest.fn().mockResolvedValue([]) }));");
  fs.writeFileSync(fullPath, content);
}

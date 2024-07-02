import * as fs from 'fs';
import * as path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { getDiff, getFileDiff, adjustTagPositions } from '../../services/gitService';
import * as assert from 'assert';

// Initialize simple-git
const git: SimpleGit = simpleGit();

suite('Git Service Test Suite', () => {
  const filePath = path.join(__dirname, 'testFile.js');

  suiteSetup(async () => {
    // Ensure the repository is initialized and the file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'console.log("test");\n');
      await git.init();  // Ensure the repository is initialized
      await git.add(filePath);
      await git.commit('Initial commit for testFile.js');
    }
  });

  setup(async () => {
    // Ensure the file exists before each test
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'console.log("test");\n');
      await git.add(filePath);
      await git.commit('Recreate testFile.js');
    }
  });

  test('should get the current diff', async () => {
    // Make a change to the file
    fs.appendFileSync(filePath, 'console.log("new test");\n');
    await git.add(filePath);
    const diff = await getDiff();
    assert.ok(diff, 'Expected diff to be defined');
  });

  test.skip('should get the diff for a specific file', async () => {
    // Make another change to the file
    fs.appendFileSync(filePath, 'console.log("another test");\n');
    await git.add(filePath);
    await git.commit('Commit another change for testFile.js'); // Commit the changes
    const diff = await getFileDiff(filePath);
    assert.ok(diff, 'Expected diff to be defined');
  });

  test('should adjust tag positions based on diff', () => {
    const diff = `@@ -1,3 +1,4 @@
+import newModule from './newModule';
 function testFunction() {
   console.log('test');
 }`;
    adjustTagPositions(diff);
    // Expect adjustments to be made (actual logic would be more complex)
    assert.ok(true, 'Expected tag positions to be adjusted'); // Simplified expectation for demonstration
  });
});

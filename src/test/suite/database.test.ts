import { initializeDatabase, closeDatabase, addFile, addTag, addFileTag, getTagsForFile, deleteTag } from '../../data/database';
import * as assert from 'assert';

suite('Database Functions Test Suite', function() {
  this.timeout(10000); // Increase timeout to 10 seconds

  let fileId: number;
  let tagId: number;
  let fileTagId: number;

  suiteSetup(async function() {
    this.timeout(10000); // Increase timeout for setup
    await initializeDatabase();
  });

  suiteTeardown(async function() {
    this.timeout(10000); // Increase timeout for teardown
    closeDatabase();
  });

  test('should add a new file', async () => {
    fileId = addFile('testFile.js');
    assert.ok(fileId > 0, `Expected fileId to be greater than 0, but got ${fileId}`);
  });

  test('should add a new tag', async () => {
    tagId = addTag('function');
    assert.ok(tagId > 0, `Expected tagId to be greater than 0, but got ${tagId}`);
  });

  test('should add a new file tag', async () => {
    fileTagId = addFileTag(fileId, tagId, 'function', 1, 10);
    assert.ok(fileTagId > 0, `Expected fileTagId to be greater than 0, but got ${fileTagId}`);
  });

  test('should retrieve tags for a specific file', async () => {
    const rows = getTagsForFile('testFile.js');
    assert.strictEqual(rows.length, 1, `Expected 1 row, but got ${rows.length}`);
    assert.strictEqual(rows[0].tag_name, 'function', `Expected tag name to be 'function', but got ${rows[0].tag_name}`);
  });

  test('should delete a tag', async () => {
    deleteTag(tagId);
    const rows = getTagsForFile('testFile.js');
    assert.strictEqual(rows.length, 0, `Expected 0 rows, but got ${rows.length}`);
  });
});

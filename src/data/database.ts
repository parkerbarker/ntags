import initSqlJs, { Database } from 'sql.js';
import { getDiff, adjustTagPositions } from '../services/gitService';

let db: Database;

export async function initializeDatabase() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS Files (
      file_id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS Tags (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_name TEXT
    );

    CREATE TABLE IF NOT EXISTS FileTags (
      file_tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER,
      tag_id INTEGER,
      start_line INTEGER,
      end_line INTEGER,
      tag_type TEXT,
      FOREIGN KEY (file_id) REFERENCES Files(file_id),
      FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
    );
  `);
}

export function closeDatabase() {
  db.close();
}

export { db };

interface TagRow {
  tag_name: string;
  start_line: number;
  end_line: number;
  tag_type: string;
}

// Add a new file
export function addFile(filePath: string): number {
  const stmt = db.prepare('INSERT INTO Files (file_path) VALUES (?)');
  stmt.run([filePath]);
  const result = db.exec('SELECT last_insert_rowid() AS file_id');
  return result[0].values[0][0] as number;
}

// Add a new tag
export function addTag(tagName: string): number {
  const stmt = db.prepare('INSERT INTO Tags (tag_name) VALUES (?)');
  stmt.run([tagName]);
  const result = db.exec('SELECT last_insert_rowid() AS tag_id');
  return result[0].values[0][0] as number;
}

// Add a new file tag
export function addFileTag(fileId: number, tagId: number, startLine: number, endLine: number, tagType: string): number {
  const stmt = db.prepare('INSERT INTO FileTags (file_id, tag_id, start_line, end_line, tag_type) VALUES (?, ?, ?, ?, ?)');
  stmt.run([fileId, tagId, startLine, endLine, tagType]);
  const result = db.exec('SELECT last_insert_rowid() AS file_tag_id');
  return result[0].values[0][0] as number;
}

// Retrieve tags for a specific file
export function getTagsForFile(filePath: string): TagRow[] {
  const stmt = db.prepare(`
    SELECT Tags.tag_name, FileTags.start_line, FileTags.end_line, FileTags.tag_type
    FROM FileTags
    JOIN Files ON FileTags.file_id = Files.file_id
    JOIN Tags ON FileTags.tag_id = Tags.tag_id
    WHERE Files.file_path = ?
  `);
  stmt.bind([filePath]);
  const results: TagRow[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as TagRow);
  }
  return results;
}

// Delete a tag
export function deleteTag(tagId: number): void {
  const stmt = db.prepare('DELETE FROM Tags WHERE tag_id = ?');
  stmt.run([tagId]);
}

// Adjust tag positions based on Git diff
export async function updateTagPositions(): Promise<void> {
  const diff = await getDiff();
  adjustTagPositions(diff);
}

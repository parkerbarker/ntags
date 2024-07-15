import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import initSqlJs, { Database, SqlValue } from 'sql.js';
import { getDiff, adjustTagPositions } from '../services/gitService';

let db: Database;

async function getDatabaseFilePath(): Promise<string> {
  const storagePath = vscode.workspace.workspaceFolders
    ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'ntag')
    : path.join(process.cwd(), '.vscode', 'ntag');

  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  const dbName = vscode.workspace.workspaceFolders?.[0]?.name ?? "unknown";
  return path.join(storagePath, `${dbName}.sqlite`);
}

export async function initializeDatabase() {
  const SQL = await initSqlJs();
  const dbFilePath = await getDatabaseFilePath();

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    createTables();
  }
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS Files (
      file_id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS Tags (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_name TEXT
      namespace TEXT
    );

    CREATE TABLE IF NOT EXISTS FileTags (
      file_tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (file_id) REFERENCES Files(file_id),
      FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
    );
  `);
}

export async function saveDatabase(): Promise<string> {
  const dbFilePath = await getDatabaseFilePath();
  const data = db.export();
  fs.writeFileSync(dbFilePath, Buffer.from(data));
  return dbFilePath;
}

export async function closeDatabase() {
  saveDatabase();
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
export function addFileTag(fileId: number, tagId: number): number {
  const stmt = db.prepare('INSERT INTO FileTags (file_id, tag_id) VALUES (?, ?)');
  stmt.run([fileId, tagId]);
  const result = db.exec('SELECT last_insert_rowid() AS file_tag_id');
  return result[0].values[0][0] as number;
}

export function deleteFileTag(tagId: number, fileId: number): void {
  const stmt = db.prepare('DELETE FROM FileTags WHERE tag_id = ? AND file_id = ?');
  stmt.run([tagId, fileId]);
}

// Retrieve tags for a specific file
export function getTagsForFile(filePath: string): TagRow[] {
  const stmt = db.prepare(`
    SELECT Tags.tag_name
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

export function getFilePathsForTag(tagName: string): string[] {
  const fileResults = db.exec(
    'SELECT file_path FROM Tags JOIN FileTags ON Tags.tag_id = FileTags.tag_id JOIN Files ON FileTags.file_id = Files.file_id WHERE Tags.tag_name = ?',
    [tagName as SqlValue]
  );

  if (fileResults.length === 0) {
    return [];
  }

  const filePaths = fileResults[0].values.map(row => row[0] as string);
  return filePaths;
}

// Delete a tag
export function cleanUpTags(): void {
  db.exec('DELETE FROM Tags WHERE tag_id NOT IN (SELECT tag_id FROM FileTags);');
}
export function deleteTag(tagId: number): void {
  const stmt = db.prepare('DELETE FROM Tags WHERE tag_id = ?');
  stmt.run([tagId]);
}
export function getTags(): string[] {
  const tagResults = db.exec('SELECT DISTINCT tag_name FROM Tags');
  if (tagResults.length === 0) {
    return [];
  }

  const tags = tagResults[0].values.map(row => row[0] as string);
  return tags;
}

// Adjust tag positions based on Git diff
export async function updateTagPositions(): Promise<void> {
  const diff = await getDiff();
  adjustTagPositions(diff);
}

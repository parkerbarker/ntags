import { db, addFile, addTag, addFileTag } from '../data/database';
import * as path from 'path';
import * as vscode from 'vscode';

export async function addTagToFile(filePath: string, tagName: string, tagType: string, startLine?: number, endLine?: number, refreshCallback?: () => void): Promise<void> {
  const baseDir = getBaseDirectory();
  const relativePath = path.relative(baseDir, filePath);

  // Ensure the file exists in the Files table
  const fileIdResult = db.exec('SELECT file_id FROM Files WHERE file_path = ?', [relativePath]);
  let fileId;
  if (fileIdResult.length === 0) {
    fileId = addFile(relativePath);
  } else {
    fileId = fileIdResult[0].values[0][0] as number;
  }

  // Ensure the tag exists in the Tags table
  const tagIdResult = db.exec('SELECT tag_id FROM Tags WHERE tag_name = ?', [tagName]);
  let tagId;
  if (tagIdResult.length === 0) {
    tagId = addTag(tagName);
  } else {
    tagId = tagIdResult[0].values[0][0] as number;
  }

  // Add the file tag to the FileTags table
  addFileTag(fileId, tagId, tagType, startLine, endLine);

  // Call the refresh callback if provided
  if (refreshCallback) {
    refreshCallback();
  }
}

function getBaseDirectory(): string {
  // Use the workspace folder as the base directory
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }
  return '';
}

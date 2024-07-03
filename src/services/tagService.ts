import { db, addFile, addTag, addFileTag, deleteTag } from '../data/database';
import * as vscode from 'vscode';
import * as path from 'path';

export async function addTagToFile(filePath: string, tagName: string, tagType?: string, startLine?: number, endLine?: number, refreshCallback?: () => void): Promise<void> {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File is not within a workspace folder');
    return;
  }
  const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);

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

export async function removeTagFromFile(filePath: string, tagName: string, refreshCallback?: () => void): Promise<void> {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File is not within a workspace folder');
    return;
  }
  const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);

  const fileIdResult = db.exec('SELECT file_id FROM Files WHERE file_path = ?', [relativePath]);
  if (fileIdResult.length === 0) {
    return;
  }

  const tagIdResult = db.exec('SELECT tag_id FROM Tags WHERE tag_name = ?', [tagName]);
  if (tagIdResult.length === 0) {
    return;
  }
  const tagId = tagIdResult[0].values[0][0] as number;

  deleteTag(tagId);

  // Call the refresh callback if provided
  if (refreshCallback) {
    refreshCallback();
  }
}

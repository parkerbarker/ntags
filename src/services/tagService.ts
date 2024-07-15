import { db, addFile, addTag, addFileTag, deleteFileTag, cleanUpTags } from '../data/database';
import * as vscode from 'vscode';
import * as path from 'path';

export async function addTagToFile(uri: vscode.Uri, fullTagName: string, refreshCallback?: () => void): Promise<void> {
  const workspaceAndPath = getWorkspaceAndRelativePath(uri);
  if (!workspaceAndPath) {return;}
  const { relativePath } = workspaceAndPath;

  const fileId = await ensureFileExists(relativePath);
  const tagId = await ensureTagExists(fullTagName.includes(':') ? fullTagName : `:${fullTagName}`);

  addFileTag(fileId, tagId);
  callRefreshCallbackIfProvided(refreshCallback);
}

export async function removeTagFromFile(uri: vscode.Uri, tagName: string, refreshCallback?: () => void): Promise<void> {
  const workspaceAndPath = getWorkspaceAndRelativePath(uri);
  if (!workspaceAndPath) {return;}
  const { relativePath } = workspaceAndPath;

  const fileId = await ensureFileExists(relativePath);
  const tagId = await ensureTagExists(tagName);

  deleteFileTag(tagId, fileId);
  cleanUpTags();

  callRefreshCallbackIfProvided(refreshCallback);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWorkspaceAndRelativePath(fileItem: any): { workspaceFolder: vscode.WorkspaceFolder, relativePath: string } | null {
   // Extract the vscode.Uri object from the FileItem
   const uri: vscode.Uri = fileItem.uri ? fileItem.uri : fileItem;

   // Find the workspace folder that contains the file
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File is not within a workspace folder');
    return null;
  }

  // Calculate the relative path of the file to the workspace folder
  const relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);

  return { workspaceFolder: workspaceFolder, relativePath };
}

async function ensureFileExists(relativePath: string): Promise<number> {
  const fileIdResult = db.exec('SELECT file_id FROM Files WHERE file_path = ?', [relativePath]);
  return fileIdResult.length === 0 ? addFile(relativePath) : fileIdResult[0].values[0][0] as number;
}

async function ensureTagExists(fullTagName: string): Promise<number> {
  const tagIdResult = db.exec('SELECT tag_id FROM Tags WHERE tag_name = ?', [fullTagName]);
  return tagIdResult.length === 0 ? addTag(fullTagName) : tagIdResult[0].values[0][0] as number;
}

function callRefreshCallbackIfProvided(refreshCallback?: () => void): void {
  if (refreshCallback) {
    refreshCallback();
  }
}

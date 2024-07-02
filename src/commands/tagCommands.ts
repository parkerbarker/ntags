import * as vscode from 'vscode';
import { addTagToFile } from '../services/tagService';

export async function addTagCommand() {
  const tagTypes = [
    'function',
    'class',
    'variable',
    'condition',
    'loop',
    'import',
    'custom',
    'comment',
    'interface',
    'todo'
  ];

  const editor = vscode.window.activeTextEditor;
  let filePath;

  if (!editor) {
    filePath = await vscode.window.showInputBox({ prompt: 'Enter the file path' });
  } else {
    filePath = editor.document.uri.fsPath;
  }
  if (!filePath) {return;}

  const tagName = await vscode.window.showInputBox({ prompt: 'Enter the tag name' });
  if (!tagName) {return;}

  const tagType = await vscode.window.showQuickPick(tagTypes, { placeHolder: 'Select the tag type' });
  if (!tagType) {return;}

  // Call addTagToFile without line numbers
  await addTagToFile(filePath, tagName, tagType, undefined, undefined);

  vscode.window.showInformationMessage(`Tag added to ${filePath}`);
}

export async function addTagToFileCommand(uri: vscode.Uri) {
  const tagTypes = [
    'function',
    'class',
    'variable',
    'condition',
    'loop',
    'import',
    'custom',
    'comment',
    'interface',
    'todo'
  ];

  const filePath = uri.fsPath;

  const tagName = await vscode.window.showInputBox({ prompt: 'Enter the tag name' });
  if (!tagName) {return;}

  const tagType = await vscode.window.showQuickPick(tagTypes, { placeHolder: 'Select the tag type' });
  if (!tagType) {return;}

  // Tag the entire file without line numbers
  await addTagToFile(filePath, tagName, tagType, undefined, undefined);

  vscode.window.showInformationMessage(`Tag added.`);
}

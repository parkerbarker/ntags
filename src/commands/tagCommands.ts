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

  const startLineStr = await vscode.window.showInputBox({ prompt: 'Enter the start line number' });
  if (!startLineStr) {return;}
  const startLine = parseInt(startLineStr);

  const endLineStr = await vscode.window.showInputBox({ prompt: 'Enter the end line number' });
  if (!endLineStr) {return;}
  const endLine = parseInt(endLineStr);

  const tagType = await vscode.window.showQuickPick(tagTypes, { placeHolder: 'Select the tag type' });
  if (!tagType) {return;}

  await addTagToFile(filePath, tagName, startLine, endLine, tagType);

  vscode.window.showInformationMessage(`Tag added to ${filePath}`);
}

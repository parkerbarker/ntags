import * as vscode from 'vscode';
import {TagsViewProvider} from '../views/tagView';
import { addTagToFile } from '../services/tagService';
import { getTags, removeTagFromFile } from '../data/database';


export async function addTagCommand(tagsViewProvider: TagsViewProvider) {
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

  // Call addTagToFile without line numbers
  await addTagToFile(filePath, tagName, undefined, undefined, undefined, () => {
    tagsViewProvider.refresh();
  });

  vscode.window.showInformationMessage(`Tag added to ${filePath}`);
}

export async function addTagToFileCommand(uri: vscode.Uri, tagsViewProvider) {
  const filePath = uri.fsPath;

  const tagName = await vscode.window.showInputBox({ prompt: 'Enter the tag name' });
  if (!tagName) {return;}

  // Tag the entire file without line numbers
  await addTagToFile(filePath, tagName, undefined, undefined, undefined, () => {
    tagsViewProvider.refresh();
  });

  vscode.window.showInformationMessage(`Tag added.`);
}

export async function selectTagCommand(tagsViewProvider: TagsViewProvider) {
  const tags = await getTags();

  const selectedTag = await vscode.window.showQuickPick(tags, {
    placeHolder: 'Select a tag to view associated files'
  });

  if (selectedTag) {
    tagsViewProvider.setTag(selectedTag);
    tagsViewProvider.refresh();
  }
}

export async function removeTagCommand(tagsViewProvider: TagsViewProvider) {
  const tags = await getTags();

  const selectedTag = await vscode.window.showQuickPick(tags, {
    placeHolder: 'Select a tag to remove'
  });

  if (!selectedTag) {return;}

  const editor = vscode.window.activeTextEditor;
  let filePath;

  if (!editor) {
    filePath = await vscode.window.showInputBox({ prompt: 'Enter the file path' });
  } else {
    filePath = editor.document.uri.fsPath;
  }
  if (!filePath) {return;}

  await removeTagFromFile(filePath, selectedTag, () => {
    tagsViewProvider.refresh();
  });

  vscode.window.showInformationMessage(`Tag removed from ${filePath}`);
}

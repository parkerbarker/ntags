import * as vscode from 'vscode';
import { db } from '../data/database';
import * as path from 'path';

interface TagNode {
  tag: string;
  files: string[];
}

export class TagsViewProvider implements vscode.TreeDataProvider<TagNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<TagNode | undefined | void> = new vscode.EventEmitter<TagNode | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TagNode | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TagNode): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.tag, vscode.TreeItemCollapsibleState.Collapsed);
    treeItem.description = `${element.files.length} file(s)`;
    return treeItem;
  }

  getChildren(element?: TagNode): Thenable<TagNode[]> {
    if (element) {
      // If the element has children, return an empty array to prevent further nesting
      return Promise.resolve([]);
    } else {
      return this.getTags();
    }
  }

  private async getTags(): Promise<TagNode[]> {
    const tags: TagNode[] = [];
    const baseDir = this.getBaseDirectory();
    const tagResults = db.exec('SELECT tag_name, file_path FROM Tags JOIN FileTags ON Tags.tag_id = FileTags.tag_id JOIN Files ON FileTags.file_id = Files.file_id');

    if(tagResults.length === 0) {return [];}

    const tagMap: { [tag: string]: string[] } = {};
    for (const row of tagResults[0].values) {
      const tag = row[0] as string;
      const relativePath = row[1] as string;
      const file = path.join(baseDir, relativePath);
      if (!tagMap[tag]) {
        tagMap[tag] = [];
      }
      tagMap[tag].push(file);
    }

    for (const tag in tagMap) {
      tags.push({ tag, files: tagMap[tag] });
    }

    return tags;
  }

  private getBaseDirectory(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].uri.fsPath;
    }
    return '';
  }
}

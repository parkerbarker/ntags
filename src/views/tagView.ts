import * as vscode from 'vscode';
import { getFilePathsForTag } from '../data/database';
import * as path from 'path';

class FileItem extends vscode.TreeItem {
  constructor(public readonly relativePath: string, public readonly uri: vscode.Uri) {
    super(relativePath, vscode.TreeItemCollapsibleState.None);
    this.resourceUri = uri;
    this.command = { command: 'vscode.open', title: 'Open File', arguments: [uri] };
    this.contextValue = 'file';
  }
}

class FolderItem extends vscode.TreeItem {
  constructor(public readonly relativePath: string) {
    super(relativePath, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = 'folder';
  }
}

export class TagsViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

  private currentTag: string | undefined;
  private fileTree: { [folder: string]: Array<FileItem | FolderItem> } = {};

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setTag(tag: string) {
    this.currentTag = tag;
    this.fileTree = {}; // Clear the file tree when the tag changes
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!this.currentTag) {
      return [];
    }

    if (element) {
      // Return children for the folder
      const folderPath = (element as FolderItem).relativePath;
      return this.fileTree[folderPath] || [];
    } else {
      // Get the file tree for the current tag
      if (Object.keys(this.fileTree).length === 0) {
        await this.buildFileTree();
      }
      return this.fileTree[''] || [];
    }
  }

  private async buildFileTree() {
    const filePaths = getFilePathsForTag(this.currentTag!);

    if (filePaths.length === 0) {
      return;
    }

    for (const relativePath of filePaths) {
      const uri = vscode.Uri.file(relativePath);

      const parts = relativePath.split(path.sep);
      let currentPath = '';
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const parentPath = currentPath;
        currentPath = path.join(currentPath, part);

        if (!this.fileTree[parentPath]) {
          this.fileTree[parentPath] = [];
        }

        if (isFile) {
          this.fileTree[parentPath].push(new FileItem(part, uri));
        } else if (!this.fileTree[parentPath].some(item => item.label === part && item.contextValue === 'folder')) {
          this.fileTree[parentPath].push(new FolderItem(part));
        }
      }
    }
  }
}

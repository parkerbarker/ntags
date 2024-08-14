/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from "vscode";
import { getTags } from "../data/database";
import { debug } from "console";

class TagItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapibleState: vscode.TreeItemCollapsibleState,
    public readonly children: TagItem[] = []
  ) {
    super(label, collapibleState);
  }
}

export class TagsPickerViewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  private tagTree: { [namespace: string]: Array<TagItem> } = {};
  private data = {
    dog: {
      hello: {},
      world: {},
    },
    hello: {},
    world: {},
  };

  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: TagItem | undefined
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element) {
      return element.children;
    } else {
      return this.buildTreeItemsFromObject(this.data);
    }
  }

  private buildTreeItemsFromObject(obj: any): TagItem[] {
    return Object.keys(obj).map((key) => {
      const children = this.buildTreeItemsFromObject(obj[key]);
      return new TagItem(
        key,
        children.length > 0
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None,
        children
      );
    });
  }
}

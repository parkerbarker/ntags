import * as vscode from 'vscode';

export class ButtonItem extends vscode.TreeItem {
  constructor(label: string, command: vscode.Command) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = command;
    this.contextValue = 'button';
  }
}

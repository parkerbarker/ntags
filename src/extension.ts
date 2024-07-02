import * as vscode from 'vscode';
import { initializeDatabase, closeDatabase } from './data/database';
import { addTagCommand } from './commands/tagCommands';

export async function activate(context: vscode.ExtensionContext) {
  await initializeDatabase();

  context.subscriptions.push(
    vscode.commands.registerCommand('nTag.addTag', async () => {
      await addTagCommand();
    }),
    new vscode.Disposable(() => {
      closeDatabase();
    })
  );
}

export function deactivate() {
  closeDatabase();
}

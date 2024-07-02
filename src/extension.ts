import * as vscode from 'vscode';
import { initializeDatabase, closeDatabase } from './data/database';
import { addTagCommand, addTagToFileCommand } from './commands/tagCommands';

export async function activate(context: vscode.ExtensionContext) {
  await initializeDatabase();

  context.subscriptions.push(
    vscode.commands.registerCommand('nTags.addTag', async () => {
      await addTagCommand();
    }),
    new vscode.Disposable(() => {
      closeDatabase();
    }),
    vscode.commands.registerCommand('ntag.addTagToFile', async (uri: vscode.Uri) => {
      await addTagToFileCommand(uri);
    })
  );
}

export function deactivate() {
  closeDatabase();
}

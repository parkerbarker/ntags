import * as vscode from 'vscode';
import { initializeDatabase, closeDatabase } from './data/database';
import { addTagCommand, addTagToFileCommand } from './commands/tagCommands';
import { TagsViewProvider } from './views/tagView';

export async function activate(context: vscode.ExtensionContext) {
  await initializeDatabase();

  const tagsViewProvider = new TagsViewProvider();
  vscode.window.registerTreeDataProvider('ntag.tagsView', tagsViewProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('nTags.addTag', async () => {
      console.log("15")
      await addTagCommand();
      tagsViewProvider.refresh();
    }),
    new vscode.Disposable(() => {
      closeDatabase();
    }),
    vscode.commands.registerCommand('ntag.addTagToFile', async (uri: vscode.Uri) => {
      console.log("23")
      await addTagToFileCommand(uri);
      tagsViewProvider.refresh();
    })
  );
}

export function deactivate() {
  closeDatabase();
}

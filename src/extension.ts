import * as vscode from 'vscode';
import { initializeDatabase, closeDatabase } from './data/database';
import { TagsViewProvider } from './views/tagView';
import {
  addTagToFileCommand,
  selectTagCommand,
  removeTagCommand,
  saveDatabaseCommand
} from './commands/tagCommands';

export async function activate(context: vscode.ExtensionContext) {
  await initializeDatabase();

  const tagsViewProvider = new TagsViewProvider();
  vscode.window.registerTreeDataProvider('ntags.tagsView', tagsViewProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('ntags.addTagToFile', async (uri: vscode.Uri) => {
      await addTagToFileCommand(uri, tagsViewProvider);
      tagsViewProvider.refresh();
    }),
    vscode.commands.registerCommand('ntags.selectTag', async () => {
      await selectTagCommand(tagsViewProvider);
    }),
    vscode.commands.registerCommand('ntags.saveDatabase', async () => {
      await saveDatabaseCommand(tagsViewProvider);
      tagsViewProvider.refresh();
    }),
    vscode.commands.registerCommand('ntags.removeTag', async () => {
      await removeTagCommand(tagsViewProvider);
      tagsViewProvider.refresh();
    }),
  );

  vscode.window.onDidChangeWindowState(async (event) => {
    if (!event.focused) {
      await vscode.commands.executeCommand('ntags.saveDatabase');
    }
  });

}

export function deactivate() {
  closeDatabase();
}

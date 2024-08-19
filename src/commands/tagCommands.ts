import * as vscode from "vscode";
import * as fs from "fs";
// import { promises as fs } from 'fs';
import {
  addTagToFile,
  removeTagFromFile,
  getFileTags,
} from "../services/tagService";
import { TagsViewProvider } from "../views/tagView";
import { showCustomQuickPick, QuickPickSection } from "../views/quickPick";
import { getTags, saveDatabase, getFilePathsForTag } from "../data/database";
import SettingsService from "../services/settingService";

export async function addTagToFileCommand(uri: vscode.Uri, tagsViewProvider) {
  const filePath = uri.fsPath;

  // check if this is a folder aka directory
  const isDir = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
  // TODO: Have this add all files under the selected folder. Probablly good to include a confirmation with the amount of files.
  if (isDir) {
    vscode.window.showInformationMessage(
      `nTag does not currently support folders.`
    );
    return;
  }

  const sections: QuickPickSection[] = [
    {
      label: "Recent Tags",
      values: Array.from({ length: 1000 }, (_, i) => `tag-${i}`),
      // values: ['team:app-ui', 'feature:dogs-away']
    },
    {
      label: "Namespace",
      values: ["user:", "pr:", "team:", "feature:"],
    },
  ];

  const selectedValue = await showCustomQuickPick(sections);

  if (!selectedValue) {
    return;
  }

  // Tag the entire file without line numbers
  await addTagToFile(uri, selectedValue, () => {
    tagsViewProvider.refresh();
    vscode.window.showInformationMessage(`nTag Added.`);
  });
}

export async function selectTagCommand(tagsViewProvider: TagsViewProvider) {
  const tags = await getTags();

  const selectedTag = await vscode.window.showQuickPick(tags, {
    placeHolder: "Select a tag to view associated files",
  });

  if (selectedTag) {
    tagsViewProvider.setTag(selectedTag);
    tagsViewProvider.refresh();

    const includedPaths = getFilePathsForTag(selectedTag);
    SettingsService.updateFilesExclude(includedPaths).then(
      () => {
        vscode.window.showInformationMessage(
          "Explorer view updated to include specified paths."
        );
      },
      (error) => {
        vscode.window.showErrorMessage(
          "Failed to update Explorer view: " + error
        );
      }
    );
  }
}

export async function removeTagCommand(
  uri: vscode.Uri,
  tagsViewProvider: TagsViewProvider
) {
  const tags = await getFileTags(uri);

  const selectedTag = await vscode.window.showQuickPick(tags, {
    placeHolder: "Select a tag to remove",
  });

  if (!selectedTag) {
    return;
  }

  await removeTagFromFile(uri, selectedTag, () => {
    tagsViewProvider.refresh();
  });

  vscode.window.showInformationMessage(`Tag removed.`);
}

export async function saveDatabaseCommand(tagsViewProvider: TagsViewProvider) {
  const databasePath = saveDatabase();
  tagsViewProvider.refresh();
  vscode.window.showInformationMessage(`Save: ${databasePath}`);
}

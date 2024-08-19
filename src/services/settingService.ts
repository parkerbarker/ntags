/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from "vscode";
import path from "path";
import fg from "fast-glob";

export default class SettingsService {
  /**
   * Updates the files.exclude setting to only include the specified paths.
   * @param includedPaths - An array of relative paths to include in the Explorer view.
   * @returns A promise that resolves when the setting is updated.
   */
  public static async updateFilesExclude(
    includedPaths: string[]
  ): Promise<void> {
    const basePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // Step 1: Gather all files in the file system
    const allPaths = await fg("**/*", {
      cwd: basePath,
      onlyFiles: false,
      markDirectories: true,
    });

    // Step 2: Normalize and filter included paths
    const normalizedIncludePaths = includedPaths.map((p) => path.normalize(p));

    // Step 3: Filter out included paths
    const excludedPaths = allPaths.filter((p) => {
      const normalizedPath = path.normalize(p);
      return !normalizedIncludePaths.some((includePath) =>
        normalizedPath.startsWith(includePath)
      );
    });

    // Step 4: Reduce the excluded paths to top-level paths
    const topLevelExcludedPaths = excludedPaths.reduce((acc, currentPath) => {
      const normalizedPath = path.normalize(currentPath);
      const isSubPath = acc.some((existingPath) =>
        normalizedPath.startsWith(existingPath)
      );

      if (!isSubPath) {
        return acc
          .filter((existingPath) => !existingPath.startsWith(normalizedPath))
          .concat(normalizedPath);
      }

      return acc;
    }, []);

    const settingsPaths = Object.fromEntries(
      topLevelExcludedPaths.map((key) => [key, true])
    );

    // Update the files.exclude setting in the user's workspace
    return vscode.workspace.getConfiguration("files").update(
      "exclude",
      settingsPaths,
      vscode.ConfigurationTarget.Workspace // Applies to the workspace
    );
  }

  /**
   * Resets the files.exclude setting for the current session.
   * @returns A promise that resolves when the setting is reset.
   */
  public static resetFilesExclude(): Thenable<void> {
    // Reset the files.exclude setting by removing the temporary setting
    return vscode.workspace.getConfiguration("files").update(
      "exclude",
      undefined, // Passing `undefined` removes the setting
      vscode.ConfigurationTarget.WorkspaceFolder
    );
  }
}

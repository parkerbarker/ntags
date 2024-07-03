# nTags README

nTags (Navigational Tags) is a Visual Studio Code extension designed to help you efficiently navigate and manage your codebase using customizable tags. With nTags, you can create and manage tags for functions, classes, variables, and more, and organize them with namespaces for better categorization.

## Features

- **Robust Tagging**: Tag various code elements such as functions, classes, variables, conditional statements, loops, imports, and custom code blocks.
- **Namespace Support**: Organize tags with namespaces for better categorization (e.g., `user:cameron`, `feature:cards`).
- **Accurate and Dynamic**: Seamless integration with Git ensures that tags remain accurate and up-to-date across code changes.
- **Real-time and Historical Tracking**: Provides real-time updates to tags as code is edited and committed. Maintains historical tracking of tags, allowing developers to view tags as they were at any point in the project’s history.
- **Tag View**: A dedicated Tags View panel to browse and manage your tags. Displays nested folders and files, and supports right-click context menus similar to the Explorer view.

### Screenshots

\!\[Tags View\]\(images/tags-view.png\)

> Tip: Short, focused animations can be used here to show the extension in action.

## Requirements

- **VS Code**: Version 1.90.0 or later.
- **Node.js**: Version 12 or later.

## Extension Settings

This extension contributes the following settings:

- `ntags.enable`: Enable/disable this extension.
- `ntags.defaultNamespace`: Set a default namespace for tags.

## Commands

The extension provides several commands accessible via the Command Palette (Ctrl+Shift+P or Cmd+Shift+P):

- `nTags: Add Tag` - Add a new tag.
- `nTags: Select Tag` - Select a tag to filter.
- `nTags: Add Tag to File` - Add a tag to a specific file.
- `nTags: Remove Tag` - Remove a tag from a specific file.

## Known Issues

- [ ] Tagging large codebases might slow down the extension's performance.
- [ ] Namespace filtering may not work correctly if tags are not properly formatted.

## Release Notes

### 1.0.0

- Initial release of nTags.
- Basic tagging functionality.
- Namespace support.
- Git integration for dynamic tag updates.

### 1.0.1

- Fixed issue with tag creation in nested folders.

### 1.1.0

- Added features for real-time and historical tracking of tags.
- Improved user interface with a dedicated Tags View panel.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

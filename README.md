# nTags README

nTags (Navigational Tags) is a Visual Studio Code extension designed to help you efficiently navigate and manage your codebase using customizable tags. With nTags, you can create and manage tags for functions, classes, variables, and more, and organize them with namespaces for better categorization.

## Foundation

- **Robust Tagging**: Tag various code elements such as functions, classes, variables, conditional statements, loops, imports, and custom code blocks.
- **Namespace Support**: Organize tags with namespaces for better categorization (e.g., `user:cameron`, `feature:cards`).
- **Accurate and Dynamic**: Seamless integration with Git ensures that tags remain accurate and up-to-date across code changes.

### Requirements

- **VS Code**: Version 1.90.0 or later.
- **Node.js**: Version 12 or later.

### Extension Settings

This extension contributes the following settings:

- `ntags.enable`: Enable/disable this extension.
- `ntags.defaultNamespace`: Set a default namespace for tags.

### Commands

The extension provides several commands accessible via the Command Palette (Ctrl+Shift+P or Cmd+Shift+P):

- `nTags: Add Tag` - Add a new tag.
- `nTags: Add Tag to File` - Add a tag to a specific file.
- `nTags: Remove Tag` - Remove a tag from a specific file.

### Known Issues

- [ ] Tagging large codebases might slow down the extension's performance.
- [ ] Namespace filtering may not work correctly if tags are not properly formatted.

## Products using nTags

**Tag View**: A dedicated Tags View panel to browse and manage your tags. Displays nested folders and files, and supports right-click context menus similar to the Explorer view.

### Screenshots

\!\[Tags View\]\(images/tags-view.png\)

> Tip: Short, focused animations can be used here to show the extension in action.

### Product Commands

- `nTags: Select Tag` - Select a tag to filter.

## Release Notes

### 0.0.0

- Initial release of nTags.
- Basic tagging functionality.
- Namespace support.
- Git integration for dynamic tag updates.

### 0.0.1

- Fixed issue with tag creation in nested folders.
- Add persistent storage with sql.js

### 0.0.2

Explored using ntags as a custom explorer view.

- Prototyped seperate view
- Prototyped tag selector as a Explorer tab
- Prototyped excluding files that are not tagged

### Up Coming

- Added features for real-time and historical tracking of tags.
- Seperated nTags code into a package.
- Created API for other extensions to use nTags.
- Added a root and main default tag to all namespaces

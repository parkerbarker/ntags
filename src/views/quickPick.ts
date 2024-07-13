import * as vscode from 'vscode';

export interface QuickPickSection {
    label: string;
    values: string[];
}

export function showCustomQuickPick(sections: QuickPickSection[]): Promise<string | undefined> {
    return new Promise((resolve) => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.placeholder = 'Select or type a value';
        quickPick.canSelectMany = false; // Allow only single selection
        quickPick.ignoreFocusOut = true; // Keep the Quick Pick open even when focus is lost

        const items = sections.flatMap(section => [
            { label: section.label, kind: vscode.QuickPickItemKind.Separator },
            ...section.values.map(value => ({ label: value }))
        ]);

        quickPick.items = items;

        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                resolve(selection[0].label);
                quickPick.hide();
            }
        });

        quickPick.onDidChangeValue(value => {
            if (value) {
                quickPick.items = [
                    ...items,
                    { label: value, description: 'Press Enter to select this custom value' }
                ];
            }
        });

        quickPick.onDidAccept(() => {
            const selectedItems = quickPick.selectedItems;
            if (selectedItems.length > 0) {
                resolve(selectedItems[0].label);
            } else {
                resolve(quickPick.value);
            }
            quickPick.hide();
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
            resolve(undefined); // Resolve with undefined if the Quick Pick is closed without selection
        });

        quickPick.show();
    });
}

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

        const allItems = sections.flatMap(section => [
            { label: section.label, kind: vscode.QuickPickItemKind.Separator },
            ...section.values.map(value => ({ label: value }))
        ]);

        // TODO: Limit items to have a limit of 3 items initially
        quickPick.items = allItems;

        quickPick.onDidChangeValue(value => {
            const filteredItems = allItems.filter(item => item.label.includes(value));
            quickPick.items = [
                ...filteredItems.slice(0, 6),
                { label: value, description: 'Press Enter to select this custom value' }
            ];
        });

        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                resolve(selection[0].label);
                quickPick.hide();
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

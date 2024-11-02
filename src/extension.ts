import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Listen for file creation events
  const fileWatcher =
    vscode.workspace.createFileSystemWatcher("**/*.client.tsx");

  fileWatcher.onDidCreate(async (uri) => {
    try {
      // Check if filename ends with .client.tsx
      if (path.basename(uri.fsPath).endsWith(".client.tsx")) {
        const document = await vscode.workspace.openTextDocument(uri);
        const editor = await vscode.window.showTextDocument(document);

        // Insert 'use client' at the top of file
        await editor.edit((editBuilder) => {
          editBuilder.insert(new vscode.Position(0, 0), "'use client'\n\n");
        });

        // Save the file
        await document.save();
      }
    } catch (error) {
      console.error("Error handling new file:", error);
      vscode.window.showErrorMessage('Failed to add "use client" directive');
    }
  });

  // Add fileWatcher to subscriptions for proper cleanup
  context.subscriptions.push(fileWatcher);
}

export function deactivate() {}

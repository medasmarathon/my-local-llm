import * as vscode from 'vscode';
import { ChatBoxViewProvider } from './views/chat-box-web-view-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "my-local-llm" is now active!');
  
  const chatBoxViewProvider = new ChatBoxViewProvider(context.extensionUri);
  const chatBoxWebView = vscode.window.registerWebviewViewProvider("llm-chat-box", chatBoxViewProvider)

	context.subscriptions.push(chatBoxWebView);
}

// This method is called when your extension is deactivated
export function deactivate() {}

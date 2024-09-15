import * as vscode from 'vscode';
import { getNonce } from '../utils';
export class ChatBoxViewProvider implements vscode.WebviewViewProvider {
  private logger: vscode.OutputChannel;
  private webview?: vscode.Webview;
  public static readonly viewType = 'local-chat-llm.chatBox';
  constructor(
		private readonly _extensionUri: vscode.Uri,
  ) { 
    this.logger = vscode.window.createOutputChannel("LLM Chat Box");
  }
  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
				this._extensionUri
			]
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'insertSuggestedSnippet':
					{
						vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(data.value));
						break;
					}
			}
		});
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const chatLlmSettingsComponentUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat-llm-settings.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
		// Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();
    this.logger.appendLine("Loading HTML for webview");

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Chat Box</title>
			</head>
			<body>
        <div id="app"></div>
				<script type="module" nonce="${nonce}" src="${chatLlmSettingsComponentUri}"></script>
				<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

}
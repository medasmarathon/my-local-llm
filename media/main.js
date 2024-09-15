var vscode = acquireVsCodeApi();

document.getElementById("app").innerHTML = "";
var chatLlmSettings = document.createElement("chat-llm-settings");
document.getElementById("app").appendChild(chatLlmSettings);
class ChatLlmSettings extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<div>Inner Div</div>";
  }
}

customElements.define("chat-llm-settings", ChatLlmSettings);
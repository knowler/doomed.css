import doomedButtonStyles from "./button.css" with { type: "css" };

// TODO: make it click
class DoomedButtonElement extends HTMLElement {
	#internals = this.attachInternals();

	constructor() {
		super();
		this.#internals.role = "button";

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = "<slot>";
		this.shadowRoot.adoptedStyleSheets = [doomedButtonStyles];
	}

	connectedCallback() {
		if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", 0);
	}
}


if ((new URL(import.meta.url)).searchParams.has("define"))
	customElements.define("doomed-button", DoomedButtonElement);

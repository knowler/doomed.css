import { html } from "./utils.js";
import { DoomedElement } from "./element.js";
import doomedButtonStyles from "./button.css" with { type: "css" };

// TODO: make it click
class DoomedButtonElement extends DoomedElement {
	static formAssociated = true;

	static styles = doomedButtonStyles;
	static content = html`<slot>`;

	#internals = this.attachInternals();

	constructor() {
		super();
		this.#internals.role = "button";
	}

	connectedCallback() {
		if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", 0);
	}
}


if ((new URL(import.meta.url)).searchParams.has("define"))
	customElements.define("doomed-button", DoomedButtonElement);

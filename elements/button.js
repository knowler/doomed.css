import { html } from "./utils.js";
import { DoomedElement } from "./element.js";
import { FormAssociated } from "./mixins/form-associated.js";
import doomedButtonStyles from "./button.css" with { type: "css" };

// TODO: make it click
// TODO: when/if disabled gets added to ElementInternals.type, we don’t need to make this form associated (though it could be useful for submit)
class DoomedButtonElement extends FormAssociated(DoomedElement) {
	static styles = doomedButtonStyles;
	static content = html`<slot>`;

	#internals = this.attachInternals();

	constructor() {
		super();
		this.#internals.type = "button";
		// TODO: remove this when/if the default role is added via ElementInternals.type
		this.#internals.role = "button";
	}

	connectedCallback() {
		// TODO: remove this when/if focusability is added by default via ElementInternals.type
		if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", 0);
	}
}


if ((new URL(import.meta.url)).searchParams.has("define"))
	customElements.define("doomed-button", DoomedButtonElement);

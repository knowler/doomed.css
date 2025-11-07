import { html } from "./utils.js";
import { DoomedElement } from "./element.js";
import { ButtonLike } from "./mixins/button-like.js";
import { FormAssociated } from "./mixins/form-associated.js";
import doomedButtonStyles from "./button.css" with { type: "css" };

class DoomedButtonElement extends FormAssociated(ButtonLike(DoomedElement)) {
	static styles = doomedButtonStyles;
	static content = html`<slot>`;
}


if ((new URL(import.meta.url)).searchParams.has("define"))
	customElements.define("doomed-button", DoomedButtonElement);

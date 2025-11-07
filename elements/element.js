export class DoomedElement extends HTMLElement {
	#internals = super.attachInternals();

	attachInternals() {
		return this.#internals;
	}

	static shadowRootOptions = {
		mode: "open",
	}

	constructor() {
		super();

		this.attachShadow(this.constructor.shadowRootOptions);

		if (this.constructor.content)
			this.shadowRoot.append(
				this.ownerDocument.importNode(
					this.constructor.content,
					true,
				),
			);

		if (this.constructor.styles)
			this.shadowRoot.adoptedStyleSheets = [
				this.constructor.styles,
			];
	}
}

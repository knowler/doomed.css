export class DoomedElement extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: "open" });

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

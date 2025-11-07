export const ButtonLike = superclass => class ButtonLikeElement extends superclass {
	#internals = this.attachInternals();
	constructor() {
		super();
		this.#internals.type = "button";
		this.#internals.role = "button";

		this.addEventListener("keydown", this);
		this.addEventListener("keyup", this);
	}

	connectedCallback() {
		if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", 0);
	}

	handleEvent(event) {
		if (
			(event.type === "keydown" && event.key === "Enter" && !event.metaKey) ||
			(event.type === "keyup" && event.key === " " && !event.metaKey && !event.altKey && !event.ctrlKey)
		) {
			event.preventDefault();
			this.click();
		}
	}
}

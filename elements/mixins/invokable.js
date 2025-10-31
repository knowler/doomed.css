export const Invokable = superclass => class InvokableElement extends superclass {
	get command() {
		return this.getAttribute("command");
	}

	set command(command) {
		this.setAttribute("command", command);
	}

	#commandForElement;
	get commandForElement() {
		return this.#commandForElement;
	}

	set commandForElement(element) {
		this.#commandForElement = element;
		this.setAttribute("commandfor", "");
	}

	// TODO: the base class needs to have an API for this???
	static observedAttributes = ["commandfor"];
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "commandfor" && newValue) {
			this.#commandForElement = this.getRootNode().getElementById(newValue);
		}
	}

	constructor() {
		super();
		this.addEventListener("click", this);
	}

	handleEvent(event) {
		if (event.type === "click" && this.command && this.commandForElement) {
			const target = this.commandForElement;
			if (!this.command.startsWith("--")) {
				switch (this.command) {
					case "toggle-popover": target.togglePopover(); break;
					case "show-popover": target.showPopover(); break;
					case "hide-popover": target.hidePopover(); break;
					case "show-modal": target.showModal(); break;
					case "close": target.close(); break;
					case "request-close": target.requestClose(); break;
				}
			}
			target.dispatchEvent(
				new CommandEvent("command", {
					source: this,
					command: this.command,
					bubbles: true,
					cancelable: true,
				})
			);
		}
	}
}

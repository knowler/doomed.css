export const FormAssociated = superclass => class FormAssociatedElement extends superclass {
	static formAssociated = true;

	#internals = this.attachInternals();

	get form() {
		return this.#internals.form;
	}

	get name() {
		return this.getAttribute("name");
	}

	// TODO: revisit this
	get type() {
		return this.localName;
	}

	get validity() {
		return this.#internals.validity;
	}

	get validationMessage() {
		return this.#internals.validationMessage;
	}

	get willValidate() {
		return this.#internals.willValidate;
	}

	checkValidity() {
		return this.#internals.checkValidity();
	}

	reportValidity() {
		return this.#internals.checkValidity();
	}
}

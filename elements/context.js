export class ContextRequestEvent extends Event {
	constructor(context, callback, subscribe = false) {
		super("context-request", { bubbles: true, composed: true });
		this.#context = context;
		this.#callback = callback;
		this.#subscribe = subscribe;
	}

	#context;
	get context() { return this.#context; }

	#callback;
	get callback() { return this.#callback; }

	#subscribe;
	get subscribe() { return this.#subscribe; }
}

const UPSERT = (map, key, initializer, value) =>
	map.get(key)??
		(map.set(key, (value = initializer)), value);

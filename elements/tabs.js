import { css, html } from "./utils.js";
import { DoomedElement } from "./element.js";
import { ButtonLike } from "./mixins/button-like.js";

export class DoomedTabsElement extends DoomedElement {
	static content = html`
		<slot id=tablist-slot>
			<doomed-tablist>
				<slot id=tablist-content-slot></slot>
			</doomed-tablist>
		</slot>
		<slot id=tabpanels-slot></slot>
	`;

	static styles = css`
		:host {
			display: block;
		}
	`;

	static shadowRootOptions = {
		mode: "open",
		slotAssignment: "manual",
	}

	constructor() {
		super();
		this.addEventListener("doomed-tab-selected-change", this);
	}

	handleEvent(event) {
		if (event.type !== "doomed-tab-selected-change") return;

		const selectedTab = this.querySelector(":is(:scope > doomed-tab, :scope > doomed-tablist > doomed-tab):state(selected)");
		const tabs = Array.from(this.querySelectorAll(":scope > doomed-tab, :scope > doomed-tablist > doomed-tab"));

		const selectedIndex = tabs.findIndex(tab => tab === selectedTab);
		const panel = this.querySelector(`:scope > doomed-tabpanel:nth-of-type(${selectedIndex + 1})`)

		this.tabPanelsSlot.assign(panel);
	}

	get tabListSlot() {
		return this.shadowRoot.getElementById("tablist-slot");
	}

	get tabListContentSlot() {
		return this.shadowRoot.getElementById("tablist-content-slot");
	}

	get tabPanelsSlot() {
		return this.shadowRoot.getElementById("tabpanels-slot");
	}

	connectedCallback() {
		const nodes = Array.from(this.childNodes);
		const tabs = nodes.filter(node => node.matches?.("doomed-tab"));
		const tabList = nodes.find(node => node.matches?.("doomed-tablist"));
		const panel = nodes.find(node => node.matches?.("doomed-tabpanel"));

		if (tabList) this.tabListSlot.assign(tabList);
		else this.tabListContentSlot.assign(...tabs);
		this.tabPanelsSlot.assign(panel);
	}
}

export class DoomedTabElement extends ButtonLike(DoomedElement) {
	static content = html`<slot>`;
	static styles = css`
		:host {
			cursor: pointer;
			display: inline-block;
			font-weight: 500;
			padding: 4px;
			border-block-end: 2px solid hsl(from CanvasText h s calc(l * 0.3));
			transition: border-color 100ms ease-in-out;
		}
		:host(:state(selected)) {
			border-block-end: 2px solid CanvasText;
		}
	`;

	#internals = this.attachInternals();

	constructor() {
		super();
		this.#internals.role = "tab";

		this.addEventListener("focus", this);
	}

	static get observedAttributes() { return ["tabindex"]; }
	attributeChangedCallback(name, oldValue, newValue) {
		if (this.tabIndex === 0) {
			this.#internals.states.add("selected");
			this.dispatchEvent(new Event("doomed-tab-selected-change", { bubbles: true, composed: true }));
		} else this.#internals.states.delete("selected");
	}

	connectedCallback() {
		this.setAttribute("tabindex", this.matches(":first-of-type") ? 0 : -1);

		const tabsElement = this.closest("doomed-tabs");

		const allPanels = tabsElement.querySelectorAll(":scope > doomed-tabpanel");
		const allTabs = tabsElement.querySelectorAll(":scope > doomed-tab, :scope > doomed-tablist > doomed-tab");
		const index = Array.from(allTabs).findIndex(tab => tab === this);
		const panel = allPanels.item(index);
		this.#internals.ariaControlsElements = [panel];
	}
}



const TABLIST_KEYS = {
	horizontal: {
		previous: "ArrowLeft",
		next: "ArrowRight",
		start: "Home",
		end: "End",
	},
	vertical: {
		previous: "ArrowUp",
		next: "ArrowDown",
		start: "Home",
		end: "End",
	}
};

export class DoomedTabListElement extends DoomedElement {
	static content = html`<slot>`;
	static styles = css`
		:host {
			display: flex;
			column-gap: 4px;
		}
	`;

	get orientation() {
		return this.#internals.ariaOrientation;
	}

	// TODO: Should we no-op this if the value isn’t valid?
	set orientation(value) {
		this.setAttribute("orientation", value);
	}


	static get observedAttributes() { return ["orientation"]; }
	attributeChangedCallback(name, oldValue, newValue) {
		if (name !== "orientation") return;
		if (newValue == null || newValue === "horizontal")
			this.#internals.ariaOrientation = "horizontal";
		else if (newValue === "vertical")
			this.#internals.ariaOrientation = "vertical";
	}

	#internals = this.attachInternals();
	constructor() {
		super();
		this.#internals.role = "tablist";
		this.#internals.ariaOrientation = "horizontal";

		this.shadowRoot.addEventListener("click", this);
		this.shadowRoot.addEventListener("keydown", this);
	}

	handleEvent(event) {

		const tabs = this.shadowRoot.querySelector("slot").assignedElements().flatMap(element => 
			element.matches("slot") ? element.assignedElements() : element
		);

		let selectedIndex = tabs.findIndex(tab => tab.tabIndex === 0);
		let selectedTab = tabs.at(selectedIndex);

		if (event.type == "click" && event.target.matches("doomed-tab")) {
			selectedTab.tabIndex = -1;
			event.target.tabIndex = 0;
			this.dispatchEvent(new Event("doomed-tab-selected-change", { bubbles: true, composed: true }));
			return;
		}

		const keys = TABLIST_KEYS[this.orientation];

		switch (event.key) {
			default: return;
			case keys.previous:
				selectedIndex = (selectedIndex - 1 + tabs.length) % tabs.length;
				break;
			case keys.next:
				selectedIndex = (selectedIndex + 1) % tabs.length;
				break;
			case keys.start:
				selectedIndex = 0;
				break;
			case keys.end:
				selectedIndex = tabs.length - 1;
				break;
		}

		selectedTab.tabIndex = -1;
		selectedTab = tabs.at(selectedIndex);
		selectedTab.tabIndex = 0;
		selectedTab.focus();
	}
}

export class DoomedTabPanelElement extends DoomedElement {
	static content = html`<slot>`;

	#internals = this.attachInternals();
	constructor() {
		super();
		this.#internals.role = "tabpanel";
	}

	connectedCallback() {
		if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", 0);

		const tabsElement = this.parentElement;
		const allPanels = tabsElement.querySelectorAll(":scope > doomed-tabpanel");
		const allTabs = tabsElement.querySelectorAll(":scope > doomed-tab, :scope > doomed-tablist > doomed-tab");
		const index = Array.from(allPanels).findIndex(panel => panel === this);
		const tab = allTabs.item(index);
		this.#internals.ariaLabelledByElements = [tab];
	}
}

if ((new URL(import.meta.url)).searchParams.has("define")) {
	customElements.define("doomed-tabs", DoomedTabsElement);
	customElements.define("doomed-tab", DoomedTabElement);
	customElements.define("doomed-tablist", DoomedTabListElement);
	customElements.define("doomed-tabpanel", DoomedTabPanelElement);
}

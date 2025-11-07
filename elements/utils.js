export function html(strings, ...expressions) {
	const template = document.createElement("template");
	template.innerHTML = String.raw(strings, ...expressions);
	return template.content;
}

export function css(strings, ...expressions) {
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(String.raw(strings, ...expressions));
	return sheet;
}

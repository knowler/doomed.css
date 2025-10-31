export function html(strings, ...expressions) {
	const template = document.createElement("template");
	template.innerHTML = String.raw(strings, ...expressions);
	return template.content;
}

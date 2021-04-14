export function getElement(id: string) {
	return document.querySelector(`#${id}`);
}

export function download(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.append(element);

	element.click();

	element.remove();
}

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

export function naiveDateToDate(naiveDate: string): Date {
	const split = naiveDate.split(':');
	const output = new Date(Date.now());
	output.setHours(Number.parseInt(split[0], 10));
	output.setMinutes(Number.parseInt(split[1], 10));
	output.setSeconds(Number.parseInt(split[2], 10));
	return output;
}

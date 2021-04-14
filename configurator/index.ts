import '../css/common.css';
import {getElement, download} from '../js/helpers';

getElement('upload').addEventListener('click', async () => {
	const file = (getElement('cfg') as any).files[0];
	if (!file) {
		getElement('status').innerHTML = 'No file provided';
		return;
	}

	const text = await file.text();

	let data;
	try {
		data = JSON.parse(text);
	} catch {
		getElement('status').innerHTML = 'Invalid json';
		return;
	}

	if (!data[0]) {
		getElement('status').innerHTML = 'Not an array';
		return;
	}

	for (const i of data) {
		if (i.name === undefined) {
			getElement('status').innerHTML = 'Missing name';
			return;
		}

		if (i.regex === undefined) {
			getElement('status').innerHTML = 'Missing regex';
			return;
		}

		try {
			const _ = new RegExp(i.regex);
		} catch {
			getElement('status').innerHTML = 'Invalid regex';
			return;
		}
	}

	localStorage.setItem('cfg', text);
	getElement('status').innerHTML = 'OK';
});

getElement('download').addEventListener('click', () => {
	download('cfg.json', localStorage.getItem('cfg'));
});


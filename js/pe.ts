import {getElement} from './helpers';

export interface Period {
	location: string;
	nodress: boolean;
	heart: boolean;
	chromebook: boolean;
}

export function url(): string {
	const dayNumber = new Date(Date.now()).getDay();
	return `https://script.google.com/macros/s/AKfycbyD4QWaKRFb88EY9ZENMZu7l1qnk9WImxVf1Bkj-bHidrXVOPwzKgFzY1rvKhGLEI9Q/exec?sheet=${dayNumber}`;
}

export async function get(teacher: string, regex: RegExp): Promise<Period | undefined> {
	let data = await fetch(url()).catch(error => {
		console.error(error);
		return undefined;
	});
	if (!data) {
		console.error('HEY YOU!\nLooking through logs to diagnose your broken PE board integration?\nCheck if an extension is blocking Google Scripts.\nPrivacy Badger is known to do this.');
		getElement('warnings').innerHTML += 'Can\'t reach the PE board service.';
		return undefined;
	}

	data = await data.json();

	for (const i of data) {
		if (i.name === teacher) {
			for (const period of Object.getOwnPropertyNames(i).filter(() => i !== 'name')) {
				if ((new RegExp(regex)).test(period)) {
					console.log(i, period);
					return i[period];
				}
			}

			getElement('warnings').innerHTML += `Can't find data for ${teacher} matching ${regex.toString()}.`;
			return undefined;
		}
	}

	getElement('warnings').innerHTML += `Can't find data for ${teacher}.`;
	return undefined;
}

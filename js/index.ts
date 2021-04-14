import * as Bell from './bell';
import * as Pe from './pe';
import {getElement} from './helpers';
import '../css/common.css';

async function update() {
	// Set up
	const now = new Date(Date.now());
	const time = `${now.getHours()}:${now.getMinutes()}`;
	const schedule = await Bell.getSchedule();
	const cfg = JSON.parse(localStorage.getItem('cfg'));

	// Figure out which period it is
	let current: number;
	if (!schedule.schedule[0]) {
		current = 0;
	} else if (now.getTime() < schedule.schedule[0].start.getTime()) {
		current = -1;
	} else if (now.getTime() > schedule.schedule[0].end.getTime()) {
		current = schedule.schedule.length;
	} else {
		for (let i = 0; i < schedule.schedule.length; ++i) {
			if (schedule.schedule[i].start.getTime() < now.getTime() && schedule.schedule[i].end.getTime() > now.getTime()) {
				current = i;
				break;
			}
		}
	}

	// Display

	// Populate clock
	getElement('clock').innerHTML = time;

	// Populate previous
	if (current - 1 < 0) {
		getElement('previous').innerHTML = '';
	} else {
		const previous = schedule.schedule[current - 1];
		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(previous.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : previous.name} ${previous.end.getHours()}:${previous.end.getMinutes()}`;
		if (matched.url) {
			getElement('previous').innerHTML = `<a href="${matched.url as string}">${shown}</a>`;
		} else {
			getElement('previous').innerHTML = shown;
		}
	}

	// Populate current
	if (current < 0 || current >= schedule.schedule.length) {
		getElement('current').innerHTML = 'none';
		getElement('pe').innerHTML = '';
	} else {
		const current_ = schedule.schedule[current];
		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(current_.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : current_.name} ${current_.end.getHours()}:${current_.end.getMinutes()}`;
		getElement('current').innerHTML = shown;

		if (matched?.pe) {
			const peState = await Pe.get(matched.pe, matched.regex);
			getElement('pe').innerHTML = `${peState.location}${peState.nodress ? ', No dress' : ''}${peState.heart ? ', HR Monitor' : ''}${peState.chromebook ? ', Chromebook' : ''}`;
		} else {
			getElement('pe').innerHTML = '';
		}
	}

	// Populate next
	if (current + 1 >= 0) {
		getElement('next').innerHTML = '';
	} else {
		const next = schedule.schedule[current + 1];
		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(next.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : next.name} ${next.end.getHours()}:${next.end.getMinutes()}`;
		getElement('previous').innerHTML = shown;
	}
}

void update();
setInterval(update, 5000);

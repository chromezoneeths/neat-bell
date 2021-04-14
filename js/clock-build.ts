import type {Bell, Period} from './bell';
import {getElement} from './helpers';
import * as Pe from './pe';

export async function currentPeriod(schedule: Bell, now: Date): Promise<{previous: number | undefined; current: number | undefined; next: number | undefined}> {
	let current: number;
	let previous: number;
	let next: number;
	if (!schedule.schedule[0]) {
		current = 0;
	} else if (now.getTime() < (new Date(schedule.schedule[0].start)).getTime()) {
		current = -1;
		next = 0;
	} else if (now.getTime() > (new Date(schedule.schedule[schedule.schedule.length - 1].end)).getTime()) {
		current = schedule.schedule.length;
		previous = current - 1;
	} else {
		for (let i = 0; i < schedule.schedule.length; ++i) {
			if ((new Date(schedule.schedule[i].start)).getTime() < now.getTime() && (new Date(schedule.schedule[i].end)).getTime() > now.getTime()) {
				current = i;
				break;
			} else if ((new Date(schedule.schedule[i].end)).getTime() < now.getTime()) {
				previous = i;
			} else if ((new Date(schedule.schedule[i].start)).getTime() > now.getTime()) {
				next = i;
				break;
			}
		}
	}

	return {previous, current, next};
}

export async function populatePrevious(schedule: Bell, previous: number | undefined, cfg: any) {
	if (previous === undefined) {
		getElement('previous').innerHTML = '';
	} else {
		const previous_ = schedule.schedule[previous];

		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(previous_.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : previous_.name} ended at ${(new Date(previous_.end)).getHours()}:${(new Date(previous_.end)).getMinutes()}`;
		if (matched?.url) {
			getElement('previous').innerHTML = `<a href="${matched.url as string}">${shown}</a>`;
		} else {
			getElement('previous').innerHTML = shown;
		}
	}
}

export async function populateCurrent(schedule: Bell, context: {previous: number | undefined; current: number | undefined; next: number | undefined}, cfg: any, oldCurrent: number, notification: Notification | undefined) {
	const {previous, current, next} = context;
	if (current < 0 || current >= schedule.schedule.length) {
		getElement('current').innerHTML = '(no current period)';
		getElement('pe').innerHTML = '';
	} else {
		let current_: Period;
		if (current === undefined) {
			current_ = {
				name: 'Passing Period',
				notice: undefined,
				start: previous === undefined ? new Date(0) : schedule.schedule[previous].start,
				end: next === undefined ? new Date(0) : schedule.schedule[next].start
			};
		} else {
			current_ = schedule.schedule[current];
		}

		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(current_.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : current_.name} from ${(new Date(current_.start)).getHours()}:${(new Date(current_.start)).getMinutes()} to ${(new Date(current_.end)).getHours()}:${(new Date(current_.end)).getMinutes()}`;
		if (matched?.url) {
			getElement('current').innerHTML = `<a href="${matched.url as string}">${shown}</a>`;
		} else {
			getElement('current').innerHTML = shown;
		}

		if (matched?.pe) {
			const peState = await Pe.get(matched.pe, matched.regex);
			getElement('pe').innerHTML = `${peState.location}${peState.nodress ? ', No dress' : ''}${peState.heart ? ', HR Monitor' : ''}${peState.chromebook ? ', Chromebook' : ''}`;
		} else {
			getElement('pe').innerHTML = '';
		}

		// Notify
		if (Notification.permission === 'granted' && oldCurrent !== undefined && oldCurrent !== current) {
			if (notification) {
				notification.close();
			}

			console.log('Would send notification');

			notification = new Notification(`New period ${matched.name as string}`);
			notification.addEventListener('click', () => {
				window.open(matched.url as string);
			});
		}
	}

	return notification;
}

export async function populateNext(schedule: Bell, next: number | undefined, cfg: any) {
	if (next === undefined) {
		getElement('next').innerHTML = '(school ends)';
	} else {
		const next_ = schedule.schedule[next];
		let matched;
		for (const i of cfg) {
			if ((new RegExp(i.regex).test(next_.name))) {
				matched = i;
			}
		}

		const shown = `${matched ? matched.name as string : next_.name} starts at ${(new Date(next_.start)).getHours()}:${(new Date(next_.start)).getMinutes()}`;
		if (matched?.url) {
			getElement('next').innerHTML = `<a href="${matched.url as string}">${shown}</a>`;
		} else {
			getElement('next').innerHTML = shown;
		}
	}
}


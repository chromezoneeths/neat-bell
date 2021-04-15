import * as Bell from './bell';
import * as Pe from './pe';
import * as ClockBuild from './clock-build';
import {getElement} from './helpers';
import '../css/common.css';

let oldCurrent: number | undefined;
let notification: Notification | undefined;

getElement('enable-notifs').addEventListener('click', async () => {
	await Notification.requestPermission();
});

async function update(): Promise<void> {
	// Set up
	getElement('warnings').innerHTML = '';
	const now = new Date(Date.now());
	const time = ClockBuild.toTimeOfDay(new Date(Date.now()));
	const schedule = await Bell.getSchedule();
	const cfg = JSON.parse(localStorage.getItem('cfg')) || [];

	// BUG: For whatever reason unless I cast the starts and ends to dates right before I use them they turn into strings? Look into this later

	// Figure out which period it is
	const {previous, current, next} = await ClockBuild.currentPeriod(schedule, now);

	// Populate clock
	getElement('clock').innerHTML = time;

	// Detect if we need to do anything
	if (current !== undefined && oldCurrent === current) {
		return;
	}

	void ClockBuild.populatePrevious(schedule, previous, cfg);

	// (Also notifies the user of changes)
	notification = await ClockBuild.populateCurrent(schedule, {previous, current, next}, cfg, oldCurrent, notification);

	void ClockBuild.populateNext(schedule, next, cfg);

	oldCurrent = current;
}

void update();
setInterval(update, 5000);

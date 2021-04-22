import {getElement, naiveDateToDate} from './helpers';

// This interface corresponds to responses from https://bell-api.spaghet.us/api/v1
interface BellResponse {
	schedule: PeriodResponse[];
	schedule_name: string;
	in_session: boolean;
	remote_time: string;
}
interface PeriodResponse {
	name: string;
	notice: string | null;
	start: string;
	end: string;
}
// We need to do a bit of translation since JS assumes a date with no specified time zone is in its time zone rather than GMT.
export interface Bell {
	schedule: Period[];
	schedule_name: string;
	in_session: boolean;
	remote_time: Date;
}
export interface Period {
	name: string;
	notice: string | null;
	start: Date;
	end: Date;
}
export async function transformResponse(response: BellResponse): Promise<Bell> {
	const result: Bell = {
		schedule: [],
		schedule_name: response.schedule_name,
		in_session: response.in_session,
		remote_time: new Date(response.remote_time + '+00:00')
	};
	for (const i of response.schedule) {
		result.schedule.push({
			name: i.name,
			notice: i.notice,
			start: naiveDateToDate(i.start),
			end: naiveDateToDate(i.end)
		});
	}

	return result;
}

export async function getSchedule(): Promise<Bell | undefined> {
	const cached = cache();
	if (cached.valid) {
		return cached.result;
	}

	const fetched = await get().catch(() => undefined);
	if (fetched) {
		const response = await transformResponse(fetched);
		localStorage.setItem('cache', JSON.stringify(response));
		localStorage.setItem('cache_date', JSON.stringify(new Date(Date.now())));
		return response;
	}

	if (cached.result) {
		getElement('warnings').innerHTML += 'Using outdated cache because the API can\'t be accessed.\n';
		return cached.result;
	}

	getElement('warnings').innerHTML += 'Can\'t get the schedule from the cache or the network!';
	return undefined;
}

function cache(): {result: Bell | undefined; valid: boolean} {
	const cached = JSON.parse(localStorage.getItem('cache'));
	const cachedDate = new Date(JSON.parse(localStorage.getItem('cache_date')));
	const now = new Date(Date.now());
	const elapsed = now.getTime() - cachedDate.getTime();
	const isSameDay = now.getDate() === cachedDate.getDate();

	return {
		result: cached,
		valid: (elapsed < 8 * 60 * 60 * 1000) && isSameDay
	};
}

async function get(): Promise<BellResponse> {
	return (await fetch('https://bell-api.wolo.dev/api/v1')).json();
}

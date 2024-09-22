import dayjs from 'dayjs';

interface ScheduledJob {
	name: string;
	timeout: NodeJS.Timeout;
}

const scheduledJobs: Map<string, ScheduledJob> = new Map();

function removeJob(uuid: string) {
	const data = scheduledJobs.get(uuid);
	if (data) {
		clearTimeout(data.timeout);
		scheduledJobs.delete(uuid);
	}
}

export function scheduleJob(name: string, time: dayjs.Dayjs, fn: () => Promise<void>) {
	const now = dayjs();
	if (time.valueOf() < now.valueOf()) {
		throw new Error('Scheduled time must be in the future');
	}
	const delay = time.valueOf() - now.valueOf();

	const uuid = crypto.randomUUID();

	const timeout = setTimeout(async () => {
		try {
			await fn();
		} finally {
			removeJob(uuid);
		}
	}, delay);

	scheduledJobs.set(uuid, {
		name: name + ` will run at ${time.format('YYYY-MM-DDTHH:mm:ssZ[Z]')}`,
		timeout
	});
}

export function listJobs() {
	return Array.from(
		scheduledJobs.entries().map(([id, data]) => {
			return { id, name: data.name };
		})
	);
}

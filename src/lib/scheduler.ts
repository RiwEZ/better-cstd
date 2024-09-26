import { CronJob } from 'cron';
import dayjs from 'dayjs';

interface ScheduledJob {
	name: string;
	job: CronJob;
}

const scheduledJobs: Map<string, ScheduledJob> = new Map();

function removeJob(uuid: string) {
	const data = scheduledJobs.get(uuid);
	if (data) {
		scheduledJobs.delete(uuid);
	}
}

export function scheduleJob(time: dayjs.Dayjs, fn: () => Promise<void>) {
	const uuid = crypto.randomUUID();

	const job = CronJob.from({
		cronTime: time.toDate(),
		onTick: async function () {
			try {
				await fn();
			} finally {
				removeJob(uuid);
			}
		},
		start: true,
		timeZone: 'UTC+7'
	});

	scheduledJobs.set(uuid, {
		name: uuid + `will run at ${time.format('YYYY-MM-DDTHH:mm:ssZ[Z]')}`,
		job
	});
}

export function listJobs() {
	return Array.from(
		scheduledJobs.entries().map(([id, data]) => {
			return { id, name: data.name };
		})
	);
}

export type JobList = ReturnType<typeof listJobs>

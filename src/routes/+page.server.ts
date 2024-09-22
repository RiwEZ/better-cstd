import type { PageServerLoad } from './$types';
import type { TableTennisReservationInfo } from '$lib/services/bff';
import { listJobs } from '$lib/scheduler';

export const load: PageServerLoad = async ({ fetch }) => {
	const resp = await fetch('/bff/table-tennis');
	const data = await (resp.json() as TableTennisReservationInfo);

	return { tableTennis: data, jobs: listJobs() };
};

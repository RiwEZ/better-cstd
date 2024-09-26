import type { PageServerLoad } from './$types';
import type { TableTennisReservationInfo } from '$lib/services/bff';

export const load: PageServerLoad = async ({ fetch }) => {
	const resp = await fetch('/bff/table-tennis');
	const tableTennis = await (resp.json() as TableTennisReservationInfo);

	return { tableTennis };
};

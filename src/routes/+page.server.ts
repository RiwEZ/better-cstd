import type { PageServerLoad } from './$types';
import type { TableTenni3DaysReservationInfos } from '$lib/services/bff';

export const load: PageServerLoad = async ({ fetch }) => {
	const resp = await fetch('/bff/table-tennis');
	const data = await (resp.json() as TableTenni3DaysReservationInfos);
	return { tableTennis: data };
};

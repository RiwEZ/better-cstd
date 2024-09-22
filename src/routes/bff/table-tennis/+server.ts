import { SESSION_TOKEN } from '$lib/globals';
import { tableTennis3DaysReservationInfo } from '$lib/services/bff';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(SESSION_TOKEN);
	if (token === undefined) {
		return new Response(`error: unauthorized`, {
			status: 401
		});
	}

	const result = await tableTennis3DaysReservationInfo(token);
	return new Response(JSON.stringify(result));
};

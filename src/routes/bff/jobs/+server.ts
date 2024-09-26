import { auth } from '$lib/middlewares';
import { listJobs } from '$lib/scheduler';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const authResult = await auth(cookies);
	if (authResult.error) {
		return authResult.error;
	}
	return new Response(JSON.stringify(listJobs()));
};

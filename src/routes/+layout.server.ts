import { SESSION_ID_TOKEN, SESSION_TOKEN } from '$lib/globals';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, route }) => {
	const token = cookies.get(SESSION_TOKEN);
	const idToken = cookies.get(SESSION_ID_TOKEN);

	if ((token === undefined || idToken === undefined) && route.id !== '/login') {
		redirect(302, '/login');
	}
};

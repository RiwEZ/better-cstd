import { SESSION_ID_TOKEN, SESSION_TOKEN } from '$lib/globals';
import type { Cookies } from '@sveltejs/kit';

export async function auth(cookies: Cookies) {
	const token = cookies.get(SESSION_TOKEN);
	if (token === undefined) {
		return {
			error: new Response(`error: unauthorized`, {
				status: 401
			})
		};
	}

	const idToken = cookies.get(SESSION_ID_TOKEN);
	if (idToken === undefined) {
		return {
			error: new Response(`error: unauthorized`, {
				status: 401
			})
		};
	}

	return { data: { token, idToken } };
}

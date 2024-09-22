import { z } from 'zod';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { registerGuest } from '$lib/services/cstd';
import { SESSION_ID_TOKEN, SESSION_TOKEN } from '$lib/globals';

const cidSchema = z.string().length(13);

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const cid = data.get('cid');
		const cidResult = cidSchema.safeParse(cid);
		if (!cidResult.success) {
			return fail(400, { cid, incorrect: true });
		}

		const registerResult = await registerGuest(cidResult.data);
		if (!registerResult.success) {
			return fail(400, { cid, registerFailed: true });
		}

		cookies.set(SESSION_TOKEN, registerResult.data.auth_info.token, {
			path: '/',
			secure: true,
			sameSite: true
		});
		cookies.set(SESSION_ID_TOKEN, registerResult.data.debugger.active_with_guest_card[0].card_id, {
			path: '/',
			secure: true,
			sameSite: true
		});

		redirect(302, '/');
	}
} satisfies Actions;

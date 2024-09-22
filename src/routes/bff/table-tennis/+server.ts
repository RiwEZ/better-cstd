import { SESSION_TOKEN } from '$lib/globals';
import { tableTennisReservationInfo } from '$lib/services/bff';
import type { RequestHandler } from '@sveltejs/kit';
import { reserve } from '$lib/services/cstd';
import { auth } from '$lib/middlewares';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { scheduleJob } from '$lib/scheduler';

dayjs.extend(utc);
dayjs.extend(timezone);

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(SESSION_TOKEN);
	if (token === undefined) {
		return new Response(`error: unauthorized`, {
			status: 401
		});
	}

	const result = await tableTennisReservationInfo(token);
	return new Response(JSON.stringify(result));
};

const schema = z.object({
	slotId: z.string().uuid(),
	bookingDate: z.string().date(),
	scheduleReserve: z.boolean()
});

async function validate(request: Request) {
	if (request.headers.get('content-type') !== 'application/json') {
		return {
			error: new Response('error: invalid content-type', {
				status: 400
			})
		};
	}

	const body = await request.json();
	const parseResult = schema.safeParse(body);
	if (!parseResult.success) {
		return {
			error: new Response('error: invalid body', {
				status: 400
			})
		};
	}

	return { data: parseResult.data };
}

export const POST: RequestHandler = async ({ cookies, request }) => {
	const authResult = await auth(cookies);
	if (authResult.error) {
		return authResult.error;
	}

	const validateResult = await validate(request);
	if (validateResult.error) {
		return validateResult.error;
	}

	const { slotId, bookingDate, scheduleReserve } = validateResult.data;

	if (!scheduleReserve) {
		const response = await reserve(authResult.data.token, {
			bookerId: authResult.data.idToken,
			slotId,
			bookingDate: dayjs(bookingDate)
		});

		if (response.status !== 200) {
			return new Response('error: something went wrong on the server', { status: 500 });
		}

		return new Response();
	}

	const scheduledTime = dayjs(bookingDate)
		.tz('Asia/Bangkok', true)
		.subtract(1, 'd')
		.hour(6)
		.minute(0);

	scheduleJob(bookingDate, scheduledTime, async () => {
		for (let i = 0; i < 3; i += 1) {
			try {
				const response = await reserve(authResult.data.token, {
					bookerId: authResult.data.idToken,
					slotId,
					bookingDate: dayjs(bookingDate)
				});

				if (response.status === 200) {
					break;
				}
			} catch {
				console.error('[scheduleJob.reserve] has failed');
				await new Promise((resolve) => setTimeout(resolve, 10000));
			}
		}
	});

	return new Response();
};

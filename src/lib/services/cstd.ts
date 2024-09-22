import dayjs from 'dayjs';
import { z } from 'zod';
import { CSTD_BASE_URL } from '$env/static/private';
import { getCache } from './cache';

const reservationSlotSchema = z.array(
	z.object({
		ID: z.string().uuid(),
		START_TIME: z.string().time(),
		END_TIME: z.string().time(),
		IS_FULL: z.boolean(),
		REMAINING: z.number()
	})
);

export async function reservationSlot(token: string, uuid: string, date: dayjs.Dayjs) {
	const url = new URL(`/reservation/api/reservation/item/${uuid}/slot`, CSTD_BASE_URL);
	url.searchParams.set('BOOKING_DATE', date.format('YYYY-MM-DD'));
	const resp = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	const body = await resp.json();
	return reservationSlotSchema.safeParse(body);
}

const reservationListSchema = z.array(
	z.object({
		ID: z.string().uuid(),
		IS_RESERVATION_ITEM: z.boolean(),
		IS_AVAILABLE: z.boolean(),
		IS_GUEST: z.boolean(),
		NAME_EN: z.string()
	})
);

export async function reservationList(token: string, uuid: string) {
	const key = `reservationList-${uuid}`;
	const url = new URL(`/reservation/api/reservation/item/${uuid}/active`, CSTD_BASE_URL);

	const result = await getCache(key, async () => {
		const result = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const body = await result.json();
		return body;
	});


	return reservationListSchema.safeParse(result);
}

const registerGuestSchema = z.object({
	auth_info: z.object({
		token: z.string()
	}),
	debugger: z.object({
		active_with_guest_card: z.array(
			z.object({
				card_id: z.string()
			})
		)
	})
});

export async function registerGuest(cid: string) {
	const url = new URL(`/card-service/api/card/register/validate`, CSTD_BASE_URL);
	const result = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			CID: cid,
			TYPE: 'GUEST'
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const body = await result.json();
	return registerGuestSchema.safeParse(body);
}
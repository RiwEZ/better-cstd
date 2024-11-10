import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { reservationList, reservationSlot } from './cstd';
import { BENCHAKITI_TABLE_TENNIS_UUID } from '$env/static/private';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function reservationInfo(token: string, uuid: string, date: dayjs.Dayjs) {
	const tables = await reservationList(token, uuid);
	if (!tables.success) {
		return [];
	}

	const l = await Promise.all(
		tables.data.map(async (table) => {
			const slots = await reservationSlot(token, table.ID, date);
			if (!slots.success) {
				throw new Error('The result reservationSlot structure is not as expected');
			}

			return slots.data.map((slot) => {
				return {
					start: slot.START_TIME,
					end: slot.END_TIME,
					available: new Set<string>(slot.IS_FULL ? [] : [slot.ID])
				};
			});
		})
	);

	const result = l
		.reduce((acc, curr) => {
			if (acc.length != curr.length) {
				throw new Error('The number of slots should be equal');
			}

			return Array.from({ length: acc.length }).map((_, i) => ({
				start: acc[i].start,
				end: acc[i].end,
				available: acc[i].available.union(curr[i].available)
			}));
		})
		.map((item) => ({ ...item, available: Array.from(item.available) }));

	return result;
}

export async function tableTennisReservationInfo(token: string) {
	const now = dayjs().tz('Asia/Bangkok');
	const result = await Promise.all(
		Array.from({ length: 5 }).map(async (_, i) => {
			const date = now.add(i, 'd');
			const info = await reservationInfo(token, BENCHAKITI_TABLE_TENNIS_UUID, date);
			return { info, date: date.format('YYYY-MM-DD') };
		})
	);
	return result;
}

export type TableTennisReservationInfo = ReturnType<typeof tableTennisReservationInfo>;

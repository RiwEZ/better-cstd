import dayjs from 'dayjs';
import { reservationList, reservationSlot } from './cstd';

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
				if (!slot.IS_FULL) {
					return {
						start: slot.START_TIME,
						end: slot.END_TIME,
						available: new Set<string>([slot.ID])
					};
				}
				return { start: slot.START_TIME, end: slot.END_TIME, available: new Set<string>() };
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

export async function tableTennis3DaysReservationInfo(token: string) {
	const now = dayjs();
	const result = await Promise.all(
		Array.from({ length: 3 }).map((_, i) => {
			return reservationInfo(token, 'dea4697e-8e96-4fe2-b37a-93b763f85a8d', now.add(i, 'd'));
		})
	);
	return result;
}

export type TableTenni3DaysReservationInfos = ReturnType<typeof tableTennis3DaysReservationInfo>;

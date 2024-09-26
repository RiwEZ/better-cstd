<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import dayjs from 'dayjs';

	export let data: PageData;

	const handleReserve = async (available: string[], bookingDate: string) => {
		if (available.length === 0) {
			return;
		}

		// This should run on the browser, so it should default to local time
		const availableTime = dayjs(bookingDate).hour(6);
		const scheduled = dayjs().diff(availableTime) < 0;

		const resp = await fetch('/bff/table-tennis', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				slotId: available.pop(),
				bookingDate,
				scheduled
			})
		});

		if (resp.status === 200) {
			const message = scheduled ? 'Scheduled Reserve!!!' : 'Reserved!!!';
			alert(message);
		} else {
			alert("Can't reserve this slot, something wrong");
		}
		return;
	};
</script>

<h1 class="text-center text-xl font-bold mt-2">Benchakiti Park, Table Tennis</h1>
<div class="flex flex-row space-x-4 justify-center mt-2">
	{#each data.tableTennis as day}
		<div>
			<h2 class="text-lg font-bold">{day.date}</h2>
			{#each day.info as info}
				<div class="grid grid-rows-3 grid-cols-1">
					<p>{info.start} - {info.end}</p>
					<p>Available: {info.available.length}</p>
					<Button
						size="sm"
						disabled={info.available.length === 0}
						on:click={() => handleReserve(info.available, day.date)}>Reserve</Button
					>
				</div>
				<Separator class="mt-2" />
			{/each}
		</div>
	{/each}
</div>

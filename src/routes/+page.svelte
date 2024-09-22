<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	export let data: PageData;

	const handleReserve = async (
		available: string[],
		bookingDate: string,
		scheduleReserve: boolean
	) => {
		if (available.length === 0) {
			return;
		}

		const resp = await fetch('/bff/table-tennis', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				slotId: available.pop(),
				bookingDate,
				scheduleReserve
			})
		});

		if (resp.status === 200) {
			alert('Reserved!!!');
		} else {
			alert("Can't reserve this slot, something wrong");
		}
		return;
	};
</script>

<h1 class="text-center text-xl font-bold mt-2">Benchakiti Park, Table Tennis</h1>
<div class="flex justify-center">
	{#each data.jobs as job}
		{job.name}
	{/each}
</div>
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
						on:click={() => handleReserve(info.available, day.date, day.scheduleReserve)}
						>Reserve</Button
					>
				</div>
				<Separator class="mt-2" />
			{/each}
		</div>
	{/each}
</div>
